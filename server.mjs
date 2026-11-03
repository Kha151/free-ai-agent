import http from "http";
import fs from "fs/promises";
import path from "path";
import { AIAgent, AGENT_MODES } from "./agent.mjs";
import { learnFromDocument } from "./knowledgeTools.mjs";

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.resolve(process.cwd(), "public");
const UPLOADS_DIR = path.resolve(process.cwd(), "knowledge", "uploads");

// Đảm bảo thư mục uploads tồn tại
await fs.mkdir(UPLOADS_DIR, { recursive: true });

// Khởi tạo Agent instance
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("⚠️ Cảnh báo: Chưa tìm thấy GEMINI_API_KEY trong file .env!");
}
const agent = new AIAgent(apiKey || "DUMMY_KEY");

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

  // 1. Static Files (Giao diện web ChatGPT/Gemini style)
  if (req.method === "GET") {
    let filePath = path.join(PUBLIC_DIR, parsedUrl.pathname === "/" ? "index.html" : parsedUrl.pathname);
    try {
      const data = await fs.readFile(filePath);
      const ext = path.extname(filePath);
      const mimeTypes = {
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "application/javascript; charset=utf-8",
        ".json": "application/json",
        ".png": "image/png",
        ".svg": "image/svg+xml",
      };
      res.writeHead(200, { "Content-Type": mimeTypes[ext] || "text/plain" });
      res.end(data);
      return;
    } catch {
      // 404
    }
  }

  // 2. API Modes list (/api/modes)
  if (req.method === "GET" && parsedUrl.pathname === "/api/modes") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      activeMode: agent.mode,
      modes: AGENT_MODES
    }));
    return;
  }

  // 3. API Chat (/api/chat)
  if (req.method === "POST" && parsedUrl.pathname === "/api/chat") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      try {
        const { message, mode } = JSON.parse(body || "{}");
        if (!message) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Message is required." }));
          return;
        }

        if (mode && mode !== agent.mode && AGENT_MODES[mode]) {
          agent.setMode(mode);
        }

        const initialHistoryLength = agent.history.length;
        const responseText = await agent.processUserMessage(message);

        // Thu thập các tool calls đã chạy trong lượt này
        const toolCalls = [];
        for (let i = initialHistoryLength; i < agent.history.length; i++) {
          const item = agent.history[i];
          if (item && item.parts) {
            for (const part of item.parts) {
              if (part.functionCall) {
                toolCalls.push(part.functionCall);
              }
            }
          }
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          response: responseText,
          activeModel: agent.activeModel,
          activeMode: agent.mode,
          activeModeConfig: AGENT_MODES[agent.mode],
          toolCalls
        }));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          error: err.message,
          activeModel: agent.activeModel,
          activeMode: agent.mode
        }));
      }
    });
    return;
  }

  // 4. API Reset / Switch Mode (/api/reset)
  if (req.method === "POST" && parsedUrl.pathname === "/api/reset") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      try {
        const { mode } = JSON.parse(body || "{}");
        agent.history = [];
        if (mode && AGENT_MODES[mode]) {
          agent.setMode(mode);
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          success: true,
          message: "Chat history cleared.",
          activeMode: agent.mode,
          activeModeConfig: AGENT_MODES[agent.mode]
        }));
      } catch (err) {
        agent.history = [];
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, message: "Chat history cleared.", activeMode: agent.mode }));
      }
    });
    return;
  }

  // 4. API Upload Document (/api/upload)
  if (req.method === "POST" && parsedUrl.pathname === "/api/upload") {
    const chunks = [];
    req.on("data", chunk => chunks.push(chunk));
    req.on("end", async () => {
      try {
        const buffer = Buffer.concat(chunks);
        const contentType = req.headers["content-type"] || "";
        const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
        
        let filename = `upload-${Date.now()}.bin`;
        let fileData = buffer;

        if (boundaryMatch) {
          const boundary = boundaryMatch[1] || boundaryMatch[2];
          // Trích xuất filename và body từ multipart
          const headerEnd = buffer.indexOf("\r\n\r\n");
          if (headerEnd !== -1) {
            const headerStr = buffer.slice(0, headerEnd).toString("utf-8");
            const fnMatch = headerStr.match(/filename="([^"]+)"/);
            if (fnMatch) filename = fnMatch[1];
            
            const rawBody = buffer.slice(headerEnd + 4);
            const boundaryIndex = rawBody.lastIndexOf(`--${boundary}`);
            fileData = boundaryIndex !== -1 ? rawBody.slice(0, boundaryIndex - 2) : rawBody;
          }
        }

        const safeFilename = path.basename(filename).replace(/[^a-zA-Z0-9._\-]/g, "_");
        const savePath = path.join(UPLOADS_DIR, safeFilename);
        await fs.writeFile(savePath, fileData);

        // Gọi ngay hàm learnFromDocument để nạp vào tri thức
        const learnResult = JSON.parse(await learnFromDocument({
          filePath: path.relative(process.cwd(), savePath),
          title: filename
        }));

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          success: !learnResult.error,
          filePath: path.relative(process.cwd(), savePath),
          filename,
          wordCount: learnResult.wordCount,
          error: learnResult.error
        }));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("404 Not Found");
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`   🌐 Khakhapkhun AI Web App (Gemini / ChatGPT Style)`);
  console.log(`   URL: http://localhost:${PORT}`);
  console.log(`   Mô hình khởi động: ${agent.activeModel}`);
  console.log(`======================================================\n`);
});


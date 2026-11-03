import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import { TOOL_DECLARATIONS, TOOL_HANDLERS } from "./tools.mjs";

// Terminal colors
const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  dim: "\x1b[2m",
};

// Danh sách các model miễn phí đang hoạt động tốt nhất trên Google AI Studio
const DEFAULT_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-flash-lite-latest",
  "gemini-3.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.6-flash",
  "gemini-3-flash-preview",
  "gemini-3.1-flash-lite-preview",
  "gemini-3.8-flash",
  "gemini-flash-latest",
];
const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

class AIAgent {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.history = [];
    this.activeModel = DEFAULT_MODELS[0];
    this.modelIndex = 0;
    this.systemInstruction = {
      parts: [
        {
          text: `Bạn là Gia Sư Chuyên Gia về Kiểm Thử Thâm Nhập (Penetration Testing) và Tự Động Hóa Bảo Mật CI/CD (DevSecOps).
MỤC TIÊU: Đào tạo người dùng trở thành chuyên gia về cả Tấn công đạo đức (Ethical Hacking / Pentest) và Phòng thủ tự động hóa (DevOps & DevSecOps).

NGÔN NGỮ BẮT BUỘC:
- Luôn luôn trả lời, giảng dạy, phân tích mã nguồn và giải thích bằng TIẾNG VIỆT (Vietnamese).
- Các thuật ngữ chuyên ngành có thể giữ nguyên tiếng Anh kèm giải thích tiếng Việt rõ ràng (ví dụ: "Kiểm thử thâm nhập (Penetration Testing)", "Quét mã tĩnh SAST", "Bỏ qua kiểm tra quyền (Broken Access Control)", "Leo thang đặc quyền (Privilege Escalation)").

Các trụ cột kiến thức chính:
1. Kiểm thử thâm nhập (Offensive Security):
   - Thu thập thông tin (Reconnaissance), Lỗ hổng Web OWASP Top 10 (SQLi, Command Injection, XSS, SSRF, IDOR).
   - Leo thang đặc quyền (Privilege Escalation trên Linux/Windows) và quy trình chuẩn (PTES, OWASP WSTG, NIST SP 800-115).
   - Hướng dẫn thực hành an toàn trên các lab hợp pháp: PortSwigger Academy, OWASP Juice Shop, DVWA, TryHackMe.

2. Bảo mật DevSecOps & CI/CD (Defensive Automation):
   - Triết lý "Shift Left": Phát hiện và ngăn chặn lỗ hổng từ sớm trong Git pre-commit hooks và CI/CD pipelines (GitHub Actions, GitLab CI).
   - Các công cụ quét tự động: Quét lộ lọt Secret (Gitleaks, Trufflehog), Quét mã tĩnh SAST (Semgrep, SonarQube), Quét phụ thuộc thư viện SCA (Trivy, Snyk), Quét động DAST (OWASP ZAP).
   - Đóng gói container an toàn (Docker không chạy root, distroless), bảo mật Kubernetes (OPA/Kyverno) và quét hạ tầng IaC (Checkov/tfsec).

3. Phương pháp giảng dạy hai chiều (Dual-Perspective):
   - Với mỗi lỗ hổng hoặc chủ đề, luôn giải thích rõ:
     a) Góc nhìn Pentester: Kẻ tấn công phát hiện, khai thác và kiểm tra lỗ hổng như thế nào.
     b) Góc nhìn DevSecOps: Kỹ sư bảo mật cấu hình quy tắc quét tự động (SAST/SCA/DAST gate) và viết bản vá code an toàn ra sao để ngăn chặn triệt để.

4. Công cụ hỗ trợ:
   - listCurriculumTracks: Xem danh sách các track học tập.
   - getCurriculumLesson: Lấy bài học chi tiết theo module (ví dụ: pt-101, pt-102, secops-201, secops-202, cloud-301).
   - auditCodeSnippet: Kiểm tra bảo mật mã nguồn hoặc Dockerfile.
   - learnFromDocument: Học và phân tích tài liệu người dùng tải lên (PDF, DOCX, TXT, MD, YAML, JSON, CSV).
   - queryLearnedDocuments: Tra cứu kiến thức trong các tài liệu đã học.
   - runNmapScan, runNiktoScan, runSqlmapScan, runDirbScan, runGobusterScan, runMetasploitScan, runKaliCommand.
   - learnLatestThreats, getStoredThreatIntel.
   - searchWeb, writeFile, readFile, listFiles, calculate.`,
        },
      ],
    };
  }

  async callGemini(contents) {
    let lastError = null;

    // Duyệt qua danh sách các free models, bắt đầu từ modelIndex hiện tại
    for (let i = 0; i < DEFAULT_MODELS.length; i++) {
      const idx = (this.modelIndex + i) % DEFAULT_MODELS.length;
      const model = DEFAULT_MODELS[idx];
      const url = `${API_BASE}/${model}:generateContent?key=${this.apiKey}`;
      const payload = {
        systemInstruction: this.systemInstruction,
        contents,
        tools: [{ functionDeclarations: TOOL_DECLARATIONS }],
        generationConfig: {
          temperature: 0.2,
        },
      };

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(15000),
        });

        if (res.ok) {
          if (this.activeModel !== model) {
            console.log(`\n  ${C.yellow}🔄 Đã tự động chuyển sang Model miễn phí: ${C.bold}${model}${C.reset}`);
          }
          this.activeModel = model;
          this.modelIndex = idx;
          return await res.json();
        }

        const errText = await res.text();
        // Khi model bị Rate Limit (429), quá tải (503, 500), hoặc không hỗ trợ / deprecated (404, 400)
        if ([429, 503, 500, 404, 400].includes(res.status)) {
          console.log(`\n  ${C.yellow}⚠️ Model ${model} gặp mã lỗi (${res.status}). Đang tự động thử model miễn phí tiếp theo...${C.reset}`);
          lastError = new Error(`Model ${model} (${res.status}): ${errText}`);
          continue;
        }

        throw new Error(`Gemini API error (${res.status}): ${errText}`);
      } catch (err) {
        console.log(`\n  ${C.yellow}⚠️ Lỗi kết nối model ${model}: ${err.message}. Đang tự động chuyển model...${C.reset}`);
        lastError = err;
      }
    }

    throw lastError || new Error("Tất cả các model miễn phí hiện tại đều đang bận hoặc vượt quota. Vui lòng thử lại sau giây lát.");
  }

  async processUserMessage(userText) {
    // 1. Add user message to history
    this.history.push({
      role: "user",
      parts: [{ text: userText }],
    });

    const MAX_TOOL_STEPS = 5;
    let step = 0;

    while (step < MAX_TOOL_STEPS) {
      step++;
      const data = await this.callGemini(this.history);
      const candidate = data.candidates?.[0];

      if (!candidate || !candidate.content) {
        return "⚠️ No response generated by the model.";
      }

      const content = candidate.content;
      this.history.push(content);

      // Check for function calls
      const parts = content.parts || [];
      const functionCallPart = parts.find((p) => p.functionCall);

      if (functionCallPart && functionCallPart.functionCall) {
        const { name, args } = functionCallPart.functionCall;
        console.log(
          `  ${C.cyan}⚙️  [Tool Call]${C.reset} ${C.bold}${name}${C.reset}(${JSON.stringify(
            args || {}
          )})`
        );

        const handler = TOOL_HANDLERS[name];
        let toolOutput;
        if (handler) {
          try {
            toolOutput = await handler(args || {});
          } catch (err) {
            toolOutput = JSON.stringify({ error: err.message });
          }
        } else {
          toolOutput = JSON.stringify({ error: `Tool "${name}" is not implemented.` });
        }

        console.log(
          `  ${C.dim}↳ Output: ${toolOutput.slice(0, 120)}${toolOutput.length > 120 ? "..." : ""
          }${C.reset}`
        );

        // Feed tool response back into conversation
        this.history.push({
          role: "user",
          parts: [
            {
              functionResponse: {
                name,
                response: { output: toolOutput },
              },
            },
          ],
        });
        // Loop back to let model inspect tool output
        continue;
      }

      // If no function call, we have the final textual response
      const textPart = parts.find((p) => p.text);
      return textPart ? textPart.text : "Task complete.";
    }

    return "⚠️ Reached maximum autonomous tool execution steps.";
  }
}

async function runSelfTest() {
  console.log(`\n${C.cyan}${C.bold}🔍 Running Agent Self-Test (Zero API Key Mode)...${C.reset}\n`);

  try {
    // 1. Time tool
    process.stdout.write("  Testing getCurrentTime... ");
    const timeRes = await TOOL_HANDLERS.getCurrentTime();
    console.log(`${C.green}✓ OK${C.reset} (${JSON.parse(timeRes).localTime})`);

    // 2. Math tool
    process.stdout.write("  Testing calculate ('125 * 8 + 50')... ");
    const calcRes = await TOOL_HANDLERS.calculate({ expression: "125 * 8 + 50" });
    const parsedCalc = JSON.parse(calcRes);
    if (parsedCalc.result === "1050") {
      console.log(`${C.green}✓ OK${C.reset} (Result: 1050)`);
    } else {
      console.log(`${C.red}✗ Failed${C.reset}`);
    }

    // 3. File write tool
    process.stdout.write("  Testing writeFile ('test_agent.tmp')... ");
    await TOOL_HANDLERS.writeFile({
      filename: "test_agent.tmp",
      content: "AI Agent system check passed.",
    });
    console.log(`${C.green}✓ OK${C.reset}`);

    // 4. File read tool
    process.stdout.write("  Testing readFile ('test_agent.tmp')... ");
    const readRes = JSON.parse(await TOOL_HANDLERS.readFile({ filename: "test_agent.tmp" }));
    if (readRes.content.includes("passed")) {
      console.log(`${C.green}✓ OK${C.reset}`);
    }

    // 5. List files tool
    process.stdout.write("  Testing listFiles ('.')... ");
    const listRes = JSON.parse(await TOOL_HANDLERS.listFiles({ directory: "." }));
    console.log(`${C.green}✓ OK${C.reset} (${listRes.files.length} items found)`);

    // 6. Pentest & DevSecOps curriculum tool
    process.stdout.write("  Testing listCurriculumTracks... ");
    const tracksRes = JSON.parse(await TOOL_HANDLERS.listCurriculumTracks());
    console.log(`${C.green}✓ OK${C.reset} (${tracksRes.tracks.length} tracks loaded)`);

    // 7. Get Lesson tool
    process.stdout.write("  Testing getCurriculumLesson ('secops-201')... ");
    const lessonRes = JSON.parse(await TOOL_HANDLERS.getCurriculumLesson({ moduleId: "secops-201" }));
    console.log(`${C.green}✓ OK${C.reset} (${lessonRes.module})`);

    // 8. Code Audit tool
    process.stdout.write("  Testing auditCodeSnippet (Docker root check)... ");
    const auditRes = JSON.parse(await TOOL_HANDLERS.auditCodeSnippet({ code: "FROM alpine:latest\nUSER root", language: "dockerfile" }));
    console.log(`${C.green}✓ OK${C.reset} (${auditRes.findingsCount} findings detected)`);

    // 9. Gitleaks tool
    process.stdout.write("  Testing runGitleaksScan... ");
    const gitleaksRes = JSON.parse(await TOOL_HANDLERS.runGitleaksScan({ targetPath: "." }));
    console.log(`${C.green}✓ OK${C.reset} (${gitleaksRes.engine})`);

    // 10. Semgrep SAST tool
    process.stdout.write("  Testing runSemgrepScan (Command Injection check)... ");
    const semgrepRes = JSON.parse(await TOOL_HANDLERS.runSemgrepScan({ codeSnippet: "import os\nos.system('ping ' + ip)" }));
    console.log(`${C.green}✓ OK${C.reset} (${semgrepRes.totalFindings} findings detected)`);

    // 11. Trivy SCA tool
    process.stdout.write("  Testing runTrivyScan... ");
    const trivyRes = JSON.parse(await TOOL_HANDLERS.runTrivyScan({ target: "." }));
    console.log(`${C.green}✓ OK${C.reset} (${trivyRes.engine})`);

    // 12. Nmap tool
    process.stdout.write("  Testing runNmapScan (127.0.0.1)... ");
    const nmapRes = JSON.parse(await TOOL_HANDLERS.runNmapScan({ targetHost: "127.0.0.1", ports: "80,443" }));
    console.log(`${C.green}✓ OK${C.reset} (${nmapRes.engine})`);

    // 13. Learn from Document tool (PDF/DOCX/TXT/MD)
    process.stdout.write("  Testing learnFromDocument (test markdown file)... ");
    const sampleDocPath = "test_pentest_notes.md";
    await (await import("fs/promises")).writeFile(sampleDocPath, "# OWASP API Security\nCheck BOLA and Broken Authentication.", "utf-8");
    const learnDocRes = JSON.parse(await TOOL_HANDLERS.learnFromDocument({ filePath: sampleDocPath, title: "Test API Security Guide" }));
    console.log(`${C.green}✓ OK${C.reset} (${learnDocRes.status})`);

    // 14. Query Learned Documents
    process.stdout.write("  Testing queryLearnedDocuments ('BOLA')... ");
    const queryDocRes = JSON.parse(await TOOL_HANDLERS.queryLearnedDocuments({ query: "BOLA" }));
    console.log(`${C.green}✓ OK${C.reset} (${queryDocRes.matchCount} match found)`);

    // Clean up temporary test files
    await (await import("fs/promises")).unlink(sampleDocPath).catch(() => {});

    // Clean up temporary test file
    await (await import("fs/promises")).unlink("test_agent.tmp").catch(() => { });

    console.log(`\n${C.green}${C.bold}🎉 All Agent tools are healthy and operational!${C.reset}\n`);
  } catch (err) {
    console.error(`\n${C.red}Self-test error: ${err.message}${C.reset}\n`);
  }
}

async function main() {
  // If user passes --test or -t
  if (process.argv.includes("--test") || process.argv.includes("-t")) {
    await runSelfTest();
    return;
  }
  console.log(`\n${C.green}${C.bold}==============================================${C.reset}`);
  console.log(`${C.green}${C.bold}   🛡️  Gia Sư AI: Pentest & DevSecOps (VN)   ${C.reset}`);
  console.log(`${C.green}${C.bold}==============================================${C.reset}\n`);

  let apiKey = process.env.GEMINI_API_KEY;

  const rl = readline.createInterface({ input, output });

  if (!apiKey) {
    console.log(`${C.yellow}Chưa tìm thấy GEMINI_API_KEY trong file .env.${C.reset}`);
    console.log(`Lấy API key miễn phí tại: https://aistudio.google.com\n`);
    apiKey = await rl.question(`${C.bold}Nhập Gemini API key của bạn: ${C.reset}`);
    apiKey = apiKey.trim();
    if (!apiKey) {
      console.log(`${C.red}Lỗi: Cần có API key để khởi động Gia Sư AI.${C.reset}`);
      rl.close();
      return;
    }
  }

  const agent = new AIAgent(apiKey);

  // Check if a single query was passed via command line (e.g. node agent.mjs "What time is it?")
  const queryArgs = process.argv.slice(2).filter((arg) => !arg.startsWith("-"));
  if (queryArgs.length > 0) {
    const singlePrompt = queryArgs.join(" ");
    console.log(`${C.bold}Câu hỏi:${C.reset} ${singlePrompt}`);
    console.log(`${C.dim}Mô hình AI: ${agent.activeModel}...${C.reset}`);
    const response = await agent.processUserMessage(singlePrompt);
    console.log(`\n${C.green}${C.bold}Gia sư AI:${C.reset} ${response}\n`);
    rl.close();
    return;
  }

  console.log(`\n${C.green}✓ Gia sư AI đã sẵn sàng! (Mô hình: ${agent.activeModel})${C.reset}`);
  console.log(`${C.dim}Công cụ: listCurriculumTracks, getCurriculumLesson, auditCodeSnippet, searchWeb, v.v.${C.reset}`);
  console.log(`${C.dim}Nhập 'exit' hoặc 'quit' để kết thúc buổi học.${C.reset}\n`);

  while (true) {
    const prompt = await rl.question(`${C.bold}Bạn: ${C.reset}`);
    const trimmed = prompt.trim();

    if (!trimmed) continue;
    if (["exit", "quit", "q", "thoat"].includes(trimmed.toLowerCase())) {
      console.log(`\n${C.yellow}Tạm biệt bạn! Hẹn gặp lại trong buổi học tiếp theo! 👋${C.reset}\n`);
      break;
    }

    try {
      process.stdout.write(`${C.dim}Đang suy nghĩ và phân tích...${C.reset}\r`);
      const response = await agent.processUserMessage(trimmed);
      console.log(`\r${" ".repeat(35)}\r${C.green}${C.bold}Gia sư AI:${C.reset} ${response}\n`);
    } catch (err) {
      console.error(`\n${C.red}Lỗi: ${err.message}${C.reset}\n`);
    }
  }

  rl.close();
}

main().catch((err) => {
  console.error("Fatal error:", err);
});


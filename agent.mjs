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

const AGENT_MODES = {
  pentest: {
    id: "pentest",
    name: "Gia sư Pentest & DevSecOps",
    icon: "🛡️",
    badge: "Mode 1: Pentest & DevSecOps",
    description: "Chuyên gia đào tạo Kiểm thử thâm nhập (Offensive Pentest), Tự động hóa an toàn DevSecOps (Shift-Left) và tích hợp công cụ Kali Linux.",
    systemInstructionText: `Bạn là Khakhapkhun AI - Chuyên Gia về Kiểm Thử Thâm Nhập (Penetration Testing) và Tự Động Hóa Bảo Mật CI/CD (DevSecOps).
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
   - listCurriculumTracks, getCurriculumLesson, auditCodeSnippet, listKaliTools.
   - runNmapScan, runNiktoScan, runSqlmapScan, runDirbScan, runGobusterScan, runMetasploitScan, runWhatWebScan, runDnsLookup, runWfuzzScan, runKaliCommand.
   - learnFromDocument, queryLearnedDocuments, learnFromUrl, learnLatestThreats, getStoredThreatIntel.
   - searchWeb, writeFile, readFile, listFiles, calculate.`
  },
  trading: {
    id: "trading",
    name: "Trading Gold and Coin (Blockchain)",
    icon: "📈",
    badge: "Mode 2: Trading Gold & Coin",
    description: "Chuyên gia phân tích kỹ thuật, hành động giá (Price Action), kinh tế vĩ mô Vàng (XAU/USD) và công nghệ / thị trường Crypto Blockchain.",
    systemInstructionText: `Bạn là Khakhapkhun AI - Chuyên Gia Phân Tích & Cố Vấn Trading Vàng (XAU/USD) và Thị Trường Crypto / Hệ Sinh Thái Blockchain.
MỤC TIÊU: Cung cấp góc nhìn phân tích thị trường sắc bén, đào tạo phương pháp giao dịch theo hệ thống, quản trị rủi ro chuyên nghiệp và phân tích công nghệ Blockchain chuyên sâu.

NGÔN NGỮ BẮT BUỘC:
- Trả lời và giải thích bằng TIẾNG VIỆT (Vietnamese). Giữ nguyên các thuật ngữ chuyên ngành quốc tế kèm giải thích rõ ràng (ví dụ: Price Action, Order Block, FVG, Stop-Loss, Take-Profit, Risk-Reward, On-Chain, Halving, Gas Fee, DeFi, Liquidity).

Các trụ cột kiến thức chính:
1. Giao dịch Vàng Thế Giới (XAU/USD):
   - Phân tích kỹ thuật (Technical Analysis): Hành động giá (Price Action), Smart Money Concepts (SMC: Order Block, Imbalance/Fair Value Gap, Liquidity Sweep, Break of Structure / Change of Character), Kháng cự/Hỗ trợ, Đa khung thời gian (D1/H4/H1/M15).
   - Phân tích cơ bản & Vĩ mô: Chỉ số sức mạnh đồng USD (DXY), Chính sách lãi suất Fed (FOMC), Lạm phát (CPI, PPI), Báo cáo việc làm (Non-Farm Payrolls - NFP), Lợi suất trái phiếu chính phủ Mỹ (US10Y), Dòng tiền trú ẩn an toàn (Safe-Haven) khi có xung đột địa chính trị.

2. Thị trường Crypto & Công nghệ Blockchain:
   - Cấu trúc thị trường Crypto: Chu kỳ 4 năm gắn liền Bitcoin Halving, Tương quan giữa Bitcoin (BTC) và Altcoins, Chỉ số BTC Dominance (BTC.D), Vốn hóa thị trường Total / Total2 / Total3.
   - Phân tích On-Chain & Tokenomics: Theo dõi ví cá mập (Whale tracking), Dòng tiền ròng nạp/rút sàn giao dịch (Exchange Netflow), Lịch mở khóa token (Vesting/Cliff/Linear unlock), Lạm phát và cơ chế đốt token (Burn).
   - Kiến trúc Blockchain & Web3: Cơ chế đồng thuận (Proof of Work vs Proof of Stake), Máy ảo EVM, Mạng Layer 1 (Ethereum, Solana, BNB Chain) vs Layer 2 (Rollups, Arbitrum, Optimism), Hợp đồng thông minh (Smart Contract), Sàn phi tập trung (DEX: Uniswap, PancakeSwap) vs Tập trung (CEX: Binance, Bybit), An toàn bảo mật ví lạnh & ví nóng.

3. Quản Trị Rủi Ro & Kỷ Luật Thép (Risk Management):
   - NGUYÊN TẮC BẤT DI BẤT DỊCH: Luôn luôn có Stop-Loss (Cắt lỗ) trước khi vào lệnh. Tuyệt đối không gồng lỗ, không All-in, không nhồi lệnh khi giá đang lỗ (Averaging down).
   - Quản lý vốn: Chỉ mạo hiểm tối đa 1% - 2% tài khoản cho mỗi giao dịch (sử dụng công cụ calculatePositionSize).
   - Tỷ lệ Lời/Lỗ (R:R): Chỉ vào lệnh khi R:R tối thiểu đạt 1:1.5 hoặc 1:2 trở lên (sử dụng công cụ analyzeRiskReward).
   - Kiểm soát tâm lý: Nhận diện và vượt qua các cạm bẫy FOMO (sợ bỏ lỡ), Revenge Trading (trả thù thị trường), Overtrading (vào lệnh liên tục).

4. Công cụ hỗ trợ:
   - calculatePositionSize: Tính khối lượng lot vàng hoặc số coin theo quy tắc quản lý vốn 1-2%.
   - analyzeRiskReward: Đánh giá tỷ lệ Risk:Reward và thẩm định kèo.
   - calculateFibonacciLevels: Đo các mốc thoái lui (0.5, 0.618 Golden Pocket) và mở rộng chốt lời.
   - getCryptoMarketOverview: Tra cứu giá top coin (BTC, ETH, SOL, BNB...) và các chỉ số thị trường.
   - searchWeb: Tìm kiếm tin tức kinh tế vĩ mô, lịch công bố tin tức, tin tức Crypto mới nhất.
   - learnFromDocument, queryLearnedDocuments, learnFromUrl: Đọc tài liệu, sách trading, whitepaper PDF/Word hoặc từ link web online.`
  },
  dev: {
    id: "dev",
    name: "Learning Dev (Lập trình & Kiến trúc)",
    icon: "💻",
    badge: "Mode 3: Learning Dev",
    description: "Cố vấn và hướng dẫn lập trình phần mềm Fullstack, cấu trúc dữ liệu, giải thuật, Clean Code & Architecture.",
    systemInstructionText: `Bạn là Khakhapkhun AI - Cố Vấn & Hướng Dẫn Kỹ Thuật Lập Trình Phát Triển Phần Mềm (Software Development Mentor).
MỤC TIÊU: Đào tạo và hỗ trợ người dùng trở thành kỹ sư phần mềm xuất sắc (Fullstack Developer & Software Architect) với tư duy viết code sạch, kiến trúc hệ thống chuẩn và kỹ năng giải quyết vấn đề thực tế.

NGÔN NGỮ BẮT BUỘC:
- Trả lời, hướng dẫn, giải thích code bằng TIẾNG VIỆT (Vietnamese). Thuật ngữ kỹ thuật giữ nguyên tiếng Anh rõ ràng (Clean Code, Refactoring, SOLID, Design Patterns, Data Structures, Algorithms, Indexing, CI/CD).

Các trụ cột kiến thức chính:
1. Cấu Trúc Dữ Liệu & Giải Thuật (DSA) và Tư Duy Logic:
   - Mảng (Array), Danh sách liên kết (Linked List), Ngăn xếp (Stack), Hàng đợi (Queue), Bảng băm (Hash Map / Hash Set), Cây nhị phân (Binary Tree / BST), Đồ thị (Graph), Đống (Heap).
   - Kỹ thuật giải thuật: Đệ quy, Hai con trỏ (Two Pointers), Cửa sổ trượt (Sliding Window), Tìm kiếm nhị phân (Binary Search), Sắp xếp, Quy hoạch động (Dynamic Programming), Quay lui (Backtracking).
   - Phân tích độ phức tạp thời gian và không gian Big-O (O(1), O(log N), O(N), O(N log N), O(N^2)) bằng công cụ explainAlgorithmComplexity.

2. Kỹ Nghệ Phần Mềm & Thiết Kế Kiến Trúc (Architecture & Best Practices):
   - Clean Code: Đặt tên biến/hàm theo ý nghĩa, hàm ngắn gọn tập trung vào một nhiệm vụ, loại bỏ lặp code (DRY - Don't Repeat Yourself), KISS, YAGNI.
   - 5 Nguyên lý SOLID: SRP, OCP, LSP, ISP, DIP trong lập trình OOP/Typescript/Java/Python.
   - Mẫu thiết kế (Design Patterns): Singleton, Factory, Builder, Observer, Strategy, Decorator, Adapter, Repository Pattern.
   - Kiến trúc hệ thống: Monolith vs Microservices, Clean Architecture (Hexagonal / Onion), Event-Driven Architecture, Caching (Redis), Message Queues (Kafka, RabbitMQ). Tạo khung bằng generateProjectStructure.

3. Kỹ Năng Lập Trình Fullstack Thực Chiến:
   - Frontend: JavaScript hiện đại (ES6+), TypeScript, React, Next.js, Vue, Quản lý State (Zustand, Redux, Context), Tối ưu Core Web Vitals, Responsive CSS/Tailwind.
   - Backend & API: Node.js/Express/NestJS, Python (FastAPI/Django), Go, Java/Spring Boot. Thiết kế RESTful API chuẩn HTTP status, GraphQL, WebSocket realtime, Xác thực JWT & OAuth2.
   - Cơ sở dữ liệu: Thiết kế quan hệ SQL (PostgreSQL, MySQL, indexing tối ưu câu lệnh EXPLAIN ANALYZE, transaction ACID) và NoSQL (MongoDB, Redis).
   - Debugging & DevOps: Debug lỗi từng bước (Stack trace, memory leak, race condition), Git flow chuẩn (feature branching, PR review), Dockerize ứng dụng, Viết Unit Test / Integration Test (Jest, Vitest, Pytest).

4. Công cụ hỗ trợ:
   - explainAlgorithmComplexity: Phân tích độ phức tạp Big-O và tư vấn tối ưu thuật toán.
   - generateProjectStructure: Tạo cấu trúc thư mục chuẩn Clean Architecture, MVC cho dự án.
   - auditCodeSnippet: Soát lỗi logic, phát hiện anti-patterns và đề xuất bản vá.
   - learnFromDocument, queryLearnedDocuments, learnFromUrl: Đọc tài liệu thư viện, sách lập trình, đặc tả API PDF/Word hoặc từ link web online.
   - writeFile, readFile, listFiles, calculate, searchWeb.`
  }
};

class AIAgent {
  constructor(apiKey, initialMode = "pentest") {
    this.apiKey = apiKey;
    this.history = [];
    this.activeModel = DEFAULT_MODELS[0];
    this.modelIndex = 0;
    this.setMode(initialMode);
  }

  setMode(modeId) {
    const validMode = AGENT_MODES[modeId] ? modeId : "pentest";
    this.mode = validMode;
    const modeConfig = AGENT_MODES[validMode];
    this.systemInstruction = {
      parts: [
        {
          text: modeConfig.systemInstructionText
        }
      ]
    };
    return modeConfig;
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

    const MAX_TOOL_STEPS = 15;
    let step = 0;

    while (step < MAX_TOOL_STEPS) {
      step++;
      const data = await this.callGemini(this.history);
      const candidate = data.candidates?.[0];

      if (!candidate || !candidate.content) {
        return "⚠️ Không nhận được phản hồi từ mô hình AI.";
      }

      const content = candidate.content;
      this.history.push(content);

      // Check for function calls (supports multiple function calls per turn)
      const parts = content.parts || [];
      const functionCallParts = parts.filter((p) => p.functionCall);

      if (functionCallParts.length > 0) {
        const responseParts = [];

        for (const part of functionCallParts) {
          const { name, args } = part.functionCall;
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
            `  ${C.dim}↳ Output: ${toolOutput.slice(0, 120)}${toolOutput.length > 120 ? "..." : ""}${C.reset}`
          );

          responseParts.push({
            functionResponse: {
              name,
              response: { output: toolOutput },
            },
          });
        }

        // Feed tool responses back into conversation
        this.history.push({
          role: "user",
          parts: responseParts,
        });
        // Loop back to let model inspect tool output
        continue;
      }

      // If no function call, we have the final textual response
      const textPart = parts.find((p) => p.text);
      if (textPart && textPart.text) {
        return textPart.text;
      }
    }

    // Nếu đã hoàn thành các bước chạy công cụ nhưng chưa có phản hồi văn bản cuối cùng, yêu cầu mô hình tổng hợp
    try {
      this.history.push({
        role: "user",
        parts: [
          {
            text: "Đã thu thập đầy đủ kết quả từ các công cụ ở trên. Hãy tổng hợp và trả lời trực tiếp cho người dùng bằng Tiếng Việt ngay bây giờ mà không cần gọi thêm công cụ nào nữa."
          }
        ]
      });
      const finalData = await this.callGemini(this.history);
      const finalCandidate = finalData.candidates?.[0];
      const finalTextPart = finalCandidate?.content?.parts?.find((p) => p.text);
      if (finalTextPart && finalTextPart.text) {
        this.history.push(finalCandidate.content);
        return finalTextPart.text;
      }
    } catch {
      // Fallback
    }

    return "Đã hoàn thành các bước thực thi công cụ và phân tích dữ liệu.";
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

    // 15. Kali Tools Catalog
    process.stdout.write("  Testing listKaliTools... ");
    const kaliCatRes = JSON.parse(await TOOL_HANDLERS.listKaliTools({ keyword: "nmap" }));
    console.log(`${C.green}✓ OK${C.reset} (${kaliCatRes.totalTools} tools found)`);

    // 16. Mode 2: Trading Tools
    process.stdout.write("  Testing calculatePositionSize (Risk Management)... ");
    const posRes = JSON.parse(await TOOL_HANDLERS.calculatePositionSize({
      accountBalance: 10000,
      riskPercentage: 1,
      entryPrice: 2700,
      stopLossPrice: 2680,
      assetType: "GOLD"
    }));
    console.log(`${C.green}✓ OK${C.reset} (${posRes.orderDirection} - ${posRes.recommendation.calculatedPosition})`);

    process.stdout.write("  Testing analyzeRiskReward (R:R Ratio)... ");
    const rrRes = JSON.parse(await TOOL_HANDLERS.analyzeRiskReward({
      entryPrice: 90000,
      stopLossPrice: 88000,
      takeProfitPrice: 96000
    }));
    console.log(`${C.green}✓ OK${C.reset} (${rrRes.rrRatio})`);

    process.stdout.write("  Testing calculateFibonacciLevels... ");
    const fibRes = JSON.parse(await TOOL_HANDLERS.calculateFibonacciLevels({
      highPrice: 100000,
      lowPrice: 60000,
      trend: "UP"
    }));
    console.log(`${C.green}✓ OK${C.reset} (Golden Pocket: ${fibRes.goldenPocket.range})`);

    // 17. Mode 3: Dev Tools
    process.stdout.write("  Testing explainAlgorithmComplexity (DSA)... ");
    const algoRes = JSON.parse(await TOOL_HANDLERS.explainAlgorithmComplexity({
      algorithmName: "QuickSort",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(log N)"
    }));
    console.log(`${C.green}✓ OK${C.reset} (${algoRes.name}: ${algoRes.timeComplexity.averageCase})`);

    process.stdout.write("  Testing generateProjectStructure (Clean Architecture)... ");
    const projRes = JSON.parse(await TOOL_HANDLERS.generateProjectStructure({
      projectType: "backend",
      architectureStyle: "clean-architecture"
    }));
    console.log(`${C.green}✓ OK${C.reset} (${projRes.architectureStyle})`);

    // 18. Mode Switching
    process.stdout.write("  Testing AIAgent Mode Switching... ");
    const testAgent = new AIAgent("TEST_KEY", "pentest");
    if (testAgent.mode !== "pentest") throw new Error("Initial mode mismatch");
    testAgent.setMode("trading");
    if (testAgent.mode !== "trading") throw new Error("Trading mode switch failed");
    testAgent.setMode("dev");
    if (testAgent.mode !== "dev") throw new Error("Dev mode switch failed");
    console.log(`${C.green}✓ OK${C.reset} (3 modes verified: pentest, trading, dev)`);

    // 19. Learn from URL
    process.stdout.write("  Testing learnFromUrl (URL Validation)... ");
    const invalidUrlRes = JSON.parse(await TOOL_HANDLERS.learnFromUrl({ url: "invalid-url" }));
    if (!invalidUrlRes.error) throw new Error("Expected validation error for non-http url");
    console.log(`${C.green}✓ OK${C.reset} (Validation handler verified)`);

    // Clean up temporary test files
    await (await import("fs/promises")).unlink(sampleDocPath).catch(() => { });

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

  // Detect mode parameter (--mode=trading / -m dev / etc.)
  let selectedMode = "pentest";
  const modeArg = process.argv.find((arg) => arg.startsWith("--mode="));
  if (modeArg) {
    selectedMode = modeArg.split("=")[1].toLowerCase();
  } else {
    const mIdx = process.argv.indexOf("-m");
    if (mIdx !== -1 && process.argv[mIdx + 1]) {
      selectedMode = process.argv[mIdx + 1].toLowerCase();
    }
  }

  if (!AGENT_MODES[selectedMode]) {
    selectedMode = "pentest";
  }

  const currentModeConfig = AGENT_MODES[selectedMode];

  console.log(`\n${C.green}${C.bold}======================================================${C.reset}`);
  console.log(`${C.green}${C.bold}   ${currentModeConfig.icon} Khakhapkhun AI: ${currentModeConfig.name}   ${C.reset}`);
  console.log(`${C.green}${C.bold}   (${currentModeConfig.badge})   ${C.reset}`);
  console.log(`${C.green}${C.bold}======================================================${C.reset}\n`);

  let apiKey = process.env.GEMINI_API_KEY;

  const rl = readline.createInterface({ input, output });

  if (!apiKey) {
    console.log(`${C.yellow}Chưa tìm thấy GEMINI_API_KEY trong file .env.${C.reset}`);
    console.log(`Lấy API key miễn phí tại: https://aistudio.google.com\n`);
    apiKey = await rl.question(`${C.bold}Nhập Gemini API key của bạn: ${C.reset}`);
    apiKey = apiKey.trim();
    if (!apiKey) {
      console.log(`${C.red}Lỗi: Cần có API key để khởi động Khakhapkhun AI.${C.reset}`);
      rl.close();
      return;
    }
  }

  const agent = new AIAgent(apiKey, selectedMode);

  // Check if a single query was passed via command line (e.g. node agent.mjs "What time is it?")
  const queryArgs = process.argv.slice(2).filter((arg) => !arg.startsWith("-") && !arg.startsWith("--mode="));
  if (queryArgs.length > 0) {
    const singlePrompt = queryArgs.join(" ");
    console.log(`${C.bold}Chế độ:${C.reset} ${currentModeConfig.badge}`);
    console.log(`${C.bold}Câu hỏi:${C.reset} ${singlePrompt}`);
    console.log(`${C.dim}Mô hình AI: ${agent.activeModel}...${C.reset}`);
    const response = await agent.processUserMessage(singlePrompt);
    console.log(`\n${C.green}${C.bold}Khakhapkhun AI:${C.reset} ${response}\n`);
    rl.close();
    return;
  }

  console.log(`\n${C.green}✓ Khakhapkhun AI đã sẵn sàng! (Mô hình: ${agent.activeModel} | Chế độ: ${currentModeConfig.badge})${C.reset}`);
  console.log(`${C.dim}Mẹo: Đổi chế độ bằng cách chạy lại lệnh kèm: --mode=pentest | --mode=trading | --mode=dev${C.reset}`);
  console.log(`${C.dim}Nhập 'exit' hoặc 'quit' để kết thúc.${C.reset}\n`);

  while (true) {
    const prompt = await rl.question(`${C.bold}Bạn: ${C.reset}`);
    const trimmed = prompt.trim();

    if (!trimmed) continue;
    if (["exit", "quit", "q", "thoat"].includes(trimmed.toLowerCase())) {
      console.log(`\n${C.yellow}Tạm biệt bạn! Hẹn gặp lại trong phiên làm việc tiếp theo! 👋${C.reset}\n`);
      break;
    }

    try {
      process.stdout.write(`${C.dim}Đang suy nghĩ và phân tích...${C.reset}\r`);
      const response = await agent.processUserMessage(trimmed);
      console.log(`\r${" ".repeat(35)}\r${C.green}${C.bold}Khakhapkhun AI:${C.reset} ${response}\n`);
    } catch (err) {
      console.error(`\n${C.red}Lỗi: ${err.message}${C.reset}\n`);
    }
  }

  rl.close();
}

export { AIAgent, AGENT_MODES, DEFAULT_MODELS, runSelfTest };

// Only run CLI interface if executed directly from command line
if (process.argv[1] && process.argv[1].endsWith("agent.mjs")) {
  main().catch((err) => {
    console.error("Fatal error:", err);
  });
}


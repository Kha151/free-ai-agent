import fs from "fs/promises";
import path from "path";
import { CURRICULUM } from "./curriculum.mjs";
import {
  runGitleaksScan,
  runSemgrepScan,
  runTrivyScan,
  runNmapScan,
  runNiktoScan,
  runSqlmapScan,
  runDirbScan,
  runGobusterScan,
  runMetasploitScan,
  runKaliCommand,
} from "./securityTools.mjs";
import {
  learnLatestThreats,
  getStoredThreatIntel,
} from "./knowledgeTools.mjs";

/**
 * Tool 1: Safe Math Calculator
 */
export async function calculate({ expression }) {
  try {
    const cleanExpr = expression.replace(/[^0-9+\-*/(). %]/g, "");
    if (!cleanExpr || cleanExpr.trim() !== expression.trim()) {
      return JSON.stringify({ error: "Invalid math characters detected." });
    }
    // Safe evaluation using Function with no globals
    const result = Function(`"use strict"; return (${cleanExpr})`)();
    return JSON.stringify({ expression: cleanExpr, result: String(result) });
  } catch (err) {
    return JSON.stringify({ error: `Math error: ${err.message}` });
  }
}

/**
 * Tool 2: Free Web & Knowledge Search (Wikipedia API + DuckDuckGo Instant Answers)
 */
export async function searchWeb({ query }) {
  const snippets = [];

  try {
    // 1. Wikipedia Search API (Free, fast, never blocked by captchas)
    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      query
    )}&utf8=&format=json`;
    const wikiRes = await fetch(wikiUrl, {
      headers: { "User-Agent": "FreeAIAgent/1.0 (https://github.com/Kha151/free-ai-agent)" },
    });

    if (wikiRes.ok) {
      const data = await wikiRes.json();
      const items = data.query?.search || [];
      for (const item of items.slice(0, 3)) {
        const cleanSnippet = item.snippet.replace(/<[^>]+>/g, "").trim();
        snippets.push(`[${item.title}]: ${cleanSnippet}`);
      }
    }
  } catch (err) {
    // Continue to fallback
  }

  try {
    // 2. DuckDuckGo Instant Answer API
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(
      query
    )}&format=json&no_html=1&skip_disambig=1`;
    const ddgRes = await fetch(ddgUrl, {
      headers: { "User-Agent": "FreeAIAgent/1.0" },
    });

    if (ddgRes.ok) {
      const ddgData = await ddgRes.json();
      if (ddgData.Heading && ddgData.AbstractText) {
        snippets.unshift(`[${ddgData.Heading}]: ${ddgData.AbstractText}`);
      }
    }
  } catch (err) {
    // Fallback handled
  }

  if (snippets.length > 0) {
    return JSON.stringify({ query, results: snippets.join("\n\n") });
  }

  return JSON.stringify({
    query,
    results: `No direct web search snippets found for "${query}". Try rephrasing the search term.`,
  });
}

/**
 * Tool 3: Write File
 */
export async function writeFile({ filename, content }) {
  try {
    const safePath = path.resolve(process.cwd(), filename);
    await fs.writeFile(safePath, content, "utf-8");
    return JSON.stringify({ success: true, message: `File saved to ${filename}` });
  } catch (err) {
    return JSON.stringify({ error: `Write failed: ${err.message}` });
  }
}

/**
 * Tool 4: Read File
 */
export async function readFile({ filename }) {
  try {
    const safePath = path.resolve(process.cwd(), filename);
    const data = await fs.readFile(safePath, "utf-8");
    return JSON.stringify({ filename, content: data });
  } catch (err) {
    return JSON.stringify({ error: `Could not read file: ${err.message}` });
  }
}

/**
 * Tool 5: List Files
 */
export async function listFiles({ directory = "." }) {
  try {
    const targetDir = path.resolve(process.cwd(), directory);
    const files = await fs.readdir(targetDir);
    return JSON.stringify({ directory, files });
  } catch (err) {
    return JSON.stringify({ error: `Could not list directory: ${err.message}` });
  }
}

/**
 * Tool 6: Get Current Time
 */
export async function getCurrentTime() {
  const now = new Date();
  return JSON.stringify({
    localTime: now.toLocaleString(),
    iso: now.toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
}

/**
 * Tool 7: List Pentest & DevSecOps Curriculum Tracks
 */
export async function listCurriculumTracks() {
  const summary = CURRICULUM.tracks.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    moduleCount: t.modules.length,
    moduleIds: t.modules.map((m) => `${m.id}: ${m.title}`),
  }));
  return JSON.stringify({ tracks: summary });
}

/**
 * Tool 8: Get Specific Curriculum Lesson & Lab Guide
 */
export async function getCurriculumLesson({ moduleId }) {
  for (const track of CURRICULUM.tracks) {
    const found = track.modules.find(
      (m) => m.id.toLowerCase() === (moduleId || "").toLowerCase()
    );
    if (found) {
      return JSON.stringify({
        track: track.title,
        module: found.title,
        id: found.id,
        keyConcepts: found.concepts,
        handsOnLab: found.labRecommendation,
      });
    }
  }

  // If not found by exact ID, search by keyword
  const allModules = CURRICULUM.tracks.flatMap((t) =>
    t.modules.map((m) => ({ ...m, trackTitle: t.title }))
  );
  const match = allModules.find(
    (m) =>
      m.title.toLowerCase().includes((moduleId || "").toLowerCase()) ||
      m.concepts.some((c) =>
        c.toLowerCase().includes((moduleId || "").toLowerCase())
      )
  );

  if (match) {
    return JSON.stringify({
      track: match.trackTitle,
      module: match.title,
      id: match.id,
      keyConcepts: match.concepts,
      handsOnLab: match.labRecommendation,
    });
  }

  return JSON.stringify({
    error: `Module "${moduleId}" not found. Available modules: pt-101, pt-102, pt-103, secops-201, secops-202, secops-203, cloud-301, cloud-302.`,
  });
}

/**
 * Tool 9: DevSecOps Code & Configuration Security Audit
 */
export async function auditCodeSnippet({ code, language = "generic" }) {
  const findings = [];

  // Common high-risk patterns
  if (/os\.system\(|exec\(|eval\(|child_process\.exec\(/i.test(code)) {
    findings.push({
      severity: "CRITICAL",
      rule: "CWE-78: OS Command Injection",
      details: "Use of direct shell execution function with unvalidated variables.",
      devSecOpsCheck: "Add SAST rule (e.g., Semgrep python.lang.security.audit.dangerous-system-call) to fail CI pipeline."
    });
  }

  if (/password\s*=\s*['"][^'"]+['"]|api_key\s*=\s*['"][^'"]+['"]|secret\s*=\s*['"][^'"]+['"]/i.test(code)) {
    findings.push({
      severity: "HIGH",
      rule: "CWE-798: Hardcoded Credentials",
      details: "Hardcoded secret or password string detected in source code.",
      devSecOpsCheck: "Integrate pre-commit secret scanners (Gitleaks, Trufflehog) to block commits."
    });
  }

  if (/FROM\s+[\w.-]+:latest/i.test(code)) {
    findings.push({
      severity: "MEDIUM",
      rule: "CIS Docker 4.1: Immutable Base Image Tags",
      details: "Use of ':latest' image tag leads to unpredictable pipeline builds and unvetted base images.",
      devSecOpsCheck: "Pin images to specific SHA256 digests or immutable version tags. Enforce with Conftest / Trivy."
    });
  }

  if (/USER\s+root/i.test(code) || (language.toLowerCase() === "dockerfile" && !/USER\s+/i.test(code))) {
    findings.push({
      severity: "MEDIUM",
      rule: "CIS Docker 4.3: Container Running as Root",
      details: "Container lacks non-root USER declaration. If container breaks out, process runs as host root.",
      devSecOpsCheck: "Add 'USER 10001' and enforce via Kubernetes Admission Controller (Kyverno/Gatekeeper)."
    });
  }

  return JSON.stringify({
    language,
    findingsCount: findings.length,
    findings: findings.length > 0 ? findings : "No standard heuristic issues detected in basic pattern check. Perform full semantic audit.",
  });
}

// Tool declarations formatted for Gemini Function Calling
export const TOOL_DECLARATIONS = [
  {
    name: "calculate",
    description: "Evaluates basic arithmetic expressions like '150 * 12 + 45'.",
    parameters: {
      type: "OBJECT",
      properties: {
        expression: { type: "STRING", description: "The mathematical expression to evaluate" }
      },
      required: ["expression"]
    }
  },
  {
    name: "searchWeb",
    description: "Searches knowledge bases and web encyclopedias for CVEs, tools, and technical documentation.",
    parameters: {
      type: "OBJECT",
      properties: {
        query: { type: "STRING", description: "Search query string" }
      },
      required: ["query"]
    }
  },
  {
    name: "writeFile",
    description: "Creates or overwrites a local file in the workspace with given content.",
    parameters: {
      type: "OBJECT",
      properties: {
        filename: { type: "STRING", description: "Relative file name, e.g. notes.txt or report.md" },
        content: { type: "STRING", description: "The text content to write" }
      },
      required: ["filename", "content"]
    }
  },
  {
    name: "readFile",
    description: "Reads the content of a local file in the workspace.",
    parameters: {
      type: "OBJECT",
      properties: {
        filename: { type: "STRING", description: "Relative file name to read" }
      },
      required: ["filename"]
    }
  },
  {
    name: "listFiles",
    description: "Lists all files and subdirectories in the current workspace.",
    parameters: {
      type: "OBJECT",
      properties: {
        directory: { type: "STRING", description: "Directory to list (defaults to .)" }
      }
    }
  },
  {
    name: "getCurrentTime",
    description: "Gets the current system date, time, and timezone.",
    parameters: {
      type: "OBJECT",
      properties: {}
    }
  },
  {
    name: "listCurriculumTracks",
    description: "Lists all available Penetration Testing and DevSecOps training tracks and module IDs.",
    parameters: {
      type: "OBJECT",
      properties: {}
    }
  },
  {
    name: "getCurriculumLesson",
    description: "Retrieves a structured learning lesson, key concepts, and safe hands-on lab exercise for a module (e.g. pt-101, pt-102, secops-201, secops-202, cloud-301).",
    parameters: {
      type: "OBJECT",
      properties: {
        moduleId: { type: "STRING", description: "The module ID or keyword (e.g. 'pt-102', 'sql injection', 'secops-201')" }
      },
      required: ["moduleId"]
    }
  },
  {
    name: "auditCodeSnippet",
    description: "Performs a DevSecOps & offensive security code review on a provided code snippet or Dockerfile, reporting CWEs, severity, and pipeline guardrails.",
    parameters: {
      type: "OBJECT",
      properties: {
        code: { type: "STRING", description: "The code or configuration content to audit" },
        language: { type: "STRING", description: "Language or format, e.g. python, javascript, dockerfile, terraform" }
      },
      required: ["code"]
    }
  },
  {
    name: "runGitleaksScan",
    description: "Runs Gitleaks secret scanner on a target folder/repo to find leaked API keys, tokens, and hardcoded passwords.",
    parameters: {
      type: "OBJECT",
      properties: {
        targetPath: { type: "STRING", description: "Relative directory path to scan (defaults to .)" }
      }
    }
  },
  {
    name: "runSemgrepScan",
    description: "Runs Semgrep Static Application Security Testing (SAST) on files or code snippet to detect OWASP Top 10 flaws (Command Injection, SQLi, Insecure Deserialization).",
    parameters: {
      type: "OBJECT",
      properties: {
        targetPath: { type: "STRING", description: "Path to file or directory to scan" },
        codeSnippet: { type: "STRING", description: "Raw code string to analyze directly" }
      }
    }
  },
  {
    name: "runTrivyScan",
    description: "Runs Trivy vulnerability scanner on dependencies (package.json) or container configuration (Dockerfile) to detect known CVEs and misconfigurations.",
    parameters: {
      type: "OBJECT",
      properties: {
        target: { type: "STRING", description: "Target file or directory (e.g. . or Dockerfile)" },
        targetType: { type: "STRING", description: "Scan type: 'fs' for filesystem, 'config' for IaC/Dockerfile" }
      }
    }
  },
  {
    name: "runNmapScan",
    description: "Chạy Nmap quét cổng và dịch vụ mạng trong Kali Linux (Docker/WSL/Hyper-V). Nếu không có Kali, dùng engine mô phỏng.",
    parameters: {
      type: "OBJECT",
      properties: {
        targetHost: { type: "STRING", description: "Địa chỉ IP hoặc hostname (e.g. 127.0.0.1, scanme.nmap.org)" },
        ports: { type: "STRING", description: "Danh sách cổng, cách nhau bởi dấu phẩy (e.g. '80,443,8080,22')" },
        flags: { type: "STRING", description: "Cờ Nmap (e.g. '-sV' phát hiện phiên bản, '-sS' SYN scan)" }
      }
    }
  },
  {
    name: "runNiktoScan",
    description: "Chạy Nikto quét web server để phát hiện lỗ hổng phổ biến (trong Kali Linux Docker/WSL/Hyper-V).",
    parameters: {
      type: "OBJECT",
      properties: {
        targetHost: { type: "STRING", description: "Hostname hoặc IP của web server" },
        port: { type: "STRING", description: "Cổng web (mặc định 80)" }
      },
      required: ["targetHost"]
    }
  },
  {
    name: "runSqlmapScan",
    description: "Chạy sqlmap kiểm tra SQL Injection trên URL mục tiêu (trong Kali Linux Docker/WSL/Hyper-V).",
    parameters: {
      type: "OBJECT",
      properties: {
        url: { type: "STRING", description: "URL đầy đủ cần kiểm tra (e.g. http://example.com/page?id=1)" }
      },
      required: ["url"]
    }
  },
  {
    name: "runDirbScan",
    description: "Chạy Dirb brute-force thư mục web (trong Kali Linux Docker/WSL/Hyper-V).",
    parameters: {
      type: "OBJECT",
      properties: {
        targetUrl: { type: "STRING", description: "URL mục tiêu (e.g. http://example.com)" }
      },
      required: ["targetUrl"]
    }
  },
  {
    name: "runGobusterScan",
    description: "Chạy Gobuster enumeration path/directory trên web (trong Kali Linux Docker/WSL/Hyper-V).",
    parameters: {
      type: "OBJECT",
      properties: {
        targetUrl: { type: "STRING", description: "URL mục tiêu (e.g. http://example.com)" },
        wordlist: { type: "STRING", description: "Đường dẫn wordlist trong Kali (mặc định /usr/share/wordlists/dirb/common.txt)" }
      },
      required: ["targetUrl"]
    }
  },
  {
    name: "runMetasploitScan",
    description: "Chạy Metasploit auxiliary module trong Kali Linux (Docker/WSL/Hyper-V).",
    parameters: {
      type: "OBJECT",
      properties: {
        module: { type: "STRING", description: "Metasploit module path (e.g. auxiliary/scanner/portscan/tcp)" },
        options: { type: "STRING", description: "Các option cách nhau bởi dấu cách (e.g. 'RHOSTS=10.0.0.5 RPORT=8080')" }
      }
    }
  },
  {
    name: "runKaliCommand",
    description: "Chạy một lệnh bất kỳ trong môi trường Kali Linux (Docker/WSL/Hyper-V). Dùng khi cần chạy công cụ pentest chưa có wrapper riêng.",
    parameters: {
      type: "OBJECT",
      properties: {
        command: { type: "STRING", description: "Lệnh Linux cần thực thi trong Kali (e.g. 'whatweb http://example.com')" }
      },
      required: ["command"]
    }
  }
];

// Mapping tool names to executable functions
export const TOOL_HANDLERS = {
  calculate,
  searchWeb,
  writeFile,
  readFile,
  listFiles,
  getCurrentTime,
  listCurriculumTracks,
  getCurriculumLesson,
  auditCodeSnippet,
  runGitleaksScan,
  runSemgrepScan,
  runTrivyScan,
  runNmapScan,
  runNiktoScan,
  runSqlmapScan,
  runDirbScan,
  runGobusterScan,
  runMetasploitScan,
  runKaliCommand,
};


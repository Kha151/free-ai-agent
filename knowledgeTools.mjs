import fs from "fs/promises";
import path from "path";

const KNOWLEDGE_DIR = path.resolve(process.cwd(), "knowledge");
const THREAT_INTEL_FILE = path.join(KNOWLEDGE_DIR, "threat_intel.json");
const THREAT_NOTES_FILE = path.join(KNOWLEDGE_DIR, "threat_notes.md");
const DOCUMENTS_INDEX_FILE = path.join(KNOWLEDGE_DIR, "documents_index.json");

/**
 * Ensure the knowledge directory exists
 */
async function ensureKnowledgeDir() {
  await fs.mkdir(KNOWLEDGE_DIR, { recursive: true });
}

/**
 * 3. Learn & Ingest Knowledge from PDF, DOCX, TXT, MD Documents
 */
export async function learnFromDocument({ filePath, title = "" }) {
  await ensureKnowledgeDir();

  const resolvedPath = path.resolve(process.cwd(), filePath);
  const ext = path.extname(resolvedPath).toLowerCase();
  const docTitle = title || path.basename(resolvedPath);

  let extractedText = "";

  try {
    if (ext === ".pdf") {
      const pdfModule = await import("pdf-parse");
      const dataBuffer = await fs.readFile(resolvedPath);

      // Hỗ trợ cả pdf-parse v2 (class PDFParse) lẫn v1 (function default)
      if (typeof pdfModule.default === "function") {
        const pdfData = await pdfModule.default(dataBuffer);
        extractedText = pdfData.text || "";
      } else if (pdfModule.PDFParse) {
        const parser = new pdfModule.PDFParse(new Uint8Array(dataBuffer));
        await parser.load();
        const res = await parser.getText();
        extractedText = res.text || (typeof res === "string" ? res : "");
      } else {
        throw new Error("Không thể khởi tạo parser PDF.");
      }
    } else if (ext === ".docx") {
      const mammoth = (await import("mammoth")).default;
      const result = await mammoth.extractRawText({ path: resolvedPath });
      extractedText = result.value || "";
    } else if ([".txt", ".md", ".json", ".csv", ".log", ".yaml", ".yml"].includes(ext)) {
      extractedText = await fs.readFile(resolvedPath, "utf-8");
    } else {
      return JSON.stringify({
        error: `Định dạng '${ext}' chưa được hỗ trợ. Hãy dùng file: .pdf, .docx, .txt, .md, .yaml, .json, .csv`
      });
    }
  } catch (err) {
    return JSON.stringify({
      error: `Không thể đọc tài liệu '${filePath}': ${err.message}`
    });
  }

  // Clean and summarize key concepts
  const cleanText = extractedText.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (!cleanText) {
    return JSON.stringify({
      error: `Tài liệu '${filePath}' không chứa nội dung văn bản nào để học.`
    });
  }

  const wordCount = cleanText.split(/\s+/).length;
  // Trích xuất tóm tắt ngắn và các đoạn trích quan trọng
  const preview = cleanText.slice(0, 3000);

  // Lưu vào documents_index.json
  let docIndex = [];
  try {
    const raw = await fs.readFile(DOCUMENTS_INDEX_FILE, "utf-8");
    docIndex = JSON.parse(raw);
  } catch {
    docIndex = [];
  }

  const newDocEntry = {
    id: `doc-${Date.now()}`,
    title: docTitle,
    filePath: path.relative(process.cwd(), resolvedPath),
    extension: ext,
    wordCount,
    learnedAt: new Date().toISOString(),
    excerpt: cleanText.slice(0, 500) + (cleanText.length > 500 ? "..." : "")
  };

  // Cập nhật hoặc thêm mới
  const existingIndex = docIndex.findIndex(d => d.filePath === newDocEntry.filePath);
  if (existingIndex >= 0) {
    docIndex[existingIndex] = newDocEntry;
  } else {
    docIndex.push(newDocEntry);
  }

  await fs.writeFile(DOCUMENTS_INDEX_FILE, JSON.stringify(docIndex, null, 2), "utf-8");

  // Lưu bản tóm tắt markdown vào knowledge/documents/
  const docStoreDir = path.join(KNOWLEDGE_DIR, "documents");
  await fs.mkdir(docStoreDir, { recursive: true });
  const safeDocName = path.basename(resolvedPath, ext).replace(/[^a-zA-Z0-9_\-]/g, "_");
  const markdownPath = path.join(docStoreDir, `${safeDocName}.md`);
  
  const markdownContent = `# Tài Liệu Đã Học: ${docTitle}
- **File gốc**: \`${newDocEntry.filePath}\`
- **Định dạng**: \`${ext}\`
- **Số từ**: ~${wordCount} từ
- **Thời gian học**: ${newDocEntry.learnedAt}

## Nội dung trích xuất
\`\`\`text
${cleanText.slice(0, 8000)}
${cleanText.length > 8000 ? "\n... (nội dung tiếp tục được lưu trong file gốc) ..." : ""}
\`\`\`
`;
  await fs.writeFile(markdownPath, markdownContent, "utf-8");

  return JSON.stringify({
    status: "SUCCESS",
    message: `Đã phân tích, đọc hiểu và nạp thành công tài liệu '${docTitle}' vào bộ nhớ tri thức của Gia Sư AI.`,
    file: newDocEntry.filePath,
    wordCount,
    savedTo: path.relative(process.cwd(), markdownPath),
    contentPreview: preview.slice(0, 1500)
  });
}

/**
 * 4. Search and Query Knowledge from Uploaded Documents
 */
export async function queryLearnedDocuments({ query = "" }) {
  await ensureKnowledgeDir();

  let docIndex = [];
  try {
    const raw = await fs.readFile(DOCUMENTS_INDEX_FILE, "utf-8");
    docIndex = JSON.parse(raw);
  } catch {
    return JSON.stringify({
      message: "Chưa có tài liệu PDF/DOCX nào được nạp vào. Hãy dùng lệnh `learnFromDocument` để tải tài liệu lên.",
      documents: []
    });
  }

  if (docIndex.length === 0) {
    return JSON.stringify({
      message: "Chưa có tài liệu nào được lưu trong cơ sở tri thức.",
      documents: []
    });
  }

  if (!query) {
    return JSON.stringify({
      totalLearnedDocuments: docIndex.length,
      documents: docIndex
    });
  }

  const cleanQ = query.toLowerCase();
  const matched = [];

  // Tìm trong index và nội dung documents
  const docStoreDir = path.join(KNOWLEDGE_DIR, "documents");
  for (const doc of docIndex) {
    let fullText = doc.excerpt;
    try {
      const mdFile = path.join(docStoreDir, `${path.basename(doc.filePath, doc.extension).replace(/[^a-zA-Z0-9_\-]/g, "_")}.md`);
      fullText = await fs.readFile(mdFile, "utf-8");
    } catch {}

    if (
      doc.title.toLowerCase().includes(cleanQ) ||
      fullText.toLowerCase().includes(cleanQ)
    ) {
      matched.push({
        title: doc.title,
        file: doc.filePath,
        learnedAt: doc.learnedAt,
        snippet: fullText.slice(0, 600) + "..."
      });
    }
  }

  return JSON.stringify({
    query,
    matchCount: matched.length,
    results: matched.length > 0 ? matched : `Không tìm thấy nội dung khớp với từ khóa '${query}' trong các tài liệu đã học.`
  });
}

/**
 * 1. Learn Latest Security Threats & Advisories From the Internet
 */
export async function learnLatestThreats({ severity = "all", limit = 5 }) {
  await ensureKnowledgeDir();

  const maxItems = Math.min(Math.max(limit, 1), 10);
  const severityFilter = severity.toLowerCase();
  
  let url = `https://api.github.com/advisories?per_page=${maxItems * 2}`;
  if (["critical", "high", "medium", "low"].includes(severityFilter)) {
    url += `&severity=${severityFilter}`;
  }

  let rawAdvisories = [];
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "FreeAIAgent/1.0 (https://github.com/Kha151/free-ai-agent)",
        "Accept": "application/vnd.github+json"
      },
      signal: AbortSignal.timeout(10000)
    });

    if (res.ok) {
      rawAdvisories = await res.json();
    } else {
      throw new Error(`API returned HTTP ${res.status}`);
    }
  } catch (err) {
    // Fallback sample if internet is down or rate limited
    return JSON.stringify({
      error: `Không thể kết nối đến nguồn cấp dữ liệu bảo mật trực tuyến: ${err.message}. Kiểm tra kết nối Internet.`,
      storedThreats: await readStoredIntel()
    });
  }

  const learnedEntries = [];

  for (const item of rawAdvisories.slice(0, maxItems)) {
    const pkg = item.vulnerabilities?.[0]?.package?.name || "Multiple packages";
    const ecosystem = item.vulnerabilities?.[0]?.package?.ecosystem || "OpenSource";
    const patched = item.vulnerabilities?.[0]?.patched_versions || "Check advisory";

    learnedEntries.push({
      cveId: item.cve_id || item.ghsa_id,
      ghsaId: item.ghsa_id,
      severity: (item.severity || "UNKNOWN").toUpperCase(),
      package: pkg,
      ecosystem: ecosystem,
      summary: item.summary,
      patchedVersions: patched,
      publishedAt: item.published_at,
      pentestAngle: `Khai thác phiên bản chưa vá của ${pkg} qua vector: ${item.summary}`,
      devSecOpsFix: `Cập nhật package ${pkg} lên bản vá ${patched} và kích hoạt SCA scanner (Trivy/Snyk) để chặn build.`,
      learnedAt: new Date().toISOString()
    });
  }

  // Merge into persistent threat_intel.json
  const existing = await readStoredIntel();
  const existingMap = new Map(existing.map(e => [e.cveId, e]));

  for (const entry of learnedEntries) {
    existingMap.set(entry.cveId, entry);
  }

  const updatedDatabase = Array.from(existingMap.values());
  await fs.writeFile(THREAT_INTEL_FILE, JSON.stringify(updatedDatabase, null, 2), "utf-8");

  // Also write human-readable threat_notes.md
  let markdownContent = `# 🛡️ Nhật Ký Tri Thức Lỗ Hổng Bảo Mật (Threat Intelligence Notes)\n\n`;
  markdownContent += `*Cập nhật lần cuối: ${new Date().toLocaleString("vi-VN")}*\n\n`;
  for (const item of updatedDatabase.slice(-10).reverse()) {
    markdownContent += `### [${item.severity}] ${item.cveId}: ${item.package} (${item.ecosystem})\n`;
    markdownContent += `- **Tóm tắt**: ${item.summary}\n`;
    markdownContent += `- **Bản vá khuyến nghị**: ${item.patchedVersions}\n`;
    markdownContent += `- **Góc nhìn Pentester**: ${item.pentestAngle}\n`;
    markdownContent += `- **Góc nhìn DevSecOps**: ${item.devSecOpsFix}\n`;
    markdownContent += `- **Ngày ghi nhận**: ${item.publishedAt}\n\n`;
  }
  await fs.writeFile(THREAT_NOTES_FILE, markdownContent, "utf-8");

  return JSON.stringify({
    status: "SUCCESS",
    message: `Đã tự động học và cập nhật ${learnedEntries.length} lỗ hổng mới nhất vào cơ sở tri thức cục bộ.`,
    savedTo: "knowledge/threat_intel.json và knowledge/threat_notes.md",
    newlyLearnedCount: learnedEntries.length,
    newThreats: learnedEntries
  });
}

/**
 * 2. Retrieve Stored Threat Intelligence From Local Knowledge Base
 */
export async function getStoredThreatIntel({ query = "" }) {
  const existing = await readStoredIntel();

  if (existing.length === 0) {
    return JSON.stringify({
      message: "Cơ sở tri thức bảo mật cục bộ hiện đang trống. Hãy yêu cầu tôi chạy 'learnLatestThreats' để tự động cập nhật lỗ hổng mới từ Internet.",
      totalStored: 0
    });
  }

  if (!query) {
    return JSON.stringify({
      totalStored: existing.length,
      threats: existing.slice(-5).reverse()
    });
  }

  const cleanQ = query.toLowerCase();
  const filtered = existing.filter(e =>
    e.cveId.toLowerCase().includes(cleanQ) ||
    e.package.toLowerCase().includes(cleanQ) ||
    e.summary.toLowerCase().includes(cleanQ) ||
    e.ecosystem.toLowerCase().includes(cleanQ)
  );

  return JSON.stringify({
    query,
    matchCount: filtered.length,
    threats: filtered
  });
}

/**
 * Internal helper to read threat_intel.json
 */
async function readStoredIntel() {
  try {
    const raw = await fs.readFile(THREAT_INTEL_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}


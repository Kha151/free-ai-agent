import fs from "fs/promises";
import path from "path";

const KNOWLEDGE_DIR = path.resolve(process.cwd(), "knowledge");
const THREAT_INTEL_FILE = path.join(KNOWLEDGE_DIR, "threat_intel.json");
const THREAT_NOTES_FILE = path.join(KNOWLEDGE_DIR, "threat_notes.md");

/**
 * Ensure the knowledge directory exists
 */
async function ensureKnowledgeDir() {
  await fs.mkdir(KNOWLEDGE_DIR, { recursive: true });
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


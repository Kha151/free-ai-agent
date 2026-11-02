import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

/**
 * Check if a CLI command is available on the system PATH
 */
async function isCliAvailable(cmd) {
  try {
    const checkCmd = process.platform === "win32" ? `where ${cmd}` : `which ${cmd}`;
    await execAsync(checkCmd);
    return true;
  } catch {
    return false;
  }
}

/**
 * 1. Gitleaks Scanner (Secret & Credential Detection)
 */
export async function runGitleaksScan({ targetPath = "." }) {
  const isInstalled = await isCliAvailable("gitleaks");

  if (isInstalled) {
    try {
      const { stdout } = await execAsync(`gitleaks detect --source "${targetPath}" --no-banner --report-format json`, {
        timeout: 20000
      });
      return JSON.stringify({
        engine: "Gitleaks CLI (Official)",
        isInstalled: true,
        report: stdout ? JSON.parse(stdout) : "No leaks detected."
      });
    } catch (err) {
      // Gitleaks returns exit code 1 when leaks are found
      if (err.stdout) {
        try {
          return JSON.stringify({
            engine: "Gitleaks CLI (Official)",
            isInstalled: true,
            report: JSON.parse(err.stdout)
          });
        } catch {
          // fall through
        }
      }
    }
  }

  // Built-in Gitleaks-compatible Pattern Engine (Fallback)
  const leaks = [];
  const patterns = [
    { name: "GitHub Personal Access Token", regex: /(ghp_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{82})/g, entropy: "High" },
    { name: "Generic API Key / Secret Assignment", regex: /(api_key|apikey|secret|password|passwd|auth_token)\s*=\s*['"][a-zA-Z0-9_.~-]{12,}['"]/gi, entropy: "Medium-High" },
    { name: "AWS Access Key ID", regex: /AKIA[0-9A-Z]{16}/g, entropy: "High" },
    { name: "Google Gemini / AI Studio Key", regex: /AIzaSy[a-zA-Z0-9_-]{33}/g, entropy: "High" },
    { name: "Private RSA/EC/SSH Key", regex: /-----BEGIN (RSA|EC|DSA|OPENSSH) PRIVATE KEY-----/g, entropy: "Critical" },
    { name: "Slack Token", regex: /xox[baprs]-[0-9a-zA-Z]{10,48}/g, entropy: "High" }
  ];

  try {
    const filesToScan = await getFilesRecursively(targetPath);
    for (const file of filesToScan) {
      if (file.includes(".git") || file.includes("node_modules") || file.endsWith(".tmp")) continue;
      const content = await fs.readFile(file, "utf-8").catch(() => "");
      const lines = content.split("\n");

      lines.forEach((line, index) => {
        for (const p of patterns) {
          const match = p.regex.exec(line);
          if (match) {
            leaks.push({
              ruleID: p.name,
              file: path.relative(process.cwd(), file),
              lineNumber: index + 1,
              matchedSnippet: line.trim().slice(0, 80),
              entropy: p.entropy,
              severity: "CRITICAL",
              remediation: "Xoay vòng key (rotate), xóa khỏi git history bằng git-filter-repo, và đưa vào .env."
            });
          }
        }
      });
    }
  } catch (err) {
    return JSON.stringify({ error: `Gitleaks scan failed: ${err.message}` });
  }

  return JSON.stringify({
    engine: "Gitleaks Engine (Built-in Heuristic)",
    isInstalled: false,
    installTip: "Để dùng bản binary chính thức: 'winget install Gitleaks.Gitleaks' hoặc 'brew install gitleaks'.",
    totalFindings: leaks.length,
    findings: leaks.length > 0 ? leaks : "Không phát hiện lộ lọt API key hay Secret nào trong phạm vi quét."
  });
}

/**
 * 2. Semgrep Scanner (Static Application Security Testing - SAST)
 */
export async function runSemgrepScan({ targetPath = ".", codeSnippet = "" }) {
  const isInstalled = await isCliAvailable("semgrep");

  if (isInstalled && !codeSnippet) {
    try {
      const { stdout } = await execAsync(`semgrep scan --config=auto --json "${targetPath}"`, {
        timeout: 30000
      });
      return JSON.stringify({
        engine: "Semgrep CLI (Official)",
        isInstalled: true,
        report: JSON.parse(stdout)
      });
    } catch (err) {
      if (err.stdout) {
        try {
          return JSON.stringify({
            engine: "Semgrep CLI (Official)",
            isInstalled: true,
            report: JSON.parse(err.stdout)
          });
        } catch {}
      }
    }
  }

  // Built-in Semgrep SAST Rule Matcher
  const findings = [];
  const contentToScan = codeSnippet || (await readDirectoryContent(targetPath));

  const sastRules = [
    {
      id: "semgrep.security.command-injection",
      cwe: "CWE-78: OS Command Injection",
      regex: /(os\.system\(|subprocess\.Popen\([^,]+shell=True|exec\(|child_process\.exec\()/g,
      severity: "ERROR",
      message: "Phát hiện hàm thực thi shell với dữ liệu chưa được làm sạch. Kẻ tấn công có thể chèn lệnh hệ điều hành.",
      fix: "Dùng subprocess.run(['cmd', 'arg']) không qua shell, hoặc dùng execFile với danh sách tham số."
    },
    {
      id: "semgrep.security.sql-injection",
      cwe: "CWE-89: SQL Injection",
      regex: /(SELECT|INSERT|UPDATE|DELETE)\s+.*(\+.*|\%s|\$\{[^}]+\})/gi,
      severity: "ERROR",
      message: "Ghép chuỗi trực tiếp vào câu lệnh SQL. Kẻ tấn công có thể vượt qua đăng nhập hoặc trích xuất dữ liệu.",
      fix: "Sử dụng Parameterized Queries (Prepared Statements) hoặc ORM như Prisma, SQLAlchemy."
    },
    {
      id: "semgrep.security.insecure-deserialization",
      cwe: "CWE-502: Insecure Deserialization",
      regex: /(pickle\.loads\(|yaml\.load\([^,]+Loader=yaml\.Loader\)|eval\()/gi,
      severity: "WARNING",
      message: "Giải tuần tự hóa (deserialization) dữ liệu không đáng tin cậy có thể dẫn đến Thực thi mã từ xa (RCE).",
      fix: "Dùng JSON.parse() hoặc yaml.safe_load() thay thế."
    },
    {
      id: "semgrep.security.path-traversal",
      cwe: "CWE-22: Path Traversal",
      regex: /(fs\.readFile\([^,]+req\.query|open\([^,]+request\.args)/gi,
      severity: "ERROR",
      message: "Đọc file từ đường dẫn do người dùng kiểm soát mà không qua hàm chuẩn hóa path.resolve / allowlist.",
      fix: "Dùng path.resolve kết hợp kiểm tra đường dẫn bắt đầu bằng thư mục an toàn."
    }
  ];

  for (const rule of sastRules) {
    let match;
    while ((match = rule.regex.exec(contentToScan)) !== null) {
      findings.push({
        ruleId: rule.id,
        cwe: rule.cwe,
        severity: rule.severity,
        matched: match[0],
        message: rule.message,
        remediation: rule.fix
      });
    }
  }

  return JSON.stringify({
    engine: "Semgrep SAST Engine (Built-in Rules)",
    isInstalled: false,
    installTip: "Để dùng bản binary chính thức: 'pip install semgrep' hoặc 'winget install Semgrep'.",
    totalFindings: findings.length,
    findings: findings.length > 0 ? findings : "Không phát hiện vi phạm quy tắc SAST cơ bản."
  });
}

/**
 * 3. Trivy Scanner (Container & Package SCA)
 */
export async function runTrivyScan({ target = ".", targetType = "fs" }) {
  const isInstalled = await isCliAvailable("trivy");

  if (isInstalled) {
    try {
      const { stdout } = await execAsync(`trivy ${targetType} --format json "${target}"`, {
        timeout: 30000
      });
      return JSON.stringify({
        engine: "Trivy CLI (Official)",
        isInstalled: true,
        report: JSON.parse(stdout)
      });
    } catch (err) {
      if (err.stdout) {
        try {
          return JSON.stringify({
            engine: "Trivy CLI (Official)",
            isInstalled: true,
            report: JSON.parse(err.stdout)
          });
        } catch {}
      }
    }
  }

  // Built-in Trivy SCA & Dockerfile Security Checker
  const vulnerabilities = [];

  // 1. Audit Dockerfile if present
  try {
    const dockerfilePath = path.resolve(process.cwd(), target.endsWith("Dockerfile") ? target : "Dockerfile");
    const dockerfile = await fs.readFile(dockerfilePath, "utf-8").catch(() => "");
    if (dockerfile) {
      if (!/USER\s+(?!root\b)\w+/i.test(dockerfile)) {
        vulnerabilities.push({
          target: "Dockerfile",
          id: "DS002 (CIS Docker Benchmark)",
          severity: "HIGH",
          title: "Container image running as root",
          description: "Không khai báo USER không phải root. Kẻ tấn công nếu thoát khỏi container sẽ có quyền root trên host.",
          fix: "Thêm 'USER 10001' vào cuối Dockerfile."
        });
      }
      if (/FROM\s+[\w.-]+:latest/i.test(dockerfile)) {
        vulnerabilities.push({
          target: "Dockerfile",
          id: "DS001",
          severity: "MEDIUM",
          title: "Use of ':latest' tag for base image",
          description: "Dùng tag :latest khiến bản build không tái tạo được và có thể tải mã lỗi mới.",
          fix: "Chỉ định phiên bản cụ thể (ví dụ: node:20.11-alpine) hoặc gắn SHA256 digest."
        });
      }
    }
  } catch {}

  // 2. Audit package.json if present
  try {
    const pkgPath = path.resolve(process.cwd(), "package.json");
    const pkgRaw = await fs.readFile(pkgPath, "utf-8").catch(() => "");
    if (pkgRaw) {
      const pkg = JSON.parse(pkgRaw);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      
      // Known demo CVE checks
      const cveChecks = [
        { name: "axios", vulnerablePattern: /^0\./, cve: "CVE-2023-45857", severity: "HIGH", title: "CSRF / SSRF vulnerability in Axios < 1.6.0" },
        { name: "lodash", vulnerablePattern: /^4\.(17\.[0-20]|[0-16])/, cve: "CVE-2021-23337", severity: "HIGH", title: "Prototype Pollution in Lodash < 4.17.21" },
        { name: "jsonwebtoken", vulnerablePattern: /^([0-8]\.|9\.0\.0)/, cve: "CVE-2022-23529", severity: "HIGH", title: "Insecure Key Verification in JsonWebToken < 9.0.0" }
      ];

      for (const check of cveChecks) {
        if (deps[check.name] && check.vulnerablePattern.test(deps[check.name].replace(/[\^~]/, ""))) {
          vulnerabilities.push({
            target: "package.json",
            id: check.cve,
            severity: check.severity,
            title: check.title,
            package: check.name,
            installedVersion: deps[check.name],
            fix: `Nâng cấp gói ${check.name} lên phiên bản mới nhất (npm update ${check.name}).`
          });
        }
      }
    }
  } catch {}

  return JSON.stringify({
    engine: "Trivy SCA Engine (Built-in Heuristic)",
    isInstalled: false,
    installTip: "Để dùng bản binary chính thức: 'winget install AquaSecurity.Trivy' hoặc 'brew install trivy'.",
    totalVulnerabilities: vulnerabilities.length,
    vulnerabilities: vulnerabilities.length > 0 ? vulnerabilities : "Không phát hiện lỗ hổng CVE phổ biến trong dependencies hay Dockerfile."
  });
}

/**
 * 4. Nmap Network & Service Scanner (Authorized Lab Targets Only)
 */
export async function runNmapScan({ targetHost = "127.0.0.1", ports = "80,443,8080,3000,22", flags = "-sV" }) {
  // Enforce authorized ethical target constraint
  const safeHosts = ["localhost", "127.0.0.1", "::1", "scanme.nmap.org"];
  const isSafeHost = safeHosts.some(h => targetHost.toLowerCase().includes(h)) || targetHost.startsWith("192.168.") || targetHost.startsWith("10.");
  
  if (!isSafeHost) {
    return JSON.stringify({
      error: `Chính sách an toàn đạo đức: Nmap chỉ được quét các mục tiêu Lab hợp pháp (localhost, 127.0.0.1, scanme.nmap.org hoặc mạng lab riêng). Mục tiêu "${targetHost}" không được cấp phép.`
    });
  }

  const isInstalled = await isCliAvailable("nmap");

  if (isInstalled) {
    try {
      const sanitizedPorts = ports.replace(/[^0-9,-]/g, "");
      const { stdout } = await execAsync(`nmap -p ${sanitizedPorts} ${flags} ${targetHost}`, {
        timeout: 30000
      });
      return JSON.stringify({
        engine: "Nmap CLI (Official)",
        isInstalled: true,
        target: targetHost,
        rawOutput: stdout
      });
    } catch (err) {
      return JSON.stringify({ error: `Nmap scan error: ${err.message}` });
    }
  }

  // Built-in Nmap Educational Simulation & Port Inspector
  const portExplanations = {
    "22": { service: "SSH", state: "FILTERED", pentestAngle: "Tìm kiếm bruteforce mật khẩu yếu hoặc chứng thực khóa cũ.", devSecOpsMitigation: "Đổi sang xác thực SSH Key, vô hiệu hóa PasswordAuthentication và đặt đằng sau VPN/Bastion Host." },
    "80": { service: "HTTP", state: "OPEN", pentestAngle: "Kiểm tra thiếu HTTP Security Headers (HSTS, CSP), quét thư mục ẩn (gobuster) và kiểm tra lỗ hổng OWASP.", devSecOpsMitigation: "Cấu hình tự động redirect sang HTTPS (301) và thêm Strict-Transport-Security header trong Nginx/Cloudflare." },
    "443": { service: "HTTPS", state: "OPEN", pentestAngle: "Kiểm tra phiên bản TLS cũ (TLS 1.0, 1.1) và các chứng chỉ hết hạn.", devSecOpsMitigation: "Enforce TLS 1.2+ và dùng Certbot/Let's Encrypt tự động gia hạn chứng chỉ." },
    "3000": { service: "Node.js / React Dev Server", state: "OPEN", pentestAngle: "Thường là cổng dev bị expose ra ngoài, có thể chứa debug endpoints hoặc thông tin nhạy cảm.", devSecOpsMitigation: "Đóng cổng 3000 bằng firewall (UFW/Security Group), chỉ expose qua Reverse Proxy." },
    "8080": { service: "HTTP-Proxy / Jenkins / Tomcat", state: "CLOSED", pentestAngle: "Cổng quản trị phổ biến, thường bị tấn công dò tìm trang login admin mặc định.", devSecOpsMitigation: "Không để trang quản trị ra Internet công cộng; áp dụng MFA và SSO (Okta/Keycloak)." }
  };

  const requestedPorts = ports.split(",").map(p => p.trim());
  const scanReport = requestedPorts.map(p => ({
    port: p,
    service: portExplanations[p]?.service || "Unknown",
    state: portExplanations[p]?.state || "CLOSED",
    pentestAngle: portExplanations[p]?.pentestAngle || "Trinh sát phiên bản dịch vụ để tìm CVE khai thác tương ứng.",
    devSecOpsMitigation: portExplanations[p]?.devSecOpsMitigation || "Áp dụng nguyên tắc Least Privilege, chỉ mở cổng cần thiết qua Firewall."
  }));

  return JSON.stringify({
    engine: "Nmap Educational Engine (Simulated)",
    isInstalled: false,
    installTip: "Để chạy Nmap thật trên máy tính của bạn: 'winget install Insecure.Nmap' hoặc tải tại https://nmap.org/download.html.",
    target: targetHost,
    scannedPorts: scanReport
  });
}

// Helpers
async function getFilesRecursively(dir) {
  let results = [];
  try {
    const list = await fs.readdir(dir, { withFileTypes: true });
    for (const file of list) {
      const fullPath = path.resolve(dir, file.name);
      if (file.isDirectory()) {
        if (!file.name.startsWith(".") && file.name !== "node_modules") {
          results = results.concat(await getFilesRecursively(fullPath));
        }
      } else {
        results.push(fullPath);
      }
    }
  } catch {}
  return results;
}

async function readDirectoryContent(dir) {
  const files = await getFilesRecursively(dir);
  let aggregate = "";
  for (const f of files.slice(0, 10)) {
    const c = await fs.readFile(f, "utf-8").catch(() => "");
    aggregate += `\n--- File: ${f} ---\n` + c;
  }
  return aggregate;
}

# 🛡️ Khakhapkhun AI - Đa Chế Độ (Multi-Mode AI Agent)

Trợ lý & Hệ thống AI đa năng hoàn toàn miễn phí, hỗ trợ 3 chế độ hoạt động chuyên sâu bằng **Tiếng Việt**:

- **🛡️ Mode 1: Gia sư Pentest & DevSecOps**:
  - *Tấn công (Pentest)*: Thu thập thông tin (Recon), Lỗ hổng Web (OWASP Top 10), Leo thang đặc quyền (PrivEsc) và tích hợp các công cụ Kali Linux (Nmap, Nikto, Sqlmap, Gobuster, Metasploit, Hydra).
  - *Phòng thủ (DevSecOps)*: Triết lý Shift-Left, quét lộ lọt Secret (Gitleaks), quét mã tĩnh SAST (Semgrep), quét phụ thuộc SCA (Trivy), rà soát Dockerfile và pipeline CI/CD.
- **📈 Mode 2: Trading Gold and Coin (Block-chain)**:
  - *Vàng thế giới (XAU/USD)*: Phân tích kỹ thuật Price Action, Smart Money Concepts (SMC: Order Block, FVG, Liquidity), vĩ mô DXY, lãi suất Fed (FOMC), lạm phát CPI/NFP.
  - *Crypto & Blockchain*: Chu kỳ Bitcoin Halving 4 năm, On-chain data, Whale tracking, Tokenomics, cơ chế đồng thuận PoW/PoS, EVM, Layer 2, DeFi, AMM DEX, bảo mật ví lạnh/ví nóng.
  - *Kỷ luật Quản lý vốn*: Tính toán khối lượng vào lệnh (Position Sizing) kiểm soát rủi ro nghiêm ngặt 1-2% tài khoản, phân tích tỷ lệ Risk:Reward (R:R), các mốc Fibonacci Retracement & Extension.
- **💻 Mode 3: Learning Dev (Lập trình & Kiến trúc phần mềm)**:
  - *Cấu trúc dữ liệu & Thuật toán (DSA)*: Array, Linked List, Tree, Graph, Hash Map, Dynamic Programming, Two Pointers, phân tích độ phức tạp Big-O.
  - *Kỹ nghệ phần mềm*: Clean Code, 5 nguyên lý SOLID, Design Patterns (Creational, Structural, Behavioral), tạo khung cấu trúc Clean Architecture & MVC.
  - *Fullstack Web*: TypeScript, Next.js, Node.js/Express, Python/FastAPI, Go, Database SQL (PostgreSQL index/query optimization) & NoSQL (MongoDB, Redis), Docker & CI/CD.

- **Đọc hiểu tài liệu đa định dạng (Document Learning)**:
  - Tải lên file nội bộ: `.pdf`, `.docx`, `.txt`, `.md`, `.yaml`, `.json`, `.csv`.
  - **Nạp trực tiếp từ liên kết (URL Docs Learning)**: Dán link trang web tài liệu hoặc link file PDF trực tuyến (công cụ `learnFromUrl` và nút 🔗 trên Web UI) để AI tự động trích xuất và nạp vào bộ nhớ.
- **Hoàn toàn miễn phí**: Sử dụng Google Gemini API Free Tier (tự động chuyển đổi giữa các free models khi gặp giới hạn hạn mức).

---

## 🎯 3 Chế Độ Hoạt Động (Modes)

| Chế độ (Mode) | Trọng tâm chuyên môn | Công cụ chuyên biệt tích hợp |
| :--- | :--- | :--- |
| **Mode 1: Pentest & DevSecOps** | Kiểm thử bảo mật, OWASP Top 10, DevSecOps Shift-Left, rà soát lỗ hổng. | `runNmapScan`, `runNiktoScan`, `runSqlmapScan`, `runGitleaksScan`, `runSemgrepScan`, `runTrivyScan`, `listKaliTools`. |
| **Mode 2: Trading Gold & Coin** | Phân tích kỹ thuật Vàng XAU/USD, Crypto, Blockchain, On-chain, Quản lý vốn. | `calculatePositionSize`, `analyzeRiskReward`, `calculateFibonacciLevels`, `getCryptoMarketOverview`. |
| **Mode 3: Learning Dev** | Fullstack Development, Giải thuật DSA, Clean Code, SOLID, Design Patterns. | `explainAlgorithmComplexity`, `generateProjectStructure`, `auditCodeSnippet`. |

---

## 📚 Lộ Trình Học Tập Tích Hợp

| Lộ trình (Track) | Nội dung trọng tâm | Công cụ & Lab thực hành |
| :--- | :--- | :--- |
| **Track 1: Nền tảng Pentest** | Quy trình PTES, Quét mạng với Nmap, Lỗ hổng Web OWASP Top 10 (SQLi, Command Injection, XSS, SSRF, IDOR), Leo thang đặc quyền Linux/Windows. | PortSwigger Academy, DVWA, TryHackMe |
| **Track 2: DevSecOps & CI/CD** | Triết lý Shift-Left, Quét lộ lọt Secret, Quét mã tĩnh SAST, Phân tích phụ thuộc SCA (SBOM), Cổng kiểm soát DAST. | Gitleaks, Semgrep, Trivy, SonarQube, OWASP ZAP |
| **Track 3: Bảo mật Container & Cloud** | Tối ưu Dockerfile không dùng root, hình ảnh distroless, chuẩn CIS Benchmarks, Quét hạ tầng IaC (Terraform) và Policy-as-Code. | Checkov, tfsec, Trivy, Kyverno, OPA |

---

## 🚀 Hướng Dẫn Khởi Động Nhanh

### 1. Cấu hình Gemini API Key miễn phí
Mở file [`.env`](.env) và điền key của bạn từ [Google AI Studio](https://aistudio.google.com/):
```env
GEMINI_API_KEY=your_gemini_key_here
```

### 2. Chạy Ứng Dụng Web App (Giao diện ChatGPT / Gemini UI)
Trải nghiệm trực quan với giao diện Web App chuyên nghiệp, hỗ trợ upload file PDF/Word, code highlighting và gọi tool tự động:
```powershell
npm start
# Hoặc: node --env-file=.env server.mjs
```
👉 Mở trình duyệt tại: **`http://localhost:3000`**

---

### 3. Các Chế Độ Chạy Khác

**Chế độ Terminal CLI:**
```powershell
npm run cli
# Mặc định: Mode 1 (Pentest & DevSecOps)
node --env-file=.env agent.mjs

# Chạy Mode 2: Trading Gold & Coin
node --env-file=.env agent.mjs --mode=trading

# Chạy Mode 3: Learning Dev
node --env-file=.env agent.mjs --mode=dev
```

**Đặt câu hỏi nhanh qua dòng lệnh (CLI):**
```powershell
node --env-file=.env agent.mjs "Hãy giới thiệu lộ trình Track 2 và giải thích cách hoạt động của SAST."
```

**Chạy kiểm tra sức khỏe hệ thống (Self-test không cần API key):**
```powershell
npm test
```

---

## 💡 Gợi Ý Câu Hỏi Cho Khakhapkhun AI:
- *"Hãy liệt kê tất cả các track học và gợi ý lộ trình bắt đầu cho người mới."*
- *"Hãy dạy tôi module secops-201 và hướng dẫn cấu hình Gitleaks trong GitHub Actions."*
- *"Kiểm tra bảo mật file Dockerfile này giúp tôi: FROM node:latest \n USER root"*
- *"Giải thích cơ chế tấn công SQL Injection và cách công cụ SAST như Semgrep phát hiện nó."*
- *"Tạo cho tôi một bài kiểm tra trắc nghiệm 3 câu hỏi về bảo mật container Docker."*

---

## 🛠️ Danh Sách Công Cụ Tự Động Tích Hợp:
1. **`runGitleaksScan`**: Tự động quét repository/thư mục phát hiện rò rỉ API key, private key, secret và token bị bỏ quên trong Git.
2. **`runSemgrepScan`**: Quét mã tĩnh SAST phát hiện các lỗ hổng OWASP Top 10 (SQLi, Command Injection, Insecure Deserialization, Path Traversal) trên code hoặc file.
3. **`runTrivyScan`**: Quét lỗ hổng bảo mật CVE trong thư viện (`package.json`) và rà soát cấu hình Dockerfile (chạy root, tag `:latest`).
4. **`runNmapScan`**: Quét cổng và dịch vụ mạng trên các mục tiêu Lab hợp pháp (`localhost`, `127.0.0.1`, `scanme.nmap.org`), giải thích cờ lệnh và cách cấu hình firewall phòng thủ.
5. `listCurriculumTracks`: Xem danh sách tất cả các lộ trình bài học Pentest & DevSecOps.
6. `getCurriculumLesson`: Tải chi tiết bài học lý thuyết và lab thực hành an toàn.
7. `auditCodeSnippet`: Tự động rà soát nhanh mã nguồn hoặc Dockerfile.
8. `searchWeb`: Tra cứu kiến thức an ninh mạng và cơ sở dữ liệu CVE.
9. `calculate`: Máy tính biểu thức số học an toàn.
10. `writeFile` & `readFile`: Ghi chép tài liệu học tập vào máy tính.
11. `listFiles` & `getCurrentTime`: Kiểm tra file và thời gian hệ thống.

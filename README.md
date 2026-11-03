# 🛡️ Khakhapkhun AI: Pentest & DevSecOps (Tiếng Việt)

Trợ lý & Khakhapkhun AI hoàn toàn miễn phí, hỗ trợ đào tạo chuyên sâu về **Kiểm thử thâm nhập (Penetration Testing / Ethical Hacking)** và **Tự động hóa bảo mật CI/CD (DevSecOps)** bằng **Tiếng Việt**.

- **Phương pháp đào tạo 2 chiều (Dual-Perspective)**:
  - *Góc nhìn Tấn công (Pentest)*: Hiểu cách hacker thu thập thông tin (Recon), khai thác lỗ hổng Web (OWASP Top 10) và leo thang đặc quyền (PrivEsc).
  - *Góc nhìn Phòng thủ (DevSecOps)*: Áp dụng triết lý "Shift-Left", cấu hình các cổng kiểm soát bảo mật tự động (Secret Scanning, SAST, SCA, DAST, Container Hardening) trong pipeline GitHub Actions / GitLab CI.
- **Giáo trình tích hợp sẵn (`curriculum.mjs`)**: Lộ trình bài bản kèm hướng dẫn thực hành trên các phòng lab hợp pháp (PortSwigger Web Security Academy, OWASP Juice Shop, DVWA, TryHackMe).
- **Bộ công cụ bảo mật tích hợp**: Tự động rà soát mã nguồn & Dockerfile, tra cứu CVE, tính toán và ghi chép bài học vào workspace.
- **Hoàn toàn miễn phí**: Sử dụng Google Gemini API Free Tier (1,500 requests/ngày).

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
# Hoặc: node --env-file=.env agent.mjs
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

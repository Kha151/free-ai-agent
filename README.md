# 🛡️ Gia Sư AI: Pentest & DevSecOps (Tiếng Việt)

Trợ lý & Gia sư AI hoàn toàn miễn phí, hỗ trợ đào tạo chuyên sâu về **Kiểm thử thâm nhập (Penetration Testing / Ethical Hacking)** và **Tự động hóa bảo mật CI/CD (DevSecOps)** bằng **Tiếng Việt**.

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

### 2. Chạy Gia Sư AI

**Chế độ Chat trực tiếp (Hỏi đáp & Học tập tương tác):**
```powershell
node --env-file=.env agent.mjs
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

## 💡 Gợi Ý Câu Hỏi Cho Gia Sư AI:
- *"Hãy liệt kê tất cả các track học và gợi ý lộ trình bắt đầu cho người mới."*
- *"Hãy dạy tôi module secops-201 và hướng dẫn cấu hình Gitleaks trong GitHub Actions."*
- *"Kiểm tra bảo mật file Dockerfile này giúp tôi: FROM node:latest \n USER root"*
- *"Giải thích cơ chế tấn công SQL Injection và cách công cụ SAST như Semgrep phát hiện nó."*
- *"Tạo cho tôi một bài kiểm tra trắc nghiệm 3 câu hỏi về bảo mật container Docker."*

---

## 🛠️ Danh Sách Công Cụ Tự Động:
1. `listCurriculumTracks`: Xem danh sách tất cả các lộ trình bài học.
2. `getCurriculumLesson`: Tải chi tiết bài học lý thuyết và lab thực hành an toàn.
3. `auditCodeSnippet`: Tự động rà soát mã nguồn hoặc Dockerfile, chỉ ra lỗ hổng CWE và cách chặn trong CI/CD.
4. `searchWeb`: Tra cứu kiến thức an ninh mạng và cơ sở dữ liệu CVE.
5. `calculate`: Máy tính biểu thức số học an toàn.
6. `writeFile` & `readFile`: Ghi chép tài liệu học tập vào máy tính.
7. `listFiles` & `getCurrentTime`: Kiểm tra file và thời gian hệ thống.

# 🛡️ Free Pentest & DevSecOps Master Tutor Bot

An autonomous, 100% free AI agent that trains you in both **Penetration Testing (Ethical Hacking)** and **DevSecOps (Automated CI/CD Security)**.

- **Dual-Perspective Pedagogy**:
  - *Offensive Lens (Pentesting)*: Understand how attackers exploit vulnerabilities, perform reconnaissance, and escalate privileges.
  - *Defensive Lens (DevSecOps)*: Learn how to "Shift Left" and build automated security guardrails (SAST, SCA, DAST, Secret Scanning, Container Hardening) into CI/CD pipelines.
- **Embedded Curriculum**: Structured tracks with hands-on lab exercises (OWASP Juice Shop, DVWA, PortSwigger Web Security Academy, TryHackMe).
- **Automated Security Tools**: Built-in static code & Dockerfile security auditor, curriculum guide, DuckDuckGo/Wikipedia knowledge base, and math calculator.
- **Zero Cost**: Runs on Google Gemini API free tier (1,500 requests/day).

---

## 📚 Curriculum Tracks

| Track | Topics Covered | Key Tools & Labs |
| :--- | :--- | :--- |
| **Track 1: Pentest Fundamentals** | PTES, Nmap Recon, OWASP Top 10 (SQLi, Command Injection, XSS, SSRF, IDOR), Linux/Windows PrivEsc | PortSwigger Academy, DVWA, TryHackMe |
| **Track 2: DevSecOps & CI/CD** | Shift-Left philosophy, Secret Scanning, SAST, SCA (SBOM), DAST security gates | Gitleaks, Semgrep, Trivy, SonarQube, OWASP ZAP |
| **Track 3: Container & Cloud Security** | Non-root Dockerfiles, minimal distroless base images, CIS Benchmarks, IaC scanning, Policy-as-Code | Checkov, tfsec, Trivy, Kyverno, OPA |

---

## 🚀 Quick Start

### 1. Configure Your Free API Key
Open `.env` and add your free Google AI Studio key:
```env
GEMINI_API_KEY=your_key_here
```

### 2. Run the Tutor Bot

**Interactive Tutor Mode (Chat & Ask Questions):**
```powershell
node --env-file=.env agent.mjs
```

**One-Shot Lesson Query:**
```powershell
node --env-file=.env agent.mjs "Give me an overview of Track 1 and explain IDOR vulnerabilities."
```

**Zero API Key Self-Test (Tests all 8 tools locally):**
```powershell
npm test
```

---

## 🧪 Try Asking the Tutor:
- *"Show me all available curriculum tracks."*
- *"Give me the lesson for module secops-201 and explain how to set up Gitleaks."*
- *"Audit this Dockerfile: FROM node:latest \n USER root"*
- *"Explain how SQL injection occurs in Python and show me how a SAST tool like Semgrep detects it."*
- *"Give me a quiz on container security."*

---

## 🛠️ Built-in Agent Tools
1. `listCurriculumTracks`: Lists available syllabus tracks.
2. `getCurriculumLesson`: Pulls detailed lessons and recommended hands-on labs.
3. `auditCodeSnippet`: Scans code or Dockerfiles for high-risk security flaws and DevSecOps checks.
4. `searchWeb`: Free knowledge and CVE lookup.
5. `calculate`: Safe math evaluator.
6. `writeFile` & `readFile`: Workspace note taking.
7. `listFiles` & `getCurrentTime`: Workspace file & time inspector.

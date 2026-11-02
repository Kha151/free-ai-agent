/**
 * Comprehensive Pentest & DevSecOps Training Curriculum
 */
export const CURRICULUM = {
  tracks: [
    {
      id: "pentest-fundamentals",
      title: "Track 1: Penetration Testing Fundamentals",
      description: "Offensive security methodologies, web application testing, and privilege escalation basics.",
      modules: [
        {
          id: "pt-101",
          title: "Methodologies & Reconnaissance",
          concepts: [
            "PTES (Penetration Testing Execution Standard)",
            "OSINT & Active Reconnaissance (Nmap, DNS enum, subdomain discovery)",
            "Service version detection & vulnerability mapping",
          ],
          labRecommendation: "TryHackMe: Nmap room / OverTheWire: Bandit for Linux command line proficiency.",
        },
        {
          id: "pt-102",
          title: "OWASP Top 10 Web Vulnerabilities",
          concepts: [
            "A01: Broken Access Control & IDOR",
            "A03: Injection (SQLi, Command Injection, LDAP)",
            "A07: Identification and Authentication Failures (JWT manipulation, brute force mitigations)",
            "Server-Side Request Forgery (SSRF) and Cross-Site Scripting (XSS)",
          ],
          labRecommendation: "PortSwigger Web Security Academy & OWASP Juice Shop in Docker.",
        },
        {
          id: "pt-103",
          title: "Privilege Escalation Basics",
          concepts: [
            "Linux PrivEsc: SUID binaries, misconfigured sudoers, cron jobs, writable /etc/passwd",
            "Windows PrivEsc: Unquoted service paths, token impersonation, weak permissions",
          ],
          labRecommendation: "TryHackMe: Linux PrivEsc & Windows PrivEsc rooms.",
        },
      ],
    },
    {
      id: "devsecops-pipeline",
      title: "Track 2: DevSecOps & CI/CD Pipeline Security",
      description: "Integrating automated security guardrails into development lifecycles (Shift Left).",
      modules: [
        {
          id: "secops-201",
          title: "The Shift-Left Paradigm & Secret Scanning",
          concepts: [
            "Shift Left Philosophy: Catching security bugs before deployment",
            "Automated Secret Detection (Gitleaks, Trufflehog) in pre-commit hooks and GitHub Actions",
            "Securing CI/CD credentials (GitHub Secrets, HashiCorp Vault, OIDC tokens)",
          ],
          labRecommendation: "Set up Gitleaks in a test GitHub repository pre-commit hook.",
        },
        {
          id: "secops-202",
          title: "Automated Code Analysis (SAST & SCA)",
          concepts: [
            "Static Application Security Testing (SAST): Using Semgrep, SonarQube, CodeQL to detect flawed patterns",
            "Software Composition Analysis (SCA): Scanning third-party dependencies with Trivy or Snyk for CVEs",
            "Software Bill of Materials (SBOM) generation (CycloneDX, SPDX)",
          ],
          labRecommendation: "Write a GitHub Action pipeline that runs Semgrep and Trivy on every pull request.",
        },
        {
          id: "secops-203",
          title: "Dynamic Analysis (DAST) & Security Gates",
          concepts: [
            "DAST in staging environments using OWASP ZAP (Baseline vs Full scan)",
            "Quality Gates: Blocking production merges on Critical/High severity findings",
            "Vulnerability Management: Centralizing findings with DefectDojo",
          ],
          labRecommendation: "Run OWASP ZAP Docker baseline scan against a locally hosted Juice Shop instance.",
        },
      ],
    },
    {
      id: "cloud-container-security",
      title: "Track 3: Container & Cloud Infrastructure Security",
      description: "Hardening Docker containers, Kubernetes clusters, and Infrastructure as Code.",
      modules: [
        {
          id: "cloud-301",
          title: "Docker Hardening & Container Scanning",
          concepts: [
            "Multi-stage builds and minimal/distroless base images (Chainguard, Alpine)",
            "Running containers as non-root users (`USER 10001`)",
            "Dropping Linux capabilities and enforcing read-only root filesystems",
            "Scanning container images for vulnerabilities using Trivy / Grype",
          ],
          labRecommendation: "Audit an insecure Dockerfile and rewrite it following CIS Docker Benchmarks.",
        },
        {
          id: "cloud-302",
          title: "Infrastructure as Code (IaC) Security & Policy-as-Code",
          concepts: [
            "Static analysis of Terraform / CloudFormation with Checkov, tfsec, and Kics",
            "Preventing public S3 buckets, wide-open security groups (0.0.0.0/0), and unencrypted volumes",
            "Policy-as-Code with Open Policy Agent (OPA) / Rego and Kyverno for Kubernetes",
          ],
          labRecommendation: "Scan sample Terraform files with Checkov and write an automated remediation.",
        },
      ],
    },
  ],
};


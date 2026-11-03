/**
 * Danh sách toàn diện các công cụ Pentest trong Kali Linux
 * Kèm phân loại, mục đích, cú pháp lệnh thực thi mẫu và hướng dẫn phòng thủ DevSecOps.
 */
export const KALI_TOOLS_CATALOG = [
  // --- 1. Information Gathering & Reconnaissance ---
  {
    name: "Nmap",
    category: "Reconnaissance & Network Scanning",
    description: "Công cụ quét mạng, phát hiện host, cổng mở, dịch vụ và phiên bản OS số 1 thế giới.",
    sampleCommand: "nmap -sV -sC -p 80,443,8080 <target_ip>",
    usageGuide: "Dùng để xác định các cổng mở và phiên bản phần mềm chạy trên mục tiêu nhằm tra cứu CVE tồn tại.",
    devSecOpsMitigation: "Cấu hình tường lửa chặn cổng không sử dụng, bật port knocking hoặc chỉ expose dịch vụ qua VPN/Bastion Host.",
    wrapperTool: "runNmapScan"
  },
  {
    name: "WhatWeb",
    category: "Web Reconnaissance & Fingerprinting",
    description: "Nhận diện công nghệ web: CMS (WordPress, Drupal), Web Server (Nginx, Apache), Frameworks và thư viện JavaScript.",
    sampleCommand: "whatweb -a 3 http://<target_url>",
    usageGuide: "Giúp xác định nhanh stack công nghệ của ứng dụng web mục tiêu để khoanh vùng hướng tấn công.",
    devSecOpsMitigation: "Xóa hoặc ẩn các Server header (Server Tokens Off), ẩn phiên bản framework trong HTTP response headers.",
    wrapperTool: "runKaliCommand"
  },
  {
    name: "DNSutils (dig / nslookup / host)",
    category: "DNS Reconnaissance",
    description: "Truy vấn bản ghi DNS (A, MX, TXT, NS, SOA) và kiểm tra lỗ hổng Zone Transfer (AXFR).",
    sampleCommand: "dig axfr @<dns_server> <domain.com>",
    usageGuide: "Kiểm tra cấu hình DNS sai dẫn đến lộ toàn bộ sơ đồ mạng con nội bộ của tổ chức.",
    devSecOpsMitigation: "Vô hiệu hóa Zone Transfer (AXFR) công khai trên DNS Server chính và phụ.",
    wrapperTool: "runKaliCommand"
  },
  {
    name: "Whois",
    category: "OSINT & Domain Reconnaissance",
    description: "Tra cứu thông tin chủ sở hữu tên miền, nhà đăng ký, dải IP ASN và thông tin liên hệ kỹ thuật.",
    sampleCommand: "whois <domain_hoac_ip>",
    usageGuide: "Thu thập thông tin ban đầu để xây dựng kịch bản Social Engineering hoặc xác định dải IP thuộc quyền quản lý.",
    devSecOpsMitigation: "Bật dịch vụ WHOIS Privacy Protection để ẩn thông tin cá nhân và email kỹ thuật.",
    wrapperTool: "runKaliCommand"
  },

  // --- 2. Web Application Analysis ---
  {
    name: "Nikto",
    category: "Web Server Vulnerability Scanner",
    description: "Quét web server phát hiện hơn 6700 file nguy hiểm, file cấu hình mặc định cũ, phiên bản server lỗi thời.",
    sampleCommand: "nikto -h http://<target_url> -p 80,443",
    usageGuide: "Chạy kiểm tra tự động các tệp tin cấu hình nhạy cảm bị bỏ quên (như .git, backup.zip, phpinfo.php, v.v.).",
    devSecOpsMitigation: "Cấu hình chặn truy cập file ẩn trong Nginx/Apache, tích hợp SAST/DAST trong pipeline CI/CD để chặn file thừa.",
    wrapperTool: "runNiktoScan"
  },
  {
    name: "sqlmap",
    category: "Database & SQL Injection Exploitation",
    description: "Công cụ tự động phát hiện và khai thác lỗ hổng SQL Injection để trích xuất database hoặc chiếm quyền shell.",
    sampleCommand: "sqlmap -u 'http://<target_url>/item?id=1' --batch --dbs",
    usageGuide: "Kiểm tra tính an toàn của các tham số đầu vào GET/POST/Cookie trước các kỹ thuật SQLi (Boolean, Error, Time-based).",
    devSecOpsMitigation: "Bắt buộc sử dụng Parameterized Queries (Prepared Statements) hoặc ORM, tuyệt đối không nối chuỗi SQL.",
    wrapperTool: "runSqlmapScan"
  },
  {
    name: "Dirb",
    category: "Web Directory & File Brute-Forcing",
    description: "Dò tìm đường dẫn thư mục và file ẩn trên web server dựa trên danh sách từ điển (wordlist).",
    sampleCommand: "dirb http://<target_url> /usr/share/wordlists/dirb/common.txt",
    usageGuide: "Tìm kiếm các endpoint quản trị (/admin), trang đăng nhập ẩn hoặc tài liệu nội bộ chưa khóa quyền.",
    devSecOpsMitigation: "Áp dụng kiểm soát truy cập nghiêm ngặt (403 Forbidden), vô hiệu hóa Directory Listing trên Web Server.",
    wrapperTool: "runDirbScan"
  },
  {
    name: "Gobuster",
    category: "High-Speed Directory & Subdomain Enumeration",
    description: "Công cụ viết bằng Go tốc độ cao để brute-force đường dẫn web, vhost và subdomain.",
    sampleCommand: "gobuster dir -u http://<target_url> -w /usr/share/wordlists/dirb/common.txt -t 20",
    usageGuide: "Quét nhanh hàng nghìn URI trong vài giây để phát hiện các module hoặc API endpoint bị ẩn.",
    devSecOpsMitigation: "Cấu hình Rate Limiting (WAF/Cloudflare) để chặn các cuộc quét brute-force tần suất cao.",
    wrapperTool: "runGobusterScan"
  },
  {
    name: "Wfuzz",
    category: "Web Application Fuzzing",
    description: "Fuzzing tham số web HTTP: fuzz tham số URL, POST data, HTTP Headers để tìm lỗi Injection và BOLA/IDOR.",
    sampleCommand: "wfuzz -c -z file,/usr/share/wordlists/dirb/common.txt --hc 404 http://<target_url>/FUZZ",
    usageGuide: "Kiểm tra tính linh hoạt của các tham số API và phát hiện các tham số debug bị ẩn.",
    devSecOpsMitigation: "Validate dữ liệu đầu vào theo allow-list (schema validation) qua API Gateway.",
    wrapperTool: "runKaliCommand"
  },

  // --- 3. Vulnerability Exploitation & Frameworks ---
  {
    name: "Metasploit Framework (msfconsole)",
    category: "Penetration Testing & Exploitation Framework",
    description: "Framework kiểm thử thâm nhập lớn nhất thế giới chứa hàng nghìn module exploit, scanner và payload.",
    sampleCommand: "msfconsole -q -x 'use auxiliary/scanner/portscan/tcp; set RHOSTS <target_ip>; run; exit'",
    usageGuide: "Dùng để xác thực tính khả thi của lỗ hổng (PoC - Proof of Concept) xem lỗ hổng có thực sự khai thác được không.",
    devSecOpsMitigation: "Cập nhật bản vá hệ điều hành và phần mềm thường xuyên, chạy SCA định kỳ (Trivy) để vá lỗ hổng trước khi bị exploit.",
    wrapperTool: "runMetasploitScan"
  },
  {
    name: "Hydra",
    category: "Network Login Brute-Forcer",
    description: "Công cụ bẻ khóa đăng nhập mạng siêu tốc hỗ trợ SSH, FTP, Telnet, RDP, HTTP-POST-FORM, SMB, v.v.",
    sampleCommand: "hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://<target_ip>",
    usageGuide: "Kiểm tra độ mạnh của mật khẩu hệ thống quản trị nội bộ trong bài test đánh giá nội bộ.",
    devSecOpsMitigation: "Bật xác thực đa yếu tố (MFA), khóa tài khoản sau 5 lần thử sai (Account Lockout), dùng SSH key thay vì mật khẩu.",
    wrapperTool: "runKaliCommand"
  },
  {
    name: "Netcat (nc)",
    category: "Swiss Army Knife for TCP/IP",
    description: "Đọc và ghi dữ liệu qua kết nối mạng TCP/UDP, tạo reverse shell, bind shell và port listener.",
    sampleCommand: "nc -lvnp 4444",
    usageGuide: "Lắng nghe kết nối trả về (reverse shell handler) khi kiểm thử lỗ hổng RCE trong môi trường lab.",
    devSecOpsMitigation: "Cấu hình Egress Filtering trên Firewall: chỉ cho phép máy chủ tạo kết nối ra ngoài qua các cổng cần thiết.",
    wrapperTool: "runKaliCommand"
  },
  {
    name: "Curl & Wget",
    category: "HTTP Client & API Testing",
    description: "Gửi request HTTP tùy chỉnh, kiểm tra headers bảo mật, gửi payload JSON và kiểm tra SSRF.",
    sampleCommand: "curl -I -X GET http://<target_url>",
    usageGuide: "Kiểm tra sự hiện diện của các HTTP Security Headers: Content-Security-Policy, HSTS, X-Frame-Options.",
    devSecOpsMitigation: "Bật đầy đủ các HTTP Security Headers chuẩn OWASP Secure Headers Project trong reverse proxy.",
    wrapperTool: "runKaliCommand"
  }
];

/**
 * Trả về danh sách công cụ Kali đã phân loại hoặc tìm kiếm theo từ khóa
 */
export async function listKaliTools({ category = "", keyword = "" }) {
  let results = KALI_TOOLS_CATALOG;

  if (category) {
    const cleanCat = category.toLowerCase();
    results = results.filter(t => t.category.toLowerCase().includes(cleanCat));
  }

  if (keyword) {
    const cleanKw = keyword.toLowerCase();
    results = results.filter(t =>
      t.name.toLowerCase().includes(cleanKw) ||
      t.description.toLowerCase().includes(cleanKw) ||
      t.category.toLowerCase().includes(cleanKw) ||
      t.sampleCommand.toLowerCase().includes(cleanKw)
    );
  }

  return JSON.stringify({
    totalTools: results.length,
    tools: results
  });
}

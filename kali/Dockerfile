# Dockerfile – Kali Linux với các công cụ Pentest phổ biến
# Build: docker build -t free-ai-kali ./kali
# Run:   docker run -d --name free-ai-kali free-ai-kali
FROM kalilinux/kali-rolling:latest

# Cài đặt các công cụ pentest thường dùng
RUN apt-get update && apt-get install -y --no-install-recommends \
    nmap \
    nikto \
    sqlmap \
    dirb \
    gobuster \
    whatweb \
    wfuzz \
    curl \
    wget \
    git \
    net-tools \
    iputils-ping \
    dnsutils \
    whois \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Tạo người dùng không root (an toàn hơn)
ARG USERNAME=agent
ARG USER_UID=1000
ARG USER_GID=1000
RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME

USER $USERNAME
WORKDIR /home/$USERNAME

# Container luôn chạy (để Agent có thể exec vào)
CMD ["sleep", "infinity"]

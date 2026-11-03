# Tài Liệu Đã Học: Tài liệu bảo mật API mẫu
- **File gốc**: `sample_api_security.md`
- **Định dạng**: `.md`
- **Số từ**: ~101 từ
- **Thời gian học**: 2026-11-03T01:59:05.877Z

## Nội dung trích xuất
```text
# Hướng Dẫn Kiểm Thử Bảo Mật API (OWASP API Security)

## 1. Lỗ hổng BOLA (Broken Object Level Authorization)
- Khái niệm: Xảy ra khi API endpoint không kiểm tra quyền sở hữu đối tượng dựa trên user ID gửi lên.
- Pentest: Thay đổi id người dùng trên URL `/api/v1/users/{id}/profile` để đọc thông tin người dùng khác.
- DevSecOps: Luôn kiểm tra `session.user.id === requested.user.id` trong middleware xác thực.

## 2. Lỗ hổng Broken Authentication
- Thiếu giới hạn số lần thử đăng nhập (Rate limit).
- Token JWT không kiểm tra chữ ký hoặc dùng thuật toán `none`.

```

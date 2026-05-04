##🚀 WebCuaDuy - E-Commerce Fullstack Project
<img width="1024" height="559" alt="image" src="https://github.com/user-attachments/assets/c6546e10-a027-4015-987d-4ba34d280ad6" />
<img width="1893" height="919" alt="image" src="https://github.com/user-attachments/assets/74f5fce4-c944-40a4-a122-7b2f0c6d96a8" />
<img width="1898" height="859" alt="image" src="https://github.com/user-attachments/assets/7fdb4acc-37cd-4ee9-a977-1cd147c633ab" />
🛠 Công nghệ sử dụng
Frontend
Framework: Angular 18+

Styling: Bootstrap / SCSS

Features: Quản lý sản phẩm, Giỏ hàng, Trang Admin chuyên sâu.

Backend
Framework: ASP.NET Core 8.0 (Web API)

Database: MongoDB

Documentation: Swagger UI (OpenAPI)

DevOps & Deployment
Containerization: Docker & Docker Compose

Server: Nginx (phục vụ Frontend)

Remote Access: Cloudflare Tunnel / Ngrok

## 🏗 Cấu trúc thư mục

```text
WebCuaDuy/
├── Client/             # Mã nguồn Frontend Angular
│   ├── Dockerfile      # Build ảnh Angular + Nginx
│   └── ...
├── WebCuaDuy/          # Mã nguồn Backend ASP.NET Core
│   ├── Dockerfile      # Build ảnh .NET 8.0 Runtime
│   └── ...
└── docker-compose.yml  # File điều phối toàn bộ hệ thống
```
##🚀 Hướng dẫn cài đặt nhanh
Yêu cầu hệ thống
Đã cài đặt Docker Desktop

Đã kích hoạt Virtualization trong BIOS.

Các bước thực hiện
Clone project về máy:

Bash
git clone https://github.com/duyhai020703/ecommerce-fullstack-Duy.git
cd ecommerce-fullstack-Duy
Khởi động toàn bộ hệ thống bằng Docker:

Bash
docker-compose up --build -d
Truy cập:

Frontend: http://localhost:4200

Backend API: http://localhost:7113/swagger

MongoDB: mongodb://localhost:27017

🌐 Triển khai (Deployment)
Dự án hỗ trợ triển khai từ xa không cần VPS thông qua Cloudflare Tunnel hoặc Ngrok.





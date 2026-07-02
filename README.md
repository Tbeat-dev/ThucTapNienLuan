# 🎬 Hệ thống Quản lý Rạp Chiếu Phim

> Hệ thống RESTful API hỗ trợ quản lý rạp chiếu phim, được xây dựng bằng **Node.js** và **TypeScript**, triển khai với **Docker**, **Kubernetes** và tài liệu hóa API bằng **Swagger/OpenAPI**.

---

## 📖 Giới thiệu

Hệ thống Quản lý Rạp Chiếu Phim được xây dựng nhằm hỗ trợ việc quản lý dữ liệu của một rạp chiếu phim thông qua các API RESTful. Dự án cung cấp các chức năng quản lý phim, phòng chiếu và các tài nguyên liên quan, đồng thời hỗ trợ tài liệu API trực quan bằng Swagger.

Ứng dụng được container hóa bằng Docker và triển khai trên Kubernetes, giúp quá trình triển khai và mở rộng hệ thống trở nên đơn giản và hiệu quả.

---

## ✨ Tính năng

- 🎥 Quản lý phim
    - Xem danh sách phim
    - Xem chi tiết phim
    - Thêm phim mới
    - Cập nhật phim
    - Xóa phim

- 🏢 Quản lý phòng chiếu
    - Xem danh sách phòng
    - Xem chi tiết phòng
    - Thêm phòng
    - Cập nhật phòng
    - Xóa phòng

- ❤️ Health Check API

- 📄 Tài liệu API với Swagger UI

---

## 🛠 Công nghệ sử dụng

| Công nghệ | Mục đích |
|-----------|----------|
| Node.js | Backend Runtime |
| TypeScript | Ngôn ngữ lập trình |
| Express.js | Xây dựng REST API |
| Swagger/OpenAPI | Tài liệu API |
| Docker | Container hóa ứng dụng |
| Kubernetes | Triển khai và quản lý Container |
| Git & GitHub | Quản lý mã nguồn |

---

## 📂 Cấu trúc dự án

```
.
├── .github/
│   └── workflows/
├── Swagger/
├── Backend/
├── k8s/
├── Dockerfile
├── README.md
└── ...
```

---

## 🚀 Chức năng API

### 🎥 Movies

| Method | Endpoint | Chức năng |
|---------|----------|-----------|
| GET | /movie | Lấy danh sách phim |
| GET | /movie/{id} | Lấy thông tin phim |
| POST | /movie | Thêm phim |
| PUT | /movie/{id} | Cập nhật phim |
| DELETE | /movie/{id} | Xóa phim |

---

### 🏢 Rooms

| Method | Endpoint | Chức năng |
|---------|----------|-----------|
| GET | /room | Lấy danh sách phòng |
| GET | /room/{id} | Lấy thông tin phòng |
| POST | /room | Thêm phòng |
| PUT | /room/{id} | Cập nhật phòng |
| DELETE | /room/{id} | Xóa phòng |

---

### ⚙️ System

| Method | Endpoint | Chức năng |
|---------|----------|-----------|
| GET | /health | Kiểm tra trạng thái hệ thống |

---

## 🐳 Docker

Build Image

```bash
docker build -t cinema-api .
```

Run Container

```bash
docker run -p 3000:3000 cinema-api
```

---

## ☸ Kubernetes

Triển khai ứng dụng

```bash
kubectl apply -f k8s/
```

Kiểm tra Pod

```bash
kubectl get pods
```

Kiểm tra Service

```bash
kubectl get svc
```

---

## 📚 Swagger

Sau khi chạy ứng dụng:

```
http://localhost:3000/api-docs
```

Swagger cung cấp giao diện trực quan để:

- Xem toàn bộ API
- Test API trực tiếp
- Theo dõi Request/Response

---

## 🔄 Quy trình phát triển

```
Developer
      │
      ▼
GitHub Repository
      │
      ▼
GitHub Actions
      │
      ▼
Docker Build
      │
      ▼
Kubernetes Deployment
      │
      ▼
Running Application
```

---

## 📌 Mục tiêu dự án

- Xây dựng RESTful API chuẩn.
- Áp dụng TypeScript trong Backend.
- Tài liệu hóa API bằng Swagger.
- Container hóa ứng dụng với Docker.
- Triển khai bằng Kubernetes.
- Quản lý mã nguồn bằng GitHub.

---

## 🚀 Định hướng phát triển

- Đăng nhập và phân quyền (JWT)
- Quản lý người dùng
- Quản lý lịch chiếu
- Quản lý ghế ngồi
- Đặt vé trực tuyến
- Thanh toán trực tuyến
- Báo cáo doanh thu
- Logging và Monitoring
- Unit Test và Integration Test

---

## 👨‍💻 Tác giả

**Quốc Thịnh**

Sinh viên ngành Công nghệ Thông tin.

GitHub: https://github.com/Tbeat-dev

🎬 Hệ thống Quản lý Rạp Chiếu Phim
Giới thiệu

Hệ thống Quản lý Rạp Chiếu Phim là một dự án được phát triển nhằm hỗ trợ quản lý các hoạt động của một rạp chiếu phim tập trung thông qua hệ thống RESTful API. Dự án cung cấp các chức năng quản lý phim, phòng chiếu, lịch chiếu và các thành phần liên quan, giúp việc quản trị dữ liệu trở nên nhanh chóng, chính xác và dễ dàng mở rộng.

Hệ thống được xây dựng theo mô hình Backend API, cho phép các ứng dụng Web, Mobile hoặc Desktop dễ dàng tích hợp thông qua các endpoint REST. Toàn bộ API được tài liệu hóa bằng Swagger/OpenAPI, giúp việc kiểm thử và phát triển trở nên thuận tiện hơn.

Ngoài ra, dự án còn được triển khai theo hướng hiện đại với Docker và Kubernetes, hỗ trợ đóng gói, triển khai và mở rộng hệ thống trong môi trường thực tế.

Mục tiêu dự án
Xây dựng hệ thống quản lý rạp chiếu phim theo kiến trúc RESTful API.
Chuẩn hóa tài liệu API bằng Swagger/OpenAPI.
Đóng gói ứng dụng bằng Docker.
Triển khai và quản lý ứng dụng bằng Kubernetes.
Tạo nền tảng để phát triển Frontend hoặc Mobile trong tương lai.
Chức năng chính
Quản lý phim (Movies)
Xem danh sách phim
Xem chi tiết phim
Thêm phim mới
Cập nhật thông tin phim
Xóa phim
Quản lý phòng chiếu (Rooms)
Xem danh sách phòng
Thêm phòng
Cập nhật phòng
Xóa phòng
Kiểm tra trạng thái hệ thống
Health Check API
Tài liệu API trực quan bằng Swagger UI
Công nghệ sử dụng
Node.js
TypeScript
RESTful API
Swagger (OpenAPI)
Docker
Kubernetes
Git & GitHub
Kiến trúc hệ thống
Client
   │
   ▼
REST API
(Node.js + TypeScript)
   │
   ├── Movies Module
   ├── Rooms Module
   ├── System Module
   │
Swagger Documentation
   │
Docker Container
   │
Kubernetes Deployment
Kết quả đạt được
Xây dựng thành công hệ thống REST API phục vụ quản lý rạp chiếu phim.
Tích hợp Swagger để tự động sinh tài liệu API và hỗ trợ kiểm thử.
Đóng gói ứng dụng bằng Docker giúp triển khai nhất quán.
Triển khai trên Kubernetes, hỗ trợ mở rộng và quản lý dịch vụ hiệu quả.
Thiết lập quy trình quản lý mã nguồn thông qua GitHub.
Định hướng phát triển
Xây dựng giao diện Web quản trị.
Phát triển ứng dụng Mobile.
Bổ sung chức năng quản lý người dùng và phân quyền.
Tích hợp hệ thống đặt vé trực tuyến.
Thanh toán trực tuyến.
Quản lý ghế ngồi và suất chiếu.
Thống kê doanh thu và báo cáo.

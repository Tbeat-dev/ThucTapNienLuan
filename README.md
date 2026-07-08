CineStar Developer Portal

Cổng thông tin nhà phát triển (Developer Portal) xây dựng trên nền tảng Backstage, phục vụ cho việc quản lý, tài liệu hóa và kiểm thử API của hệ thống quản lý rạp chiếu phim CineStar Ticket.


Đồ án học phần — Nhóm 11
Sinh viên thực hiện: Thái Quốc Thịnh
Trường Đại học Khoa học, Đại học Huế (HUSC)




1. Giới thiệu

Dự án này là một cổng Backstage được cấu hình để:


Đăng ký và hiển thị hệ sinh thái phần mềm của CineStar Ticket trong Software Catalog.
Cung cấp tài liệu API (OpenAPI/Swagger) tương tác được ngay trong giao diện Backstage, cho phép thử nghiệm (Execute) các endpoint trực tiếp mà không cần công cụ ngoài như Postman.
Kết nối tới backend Cinema API thông qua cơ chế Proxy của Backstage, giải quyết vấn đề CORS và cho phép gọi API một cách an toàn từ frontend.


2. Kiến trúc tổng quan

┌─────────────────┐        ┌──────────────────────┐        ┌────────────────────────┐
│   Trình duyệt    │──────▶│  Backstage Backend    │──────▶│   Cinema API (thật)     │
│  (Swagger UI)    │        │  localhost:7007        │        │  Killercoda / server    │
│  localhost:3000  │        │  /api/proxy/cinema-api │        │  ngoài                  │
└─────────────────┘        └──────────────────────┘        └────────────────────────┘


Frontend (packages/app): chạy ở localhost:3000, hiển thị Catalog, API Explorer, Swagger UI.
Backend (packages/backend): chạy ở localhost:7007, xử lý catalog, auth, và proxy request tới Cinema API thật.
Cinema API: dịch vụ backend độc lập (hiện đang host tạm trên Killercoda cho môi trường demo/thực tập), cung cấp các nghiệp vụ: quản lý phim, phòng chiếu, lịch chiếu, nhân viên.


3. Cấu trúc thư mục chính

my-developer-portal/
├── app-config.yaml           # Cấu hình chính: proxy endpoints, CORS, catalog locations
├── packages/
│   ├── app/                  # Frontend Backstage (React)
│   └── backend/
│       └── src/index.ts      # Đăng ký các plugin backend (catalog, proxy, auth, scaffolder...)
├── examples/
│   ├── entities.yaml
│   ├── org.yaml
│   └── template/
└── Swagger/                  # (repo riêng ThucTapNienLuan) chứa catalog-info.yaml + swagger.json
    ├── catalog-info.yaml      # Định nghĩa Component + API entity cho Cinema API
    └── swagger.json           # Đặc tả OpenAPI 3.0 của Cinema API

4. Cấu hình Proxy tới Cinema API

Trong app-config.yaml:

yamlproxy:
  endpoints:
    '/cinema-api':
      target: '${API_TARGET_URL}'
      changeOrigin: true

Biến môi trường API_TARGET_URL phải trỏ tới địa chỉ gốc của Cinema API thật (ví dụ URL Killercoda), và phải được set trước khi chạy yarn start:

powershell$env:API_TARGET_URL = "https://<killercoda-domain>.killercoda.com"
yarn start

Sau khi backend khởi động, mọi request gửi tới:

http://localhost:7007/api/proxy/cinema-api/<path>

sẽ được Backstage tự động forward tới ${API_TARGET_URL}/<path>.

Lưu ý quan trọng về Killercoda

Killercoda cấp domain tạm thời cho mỗi phiên (session) và domain sẽ đổi khi mở lại playground. Trước mỗi lần chạy/demo, cần đồng bộ URL mới ở 2 nơi:


Biến môi trường API_TARGET_URL (terminal, trước khi yarn start)
Mục servers trong Swagger/swagger.json (server "Trực tiếp trên Killercoda")


Nếu 2 nơi này lệch nhau, proxy sẽ trả về lỗi 404 dù backend Backstage hoạt động bình thường.

5. Đăng ký API vào Catalog

API Cinema được mô tả bằng 2 entity trong catalog-info.yaml:

yamlapiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: cinema-api-service
spec:
  type: service
  owner: group:guests
  providesApis:
    - cinema-movie-api
---
apiVersion: backstage.io/v1alpha1
kind: API
metadata:
  name: cinema-movie-api
spec:
  type: openapi
  owner: group:guests
  definition:
    $text: ./swagger.json

File này được đăng ký trong app-config.yaml qua catalog.locations, trỏ tới file trên GitHub. Backstage định kỳ đồng bộ (poll) nội dung từ GitHub — có thể ép đồng bộ ngay bằng nút Refresh (icon 🔄) trên trang chi tiết entity.


⚠️ Vì việc đồng bộ dùng GitHub API không xác thực, có thể bị giới hạn (rate limit 60 request/giờ). Nên cấu hình GITHUB_TOKEN trong biến môi trường để tăng hạn mức lên 5000 request/giờ:

powershell$env:GITHUB_TOKEN = "ghp_xxxxxxxxxxxxxxxxxxxx"



6. Chạy dự án (local)

powershell# 1. Set biến môi trường (mỗi phiên terminal mới)
$env:API_TARGET_URL = "https://<killercoda-domain>.killercoda.com"
$env:GITHUB_TOKEN   = "ghp_xxxxxxxxxxxxxxxxxxxx"   # tuỳ chọn, khuyến nghị

# 2. Cài đặt phụ thuộc (lần đầu)
yarn install

# 3. Khởi động
yarn start

Truy cập:


Frontend: http://localhost:3000
Backend API: http://localhost:7007


7. Kiểm thử nhanh

Kiểm tra proxy hoạt động đúng bằng cách gọi thẳng backend (không qua frontend dev-server):

powershellInvoke-RestMethod "http://localhost:7007/api/proxy/cinema-api/health"

Kết quả mong đợi:

json{ "status": "OK", "message": "API rạp chiếu đang hoạt động bình thường!" }

Hoặc thử trực tiếp trong Swagger UI của Backstage: vào APIs → cinema-movie-api, chọn server http://localhost:7007/api/proxy/cinema-api, Execute endpoint /health.

8. Các vấn đề thường gặp (Troubleshooting)

Hiện tượngNguyên nhân thường gặpGọi API trả về index.html (không phải JSON)Đang gọi qua đường dẫn tương đối trên port 3000 — bị SPA fallback của dev-server nuốt mất. Gọi thẳng port 7007 hoặc dùng URL tuyệt đối trong servers của Swagger.Lỗi 404 dạng Express (Cannot GET ...)Request đã chạm đúng backend nhưng path/target sai — thường do API_TARGET_URL trỏ tới domain Killercoda đã hết hạn.429 Too Many Requests khi Refresh entityGitHub rate limit do thiếu GITHUB_TOKEN. Đợi vài phút hoặc cấu hình token.Proxy không hoạt động dù config đúngKiểm tra packages/backend/src/index.ts có dòng backend.add(import('@backstage/plugin-proxy-backend')) chưa.

9. Công nghệ sử dụng


Backstage (New Backend System)
Node.js / Yarn
OpenAPI 3.0 (Swagger)
SQLite (in-memory, dùng cho môi trường dev)

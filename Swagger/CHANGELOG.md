# Changelog

Tất cả thay đổi đáng chú ý của API được ghi lại tại đây.
Định dạng dựa theo [Semantic Versioning](https://semver.org/).

## [1.1.0] - 2026-07-02
### Added
- `Room` — quản lý phòng chiếu: `GET /room`, `GET /room/{id}`, `POST /room`, `PUT /room/{id}`, `DELETE /room/{id}`
- `Schedule` — quản lý lịch chiếu phim: `GET /schedule`, `GET /schedule/{id}`, `POST /schedule`, `PUT /schedule/{id}`, `DELETE /schedule/{id}`
- `Employee` — quản lý nhân viên rạp: `GET /employee`, `GET /employee/{id}`, `POST /employee`, `PUT /employee/{id}`, `DELETE /employee/{id}`

### Compatibility
- **Không có breaking change.** Toàn bộ endpoint `Movie` và `Health` từ v1.0.0 giữ nguyên request/response, không thay đổi hành vi.
- Đây là bản nâng cấp MINOR theo Semantic Versioning: bổ sung chức năng, tương thích ngược hoàn toàn với client đang dùng v1.0.0.

## [1.0.0] - 2026-07-01
### Added
- `GET /health` — kiểm tra tình trạng server
- `GET /movie`, `POST /movie`, `GET /movie/{id}`, `PUT /movie/{id}`, `DELETE /movie/{id}` — quản lý phim
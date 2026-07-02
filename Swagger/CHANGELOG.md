# Changelog

Tất cả thay đổi đáng chú ý của API được ghi lại tại đây.
Định dạng dựa theo [Semantic Versioning](https://semver.org/).

## [1.1.0] - 2026-07-02
### Added
- `Room` — quản lý phòng chiếu (thêm/sửa/xóa/lấy danh sách)
- `Schedule` — quản lý lịch chiếu phim (gắn phim với phòng, khung giờ, giá vé)
- `Employee` — quản lý nhân viên rạp
- Server URL đổi sang đường dẫn tương đối (`/`) để tương thích đa môi trường triển khai

### Compatibility
- Không có breaking change — toàn bộ endpoint `Movie`, `Health` từ v1.0.0 giữ nguyên hành vi.

## [1.0.0] - 2026-07-01
### Added
- `GET /health` — kiểm tra tình trạng server
- `GET /movie`, `POST /movie`, `GET /movie/{id}`, `PUT /movie/{id}`, `DELETE /movie/{id}` — quản lý phim
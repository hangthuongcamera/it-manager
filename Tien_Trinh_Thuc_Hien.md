# TIẾN TRÌNH THỰC HIỆN DỰ ÁN (TRACKING CHECKLIST)
**Dự án:** Mini Web App IT Manager
**Trạng thái:** ⏳ Đang triển khai
**Ngày cập nhật:** 15/05/2026
*Sử dụng file này để cung cấp bối cảnh (context) cho AI khi bắt đầu phiên làm việc mới.*

---

## 🎯 TÓM TẮT TRẠNG THÁI HIỆN TẠI
- Đã lên kế hoạch xây dựng giao diện UI/UX.
- Đã khởi tạo cấu trúc thư mục dự án và các file trống.
- Đã hoàn thiện khung HTML cơ bản cho `layout.ejs` (tích hợp Tailwind CSS và cấu hình Dark Mode).

---

## 🔴 Giai đoạn 1: Xây dựng Layout & Các Component dùng chung (Core UI & Theme)
- [x] **1.1. Thiết lập thư mục & Layout chính (`views/layout.ejs`)**
  - [x] Cấu trúc HTML cơ bản, nhúng Tailwind CSS, FontAwesome, Google Fonts.
  - [x] Cấu hình Tailwind `darkMode: 'class'`.
  - [x] Khung Layout dạng Dashboard (Sidebar + Nội dung chính).
- [x] **1.2. Xây dựng Partials (`views/partials/`)**
  - [x] `sidebar.ejs`: Menu điều hướng 3 chức năng chính.
  - [x] `header.ejs`: Thanh topbar, nút toggle sidebar, toggle theme.
  - [x] `toast.ejs`: Component thông báo toàn cục.

---

## 🔴 Giai đoạn 2: Xây dựng Giao diện Các Module chính (Mock Data)
- [x] **2.1. Module 1: Quản lý Thiết bị (`views/devices.ejs`)**
  - [x] Hiển thị Bảng (Table) trên PC / Grid Card trên Mobile.
  - [x] Logic ẩn/hiện mật khẩu quản trị.
  - [x] Modal Thêm/Sửa thiết bị.
- [x] **2.2. Module 2: Knowledge Base (`views/kb.ejs`)**
  - [x] Layout chia màn hình (Danh sách ghi chú & Chi tiết).
  - [x] Khối code CLI với nút Copy.
- [x] **2.3. Module 3: Quản lý Nhân viên (`views/employees.ejs`)**
  - [x] Bảng danh sách nhân viên.
  - [x] Nút thao tác (Sửa, Xóa, Reset MK) và Dialog xác nhận (Custom).
- [x] **2.4. Module 4: Quản lý Loại Thiết bị (`views/device-types.ejs`)**
  - [x] Hiển thị danh sách loại thiết bị.
  - [x] Modal thao tác Thêm/Sửa/Xóa loại thiết bị.
  - [x] Cập nhật Dropdown Loại thiết bị ở Module 1 đổ data từ API.
- [x] **2.5. Module 5: Quản lý Danh mục Knowledge Base (`views/kb-categories.ejs`)**
  - [x] Hiển thị danh sách danh mục KB.
  - [x] Modal thao tác Thêm/Sửa/Xóa danh mục KB.
  - [x] Cập nhật giao diện lọc/thêm bài viết của Module 2.

---

## 🔴 Giai đoạn 3: Viết Script xử lý Tương tác Frontend (Vanilla JS)
- [x] **3.1. JS Quản lý Theme (`public/js/theme.js`)**
  - [x] Tự động đọc cài đặt OS / `localStorage`.
  - [x] Toggle class `dark` và đổi icon.
- [x] **3.2. JS cho Layout & Toast (`public/js/main.js`)**
  - [x] Logic đóng/mở Sidebar trên Mobile.
  - [x] Hàm `showToast(message, type)`.
- [x] **3.3. JS cho Các Module**
  - [x] Bật/tắt hiển thị mật khẩu (Module Devices).
  - [x] Copy to Clipboard & Toast.
  - [x] Xử lý đóng/mở Modals & Dialogs (kèm hiệu ứng Fade/Scale).
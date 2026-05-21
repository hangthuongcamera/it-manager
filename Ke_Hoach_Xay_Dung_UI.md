# KẾ HOẠCH XÂY DỰNG GIAO DIỆN (UI/UX) - IT MANAGER

**Dự án:** Mini Web App IT Manager
**Mục tiêu:** Xây dựng bộ khung giao diện tĩnh (HTML/EJS), tích hợp Tailwind CSS và xử lý tương tác mượt mà như một SPA bằng Vanilla JS (Mock data) trước khi làm chức năng backend.
**Trạng thái:** ⏳ Đang triển khai

---

## 🔴 Giai đoạn 1: Xây dựng Layout & Các Component dùng chung (Core UI & Theme)
*Mục tiêu: Dựng bộ khung chính cho toàn bộ Web App, đảm bảo Responsive Mobile-first và hỗ trợ Dark/Light Mode.*

1. **Thiết lập thư mục & Layout chính (`views/layout.ejs`):**
   - Cấu trúc HTML cơ bản, nhúng Tailwind CSS (qua CDN), FontAwesome (cho icon) và font chữ (VD: Inter hoặc Roboto).
   - **Cấu hình Tailwind:** Thêm đoạn script cấu hình Tailwind để kích hoạt chế độ `darkMode: 'class'`.
   - Khung Layout dạng Dashboard: Sidebar bên trái, nội dung chính bên phải. Responsive Mobile dạng "Hamburger Menu".

2. **Xây dựng Partials (`views/partials/`):**
   - **`sidebar.ejs`:** Menu điều hướng 3 chức năng chính (Thiết bị, Knowledge Base, Nhân viên). Cấu hình màu sắc tương thích Dark Mode (`dark:bg-gray-800`).
   - **`header.ejs`:** Thanh topbar chứa nút toggle sidebar, tiêu đề module hiện tại.
     - **Nút Toggle Theme:** Thêm nút chuyển đổi Giao diện Tối/Sáng với icon Mặt trời/Mặt trăng kèm hiệu ứng mượt mà.
   - **`toast.ejs`:** Component thông báo toàn cục, ẩn ở góc phải, hỗ trợ UI cho cả 2 theme.

---

## 🔴 Giai đoạn 2: Xây dựng Giao diện Các Module chính (Mock Data)
*Mục tiêu: Dựng giao diện tĩnh cho từng màn hình với đầy đủ các nút bấm, bảng biểu và modal, hỗ trợ Dark Mode chuẩn chỉnh.*

1. **Module 1: Quản lý Thiết bị (`views/devices.ejs`)**
   - **Layout:** Thiết kế hiển thị dạng Bảng (Table) chuyên nghiệp trên PC (dòng chẵn/lẻ đổi màu `bg-gray-50 dark:bg-gray-700`), tự động biến đổi thành danh sách Thẻ (Grid/Card) trên Mobile.
   - **Bảo mật hiển thị:** Cột "Mật khẩu quản trị" mặc định ẩn `***`, kèm icon "con mắt".
   - **Modal Thêm/Sửa:** Form nhập liệu thiết bị với lớp nền mờ (overlay fade-in), màu nền popup chuẩn Dark Mode.

2. **Module 2: Knowledge Base (`views/kb.ejs`)**
   - **Layout:** Chia màn hình. Trái: danh sách ghi chú. Phải: chi tiết nội dung (Trên Mobile dạng Stack trượt ngang).
   - **UI Code Block:** Khối code CLI hiển thị nền tối nổi bật, tích hợp nút "Copy" góc trên bên phải.

3. **Module 3: Quản lý Nhân viên (`views/employees.ejs`)**
   - **Layout:** Bảng danh sách nhân viên, hỗ trợ Responsive & Dark Mode tương tự Module Thiết bị.
   - **Nút thao tác & Dialog:** Icon thao tác (Sửa, Xóa, Reset MK) và một Dialog Xác nhận (Confirm) custom thay thế window.confirm mặc định.

4. **Module 4: Quản lý Loại Thiết bị (`views/device-types.ejs`) - *MỚI BỔ SUNG***
   - **Layout:** Bảng danh sách các loại thiết bị (VD: Switch, Router, Firewall, Access Point, Server...).
   - **Nút thao tác & Modal:** Nút và Modal phục vụ việc Thêm/Sửa/Xóa tên các loại thiết bị.
   - **Tích hợp:** Cập nhật lại Module 1 để Dropdown chọn "Loại thiết bị" trong Form thêm mới tự động load danh sách từ module này thay vì fix cứng trong HTML.

5. **Module 5: Quản lý Danh mục Knowledge Base (`views/kb-categories.ejs`) - *MỚI BỔ SUNG***
   - **Layout:** Bảng danh sách các danh mục bài viết (VD: Network, Security, Server...).
   - **Nút thao tác & Modal:** Giao diện Modal dùng để Thêm/Sửa/Xóa danh mục.
   - **Tích hợp:** Có thể áp dụng vào Module 2 để thực hiện bộ lọc bài viết theo danh mục.

---

## 🔴 Giai đoạn 3: Viết Script xử lý Tương tác Frontend (Vanilla JS)
*Mục tiêu: Thổi hồn vào giao diện tĩnh bằng các hàm JS xử lý DOM, tránh hiện tượng nháy màn hình.*

1. **JS Quản lý Theme (`theme.js`):** 
   - Đọc tự động cài đặt hệ điều hành hoặc trạng thái lưu trong `localStorage`.
   - Logic toggle thêm/bớt class `dark` ở thẻ `<html>` và đổi icon.
2. **JS cho Layout & Toast:** 
   - Logic đóng/mở Sidebar trượt trên Mobile. 
   - Hàm `showToast(message, type)` gọi thông báo nhanh.
3. **JS cho Các Module:** 
   - Bật/tắt con mắt hiển thị mật khẩu ở Module Devices.
   - Copy to Clipboard & kích hoạt Toast ở Module KB.
   - Xử lý Đóng/Mở Modals và Dialogs kèm hiệu ứng mờ dần (Opacity & Transform).
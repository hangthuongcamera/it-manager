# QUY TẮC PHÁT TRIỂN DỰ ÁN "IT MANAGER"

Tài liệu này định nghĩa các quy tắc và giới hạn cần tuân thủ khi phát triển dự án "IT Manager". Mục tiêu là giữ cho dự án luôn đơn giản, độc lập và dễ bảo trì.

## 1. Nguyên tắc "Dự án Độc lập" (Standalone Project)

- **TUYỆT ĐỐI KHÔNG** tham chiếu, `require`, hoặc `import` bất kỳ file nào từ các thư mục dự án khác (ví dụ: `../website/` hoặc `../it-infra-manager/`).
- Toàn bộ mã nguồn, tài nguyên và logic của dự án phải nằm gọn trong thư mục `d:\NLN-code\it-manager\`.
- Dự án này là một ứng dụng riêng biệt và phải có khả năng chạy độc lập mà không cần bất kỳ sự phụ thuộc nào từ bên ngoài.

## 2. Giới hạn về Công nghệ (Tech Stack Constraints)

- **Backend:** Chỉ sử dụng **Node.js** và **Express.js**.
- **Frontend:** Chỉ sử dụng **Vanilla JavaScript** (JS thuần) cho các tương tác phía client. **KHÔNG** thêm các thư viện/framework lớn như React, Vue, Angular, hay jQuery.
- **View Engine:** Giữ nguyên **EJS** với kiến trúc Server-Side Rendering (SSR).
- **Styling:** Sử dụng **Tailwind CSS** (qua CDN) và các file CSS tùy chỉnh trong `public/css`.

## 3. Quản lý Dữ liệu (Data Management)

- **Cơ sở dữ liệu:** Dự án sử dụng **MongoDB** làm cơ sở dữ liệu chính.
- **ODM (Object Data Modeling):** Tương tác với MongoDB được thực hiện thông qua thư viện **Mongoose**.
- **Lưu trữ bền vững:** Toàn bộ dữ liệu của ứng dụng (Thiết bị, Nhân viên, v.v.) được lưu trữ bền vững trong MongoDB. Dữ liệu sẽ không bị mất khi khởi động lại server.

## 4. Cấu trúc và Quy ước Code (Code Structure & Conventions)

- **Tuân thủ mô hình MVC:** Dự án được cấu trúc theo mô hình MVC (Model-View-Controller) để tách biệt các thành phần:
  - **Models (`/models`):** Chứa toàn bộ dữ liệu giả lập (mock data) của ứng dụng.
  - **Views (`/views`):** Chứa toàn bộ giao diện người dùng dưới dạng các file `.ejs`.
  - **Controllers (`/controllers`):** Chứa toàn bộ logic xử lý nghiệp vụ (business logic) cho từng module.
- **Định tuyến (Routing):** Toàn bộ việc định tuyến (khai báo URL) được quản lý trong thư mục `/routes`.
- Giữ code đơn giản và dễ đọc. Tránh các cấu trúc phức tạp không cần thiết.
- Các API nội bộ phải tuân theo chuẩn RESTful cơ bản như đã định nghĩa.

---

Những quy tắc này được đặt ra để đảm bảo dự án "IT Manager" có cấu trúc rõ ràng, dễ mở rộng và bảo trì.
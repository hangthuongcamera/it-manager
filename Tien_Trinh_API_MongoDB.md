# TIẾN TRÌNH NÂNG CẤP API & DATABASE MONGODB
**Dự án:** Mini Web App IT Manager
**Trạng thái:** ⏳ Đang triển khai
**Ngày cập nhật:** 16/05/2026
*Sử dụng file này để theo dõi quá trình chuyển đổi từ Mock Data sang MongoDB.*

---

## 🔴 Giai đoạn 1: Chuẩn bị Môi trường & Cấu hình Kết nối
- [x] **1.1. Cài đặt thư viện:** `mongoose`, `dotenv`, `nodemon`.
- [x] **1.2. Tạo file biến môi trường (`.env`):** Đã thêm `PORT`, `MONGODB_URI`, `SESSION_SECRET`.
- [x] **1.3. Cấu hình kết nối DB (`config/db.js`):** Đã tạo hàm `connectDB()`.
- [x] **1.4. Cập nhật `server.js`:** Đã gọi `connectDB()` và `dotenv.config()`.

---

## 🔴 Giai đoạn 2: Định nghĩa Schema & Cập nhật Models
*Tái cấu trúc thư mục `models/` để sử dụng Mongoose Schema.*
- [x] **2.1. `models/deviceModel.js`:** Đã chuyển sang Mongoose Schema.
- [x] **2.2. `models/deviceTypeModel.js`:** Đã chuyển sang Mongoose Schema.
- [x] **2.3. `models/employeeModel.js`:** Đã chuyển sang Mongoose Schema.
- [x] **2.4. `models/noteModel.js` (Knowledge Base):** Đã chuyển sang Mongoose Schema.
- [x] **2.5. `models/kbCategoryModel.js`:** Đã chuyển sang Mongoose Schema.
- [x] **2.6. `models/authModel.js` (User quản trị):** Đã chuyển sang Mongoose Schema (kèm băm mật khẩu).

---

## 🔴 Giai đoạn 3: Cập nhật Controllers (CRUD Logic)
*Chuyển đổi logic xử lý sang bất đồng bộ (`async/await`) để tương tác với MongoDB.*
- [x] **3.1. `controllers/deviceController.js`:** Đã cập nhật CRUD, Import/Export.
- [x] **3.2. `controllers/deviceTypeController.js`:** Đã cập nhật CRUD.
- [x] **3.3. `controllers/employeeController.js`:** Đã cập nhật CRUD.
- [x] **3.4. `controllers/noteController.js`:** Đã cập nhật CRUD.
- [x] **3.5. `controllers/kbCategoryController.js`:** Đã cập nhật CRUD.
- [x] **3.6. `controllers/authController.js`:** Đã cập nhật.

---

## 🔴 Giai đoạn 4 & 5: Hoàn thiện & Kiểm thử
- [x] **4.1. Cập nhật các Model & Controller còn lại:** Đã hoàn tất trong Giai đoạn 2 & 3.
- [x] **4.2. Xóa Mock Data:** Đã xóa toàn bộ dữ liệu giả lập khỏi các file model và controller.
- [x] **4.3. Kiểm thử toàn diện (E2E):** Đã hoàn tất. Tất cả các lỗi được báo cáo đã được khắc phục.
- [x] **4.4. Cập nhật `RULES.md`:** Ghi nhận việc dự án đã chính thức chuyển sang sử dụng MongoDB.
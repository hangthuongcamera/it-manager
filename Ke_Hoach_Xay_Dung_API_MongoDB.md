# KẾ HOẠCH NÂNG CẤP: KẾT NỐI BACKEND VÀ MONGODB

**Dự án:** Mini Web App IT Manager
**Mục tiêu:** Chuyển đổi toàn bộ hệ thống lưu trữ từ Dữ liệu giả lập (Mock Data - Arrays) sang Cơ sở dữ liệu thực tế MongoDB bằng Mongoose, nhưng vẫn giữ nguyên kiến trúc MVC hiện tại.
**Lưu ý:** Kế hoạch này yêu cầu thay đổi quy tắc tại `RULES.md` (Quy tắc 3: Quản lý dữ liệu).

---

## 🔴 Giai đoạn 1: Chuẩn bị Môi trường & Cấu hình Kết nối

1. **Cài đặt thư viện:**
   - Cài đặt `mongoose` để làm việc với MongoDB qua ODM.
   - Cài đặt `dotenv` để quản lý các biến môi trường (như chuỗi kết nối).
   - Lệnh: `npm install mongoose dotenv`

2. **Tạo biến môi trường (`.env`):**
   - Tạo file `.env` tại thư mục gốc để lưu:
     ```env
     PORT=3000
     MONGODB_URI=mongodb://localhost:27017/it-manager
     SESSION_SECRET=a-very-secret-key-for-it-manager-app
     ```

3. **Cấu hình kết nối DB (`config/db.js`):**
   - Tạo thư mục mới `config/` và file `db.js`.
   - Viết hàm `connectDB()` sử dụng `mongoose.connect()` và bắt lỗi kết nối.
   - Import và gọi hàm này trong file `server.js` trước khi khởi động server.

---

## 🔴 Giai đoạn 2: Định nghĩa Schema & Cập nhật Models
*Tái cấu trúc thư mục `models/` để sử dụng Mongoose Schema thay vì các mảng JavaScript.*

1. **`models/deviceModel.js`:**
   - Schema: `name`, `ip`, `port`, `mac`, `type` (Reference đến DeviceType hoặc String), `username`, `password`, `note`.
2. **`models/deviceTypeModel.js`:**
   - Schema: `name`, `description`.
3. **`models/employeeModel.js`:**
   - Schema: `name`, `username`, `role`, `status`.
4. **`models/noteModel.js` (Knowledge Base):**
   - Schema: `title`, `category` (Reference đến KBCategory hoặc String), `date`, `content`.
5. **`models/kbCategoryModel.js`:**
   - Schema: `name`, `description`.
6. **`models/authModel.js` (User quản trị):**
   - Schema: `username`, `password` (Nên thêm cơ chế băm mật khẩu bằng `bcrypt`), `name`.

---

## 🔴 Giai đoạn 3: Cập nhật Controllers (CRUD Logic)
*Chuyển đổi toàn bộ phương thức xử lý đồng bộ sang bất đồng bộ (`async/await`) để tương tác với MongoDB.*

1. **API Controllers (VD: `deviceController.js`, `employeeController.js`...):**
   - **GET (Lấy danh sách):** Sử dụng `Model.find()`. Tích hợp `.sort()` hoặc `.populate()` nếu cần lấy dữ liệu từ collection liên kết.
   - **POST (Thêm mới):** Sử dụng `Model.create()` hoặc `new Model().save()`.
   - **PUT (Cập nhật):** Sử dụng `Model.findByIdAndUpdate()`.
   - **DELETE (Xóa):** Sử dụng `Model.findByIdAndDelete()`.
   - **Bắt lỗi:** Bao bọc tất cả trong khối `try...catch`. Báo lỗi `500 Server Error` nếu kết nối DB gặp sự cố.

2. **View Controllers (`viewController.js`):**
   - Cập nhật logic render để lấy dữ liệu từ DB thay vì gọi mock data (nếu có các route render trang kèm sẵn dữ liệu ban đầu).

3. **Auth Controller (`authController.js`):**
   - Đọc thông tin Admin từ Database thay vì fix cứng `ADMIN_USER` trong code.

---

## 🔴 Giai đoạn 4: Cập nhật Routing & Middleware

1. **Routing (`routes/apiRoutes.js` & `routes/viewRoutes.js`):**
   - Giữ nguyên cấu trúc endpoints (Ví dụ: `/api/devices`, `/api/employees/:id`), chỉ thay đổi logic xử lý bên dưới (đã làm ở Giai đoạn 3).
2. **Middleware:**
   - Đảm bảo `authMiddleware` hoạt động trơn tru sau khi cập nhật session và DB.

---

## 🔴 Giai đoạn 5: Kiểm thử & Triển khai

- Xóa các mock array còn sót lại trong hệ thống.
- Chạy thử toàn bộ các tính năng từ Frontend (thêm, sửa, xóa) để đảm bảo dữ liệu đã được lưu đúng cấu trúc xuống MongoDB.
- Kiểm tra các tính năng Import/Export Excel với dữ liệu mới từ Mongoose.
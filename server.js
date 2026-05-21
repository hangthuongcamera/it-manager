require('dotenv').config(); // Tải các biến môi trường từ file .env
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const connectDB = require('./config/db'); // Import hàm kết nối DB
const viewRoutes = require('./routes/viewRoutes');
const apiRoutes = require('./routes/apiRoutes');
const Employee = require('./models/employeeModel'); // Import Employee model

// Kết nối tới cơ sở dữ liệu MongoDB
connectDB();

// Hàm để tạo tài khoản admin ban đầu nếu cơ sở dữ liệu trống
const createInitialAdmin = async () => {
    try {
        const userCount = await Employee.countDocuments();
        if (userCount === 0) {
            console.log('Chưa có tài khoản nào. Đang tạo tài khoản admin mặc định...');
            await Employee.create({
                name: 'Admin',
                username: 'admin',
                password: 'password123', // Mật khẩu này sẽ được tự động băm
                role: 'System Admin',
                status: 'Active'
            });
            console.log('✅ Đã tạo tài khoản admin mặc định với (username: admin, password: password123).');
            console.log('👉 Vui lòng đăng nhập và đổi mật khẩu ngay lập tức!');
        }
    } catch (error) {
        console.error('❌ Lỗi khi tạo tài khoản admin ban đầu:', error);
        process.exit(1);
    }
};

// Gọi hàm để kiểm tra và tạo admin sau khi kết nối DB
createInitialAdmin();

const app = express();
const PORT = process.env.PORT || 3000;

// Cấu hình thư mục chứa file tĩnh (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Cấu hình EJS và Express EJS Layouts
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout'); // Trỏ đến file views/layout.ejs

// Cấu hình Middleware đọc dữ liệu JSON từ Client gửi lên
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình Session Middleware
app.use(session({
    secret: 'a-very-secret-key-for-it-manager-app', // Trong thực tế, hãy dùng biến môi trường
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Đặt là `true` nếu bạn dùng HTTPS
}));

// Middleware để truyền dữ liệu session user vào tất cả các view
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// --- ROUTING ---
app.use('/', viewRoutes);
app.use('/api', apiRoutes);

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 IT Manager App đang chạy tại: http://localhost:${PORT}`);
});
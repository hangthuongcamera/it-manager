const Employee = require('../models/employeeModel'); // Thay thế User model bằng Employee model

const getLoginPage = (req, res) => {
    res.render('login', { layout: false, error: null });
};

const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Tìm người dùng trong collection 'employees'
        const user = await Employee.findOne({ username }).select('+password');

        // Kiểm tra xem tài khoản có bị vô hiệu hóa không
        if (user && user.status === 'Inactive') {
            return res.render('login', { layout: false, error: 'Tài khoản của bạn đã bị tạm khóa.' });
        }

        if (!user) {
            return res.render('login', { layout: false, error: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
        }

        // So sánh mật khẩu đã nhập với mật khẩu đã hash trong DB
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.render('login', { layout: false, error: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
        }

        // Tạo session
        req.session.user = { username: user.username, name: user.name };
        res.redirect('/');

    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        res.render('login', { layout: false, error: 'Đã có lỗi xảy ra, vui lòng thử lại.' });
    }
};

const handleLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};

const authMiddleware = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/login');
};

const handleChangePassword = async (req, res) => {
    const { username } = req.session.user;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin.' });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Mật khẩu mới và xác nhận mật khẩu không khớp.' });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ success: false, message: 'Mật khẩu mới phải có ít nhất 8 ký tự.' });
    }

    try {
        const user = await Employee.findOne({ username }).select('+password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
        }

        const isMatch = await user.matchPassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Mật khẩu cũ không chính xác.' });
        }

        user.password = newPassword;
        await user.save(); // Middleware pre('save') sẽ tự động hash mật khẩu mới

        res.status(200).json({ success: true, message: 'Cập nhật mật khẩu thành công.' });

    } catch (error) {
        console.error('Lỗi đổi mật khẩu:', error);
        res.status(500).json({ success: false, message: 'Đã có lỗi xảy ra ở máy chủ.' });
    }
};

module.exports = { getLoginPage, handleLogin, handleLogout, authMiddleware, handleChangePassword };
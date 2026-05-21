const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Vui lòng nhập họ tên nhân viên.'],
        trim: true,
        index: true // Tối ưu cho sắp xếp theo tên
    },
    username: {
        type: String,
        required: [true, 'Vui lòng nhập tên đăng nhập.'],
        trim: true,
        unique: true
    },
    role: {
        type: String,
        required: [true, 'Vui lòng nhập chức vụ.'],
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    password: {
        type: String,
        required: [true, 'Vui lòng nhập mật khẩu.'],
        select: false // Không trả về password khi query mặc định
    }
}, {
    timestamps: true
});

// Hash password trước khi lưu
employeeSchema.pre('save', async function(next) {
    // Chỉ hash password nếu nó được thay đổi (hoặc là mới)
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method để so sánh mật khẩu đã nhập với mật khẩu đã hash trong DB
employeeSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Employee', employeeSchema);
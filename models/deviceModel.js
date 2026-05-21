const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Vui lòng nhập tên thiết bị.'], // Bắt buộc
        trim: true,
        index: true // Tối ưu cho tìm kiếm/sắp xếp theo tên
    },
    ip: {
        type: String,
        required: [true, 'Vui lòng nhập địa chỉ IP.'], // Bắt buộc
        trim: true,
        unique: true // Địa chỉ IP phải là duy nhất
    },
    port: {
        type: Number,
        default: null
    },
    mac: {
        type: String,
        trim: true,
        unique: true, // Địa chỉ MAC phải là duy nhất
        sparse: true  // Cho phép nhiều bản ghi có giá trị null/không tồn tại
    },
    type: {
        type: String,
        required: [true, 'Vui lòng chọn loại thiết bị.'] // Bắt buộc
    },
    username: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    note: {
        type: String,
        trim: true
    }
}, {
    timestamps: true // Tự động thêm createdAt và updatedAt
});

module.exports = mongoose.model('Device', deviceSchema);
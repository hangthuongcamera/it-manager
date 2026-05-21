const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Vui lòng nhập tiêu đề ghi chú.'],
        trim: true,
        index: true // Tối ưu cho tìm kiếm theo tiêu đề
    },
    category: {
        type: String,
        required: [true, 'Vui lòng chọn danh mục.'],
        trim: true,
        index: true // Tối ưu cho lọc theo danh mục
    },
    content: {
        type: String,
        required: [true, 'Vui lòng nhập nội dung.'],
    }
}, {
    timestamps: true // Tự động thêm createdAt và updatedAt
});

module.exports = mongoose.model('Note', noteSchema);
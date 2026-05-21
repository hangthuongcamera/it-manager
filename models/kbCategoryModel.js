const mongoose = require('mongoose');

const kbCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Vui lòng nhập tên danh mục.'],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('KbCategory', kbCategorySchema);
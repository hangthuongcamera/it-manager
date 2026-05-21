const mongoose = require('mongoose');

const deviceTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Vui lòng nhập tên loại thiết bị.'],
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

module.exports = mongoose.model('DeviceType', deviceTypeSchema);
const DeviceType = require('../models/deviceTypeModel');

// @desc    Lấy tất cả loại thiết bị
// @route   GET /api/device-types
// @access  Private
const getDeviceTypes = async (req, res) => {
    try {
        const deviceTypes = await DeviceType.find().sort({ name: 1 });
        res.json(deviceTypes);
    } catch (error) {
        console.error('Error in getDeviceTypes:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách loại thiết bị.' });
    }
};

// @desc    Tạo loại thiết bị mới
// @route   POST /api/device-types
// @access  Private
const createDeviceType = async (req, res) => {
    try {
        const newDeviceType = await DeviceType.create(req.body);
        res.status(201).json(newDeviceType);
    } catch (error) {
        console.error('Error in createDeviceType:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Dữ liệu không hợp lệ.', errors: error.errors });
        }
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ message: `Loại thiết bị "${req.body.name}" đã tồn tại.` });
        }
        res.status(500).json({ message: 'Lỗi máy chủ khi tạo loại thiết bị.' });
    }
};

// @desc    Cập nhật thông tin loại thiết bị
// @route   PUT /api/device-types/:id
// @access  Private
const updateDeviceType = async (req, res) => {
    try {
        const updatedDeviceType = await DeviceType.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedDeviceType) {
            return res.status(404).json({ message: 'Không tìm thấy loại thiết bị.' });
        }

        res.json(updatedDeviceType);
    } catch (error) {
        console.error('Error in updateDeviceType:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Dữ liệu không hợp lệ.', errors: error.errors });
        }
        if (error.code === 11000) {
            return res.status(400).json({ message: `Loại thiết bị "${req.body.name}" đã tồn tại.` });
        }
        res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật loại thiết bị.' });
    }
};

// @desc    Xóa một loại thiết bị
// @route   DELETE /api/device-types/:id
// @access  Private
const deleteDeviceType = async (req, res) => {
    try {
        const deletedDeviceType = await DeviceType.findByIdAndDelete(req.params.id);

        if (!deletedDeviceType) {
            return res.status(404).json({ message: 'Không tìm thấy loại thiết bị.' });
        }

        res.json({ message: 'Xóa loại thiết bị thành công.', id: req.params.id });
    } catch (error) {
        console.error('Error in deleteDeviceType:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi xóa loại thiết bị.' });
    }
};

module.exports = {
    getDeviceTypes,
    createDeviceType,
    updateDeviceType,
    deleteDeviceType,
};
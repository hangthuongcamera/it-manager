const KbCategory = require('../models/kbCategoryModel');

// @desc    Lấy tất cả danh mục KB
// @route   GET /api/kb-categories
// @access  Private
const getKbCategories = async (req, res) => {
    try {
        const categories = await KbCategory.find().sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        console.error('Error in getKbCategories:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách danh mục.' });
    }
};

// @desc    Tạo danh mục KB mới
// @route   POST /api/kb-categories
// @access  Private
const createKbCategory = async (req, res) => {
    try {
        const newCategory = await KbCategory.create(req.body);
        res.status(201).json(newCategory);
    } catch (error) {
        console.error('Error in createKbCategory:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Dữ liệu không hợp lệ.', errors: error.errors });
        }
        if (error.code === 11000) { // Lỗi trùng tên
            return res.status(400).json({ message: `Danh mục "${req.body.name}" đã tồn tại.` });
        }
        res.status(500).json({ message: 'Lỗi máy chủ khi tạo danh mục.' });
    }
};

// @desc    Cập nhật thông tin danh mục KB
// @route   PUT /api/kb-categories/:id
// @access  Private
const updateKbCategory = async (req, res) => {
    try {
        const updatedCategory = await KbCategory.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục.' });
        }

        res.json(updatedCategory);
    } catch (error) {
        console.error('Error in updateKbCategory:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Dữ liệu không hợp lệ.', errors: error.errors });
        }
        if (error.code === 11000) {
            return res.status(400).json({ message: `Danh mục "${req.body.name}" đã tồn tại.` });
        }
        res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật danh mục.' });
    }
};

// @desc    Xóa một danh mục KB
// @route   DELETE /api/kb-categories/:id
// @access  Private
const deleteKbCategory = async (req, res) => {
    try {
        const deletedCategory = await KbCategory.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục.' });
        }
        res.json({ message: 'Xóa danh mục thành công.', id: req.params.id });
    } catch (error) {
        console.error('Error in deleteKbCategory:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi xóa danh mục.' });
    }
};

module.exports = { getKbCategories, createKbCategory, updateKbCategory, deleteKbCategory };
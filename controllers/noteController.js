const Note = require('../models/noteModel');

// @desc    Lấy tất cả ghi chú
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        console.error('Error in getNotes:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách ghi chú.' });
    }
};

// @desc    Tạo ghi chú mới
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res) => {
    try {
        const newNote = await Note.create(req.body);
        res.status(201).json(newNote);
    } catch (error) {
        console.error('Error in createNote:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Dữ liệu không hợp lệ.', errors: error.errors });
        }
        res.status(500).json({ message: 'Lỗi máy chủ khi tạo ghi chú.' });
    }
};

// @desc    Cập nhật thông tin ghi chú
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res) => {
    try {
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedNote) {
            return res.status(404).json({ message: 'Không tìm thấy ghi chú.' });
        }

        res.json(updatedNote);
    } catch (error) {
        console.error('Error in updateNote:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Dữ liệu không hợp lệ.', errors: error.errors });
        }
        res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật ghi chú.' });
    }
};

// @desc    Xóa một ghi chú
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if (!deletedNote) {
            return res.status(404).json({ message: 'Không tìm thấy ghi chú.' });
        }
        res.json({ message: 'Xóa ghi chú thành công.', id: req.params.id });
    } catch (error) {
        console.error('Error in deleteNote:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi xóa ghi chú.' });
    }
};

module.exports = { getNotes, createNote, updateNote, deleteNote };
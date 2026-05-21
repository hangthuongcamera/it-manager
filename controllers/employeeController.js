const Employee = require('../models/employeeModel');

// @desc    Lấy tất cả nhân viên
// @route   GET /api/employees
// @access  Private
const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().sort({ name: 1 });
        res.json(employees);
    } catch (error) {
        console.error('Error in getEmployees:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách nhân viên.' });
    }
};

// @desc    Tạo nhân viên mới
// @route   POST /api/employees
// @access  Private
const createEmployee = async (req, res) => {
    try {
        // Khi tạo người dùng mới, gán một mật khẩu mặc định.
        // Mật khẩu này sẽ được hash tự động bởi pre-save hook trong model.
        const newEmployeeData = {
            ...req.body,
            password: 'password123' 
        };
        const newEmployee = await Employee.create(newEmployeeData);
        // Không trả về mật khẩu trong response
        const userObject = newEmployee.toObject();
        delete userObject.password;
        res.status(201).json(userObject);
    } catch (error) {
        console.error('Error in createEmployee:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Dữ liệu không hợp lệ.', errors: error.errors });
        }
        if (error.code === 11000) { // Lỗi trùng tên đăng nhập
            return res.status(400).json({ message: `Tên đăng nhập "${req.body.username}" đã tồn tại.` });
        }
        res.status(500).json({ message: 'Lỗi máy chủ khi tạo nhân viên.' });
    }
};

// @desc    Cập nhật thông tin nhân viên
// @route   PUT /api/employees/:id
// @access  Private
const updateEmployee = async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Không tìm thấy nhân viên.' });
        }

        res.json(updatedEmployee);
    } catch (error) {
        console.error('Error in updateEmployee:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Dữ liệu không hợp lệ.', errors: error.errors });
        }
        if (error.code === 11000) {
            return res.status(400).json({ message: `Tên đăng nhập "${req.body.username}" đã tồn tại.` });
        }
        res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật nhân viên.' });
    }
};

// @desc    Xóa một nhân viên
// @route   DELETE /api/employees/:id
// @access  Private
const deleteEmployee = async (req, res) => {
    try {
        // Tìm người dùng trước khi xóa để kiểm tra
        const employeeToDelete = await Employee.findById(req.params.id);

        if (!employeeToDelete) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }

        // Thêm lớp bảo vệ: không cho phép xóa tài khoản 'admin'
        if (employeeToDelete.username === 'admin') {
            return res.status(403).json({ message: 'Không thể xóa tài khoản quản trị viên gốc.' });
        }

        // Nếu không phải admin, tiến hành xóa
        await employeeToDelete.deleteOne();

        res.json({ message: 'Xóa người dùng thành công.', id: req.params.id });
    } catch (error) {
        console.error('Error in deleteEmployee:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi xóa nhân viên.' });
    }
};

const resetEmployeePassword = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }

        // Đặt lại mật khẩu về giá trị mặc định.
        // Hook pre-save sẽ tự động hash mật khẩu này.
        employee.password = 'password123';
        await employee.save();

        res.json({ success: true, message: `Đã đặt lại mật khẩu cho ${employee.name} về 'password123'.` });

    } catch (error) {
        console.error('Error in resetEmployeePassword:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi đặt lại mật khẩu.' });
    }
};

module.exports = { getEmployees, createEmployee, updateEmployee, deleteEmployee, resetEmployeePassword };
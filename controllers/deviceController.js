const Device = require('../models/deviceModel');
const xlsx = require('xlsx');
const DeviceType = require('../models/deviceTypeModel');

// @desc    Lấy tất cả thiết bị
// @route   GET /api/devices
// @access  Private
const getDevices = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10; // Giới hạn 10 thiết bị trên một trang
        const skip = (page - 1) * limit;

        let query = {};
        const searchTerm = req.query.search;

        // Nếu có tham số tìm kiếm, xây dựng query để tìm kiếm trên nhiều trường
        if (searchTerm) {
            const regex = new RegExp(searchTerm, 'i'); // 'i' để không phân biệt chữ hoa/thường
            query = {
                $or: [
                    { name: regex },
                    { ip: regex },
                    { mac: regex },
                    { type: regex },
                    { note: regex }
                ]
            };
        }

        // Lấy tổng số lượng tài liệu khớp với query để tính toán phân trang
        const totalDevices = await Device.countDocuments(query);
        const totalPages = Math.ceil(totalDevices / limit);

        const devices = await Device.find(query).sort({ createdAt: -1 }).limit(limit).skip(skip);
        
        res.json({
            devices,
            currentPage: page,
            totalPages,
        });
    } catch (error) {
        console.error('Error in getDevices:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách thiết bị.' });
    }
};

// @desc    Tạo thiết bị mới
// @route   POST /api/devices
// @access  Private
const createDevice = async (req, res) => {
    try {
        const newDevice = await Device.create(req.body);
        res.status(201).json(newDevice);
    } catch (error) {
        console.error('Error in createDevice:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Dữ liệu không hợp lệ.', errors: error.errors });
        }
        res.status(500).json({ message: 'Lỗi máy chủ khi tạo thiết bị.' });
    }
};

// @desc    Cập nhật thông tin thiết bị
// @route   PUT /api/devices/:id
// @access  Private
const updateDevice = async (req, res) => {
    try {
        const updatedDevice = await Device.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Trả về document đã được cập nhật
            runValidators: true, // Chạy validation khi cập nhật
        });

        if (!updatedDevice) {
            return res.status(404).json({ message: 'Không tìm thấy thiết bị.' });
        }

        res.json(updatedDevice);
    } catch (error) {
        console.error('Error in updateDevice:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Dữ liệu không hợp lệ.', errors: error.errors });
        }
        res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật thiết bị.' });
    }
};

// @desc    Xóa một thiết bị
// @route   DELETE /api/devices/:id
// @access  Private
const deleteDevice = async (req, res) => {
    try {
        const deletedDevice = await Device.findByIdAndDelete(req.params.id);

        if (!deletedDevice) {
            return res.status(404).json({ message: 'Không tìm thấy thiết bị.' });
        }

        res.json({ message: 'Xóa thiết bị thành công.', id: req.params.id });
    } catch (error) {
        console.error('Error in deleteDevice:', error);
        res.status(500).json({ message: 'Lỗi máy chủ khi xóa thiết bị.' });
    }
};

// @desc    Xuất dữ liệu thiết bị ra file Excel
// @route   GET /api/devices/export
// @access  Private
const exportToExcel = async (req, res) => {
    try {
        const devices = await Device.find().sort({ name: 1 }).lean();
        
        // Chuẩn bị dữ liệu với thứ tự cột và định dạng mong muốn
        const dataToExport = devices.map(device => ({
            'Tên thiết bị': device.name,
            'Loại': device.type,
            'Địa chỉ IP': device.ip,
            'Port': device.port,
            'Địa chỉ MAC': device.mac,
            'Tài khoản': device.username,
            'Mật khẩu': device.password,
            'Ghi chú': device.note,
            'Ngày tạo': device.createdAt ? new Date(device.createdAt).toLocaleString('vi-VN') : '',
            'Ngày cập nhật': device.updatedAt ? new Date(device.updatedAt).toLocaleString('vi-VN') : '',
        }));

        const worksheet = xlsx.utils.json_to_sheet(dataToExport);
        const workbook = xlsx.utils.book_new();

        // --- TÙY CHỈNH THIẾT KẾ FILE EXCEL ---

        // 1. Thiết lập độ rộng cho các cột (đơn vị: ký tự)
        worksheet['!cols'] = [
            { wch: 30 }, // Tên thiết bị
            { wch: 15 }, // Loại
            { wch: 20 }, // Địa chỉ IP
            { wch: 10 }, // Port
            { wch: 20 }, // Địa chỉ MAC
            { wch: 15 }, // Tài khoản
            { wch: 20 }, // Mật khẩu
            { wch: 40 }, // Ghi chú
            { wch: 20 }, // Ngày tạo
            { wch: 20 }, // Ngày cập nhật
        ];

        // 2. In đậm dòng tiêu đề
        const headerCellStyle = { font: { bold: true } };
        const range = xlsx.utils.decode_range(worksheet['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const address = xlsx.utils.encode_cell({ r: 0, c: C });
            if (worksheet[address]) {
                worksheet[address].s = headerCellStyle;
            }
        }

        xlsx.utils.book_append_sheet(workbook, worksheet, 'Danh sách Thiết bị');

        // Thiết lập header để trình duyệt tải file về với tên mới
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Danh_sach_thiet_bi.xlsx');

        // Ghi workbook vào response
        const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        res.send(buffer);

    } catch (error) {
        console.error('Error in exportToExcel:', error);
        res.status(500).json({ message: 'Lỗi khi xuất file Excel.' });
    }
};

// @desc    Nhập dữ liệu thiết bị từ file Excel
// @route   POST /api/devices/import
// @access  Private
const importFromExcel = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Vui lòng tải lên một file.' });
    }

    try {
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
            return res.status(400).json({ message: 'File Excel rỗng hoặc không đúng định dạng.' });
        }

        // Lấy danh sách các loại thiết bị hợp lệ từ DB để kiểm tra
        const validDeviceTypes = await DeviceType.find().lean();
        const validDeviceTypeNames = new Set(validDeviceTypes.map(t => t.name));

        // Chuyển đổi key từ file Excel sang key của schema
        const devicesToImport = jsonData.map((row, index) => {
            const deviceData = {
                name: row['Tên thiết bị'],
                ip: row['Địa chỉ IP'],
                port: row['Port'],
                mac: row['Địa chỉ MAC'],
                type: row['Loại'],
                username: row['Tài khoản'],
                password: row['Mật khẩu'],
                note: row['Ghi chú'],
            };

            // Bẫy lỗi cho các trường bắt buộc và quan trọng
            if (!deviceData.ip) {
                throw new Error(`Lỗi ở dòng ${index + 2}: Cột 'Địa chỉ IP' không được để trống.`);
            }
            if (!deviceData.type) {
                throw new Error(`Lỗi ở dòng ${index + 2}: Cột 'Loại' không được để trống.`);
            }
            // Bẫy lỗi nếu 'Loại' không tồn tại trong danh sách hợp lệ
            if (!validDeviceTypeNames.has(deviceData.type)) {
                throw new Error(`Lỗi ở dòng ${index + 2}: Loại thiết bị '${deviceData.type}' không hợp lệ.`);
            }

            return deviceData;
        });

        // --- Logic nhập khẩu an toàn hơn ---
        // 1. Xác thực (validate) tất cả các bản ghi trước khi thực hiện bất kỳ thao tác nào với DB.
        // Thao tác này sẽ ném lỗi nếu có bất kỳ dữ liệu nào không hợp lệ.
        for (const deviceData of devicesToImport) {
            const doc = new Device(deviceData);
            await doc.validate();
        }

        // 2. Nếu tất cả dữ liệu đều hợp lệ, tiến hành "cập nhật hoặc thêm mới" (upsert).
        // Logic này an toàn hơn việc xóa toàn bộ dữ liệu cũ.
        // Nó sẽ cập nhật thiết bị nếu tìm thấy IP, hoặc tạo mới nếu không tìm thấy.
        const bulkOps = devicesToImport.map(device => ({
            updateOne: {
                filter: { ip: device.ip }, // Giả định IP là trường định danh duy nhất
                update: { $set: device },
                upsert: true,
            }
        }));

        if (bulkOps.length > 0) {
            const result = await Device.bulkWrite(bulkOps);
            res.status(201).json({
                message: `Nhập thành công. Đã tạo mới ${result.upsertedCount} và cập nhật ${result.modifiedCount} thiết bị.`,
                data: result
            });
        } else {
            res.status(200).json({ message: 'File Excel rỗng hoặc không có dữ liệu hợp lệ để nhập.' });
        }

    } catch (error) {
        console.error('Error in importFromExcel:', error);
        // Ưu tiên hiển thị lỗi custom đã bẫy ở trên
        if (error.message.startsWith('Lỗi ở dòng')) {
            return res.status(400).json({ message: error.message });
        }
        // Cung cấp thông báo lỗi cụ thể hơn cho người dùng
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'File Excel chứa dữ liệu không hợp lệ. Vui lòng kiểm tra lại các trường bắt buộc như Tên, IP, Loại.' });
        }
        if (error.code === 11000) {
            const match = error.message.match(/dup key: { (.+?): "(.+?)" }/);
            if (match) {
                return res.status(400).json({ message: `Lỗi: Giá trị '${match[2]}' cho trường '${match[1]}' đã tồn tại hoặc bị trùng lặp trong file.` });
            }
            return res.status(400).json({ message: 'Lỗi: File Excel chứa dữ liệu bị trùng lặp (IP hoặc MAC).'});
        }
        res.status(500).json({ message: 'Lỗi khi xử lý file Excel. Đảm bảo file có cấu trúc cột đúng như file export mẫu.' });
    }
};


module.exports = {
    getDevices,
    createDevice,
    updateDevice,
    deleteDevice,
    exportToExcel,
    importFromExcel,
};
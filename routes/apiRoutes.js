const express = require('express');
const router = express.Router();
const multer = require('multer');

// Controllers
const authController = require('../controllers/authController');
const deviceController = require('../controllers/deviceController');
const deviceTypeController = require('../controllers/deviceTypeController');
const employeeController = require('../controllers/employeeController');
const kbCategoryController = require('../controllers/kbCategoryController');
const noteController = require('../controllers/noteController');

// Cấu hình Multer để xử lý file upload trong bộ nhớ
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- MIDDLEWARE BẢO VỆ TẤT CẢ API ROUTES ---
// Tất cả các route trong file này đều yêu cầu đăng nhập
router.use(authController.authMiddleware);

// Route API mới để xử lý việc đổi mật khẩu
router.post('/auth/change-password', authController.handleChangePassword);

// --- DEVICE API ROUTES ---
router.get('/devices/export', deviceController.exportToExcel);
router.post('/devices/import', upload.single('file'), deviceController.importFromExcel);
router.route('/devices/:id')
    .put(deviceController.updateDevice)
    .delete(deviceController.deleteDevice);
router.route('/devices')
    .get(deviceController.getDevices)
    .post(deviceController.createDevice);

// --- DEVICE TYPE API ROUTES ---
router.route('/device-types/:id')
    .put(deviceTypeController.updateDeviceType)
    .delete(deviceTypeController.deleteDeviceType);
router.route('/device-types')
    .get(deviceTypeController.getDeviceTypes)
    .post(deviceTypeController.createDeviceType);

// --- EMPLOYEE API ROUTES ---
router.post('/employees/:id/reset-password', employeeController.resetEmployeePassword);
router.route('/employees/:id')
    .put(employeeController.updateEmployee)
    .delete(employeeController.deleteEmployee);
router.route('/employees')
    .get(employeeController.getEmployees)
    .post(employeeController.createEmployee);

// --- KNOWLEDGE BASE (NOTES) API ROUTES ---
router.route('/notes/:id')
    .put(noteController.updateNote)
    .delete(noteController.deleteNote);
router.route('/notes')
    .get(noteController.getNotes)
    .post(noteController.createNote);

// --- KB CATEGORY API ROUTES ---
router.route('/kb-categories/:id')
    .put(kbCategoryController.updateKbCategory)
    .delete(kbCategoryController.deleteKbCategory);
router.route('/kb-categories')
    .get(kbCategoryController.getKbCategories)
    .post(kbCategoryController.createKbCategory);

module.exports = router;
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const viewController = require('../controllers/viewController');

// --- AUTH VIEW ROUTES ---
router.get('/login', authController.getLoginPage);
router.post('/login', authController.handleLogin);
router.get('/logout', authController.handleLogout);

// --- APP VIEW ROUTES (PROTECTED) ---
router.get('/', authController.authMiddleware, viewController.getDevicesPage);

// Các view route khác đã được di chuyển từ server.js
router.get('/device-types', authController.authMiddleware, viewController.getDeviceTypesPage);
router.get('/kb-categories', authController.authMiddleware, viewController.getKbCategoriesPage);
router.get('/knowledge-base', authController.authMiddleware, viewController.getKnowledgeBasePage);
router.get('/employees', authController.authMiddleware, viewController.getEmployeesPage);

module.exports = router;
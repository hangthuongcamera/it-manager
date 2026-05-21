const getDevicesPage = (req, res) => {
    // Trang chủ mặc định là trang quản lý thiết bị
    res.render('devices', { title: 'Quản lý Thiết bị mạng', activeModule: 'devices' });
};

const getDeviceTypesPage = (req, res) => {
    res.render('device-types', { title: 'Quản lý Loại thiết bị', activeModule: 'device-types' });
};

const getKbCategoriesPage = (req, res) => {
    res.render('kb-categories', { title: 'Danh mục Knowledge Base', activeModule: 'kb-categories' });
};

const getKnowledgeBasePage = (req, res) => {
    res.render('kb', { title: 'Knowledge Base', activeModule: 'kb' });
};

const getEmployeesPage = (req, res) => {
    res.render('employees', { title: 'Quản lý Nhân viên IT', activeModule: 'employees' });
};

module.exports = {
    getDevicesPage,
    getDeviceTypesPage,
    getKbCategoriesPage,
    getKnowledgeBasePage,
    getEmployeesPage
};
# IT MANAGER - PROJECT CONTEXT SNAPSHOT
**Ngày cập nhật:** 16/05/2026
**Mục đích:** File này chứa toàn bộ bối cảnh và mã nguồn quan trọng của dự án "IT Manager" tính đến thời điểm hiện tại. Khi bắt đầu một phiên chat mới, hãy cung cấp toàn bộ nội dung file này để AI có thể hiểu và tiếp tục công việc một cách chính xác.

---

## 1. TỔNG QUAN DỰ ÁN

- **Tên dự án:** IT Manager - Mini Web App Quản lý hạ tầng IT nội bộ.
- **Kiến trúc:** MVC (Model-View-Controller) với Server-Side Rendering (EJS) kết hợp AJAX (Fetch API) để tạo trải nghiệm người dùng mượt mà.
- **Công nghệ:** Node.js, Express.js, EJS, Tailwind CSS (CDN), Vanilla JavaScript, express-session.

---

## 2. TIẾN TRÌNH HIỆN TẠI

- **Hoàn tất Tái cấu trúc (Refactoring):** Đã chuyển đổi thành công toàn bộ dự án từ một file `server.js` duy nhất sang kiến trúc MVC hoàn chỉnh.
- **Hoàn tất Giao diện & Tương tác:** Giao diện người dùng cho tất cả các module đã hoàn thiện, responsive và hỗ trợ Dark/Light mode. Các tương tác như modal, toast, confirm dialog hoạt động mượt mà.
- **Các chức năng đã hoàn thành:**
  - **Xác thực:** Đăng nhập, đăng xuất, middleware bảo vệ route.
  - **Đổi mật khẩu:** Chức năng đổi mật khẩu cho tài khoản admin thông qua một pop-up (modal).
  - **CRUD cho tất cả các module:** Quản lý Thiết bị, Nhân viên, Knowledge Base, Loại thiết bị, Danh mục KB.
  - **Chức năng phụ:** Import/Export Excel cho module Thiết bị, Reset mật khẩu cho Nhân viên.

---

## 3. CẤU TRÚC THƯ MỤC

```text
d:\NLN-code\it-manager\
├── controllers/
│   ├── authController.js
│   ├── deviceController.js
│   ├── deviceTypeController.js
│   ├── employeeController.js
│   ├── kbCategoryController.js
│   ├── noteController.js
│   └── viewController.js
├── models/
│   ├── authModel.js
│   ├── deviceModel.js
│   ├── deviceTypeModel.js
│   ├── employeeModel.js
│   ├── kbCategoryModel.js
│   └── noteModel.js
├── public/
│   └── js/
│       ├── main.js
│       └── theme.js
├── routes/
│   ├── apiRoutes.js
│   └── viewRoutes.js
├── views/
│   ├── partials/
│   │   ├── confirm.ejs
│   │   ├── header.ejs
│   │   ├── profileModal.ejs
│   │   ├── sidebar.ejs
│   │   └── toast.ejs
│   ├── device-types.ejs
│   ├── devices.ejs
│   ├── employees.ejs
│   ├── kb-categories.ejs
│   ├── kb.ejs
│   ├── layout.ejs
│   └── login.ejs
├── package.json
├── server.js
└── ... (các file tài liệu khác)
```

---

## 4. NỘI DUNG CÁC FILE QUAN TRỌNG

### `package.json`
```json
{
  "name": "it-manager",
  "version": "1.0.0",
  "description": "Mini Web App Quản lý hạ tầng IT nội bộ",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "ejs": "^3.1.9",
    "express": "^4.18.2",
    "express-ejs-layouts": "^2.5.1",
    "express-session": "^1.17.3",
    "multer": "^1.4.5-lts.1",
    "xlsx": "^0.18.5"
  }
}
```

### `server.js`
```javascript
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const multer = require('multer');
const xlsx = require('xlsx');

const app = express();
const PORT = process.env.PORT || 3000;

// Cấu hình thư mục chứa file tĩnh (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Cấu hình EJS và Express EJS Layouts
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout'); // Trỏ đến file views/layout.ejs

// Cấu hình Middleware đọc dữ liệu JSON từ Client gửi lên
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình Multer để xử lý file upload trong bộ nhớ
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Cấu hình Session Middleware
app.use(session({
    secret: 'a-very-secret-key-for-it-manager-app', // Trong thực tế, hãy dùng biến môi trường
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Đặt là `true` nếu bạn dùng HTTPS
}));

// Middleware để truyền dữ liệu session user vào tất cả các view
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// --- AUTHENTICATION ---

// Dữ liệu người dùng admin giả lập
const ADMIN_USER = { username: 'admin', password: 'password123', name: 'Admin' };

// Middleware để kiểm tra đăng nhập
const authMiddleware = (req, res, next) => {
    if (req.session && req.session.user) {
        return next(); // Đã đăng nhập, cho phép tiếp tục
    }
    res.redirect('/login'); // Chưa đăng nhập, chuyển hướng về trang login
};

// Route cho trang đăng nhập
app.get('/login', (req, res) => {
    res.render('login', { layout: false, error: null }); // Không sử dụng layout chung
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
        req.session.user = { username: ADMIN_USER.username, name: ADMIN_USER.name };
        res.redirect('/');
    } else {
        res.render('login', { layout: false, error: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// --- MOCK DATA & RESTful API ---
let devices = [
    { id: 1, name: 'Core Switch 01', ip: '192.168.1.1', port: 443, mac: '00:1A:2B:3C:4D:51', type: 'Switch', username: 'admin', password: 'Password@123', note: 'Phòng máy chủ tầng 1' },
    { id: 2, name: 'Firewall Fortigate', ip: '192.168.1.254', port: 10443, mac: '08:5B:0E:12:34:56', type: 'Firewall', username: 'admin', password: 'Forti@2026', note: 'Cổng quang WAN' },
    { id: 3, name: 'Access Point T1', ip: '192.168.2.10', port: 22, mac: 'F4:A4:D6:7B:8C:9D', type: 'Access Point', username: 'root', password: 'ap_pass_1', note: 'Hành lang sảnh' }
];

app.get('/api/devices', (req, res) => {
    res.json(devices);
});

app.post('/api/devices', (req, res) => {
    const newDevice = { id: Date.now(), ...req.body };
    devices.unshift(newDevice); // Thêm lên đầu mảng
    res.status(201).json(newDevice);
});

app.put('/api/devices/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = devices.findIndex(d => d.id === id);
    if (index !== -1) {
        devices[index] = { ...devices[index], ...req.body };
        res.json(devices[index]);
    } else {
        res.status(404).json({ error: 'Device not found' });
    }
});

app.delete('/api/devices/:id', (req, res) => {
    devices = devices.filter(d => d.id !== parseInt(req.params.id));
    res.json({ success: true });
});

// API để xuất file Excel
app.get('/api/devices/export', authMiddleware, (req, res) => {
    const worksheet = xlsx.utils.json_to_sheet(devices);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Devices");

    // Ghi workbook vào buffer
    const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    res.setHeader('Content-Disposition', 'attachment; filename="devices_export.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
});

// API để nhập từ file Excel
app.post('/api/devices/import', authMiddleware, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Không có file nào được tải lên.' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames;
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    devices = data; // Ghi đè toàn bộ dữ liệu cũ bằng dữ liệu mới từ file Excel
    res.json({ success: true, message: `Đã nhập thành công ${data.length} thiết bị.` });
});

// --- MOCK DATA & RESTful API CHO LOẠI THIẾT BỊ ---
let deviceTypes = [
    { id: 1, name: 'Switch', description: 'Thiết bị chuyển mạch' },
    { id: 2, name: 'Router', description: 'Thiết bị định tuyến' },
    { id: 3, name: 'Firewall', description: 'Tường lửa bảo mật' },
    { id: 4, name: 'Access Point', description: 'Bộ phát không dây' },
    { id: 5, name: 'Server', description: 'Máy chủ vật lý' }
];

app.get('/api/device-types', (req, res) => {
    res.json(deviceTypes);
});

app.post('/api/device-types', (req, res) => {
    const newType = { id: Date.now(), ...req.body };
    deviceTypes.push(newType);
    res.status(201).json(newType);
});

app.put('/api/device-types/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = deviceTypes.findIndex(t => t.id === id);
    if (index !== -1) {
        deviceTypes[index] = { ...deviceTypes[index], ...req.body };
        res.json(deviceTypes[index]);
    } else {
        res.status(404).json({ error: 'Device type not found' });
    }
});

app.delete('/api/device-types/:id', (req, res) => {
    deviceTypes = deviceTypes.filter(t => t.id !== parseInt(req.params.id));
    res.json({ success: true });
});

// --- MOCK DATA & RESTful API CHO KNOWLEDGE BASE ---
let notes = [
    { 
        id: 1, 
        title: 'Cấu hình VLAN Switch Core', 
        category: 'Network', 
        date: '10/05/2026',
        content: 'Hướng dẫn cấu hình VLAN cơ bản cho Switch Cisco:\n\n```\nenable\nconfigure terminal\nvlan 10\nname KETOAN\nexit\nvlan 20\nname IT\nexit\n```\n\nNhớ lưu cấu hình bằng lệnh `write memory`.'
    },
    { 
        id: 2, 
        title: 'Reset Password Fortigate', 
        category: 'Security', 
        date: '12/05/2026',
        content: 'Khi quên mật khẩu Fortigate, sử dụng cáp console và làm theo các bước sau:\n\n1. Rút nguồn và cắm lại.\n2. Khi hiện dấu nhắc `login:`, nhập `maintainer`.\n3. Mật khẩu là `bcpb` + serial number.\n\n```\nconfig system admin\nedit admin\nset password new_password\nnext\nend\n```'
    },
    { 
        id: 3, 
        title: 'Khởi động Node.js Server', 
        category: 'Server', 
        date: '14/05/2026',
        content: 'Sử dụng lệnh sau để cài đặt và chạy ứng dụng bằng PM2:\n\n```bash\nnpm install -g pm2\npm2 start server.js --name "it-manager"\npm2 save\n```'
    }
];

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    const newNote = { id: Date.now(), date: new Date().toLocaleDateString('vi-VN'), ...req.body };
    notes.unshift(newNote);
    res.status(201).json(newNote);
});

app.put('/api/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = notes.findIndex(n => n.id === id);
    if (index !== -1) {
        notes[index] = { ...notes[index], ...req.body };
        res.json(notes[index]);
    } else {
        res.status(404).json({ error: 'Note not found' });
    }
});

app.delete('/api/notes/:id', (req, res) => {
    notes = notes.filter(n => n.id !== parseInt(req.params.id));
    res.json({ success: true });
});

// --- MOCK DATA & RESTful API CHO DANH MỤC KB ---
let kbCategories = [
    { id: 1, name: 'Network', description: 'Kiến thức hệ thống mạng' },
    { id: 2, name: 'Security', description: 'Bảo mật & Tường lửa' },
    { id: 3, name: 'Server', description: 'Máy chủ vật lý & Ảo hóa' }
];

app.get('/api/kb-categories', (req, res) => {
    res.json(kbCategories);
});

app.post('/api/kb-categories', (req, res) => {
    const newCategory = { id: Date.now(), ...req.body };
    kbCategories.push(newCategory);
    res.status(201).json(newCategory);
});

app.put('/api/kb-categories/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = kbCategories.findIndex(c => c.id === id);
    if (index !== -1) {
        kbCategories[index] = { ...kbCategories[index], ...req.body };
        res.json(kbCategories[index]);
    } else {
        res.status(404).json({ error: 'Category not found' });
    }
});

app.delete('/api/kb-categories/:id', (req, res) => {
    kbCategories = kbCategories.filter(c => c.id !== parseInt(req.params.id));
    res.json({ success: true });
});

// --- MOCK DATA & RESTful API CHO NHÂN VIÊN IT ---
let employees = [
    { id: 1, name: 'Nguyễn Văn A', username: 'nva_admin', role: 'System Admin', status: 'Active' },
    { id: 2, name: 'Trần Thị B', username: 'ttb_net', role: 'Network Engineer', status: 'Active' },
    { id: 3, name: 'Lê Văn C', username: 'lvc_helpdesk', role: 'Helpdesk IT', status: 'Inactive' }
];

app.get('/api/employees', (req, res) => {
    res.json(employees);
});

app.post('/api/employees', (req, res) => {
    const newEmp = { id: Date.now(), ...req.body };
    employees.unshift(newEmp);
    res.status(201).json(newEmp);
});

app.put('/api/employees/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = employees.findIndex(e => e.id === id);
    if (index !== -1) {
        employees[index] = { ...employees[index], ...req.body };
        res.json(employees[index]);
    } else {
        res.status(404).json({ error: 'Employee not found' });
    }
});

app.delete('/api/employees/:id', (req, res) => {
    employees = employees.filter(e => e.id !== parseInt(req.params.id));
    res.json({ success: true });
});

app.post('/api/employees/:id/reset-password', (req, res) => {
    // Thực tế sẽ có logic sinh random password và hash bcrypt ở đây
    res.json({ success: true, message: 'Đã đặt lại mật khẩu về mặc định: 123456aA@' });
});

// --- ROUTING CƠ BẢN ---
app.get('/', authMiddleware, (req, res) => {
    res.render('devices', { title: 'Quản lý Thiết bị mạng', activeModule: 'devices' });
});

app.get('/device-types', authMiddleware, (req, res) => {
    res.render('device-types', { title: 'Quản lý Loại thiết bị', activeModule: 'device-types' });
});

app.get('/kb-categories', authMiddleware, (req, res) => {
    res.render('kb-categories', { title: 'Danh mục Knowledge Base', activeModule: 'kb-categories' });
});

app.get('/knowledge-base', authMiddleware, (req, res) => {
    res.render('kb', { title: 'Knowledge Base', activeModule: 'kb' });
});

app.get('/employees', authMiddleware, (req, res) => {
    res.render('employees', { title: 'Quản lý Nhân viên IT', activeModule: 'employees' });
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 IT Manager App đang chạy tại: http://localhost:${PORT}`);
});
```

### `views/layout.ejs`
```ejs
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IT Manager Dashboard</title>
    
    <!-- Cấu hình Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class', // Bật Dark Mode bằng class
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    
    <!-- Google Fonts: Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- FontAwesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- EasyMDE Markdown Editor CSS -->
    <link rel="stylesheet" href="https://unpkg.com/easymde/dist/easymde.min.css">
    
    <!-- Custom Theme Script -->
    <script src="/js/theme.js"></script>

    <style>
        /* Tùy chỉnh thanh cuộn gọn gàng hơn */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 4px; }
        .dark ::-webkit-scrollbar-thumb { background-color: #475569; }
    </style>
</head>
<body class="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">

    <div class="flex h-screen overflow-hidden">
        <%- include('partials/sidebar') %>

        <div class="flex-1 flex flex-col w-full">
            <%- include('partials/header') %>

            <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 md:p-6 transition-colors duration-300">
                <%- body %>
            </main>
        </div>
    </div>

    <%- include('partials/toast') %>
    <%- include('partials/confirm') %>

    <!-- Main Frontend Script (Sidebar, Toast) -->
    <script src="/js/main.js"></script>

    <!-- Markdown Libraries -->
    <script src="https://unpkg.com/easymde/dist/easymde.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

</body>
</html>
```

### `public/js/main.js`
```javascript
// === SIDEBAR TOGGLE (MOBILE) ===
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebar.classList.contains('-translate-x-full')) {
        // Mở sidebar
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.remove('opacity-0'), 10);
    } else {
        // Đóng sidebar
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.classList.add('hidden'), 300); // Đợi kết thúc transition
    }
}

// === TOAST NOTIFICATION ===
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const template = document.getElementById('toast-template');
    const clone = template.content.cloneNode(true);
    const toastEl = clone.querySelector('.toast-message');
    
    clone.querySelector('.toast-text').textContent = message;
    
    const icon = clone.querySelector('.toast-icon');
    const iconContainer = clone.querySelector('.toast-icon-container');
    
    // Cấu hình Theme theo loại thông báo
    if (type === 'success') {
        toastEl.classList.add('border-green-500');
        iconContainer.classList.add('bg-green-100', 'dark:bg-green-900/50', 'text-green-500', 'dark:text-green-400');
        icon.classList.add('fa-check-circle');
    } else if (type === 'error') {
        toastEl.classList.add('border-red-500');
        iconContainer.classList.add('bg-red-100', 'dark:bg-red-900/50', 'text-red-500', 'dark:text-red-400');
        icon.classList.add('fa-exclamation-circle');
    } else {
        toastEl.classList.add('border-blue-500');
        iconContainer.classList.add('bg-blue-100', 'dark:bg-blue-900/50', 'text-blue-500', 'dark:text-blue-400');
        icon.classList.add('fa-info-circle');
    }

    container.appendChild(clone);
    
    // Animation trượt vào
    setTimeout(() => toastEl.classList.remove('translate-x-full', 'opacity-0'), 10);

    // Tự động xóa sau 3s
    setTimeout(() => {
        toastEl.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toastEl.parentElement && toastEl.remove(), 300);
    }, 3000);
}

// === CUSTOM CONFIRM DIALOG ===
let pendingConfirmAction = null;

function openConfirmDialog(title, message, iconType, confirmCallback) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').innerHTML = message; 
    pendingConfirmAction = confirmCallback;

    const wrapper = document.getElementById('confirmIconWrapper');
    const icon = document.getElementById('confirmIcon');
    const btn = document.getElementById('confirmBtn');

    if (iconType === 'warning') {
        wrapper.className = 'w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 transition-colors bg-orange-100 dark:bg-orange-900/30 text-orange-500';
        icon.className = 'fas fa-key text-3xl';
        btn.className = 'px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors';
    } else {
        wrapper.className = 'w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 transition-colors bg-red-100 dark:bg-red-900/30 text-red-500';
        icon.className = 'fas fa-exclamation-triangle text-3xl';
        btn.className = 'px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors';
    }

    const dlg = document.getElementById('confirmDialog');
    const content = document.getElementById('confirmDialogContent');
    dlg.classList.remove('hidden');
    setTimeout(() => { dlg.classList.remove('opacity-0'); content.classList.remove('scale-95'); }, 10);
}

function closeConfirmDialog() {
    const dlg = document.getElementById('confirmDialog');
    const content = document.getElementById('confirmDialogContent');
    dlg.classList.add('opacity-0'); content.classList.add('scale-95');
    setTimeout(() => { dlg.classList.add('hidden'); pendingConfirmAction = null; }, 300);
}

document.addEventListener('DOMContentLoaded', () => {
    const confirmBtn = document.getElementById('confirmBtn');
    if(confirmBtn) confirmBtn.addEventListener('click', () => { if (typeof pendingConfirmAction === 'function') pendingConfirmAction(); closeConfirmDialog(); });
});
```
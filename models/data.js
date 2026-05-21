// File này chứa toàn bộ dữ liệu giả lập (mock data) cho ứng dụng.
// Việc tách dữ liệu ra khỏi logic giúp code sạch sẽ và dễ quản lý hơn.

const data = {
    ADMIN_USER: { username: 'admin', password: 'password123', name: 'Admin' },

    devices: [
        { id: 1, name: 'Core Switch 01', ip: '192.168.1.1', port: 443, mac: '00:1A:2B:3C:4D:51', type: 'Switch', username: 'admin', password: 'Password@123', note: 'Phòng máy chủ tầng 1' },
        { id: 2, name: 'Firewall Fortigate', ip: '192.168.1.254', port: 10443, mac: '08:5B:0E:12:34:56', type: 'Firewall', username: 'admin', password: 'Forti@2026', note: 'Cổng quang WAN' },
        { id: 3, name: 'Access Point T1', ip: '192.168.2.10', port: 22, mac: 'F4:A4:D6:7B:8C:9D', type: 'Access Point', username: 'root', password: 'ap_pass_1', note: 'Hành lang sảnh' }
    ],

    deviceTypes: [
        { id: 1, name: 'Switch', description: 'Thiết bị chuyển mạch' },
        { id: 2, name: 'Router', description: 'Thiết bị định tuyến' },
        { id: 3, name: 'Firewall', description: 'Tường lửa bảo mật' },
        { id: 4, name: 'Access Point', description: 'Bộ phát không dây' },
        { id: 5, name: 'Server', description: 'Máy chủ vật lý' }
    ],

    notes: [
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
    ],

    kbCategories: [
        { id: 1, name: 'Network', description: 'Kiến thức hệ thống mạng' },
        { id: 2, name: 'Security', description: 'Bảo mật & Tường lửa' },
        { id: 3, name: 'Server', description: 'Máy chủ vật lý & Ảo hóa' }
    ],

    employees: [
        { id: 1, name: 'Nguyễn Văn A', username: 'nva_admin', role: 'System Admin', status: 'Active' },
        { id: 2, name: 'Trần Thị B', username: 'ttb_net', role: 'Network Engineer', status: 'Active' },
        { id: 3, name: 'Lê Văn C', username: 'lvc_helpdesk', role: 'Helpdesk IT', status: 'Inactive' }
    ]
};

module.exports = data;
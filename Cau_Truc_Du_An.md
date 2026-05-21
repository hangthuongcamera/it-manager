# CẤU TRÚC THƯ MỤC DỰ ÁN IT-MANAGER

Dự án tuân theo kiến trúc **MVC (Model-View-Controller)** để phân tách rõ ràng các thành phần.

```text
it-manager/
├── config/                  # Chứa các file cấu hình (VD: kết nối DB)
│   └── db.js
├── controllers/             # Chứa logic xử lý (request/response)
│   ├── authController.js
│   ├── deviceController.js
│   ├── deviceTypeController.js
│   ├── employeeController.js
│   ├── kbCategoryController.js
│   ├── noteController.js
│   └── viewController.js
├── models/                  # Chứa dữ liệu và logic thao tác dữ liệu
│   ├── deviceModel.js
│   ├── deviceTypeModel.js
│   ├── employeeModel.js
│   ├── kbCategoryModel.js
│   └── noteModel.js
├── public/                  # Chứa các file tĩnh (css, js, images)
│   └── js/
│       ├── main.js
│       └── theme.js
├── routes/                  # Chứa các file định tuyến (endpoints)
│   ├── apiRoutes.js
│   └── viewRoutes.js
├── views/                   # Chứa các file giao diện EJS
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
├── server.js                # File khởi tạo và cấu hình server chính
└── package.json
```
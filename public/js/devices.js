document.addEventListener('DOMContentLoaded', () => {
    // === DOM ELEMENTS ===
    const deviceTableBody = document.getElementById('device-table-body');
    const deviceModal = document.getElementById('device-modal');
    const deviceForm = document.getElementById('device-form');
    const modalTitle = document.getElementById('modal-title');
    const deviceIdInput = document.getElementById('deviceId');
    const addDeviceBtn = document.getElementById('add-device-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const searchInput = document.getElementById('table-search');
    const paginationContainer = document.getElementById('pagination-container');
    const deviceRowTemplate = document.getElementById('device-row-template');

    // === STATE ===
    let currentPage = 1;
    let currentSearchTerm = '';

    // === FUNCTIONS ===

    /**
     * Fetch devices from the API with pagination and search
     */
    const fetchDevices = async () => {
        try {
            const url = `/api/devices?page=${currentPage}&search=${currentSearchTerm}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch devices');
            }
            const data = await response.json();
            renderTable(data.devices);
            renderPagination(data.currentPage, data.totalPages);
        } catch (error) {
            console.error('Error fetching devices:', error);
            deviceTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4">Lỗi khi tải dữ liệu. Vui lòng thử lại.</td></tr>`;
        }
    };

    /**
     * Render the device table rows
     */
    const renderTable = (devices) => {
        deviceTableBody.innerHTML = ''; // Clear existing rows
        if (devices.length === 0) {
            deviceTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-8">Không tìm thấy thiết bị nào.</td></tr>`;
            return;
        }
        devices.forEach(device => {
            const clone = document.importNode(deviceRowTemplate.content, true);
            const tr = clone.querySelector('tr');
            tr.setAttribute('data-device-id', device._id);

            clone.querySelector('[data-field="name"]').textContent = device.name;
            clone.querySelector('[data-field="type"]').textContent = device.type;
            clone.querySelector('[data-field="ip"]').textContent = device.ip;
            clone.querySelector('[data-field="mac"]').textContent = device.mac;
            clone.querySelector('[data-field="note"]').textContent = device.note;

            const editBtn = clone.querySelector('.edit-btn');
            editBtn.setAttribute('data-id', device._id);
            editBtn.setAttribute('data-device', JSON.stringify(device)); // Store full object

            const deleteBtn = clone.querySelector('.delete-btn');
            deleteBtn.setAttribute('data-id', device._id);

            deviceTableBody.appendChild(clone);
        });
    };

    /**
     * Render pagination controls
     */
    const renderPagination = (currentPage, totalPages) => {
        paginationContainer.innerHTML = '';
        if (totalPages <= 1) return;

        // Previous button
        const prevLi = document.createElement('li');
        const prevA = document.createElement('a');
        prevA.href = '#';
        prevA.innerHTML = `<i class="fas fa-chevron-left"></i>`;
        prevA.className = `flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`;
        if (currentPage === 1) {
            prevA.classList.add('cursor-not-allowed', 'opacity-50');
        } else {
            prevA.addEventListener('click', (e) => {
                e.preventDefault();
                changePage(currentPage - 1);
            });
        }
        prevLi.appendChild(prevA);
        paginationContainer.appendChild(prevLi);

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageLi = document.createElement('li');
            const pageA = document.createElement('a');
            pageA.href = '#';
            pageA.textContent = i;
            pageA.className = `flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`;
            if (i === currentPage) {
                pageA.className = `z-10 flex items-center justify-center px-3 h-8 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white`;
            } else {
                pageA.addEventListener('click', (e) => {
                    e.preventDefault();
                    changePage(i);
                });
            }
            pageLi.appendChild(pageA);
            paginationContainer.appendChild(pageLi);
        }

        // Next button
        const nextLi = document.createElement('li');
        const nextA = document.createElement('a');
        nextA.href = '#';
        nextA.innerHTML = `<i class="fas fa-chevron-right"></i>`;
        nextA.className = `flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-s-0 border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`;
        if (currentPage === totalPages) {
            nextA.classList.add('cursor-not-allowed', 'opacity-50');
        } else {
            nextA.addEventListener('click', (e) => {
                e.preventDefault();
                changePage(currentPage + 1);
            });
        }
        nextLi.appendChild(nextA);
        paginationContainer.appendChild(nextLi);
    };

    const changePage = (page) => {
        currentPage = page;
        fetchDevices();
    };

    /**
     * Open the modal for adding or editing a device
     * @param {object | null} device - The device object to edit, or null to add
     */
    const openModal = (device = null) => {
        deviceForm.reset();
        if (device) {
            // === EDIT MODE ===
            modalTitle.textContent = 'Cập nhật thông tin thiết bị';
            deviceIdInput.value = device._id;
            document.getElementById('name').value = device.name || '';
            document.getElementById('type').value = device.type || '';
            document.getElementById('ip').value = device.ip || '';
            document.getElementById('port').value = device.port || '';
            document.getElementById('mac').value = device.mac || '';
            document.getElementById('username').value = device.username || '';
            document.getElementById('password').value = device.password || '';
            document.getElementById('note').value = device.note || '';
        } else {
            // === ADD MODE ===
            modalTitle.textContent = 'Thêm thiết bị mới';
            deviceIdInput.value = '';
        }
        deviceModal.classList.remove('hidden');
        setTimeout(() => deviceModal.classList.remove('opacity-0'), 10);
    };

    /**
     * Close the modal
     */
    const closeModal = () => {
        deviceModal.classList.add('opacity-0');
        setTimeout(() => deviceModal.classList.add('hidden'), 300);
    };

    /**
     * Handle form submission for both add and edit
     */
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(deviceForm);
        const deviceData = Object.fromEntries(formData.entries());
        const id = deviceIdInput.value;

        const url = id ? `/api/devices/${id}` : '/api/devices';
        const method = id ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(deviceData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Yêu cầu thất bại');
            }

            closeModal();
            showToast(`Đã ${id ? 'cập nhật' : 'thêm'} thiết bị thành công.`, 'success');
            fetchDevices(); // Refresh table
        } catch (error) {
            console.error('Form submission error:', error);
            showToast(error.message, 'error');
        }
    };

    /**
     * Handle device deletion
     */
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/devices/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Xóa thất bại');
            }
            showToast('Đã xóa thiết bị thành công.', 'success');
            fetchDevices(); // Refresh table
        } catch (error) {
            console.error('Delete error:', error);
            showToast(error.message, 'error');
        }
    };

    // === EVENT LISTENERS ===

    // Open modal for adding
    addDeviceBtn.addEventListener('click', () => openModal());

    // Close modal
    closeModalBtn.addEventListener('click', closeModal);
    deviceModal.addEventListener('click', (e) => {
        if (e.target === deviceModal) {
            closeModal();
        }
    });

    // Handle form submission
    deviceForm.addEventListener('submit', handleFormSubmit);

    // Event delegation for edit and delete buttons
    deviceTableBody.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-btn');
        if (editBtn) {
            // **THE FIX IS HERE**: We parse the device data stored on the button
            // and pass it to openModal to enter 'edit' mode.
            const device = JSON.parse(editBtn.dataset.device);
            openModal(device);
            return;
        }

        const deleteBtn = e.target.closest('.delete-btn');
        if (deleteBtn) {
            const id = deleteBtn.dataset.id;
            const deviceName = deleteBtn.closest('tr').querySelector('[data-field="name"]').textContent;
            openConfirmDialog(
                'Xác nhận xóa',
                `Bạn có chắc chắn muốn xóa thiết bị <strong>${deviceName}</strong> không? Hành động này không thể hoàn tác.`,
                'delete',
                () => handleDelete(id)
            );
            return;
        }
    });

    // Search functionality
    let searchTimeout;
    searchInput.addEventListener('keyup', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentSearchTerm = e.target.value;
            currentPage = 1; // Reset to first page on new search
            fetchDevices();
        }, 300); // Debounce search input
    });

    // Initial data load
    fetchDevices();
});
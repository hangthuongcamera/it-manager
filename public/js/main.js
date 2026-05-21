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

    // Profile Modal Form Submission
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/auth/change-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                const result = await response.json();
                showToast(result.message, response.ok ? 'success' : 'error');
                if (response.ok) {
                    closeProfileModal();
                }
            } catch (error) {
                showToast('Không thể kết nối đến máy chủ.', 'error');
            }
        });
    }
});

// === PROFILE MODAL ===
function openProfileModal() {
    const dlg = document.getElementById('profileModal');
    const content = document.getElementById('profileModalContent');
    dlg.classList.remove('hidden');
    setTimeout(() => {
        dlg.classList.remove('opacity-0');
        content.classList.remove('scale-95');
    }, 10);
}

function closeProfileModal() {
    const dlg = document.getElementById('profileModal');
    const content = document.getElementById('profileModalContent');
    dlg.classList.add('opacity-0');
    content.classList.add('scale-95');
    setTimeout(() => {
        dlg.classList.add('hidden');
        document.getElementById('changePasswordForm')?.reset();
    }, 300);
}
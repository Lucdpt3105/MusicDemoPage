/**
 * Groovezilla - UI Utilities
 * Reusable UI functions and helpers
 */

class UIUtils {
    // Toast notifications
    static showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add toast styles if not present
        this.injectToastStyles();

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    static getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }

    static injectToastStyles() {
        if (document.getElementById('toast-styles')) return;

        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(30, 30, 30, 0.95);
                color: white;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
                transform: translateX(400px);
                transition: transform 0.3s ease;
                z-index: 10000;
                max-width: 400px;
            }
            .toast.show {
                transform: translateX(0);
            }
            .toast-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .toast-success { border-left: 4px solid #10b981; }
            .toast-error { border-left: 4px solid #ef4444; }
            .toast-warning { border-left: 4px solid #f59e0b; }
            .toast-info { border-left: 4px solid #3b82f6; }
        `;
        document.head.appendChild(style);
    }

    // Loading spinner
    static showLoading(message = 'Loading...') {
        const existingLoader = document.getElementById('app-loader');
        if (existingLoader) return;

        const loader = document.createElement('div');
        loader.id = 'app-loader';
        loader.innerHTML = `
            <div class="loader-backdrop">
                <div class="loader-content">
                    <div class="spinner"></div>
                    <p>${message}</p>
                </div>
            </div>
        `;

        this.injectLoaderStyles();
        document.body.appendChild(loader);
    }

    static hideLoading() {
        const loader = document.getElementById('app-loader');
        if (loader) {
            loader.classList.add('fade-out');
            setTimeout(() => loader.remove(), 300);
        }
    }

    static injectLoaderStyles() {
        if (document.getElementById('loader-styles')) return;

        const style = document.createElement('style');
        style.id = 'loader-styles';
        style.textContent = `
            #app-loader {
                position: fixed;
                inset: 0;
                z-index: 9999;
                animation: fadeIn 0.3s ease;
            }
            #app-loader.fade-out {
                animation: fadeOut 0.3s ease;
            }
            .loader-backdrop {
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(4px);
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .loader-content {
                text-align: center;
                color: white;
            }
            .spinner {
                width: 50px;
                height: 50px;
                border: 4px solid rgba(255, 255, 255, 0.1);
                border-top-color: #8b5cf6;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 16px;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // Modal dialog
    static showModal(title, content, buttons = []) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    ${buttons.map(btn => `
                        <button class="btn-modal ${btn.class || ''}" data-action="${btn.action}">
                            ${btn.label}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        this.injectModalStyles();
        document.body.appendChild(modal);

        // Handle button clicks
        buttons.forEach(btn => {
            const btnElement = modal.querySelector(`[data-action="${btn.action}"]`);
            btnElement?.addEventListener('click', () => {
                if (btn.callback) btn.callback();
                modal.remove();
            });
        });

        // Handle close button
        modal.querySelector('.modal-close')?.addEventListener('click', () => {
            modal.remove();
        });

        // Handle backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        return modal;
    }

    static injectModalStyles() {
        if (document.getElementById('modal-styles')) return;

        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .modal-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(4px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9998;
                animation: fadeIn 0.3s ease;
            }
            .modal-dialog {
                background: #1a1a1a;
                border-radius: 16px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow: hidden;
                animation: slideUp 0.3s ease;
            }
            .modal-header {
                padding: 20px 24px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .modal-header h3 {
                margin: 0;
                color: white;
                font-size: 20px;
            }
            .modal-close {
                background: none;
                border: none;
                color: white;
                font-size: 28px;
                cursor: pointer;
                padding: 0;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
                transition: background 0.2s;
            }
            .modal-close:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            .modal-body {
                padding: 24px;
                color: rgba(255, 255, 255, 0.8);
                max-height: 50vh;
                overflow-y: auto;
            }
            .modal-footer {
                padding: 16px 24px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                gap: 12px;
                justify-content: flex-end;
            }
            .btn-modal {
                padding: 10px 20px;
                border-radius: 8px;
                border: none;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s;
            }
            .btn-modal.primary {
                background: #8b5cf6;
                color: white;
            }
            .btn-modal.primary:hover {
                background: #7c3aed;
            }
            .btn-modal.secondary {
                background: rgba(255, 255, 255, 0.1);
                color: white;
            }
            .btn-modal.secondary:hover {
                background: rgba(255, 255, 255, 0.15);
            }
            @keyframes slideUp {
                from {
                    transform: translateY(50px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Confirmation dialog
    static confirm(title, message, onConfirm, onCancel) {
        return this.showModal(title, `<p>${message}</p>`, [
            {
                label: 'Cancel',
                action: 'cancel',
                class: 'secondary',
                callback: onCancel
            },
            {
                label: 'Confirm',
                action: 'confirm',
                class: 'primary',
                callback: onConfirm
            }
        ]);
    }

    // Format time
    static formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Format date
    static formatDate(date, format = 'relative') {
        const d = new Date(date);
        const now = new Date();
        const diff = now - d;

        if (format === 'relative') {
            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            if (seconds < 60) return 'Just now';
            if (minutes < 60) return `${minutes}m ago`;
            if (hours < 24) return `${hours}h ago`;
            if (days < 7) return `${days}d ago`;
            return d.toLocaleDateString();
        }

        return d.toLocaleDateString();
    }

    // Debounce function
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Animate number counting
    static animateNumber(element, target, duration = 1000) {
        const start = parseInt(element.textContent) || 0;
        const increment = (target - start) / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // Smooth scroll to element
    static scrollTo(element, offset = 0) {
        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    // Copy to clipboard
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Copied to clipboard', 'success');
            return true;
        } catch (error) {
            console.error('Failed to copy:', error);
            this.showToast('Failed to copy', 'error');
            return false;
        }
    }

    // Generate unique ID
    static generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Truncate text
    static truncate(text, length, suffix = '...') {
        if (text.length <= length) return text;
        return text.substring(0, length) + suffix;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIUtils;
}

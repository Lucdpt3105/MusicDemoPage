// Admin Page - Minimalist Interactions & Enhancements
// Clean, smooth, functional

class AdminMinimalist {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupTableInteractions();
        this.setupFormValidation();
        this.setupTooltips();
        this.setupConfirmations();
        this.animateStats();
    }

    // Mobile Menu Toggle
    setupMobileMenu() {
        // Create mobile menu button if doesn't exist
        if (window.innerWidth <= 1024) {
            const header = document.querySelector('.admin-header-left');
            if (header && !document.querySelector('.mobile-menu-btn')) {
                const menuBtn = document.createElement('button');
                menuBtn.className = 'mobile-menu-btn';
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                menuBtn.style.cssText = `
                    width: 36px;
                    height: 36px;
                    border: 1px solid var(--admin-border);
                    background: var(--admin-surface);
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    margin-right: 12px;
                `;
                
                menuBtn.addEventListener('click', () => {
                    const sidebar = document.querySelector('.admin-sidebar');
                    sidebar.classList.toggle('active');
                });
                
                header.insertBefore(menuBtn, header.firstChild);
            }
        }

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            const sidebar = document.querySelector('.admin-sidebar');
            const menuBtn = document.querySelector('.mobile-menu-btn');
            
            if (sidebar.classList.contains('active') && 
                !sidebar.contains(e.target) && 
                e.target !== menuBtn) {
                sidebar.classList.remove('active');
            }
        });
    }

    // Table Interactions
    setupTableInteractions() {
        // Select all checkbox functionality
        const selectAllCheckboxes = document.querySelectorAll('.data-table thead input[type="checkbox"]');
        
        selectAllCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const table = this.closest('table');
                const rowCheckboxes = table.querySelectorAll('tbody input[type="checkbox"]');
                
                rowCheckboxes.forEach(cb => {
                    cb.checked = this.checked;
                    const row = cb.closest('tr');
                    if (this.checked) {
                        row.style.background = 'rgba(25, 118, 210, 0.05)';
                    } else {
                        row.style.background = '';
                    }
                });
            });
        });

        // Row selection
        const rowCheckboxes = document.querySelectorAll('.data-table tbody input[type="checkbox"]');
        
        rowCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const row = this.closest('tr');
                if (this.checked) {
                    row.style.background = 'rgba(25, 118, 210, 0.05)';
                } else {
                    row.style.background = '';
                }
            });
        });

        // Action button confirmations
        document.querySelectorAll('.btn-action.delete').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                if (confirm('Bạn có chắc chắn muốn xóa mục này?')) {
                    // Delete logic here
                    const row = this.closest('tr') || this.closest('.album-card-admin') || this.closest('.artist-card-admin');
                    if (row) {
                        row.style.opacity = '0';
                        row.style.transform = 'scale(0.9)';
                        row.style.transition = 'all 0.3s ease';
                        setTimeout(() => row.remove(), 300);
                    }
                }
            });
        });
    }

    // Form Validation
    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input[required], select[required]');
            
            inputs.forEach(input => {
                input.addEventListener('blur', function() {
                    if (!this.value) {
                        this.style.borderColor = 'var(--admin-error)';
                    } else {
                        this.style.borderColor = 'var(--admin-border)';
                    }
                });

                input.addEventListener('input', function() {
                    if (this.value) {
                        this.style.borderColor = 'var(--admin-success)';
                    }
                });
            });
        });
    }

    // Simple Tooltips
    setupTooltips() {
        const actionButtons = document.querySelectorAll('.btn-action[title]');
        
        actionButtons.forEach(btn => {
            btn.addEventListener('mouseenter', function(e) {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = this.getAttribute('title');
                tooltip.style.cssText = `
                    position: absolute;
                    background: var(--admin-text-primary);
                    color: white;
                    padding: 6px 10px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 500;
                    white-space: nowrap;
                    z-index: 1000;
                    pointer-events: none;
                    opacity: 0;
                    transform: translateY(5px);
                    transition: all 0.2s ease;
                `;
                
                document.body.appendChild(tooltip);
                
                const rect = this.getBoundingClientRect();
                tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
                tooltip.style.top = rect.bottom + 8 + 'px';
                
                setTimeout(() => {
                    tooltip.style.opacity = '1';
                    tooltip.style.transform = 'translateY(0)';
                }, 10);
                
                this._tooltip = tooltip;
            });
            
            btn.addEventListener('mouseleave', function() {
                if (this._tooltip) {
                    this._tooltip.style.opacity = '0';
                    this._tooltip.style.transform = 'translateY(5px)';
                    setTimeout(() => this._tooltip.remove(), 200);
                }
            });
        });
    }

    // Confirmation Dialogs
    setupConfirmations() {
        // Logout confirmation
        document.querySelectorAll('.admin-nav-item.logout').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                    // Add logout animation
                    document.body.style.opacity = '0';
                    document.body.style.transition = 'opacity 0.3s ease';
                    setTimeout(() => {
                        window.location.href = '../../index.html';
                    }, 300);
                }
            });
        });
    }

    // Animate Statistics on Load
    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const text = target.textContent;
                    const number = parseInt(text.replace(/,/g, ''));
                    
                    if (!isNaN(number)) {
                        let current = 0;
                        const increment = number / 30;
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= number) {
                                target.textContent = text;
                                clearInterval(timer);
                            } else {
                                target.textContent = Math.floor(current).toLocaleString();
                            }
                        }, 30);
                    }
                    
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => observer.observe(stat));
    }
}

// Additional Helper Functions
function openModal(modalId, mode) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        modal.style.animation = 'fadeIn 0.2s ease';
        
        // Focus first input
        setTimeout(() => {
            const firstInput = modal.querySelector('input:not([type="checkbox"])');
            if (firstInput) firstInput.focus();
        }, 100);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.animation = 'fadeOut 0.2s ease';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 200);
    }
}

// Search Functionality
function setupSearch() {
    const searchInputs = document.querySelectorAll('.filter-search');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const section = this.closest('.content-section');
            const table = section.querySelector('.data-table tbody');
            
            if (table) {
                const rows = table.querySelectorAll('tr');
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            }
        });
    });
}

// Filter Functionality
function setupFilters() {
    const filterSelects = document.querySelectorAll('.filter-select');
    
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            const selectedValue = this.value.toLowerCase();
            const section = this.closest('.content-section');
            const table = section.querySelector('.data-table tbody');
            
            if (table) {
                const rows = table.querySelectorAll('tr');
                rows.forEach(row => {
                    if (selectedValue === 'tất cả quyền' || selectedValue === 'tất cả thể loại' || selectedValue === 'trạng thái' || selectedValue === 'sắp xếp') {
                        row.style.display = '';
                    } else {
                        const text = row.textContent.toLowerCase();
                        if (text.includes(selectedValue)) {
                            row.style.display = '';
                        } else {
                            row.style.display = 'none';
                        }
                    }
                });
            }
        });
    });
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? 'var(--admin-success)' : type === 'error' ? 'var(--admin-error)' : 'var(--admin-accent)'};
        color: white;
        padding: 14px 20px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Backup Function
function createBackup() {
    showNotification('Đang tạo bản sao lưu...', 'info');
    
    // Simulate backup process
    setTimeout(() => {
        showNotification('Sao lưu thành công!', 'success');
    }, 2000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    
    .mobile-menu-btn {
        display: none;
    }
    
    @media (max-width: 1024px) {
        .mobile-menu-btn {
            display: flex !important;
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AdminMinimalist();
        setupSearch();
        setupFilters();
    });
} else {
    new AdminMinimalist();
    setupSearch();
    setupFilters();
}

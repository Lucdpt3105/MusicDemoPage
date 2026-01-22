/**
 * Groovezilla - Navigation Handler
 * Handle navigation and routing
 */

class NavigationHandler {
    constructor() {
        this.currentPage = null;
        this.history = [];
        this.init();
    }

    init() {
        this.setupNavigationLinks();
        this.setupBackButton();
        this.updateActiveLink();
        console.log('🧭 Navigation Handler initialized');
    }

    // Setup navigation links
    setupNavigationLinks() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Track navigation
                const href = link.getAttribute('href');
                const pageName = this.getPageNameFromHref(href);
                
                if (pageName) {
                    this.trackNavigation(pageName);
                }

                // Update active state
                this.updateActiveLinkElement(link);
            });
        });

        // Handle sidebar collapse on mobile
        this.setupMobileNavigation();
    }

    // Setup mobile navigation
    setupMobileNavigation() {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;

        // Create toggle button if it doesn't exist
        let toggleBtn = document.querySelector('.sidebar-toggle');
        if (!toggleBtn) {
            toggleBtn = document.createElement('button');
            toggleBtn.className = 'sidebar-toggle';
            toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.appendChild(toggleBtn);
        }

        // Toggle sidebar on mobile
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            document.body.classList.toggle('sidebar-open');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                    sidebar.classList.remove('active');
                    document.body.classList.remove('sidebar-open');
                }
            }
        });

        // Inject mobile styles
        this.injectMobileStyles();
    }

    injectMobileStyles() {
        if (document.getElementById('mobile-nav-styles')) return;

        const style = document.createElement('style');
        style.id = 'mobile-nav-styles';
        style.textContent = `
            .sidebar-toggle {
                display: none;
                position: fixed;
                top: 20px;
                left: 20px;
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background: #8b5cf6;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                z-index: 1001;
                box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
                transition: all 0.3s;
            }
            .sidebar-toggle:hover {
                background: #7c3aed;
                transform: scale(1.1);
            }
            @media (max-width: 768px) {
                .sidebar-toggle {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .sidebar {
                    transform: translateX(-100%);
                    transition: transform 0.3s;
                }
                .sidebar.active {
                    transform: translateX(0);
                }
                body.sidebar-open::before {
                    content: '';
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 999;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Update active navigation link
    updateActiveLink() {
        const currentPath = window.location.pathname;
        const currentPage = this.getPageNameFromPath(currentPath);
        
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const linkPage = this.getPageNameFromHref(href);
            
            if (linkPage === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        this.currentPage = currentPage;
    }

    updateActiveLinkElement(clickedLink) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        clickedLink.classList.add('active');
    }

    // Setup browser back button
    setupBackButton() {
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.navigateTo(e.state.page, false);
            }
        });
    }

    // Navigate to page
    navigateTo(page, pushState = true) {
        this.currentPage = page;
        
        if (pushState && history.pushState) {
            history.pushState({ page }, '', `${page}.html`);
        }

        this.trackNavigation(page);
        this.updateActiveLink();
        
        this.triggerEvent('navigation:change', { page });
    }

    // Track navigation for analytics
    trackNavigation(page) {
        this.history.push({
            page,
            timestamp: new Date().toISOString()
        });

        // Keep only last 50 navigations
        if (this.history.length > 50) {
            this.history.shift();
        }

        // Save to storage
        StorageManager.set('navigationHistory', this.history);

        console.log('📍 Navigated to:', page);
    }

    // Get page name from URL path
    getPageNameFromPath(path) {
        const filename = path.split('/').pop();
        if (!filename || filename === '' || filename === 'index.html') {
            return 'home';
        }
        return filename.replace('.html', '');
    }

    getPageNameFromHref(href) {
        if (!href) return null;
        if (href === '/' || href === 'index.html' || href === '../../index.html') {
            return 'home';
        }
        return href.replace('.html', '').split('/').pop();
    }

    // Get current page
    getCurrentPage() {
        return this.currentPage;
    }

    // Get navigation history
    getHistory() {
        return this.history;
    }

    // Go back
    goBack() {
        if (window.history.length > 1) {
            window.history.back();
        }
    }

    // Breadcrumb generation
    generateBreadcrumb() {
        const breadcrumb = [];
        
        breadcrumb.push({
            name: 'Home',
            url: '../../index.html',
            icon: 'fas fa-home'
        });

        const currentPage = this.currentPage || this.getPageNameFromPath(window.location.pathname);
        if (currentPage && currentPage !== 'home') {
            breadcrumb.push({
                name: this.formatPageName(currentPage),
                url: `${currentPage}.html`,
                icon: this.getPageIcon(currentPage)
            });
        }

        return breadcrumb;
    }

    formatPageName(page) {
        return page.charAt(0).toUpperCase() + page.slice(1).replace('-', ' ');
    }

    getPageIcon(page) {
        const icons = {
            discovery: 'fas fa-compass',
            favorites: 'fas fa-heart',
            history: 'fas fa-history',
            playlist: 'fas fa-list-ul',
            album: 'fas fa-record-vinyl',
            artist: 'fas fa-user-music',
            settings: 'fas fa-cog',
            admin: 'fas fa-shield-alt'
        };
        return icons[page] || 'fas fa-file';
    }

    // Render breadcrumb
    renderBreadcrumb(container) {
        if (!container) return;

        const breadcrumb = this.generateBreadcrumb();
        container.innerHTML = breadcrumb.map((item, index) => `
            <a href="${item.url}" class="breadcrumb-item ${index === breadcrumb.length - 1 ? 'active' : ''}">
                <i class="${item.icon}"></i>
                <span>${item.name}</span>
            </a>
            ${index < breadcrumb.length - 1 ? '<i class="fas fa-chevron-right breadcrumb-separator"></i>' : ''}
        `).join('');
    }

    // Highlight current section
    highlightSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        section.classList.add('highlighted');
        
        setTimeout(() => {
            section.classList.remove('highlighted');
        }, 2000);
    }

    // Page transition animation
    transitionToPage(url) {
        // Add fade out animation
        document.body.classList.add('page-transition-out');
        
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }

    // Event system
    triggerEvent(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        window.dispatchEvent(event);
    }

    // Quick navigation shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + H - Home
            if (e.altKey && e.key === 'h') {
                e.preventDefault();
                this.navigateTo('home');
            }
            // Alt + D - Discovery
            if (e.altKey && e.key === 'd') {
                e.preventDefault();
                this.navigateTo('discovery');
            }
            // Alt + F - Favorites
            if (e.altKey && e.key === 'f') {
                e.preventDefault();
                this.navigateTo('favorites');
            }
            // Alt + P - Playlists
            if (e.altKey && e.key === 'p') {
                e.preventDefault();
                this.navigateTo('playlist');
            }
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationHandler;
}

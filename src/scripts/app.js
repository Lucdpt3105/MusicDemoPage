/**
 * Groovezilla - Main Application Controller
 * Core functionality and app initialization
 */

class GroovezillaApp {
    constructor() {
        this.version = '1.0.0';
        this.appName = 'Groovezilla';
        this.currentUser = null;
        this.isInitialized = false;
        
        this.init();
    }

    async init() {
        console.log(`🎵 ${this.appName} v${this.version} initializing...`);
        
        try {
            await this.loadUserSession();
            await this.initializeComponents();
            this.setupGlobalEventListeners();
            this.isInitialized = true;
            
            console.log('✨ App initialized successfully');
            this.triggerEvent('app:ready');
        } catch (error) {
            console.error('❌ App initialization failed:', error);
            this.handleInitError(error);
        }
    }

    async loadUserSession() {
        // Load user data from localStorage or API
        const savedUser = StorageManager.get('currentUser');
        if (savedUser) {
            this.currentUser = savedUser;
            console.log('👤 User session loaded:', savedUser.name);
        } else {
            this.currentUser = this.createGuestUser();
        }
    }

    createGuestUser() {
        return {
            id: 'guest',
            name: 'Guest User',
            avatar: null,
            isGuest: true
        };
    }

    async initializeComponents() {
        // Initialize various app components
        if (typeof ThemeManager !== 'undefined') {
            window.themeManager = new ThemeManager();
        }
        
        if (typeof NavigationHandler !== 'undefined') {
            window.navigationHandler = new NavigationHandler();
        }
        
        // Initialize page-specific components
        this.initializePageComponents();
    }

    initializePageComponents() {
        const page = this.getCurrentPage();
        console.log('📄 Current page:', page);

        // Initialize components based on current page
        switch(page) {
            case 'home':
                this.initHomePage();
                break;
            case 'discovery':
                if (typeof DiscoveryManager !== 'undefined') {
                    window.discoveryManager = new DiscoveryManager();
                }
                break;
            case 'favorites':
                if (typeof FavoritesManager !== 'undefined') {
                    window.favoritesManager = new FavoritesManager();
                }
                break;
            case 'history':
                if (typeof HistoryTracker !== 'undefined') {
                    window.historyTracker = new HistoryTracker();
                }
                break;
            case 'playlist':
                if (typeof PlaylistManager !== 'undefined') {
                    window.playlistManager = new PlaylistManager();
                }
                break;
            case 'album':
                if (typeof AlbumManager !== 'undefined') {
                    window.albumManager = new AlbumManager();
                }
                break;
            case 'settings':
                if (typeof SettingsHandler !== 'undefined') {
                    window.settingsHandler = new SettingsHandler();
                }
                break;
        }
    }

    initHomePage() {
        console.log('🏠 Initializing home page...');
        // Home page specific initialization
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().replace('.html', '') || 'index';
        
        if (filename === 'index' || filename === '') return 'home';
        return filename;
    }

    setupGlobalEventListeners() {
        // Handle online/offline status
        window.addEventListener('online', () => this.handleOnlineStatus(true));
        window.addEventListener('offline', () => this.handleOnlineStatus(false));

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.triggerEvent('app:background');
            } else {
                this.triggerEvent('app:foreground');
            }
        });

        // Handle before unload
        window.addEventListener('beforeunload', (e) => {
            this.saveAppState();
        });
    }

    handleOnlineStatus(isOnline) {
        console.log(isOnline ? '🌐 Back online' : '📴 Offline mode');
        this.triggerEvent('app:connection', { isOnline });
        
        if (isOnline) {
            UIUtils.showToast('Back online', 'success');
        } else {
            UIUtils.showToast('Offline mode - Some features may be limited', 'warning');
        }
    }

    saveAppState() {
        // Save current app state before closing
        if (this.currentUser && !this.currentUser.isGuest) {
            StorageManager.set('currentUser', this.currentUser);
        }
        console.log('💾 App state saved');
    }

    handleInitError(error) {
        // Show error message to user
        if (typeof UIUtils !== 'undefined') {
            UIUtils.showToast('Failed to initialize app. Please refresh the page.', 'error');
        }
    }

    // Event system
    triggerEvent(eventName, data = {}) {
        const event = new CustomEvent(eventName, { detail: data });
        window.dispatchEvent(event);
    }

    on(eventName, callback) {
        window.addEventListener(eventName, callback);
    }

    // User methods
    setUser(userData) {
        this.currentUser = userData;
        StorageManager.set('currentUser', userData);
        this.triggerEvent('user:changed', userData);
    }

    getUser() {
        return this.currentUser;
    }

    logout() {
        this.currentUser = this.createGuestUser();
        StorageManager.remove('currentUser');
        this.triggerEvent('user:logout');
        UIUtils.showToast('Logged out successfully', 'success');
    }

    // Utility methods
    isReady() {
        return this.isInitialized;
    }

    getVersion() {
        return this.version;
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new GroovezillaApp();
    });
} else {
    window.app = new GroovezillaApp();
}

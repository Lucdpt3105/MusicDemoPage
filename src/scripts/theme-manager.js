/**
 * Groovezilla - Theme Manager
 * Handle theme switching and customization
 */

class ThemeManager {
    constructor() {
        this.currentTheme = 'dark';
        this.themes = {
            dark: {
                name: 'Dark',
                colors: {
                    primary: '#8b5cf6',
                    secondary: '#ec4899',
                    background: '#0a0a0a',
                    surface: '#1a1a1a',
                    text: '#ffffff',
                    textSecondary: 'rgba(255, 255, 255, 0.7)'
                }
            },
            light: {
                name: 'Light',
                colors: {
                    primary: '#8b5cf6',
                    secondary: '#ec4899',
                    background: '#ffffff',
                    surface: '#f5f5f5',
                    text: '#000000',
                    textSecondary: 'rgba(0, 0, 0, 0.7)'
                }
            },
            purple: {
                name: 'Purple Dream',
                colors: {
                    primary: '#a855f7',
                    secondary: '#ec4899',
                    background: '#0f0618',
                    surface: '#1a0b2e',
                    text: '#ffffff',
                    textSecondary: 'rgba(255, 255, 255, 0.7)'
                }
            },
            ocean: {
                name: 'Ocean Blue',
                colors: {
                    primary: '#0ea5e9',
                    secondary: '#06b6d4',
                    background: '#020617',
                    surface: '#0f172a',
                    text: '#ffffff',
                    textSecondary: 'rgba(255, 255, 255, 0.7)'
                }
            },
            sunset: {
                name: 'Sunset',
                colors: {
                    primary: '#f97316',
                    secondary: '#ef4444',
                    background: '#1c0f0a',
                    surface: '#2d1810',
                    text: '#ffffff',
                    textSecondary: 'rgba(255, 255, 255, 0.7)'
                }
            }
        };

        this.init();
    }

    init() {
        this.loadSavedTheme();
        this.applyTheme(this.currentTheme);
        this.setupThemeControls();
        console.log('🎨 Theme Manager initialized');
    }

    loadSavedTheme() {
        const saved = StorageManager.get('theme');
        if (saved && this.themes[saved]) {
            this.currentTheme = saved;
        }
    }

    applyTheme(themeName) {
        if (!this.themes[themeName]) {
            console.warn(`Theme '${themeName}' not found`);
            return;
        }

        const theme = this.themes[themeName];
        this.currentTheme = themeName;

        // Apply CSS variables
        const root = document.documentElement;
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });

        // Update body class
        document.body.className = `theme-${themeName}`;

        // Save preference
        StorageManager.set('theme', themeName);

        // Trigger event
        this.triggerThemeChange(themeName);

        console.log(`Theme changed to: ${theme.name}`);
    }

    setupThemeControls() {
        // Create theme switcher button if doesn't exist
        const existingSwitcher = document.getElementById('theme-switcher');
        if (existingSwitcher) return;

        const switcher = document.createElement('div');
        switcher.id = 'theme-switcher';
        switcher.className = 'theme-switcher';
        switcher.innerHTML = `
            <button class="theme-switcher-btn" title="Change theme">
                <i class="fas fa-palette"></i>
            </button>
            <div class="theme-menu">
                ${Object.entries(this.themes).map(([key, theme]) => `
                    <button class="theme-option ${key === this.currentTheme ? 'active' : ''}" 
                            data-theme="${key}">
                        <span class="theme-preview" style="background: ${theme.colors.primary}"></span>
                        <span>${theme.name}</span>
                        ${key === this.currentTheme ? '<i class="fas fa-check"></i>' : ''}
                    </button>
                `).join('')}
            </div>
        `;

        this.injectStyles();
        document.body.appendChild(switcher);

        // Handle theme switcher toggle
        const btn = switcher.querySelector('.theme-switcher-btn');
        const menu = switcher.querySelector('.theme-menu');

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('show');
        });

        // Handle theme selection
        switcher.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.getAttribute('data-theme');
                this.applyTheme(theme);
                
                // Update active state
                switcher.querySelectorAll('.theme-option').forEach(opt => {
                    opt.classList.remove('active');
                    opt.querySelector('.fa-check')?.remove();
                });
                option.classList.add('active');
                option.innerHTML += '<i class="fas fa-check"></i>';
                
                menu.classList.remove('show');
                UIUtils.showToast(`Theme changed to ${this.themes[theme].name}`, 'success');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', () => {
            menu.classList.remove('show');
        });
    }

    injectStyles() {
        if (document.getElementById('theme-switcher-styles')) return;

        const style = document.createElement('style');
        style.id = 'theme-switcher-styles';
        style.textContent = `
            .theme-switcher {
                position: fixed;
                bottom: 100px;
                right: 20px;
                z-index: 1000;
            }
            .theme-switcher-btn {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #8b5cf6, #ec4899);
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
                transition: all 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .theme-switcher-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(139, 92, 246, 0.6);
            }
            .theme-menu {
                position: absolute;
                bottom: 60px;
                right: 0;
                background: rgba(30, 30, 30, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 12px;
                padding: 8px;
                min-width: 200px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(10px);
                transition: all 0.3s;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            }
            .theme-menu.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            .theme-option {
                width: 100%;
                padding: 12px;
                background: transparent;
                border: none;
                border-radius: 8px;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 12px;
                transition: background 0.2s;
                font-size: 14px;
            }
            .theme-option:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            .theme-option.active {
                background: rgba(139, 92, 246, 0.2);
            }
            .theme-preview {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                flex-shrink: 0;
            }
            .theme-option span:nth-child(2) {
                flex: 1;
                text-align: left;
            }
            .theme-option i {
                color: #10b981;
                font-size: 14px;
            }
        `;
        document.head.appendChild(style);
    }

    getTheme() {
        return this.currentTheme;
    }

    getThemeColors() {
        return this.themes[this.currentTheme].colors;
    }

    getAllThemes() {
        return Object.keys(this.themes);
    }

    triggerThemeChange(themeName) {
        const event = new CustomEvent('theme:changed', { 
            detail: { 
                theme: themeName,
                colors: this.themes[themeName].colors
            } 
        });
        window.dispatchEvent(event);
    }

    // Add custom theme
    addTheme(name, config) {
        this.themes[name] = config;
        console.log(`Added custom theme: ${name}`);
    }

    // Toggle between light and dark
    toggleLightDark() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}

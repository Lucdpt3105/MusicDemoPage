/**
 * Groovezilla - Settings Handler
 * Handle app settings and preferences
 */

class SettingsHandler {
    constructor() {
        this.settings = this.getDefaultSettings();
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupSettingsUI();
        console.log('⚙️ Settings Handler initialized');
    }

    getDefaultSettings() {
        return {
            // Audio settings
            audio: {
                volume: 70,
                quality: 'high', // low, medium, high, lossless
                crossfade: false,
                crossfadeDuration: 5,
                normalize: true,
                gaplessPlayback: true
            },
            
            // Playback settings
            playback: {
                autoplay: true,
                repeatMode: 'off', // off, one, all
                shuffleMode: false,
                showLyrics: true,
                autoSkipDisliked: false
            },
            
            // Display settings
            display: {
                theme: 'dark',
                language: 'en',
                showAnimations: true,
                compactMode: false,
                showCoverInBackground: true
            },
            
            // Privacy settings
            privacy: {
                privateSession: false,
                showListeningActivity: true,
                allowRecommendations: true,
                shareListeningHistory: false
            },
            
            // Notification settings
            notifications: {
                enabled: true,
                newReleases: true,
                friendActivity: true,
                recommendations: true
            },
            
            // Storage settings
            storage: {
                downloadQuality: 'high',
                maxStorageSize: 5000, // MB
                autoDownload: false,
                offlineMode: false
            }
        };
    }

    loadSettings() {
        const saved = StorageManager.get('settings');
        if (saved) {
            this.settings = { ...this.getDefaultSettings(), ...saved };
        }
    }

    saveSettings() {
        StorageManager.set('settings', this.settings);
        this.triggerEvent('settings:changed', this.settings);
    }

    setupSettingsUI() {
        // Setup Audio Settings
        this.setupAudioSettings();
        
        // Setup Playback Settings
        this.setupPlaybackSettings();
        
        // Setup Display Settings
        this.setupDisplaySettings();
        
        // Setup Privacy Settings
        this.setupPrivacySettings();
        
        // Setup Notification Settings
        this.setupNotificationSettings();
        
        // Setup Storage Settings
        this.setupStorageSettings();
        
        // Setup Action Buttons
        this.setupActionButtons();
    }

    setupAudioSettings() {
        // Volume slider
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) {
            volumeSlider.value = this.settings.audio.volume;
            volumeSlider.addEventListener('input', (e) => {
                this.updateSetting('audio.volume', parseInt(e.target.value));
                this.updateVolumeDisplay(e.target.value);
            });
        }

        // Audio quality
        const qualitySelect = document.getElementById('audioQuality');
        if (qualitySelect) {
            qualitySelect.value = this.settings.audio.quality;
            qualitySelect.addEventListener('change', (e) => {
                this.updateSetting('audio.quality', e.target.value);
            });
        }

        // Crossfade
        const crossfadeToggle = document.getElementById('crossfadeToggle');
        if (crossfadeToggle) {
            crossfadeToggle.checked = this.settings.audio.crossfade;
            crossfadeToggle.addEventListener('change', (e) => {
                this.updateSetting('audio.crossfade', e.target.checked);
            });
        }

        // Normalize volume
        const normalizeToggle = document.getElementById('normalizeToggle');
        if (normalizeToggle) {
            normalizeToggle.checked = this.settings.audio.normalize;
            normalizeToggle.addEventListener('change', (e) => {
                this.updateSetting('audio.normalize', e.target.checked);
            });
        }
    }

    setupPlaybackSettings() {
        // Autoplay
        const autoplayToggle = document.getElementById('autoplayToggle');
        if (autoplayToggle) {
            autoplayToggle.checked = this.settings.playback.autoplay;
            autoplayToggle.addEventListener('change', (e) => {
                this.updateSetting('playback.autoplay', e.target.checked);
            });
        }

        // Repeat mode
        const repeatSelect = document.getElementById('repeatMode');
        if (repeatSelect) {
            repeatSelect.value = this.settings.playback.repeatMode;
            repeatSelect.addEventListener('change', (e) => {
                this.updateSetting('playback.repeatMode', e.target.value);
            });
        }

        // Show lyrics
        const lyricsToggle = document.getElementById('showLyricsToggle');
        if (lyricsToggle) {
            lyricsToggle.checked = this.settings.playback.showLyrics;
            lyricsToggle.addEventListener('change', (e) => {
                this.updateSetting('playback.showLyrics', e.target.checked);
            });
        }
    }

    setupDisplaySettings() {
        // Theme
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.value = this.settings.display.theme;
            themeSelect.addEventListener('change', (e) => {
                this.updateSetting('display.theme', e.target.value);
                if (typeof window.themeManager !== 'undefined') {
                    window.themeManager.applyTheme(e.target.value);
                }
            });
        }

        // Language
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = this.settings.display.language;
            languageSelect.addEventListener('change', (e) => {
                this.updateSetting('display.language', e.target.value);
            });
        }

        // Animations
        const animationsToggle = document.getElementById('animationsToggle');
        if (animationsToggle) {
            animationsToggle.checked = this.settings.display.showAnimations;
            animationsToggle.addEventListener('change', (e) => {
                this.updateSetting('display.showAnimations', e.target.checked);
                this.toggleAnimations(e.target.checked);
            });
        }

        // Compact mode
        const compactToggle = document.getElementById('compactModeToggle');
        if (compactToggle) {
            compactToggle.checked = this.settings.display.compactMode;
            compactToggle.addEventListener('change', (e) => {
                this.updateSetting('display.compactMode', e.target.checked);
                this.toggleCompactMode(e.target.checked);
            });
        }
    }

    setupPrivacySettings() {
        // Private session
        const privateSessionToggle = document.getElementById('privateSessionToggle');
        if (privateSessionToggle) {
            privateSessionToggle.checked = this.settings.privacy.privateSession;
            privateSessionToggle.addEventListener('change', (e) => {
                this.updateSetting('privacy.privateSession', e.target.checked);
            });
        }

        // Show listening activity
        const activityToggle = document.getElementById('showActivityToggle');
        if (activityToggle) {
            activityToggle.checked = this.settings.privacy.showListeningActivity;
            activityToggle.addEventListener('change', (e) => {
                this.updateSetting('privacy.showListeningActivity', e.target.checked);
            });
        }

        // Allow recommendations
        const recommendationsToggle = document.getElementById('recommendationsToggle');
        if (recommendationsToggle) {
            recommendationsToggle.checked = this.settings.privacy.allowRecommendations;
            recommendationsToggle.addEventListener('change', (e) => {
                this.updateSetting('privacy.allowRecommendations', e.target.checked);
            });
        }
    }

    setupNotificationSettings() {
        // Enable notifications
        const notificationsToggle = document.getElementById('notificationsToggle');
        if (notificationsToggle) {
            notificationsToggle.checked = this.settings.notifications.enabled;
            notificationsToggle.addEventListener('change', (e) => {
                this.updateSetting('notifications.enabled', e.target.checked);
                if (e.target.checked) {
                    this.requestNotificationPermission();
                }
            });
        }

        // New releases
        const newReleasesToggle = document.getElementById('newReleasesToggle');
        if (newReleasesToggle) {
            newReleasesToggle.checked = this.settings.notifications.newReleases;
            newReleasesToggle.addEventListener('change', (e) => {
                this.updateSetting('notifications.newReleases', e.target.checked);
            });
        }
    }

    setupStorageSettings() {
        // Download quality
        const downloadQualitySelect = document.getElementById('downloadQuality');
        if (downloadQualitySelect) {
            downloadQualitySelect.value = this.settings.storage.downloadQuality;
            downloadQualitySelect.addEventListener('change', (e) => {
                this.updateSetting('storage.downloadQuality', e.target.value);
            });
        }

        // Display storage usage
        this.displayStorageUsage();
    }

    setupActionButtons() {
        // Reset settings
        const resetBtn = document.getElementById('resetSettingsBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetSettings();
            });
        }

        // Export settings
        const exportBtn = document.getElementById('exportSettingsBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportSettings();
            });
        }

        // Import settings
        const importBtn = document.getElementById('importSettingsBtn');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                this.importSettings();
            });
        }

        // Clear cache
        const clearCacheBtn = document.getElementById('clearCacheBtn');
        if (clearCacheBtn) {
            clearCacheBtn.addEventListener('click', () => {
                this.clearCache();
            });
        }
    }

    updateSetting(path, value) {
        const keys = path.split('.');
        let obj = this.settings;
        
        for (let i = 0; i < keys.length - 1; i++) {
            obj = obj[keys[i]];
        }
        
        obj[keys[keys.length - 1]] = value;
        this.saveSettings();
        
        console.log(`Setting updated: ${path} = ${value}`);
    }

    getSetting(path) {
        const keys = path.split('.');
        let value = this.settings;
        
        for (const key of keys) {
            value = value[key];
            if (value === undefined) break;
        }
        
        return value;
    }

    resetSettings() {
        UIUtils.confirm(
            'Reset Settings',
            'Are you sure you want to reset all settings to default? This action cannot be undone.',
            () => {
                this.settings = this.getDefaultSettings();
                this.saveSettings();
                location.reload();
            }
        );
    }

    exportSettings() {
        const data = JSON.stringify(this.settings, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'groovezilla-settings.json';
        a.click();
        URL.revokeObjectURL(url);
        
        UIUtils.showToast('Settings exported', 'success');
    }

    async importSettings() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                const text = await file.text();
                const imported = JSON.parse(text);
                
                this.settings = { ...this.getDefaultSettings(), ...imported };
                this.saveSettings();
                
                UIUtils.showToast('Settings imported successfully', 'success');
                location.reload();
            } catch (error) {
                console.error('Import error:', error);
                UIUtils.showToast('Failed to import settings', 'error');
            }
        };
        
        input.click();
    }

    clearCache() {
        UIUtils.confirm(
            'Clear Cache',
            'This will clear all cached data. Are you sure?',
            () => {
                if (typeof window.dataService !== 'undefined') {
                    window.dataService.clearCache();
                }
                UIUtils.showToast('Cache cleared', 'success');
            }
        );
    }

    toggleAnimations(enabled) {
        if (enabled) {
            document.body.classList.remove('no-animations');
        } else {
            document.body.classList.add('no-animations');
        }
    }

    toggleCompactMode(enabled) {
        if (enabled) {
            document.body.classList.add('compact-mode');
        } else {
            document.body.classList.remove('compact-mode');
        }
    }

    updateVolumeDisplay(value) {
        const display = document.getElementById('volumeValue');
        if (display) {
            display.textContent = `${value}%`;
        }
    }

    displayStorageUsage() {
        const storageSize = StorageManager.getSize();
        const storageMB = (storageSize / (1024 * 1024)).toFixed(2);
        
        const display = document.getElementById('storageUsage');
        if (display) {
            display.textContent = `${storageMB} MB used`;
        }
    }

    async requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                UIUtils.showToast('Notifications enabled', 'success');
            } else {
                this.updateSetting('notifications.enabled', false);
            }
        }
    }

    triggerEvent(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        window.dispatchEvent(event);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SettingsHandler;
}

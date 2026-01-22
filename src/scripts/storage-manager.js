/**
 * Groovezilla - Storage Manager (Standalone)
 * Can be used independently
 */

class StorageManager {
    static PREFIX = 'groovezilla_';

    static set(key, value) {
        try {
            const prefixedKey = this.PREFIX + key;
            const serialized = JSON.stringify(value);
            localStorage.setItem(prefixedKey, serialized);
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    }

    static get(key, defaultValue = null) {
        try {
            const prefixedKey = this.PREFIX + key;
            const item = localStorage.getItem(prefixedKey);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Storage get error:', error);
            return defaultValue;
        }
    }

    static remove(key) {
        try {
            const prefixedKey = this.PREFIX + key;
            localStorage.removeItem(prefixedKey);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    }

    static clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    }

    static has(key) {
        const prefixedKey = this.PREFIX + key;
        return localStorage.getItem(prefixedKey) !== null;
    }

    static getAllKeys() {
        const keys = Object.keys(localStorage);
        return keys
            .filter(key => key.startsWith(this.PREFIX))
            .map(key => key.replace(this.PREFIX, ''));
    }

    static getSize() {
        let total = 0;
        for (let key in localStorage) {
            if (key.startsWith(this.PREFIX)) {
                total += localStorage[key].length + key.length;
            }
        }
        return total;
    }

    static exportData() {
        const data = {};
        const keys = this.getAllKeys();
        keys.forEach(key => {
            data[key] = this.get(key);
        });
        return data;
    }

    static importData(data) {
        try {
            Object.entries(data).forEach(([key, value]) => {
                this.set(key, value);
            });
            return true;
        } catch (error) {
            console.error('Import error:', error);
            return false;
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
}

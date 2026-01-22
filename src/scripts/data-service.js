/**
 * Groovezilla - Storage Manager
 * Handle localStorage and data persistence
 */

class StorageManager {
    static PREFIX = 'groovezilla_';

    // Set item in localStorage
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

    // Get item from localStorage
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

    // Remove item from localStorage
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

    // Clear all app data
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

    // Check if key exists
    static has(key) {
        const prefixedKey = this.PREFIX + key;
        return localStorage.getItem(prefixedKey) !== null;
    }

    // Get all keys
    static getAllKeys() {
        const keys = Object.keys(localStorage);
        return keys
            .filter(key => key.startsWith(this.PREFIX))
            .map(key => key.replace(this.PREFIX, ''));
    }

    // Get storage size
    static getSize() {
        let total = 0;
        for (let key in localStorage) {
            if (key.startsWith(this.PREFIX)) {
                total += localStorage[key].length + key.length;
            }
        }
        return total;
    }

    // Export all data
    static exportData() {
        const data = {};
        const keys = this.getAllKeys();
        keys.forEach(key => {
            data[key] = this.get(key);
        });
        return data;
    }

    // Import data
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

/**
 * Groovezilla - Data Service
 * Handle API calls and data management
 */

class DataService {
    constructor() {
        this.baseURL = '/api'; // Change this to your API endpoint
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    // Generic fetch method
    async fetch(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const cacheKey = `${endpoint}_${JSON.stringify(options)}`;

        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                console.log('📦 Returning cached data for:', endpoint);
                return cached.data;
            }
        }

        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Cache the result
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });

            return data;
        } catch (error) {
            console.error('Fetch error:', error);
            
            // Return mock data in development
            if (this.isDevelopment()) {
                console.log('🔧 Development mode: returning mock data');
                return this.getMockData(endpoint);
            }
            
            throw error;
        }
    }

    // GET request
    async get(endpoint) {
        return this.fetch(endpoint, { method: 'GET' });
    }

    // POST request
    async post(endpoint, data) {
        return this.fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // PUT request
    async put(endpoint, data) {
        return this.fetch(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // DELETE request
    async delete(endpoint) {
        return this.fetch(endpoint, { method: 'DELETE' });
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Cache cleared');
    }

    // Check if in development mode
    isDevelopment() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1';
    }

    // Get mock data for development
    getMockData(endpoint) {
        const mockData = {
            '/tracks': this.generateMockTracks(),
            '/artists': this.generateMockArtists(),
            '/playlists': this.generateMockPlaylists(),
            '/albums': this.generateMockAlbums()
        };

        return mockData[endpoint] || { message: 'Mock data not available' };
    }

    generateMockTracks(count = 20) {
        const tracks = [];
        const genres = ['pop', 'rock', 'jazz', 'electronic', 'hip-hop', 'classical'];
        
        for (let i = 1; i <= count; i++) {
            tracks.push({
                id: i,
                title: `Track ${i}`,
                artist: `Artist ${Math.ceil(i / 3)}`,
                album: `Album ${Math.ceil(i / 5)}`,
                duration: Math.floor(Math.random() * 300) + 120,
                genre: genres[Math.floor(Math.random() * genres.length)],
                cover: `https://images.unsplash.com/photo-${1485579149621 + i}?w=300&h=300&fit=crop`,
                plays: Math.floor(Math.random() * 10000),
                likes: Math.floor(Math.random() * 1000),
                releaseDate: new Date(2020 + Math.floor(Math.random() * 6), Math.floor(Math.random() * 12), 1).toISOString()
            });
        }
        
        return tracks;
    }

    generateMockArtists(count = 15) {
        const artists = [];
        
        for (let i = 1; i <= count; i++) {
            artists.push({
                id: i,
                name: `Artist ${i}`,
                genre: ['Pop', 'Rock', 'Jazz', 'Electronic'][Math.floor(Math.random() * 4)],
                followers: Math.floor(Math.random() * 1000000),
                image: `https://images.unsplash.com/photo-${1493225457124 + i}?w=300&h=300&fit=crop&crop=faces`,
                verified: Math.random() > 0.5,
                bio: `This is a bio for Artist ${i}. They make amazing music.`
            });
        }
        
        return artists;
    }

    generateMockPlaylists(count = 10) {
        const playlists = [];
        
        for (let i = 1; i <= count; i++) {
            playlists.push({
                id: i,
                name: `Playlist ${i}`,
                description: `A curated collection of tracks ${i}`,
                cover: `https://images.unsplash.com/photo-${1511671782779 + i}?w=300&h=300&fit=crop`,
                trackCount: Math.floor(Math.random() * 50) + 10,
                duration: Math.floor(Math.random() * 10000) + 1000,
                isPublic: Math.random() > 0.5,
                owner: `User ${Math.ceil(i / 3)}`,
                followers: Math.floor(Math.random() * 50000)
            });
        }
        
        return playlists;
    }

    generateMockAlbums(count = 12) {
        const albums = [];
        
        for (let i = 1; i <= count; i++) {
            albums.push({
                id: i,
                title: `Album ${i}`,
                artist: `Artist ${Math.ceil(i / 2)}`,
                cover: `https://images.unsplash.com/photo-${1514320291840 + i}?w=300&h=300&fit=crop`,
                trackCount: Math.floor(Math.random() * 15) + 8,
                releaseDate: new Date(2020 + Math.floor(Math.random() * 6), Math.floor(Math.random() * 12), 1).toISOString(),
                genre: ['Pop', 'Rock', 'Jazz', 'Electronic'][Math.floor(Math.random() * 4)],
                duration: Math.floor(Math.random() * 3000) + 1800
            });
        }
        
        return albums;
    }

    // Specific API methods
    async getTracks(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.get(`/tracks?${query}`);
    }

    async getTrack(id) {
        return this.get(`/tracks/${id}`);
    }

    async getArtists(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.get(`/artists?${query}`);
    }

    async getArtist(id) {
        return this.get(`/artists/${id}`);
    }

    async getPlaylists() {
        return this.get('/playlists');
    }

    async getPlaylist(id) {
        return this.get(`/playlists/${id}`);
    }

    async createPlaylist(data) {
        return this.post('/playlists', data);
    }

    async updatePlaylist(id, data) {
        return this.put(`/playlists/${id}`, data);
    }

    async deletePlaylist(id) {
        return this.delete(`/playlists/${id}`);
    }

    async getAlbums() {
        return this.get('/albums');
    }

    async getAlbum(id) {
        return this.get(`/albums/${id}`);
    }

    async search(query, type = 'all') {
        return this.get(`/search?q=${encodeURIComponent(query)}&type=${type}`);
    }

    async getFavorites() {
        const favorites = StorageManager.get('favorites', []);
        return favorites;
    }

    async addToFavorites(trackId) {
        const favorites = await this.getFavorites();
        if (!favorites.includes(trackId)) {
            favorites.push(trackId);
            StorageManager.set('favorites', favorites);
        }
        return favorites;
    }

    async removeFromFavorites(trackId) {
        const favorites = await this.getFavorites();
        const filtered = favorites.filter(id => id !== trackId);
        StorageManager.set('favorites', filtered);
        return filtered;
    }

    async getHistory() {
        return StorageManager.get('history', []);
    }

    async addToHistory(track) {
        const history = await this.getHistory();
        history.unshift({
            ...track,
            playedAt: new Date().toISOString()
        });
        
        // Keep only last 100 items
        if (history.length > 100) {
            history.splice(100);
        }
        
        StorageManager.set('history', history);
        return history;
    }
}

// Create global instance
window.dataService = new DataService();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StorageManager, DataService };
}

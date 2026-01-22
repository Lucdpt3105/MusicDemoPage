/**
 * Groovezilla - Favorites Manager
 * Handle favorite tracks and management
 */

class FavoritesManager {
    constructor() {
        this.favorites = [];
        this.init();
    }

    async init() {
        await this.loadFavorites();
        this.setupEventListeners();
        console.log('❤️ Favorites Manager initialized');
    }

    async loadFavorites() {
        this.favorites = StorageManager.get('favorites', []);
    }

    // Add track to favorites
    addToFavorites(track) {
        // Check if already exists
        const exists = this.favorites.some(f => f.id === track.id);
        if (exists) {
            UIUtils.showToast('Already in favorites', 'warning');
            return false;
        }

        const favorite = {
            ...track,
            addedAt: new Date().toISOString()
        };

        this.favorites.unshift(favorite);
        this.saveFavorites();
        
        UIUtils.showToast('Added to favorites', 'success');
        this.triggerEvent('favorites:added', favorite);
        
        return true;
    }

    // Remove from favorites
    removeFromFavorites(trackId) {
        const initialLength = this.favorites.length;
        this.favorites = this.favorites.filter(f => f.id !== trackId);

        if (this.favorites.length === initialLength) {
            return false;
        }

        this.saveFavorites();
        
        UIUtils.showToast('Removed from favorites', 'success');
        this.triggerEvent('favorites:removed', { trackId });
        
        return true;
    }

    // Toggle favorite status
    toggleFavorite(track) {
        if (this.isFavorite(track.id)) {
            return this.removeFromFavorites(track.id);
        } else {
            return this.addToFavorites(track);
        }
    }

    // Check if track is favorite
    isFavorite(trackId) {
        return this.favorites.some(f => f.id === trackId);
    }

    // Get all favorites
    getFavorites() {
        return this.favorites;
    }

    // Get favorites by genre
    getFavoritesByGenre(genre) {
        return this.favorites.filter(f => f.genre === genre);
    }

    // Get favorites by artist
    getFavoritesByArtist(artistName) {
        return this.favorites.filter(f => f.artist === artistName);
    }

    // Search favorites
    searchFavorites(query) {
        const lowerQuery = query.toLowerCase();
        return this.favorites.filter(f =>
            f.title.toLowerCase().includes(lowerQuery) ||
            f.artist.toLowerCase().includes(lowerQuery) ||
            f.album?.toLowerCase().includes(lowerQuery)
        );
    }

    // Sort favorites
    sortFavorites(sortBy = 'recent') {
        let sorted = [...this.favorites];

        switch (sortBy) {
            case 'recent':
                sorted.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
                break;
            case 'oldest':
                sorted.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
                break;
            case 'title':
                sorted.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'artist':
                sorted.sort((a, b) => a.artist.localeCompare(b.artist));
                break;
        }

        return sorted;
    }

    // Get favorite statistics
    getStats() {
        const genres = {};
        const artists = {};
        
        this.favorites.forEach(f => {
            // Count genres
            genres[f.genre] = (genres[f.genre] || 0) + 1;
            
            // Count artists
            artists[f.artist] = (artists[f.artist] || 0) + 1;
        });

        const topGenre = Object.entries(genres)
            .sort((a, b) => b[1] - a[1])[0];
        
        const topArtist = Object.entries(artists)
            .sort((a, b) => b[1] - a[1])[0];

        return {
            total: this.favorites.length,
            topGenre: topGenre ? topGenre[0] : null,
            topGenreCount: topGenre ? topGenre[1] : 0,
            topArtist: topArtist ? topArtist[0] : null,
            topArtistCount: topArtist ? topArtist[1] : 0,
            genres: Object.keys(genres).length,
            artists: Object.keys(artists).length
        };
    }

    // Clear all favorites
    clearAll() {
        UIUtils.confirm(
            'Clear Favorites',
            'Are you sure you want to remove all favorites? This action cannot be undone.',
            () => {
                this.favorites = [];
                this.saveFavorites();
                UIUtils.showToast('All favorites cleared', 'success');
                this.triggerEvent('favorites:cleared');
            }
        );
    }

    // Export favorites
    exportFavorites() {
        if (this.favorites.length === 0) {
            UIUtils.showToast('No favorites to export', 'warning');
            return;
        }

        const data = JSON.stringify(this.favorites, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `groovezilla-favorites-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        UIUtils.showToast('Favorites exported', 'success');
    }

    // Import favorites
    async importFavorites(file) {
        try {
            const text = await file.text();
            const imported = JSON.parse(text);
            
            if (!Array.isArray(imported)) {
                throw new Error('Invalid format');
            }

            // Merge with existing favorites
            imported.forEach(track => {
                if (!this.isFavorite(track.id)) {
                    this.favorites.push({
                        ...track,
                        addedAt: track.addedAt || new Date().toISOString()
                    });
                }
            });

            this.saveFavorites();
            UIUtils.showToast(`Imported ${imported.length} favorites`, 'success');
            this.triggerEvent('favorites:imported', { count: imported.length });
            
            return true;
        } catch (error) {
            console.error('Import error:', error);
            UIUtils.showToast('Failed to import favorites', 'error');
            return false;
        }
    }

    // Save to storage
    saveFavorites() {
        StorageManager.set('favorites', this.favorites);
    }

    // Setup event listeners for favorite buttons
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const favoriteBtn = e.target.closest('.btn-favorite, .btn-like');
            if (!favoriteBtn) return;

            const trackElement = favoriteBtn.closest('[data-track-id]');
            if (!trackElement) return;

            const trackId = parseInt(trackElement.getAttribute('data-track-id'));
            const isFavorited = this.isFavorite(trackId);

            // Toggle icon
            const icon = favoriteBtn.querySelector('i');
            if (icon) {
                if (isFavorited) {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    favoriteBtn.classList.remove('active');
                } else {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    favoriteBtn.classList.add('active');
                }
            }

            // Get track data (you'd normally get this from the DOM or data attribute)
            const trackData = this.getTrackDataFromElement(trackElement);
            if (trackData) {
                this.toggleFavorite(trackData);
            }
        });
    }

    // Helper to extract track data from element
    getTrackDataFromElement(element) {
        try {
            const trackId = parseInt(element.getAttribute('data-track-id'));
            const title = element.querySelector('.track-title, h4')?.textContent;
            const artist = element.querySelector('.track-artist, p')?.textContent;
            const cover = element.querySelector('img')?.src;

            if (trackId && title && artist) {
                return { id: trackId, title, artist, cover };
            }
        } catch (error) {
            console.error('Error extracting track data:', error);
        }
        return null;
    }

    // Event system
    triggerEvent(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        window.dispatchEvent(event);
    }

    // Get recently added favorites
    getRecentlyAdded(limit = 10) {
        return this.favorites.slice(0, limit);
    }

    // Get random favorites
    getRandomFavorites(count = 5) {
        const shuffled = [...this.favorites].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FavoritesManager;
}

/**
 * Groovezilla - Discovery Manager
 * Handle discovery/trending content
 */

class DiscoveryManager {
    constructor() {
        this.trendingTracks = [];
        this.recommendations = [];
        this.newReleases = [];
        this.featuredPlaylists = [];
        this.init();
    }

    async init() {
        await this.loadContent();
        this.setupFilters();
        console.log('🔥 Discovery Manager initialized');
    }

    async loadContent() {
        try {
            // Load different types of content
            await Promise.all([
                this.loadTrendingTracks(),
                this.loadRecommendations(),
                this.loadNewReleases(),
                this.loadFeaturedPlaylists()
            ]);
        } catch (error) {
            console.error('Failed to load discovery content:', error);
        }
    }

    async loadTrendingTracks() {
        try {
            this.trendingTracks = await window.dataService.getTracks({ 
                sort: 'trending',
                limit: 20 
            });
            this.renderTrendingTracks();
        } catch (error) {
            console.error('Failed to load trending tracks:', error);
        }
    }

    async loadRecommendations() {
        // Get recommendations based on user's listening history
        const history = StorageManager.get('history', []);
        const favorites = StorageManager.get('favorites', []);

        // Analyze genres and artists
        const genres = this.extractGenres(history, favorites);
        const artists = this.extractArtists(history, favorites);

        try {
            const allTracks = await window.dataService.getTracks();
            
            // Filter tracks by preferred genres/artists
            this.recommendations = allTracks.filter(track => 
                genres.includes(track.genre) || artists.includes(track.artist)
            ).slice(0, 15);

            this.renderRecommendations();
        } catch (error) {
            console.error('Failed to load recommendations:', error);
        }
    }

    async loadNewReleases() {
        try {
            const allTracks = await window.dataService.getTracks();
            
            // Sort by release date
            this.newReleases = allTracks
                .filter(track => track.releaseDate)
                .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
                .slice(0, 12);

            this.renderNewReleases();
        } catch (error) {
            console.error('Failed to load new releases:', error);
        }
    }

    async loadFeaturedPlaylists() {
        try {
            this.featuredPlaylists = await window.dataService.getPlaylists();
            this.renderFeaturedPlaylists();
        } catch (error) {
            console.error('Failed to load featured playlists:', error);
        }
    }

    extractGenres(history, favorites) {
        const genreCounts = {};
        [...history, ...favorites].forEach(track => {
            if (track.genre) {
                genreCounts[track.genre] = (genreCounts[track.genre] || 0) + 1;
            }
        });

        return Object.entries(genreCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([genre]) => genre);
    }

    extractArtists(history, favorites) {
        const artistCounts = {};
        [...history, ...favorites].forEach(track => {
            if (track.artist) {
                artistCounts[track.artist] = (artistCounts[track.artist] || 0) + 1;
            }
        });

        return Object.entries(artistCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([artist]) => artist);
    }

    renderTrendingTracks() {
        const container = document.getElementById('trendingTracksContainer');
        if (!container) return;

        container.innerHTML = this.trendingTracks.map((track, index) => `
            <div class="trending-track-card" data-track-id="${track.id}">
                <div class="trending-rank">${index + 1}</div>
                <img src="${track.cover}" alt="${track.title}">
                <div class="track-info">
                    <h4>${track.title}</h4>
                    <p>${track.artist}</p>
                    <div class="track-stats">
                        <span><i class="fas fa-play"></i> ${this.formatNumber(track.plays)}</span>
                        <span><i class="fas fa-heart"></i> ${this.formatNumber(track.likes)}</span>
                    </div>
                </div>
                <button class="btn-play-track">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `).join('');
    }

    renderRecommendations() {
        const container = document.getElementById('recommendationsContainer');
        if (!container) return;

        container.innerHTML = this.recommendations.map(track => `
            <div class="recommendation-card" data-track-id="${track.id}">
                <img src="${track.cover}" alt="${track.title}">
                <div class="recommendation-overlay">
                    <button class="btn-play-overlay">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
                <div class="recommendation-info">
                    <h4>${UIUtils.truncate(track.title, 30)}</h4>
                    <p>${UIUtils.truncate(track.artist, 25)}</p>
                </div>
            </div>
        `).join('');
    }

    renderNewReleases() {
        const container = document.getElementById('newReleasesContainer');
        if (!container) return;

        container.innerHTML = this.newReleases.map(track => `
            <div class="release-card" data-track-id="${track.id}">
                <div class="release-image">
                    <img src="${track.cover}" alt="${track.title}">
                    <span class="release-badge">NEW</span>
                </div>
                <div class="release-info">
                    <h4>${track.title}</h4>
                    <p>${track.artist}</p>
                    <span class="release-date">${this.formatReleaseDate(track.releaseDate)}</span>
                </div>
            </div>
        `).join('');
    }

    renderFeaturedPlaylists() {
        const container = document.getElementById('featuredPlaylistsContainer');
        if (!container) return;

        container.innerHTML = this.featuredPlaylists.map(playlist => `
            <div class="featured-playlist-card" data-playlist-id="${playlist.id}">
                <img src="${playlist.cover}" alt="${playlist.name}">
                <div class="playlist-overlay">
                    <button class="btn-play-playlist">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
                <div class="playlist-info">
                    <h4>${playlist.name}</h4>
                    <p>${playlist.trackCount} tracks • ${playlist.followers} followers</p>
                </div>
            </div>
        `).join('');
    }

    setupFilters() {
        // Genre filter
        const genreFilter = document.getElementById('genreFilter');
        if (genreFilter) {
            genreFilter.addEventListener('change', (e) => {
                this.filterByGenre(e.target.value);
            });
        }

        // Mood filter
        const moodFilter = document.getElementById('moodFilter');
        if (moodFilter) {
            moodFilter.addEventListener('change', (e) => {
                this.filterByMood(e.target.value);
            });
        }

        // Sort options
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortContent(e.target.value);
            });
        }
    }

    filterByGenre(genre) {
        if (genre === 'all') {
            this.renderTrendingTracks();
            return;
        }

        const filtered = this.trendingTracks.filter(track => track.genre === genre);
        const container = document.getElementById('trendingTracksContainer');
        if (container) {
            container.innerHTML = filtered.map((track, index) => `
                <div class="trending-track-card" data-track-id="${track.id}">
                    <div class="trending-rank">${index + 1}</div>
                    <img src="${track.cover}" alt="${track.title}">
                    <div class="track-info">
                        <h4>${track.title}</h4>
                        <p>${track.artist}</p>
                    </div>
                    <button class="btn-play-track">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            `).join('');
        }
    }

    filterByMood(mood) {
        // Implement mood-based filtering
        console.log('Filtering by mood:', mood);
    }

    sortContent(sortBy) {
        let sorted = [...this.trendingTracks];

        switch (sortBy) {
            case 'popular':
                sorted.sort((a, b) => (b.plays || 0) - (a.plays || 0));
                break;
            case 'recent':
                sorted.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
                break;
            case 'title':
                sorted.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }

        this.trendingTracks = sorted;
        this.renderTrendingTracks();
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num?.toString() || '0';
    }

    formatReleaseDate(dateString) {
        if (!dateString) return 'Unknown';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 7) return 'This week';
        if (diffDays <= 30) return 'This month';
        
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    // Refresh content
    async refresh() {
        UIUtils.showLoading('Refreshing content...');
        await this.loadContent();
        UIUtils.hideLoading();
        UIUtils.showToast('Content refreshed', 'success');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DiscoveryManager;
}

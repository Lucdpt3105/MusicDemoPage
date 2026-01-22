/**
 * Groovezilla - Album Manager
 * Handle album viewing and management
 */

class AlbumManager {
    constructor() {
        this.albums = [];
        this.currentAlbum = null;
        this.init();
    }

    async init() {
        await this.loadAlbums();
        this.setupEventListeners();
        console.log('💿 Album Manager initialized');
    }

    async loadAlbums() {
        try {
            this.albums = await window.dataService.getAlbums();
            this.renderAlbums();
        } catch (error) {
            console.error('Failed to load albums:', error);
        }
    }

    renderAlbums() {
        const container = document.getElementById('albumsGrid');
        if (!container) return;

        container.innerHTML = this.albums.map(album => `
            <div class="album-card" data-album-id="${album.id}">
                <div class="album-cover">
                    <img src="${album.cover}" alt="${album.title}">
                    <div class="album-overlay">
                        <button class="btn-play-album" data-album-id="${album.id}">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="btn-album-more">
                            <i class="fas fa-ellipsis-h"></i>
                        </button>
                    </div>
                </div>
                <div class="album-info">
                    <h3>${album.title}</h3>
                    <p>${album.artist}</p>
                    <div class="album-meta">
                        <span>${album.trackCount} tracks</span>
                        <span>${this.formatReleaseYear(album.releaseDate)}</span>
                    </div>
                </div>
            </div>
        `).join('');

        this.attachAlbumEventListeners();
    }

    async loadAlbumDetails(albumId) {
        try {
            const album = await window.dataService.getAlbum(albumId);
            this.currentAlbum = album;
            this.renderAlbumDetails(album);
            return album;
        } catch (error) {
            console.error('Failed to load album details:', error);
            return null;
        }
    }

    renderAlbumDetails(album) {
        const container = document.getElementById('albumDetailsContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="album-header">
                <div class="album-hero-cover">
                    <img src="${album.cover}" alt="${album.title}">
                </div>
                <div class="album-hero-info">
                    <span class="album-type">ALBUM</span>
                    <h1>${album.title}</h1>
                    <p class="album-artist">${album.artist}</p>
                    <div class="album-stats">
                        <span>${this.formatReleaseYear(album.releaseDate)}</span>
                        <span>•</span>
                        <span>${album.trackCount} tracks</span>
                        <span>•</span>
                        <span>${this.formatDuration(album.duration)}</span>
                    </div>
                    <div class="album-actions">
                        <button class="btn-play-all">
                            <i class="fas fa-play"></i> Play All
                        </button>
                        <button class="btn-add-to-library">
                            <i class="fas fa-plus"></i> Add to Library
                        </button>
                        <button class="btn-share-album">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="album-tracks" id="albumTracksList">
                ${this.renderAlbumTracks(album.tracks || [])}
            </div>
        `;
    }

    renderAlbumTracks(tracks) {
        if (!tracks || tracks.length === 0) {
            return '<p class="no-tracks">No tracks available</p>';
        }

        return tracks.map((track, index) => `
            <div class="album-track-item" data-track-id="${track.id}">
                <span class="track-number">${index + 1}</span>
                <button class="btn-play-track-small">
                    <i class="fas fa-play"></i>
                </button>
                <div class="track-details">
                    <h4>${track.title}</h4>
                    <p>${track.artist || album.artist}</p>
                </div>
                <span class="track-duration">${track.duration}</span>
                <div class="track-actions-mini">
                    <button class="btn-favorite-mini" title="Add to favorites">
                        <i class="far fa-heart"></i>
                    </button>
                    <button class="btn-add-mini" title="Add to playlist">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Listen for album selection from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const albumId = urlParams.get('id');
        
        if (albumId) {
            this.loadAlbumDetails(parseInt(albumId));
        }
    }

    attachAlbumEventListeners() {
        // Album card clicks
        document.querySelectorAll('.album-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('button')) return;
                
                const albumId = card.getAttribute('data-album-id');
                this.viewAlbum(albumId);
            });
        });

        // Play album buttons
        document.querySelectorAll('.btn-play-album').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const albumId = btn.getAttribute('data-album-id');
                this.playAlbum(albumId);
            });
        });
    }

    viewAlbum(albumId) {
        window.location.href = `album.html?id=${albumId}`;
    }

    async playAlbum(albumId) {
        const album = this.albums.find(a => a.id == albumId);
        if (!album) return;

        UIUtils.showToast(`Playing ${album.title}`, 'success');
        
        // Trigger play event
        window.dispatchEvent(new CustomEvent('album:play', {
            detail: { album }
        }));
    }

    // Sort albums
    sortAlbums(sortBy) {
        let sorted = [...this.albums];

        switch (sortBy) {
            case 'title':
                sorted.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'artist':
                sorted.sort((a, b) => a.artist.localeCompare(b.artist));
                break;
            case 'date':
                sorted.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
                break;
            case 'tracks':
                sorted.sort((a, b) => (b.trackCount || 0) - (a.trackCount || 0));
                break;
        }

        this.albums = sorted;
        this.renderAlbums();
    }

    // Filter albums
    filterAlbums(genre) {
        if (genre === 'all') {
            this.renderAlbums();
            return;
        }

        const filtered = this.albums.filter(album => album.genre === genre);
        const container = document.getElementById('albumsGrid');
        if (!container) return;

        container.innerHTML = filtered.map(album => `
            <div class="album-card" data-album-id="${album.id}">
                <div class="album-cover">
                    <img src="${album.cover}" alt="${album.title}">
                    <div class="album-overlay">
                        <button class="btn-play-album" data-album-id="${album.id}">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                </div>
                <div class="album-info">
                    <h3>${album.title}</h3>
                    <p>${album.artist}</p>
                </div>
            </div>
        `).join('');

        this.attachAlbumEventListeners();
    }

    // Search albums
    searchAlbums(query) {
        const lowerQuery = query.toLowerCase();
        return this.albums.filter(album =>
            album.title.toLowerCase().includes(lowerQuery) ||
            album.artist.toLowerCase().includes(lowerQuery)
        );
    }

    // Helper methods
    formatReleaseYear(dateString) {
        if (!dateString) return 'Unknown';
        return new Date(dateString).getFullYear();
    }

    formatDuration(seconds) {
        if (!seconds) return '0m';
        const mins = Math.floor(seconds / 60);
        if (mins >= 60) {
            const hours = Math.floor(mins / 60);
            const remainingMins = mins % 60;
            return `${hours}h ${remainingMins}m`;
        }
        return `${mins}m`;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AlbumManager;
}

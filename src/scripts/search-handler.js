/**
 * Groovezilla - Search Handler
 * Handle search functionality across the app
 */

class SearchHandler {
    constructor() {
        this.searchHistory = [];
        this.maxHistorySize = 20;
        this.searchResults = [];
        this.isSearching = false;
        this.init();
    }

    init() {
        this.loadSearchHistory();
        this.setupSearchInputs();
        console.log('🔍 Search Handler initialized');
    }

    loadSearchHistory() {
        this.searchHistory = StorageManager.get('searchHistory', []);
    }

    saveSearchHistory() {
        StorageManager.set('searchHistory', this.searchHistory);
    }

    // Setup search inputs across the app
    setupSearchInputs() {
        const searchInputs = document.querySelectorAll('.search-input, input[type="search"]');
        
        searchInputs.forEach(input => {
            // Debounce search
            let timeout;
            input.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.performSearch(e.target.value);
                }, 300);
            });

            // Handle enter key
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performSearch(e.target.value);
                    this.addToSearchHistory(e.target.value);
                }
            });

            // Show search suggestions on focus
            input.addEventListener('focus', () => {
                this.showSearchSuggestions(input);
            });
        });
    }

    // Perform search
    async performSearch(query) {
        if (!query || query.trim().length < 2) {
            this.clearSearchResults();
            return;
        }

        this.isSearching = true;
        this.triggerEvent('search:start', { query });

        try {
            // Search in different categories
            const results = {
                tracks: await this.searchTracks(query),
                artists: await this.searchArtists(query),
                albums: await this.searchAlbums(query),
                playlists: await this.searchPlaylists(query)
            };

            this.searchResults = results;
            this.displaySearchResults(results);
            
            this.triggerEvent('search:complete', { query, results });
        } catch (error) {
            console.error('Search error:', error);
            this.triggerEvent('search:error', { query, error });
        } finally {
            this.isSearching = false;
        }
    }

    // Search tracks
    async searchTracks(query) {
        const lowerQuery = query.toLowerCase();
        
        // Search in data service
        try {
            const allTracks = await window.dataService.getTracks();
            return allTracks.filter(track =>
                track.title.toLowerCase().includes(lowerQuery) ||
                track.artist.toLowerCase().includes(lowerQuery) ||
                track.album?.toLowerCase().includes(lowerQuery)
            );
        } catch (error) {
            console.error('Track search error:', error);
            return [];
        }
    }

    // Search artists
    async searchArtists(query) {
        const lowerQuery = query.toLowerCase();
        
        try {
            const allArtists = await window.dataService.getArtists();
            return allArtists.filter(artist =>
                artist.name.toLowerCase().includes(lowerQuery) ||
                artist.genre?.toLowerCase().includes(lowerQuery)
            );
        } catch (error) {
            console.error('Artist search error:', error);
            return [];
        }
    }

    // Search albums
    async searchAlbums(query) {
        const lowerQuery = query.toLowerCase();
        
        try {
            const allAlbums = await window.dataService.getAlbums();
            return allAlbums.filter(album =>
                album.title.toLowerCase().includes(lowerQuery) ||
                album.artist.toLowerCase().includes(lowerQuery)
            );
        } catch (error) {
            console.error('Album search error:', error);
            return [];
        }
    }

    // Search playlists
    async searchPlaylists(query) {
        const lowerQuery = query.toLowerCase();
        
        if (typeof window.playlistManager !== 'undefined') {
            const playlists = window.playlistManager.getPlaylists();
            return playlists.filter(playlist =>
                playlist.name.toLowerCase().includes(lowerQuery) ||
                playlist.description?.toLowerCase().includes(lowerQuery)
            );
        }
        
        return [];
    }

    // Display search results
    displaySearchResults(results) {
        const resultsContainer = document.getElementById('searchResults') || this.createResultsContainer();
        
        if (!resultsContainer) return;

        const totalResults = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);

        if (totalResults === 0) {
            resultsContainer.innerHTML = `
                <div class="search-empty">
                    <i class="fas fa-search"></i>
                    <h3>No results found</h3>
                    <p>Try different keywords or check your spelling</p>
                </div>
            `;
            resultsContainer.classList.add('show');
            return;
        }

        let html = '<div class="search-results-content">';

        // Tracks
        if (results.tracks.length > 0) {
            html += `
                <div class="search-category">
                    <h3><i class="fas fa-music"></i> Tracks (${results.tracks.length})</h3>
                    <div class="search-items">
                        ${results.tracks.slice(0, 5).map(track => this.renderTrackResult(track)).join('')}
                    </div>
                    ${results.tracks.length > 5 ? `<button class="btn-see-all" data-category="tracks">See all tracks</button>` : ''}
                </div>
            `;
        }

        // Artists
        if (results.artists.length > 0) {
            html += `
                <div class="search-category">
                    <h3><i class="fas fa-user-music"></i> Artists (${results.artists.length})</h3>
                    <div class="search-items">
                        ${results.artists.slice(0, 3).map(artist => this.renderArtistResult(artist)).join('')}
                    </div>
                    ${results.artists.length > 3 ? `<button class="btn-see-all" data-category="artists">See all artists</button>` : ''}
                </div>
            `;
        }

        // Albums
        if (results.albums.length > 0) {
            html += `
                <div class="search-category">
                    <h3><i class="fas fa-record-vinyl"></i> Albums (${results.albums.length})</h3>
                    <div class="search-items">
                        ${results.albums.slice(0, 3).map(album => this.renderAlbumResult(album)).join('')}
                    </div>
                    ${results.albums.length > 3 ? `<button class="btn-see-all" data-category="albums">See all albums</button>` : ''}
                </div>
            `;
        }

        // Playlists
        if (results.playlists.length > 0) {
            html += `
                <div class="search-category">
                    <h3><i class="fas fa-list-ul"></i> Playlists (${results.playlists.length})</h3>
                    <div class="search-items">
                        ${results.playlists.slice(0, 3).map(playlist => this.renderPlaylistResult(playlist)).join('')}
                    </div>
                </div>
            `;
        }

        html += '</div>';
        resultsContainer.innerHTML = html;
        resultsContainer.classList.add('show');

        this.attachResultsEventListeners();
    }

    renderTrackResult(track) {
        return `
            <div class="search-result-item track" data-track-id="${track.id}">
                <img src="${track.cover}" alt="${track.title}">
                <div class="result-info">
                    <h4>${this.highlightQuery(track.title)}</h4>
                    <p>${this.highlightQuery(track.artist)}</p>
                </div>
                <button class="btn-play-result">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `;
    }

    renderArtistResult(artist) {
        return `
            <div class="search-result-item artist" data-artist-id="${artist.id}">
                <img src="${artist.image}" alt="${artist.name}">
                <div class="result-info">
                    <h4>${this.highlightQuery(artist.name)}</h4>
                    <p>${artist.genre || 'Artist'}</p>
                </div>
                <button class="btn-follow-result">
                    <i class="fas fa-user-plus"></i>
                </button>
            </div>
        `;
    }

    renderAlbumResult(album) {
        return `
            <div class="search-result-item album" data-album-id="${album.id}">
                <img src="${album.cover}" alt="${album.title}">
                <div class="result-info">
                    <h4>${this.highlightQuery(album.title)}</h4>
                    <p>${this.highlightQuery(album.artist)}</p>
                </div>
            </div>
        `;
    }

    renderPlaylistResult(playlist) {
        return `
            <div class="search-result-item playlist" data-playlist-id="${playlist.id}">
                <img src="${playlist.cover || 'https://via.placeholder.com/80'}" alt="${playlist.name}">
                <div class="result-info">
                    <h4>${this.highlightQuery(playlist.name)}</h4>
                    <p>${playlist.trackCount || 0} tracks</p>
                </div>
            </div>
        `;
    }

    highlightQuery(text) {
        // Implement query highlighting if needed
        return text;
    }

    createResultsContainer() {
        const container = document.createElement('div');
        container.id = 'searchResults';
        container.className = 'search-results-overlay';
        document.body.appendChild(container);

        // Close on backdrop click
        container.addEventListener('click', (e) => {
            if (e.target === container) {
                this.clearSearchResults();
            }
        });

        // Inject styles
        this.injectSearchStyles();

        return container;
    }

    injectSearchStyles() {
        if (document.getElementById('search-styles')) return;

        const style = document.createElement('style');
        style.id = 'search-styles';
        style.textContent = `
            .search-results-overlay {
                position: fixed;
                top: 80px;
                left: 280px;
                right: 20px;
                max-height: calc(100vh - 100px);
                background: rgba(26, 26, 26, 0.98);
                backdrop-filter: blur(20px);
                border-radius: 16px;
                padding: 24px;
                z-index: 1000;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-20px);
                transition: all 0.3s;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            }
            .search-results-overlay.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            .search-category {
                margin-bottom: 32px;
            }
            .search-category h3 {
                color: white;
                font-size: 18px;
                margin-bottom: 16px;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .search-items {
                display: grid;
                gap: 12px;
            }
            .search-result-item {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 12px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.2s;
            }
            .search-result-item:hover {
                background: rgba(255, 255, 255, 0.1);
                transform: translateX(4px);
            }
            .search-result-item img {
                width: 60px;
                height: 60px;
                border-radius: 8px;
                object-fit: cover;
            }
            .result-info {
                flex: 1;
            }
            .result-info h4 {
                color: white;
                font-size: 16px;
                margin-bottom: 4px;
            }
            .result-info p {
                color: rgba(255, 255, 255, 0.6);
                font-size: 14px;
            }
            .btn-play-result, .btn-follow-result {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: #8b5cf6;
                border: none;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            .btn-play-result:hover, .btn-follow-result:hover {
                background: #7c3aed;
                transform: scale(1.1);
            }
            .btn-see-all {
                margin-top: 12px;
                padding: 8px 16px;
                background: rgba(139, 92, 246, 0.2);
                border: 1px solid rgba(139, 92, 246, 0.3);
                border-radius: 8px;
                color: #8b5cf6;
                cursor: pointer;
                transition: all 0.2s;
            }
            .btn-see-all:hover {
                background: rgba(139, 92, 246, 0.3);
            }
            .search-empty {
                text-align: center;
                padding: 60px 20px;
                color: rgba(255, 255, 255, 0.6);
            }
            .search-empty i {
                font-size: 48px;
                margin-bottom: 16px;
                opacity: 0.5;
            }
            .search-empty h3 {
                color: white;
                margin-bottom: 8px;
            }
        `;
        document.head.appendChild(style);
    }

    attachResultsEventListeners() {
        // Handle result item clicks
        document.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.closest('button')) return;
                
                const trackId = item.getAttribute('data-track-id');
                const artistId = item.getAttribute('data-artist-id');
                const albumId = item.getAttribute('data-album-id');
                const playlistId = item.getAttribute('data-playlist-id');

                if (trackId) {
                    this.handleTrackClick(trackId);
                } else if (artistId) {
                    this.handleArtistClick(artistId);
                } else if (albumId) {
                    this.handleAlbumClick(albumId);
                } else if (playlistId) {
                    this.handlePlaylistClick(playlistId);
                }
            });
        });
    }

    handleTrackClick(trackId) {
        console.log('Track clicked:', trackId);
        // Implement track playback
        this.triggerEvent('search:track:selected', { trackId });
    }

    handleArtistClick(artistId) {
        console.log('Artist clicked:', artistId);
        window.location.href = `artist.html?id=${artistId}`;
    }

    handleAlbumClick(albumId) {
        console.log('Album clicked:', albumId);
        window.location.href = `album.html?id=${albumId}`;
    }

    handlePlaylistClick(playlistId) {
        console.log('Playlist clicked:', playlistId);
        window.location.href = `playlist.html?id=${playlistId}`;
    }

    // Show search suggestions
    showSearchSuggestions(input) {
        if (this.searchHistory.length === 0) return;

        // Create or get suggestions dropdown
        let suggestions = input.nextElementSibling;
        if (!suggestions || !suggestions.classList.contains('search-suggestions')) {
            suggestions = document.createElement('div');
            suggestions.className = 'search-suggestions';
            input.parentNode.insertBefore(suggestions, input.nextSibling);
        }

        suggestions.innerHTML = this.searchHistory
            .slice(0, 5)
            .map(query => `
                <div class="suggestion-item">
                    <i class="fas fa-history"></i>
                    <span>${query}</span>
                    <button class="btn-remove-suggestion" data-query="${query}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');

        suggestions.style.display = 'block';
    }

    // Add to search history
    addToSearchHistory(query) {
        if (!query || query.trim().length < 2) return;

        // Remove if already exists
        this.searchHistory = this.searchHistory.filter(q => q !== query);
        
        // Add to beginning
        this.searchHistory.unshift(query);

        // Limit size
        if (this.searchHistory.length > this.maxHistorySize) {
            this.searchHistory = this.searchHistory.slice(0, this.maxHistorySize);
        }

        this.saveSearchHistory();
    }

    clearSearchResults() {
        const container = document.getElementById('searchResults');
        if (container) {
            container.classList.remove('show');
        }
    }

    clearSearchHistory() {
        this.searchHistory = [];
        this.saveSearchHistory();
        UIUtils.showToast('Search history cleared', 'success');
    }

    triggerEvent(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        window.dispatchEvent(event);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SearchHandler;
}

// Groovezilla Audio Player - Enhanced Version with HLS Support
class GroovezillaAudioPlayer {
    constructor() {
        this.audio = new Audio();
        this.hls = null; // HLS.js instance for streaming
        this.currentTrack = null;
        this.playlist = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.isShuffled = false;
        this.isRepeating = false;
        this.volume = 0.7;
        this.listeningHistory = JSON.parse(localStorage.getItem('groovezilla_history') || '[]');
        this.likedTracks = JSON.parse(localStorage.getItem('groovezilla_likes') || '[]');
        this.userPlaylists = JSON.parse(localStorage.getItem('groovezilla_playlists') || '{}');
        this.followedArtists = JSON.parse(localStorage.getItem('groovezilla_followed_artists') || '[]');
        this.currentUser = JSON.parse(localStorage.getItem('groovezilla_current_user') || 'null');
        this.playStartTime = null;
        this.totalListenTime = 0;
        
        // Check HLS.js support
        this.hlsSupported = typeof Hls !== 'undefined' && Hls.isSupported();
        
        this.initializeAudioEvents();
        this.initializeSampleData();
        this.createMiniPlayer();
        this.initializeEventListeners();
        this.initializeAuth();
    }

    initializeSampleData() {
        // Enhanced sample data with more tracks
        this.sampleTracks = [
            { id: 4, title: "Midnight Dreams", artist: "Luna Eclipse", album: "Nocturnal Sessions", genre: "Pop", duration: "4:32", file: "../../assets/audio/4.mp3", cover: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop" },
            { id: 5, title: "Summer Breeze", artist: "The Sunshine Band", album: "Summer Hits 2024", genre: "Rock", duration: "3:45", file: "../../assets/audio/5.mp3", cover: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=300&h=300&fit=crop" },
            { id: 6, title: "Electric Pulse", artist: "DJ Nova", album: "Electric Dreams", genre: "Electronic", duration: "5:12", file: "../../assets/audio/6.mp3", cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&h=300&fit=crop" },
            { id: 7, title: "Acoustic Dreams", artist: "James Rivers", album: "Acoustic Sessions", genre: "Folk", duration: "4:18", file: "../../assets/audio/7.mp3", cover: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300&h=300&fit=crop" },
            { id: 8, title: "Urban Flow", artist: "MC Flow", album: "Urban Tales", genre: "Hip Hop", duration: "3:56", file: "../../assets/audio/8.mp3", cover: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=300&h=300&fit=crop" },
            { id: 9, title: "Jazz Nights", artist: "Miles Davis Jr", album: "Jazz Vibes", genre: "Jazz", duration: "6:23", file: "../../assets/audio/9.mp3", cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop" },
            { id: 10, title: "Rock Anthem", artist: "Thunder Strike", album: "Rock Legends", genre: "Rock", duration: "4:45", file: "../../assets/audio/10.mp3", cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop" },
            { id: 11, title: "Chill Vibes", artist: "Relaxo", album: "Chill Collection", genre: "Ambient", duration: "7:12", file: "../../assets/audio/11.mp3", cover: "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=300&h=300&fit=crop" },
            { id: 12, title: "Dance Floor", artist: "Beat Master", album: "Dance Hits", genre: "Dance", duration: "3:28", file: "../../assets/audio/12.mp3", cover: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&h=300&fit=crop" },
            { id: 13, title: "Country Road", artist: "Nashville Stars", album: "Country Classics", genre: "Country", duration: "4:02", file: "../../assets/audio/13.mp3", cover: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=300&h=300&fit=crop" },
            { id: 14, title: "Classical Symphony", artist: "Orchestra Vienna", album: "Classical Masterpieces", genre: "Classical", duration: "8:45", file: "../../assets/audio/14.mp3", cover: "https://images.unsplash.com/photo-1499415479124-43c32433a620?w=300&h=300&fit=crop" },
            { id: 15, title: "Reggae Sunshine", artist: "Island Vibes", album: "Reggae Collection", genre: "Reggae", duration: "4:33", file: "../../assets/audio/15.mp3", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop" },
            { id: 16, title: "Blues Soul", artist: "B.B. King Jr", album: "Blues Masters", genre: "Blues", duration: "5:21", file: "../../assets/audio/16.mp3", cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop" },
            { id: 17, title: "Metal Storm", artist: "Iron Thunder", album: "Metal Collection", genre: "Metal", duration: "6:15", file: "../../assets/audio/17.mp3", cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop" },
            { id: 18, title: "Folk Tales", artist: "Mountain Echo", album: "Folk Stories", genre: "Folk", duration: "4:56", file: "../../assets/audio/18.mp3", cover: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop" },
            { id: 19, title: "Electronic Dreams", artist: "Synth Wave", album: "Electronic Future", genre: "Electronic", duration: "5:44", file: "../../assets/audio/19.mp3", cover: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=300&fit=crop" },
            { id: 20, title: "Pop Star", artist: "Melody Queen", album: "Pop Hits 2024", genre: "Pop", duration: "3:33", file: "../../assets/audio/20.mp3", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop" },
            { id: 21, title: "Indie Spirit", artist: "Indie Collective", album: "Indie Sounds", genre: "Indie", duration: "4:27", file: "../../assets/audio/21.mp3", cover: "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=300&h=300&fit=crop" },
            { id: 22, title: "World Music", artist: "Global Sounds", album: "World Collection", genre: "World", duration: "5:18", file: "../../assets/audio/22.mp3", cover: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&h=300&fit=crop" }
        ];

        this.sampleAlbums = [
            { id: 1, title: "Nocturnal Sessions", artist: "Luna Eclipse", year: 2024, tracks: [4] },
            { id: 2, title: "Summer Hits 2024", artist: "The Sunshine Band", year: 2024, tracks: [5] },
            { id: 3, title: "Electric Dreams", artist: "DJ Nova", year: 2024, tracks: [6, 19] },
            { id: 4, title: "Acoustic Sessions", artist: "James Rivers", year: 2023, tracks: [7] },
            { id: 5, title: "Urban Tales", artist: "MC Flow", year: 2021, tracks: [8] },
            { id: 6, title: "Jazz Vibes", artist: "Miles Davis Jr", year: 2023, tracks: [9] },
            { id: 7, title: "Rock Legends", artist: "Thunder Strike", year: 2022, tracks: [10] }
        ];

        this.samplePlaylists = [
            { id: 1, name: "My Favorites", tracks: [4, 5, 6], description: "My personal favorites" },
            { id: 2, name: "Workout Mix", tracks: [5, 8, 12, 17], description: "High energy workout music" },
            { id: 3, name: "Chill Out", tracks: [7, 9, 11, 15], description: "Relaxing music for chill time" },
            { id: 4, name: "Party Time", tracks: [5, 12, 20, 22], description: "Party and dance music" },
            { id: 5, name: "Study Focus", tracks: [9, 11, 14, 18], description: "Music for concentration" }
        ];
    }

    initializeAudioEvents() {
        this.audio.addEventListener('ended', () => this.nextTrack());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadstart', () => this.updateLoadingState(true));
        this.audio.addEventListener('canplay', () => this.updateLoadingState(false));
        this.audio.addEventListener('error', (e) => this.handleAudioError(e));
        
        // Listen tracking - ghi lịch sử khi nghe >= 30 giây
        this.audio.addEventListener('timeupdate', () => {
            if (this.audio.currentTime >= 30 && this.playStartTime) {
                this.recordListeningHistory();
                this.playStartTime = null; // Chỉ ghi một lần per play session
            }
        });
    }

    createMiniPlayer() {
        // Tạo mini player sticky ở dưới màn hình
        const miniPlayer = document.createElement('div');
        miniPlayer.id = 'groovezilla-mini-player';
        miniPlayer.className = 'mini-player-widget';
        miniPlayer.innerHTML = `
            <div class="mini-player-content">
                <div class="mini-track-info">
                    <img class="mini-cover" src="" alt="">
                    <div class="mini-details">
                        <div class="mini-title">No track selected</div>
                        <div class="mini-artist">Groovezilla</div>
                    </div>
                </div>
                <div class="mini-controls">
                    <button class="mini-btn" id="mini-prev">
                        <div class="icon icon-prev"></div>
                    </button>
                    <button class="mini-btn play-pause" id="mini-play-pause">
                        <div class="icon icon-play"></div>
                    </button>
                    <button class="mini-btn" id="mini-next">
                        <div class="icon icon-next"></div>
                    </button>
                </div>
                <div class="mini-progress">
                    <span class="mini-time-current">0:00</span>
                    <div class="mini-progress-bar">
                        <div class="mini-progress-fill"></div>
                    </div>
                    <span class="mini-time-total">0:00</span>
                </div>
                <div class="mini-actions">
                    <button class="mini-btn" id="mini-like">
                        <div class="icon icon-heart"></div>
                    </button>
                    <button class="mini-btn" id="mini-volume">
                        <div class="icon icon-volume"></div>
                    </button>
                    <button class="mini-btn" id="mini-expand">
                        <div class="icon icon-expand"></div>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(miniPlayer);
        this.initializeMiniPlayerEvents();
    }

    initializeMiniPlayerEvents() {
        const miniPlayer = document.getElementById('groovezilla-mini-player');
        if (!miniPlayer) return;

        const playPauseBtn = document.getElementById('mini-play-pause');
        const nextBtn = document.getElementById('mini-next');
        const prevBtn = document.getElementById('mini-prev');
        const likeBtn = document.getElementById('mini-like');
        const expandBtn = document.getElementById('mini-expand');
        const progressBar = document.querySelector('.mini-progress-bar');
        const rewindBtn = document.getElementById('mini-rewind');
        const forwardBtn = document.getElementById('mini-forward');
        const shuffleBtn = document.getElementById('mini-shuffle');
        const repeatBtn = document.getElementById('mini-repeat');

        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextTrack());
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousTrack());
        }
        
        if (likeBtn) {
            likeBtn.addEventListener('click', () => this.toggleLike());
        }
        
        if (expandBtn) {
            expandBtn.addEventListener('click', () => this.expandPlayer());
        }
        
        // Seek backward 10 seconds
        if (rewindBtn) {
            rewindBtn.addEventListener('click', () => this.seekBackward());
        }
        
        // Seek forward 10 seconds
        if (forwardBtn) {
            forwardBtn.addEventListener('click', () => this.seekForward());
        }
        
        // Toggle shuffle
        if (shuffleBtn) {
            shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        }
        
        // Toggle repeat
        if (repeatBtn) {
            repeatBtn.addEventListener('click', () => this.toggleRepeat());
        }
        
        // Progress bar click to seek
        if (progressBar) {
            progressBar.addEventListener('click', (e) => {
                const rect = progressBar.getBoundingClientRect();
                const percentage = (e.clientX - rect.left) / rect.width;
                if (this.audio.duration) {
                    this.audio.currentTime = percentage * this.audio.duration;
                }
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Space bar to play/pause
            if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                this.togglePlayPause();
            }
            // Arrow left to rewind
            else if (e.code === 'ArrowLeft' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                this.seekBackward();
            }
            // Arrow right to forward
            else if (e.code === 'ArrowRight' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                this.seekForward();
            }
        });
    }

    initializeEventListeners() {
        // Play button functionality
        document.addEventListener('click', (e) => {
            if (e.target.matches('.play-btn, .track-play-btn, .btn-action.play, .play-overlay-btn, .play-all-btn')) {
                e.preventDefault();
                
                const trackId = parseInt(e.target.dataset.trackId) || 
                               parseInt(e.target.closest('[data-track-id]')?.dataset.trackId) ||
                               4; // Default to first track
                
                if (e.target.classList.contains('playing')) {
                    this.togglePlayPause();
                } else {
                    this.playTrack(trackId);
                }
            }
        });

        // Like button functionality
        document.addEventListener('click', (e) => {
            if (e.target.matches('.like-btn')) {
                e.preventDefault();
                const trackId = parseInt(e.target.dataset.trackId);
                if (trackId) {
                    this.toggleLikeForTrack(trackId);
                }
            }
        });

        // Follow button functionality
        document.addEventListener('click', (e) => {
            if (e.target.matches('.follow-btn')) {
                e.preventDefault();
                const artistCard = e.target.closest('.artist-card');
                if (artistCard) {
                    const artistName = artistCard.querySelector('.artist-name').textContent;
                    this.toggleFollowArtist(artistName);
                }
            }
        });

        // Enhanced Search functionality
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');
        
        if (searchInput && searchResults) {
            let searchTimeout;
            
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                
                // Clear previous timeout
                clearTimeout(searchTimeout);
                
                if (query.length === 0) {
                    this.hideSearchResults();
                    return;
                }
                
                if (query.length < 2) {
                    this.showSearchLoading();
                    return;
                }
                
                // Debounce search
                searchTimeout = setTimeout(() => {
                    this.performSearch(query);
                }, 300);
            });
            
            // Hide results when clicking outside
            document.addEventListener('click', (e) => {
                if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                    this.hideSearchResults();
                }
            });
            
            // Show results when focusing on input
            searchInput.addEventListener('focus', (e) => {
                if (e.target.value.trim().length >= 2) {
                    this.performSearch(e.target.value.trim());
                }
            });
        }

        // Category filtering
        document.addEventListener('click', (e) => {
            if (e.target.matches('.category-item')) {
                e.preventDefault();
                const category = e.target.textContent.trim();
                this.filterByCategory(category);
                
                // Update active state
                document.querySelectorAll('.category-item').forEach(item => {
                    item.classList.remove('active');
                });
                e.target.classList.add('active');
            }
        });
    }

    // Enhanced Business Rules Implementation

    // Rule 1: Một bài hát chỉ xuất hiện một lần trong playlist
    addToPlaylist(trackId, playlistId) {
        const playlist = this.userPlaylists[playlistId];
        if (playlist && !playlist.tracks.includes(trackId)) {
            playlist.tracks.push(trackId);
            this.saveUserPlaylists();
            return { success: true, message: "Track added to playlist" };
        } else if (playlist && playlist.tracks.includes(trackId)) {
            return { success: false, message: "Track already exists in playlist" };
        }
        return { success: false, message: "Playlist not found" };
    }

    // Rule 2: Lịch sử nghe được ghi khi play >= 30 giây
    recordListeningHistory() {
        if (this.currentTrack) {
            const historyEntry = {
                trackId: this.currentTrack.id,
                timestamp: new Date().toISOString(),
                duration: Math.floor(this.audio.currentTime),
                track: this.currentTrack
            };
            
            this.listeningHistory.unshift(historyEntry);
            if (this.listeningHistory.length > 100) {
                this.listeningHistory = this.listeningHistory.slice(0, 100);
            }
            
            localStorage.setItem('groovezilla_history', JSON.stringify(this.listeningHistory));
            this.updateHistoryUI();
        }
    }

    // Rule 3: Like cùng track chỉ được 1 lần
    toggleLike() {
        if (!this.currentTrack) return;
        this.toggleLikeForTrack(this.currentTrack.id);
    }
        
    toggleLikeForTrack(trackId) {
        const index = this.likedTracks.indexOf(trackId);
        
        if (index === -1) {
            this.likedTracks.push(trackId);
            this.updateLikeButton(true);
            this.showNotification(`Added "${this.getTrackById(trackId)?.title}" to liked songs`);
        } else {
            this.likedTracks.splice(index, 1);
            this.updateLikeButton(false);
            this.showNotification(`Removed "${this.getTrackById(trackId)?.title}" from liked songs`);
        }
        
        localStorage.setItem('groovezilla_likes', JSON.stringify(this.likedTracks));
        this.updateAllLikeButtons();
    }

    playTrack(trackId, playlist = null) {
        const track = this.sampleTracks.find(t => t.id === trackId);
        if (!track) {
            this.showNotification('Track not found');
            return;
        }

        // Ghi nhận thời điểm bắt đầu play
        this.playStartTime = Date.now();
        this.currentTrack = track;
        this.playlist = playlist || [track];
        this.currentIndex = this.playlist.findIndex(t => t.id === trackId);

        // Load audio with HLS support
        this.loadAudioSource(track.file);
        this.audio.volume = this.volume;
        
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updateUI();
            this.showMiniPlayer();
        }).catch(e => {
            console.error('Error playing audio:', e);
            this.showNotification('Error playing track');
        });
    }

    // Load audio source with automatic format detection
    loadAudioSource(source) {
        const isHLS = source.endsWith('.m3u8');
        
        // Destroy previous HLS instance if exists
        if (this.hls) {
            this.hls.destroy();
            this.hls = null;
        }

        if (isHLS && this.hlsSupported) {
            // Use HLS.js for .m3u8 files
            this.hls = new Hls({
                debug: false,
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            
            this.hls.loadSource(source);
            this.hls.attachMedia(this.audio);
            
            this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log('HLS manifest loaded, found ' + this.hls.levels.length + ' quality levels');
            });
            
            this.hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    switch(data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.error('Fatal network error encountered, trying to recover');
                            this.hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.error('Fatal media error encountered, trying to recover');
                            this.hls.recoverMediaError();
                            break;
                        default:
                            console.error('Fatal error, cannot recover');
                            this.hls.destroy();
                            break;
                    }
                }
            });
        } else if (isHLS && this.audio.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support (Safari)
            this.audio.src = source;
        } else {
            // Standard audio formats (MP3, WAV, etc.)
            this.audio.src = source;
        }
    }

    togglePlayPause() {
        if (!this.currentTrack) return;

        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
        } else {
            this.playStartTime = Date.now(); // Reset start time khi resume
            this.audio.play().then(() => {
                this.isPlaying = true;
            }).catch(e => {
                console.error('Error resuming audio:', e);
                this.showNotification('Error resuming track');
            });
        }
        this.updateUI();
    }

    nextTrack() {
        // Ghi lịch sử nếu đã nghe >= 30 giây khi next
        if (this.audio.currentTime >= 30 && this.playStartTime) {
            this.recordListeningHistory();
        }

        if (this.isShuffled) {
            this.currentIndex = Math.floor(Math.random() * this.playlist.length);
        } else {
            this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        }
        
        const nextTrack = this.playlist[this.currentIndex];
        if (nextTrack) {
            this.playTrack(nextTrack.id, this.playlist);
        }
    }

    previousTrack() {
        this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.playlist.length - 1;
        const prevTrack = this.playlist[this.currentIndex];
        if (prevTrack) {
            this.playTrack(prevTrack.id, this.playlist);
        }
    }

    seekBackward(seconds = 10) {
        if (this.audio.currentTime > seconds) {
            this.audio.currentTime -= seconds;
        } else {
            this.audio.currentTime = 0;
        }
        this.showNotification(`⏪ Rewound ${seconds}s`);
    }

    seekForward(seconds = 10) {
        if (this.audio.currentTime + seconds < this.audio.duration) {
            this.audio.currentTime += seconds;
        } else {
            this.audio.currentTime = this.audio.duration;
        }
        this.showNotification(`⏩ Forwarded ${seconds}s`);
    }

    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        const shuffleBtn = document.getElementById('mini-shuffle');
        if (shuffleBtn) {
            shuffleBtn.classList.toggle('active', this.isShuffled);
        }
        this.showNotification(this.isShuffled ? '🔀 Shuffle ON' : '➡️ Shuffle OFF');
    }

    toggleRepeat() {
        this.isRepeating = !this.isRepeating;
        this.audio.loop = this.isRepeating;
        const repeatBtn = document.getElementById('mini-repeat');
        if (repeatBtn) {
            repeatBtn.classList.toggle('active', this.isRepeating);
        }
        this.showNotification(this.isRepeating ? '🔁 Repeat ON' : '➡️ Repeat OFF');
    }

    // Enhanced Search with Vietnamese support
    searchTracks(query) {
        const normalizedQuery = this.removeVietnameseTones(query.toLowerCase());
        
        return this.sampleTracks.filter(track => {
            const title = this.removeVietnameseTones(track.title.toLowerCase());
            const artist = this.removeVietnameseTones(track.artist.toLowerCase());
            const album = this.removeVietnameseTones(track.album.toLowerCase());
            const genre = this.removeVietnameseTones(track.genre.toLowerCase());
            
            return title.includes(normalizedQuery) || 
                   artist.includes(normalizedQuery) || 
                   album.includes(normalizedQuery) ||
                   genre.includes(normalizedQuery);
        });
    }

    removeVietnameseTones(str) {
        return str.normalize('NFD')
                 .replace(/[\u0300-\u036f]/g, '')
                 .replace(/đ/g, 'd')
                 .replace(/Đ/g, 'D');
    }

    // Category filtering
    filterByCategory(category) {
        const filteredTracks = this.sampleTracks.filter(track => 
            track.genre.toLowerCase() === category.toLowerCase()
        );
        this.displayFilteredTracks(filteredTracks, category);
    }

    displayFilteredTracks(tracks, category) {
        // This would update the UI to show filtered tracks
        console.log(`Filtering by ${category}:`, tracks);
        // Implementation would depend on specific UI requirements
    }

    performSearch(query) {
        const searchResults = document.getElementById('search-results');
        if (!searchResults) return;
        
        this.showSearchLoading();
        
        // Simulate search delay for better UX
        setTimeout(() => {
            const results = this.searchTracks(query);
            this.displaySearchResults(results);
        }, 200);
    }

    displaySearchResults(results) {
        const searchResults = document.getElementById('search-results');
        if (!searchResults) return;
        
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="search-no-results">
                    <p>Không tìm thấy kết quả nào cho "${document.getElementById('search-input')?.value}"</p>
                    <p style="font-size: 12px; margin-top: var(--spacing-xs);">Thử tìm kiếm với từ khóa khác</p>
                </div>
            `;
        } else {
            searchResults.innerHTML = results.slice(0, 8).map(track => `
                <div class="search-result-item" onclick="groovePlayer.playTrack(${track.id})">
                    <img src="${track.cover}" alt="Track" class="search-result-cover">
                    <div class="search-result-info">
                        <h4>${track.title}</h4>
                        <p>${track.artist} • ${track.album}</p>
                    </div>
                    <span class="search-result-type">${track.genre}</span>
                </div>
            `).join('');
        }
        
        searchResults.classList.add('show');
    }

    hideSearchResults() {
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
            searchResults.classList.remove('show');
        }
    }

    showSearchLoading() {
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
            searchResults.innerHTML = `
                <div class="search-loading">
                    Đang tìm kiếm...
                </div>
            `;
            searchResults.classList.add('show');
        }
    }

    // Playlist sorting
    sortPlaylist(criteria) {
        if (!this.playlist) return;
        
        switch(criteria) {
            case 'title':
                this.playlist.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'artist':
                this.playlist.sort((a, b) => a.artist.localeCompare(b.artist));
                break;
            case 'duration':
                this.playlist.sort((a, b) => this.parseDuration(a.duration) - this.parseDuration(b.duration));
                break;
            case 'random':
                this.playlist.sort(() => Math.random() - 0.5);
                break;
        }
        this.updatePlaylistUI();
    }

    parseDuration(duration) {
        const [minutes, seconds] = duration.split(':').map(Number);
        return minutes * 60 + seconds;
    }

    // Enhanced UI Updates
    updateUI() {
        this.updateMiniPlayer();
        this.updateMainPlayer();
        this.updatePlayButtons();
        this.updateAllLikeButtons();
    }

    updateMiniPlayer() {
        const miniPlayer = document.getElementById('groovezilla-mini-player');
        if (!miniPlayer || !this.currentTrack) return;

        const cover = miniPlayer.querySelector('.mini-cover');
        const title = miniPlayer.querySelector('.mini-title');
        const artist = miniPlayer.querySelector('.mini-artist');
        const playPauseBtn = miniPlayer.querySelector('#mini-play-pause');

        if (cover) cover.src = this.currentTrack.cover;
        if (title) title.textContent = this.currentTrack.title;
        if (artist) artist.textContent = this.currentTrack.artist;
        if (playPauseBtn) {
            playPauseBtn.textContent = this.isPlaying ? '⏸️' : '▶️';
        }
        
        const isLiked = this.likedTracks.includes(this.currentTrack.id);
        this.updateLikeButton(isLiked);
    }

    updateProgress() {
        const miniPlayer = document.getElementById('groovezilla-mini-player');
        if (!miniPlayer || !this.audio.duration) return;

        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        const progressFill = miniPlayer.querySelector('.mini-progress-fill');
        const timeCurrent = miniPlayer.querySelector('.mini-time-current');
        const timeTotal = miniPlayer.querySelector('.mini-time-total');
        
        if (progressFill) progressFill.style.width = progress + '%';
        if (timeCurrent) timeCurrent.textContent = this.formatTime(this.audio.currentTime);
        if (timeTotal) timeTotal.textContent = this.formatTime(this.audio.duration);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    updatePlayButtons() {
        document.querySelectorAll('.play-btn, .track-play-btn, .btn-action.play').forEach(btn => {
            const trackId = parseInt(btn.dataset.trackId);
            if (this.currentTrack && trackId === this.currentTrack.id) {
                btn.textContent = this.isPlaying ? '⏸️' : '▶️';
                btn.classList.add('playing');
            } else {
                btn.textContent = '▶️';
                btn.classList.remove('playing');
            }
        });
    }

    updateAllLikeButtons() {
        document.querySelectorAll('.like-btn').forEach(btn => {
            const trackId = parseInt(btn.dataset.trackId);
            const isLiked = this.likedTracks.includes(trackId);
            btn.textContent = isLiked ? '❤️' : '🤍';
            btn.classList.toggle('liked', isLiked);
        });
    }

    showMiniPlayer() {
        const miniPlayer = document.getElementById('groovezilla-mini-player');
        if (miniPlayer) {
            miniPlayer.classList.add('show');
        }
    }

    hideMiniPlayer() {
        const miniPlayer = document.getElementById('groovezilla-mini-player');
        if (miniPlayer) {
            miniPlayer.classList.remove('show');
        }
    }

    updateLikeButton(isLiked) {
        const miniLikeBtn = document.getElementById('mini-like');
        if (miniLikeBtn) {
            miniLikeBtn.textContent = isLiked ? '❤️' : '🤍';
        }
    }

    showNotification(message) {
        // Remove existing notifications
        document.querySelectorAll('.groovezilla-notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = 'groovezilla-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    expandPlayer() {
        // Navigate to miniplayer.html or show full player
        window.location.href = 'miniplayer.html';
    }

    updateLoadingState(isLoading) {
        // Update loading indicators
        console.log('Loading state:', isLoading);
    }

    handleAudioError(error) {
        console.error('Audio error:', error);
        this.showNotification('Error loading audio file');
    }

    updateMainPlayer() {
        // Update main player UI if exists
        console.log('Updating main player');
    }

    updatePlaylistUI() {
        // Update playlist UI if exists
        console.log('Updating playlist UI');
    }

    updateHistoryUI() {
        // Update history UI if exists
        console.log('Updating history UI');
    }

    saveUserPlaylists() {
        localStorage.setItem('groovezilla_playlists', JSON.stringify(this.userPlaylists));
    }

    // Authentication Methods
    initializeAuth() {
        this.updateAuthUI();
        
        // Login button
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.showLoginModal());
        }
        
        // Signup button
        const signupBtn = document.getElementById('signup-btn');
        if (signupBtn) {
            signupBtn.addEventListener('click', () => this.showSignupModal());
        }
        
        // User avatar
        const userAvatar = document.getElementById('user-avatar');
        if (userAvatar) {
            userAvatar.addEventListener('click', () => this.toggleUserMenu());
        }
    }

    updateAuthUI() {
        const authButtons = document.querySelector('.auth-buttons');
        const userAvatar = document.getElementById('user-avatar');
        
        if (this.currentUser) {
            if (authButtons) authButtons.style.display = 'none';
            if (userAvatar) {
                userAvatar.style.display = 'flex';
                userAvatar.title = this.currentUser.username;
            }
        } else {
            if (authButtons) authButtons.style.display = 'flex';
            if (userAvatar) userAvatar.style.display = 'none';
        }
    }

    showLoginModal() {
        const modal = this.createAuthModal('Login', 'login');
        document.body.appendChild(modal);
    }

    showSignupModal() {
        const modal = this.createAuthModal('Sign Up', 'signup');
        document.body.appendChild(modal);
    }

    createAuthModal(title, type) {
        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        const isLogin = type === 'login';
        const buttonText = isLogin ? 'Đăng nhập' : 'Tạo tài khoản';
        const switchText = isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?';
        const switchLink = isLogin ? 'Đăng ký ngay' : 'Đăng nhập ngay';
        
        modal.innerHTML = `
            <div class="auth-modal-content">
                <div class="auth-modal-header">
                    <h2>${title}</h2>
                    <button class="auth-modal-close" onclick="groovePlayer.hideAuthModal()">
                        <div class="icon icon-close"></div>
                    </button>
                </div>
                
                <div class="social-login">
                    <div class="social-buttons">
                        <button class="social-btn google" onclick="groovePlayer.socialLogin('google')">
                            <div class="social-icon google"></div>
                            <span>Tiếp tục với Google</span>
                        </button>
                        <button class="social-btn facebook" onclick="groovePlayer.socialLogin('facebook')">
                            <div class="social-icon facebook"></div>
                            <span>Tiếp tục với Facebook</span>
                        </button>
                        <button class="social-btn apple" onclick="groovePlayer.socialLogin('apple')">
                            <div class="social-icon apple"></div>
                            <span>Tiếp tục với Apple</span>
                        </button>
                    </div>
                    
                    <div class="divider">
                        <span>hoặc</span>
                    </div>
                </div>
                
                <form class="auth-form" onsubmit="groovePlayer.handleAuth(event, '${type}')">
                    <div class="form-group">
                        <input type="text" placeholder="Tên người dùng" required>
                    </div>
                    <div class="form-group">
                        <input type="password" placeholder="Mật khẩu" required>
                    </div>
                    ${!isLogin ? `
                        <div class="form-group">
                            <input type="email" placeholder="Email" required>
                        </div>
                    ` : ''}
                    <button type="submit" class="btn btn-primary btn-full">
                        ${buttonText}
                    </button>
                </form>
                
                <div class="auth-switch">
                    <span>${switchText}</span>
                    <button class="auth-link" onclick="groovePlayer.showAuthModal('${isLogin ? 'signup' : 'login'}')">
                        ${switchLink}
                    </button>
                </div>
                
                <div class="auth-demo">
                    <p><strong>Tài khoản demo:</strong></p>
                    <p>Username: <code>demo</code> | Password: <code>demo123</code></p>
                </div>
            </div>
        `;
        
        // Add event listeners
        modal.querySelector('.auth-modal-close').addEventListener('click', () => modal.remove());
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        document.body.appendChild(modal);
        return modal;
    }

    hideAuthModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.remove();
        }
    }

    socialLogin(provider) {
        // Simulate social login
        const socialUsers = {
            google: { username: 'google_user', email: 'user@gmail.com' },
            facebook: { username: 'facebook_user', email: 'user@facebook.com' },
            apple: { username: 'apple_user', email: 'user@icloud.com' }
        };
        
        const user = socialUsers[provider];
        this.currentUser = {
            id: Date.now(),
            username: user.username,
            email: user.email,
            provider: provider,
            joinDate: new Date().toISOString()
        };
        
        localStorage.setItem('groovezilla_current_user', JSON.stringify(this.currentUser));
        this.updateAuthUI();
        this.hideAuthModal();
        this.showNotification(`Đăng nhập thành công với ${provider.charAt(0).toUpperCase() + provider.slice(1)}!`);
    }

    handleAuth(e, type) {
        e.preventDefault();
        const form = e.target;
        const inputs = form.querySelectorAll('input');
        const username = inputs[0].value;
        const password = inputs[1].value;
        const email = type === 'signup' ? inputs[2]?.value : null;

        if (type === 'login') {
            this.login(username, password);
        } else {
            this.signup(username, password, email);
        }
        
        this.hideAuthModal();
    }

    login(username, password) {
        // Demo login - accept demo/demo123 or any username/password
        if (username === 'demo' && password === 'demo123') {
            this.currentUser = {
                id: 1,
                username: 'demo',
                email: 'demo@groovezilla.com',
                joinDate: new Date().toISOString()
            };
            localStorage.setItem('groovezilla_current_user', JSON.stringify(this.currentUser));
            this.updateAuthUI();
            this.showNotification('Welcome back, ' + username + '!');
        } else if (username && password) {
            // Accept any username/password for demo
            this.currentUser = {
                id: Date.now(),
                username: username,
                email: username + '@groovezilla.com',
                joinDate: new Date().toISOString()
            };
            localStorage.setItem('groovezilla_current_user', JSON.stringify(this.currentUser));
            this.updateAuthUI();
            this.showNotification('Welcome, ' + username + '!');
        } else {
            this.showNotification('Invalid credentials');
        }
    }

    signup(username, password, email) {
        if (username && password && email) {
            this.currentUser = {
                id: Date.now(),
                username: username,
                email: email,
                joinDate: new Date().toISOString()
            };
            localStorage.setItem('groovezilla_current_user', JSON.stringify(this.currentUser));
            this.updateAuthUI();
            this.showNotification('Account created successfully! Welcome, ' + username + '!');
        } else {
            this.showNotification('Please fill in all fields');
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('groovezilla_current_user');
        this.updateAuthUI();
        this.showNotification('Logged out successfully');
    }

    toggleUserMenu() {
        const userAvatar = document.getElementById('user-avatar');
        let userMenu = document.querySelector('.user-menu');
        
        if (!userMenu) {
            userMenu = document.createElement('div');
            userMenu.className = 'user-menu';
            userMenu.innerHTML = `
                <a href="profile.html" class="user-menu-item">
                    <div class="icon icon-user"></div>
                    <span>Profile</span>
                </a>
                <a href="settings.html" class="user-menu-item">
                    <div class="icon icon-settings"></div>
                    <span>Settings</span>
                </a>
                <div class="user-menu-item" onclick="groovePlayer.logout()">
                    <div class="icon icon-logout"></div>
                    <span>Logout</span>
                </div>
            `;
            userAvatar.appendChild(userMenu);
        }
        
        userMenu.classList.toggle('show');
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!userAvatar.contains(e.target)) {
                userMenu.classList.remove('show');
            }
        });
    }

    // Follow Artist Methods
    toggleFollowArtist(artistName) {
        const index = this.followedArtists.indexOf(artistName);
        
        if (index === -1) {
            this.followedArtists.push(artistName);
            this.updateFollowButton(artistName, true);
            this.showNotification(`Now following ${artistName}`);
        } else {
            this.followedArtists.splice(index, 1);
            this.updateFollowButton(artistName, false);
            this.showNotification(`Unfollowed ${artistName}`);
        }
        
        localStorage.setItem('groovezilla_followed_artists', JSON.stringify(this.followedArtists));
    }

    updateFollowButton(artistName, isFollowing) {
        document.querySelectorAll('.follow-btn').forEach(btn => {
            if (btn.textContent.includes(artistName) || btn.closest('.artist-card')?.querySelector('.artist-name')?.textContent === artistName) {
                btn.textContent = isFollowing ? 'Following' : 'Follow';
                btn.classList.toggle('following', isFollowing);
            }
        });
    }

    // Enhanced Playlist Controls
    addToPlaylistFromQueue(trackId, playlistId) {
        const result = this.addToPlaylist(trackId, playlistId);
        this.showNotification(result.message);
        return result;
    }

    removeFromPlaylist(trackId, playlistId) {
        const playlist = this.userPlaylists[playlistId];
        if (playlist && playlist.tracks.includes(trackId)) {
            playlist.tracks = playlist.tracks.filter(id => id !== trackId);
            this.saveUserPlaylists();
            this.showNotification('Track removed from playlist');
            return { success: true, message: "Track removed from playlist" };
        }
        return { success: false, message: "Track not found in playlist" };
    }

    reorderPlaylist(playlistId, fromIndex, toIndex) {
        const playlist = this.userPlaylists[playlistId];
        if (playlist && playlist.tracks[fromIndex] && playlist.tracks[toIndex]) {
            const track = playlist.tracks.splice(fromIndex, 1)[0];
            playlist.tracks.splice(toIndex, 0, track);
            this.saveUserPlaylists();
            this.showNotification('Playlist reordered');
        }
    }

    // Public API
    getTrackById(id) {
        return this.sampleTracks.find(t => t.id === id);
    }

    getAllTracks() {
        return this.sampleTracks;
    }

    getPlaylistById(id) {
        return this.samplePlaylists.find(p => p.id === id);
    }

    getLikedTracks() {
        return this.sampleTracks.filter(t => this.likedTracks.includes(t.id));
    }

    getListeningHistory() {
        return this.listeningHistory;
    }

    getFollowedArtists() {
        return this.followedArtists;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    // Enhanced Test Cases Helper
    runTestCases() {
        console.log('Running Groovezilla Enhanced Test Cases...');
        
        // TC1: Thêm bài trùng playlist
        console.log('TC1: Add duplicate track to playlist');
        const result1 = this.addToPlaylist(4, 1);
        const result2 = this.addToPlaylist(4, 1);
        console.log('First add:', result1);
        console.log('Duplicate add:', result2);
        
        // TC2: Like cùng track 2 lần
        console.log('TC2: Like same track twice');
        this.currentTrack = this.sampleTracks[0];
        this.toggleLike();
        const likedCount1 = this.likedTracks.length;
        this.toggleLike();
        const likedCount2 = this.likedTracks.length;
        console.log('Like count difference:', Math.abs(likedCount1 - likedCount2));
        
        // TC3: Tìm kiếm không dấu/tiếng Việt
        console.log('TC3: Vietnamese search');
        const searchResults = this.searchTracks('nhac');
        console.log('Search results for "nhac":', searchResults.length);
        
        // TC4: Sắp xếp playlist
        console.log('TC4: Sort playlist');
        this.playlist = this.sampleTracks.slice(0, 5);
        this.sortPlaylist('title');
        console.log('Sorted playlist by title');
        
        // TC5: Ghi nhận lịch sử
        console.log('TC5: Record listening history');
        this.currentTrack = this.sampleTracks[0];
        this.audio.currentTime = 35; // Simulate 35 seconds
        this.recordListeningHistory();
        console.log('History entries:', this.listeningHistory.length);
        
        // TC6: Authentication - Login/Logout
        console.log('TC6: Authentication flow');
        this.login('testuser', 'testpass');
        console.log('User after login:', this.currentUser?.username);
        this.logout();
        console.log('User after logout:', this.currentUser);
        
        // TC7: Follow/Unfollow Artist
        console.log('TC7: Follow artist');
        this.toggleFollowArtist('Luna Eclipse');
        console.log('Followed artists:', this.followedArtists);
        this.toggleFollowArtist('Luna Eclipse');
        console.log('After unfollow:', this.followedArtists);
        
        // TC8: Playlist Management
        console.log('TC8: Playlist management');
        this.addToPlaylist(5, 1);
        this.addToPlaylist(6, 1);
        console.log('Playlist after adding tracks:', this.userPlaylists[1]?.tracks);
        this.removeFromPlaylist(5, 1);
        console.log('Playlist after removing track:', this.userPlaylists[1]?.tracks);
        
        // TC9: Mini Player Functionality
        console.log('TC9: Mini player functionality');
        this.playTrack(4);
        console.log('Mini player should be visible:', document.getElementById('groovezilla-mini-player')?.classList.contains('show'));
        
            // TC10: Search with Multiple Criteria & UI
            console.log('TC10: Advanced search with UI');
            const popResults = this.searchTracks('pop');
            const artistResults = this.searchTracks('luna');
            console.log('Pop genre results:', popResults.length);
            console.log('Artist search results:', artistResults.length);
            
            // Test search UI functionality
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.value = 'midnight';
                searchInput.dispatchEvent(new Event('input'));
                console.log('Search UI test completed');
            }
        
        // TC11: Data Persistence
        console.log('TC11: Data persistence');
        const originalLikes = this.likedTracks.length;
        this.toggleLikeForTrack(7);
        const newLikes = this.likedTracks.length;
        console.log('Likes persisted:', newLikes !== originalLikes);
        
        // TC12: Error Handling
        console.log('TC12: Error handling');
        this.playTrack(999); // Non-existent track
        console.log('Error handling for non-existent track');
        
        console.log('All test cases completed!');
    }
}

// Initialize player when DOM loaded
let groovePlayer;
document.addEventListener('DOMContentLoaded', () => {
    groovePlayer = new GroovezillaAudioPlayer();
    
    // Mobile sidebar toggle
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    
    // Add mobile menu button if needed
    const header = document.querySelector('.header');
    if (header && window.innerWidth <= 768) {
        const menuBtn = document.createElement('button');
        menuBtn.innerHTML = '☰';
        menuBtn.className = 'btn btn-ghost';
        menuBtn.style.marginRight = 'var(--spacing-md)';
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });
        header.insertBefore(menuBtn, header.firstChild);
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(e.target) && 
            !e.target.matches('.btn')) {
            sidebar.classList.remove('show');
        }
    });
});

// Expose for testing
window.groovePlayer = groovePlayer;
/**
 * Groovezilla - Playlist Manager
 * Handle playlist operations
 */

class PlaylistManager {
    constructor() {
        this.playlists = [];
        this.currentPlaylist = null;
        this.init();
    }

    async init() {
        await this.loadPlaylists();
        console.log('📝 Playlist Manager initialized');
    }

    async loadPlaylists() {
        this.playlists = StorageManager.get('playlists', []);
        
        // If no playlists exist, create default ones
        if (this.playlists.length === 0) {
            this.createDefaultPlaylists();
        }
    }

    createDefaultPlaylists() {
        const defaults = [
            {
                id: this.generateId(),
                name: 'My Favorites',
                description: 'Your favorite tracks',
                tracks: [],
                cover: null,
                createdAt: new Date().toISOString(),
                isDefault: true
            },
            {
                id: this.generateId(),
                name: 'Recently Added',
                description: 'Latest additions to your library',
                tracks: [],
                cover: null,
                createdAt: new Date().toISOString(),
                isDefault: true
            }
        ];

        this.playlists = defaults;
        this.savePlaylists();
    }

    // Create new playlist
    createPlaylist(name, description = '') {
        const playlist = {
            id: this.generateId(),
            name,
            description,
            tracks: [],
            cover: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isDefault: false
        };

        this.playlists.push(playlist);
        this.savePlaylists();
        
        UIUtils.showToast(`Playlist "${name}" created`, 'success');
        this.triggerEvent('playlist:created', playlist);
        
        return playlist;
    }

    // Get all playlists
    getPlaylists() {
        return this.playlists;
    }

    // Get playlist by ID
    getPlaylist(id) {
        return this.playlists.find(p => p.id === id);
    }

    // Update playlist
    updatePlaylist(id, updates) {
        const playlist = this.getPlaylist(id);
        if (!playlist) {
            console.error('Playlist not found:', id);
            return null;
        }

        Object.assign(playlist, updates, {
            updatedAt: new Date().toISOString()
        });

        this.savePlaylists();
        this.triggerEvent('playlist:updated', playlist);
        
        return playlist;
    }

    // Delete playlist
    deletePlaylist(id) {
        const playlist = this.getPlaylist(id);
        if (!playlist) return false;

        if (playlist.isDefault) {
            UIUtils.showToast('Cannot delete default playlist', 'error');
            return false;
        }

        this.playlists = this.playlists.filter(p => p.id !== id);
        this.savePlaylists();
        
        UIUtils.showToast(`Playlist "${playlist.name}" deleted`, 'success');
        this.triggerEvent('playlist:deleted', { id, name: playlist.name });
        
        return true;
    }

    // Add track to playlist
    addTrack(playlistId, track) {
        const playlist = this.getPlaylist(playlistId);
        if (!playlist) return false;

        // Check if track already exists
        const exists = playlist.tracks.some(t => t.id === track.id);
        if (exists) {
            UIUtils.showToast('Track already in playlist', 'warning');
            return false;
        }

        playlist.tracks.push({
            ...track,
            addedAt: new Date().toISOString()
        });

        playlist.updatedAt = new Date().toISOString();
        this.savePlaylists();
        
        UIUtils.showToast(`Added to "${playlist.name}"`, 'success');
        this.triggerEvent('playlist:track:added', { playlist, track });
        
        return true;
    }

    // Remove track from playlist
    removeTrack(playlistId, trackId) {
        const playlist = this.getPlaylist(playlistId);
        if (!playlist) return false;

        const initialLength = playlist.tracks.length;
        playlist.tracks = playlist.tracks.filter(t => t.id !== trackId);

        if (playlist.tracks.length === initialLength) {
            UIUtils.showToast('Track not found in playlist', 'error');
            return false;
        }

        playlist.updatedAt = new Date().toISOString();
        this.savePlaylists();
        
        UIUtils.showToast('Track removed from playlist', 'success');
        this.triggerEvent('playlist:track:removed', { playlistId, trackId });
        
        return true;
    }

    // Reorder tracks in playlist
    reorderTracks(playlistId, fromIndex, toIndex) {
        const playlist = this.getPlaylist(playlistId);
        if (!playlist) return false;

        const tracks = [...playlist.tracks];
        const [removed] = tracks.splice(fromIndex, 1);
        tracks.splice(toIndex, 0, removed);

        playlist.tracks = tracks;
        playlist.updatedAt = new Date().toISOString();
        this.savePlaylists();
        
        this.triggerEvent('playlist:reordered', { playlistId });
        
        return true;
    }

    // Get playlist stats
    getPlaylistStats(playlistId) {
        const playlist = this.getPlaylist(playlistId);
        if (!playlist) return null;

        const totalDuration = playlist.tracks.reduce((sum, track) => {
            const [min, sec] = (track.duration || '0:0').split(':').map(Number);
            return sum + (min * 60) + sec;
        }, 0);

        return {
            trackCount: playlist.tracks.length,
            totalDuration: this.formatDuration(totalDuration),
            totalDurationSeconds: totalDuration
        };
    }

    // Search within playlist
    searchPlaylist(playlistId, query) {
        const playlist = this.getPlaylist(playlistId);
        if (!playlist) return [];

        const lowerQuery = query.toLowerCase();
        return playlist.tracks.filter(track => 
            track.title.toLowerCase().includes(lowerQuery) ||
            track.artist.toLowerCase().includes(lowerQuery)
        );
    }

    // Duplicate playlist
    duplicatePlaylist(id) {
        const original = this.getPlaylist(id);
        if (!original) return null;

        const duplicate = {
            ...original,
            id: this.generateId(),
            name: `${original.name} (Copy)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isDefault: false
        };

        this.playlists.push(duplicate);
        this.savePlaylists();
        
        UIUtils.showToast(`Playlist duplicated`, 'success');
        
        return duplicate;
    }

    // Export playlist
    exportPlaylist(id) {
        const playlist = this.getPlaylist(id);
        if (!playlist) return;

        const data = JSON.stringify(playlist, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${playlist.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        UIUtils.showToast('Playlist exported', 'success');
    }

    // Import playlist
    async importPlaylist(file) {
        try {
            const text = await file.text();
            const playlist = JSON.parse(text);
            
            playlist.id = this.generateId();
            playlist.createdAt = new Date().toISOString();
            playlist.updatedAt = new Date().toISOString();
            
            this.playlists.push(playlist);
            this.savePlaylists();
            
            UIUtils.showToast(`Playlist "${playlist.name}" imported`, 'success');
            
            return playlist;
        } catch (error) {
            console.error('Import error:', error);
            UIUtils.showToast('Failed to import playlist', 'error');
            return null;
        }
    }

    // Save playlists to storage
    savePlaylists() {
        StorageManager.set('playlists', this.playlists);
    }

    // Helper methods
    generateId() {
        return `playlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    }

    triggerEvent(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        window.dispatchEvent(event);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlaylistManager;
}

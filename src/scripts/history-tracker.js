/**
 * Groovezilla - History Tracker
 * Track and manage listening history
 */

class HistoryTracker {
    constructor() {
        this.history = [];
        this.maxHistorySize = 500;
        this.init();
    }

    async init() {
        await this.loadHistory();
        this.setupTracking();
        console.log('📊 History Tracker initialized');
    }

    async loadHistory() {
        this.history = StorageManager.get('history', []);
    }

    // Add track to history
    addToHistory(track) {
        const entry = {
            ...track,
            timestamp: new Date().toISOString(),
            playDuration: 0
        };

        this.history.unshift(entry);

        // Limit history size
        if (this.history.length > this.maxHistorySize) {
            this.history = this.history.slice(0, this.maxHistorySize);
        }

        this.saveHistory();
        this.triggerEvent('history:added', entry);
    }

    // Get full history
    getHistory() {
        return this.history;
    }

    // Get history for specific time range
    getHistoryByTimeRange(range = 'week') {
        const now = new Date();
        let startDate;

        switch (range) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case 'year':
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                return this.history;
        }

        return this.history.filter(entry => 
            new Date(entry.timestamp) >= startDate
        );
    }

    // Get history by genre
    getHistoryByGenre(genre) {
        return this.history.filter(entry => entry.genre === genre);
    }

    // Get history by artist
    getHistoryByArtist(artistName) {
        return this.history.filter(entry => entry.artist === artistName);
    }

    // Search history
    searchHistory(query) {
        const lowerQuery = query.toLowerCase();
        return this.history.filter(entry =>
            entry.title.toLowerCase().includes(lowerQuery) ||
            entry.artist.toLowerCase().includes(lowerQuery) ||
            entry.album?.toLowerCase().includes(lowerQuery)
        );
    }

    // Get listening statistics
    getStats(timeRange = 'week') {
        const historyData = this.getHistoryByTimeRange(timeRange);

        // Total plays
        const totalPlays = historyData.length;

        // Unique tracks
        const uniqueTracks = new Set(historyData.map(h => h.id)).size;

        // Total listening time
        const totalMinutes = historyData.reduce((acc, h) => {
            const duration = this.parseDuration(h.duration);
            return acc + duration;
        }, 0);

        // Genre distribution
        const genreCounts = {};
        historyData.forEach(h => {
            genreCounts[h.genre] = (genreCounts[h.genre] || 0) + 1;
        });
        const topGenre = Object.entries(genreCounts)
            .sort((a, b) => b[1] - a[1])[0];

        // Top artists
        const artistCounts = {};
        historyData.forEach(h => {
            artistCounts[h.artist] = (artistCounts[h.artist] || 0) + 1;
        });
        const topArtists = Object.entries(artistCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([artist, plays]) => ({ artist, plays }));

        // Most played tracks
        const trackCounts = {};
        historyData.forEach(h => {
            const key = `${h.id}`;
            trackCounts[key] = trackCounts[key] || { ...h, plays: 0 };
            trackCounts[key].plays++;
        });
        const topTracks = Object.values(trackCounts)
            .sort((a, b) => b.plays - a.plays)
            .slice(0, 10);

        return {
            totalPlays,
            uniqueTracks,
            totalListeningTime: this.formatDuration(totalMinutes),
            totalListeningMinutes: Math.floor(totalMinutes),
            topGenre: topGenre ? topGenre[0] : null,
            topGenreCount: topGenre ? topGenre[1] : 0,
            topArtists,
            topTracks,
            genreDistribution: this.getGenreDistribution(historyData)
        };
    }

    // Get genre distribution
    getGenreDistribution(historyData = this.history) {
        const genreCounts = {};
        historyData.forEach(h => {
            genreCounts[h.genre] = (genreCounts[h.genre] || 0) + 1;
        });

        return Object.entries(genreCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([genre, count]) => ({
                genre: genre.charAt(0).toUpperCase() + genre.slice(1),
                count,
                percentage: ((count / historyData.length) * 100).toFixed(1)
            }));
    }

    // Get calendar data for heatmap
    getCalendarData(year, month) {
        const data = {};
        
        this.history.forEach(entry => {
            const date = new Date(entry.timestamp);
            if (date.getFullYear() === year && date.getMonth() === month) {
                const day = date.getDate();
                data[day] = (data[day] || 0) + 1;
            }
        });

        return data;
    }

    // Get listening activity by time of day
    getActivityByTimeOfDay() {
        const hours = new Array(24).fill(0);
        
        this.history.forEach(entry => {
            const hour = new Date(entry.timestamp).getHours();
            hours[hour]++;
        });

        return hours;
    }

    // Get listening activity by day of week
    getActivityByDayOfWeek() {
        const days = new Array(7).fill(0);
        
        this.history.forEach(entry => {
            const day = new Date(entry.timestamp).getDay();
            days[day]++;
        });

        return days;
    }

    // Clear history
    clearHistory(timeRange = 'all') {
        if (timeRange === 'all') {
            UIUtils.confirm(
                'Clear History',
                'Are you sure you want to clear your entire listening history?',
                () => {
                    this.history = [];
                    this.saveHistory();
                    UIUtils.showToast('History cleared', 'success');
                    this.triggerEvent('history:cleared');
                }
            );
        } else {
            const cutoffDate = this.getTimeRangeCutoff(timeRange);
            const initialLength = this.history.length;
            
            this.history = this.history.filter(entry =>
                new Date(entry.timestamp) < cutoffDate
            );

            const removed = initialLength - this.history.length;
            this.saveHistory();
            
            UIUtils.showToast(`Removed ${removed} entries`, 'success');
            this.triggerEvent('history:cleared', { timeRange, removed });
        }
    }

    getTimeRangeCutoff(range) {
        const now = new Date();
        switch (range) {
            case 'today':
                return new Date(now.getFullYear(), now.getMonth(), now.getDate());
            case 'week':
                return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            case 'month':
                return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            default:
                return new Date(0);
        }
    }

    // Export history
    exportHistory() {
        if (this.history.length === 0) {
            UIUtils.showToast('No history to export', 'warning');
            return;
        }

        const data = JSON.stringify(this.history, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `groovezilla-history-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        UIUtils.showToast('History exported', 'success');
    }

    // Setup automatic tracking
    setupTracking() {
        // Listen for audio player events
        window.addEventListener('audio:play', (e) => {
            if (e.detail && e.detail.track) {
                this.addToHistory(e.detail.track);
            }
        });

        window.addEventListener('audio:ended', (e) => {
            // Track completion could be logged here
        });
    }

    // Save to storage
    saveHistory() {
        StorageManager.set('history', this.history);
    }

    // Helper methods
    parseDuration(durationString) {
        if (!durationString) return 0;
        const [min, sec] = durationString.split(':').map(Number);
        return (min || 0) + ((sec || 0) / 60);
    }

    formatDuration(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = Math.floor(minutes % 60);
        
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    }

    triggerEvent(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        window.dispatchEvent(event);
    }

    // Get recently played
    getRecentlyPlayed(limit = 20) {
        return this.history.slice(0, limit);
    }

    // Check if track was recently played
    wasRecentlyPlayed(trackId, withinMinutes = 30) {
        const cutoff = new Date(Date.now() - withinMinutes * 60 * 1000);
        return this.history.some(entry => 
            entry.id === trackId && new Date(entry.timestamp) >= cutoff
        );
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HistoryTracker;
}

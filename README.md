# Groovezilla - Music Streaming Web App

A modern, responsive music streaming web application with dark theme and cyan/aqua accent colors, featuring comprehensive functionality similar to Spotify.

## 🎵 Features

### Core Functionality
- **Audio Player**: Full-featured music player with play/pause, next/previous, shuffle, repeat
- **Mini Player**: Sticky mini player that appears when music is playing
- **Playlist Management**: Create, manage, and play playlists with drag-and-drop reordering
- **Search**: Advanced search tracks by title, artist, album, or genre with Vietnamese support
- **Like System**: Like/unlike tracks with persistent storage
- **Listening History**: Automatic tracking of listening history (30+ seconds)
- **Artist Following**: Follow/unfollow artists with notifications
- **Authentication**: Login/signup system with demo accounts
- **Settings**: Comprehensive settings for audio, playback, and privacy
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### UI/UX Features
- **Dark Theme**: Modern dark interface with cyan/aqua accents (#00E4CB)
- **SVG Icons**: Complete icon set for navigation, controls, and UI elements
- **Navigation Icons**: Home, Playlist, Album, Artist, Discovery, History, Favorites, Settings
- **Control Icons**: Play, Pause, Next, Previous, Shuffle, Repeat, Volume, Like, Search
- **Action Icons**: Download, Login, Logout, User, Plus, Menu, Expand
- **Responsive Layout**: Adaptive design for all screen sizes
- **Smooth Animations**: CSS transitions and hover effects
- **Modern Typography**: Inter font family for clean readability
- **Card-based Design**: Clean, organized content presentation
- **Modal System**: Login/signup modals with backdrop
- **Notification System**: Toast notifications for user feedback
- **Search Dropdown**: Real-time search with beautiful dropdown results

## 🚀 Getting Started

### Prerequisites
- Modern web browser with JavaScript enabled
- Local web server (for audio file access)

### Installation
1. Clone or download the project files
2. Ensure audio files are in the `audio/` directory
3. Open `index.html` in a web browser or serve via local server

### File Structure
```
groozellia/
├── index.html          # Main homepage
├── playlist.html       # Playlist management page
├── miniplayer.html     # Full player page
├── history.html        # Listening history page
├── favorites.html      # Liked songs page
├── settings.html       # Settings page
├── test-player.html    # Test page for functionality
├── css/
│   └── main.css       # Main stylesheet with dark theme & icons
├── js/
│   └── audio-player.js # Enhanced audio player with auth
├── audio/             # Audio files (mp3)
└── images/           # Image assets
```

## 🎮 Usage

### Authentication
**Demo Accounts:**
- **Username:** demo
- **Password:** demo123
- **Email:** demo@groovezilla.com

**Social Login Options:**
- **Google**: Đăng nhập với tài khoản Google
- **Facebook**: Đăng nhập với tài khoản Facebook  
- **Apple**: Đăng nhập với tài khoản Apple ID

Or create your own account with any username/password combination.

### Basic Controls
- **Play Track**: Click any play button to start playing
- **Pause/Resume**: Click the play button again to pause/resume
- **Next/Previous**: Use mini player controls with SVG icons
- **Volume**: Adjust volume using the volume slider in settings
- **Like**: Click heart button to like/unlike tracks
- **Follow**: Click follow button to follow/unfollow artists

### Navigation
- **Home**: Browse featured content and top tracks
- **Playlist**: Manage playlists and discover new music
- **History**: View your listening history and stats
- **Favorites**: Manage your liked songs
- **Settings**: Customize audio, playback, and privacy settings
- **Mini Player**: Full-screen player experience
- **Search**: Use the search bar to find specific tracks with real-time dropdown results

### Search Functionality
The search feature provides powerful music discovery:
- **Real-time Search**: Type to search with instant results
- **Vietnamese Support**: Works with Vietnamese diacritics (có dấu/không dấu)
- **Smart Matching**: Searches title, artist, album, and genre
- **Dropdown Results**: Beautiful dropdown showing up to 8 results
- **Click to Play**: Click any result to play immediately
- **Loading States**: Shows loading indicator while searching
- **No Results**: Friendly message when no matches found
- **Debounced**: Optimized performance with 300ms delay

### Mini Player
The mini player automatically appears when music starts playing:
- Shows current track info with cover art
- Provides play/pause, next/previous controls with SVG icons
- Displays progress bar with time
- Includes like and volume controls
- Can be expanded to full player
- Sticky positioning at bottom of screen

## 🛠️ Technical Details

### Audio Player Class
The `GroovezillaAudioPlayer` class handles all audio functionality:

```javascript
// Initialize player
const player = new GroovezillaAudioPlayer();

// Play a track
player.playTrack(trackId);

// Toggle play/pause
player.togglePlayPause();

// Search tracks
const results = player.searchTracks('query');
```

### Business Rules Implementation
1. **Unique Playlist Entries**: Tracks can only appear once per playlist
2. **Listening History**: Tracks are recorded in history after 30+ seconds
3. **Like System**: Each track can only be liked once (toggle behavior)
4. **Authentication**: Demo accounts and custom user creation
5. **Artist Following**: Follow/unfollow with persistent storage
6. **Data Persistence**: All user data saved in localStorage

### Data Storage
- Uses localStorage for persistent data
- Stores listening history, liked tracks, and user playlists
- Automatic cleanup (history limited to 100 entries)

### Responsive Breakpoints
- **Desktop**: 1200px+ (5-column grids)
- **Tablet**: 768px-1199px (3-4 column grids)
- **Mobile**: <768px (1-2 column grids, collapsible sidebar)

## 🎨 Customization

### Color Scheme
The app uses CSS custom properties for easy theming:

```css
:root {
    --primary-bg: #0a0a0a;
    --secondary-bg: #1a1a1a;
    --primary-accent: #00E4CB;
    --secondary-accent: #00B8A3;
    --text-primary: #ffffff;
    --text-secondary: #b3b3b3;
}
```

### Adding New Tracks
Add tracks to the `sampleTracks` array in `audio-player.js`:

```javascript
{
    id: 23,
    title: "New Track",
    artist: "Artist Name",
    album: "Album Name",
    genre: "Genre",
    duration: "3:45",
    file: "audio/23.mp3",
    cover: "https://example.com/cover.jpg"
}
```

## 🧪 Testing

Use `test-player.html` to test all functionality:

### Test Cases (12 comprehensive tests)
1. **TC1**: Add duplicate track to playlist
2. **TC2**: Like same track twice (toggle behavior)
3. **TC3**: Vietnamese search without diacritics
4. **TC4**: Sort playlist by different criteria
5. **TC5**: Record listening history (30+ seconds)
6. **TC6**: Authentication flow (login/logout)
7. **TC7**: Follow/unfollow artist
8. **TC8**: Playlist management (add/remove tracks)
9. **TC9**: Mini player functionality
10. **TC10**: Advanced search with multiple criteria
11. **TC11**: Data persistence across sessions
12. **TC12**: Error handling for edge cases

### Manual Testing
- Play different tracks
- Test play/pause controls with SVG icons
- Verify like system and notifications
- Check search functionality with Vietnamese
- Test authentication with demo accounts
- Verify mini player appearance and controls
- Test responsive design on different screen sizes
- Check settings persistence
- Test artist following functionality

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🔧 Development

### Adding New Features
1. Extend the `GroovezillaAudioPlayer` class
2. Add corresponding UI elements
3. Update CSS for styling
4. Test functionality thoroughly

### Performance Considerations
- Audio files are loaded on-demand
- Images use optimized Unsplash URLs
- CSS uses efficient selectors and properties
- JavaScript uses event delegation for performance

## 📄 License

This project is for educational/demonstration purposes.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Groovezilla** - Where Every Note Finds a Home 🎵#   D e m o P a g e  
 
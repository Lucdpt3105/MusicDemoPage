# PowerShell script to update all HTML pages with new sidebar structure

$pages = @(
    @{file="album.html"; active="album.html"},
    @{file="artist.html"; active="artist.html"},
    @{file="discovery.html"; active="discovery.html"},
    @{file="favorites.html"; active="favorites.html"},
    @{file="history.html"; active="history.html"},
    @{file="settings.html"; active="settings.html"},
    @{file="admin.html"; active="admin.html"},
    @{file="miniplayer.html"; active="miniplayer.html"}
)

$sidebarTemplate = @'
        <aside class="sidebar">
            <div class="sidebar-header">
                <img src="../../assets/images/logo.svg" alt="Groovezilla Logo" class="app-logo">
                <h1 class="app-name">Groovezilla</h1>
            </div>

            <!-- Main Navigation -->
            <nav class="main-nav">
                <h3 class="nav-section-title">Menu</h3>
                <a href="../../index.html" class="nav-link">
                    <i class="fas fa-home"></i>
                    <span>Home</span>
                </a>
                <a href="playlist.html" class="nav-link PLAYLIST_ACTIVE">
                    <i class="fas fa-list-ul"></i>
                    <span>Playlists</span>
                </a>
                <a href="album.html" class="nav-link ALBUM_ACTIVE">
                    <i class="fas fa-compact-disc"></i>
                    <span>Albums</span>
                </a>
            </nav>

            <!-- Discovery Section -->
            <nav class="main-nav">
                <h3 class="nav-section-title">Discovery</h3>
                <a href="discovery.html" class="nav-link DISCOVERY_ACTIVE">
                    <i class="fas fa-fire"></i>
                    <span>Trending</span>
                </a>
                <a href="artist.html" class="nav-link ARTIST_ACTIVE">
                    <i class="fas fa-microphone"></i>
                    <span>Artists</span>
                </a>
                <a href="history.html" class="nav-link HISTORY_ACTIVE">
                    <i class="fas fa-history"></i>
                    <span>History</span>
                </a>
                <a href="favorites.html" class="nav-link FAVORITES_ACTIVE">
                    <i class="fas fa-heart"></i>
                    <span>Favorites</span>
                </a>
            </nav>

            <!-- My Playlists -->
            <nav class="main-nav">
                <h3 class="nav-section-title">My Playlists</h3>
                <a href="#" class="nav-link playlist-item">
                    <i class="fas fa-heart" style="color: #ff6b6b;"></i>
                    <span>Love</span>
                </a>
                <a href="#" class="nav-link playlist-item">
                    <i class="fas fa-bolt" style="color: #4ecdc4;"></i>
                    <span>Electro</span>
                </a>
                <a href="#" class="nav-link playlist-item">
                    <i class="fas fa-music" style="color: #a29bfe;"></i>
                    <span>Funk</span>
                </a>
                <a href="#" class="nav-link playlist-item">
                    <i class="fas fa-headphones" style="color: #feca57;"></i>
                    <span>EDM</span>
                </a>
            </nav>

            <!-- Settings -->
            <div class="sidebar-footer">
                <a href="admin.html" class="nav-link ADMIN_ACTIVE">
                    <i class="fas fa-crown"></i>
                    <span>Admin</span>
                </a>
                <a href="settings.html" class="nav-link SETTINGS_ACTIVE">
                    <i class="fas fa-cog"></i>
                    <span>Settings</span>
                </a>
            </div>
        </aside>
'@

Write-Host "🚀 Updating sidebar for all pages..." -ForegroundColor Cyan

foreach ($page in $pages) {
    $filePath = "h:\20262027Period\Programming\DemoPage\src\pages\$($page.file)"
    
    if (Test-Path $filePath) {
        Write-Host "📝 Processing $($page.file)..." -ForegroundColor Yellow
        
        $content = Get-Content $filePath -Raw
        
        # Replace sidebar with new template
        $activePage = $page.active.ToUpper().Replace('.HTML', '_ACTIVE')
        $newSidebar = $sidebarTemplate -replace "$activePage", "active"
        $newSidebar = $newSidebar -replace '_ACTIVE', ''
        
        # Try to find and replace old sidebar
        if ($content -match '(?s)<(?:div|aside)[^>]*class="[^"]*sidebar[^"]*"[^>]*>.*?</(?:div|aside)>') {
            $content = $content -replace '(?s)<(?:div|aside)[^>]*class="[^"]*sidebar[^"]*"[^>]*>.*?</(?:div|aside)>', $newSidebar
            
            Set-Content -Path $filePath -Value $content -NoNewline
            Write-Host "✅ Updated $($page.file)" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Could not find sidebar in $($page.file)" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ File not found: $($page.file)" -ForegroundColor Red
    }
}

Write-Host "`n✨ Done! All pages updated." -ForegroundColor Green

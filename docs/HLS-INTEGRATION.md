# 🎵 Groovezilla - HLS.js Integration Guide

## ✅ Đã Cài Đặt Xong!

HLS.js đã được tích hợp vào Groovezilla Audio Player với các tính năng:

### 📦 Những gì đã được thêm:

1. **HLS.js Library** - Đã thêm vào tất cả các trang HTML
2. **Auto-detect Format** - Tự động nhận diện MP3 hoặc HLS (.m3u8)
3. **Fallback Support** - Hỗ trợ Safari native HLS
4. **Error Recovery** - Tự động khôi phục khi có lỗi network/media

### 🎯 Cách Sử Dụng:

#### 1. **MP3 Files (Hiện tại):**
```javascript
// Không cần thay đổi gì! Player tự động xử lý
player.playTrack(4); // Phát audio/4.mp3
```

#### 2. **HLS Streaming (Tương lai):**
```javascript
// Khi bạn có file .m3u8, chỉ cần thay đổi đường dẫn:
{
    id: 23,
    title: "New Track",
    file: "https://example.com/stream.m3u8", // HLS stream
    // ... các thông tin khác
}
```

### 📂 Cấu Trúc File Âm Thanh:

```
groozellia/
├── audio/
│   ├── 4.mp3   ← Midnight Dreams
│   ├── 5.mp3   ← Summer Breeze
│   ├── 6.mp3   ← Electric Pulse
│   ├── ...
│   ├── 21.mp3  ← Indie Spirit
│   └── 22.mp3  ← World Music
└── js/
    └── audio-player.js ← HLS support enabled
```

### 🧪 Test HLS Integration:

Mở file `test-hls.html` trong browser để kiểm tra:
- ✅ HLS.js đã load chưa
- ✅ Browser có hỗ trợ không
- ✅ Test phát tất cả 19 bài nhạc

```bash
# Mở trong browser:
# file:///h:/2025-2026/CongNghePhanMem/groozellia/test-hls.html
```

### 🔧 Tính Năng HLS Player:

```javascript
class GroovezillaAudioPlayer {
    loadAudioSource(source) {
        // Tự động nhận diện format
        if (source.endsWith('.m3u8')) {
            // Dùng HLS.js cho streaming
            this.hls = new Hls();
            this.hls.loadSource(source);
            this.hls.attachMedia(this.audio);
        } else {
            // Dùng HTML5 Audio cho MP3
            this.audio.src = source;
        }
    }
}
```

### 📊 Browser Support:

| Browser | MP3 Support | HLS Support |
|---------|-------------|-------------|
| Chrome  | ✅ Yes     | ✅ Yes (HLS.js) |
| Firefox | ✅ Yes     | ✅ Yes (HLS.js) |
| Safari  | ✅ Yes     | ✅ Yes (Native) |
| Edge    | ✅ Yes     | ✅ Yes (HLS.js) |
| Opera   | ✅ Yes     | ✅ Yes (HLS.js) |

### 🎨 HLS Configuration:

Player được cấu hình với các tùy chọn tối ưu:

```javascript
new Hls({
    debug: false,              // Không show debug log
    enableWorker: true,        // Dùng Web Worker (performance)
    lowLatencyMode: true,      // Giảm độ trễ
    backBufferLength: 90       // Buffer 90 giây
});
```

### 🚀 Chuyển Đổi MP3 sang HLS (Tùy chọn):

Nếu muốn chuyển sang streaming HLS format:

#### Sử dụng FFmpeg:
```bash
# Cài FFmpeg: https://ffmpeg.org/download.html

# Chuyển đổi MP3 sang HLS
ffmpeg -i audio/4.mp3 -codec: copy -start_number 0 -hls_time 10 -hls_list_size 0 -f hls audio/4.m3u8

# Batch convert tất cả
for i in {4..22}; do
    ffmpeg -i audio/$i.mp3 -codec: copy -hls_time 10 -hls_list_size 0 -f hls audio/$i.m3u8
done
```

### 📝 Update Track Data:

Sau khi có file HLS, cập nhật trong `audio-player.js`:

```javascript
this.sampleTracks = [
    {
        id: 4,
        title: "Midnight Dreams",
        artist: "Luna Eclipse",
        file: "audio/4.m3u8",  // ← Đổi từ .mp3 sang .m3u8
        // ...
    },
    // ...
];
```

### 🎯 Lợi Ích HLS:

1. **Adaptive Bitrate** - Tự động điều chỉnh chất lượng theo network
2. **Better Buffering** - Buffer hiệu quả hơn
3. **Live Streaming** - Hỗ trợ streaming trực tiếp
4. **CDN Friendly** - Tối ưu cho CDN delivery
5. **Mobile Optimized** - Tiết kiệm data cho mobile

### ⚡ Performance Tips:

```javascript
// Preload next track để giảm loading time
this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
    const nextTrack = this.playlist[this.currentIndex + 1];
    if (nextTrack) {
        // Preload logic here
    }
});
```

### 🐛 Troubleshooting:

#### Issue: HLS không load
```javascript
// Check console
if (typeof Hls === 'undefined') {
    console.error('HLS.js not loaded!');
}
```

#### Issue: CORS error với streaming
```javascript
// Thêm CORS headers trên server
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, HEAD
```

### 📚 Tài Liệu:

- **HLS.js Docs:** https://github.com/video-dev/hls.js
- **HLS Protocol:** https://developer.apple.com/streaming/
- **FFmpeg Guide:** https://trac.ffmpeg.org/wiki/StreamingGuide

### 💡 Tips:

1. **Hiện tại:** Giữ nguyên MP3 - đơn giản, hiệu quả
2. **Tương lai:** Chuyển sang HLS khi scale lớn hoặc cần adaptive streaming
3. **Hybrid:** Có thể dùng cả hai - HLS cho premium, MP3 cho free

### 🎉 Kết Luận:

Audio player của bạn giờ đã:
- ✅ Phát được tất cả 19 file MP3 (4.mp3 - 22.mp3)
- ✅ Sẵn sàng cho HLS streaming (.m3u8)
- ✅ Tự động detect và xử lý cả hai format
- ✅ Có error recovery cho streaming
- ✅ Hỗ trợ mọi browser hiện đại

Enjoy your music! 🎵🎶

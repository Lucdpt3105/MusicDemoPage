# 🚀 Quick Start Guide

## Groovezilla - Music Streaming App

### Cấu trúc dự án đã được tối ưu hóa!

## 📁 Cấu trúc thư mục

```
DemoPage/
├── index.html              # Trang chính - MỞ FILE NÀY ĐỂ CHẠY ỨNG DỤNG
├── README.md               # Tài liệu chi tiết
├── RESTRUCTURE-LOG.md      # Log thay đổi cấu trúc
├── .gitignore              # Git ignore patterns
│
├── docs/                   # 📚 Tài liệu kỹ thuật
│   ├── FONT-AWESOME-GUIDE.md
│   ├── HLS-INTEGRATION.md
│   └── ...
│
├── src/                    # 💻 Mã nguồn
│   ├── pages/              # Các trang HTML
│   │   ├── playlist.html
│   │   ├── discovery.html
│   │   ├── favorites.html
│   │   └── ...
│   ├── styles/             # CSS
│   │   └── main.css
│   └── scripts/            # JavaScript
│       └── audio-player.js
│
├── assets/                 # 🎨 Tài nguyên tĩnh
│   ├── images/             # Hình ảnh
│   └── audio/              # File nhạc
│
└── tests/                  # 🧪 File test
    ├── test-hls.html
    └── test-player.html
```

## ⚡ Cách chạy

### Phương pháp 1: Mở trực tiếp
1. Mở file `index.html` trong trình duyệt
2. Thưởng thức âm nhạc!

### Phương pháp 2: Local Server (Khuyến nghị)
```bash
# Sử dụng Python
python -m http.server 8000

# Hoặc sử dụng Node.js
npx http-server

# Hoặc sử dụng PHP
php -S localhost:8000
```

Sau đó truy cập: `http://localhost:8000`

## 🎮 Tính năng chính

- ✅ **Music Player**: Phát nhạc đầy đủ tính năng
- ✅ **Playlists**: Quản lý danh sách phát
- ✅ **Search**: Tìm kiếm bài hát (hỗ trợ tiếng Việt)
- ✅ **Favorites**: Lưu bài hát yêu thích
- ✅ **History**: Lịch sử nghe nhạc
- ✅ **Dark Theme**: Giao diện tối hiện đại

## 🔧 Tài khoản Demo

**Username:** demo  
**Password:** demo123  
**Email:** demo@groovezilla.com

## 📝 Ghi chú quan trọng

1. **Đường dẫn đã được cập nhật**: Tất cả file đã được di chuyển vào thư mục phù hợp
2. **Tương thích ngược**: Ứng dụng hoạt động y như cũ
3. **Dễ bảo trì**: Cấu trúc rõ ràng, dễ tìm file
4. **Chuẩn chuyên nghiệp**: Theo best practices

## 🎯 Làm việc với dự án

### Chỉnh sửa giao diện
- Vào `src/styles/main.css`

### Chỉnh sửa chức năng
- Vào `src/scripts/audio-player.js`

### Thêm trang mới
- Tạo file HTML trong `src/pages/`
- Nhớ cập nhật đường dẫn: `../../src/styles/main.css`

### Thêm hình ảnh/nhạc
- Thêm vào `assets/images/` hoặc `assets/audio/`

## 📚 Tài liệu thêm

- Chi tiết dự án: Xem [README.md](README.md)
- Log thay đổi: Xem [RESTRUCTURE-LOG.md](RESTRUCTURE-LOG.md)
- Hướng dẫn Font Awesome: Xem `docs/FONT-AWESOME-GUIDE.md`
- Tích hợp HLS: Xem `docs/HLS-INTEGRATION.md`

## 💡 Tips

1. Sử dụng DevTools (F12) để debug
2. Kiểm tra Console nếu có lỗi
3. Đảm bảo file audio tồn tại trong `assets/audio/`
4. Dùng Live Server extension cho hot reload

## 🆘 Gặp vấn đề?

1. Kiểm tra đường dẫn file có đúng không
2. Xem Console trong DevTools
3. Đảm bảo chạy qua HTTP server (không phải file://)
4. Kiểm tra các file trong `assets/audio/` có tồn tại

## 🎉 Chúc bạn code vui vẻ!

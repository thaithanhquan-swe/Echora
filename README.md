# Echora - Spotify Clone (Web Player)

Một ứng dụng nghe nhạc trực tuyến với giao diện và trải nghiệm mô phỏng Spotify Web Player, được xây dựng bằng **React**, **TypeScript**, **Tailwind CSS** và **shadcn/ui**.

---

## 🚀 Công nghệ sử dụng (Tech Stack)

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Ngôn ngữ**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (xây dựng trên nền tảng [Radix UI primitives](https://www.radix-ui.com/))
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio Engine**: HTML5 Audio API kết hợp với React Context

---

## ✨ Tính năng nổi bật (Features)

### 1. Khung giao diện chuẩn Spotify Desktop
- **Top Header Bar**:
  - Logo Echora với hiệu ứng hover
  - Nút điều hướng Lịch sử (Back / Forward)
  - Nút Home tiện dụng
  - Thanh tìm kiếm thông minh dạng pill bo tròn
  - Các nút hành động: Khám phá Premium, Cài đặt ứng dụng, Chuông thông báo, Avatar người dùng cùng Dropdown Menu.
- **Thư viện bên trái (Your Library Sidebar)**:
  - Header thư viện với nút tạo playlist `+`
  - Bộ lọc danh mục dạng badge: *Danh sách phát*, *Nghệ sĩ*, *Album*
  - Ô tìm kiếm nhanh trong thư viện
  - Mục đặc biệt: **Bài hát đã thích** (Liked Songs)
  - Danh sách Playlists và Nghệ sĩ kèm ảnh bìa, trạng thái đang phát (sóng âm / icon volume nhảy động)
- **Khu vực nội dung chính (Main Content Area)**:
  - **Trang chủ (Home View)**: Lời chào động theo thời gian trong ngày ("Chào buổi sáng/chiều/tối"), lưới 6 thẻ Quick-picks kinh điển của Spotify, các hàng danh sách "Dành cho bạn", "Nghệ sĩ nổi tiếng", "Album & Đĩa đơn".
  - **Trang tìm kiếm (Search / Browse View)**: Khi chưa gõ sẽ hiển thị các ô thể loại âm nhạc rực rỡ (Pop, V-Pop, Indie, Hip-Hop, Thư giãn, Tập luyện...). Khi gõ sẽ tìm kiếm realtime theo bài hát, nghệ sĩ, playlist và hiển thị thẻ "Kết quả hàng đầu".
  - **Trang chi tiết Playlist / Album (Detail Views)**: Header gradient bắt mắt, ảnh bìa lớn, nút Play xanh lá đặc trưng, bảng danh sách bài hát chuẩn Spotify (`#`, `Tiêu đề`, `Album`, `Ngày thêm`, `Thời lượng`, hover play, sóng âm animated).
  - **Trang Nghệ sĩ (Artist Profile View)**: Ảnh bìa nghệ sĩ, huy hiệu "Nghệ sĩ được xác minh", số lượng người nghe hàng tháng, top bài hát phổ biến và phần Giới thiệu (About).
  - **Trang Bài hát đã thích (Liked Songs View)**: Quản lý toàn bộ danh sách các bài hát bạn đã bấm tim yêu thích.
- **Thanh phát nhạc bên dưới (Persistent Player Bar)**:
  - Cột trái: Thumbnail bài hát, Tên bài, Tên ca sĩ, Nút thích bài hát (Heart xanh lá).
  - Cột giữa: Nút Shuffle (trộn bài), Previous, Nút tròn Play/Pause lớn, Next, Nút Repeat (tắt / lặp tất cả / lặp 1 bài), Thanh tiến trình (Seek bar) kéo thả mượt mà kèm hiển thị thời gian hiện tại / tổng thời lượng.
  - Cột phải: Bật/tắt thanh xem Đang phát bên phải, Bật/tắt Lời bài hát, Bật/tắt Danh sách chờ (Queue), Bật/tắt Âm lượng (Mute) & Thanh trượt âm lượng, Nút Toàn màn hình (Fullscreen).
- **Trải nghiệm hát Karaoke với Lời bài hát (Synced Lyrics View)**:
  - Giao diện toàn màn hình mờ ảo với lời bài hát đồng bộ theo thời gian thực.
  - Tự động cuộn đến câu đang hát (highlight sáng rõ).
  - Bấm vào bất kỳ dòng lời bài hát nào để nhảy ngay đến đoạn đó của bài hát!
- **Hàng đợi bài hát (Queue Drawer)**:
  - Xem bài hát đang phát và danh sách các bài tiếp theo.
  - Cho phép chọn phát ngay hoặc xóa khỏi hàng đợi.

---

## 🎹 Phím tắt nhanh (Keyboard Shortcuts)

- `Phím Cách (Space)`: Phát / Tạm dừng bài hát
- `M`: Bật / Tắt tiếng (Mute / Unmute)
- `/` hoặc `Ctrl + K`: Nhảy đến thanh tìm kiếm

---

## 🛠️ Hướng dẫn cài đặt và chạy (Getting Started)

### Yêu cầu
- Node.js >= 18
- npm hoặc pnpm

### Cài đặt dependencies
```bash
npm install
```

### Chạy chế độ phát triển (Development Server)
```bash
npm run dev
```
Mở trình duyệt tại địa chỉ hiển thị trên terminal (thường là `http://localhost:5173`).

### Build dự án cho Production
```bash
npm run build
```

### Xem trước bản build (Preview Production)
```bash
npm run preview
```

---

## 📂 Cấu trúc thư mục (Project Structure)

```
Echora/
├── public/
├── src/
│   ├── components/
│   │   ├── common/             # MediaCard, QuickPickCard, TrackRow
│   │   ├── layout/             # TopNav, Sidebar, MainContent, RightSidebar
│   │   ├── player/             # PlayerBar, LyricsModal
│   │   ├── ui/                 # shadcn/ui components (button, slider, avatar, dropdown...)
│   │   └── views/              # HomeView, SearchView, PlaylistDetailView, ArtistDetailView...
│   ├── context/
│   │   └── PlayerContext.tsx   # Quản lý toàn bộ state âm thanh, phát nhạc, hàng đợi, yêu thích
│   ├── data/
│   │   └── mockData.ts         # Mock data các bài hát, nghệ sĩ, playlist, lyric mẫu
│   ├── lib/
│   │   └── utils.ts            # Hàm tiện ích cn, formatTime, formatNumber
│   ├── types/
│   │   └── music.ts            # TypeScript interfaces & types
│   ├── App.tsx                 # Layout tổng thể và navigation stack
│   ├── main.tsx                # Entry point
│   └── index.css               # Spotify dark theme styles & animations
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

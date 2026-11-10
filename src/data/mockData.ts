import { Song, Album, Artist, Playlist, Category } from "@/types/music"

// High quality reliable audio streams
const AUDIO_SAMPLE_1 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
const AUDIO_SAMPLE_2 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
const AUDIO_SAMPLE_3 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
const AUDIO_SAMPLE_4 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
const AUDIO_SAMPLE_5 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"

export interface RadioStation {
  id: string
  title: string
  color: string
  artistImageUrl: string
  description: string
  songs: Song[]
}

export const MOCK_SONGS: Song[] = [
  {
    id: "song-xaxoi",
    title: "Xa Xôi (feat. Obito)",
    artist: "RPT MCK, Obito",
    artistId: "artist-mck",
    album: "99%",
    albumId: "album-99",
    duration: 217, // 3:37
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
    audioUrl: AUDIO_SAMPLE_1,
    plays: 42100800,
    isLiked: true,
    addedAt: "2 ngày trước",
    lyrics: [
      { time: 0, text: "♪ (Intro âm trầm lắng đọng) ♪" },
      { time: 10, text: "Tao chỉ như là nước thôi, mày định xiên vào đâu?" },
      { time: 20, text: "Tao chỉ nói đúng một câu, \"Em đừng đi quá xa xôi...\"" },
      { time: 30, text: "Bao nhiêu đêm thâu chỉ để đi tìm lại ký ức đã phai màu" },
      { time: 42, text: "Cơn mưa rơi ngoài hiên làm lòng anh thêm đau" },
      { time: 54, text: "Chuyện tình mình giờ đây như làn khói mờ ảo trôi về đâu..." },
    ]
  },
  {
    id: "song-doichandi",
    title: "ĐÔI CHÂN ĐI",
    artist: "Ricky Star",
    artistId: "artist-ricky",
    album: "ĐÔI CHÂN ĐI",
    albumId: "album-doichandi",
    duration: 198,
    coverUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80",
    audioUrl: AUDIO_SAMPLE_2,
    plays: 18500200,
    isLiked: true,
    addedAt: "1 tuần trước",
    lyrics: [
      { time: 0, text: "♪ (Giai điệu hip-hop đường phố bùng nổ) ♪" },
      { time: 12, text: "Đôi chân này vẫn cứ bước đi trên từng con phố quen" },
      { time: 24, text: "Không sợ gian nan, không ngại ngần chông gai bóng đêm" }
    ]
  },
  {
    id: "song-nhumotnguoitrung",
    title: "Như Một Người Rưng",
    artist: "HIEUTHUHAI",
    artistId: "artist-hieu",
    album: "Ai Cũng Phải Bắt Đầu Từ Đâu Đó",
    albumId: "album-hieu",
    duration: 215,
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80",
    audioUrl: AUDIO_SAMPLE_3,
    plays: 35120000,
    isLiked: true,
    addedAt: "3 tuần trước",
    lyrics: [
      { time: 0, text: "♪ (Trap beat êm ái mở đầu) ♪" },
      { time: 14, text: "Gặp lại em trên con phố xưa như một người rưng xa lạ" },
      { time: 28, text: "Từng lời nói ngày nào giờ đã theo gió bay xa..." }
    ]
  },
  {
    id: "song-aicungphaibatdau",
    title: "Ai Cũng Phải Bắt Đầu Từ Đâu Đó",
    artist: "HIEUTHUHAI",
    artistId: "artist-hieu",
    album: "Ai Cũng Phải Bắt Đầu Từ Đâu Đó",
    albumId: "album-hieu",
    duration: 234,
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80",
    audioUrl: AUDIO_SAMPLE_4,
    plays: 52100000,
    isLiked: true,
    addedAt: "1 tháng trước",
    lyrics: [
      { time: 0, text: "Ai cũng phải bắt đầu từ đâu đó..." },
      { time: 15, text: "Chẳng có con đường nào trải đầy hoa hồng không thử thách" }
    ]
  },
  {
    id: "song-anhbovai",
    title: "ANH BỜ VAI (Ấn Bản KIM)",
    artist: "VƯƠNG BÌNH",
    artistId: "artist-vuongbinh",
    album: "ANH BỜ VAI",
    albumId: "album-anhbovai",
    duration: 242,
    coverUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80",
    audioUrl: AUDIO_SAMPLE_5,
    plays: 14200000,
    isLiked: false,
    addedAt: "May 2024",
    lyrics: [
      { time: 0, text: "Anh bờ vai che chở em qua bao giông bão..." }
    ]
  },
  {
    id: "song-kissitbetter",
    title: "Kiss It Better Radio",
    artist: "Rihanna, Bryson Tiller",
    artistId: "artist-rihanna",
    album: "ANTI",
    albumId: "album-anti",
    duration: 253,
    coverUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&auto=format&fit=crop&q=80",
    audioUrl: AUDIO_SAMPLE_1,
    plays: 89000000,
    isLiked: false,
    addedAt: "2 tháng trước"
  },
  {
    id: "song-phonk",
    title: "phonk",
    artist: "Kordhell, DVRST",
    artistId: "artist-phonk",
    album: "Phonk Drift",
    albumId: "album-phonk",
    duration: 168,
    coverUrl: "https://images.unsplash.com/photo-1445985543469-433ecdd6294c?w=500&auto=format&fit=crop&q=80",
    audioUrl: AUDIO_SAMPLE_2,
    plays: 125000000,
    isLiked: true,
    addedAt: "3 tháng trước"
  },
  {
    id: "song-chungtadeumuon",
    title: "Chúng Ta Đều Muốn Một Thứ",
    artist: "Vũ. ft. Trang",
    artistId: "artist-vu",
    album: "Bảo Tàng Của Nuối Tiếc",
    albumId: "album-vu",
    duration: 260,
    coverUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80",
    audioUrl: AUDIO_SAMPLE_3,
    plays: 38200000,
    isLiked: false,
    addedAt: "Oct 2024"
  }
]

export const MOCK_ARTISTS: Artist[] = [
  {
    id: "artist-mck",
    name: "RPT MCK",
    avatarUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80",
    monthlyListeners: 2450300,
    verified: true,
    bio: "Nghệ sĩ rap, R&B hàng đầu với chất nhạc hiện đại, các ca khúc hit như 'Chìm Sâu', 'Tại Vì Sao', 'Xa Xôi' đạt hàng chục triệu lượt nghe.",
    topSongs: [MOCK_SONGS[0]],
    albums: []
  },
  {
    id: "artist-ricky",
    name: "Ricky Star",
    avatarUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80",
    monthlyListeners: 1210000,
    verified: true,
    bio: "Rapper miền Tây đầy hóm hỉnh và năng lượng, nổi tiếng với flow bắt tai và phong cách trình diễn độc đáo.",
    topSongs: [MOCK_SONGS[1]],
    albums: []
  },
  {
    id: "artist-hieu",
    name: "HIEUTHUHAI",
    avatarUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&auto=format&fit=crop&q=80",
    monthlyListeners: 3120000,
    verified: true,
    bio: "Rapper và ca sĩ nổi bật thế hệ Gen Z, sở hữu phong cách điển trai và hàng loạt bản hit viral toàn quốc.",
    topSongs: [MOCK_SONGS[2], MOCK_SONGS[3]],
    albums: []
  },
  {
    id: "artist-vu",
    name: "Vũ.",
    avatarUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&auto=format&fit=crop&q=80",
    monthlyListeners: 2340000,
    verified: true,
    bio: "Hoàng tử Indie Việt mang đến những bản tình ca sâu lắng chạm đến trái tim người nghe.",
    topSongs: [MOCK_SONGS[7]],
    albums: []
  },
  {
    id: "artist-sontung",
    name: "Sơn Tùng M-TP",
    avatarUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80",
    monthlyListeners: 3450000,
    verified: true,
    bio: "Nghệ sĩ định hình âm nhạc đương đại Việt Nam.",
    topSongs: [],
    albums: []
  }
]

export const MOCK_ALBUMS: Album[] = [
  {
    id: "album-99",
    title: "99%",
    artist: "RPT MCK",
    artistId: "artist-mck",
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
    releaseYear: 2023,
    colorTheme: "#4a1014",
    description: "Album đầu tay phá vỡ mọi kỷ lục nhạc số của RPT MCK.",
    songs: [MOCK_SONGS[0]]
  },
  {
    id: "album-doichandi",
    title: "ĐÔI CHÂN ĐI",
    artist: "Ricky Star",
    artistId: "artist-ricky",
    coverUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
    releaseYear: 2024,
    colorTheme: "#bc5900",
    description: "Album bùng nổ của Ricky Star mang tinh thần đường phố phóng khoáng.",
    songs: [MOCK_SONGS[1]]
  },
  {
    id: "album-hieu",
    title: "Ai Cũng Phải Bắt Đầu Từ Đâu Đó",
    artist: "HIEUTHUHAI",
    artistId: "artist-hieu",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
    releaseYear: 2023,
    colorTheme: "#e63946",
    description: "Album khẳng định vị thế và tài năng âm nhạc của HIEUTHUHAI.",
    songs: [MOCK_SONGS[2], MOCK_SONGS[3]]
  }
]

// Playlists matching the screenshot in user's Library
export const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: "pl-liked",
    title: "Liked Songs",
    description: "Các bài hát bạn đã yêu thích trên Echora.",
    coverUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80",
    owner: "Quân Thái",
    followers: 248,
    colorTheme: "#450af5",
    isPinned: true,
    songs: MOCK_SONGS
  },
  {
    id: "pl-doichandi",
    title: "ĐÔI CHÂN ĐI",
    description: "Album • Ricky Star",
    coverUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
    owner: "Ricky Star",
    colorTheme: "#bc5900",
    songs: [MOCK_SONGS[1]]
  },
  {
    id: "pl-phonk",
    title: "phonk",
    description: "Playlist • Echora",
    coverUrl: "https://images.unsplash.com/photo-1445985543469-433ecdd6294c?w=600&auto=format&fit=crop&q=80",
    owner: "Echora",
    colorTheme: "#1d3557",
    songs: [MOCK_SONGS[6]]
  },
  {
    id: "pl-anhbovai",
    title: "ANH BỜ VAI (Ấn Bản KIM)",
    description: "Album • VƯƠNG BÌNH",
    coverUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80",
    owner: "VƯƠNG BÌNH",
    colorTheme: "#503750",
    songs: [MOCK_SONGS[4]]
  },
  {
    id: "pl-aicungphai",
    title: "Ai Cũng Phải Bắt Đầu Từ Đâu Đó",
    description: "Album • HIEUTHUHAI",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
    owner: "HIEUTHUHAI",
    colorTheme: "#d84000",
    songs: [MOCK_SONGS[2], MOCK_SONGS[3]]
  },
  {
    id: "pl-gym",
    title: "Gym",
    description: "Playlist • Quân Thái",
    coverUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    owner: "Quân Thái",
    colorTheme: "#e76f51",
    songs: [MOCK_SONGS[0], MOCK_SONGS[1], MOCK_SONGS[6]]
  },
  {
    id: "pl-matnham",
    title: "Mắt Nhắm Mắt Mở",
    description: "Album • HIEUTHUHAI",
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80",
    owner: "HIEUTHUHAI",
    colorTheme: "#2b2d42",
    songs: [MOCK_SONGS[2]]
  },
  {
    id: "pl-chill",
    title: "Chill",
    description: "Playlist • Quân Thái",
    coverUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80",
    owner: "Quân Thái",
    colorTheme: "#6b705c",
    songs: [MOCK_SONGS[7]]
  },
  {
    id: "pl-arirang",
    title: "ARIRANG",
    description: "Album • BTS",
    coverUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=600&auto=format&fit=crop&q=80",
    owner: "BTS",
    colorTheme: "#8d67ab",
    songs: [MOCK_SONGS[5]]
  },
  {
    id: "pl-locket",
    title: "locket",
    description: "Album • Madison Beer",
    coverUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80",
    owner: "Madison Beer",
    colorTheme: "#3a506b",
    songs: [MOCK_SONGS[5]]
  },
  {
    id: "pl-mymusic",
    title: "My music",
    description: "Playlist • Quân Thái",
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
    owner: "Quân Thái",
    colorTheme: "#1db954",
    songs: MOCK_SONGS
  }
]

// The exact Radio Cards from user's screenshot
export const RECOMMENDED_STATIONS: RadioStation[] = [
  {
    id: "radio-bye-slowed",
    title: "bye - slowed",
    color: "#e2b6cf", // pastel pink
    artistImageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80",
    description: "With Altare, Altare.alt, Vanna Rainello and more",
    songs: [MOCK_SONGS[6]]
  },
  {
    id: "radio-mck",
    title: "RPT MCK",
    color: "#a8e6cf", // pastel mint green
    artistImageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80",
    description: "With Low G, Wxrdie, Dangrangto and more",
    songs: [MOCK_SONGS[0]]
  },
  {
    id: "radio-lilwuyn",
    title: "Lil Wuyn",
    color: "#98eed0", // seafoam
    artistImageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&auto=format&fit=crop&q=80",
    description: "With 16 Typh, Wxrdie, Obito and more",
    songs: [MOCK_SONGS[1]]
  },
  {
    id: "radio-justin",
    title: "Justin Bieber",
    color: "#88d8b0", // turquoise/teal
    artistImageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80",
    description: "With Bruno Mars, Ed Sheeran, Maroon 5 and...",
    songs: [MOCK_SONGS[5]]
  },
  {
    id: "radio-lowg",
    title: "Low G",
    color: "#ffd3b6", // warm tan
    artistImageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=80",
    description: "With RPT MCK, tlinh, Madihu and more",
    songs: [MOCK_SONGS[0]]
  },
  {
    id: "radio-orange",
    title: "Orange",
    color: "#ffaaa5", // coral
    artistImageUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=80",
    description: "With Hoàng Dũng, Vũ., tlinh and more",
    songs: [MOCK_SONGS[7]]
  }
]

export const POPULAR_RADIO: RadioStation[] = [
  {
    id: "pop-dangrangto",
    title: "Dangrangto",
    color: "#99b898",
    artistImageUrl: "https://images.unsplash.com/photo-1445985543469-433ecdd6294c?w=300&auto=format&fit=crop&q=80",
    description: "With HIEUTHUHAI, GREY D, Obito and more",
    songs: [MOCK_SONGS[0]]
  },
  {
    id: "pop-buitruonglinh",
    title: "buitruonglinh",
    color: "#b0e0e6",
    artistImageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80",
    description: "With Vũ., Dat Ail, WIN and more",
    songs: [MOCK_SONGS[7]]
  },
  {
    id: "pop-haanhtuan",
    title: "Hà Anh Tuấn",
    color: "#dda0dd",
    artistImageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=80",
    description: "With Bùi Anh Tuấn, Vũ., Phan Mạnh Quỳnh and...",
    songs: [MOCK_SONGS[7]]
  },
  {
    id: "pop-obito",
    title: "Obito",
    color: "#d8bfd8",
    artistImageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80",
    description: "With RPT MCK, Low G, Shiki and more",
    songs: [MOCK_SONGS[0]]
  },
  {
    id: "pop-sontung",
    title: "Sơn Tùng M-TP",
    color: "#f4a261",
    artistImageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80",
    description: "With JustaTee, Da LAB, HIEUTHUHAI and more",
    songs: [MOCK_SONGS[0]]
  },
  {
    id: "pop-vu",
    title: "Vũ.",
    color: "#e9c46a",
    artistImageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80",
    description: "With Vũ Cát Tường, Trang, Da LAB, Chillies and more",
    songs: [MOCK_SONGS[7]]
  }
]

export const MOCK_CATEGORIES: Category[] = [
  { id: "cat-1", title: "Nhạc Mới", color: "#e13300", imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80" },
  { id: "cat-2", title: "V-Pop", color: "#1e3264", imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80" },
  { id: "cat-3", title: "Pop", color: "#8d67ab", imageUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&auto=format&fit=crop&q=80" },
  { id: "cat-4", title: "Hip-Hop", color: "#bc5900", imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80" },
  { id: "cat-5", title: "Indie", color: "#e91429", imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=80" },
  { id: "cat-6", title: "Thư Giãn", color: "#0d73ec", imageUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=80" },
]

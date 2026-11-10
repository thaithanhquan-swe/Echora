import { Song, Album, Artist, Playlist, Category } from "@/types/music"

// High quality audio samples that are fast and reliable to stream
const SAMPLE_AUDIO_1 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
const SAMPLE_AUDIO_2 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
const SAMPLE_AUDIO_3 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
const SAMPLE_AUDIO_4 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
const SAMPLE_AUDIO_5 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
const SAMPLE_AUDIO_6 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
const SAMPLE_AUDIO_7 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"
const SAMPLE_AUDIO_8 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3"

export const MOCK_SONGS: Song[] = [
  {
    id: "song-1",
    title: "Đừng Làm Trái Tim Anh Đau",
    artist: "Sơn Tùng M-TP",
    artistId: "artist-1",
    album: "Đừng Làm Trái Tim Anh Đau",
    albumId: "album-1",
    duration: 312,
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
    audioUrl: SAMPLE_AUDIO_1,
    plays: 84290142,
    isLiked: true,
    addedAt: "2 days ago",
    lyrics: [
      { time: 0, text: "♪ (Giai điệu vui tươi mở đầu) ♪" },
      { time: 12, text: "Hình như trong mắt anh, em là tia nắng mai" },
      { time: 18, text: "Dịu dàng mang ấm áp xua tan đêm dài" },
      { time: 24, text: "Nụ cười em hé môi như ngàn hoa thắm tươi" },
      { time: 30, text: "Làm cho tim anh bối rối, xuyến xao bao lời" },
      { time: 36, text: "Đừng làm trái tim anh đau..." },
      { time: 42, text: "Hãy để tình yêu ta bắt đầu từ hôm nay!" },
      { time: 48, text: "Lời thì thầm êm ái ru lòng đắm say..." },
    ]
  },
  {
    id: "song-2",
    title: "Bước Qua Nhau",
    artist: "Vũ.",
    artistId: "artist-2",
    album: "Một Vạn Năm",
    albumId: "album-2",
    duration: 257,
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80",
    audioUrl: SAMPLE_AUDIO_2,
    plays: 62140500,
    isLiked: true,
    addedAt: "1 week ago",
    lyrics: [
      { time: 0, text: "♪ (Tiếng guitar mộc mạc lắng đọng) ♪" },
      { time: 15, text: "Cuộc đời cứ trôi, ta nhìn lại ngày hôm qua" },
      { time: 22, text: "Góc phố năm nào, từng hạt mưa rơi vội vã" },
      { time: 30, text: "Bước qua nhau để lại những khoảng trống vô tận..." },
      { time: 40, text: "Từng lời hẹn thề nay trôi theo làn mây xa" }
    ]
  },
  {
    id: "song-3",
    title: "Nấu Ăn Cho Em",
    artist: "Đen Vâu ft. PiaLinh",
    artistId: "artist-3",
    album: "Nấu Ăn Cho Em",
    albumId: "album-3",
    duration: 275,
    coverUrl: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=500&auto=format&fit=crop&q=80",
    audioUrl: SAMPLE_AUDIO_3,
    plays: 95400210,
    isLiked: false,
    addedAt: "3 weeks ago",
    lyrics: [
      { time: 0, text: "♪ (Tiếng sáo và guitar thanh bình vùng cao) ♪" },
      { time: 14, text: "Mấy đứa trẻ trên non cao, ánh mắt trong veo nụ cười tươi thắm" },
      { time: 22, text: "Mang bữa cơm lành cho em thêm ấm những sớm mù sương..." },
      { time: 32, text: "Mặt trời lên từ đỉnh đồi, soi sáng con đường đến trường" }
    ]
  },
  {
    id: "song-4",
    title: "Starboy",
    artist: "The Weeknd ft. Daft Punk",
    artistId: "artist-4",
    album: "Starboy",
    albumId: "album-4",
    duration: 230,
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80",
    audioUrl: SAMPLE_AUDIO_4,
    plays: 3120400000,
    isLiked: true,
    explicit: true,
    addedAt: "May 12, 2024",
    lyrics: [
      { time: 0, text: "♪ (Intro synth wave pulsing) ♪" },
      { time: 10, text: "I'm tryna put you in the worst mood, ah" },
      { time: 15, text: "P1 cleaner than your church shoes, ah" },
      { time: 21, text: "Milli point two just to hurt you, ah" },
      { time: 26, text: "All red Lamb' just to tease you, ah" },
      { time: 31, text: "Look what you've done! I'm a motherfuckin' starboy!" }
    ]
  },
  {
    id: "song-5",
    title: "Cruel Summer",
    artist: "Taylor Swift",
    artistId: "artist-5",
    album: "Lover",
    albumId: "album-5",
    duration: 178,
    coverUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&auto=format&fit=crop&q=80",
    audioUrl: SAMPLE_AUDIO_5,
    plays: 2480000000,
    isLiked: false,
    addedAt: "Jul 18, 2024",
    lyrics: [
      { time: 0, text: "Fever dream high in the quiet of the night" },
      { time: 7, text: "You know that I caught it" },
      { time: 12, text: "Bad, bad boy, shiny toy with a price" },
      { time: 17, text: "You know that I bought it" },
      { time: 23, text: "And it's new, the shape of your body" },
      { time: 27, text: "It's blue, the feeling I've got..." },
      { time: 32, text: "And it's a cruel summer!" }
    ]
  },
  {
    id: "song-6",
    title: "Die With A Smile",
    artist: "Lady Gaga & Bruno Mars",
    artistId: "artist-6",
    album: "Die With A Smile",
    albumId: "album-6",
    duration: 251,
    coverUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80",
    audioUrl: SAMPLE_AUDIO_6,
    plays: 870420000,
    isLiked: true,
    addedAt: "Yesterday",
    lyrics: [
      { time: 0, text: "♪ (Slow soul ballad guitar chords) ♪" },
      { time: 12, text: "I, I just woke up from a dream" },
      { time: 18, text: "Where you and I had to say goodbye" },
      { time: 24, text: "And I don't know what it all means" },
      { time: 30, text: "If the world was ending, I'd wanna be next to you" },
      { time: 38, text: "If the party was over and our time on Earth was through..." },
      { time: 48, text: "I'd wanna hold you just for a while and die with a smile" }
    ]
  },
  {
    id: "song-7",
    title: "BIRDS OF A FEATHER",
    artist: "Billie Eilish",
    artistId: "artist-7",
    album: "HIT ME HARD AND SOFT",
    albumId: "album-7",
    duration: 196,
    coverUrl: "https://images.unsplash.com/photo-1445985543469-433ecdd6294c?w=500&auto=format&fit=crop&q=80",
    audioUrl: SAMPLE_AUDIO_7,
    plays: 1350000000,
    isLiked: true,
    addedAt: "3 days ago",
    lyrics: [
      { time: 0, text: "I want you to stay 'til I'm in the grave" },
      { time: 7, text: "'Til I'm rotting away, dead and buried" },
      { time: 14, text: "'Til I'm in the casket you carry" },
      { time: 20, text: "If you go, I'm going too, uh" },
      { time: 27, text: "'Cause it was always you" },
      { time: 33, text: "And if I'm turning blue, please don't save me" }
    ]
  },
  {
    id: "song-8",
    title: "Nàng Thơ",
    artist: "Hoàng Dũng",
    artistId: "artist-8",
    album: "25",
    albumId: "album-8",
    duration: 254,
    coverUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80",
    audioUrl: SAMPLE_AUDIO_8,
    plays: 78500200,
    isLiked: false,
    addedAt: "Oct 15, 2024",
    lyrics: [
      { time: 0, text: "Em, ngày em đánh rơi nụ cười vào anh" },
      { time: 8, text: "Có nghĩ sau này em sẽ chờ?" },
      { time: 14, text: "Và anh, ngày anh đánh rơi nụ cười vào em" },
      { time: 22, text: "Có nghĩ thêm một lần trao gửi?" },
      { time: 30, text: "Em là nàng thơ, khơi nguồn câu hát anh viết..." }
    ]
  }
]

export const MOCK_ARTISTS: Artist[] = [
  {
    id: "artist-1",
    name: "Sơn Tùng M-TP",
    avatarUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80",
    monthlyListeners: 3410500,
    verified: true,
    bio: "Sơn Tùng M-TP là ca sĩ, nhạc sĩ và nhà sản xuất âm nhạc hàng đầu Việt Nam. Tên tuổi của anh gắn liền với hàng loạt siêu hit đình đám định hình âm nhạc đương đại.",
    topSongs: [MOCK_SONGS[0]],
    albums: []
  },
  {
    id: "artist-2",
    name: "Vũ.",
    avatarUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1600&auto=format&fit=crop&q=80",
    monthlyListeners: 2150300,
    verified: true,
    bio: "'Hoàng tử Indie Việt' với chất giọng trầm ấm đặc trưng, mang đến những bản ballad đậm chất tự sự và rung động hàng triệu con tim.",
    topSongs: [MOCK_SONGS[1]],
    albums: []
  },
  {
    id: "artist-3",
    name: "Đen Vâu",
    avatarUrl: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=400&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=1600&auto=format&fit=crop&q=80",
    monthlyListeners: 2980000,
    verified: true,
    bio: "Rapper mộc mạc, gần gũi với lời rap giàu triết lý cuộc sống và những ca từ chữa lành tâm hồn người nghe qua từng câu chữ giản dị.",
    topSongs: [MOCK_SONGS[2]],
    albums: []
  },
  {
    id: "artist-4",
    name: "The Weeknd",
    avatarUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1600&auto=format&fit=crop&q=80",
    monthlyListeners: 108420000,
    verified: true,
    bio: "Abel Makkonen Tesfaye, known professionally as The Weeknd, is a Canadian singer-songwriter and record producer celebrated for his sonic versatility and dark lyricism.",
    topSongs: [MOCK_SONGS[3]],
    albums: []
  },
  {
    id: "artist-5",
    name: "Taylor Swift",
    avatarUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=1600&auto=format&fit=crop&q=80",
    monthlyListeners: 99400000,
    verified: true,
    bio: "Global pop icon and 14-time Grammy Award winner, one of the best-selling music artists of all time with groundbreaking eras and world tours.",
    topSongs: [MOCK_SONGS[4]],
    albums: []
  },
  {
    id: "artist-6",
    name: "Bruno Mars",
    avatarUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=1600&auto=format&fit=crop&q=80",
    monthlyListeners: 114500000,
    verified: true,
    bio: "American singer-songwriter, multi-instrumentalist, record producer, and dancer known for his stage performances, retro showmanship, and versatility.",
    topSongs: [MOCK_SONGS[5]],
    albums: []
  },
  {
    id: "artist-7",
    name: "Billie Eilish",
    avatarUrl: "https://images.unsplash.com/photo-1445985543469-433ecdd6294c?w=400&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1445985543469-433ecdd6294c?w=1600&auto=format&fit=crop&q=80",
    monthlyListeners: 102300000,
    verified: true,
    bio: "Acclaimed singer-songwriter who first gained public attention with 'Ocean Eyes', defining a generation's sound with intimate vocals and genre-blending beats.",
    topSongs: [MOCK_SONGS[6]],
    albums: []
  },
  {
    id: "artist-8",
    name: "Hoàng Dũng",
    avatarUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1600&auto=format&fit=crop&q=80",
    monthlyListeners: 1650000,
    verified: true,
    bio: "Tác giả của những bản tình ca mượt mà, ngọt ngào và đầy rung động, nổi danh qua những buổi hòa nhạc cháy vé như 'Yên Concert'.",
    topSongs: [MOCK_SONGS[7]],
    albums: []
  }
]

export const MOCK_ALBUMS: Album[] = [
  {
    id: "album-1",
    title: "Đừng Làm Trái Tim Anh Đau",
    artist: "Sơn Tùng M-TP",
    artistId: "artist-1",
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
    releaseYear: 2024,
    colorTheme: "#ff4d6d",
    description: "Đĩa đơn mở đường cho kỷ nguyên mới đầy ngọt ngào và năng lượng tích cực từ Sơn Tùng M-TP.",
    songs: [MOCK_SONGS[0]]
  },
  {
    id: "album-2",
    title: "Một Vạn Năm",
    artist: "Vũ.",
    artistId: "artist-2",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
    releaseYear: 2022,
    colorTheme: "#3a506b",
    description: "Album phòng thu thứ hai ghi dấu hành trình âm nhạc sâu lắng, đầy chiêm nghiệm của Vũ.",
    songs: [MOCK_SONGS[1]]
  },
  {
    id: "album-4",
    title: "Starboy",
    artist: "The Weeknd",
    artistId: "artist-4",
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80",
    releaseYear: 2016,
    colorTheme: "#e63946",
    description: "The third studio album featuring blockbuster collaborations with Daft Punk, Lana Del Rey, and Kendrick Lamar.",
    songs: [MOCK_SONGS[3]]
  },
  {
    id: "album-7",
    title: "HIT ME HARD AND SOFT",
    artist: "Billie Eilish",
    artistId: "artist-7",
    coverUrl: "https://images.unsplash.com/photo-1445985543469-433ecdd6294c?w=600&auto=format&fit=crop&q=80",
    releaseYear: 2024,
    colorTheme: "#1d3557",
    description: "Billie Eilish's third studio album, a cohesive journey from vulnerability to explosive cinematic pop.",
    songs: [MOCK_SONGS[6]]
  }
]

export const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: "playlist-1",
    title: "Top 50 - Việt Nam",
    description: "Bảng xếp hạng những ca khúc được nghe nhiều nhất mỗi ngày tại Việt Nam.",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
    owner: "Spotify",
    followers: 890450,
    colorTheme: "#1db954",
    isPinned: true,
    songs: [MOCK_SONGS[0], MOCK_SONGS[1], MOCK_SONGS[2], MOCK_SONGS[5], MOCK_SONGS[7]]
  },
  {
    id: "playlist-2",
    title: "Today's Top Hits",
    description: "Lady Gaga & Bruno Mars are on top of the Hottest 50! Cover: Die With A Smile",
    coverUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80",
    owner: "Spotify",
    followers: 34120000,
    colorTheme: "#457b9d",
    isPinned: true,
    songs: [MOCK_SONGS[5], MOCK_SONGS[6], MOCK_SONGS[4], MOCK_SONGS[3], MOCK_SONGS[0]]
  },
  {
    id: "playlist-3",
    title: "Chill Lofi V-Pop",
    description: "Giai điệu thư giãn để làm việc, học tập và tận hưởng từng khoảnh khắc bình yên.",
    coverUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80",
    owner: "Echora Curators",
    followers: 432100,
    colorTheme: "#6b705c",
    isPinned: false,
    songs: [MOCK_SONGS[1], MOCK_SONGS[2], MOCK_SONGS[7]]
  },
  {
    id: "playlist-4",
    title: "V-Pop Không Thể Thiếu",
    description: "Những bản hit đình đám nhất của nhạc Việt đương đại mà bạn không thể bỏ lỡ.",
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
    owner: "Spotify",
    followers: 654200,
    colorTheme: "#e76f51",
    isPinned: false,
    songs: [MOCK_SONGS[0], MOCK_SONGS[2], MOCK_SONGS[7], MOCK_SONGS[1]]
  },
  {
    id: "playlist-5",
    title: "Global Workout Bangers",
    description: "Nạp đầy năng lượng cùng những giai điệu bùng nổ, thúc đẩy mọi giới hạn bản thân.",
    coverUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    owner: "Echora Fitness",
    followers: 1250000,
    colorTheme: "#f4a261",
    isPinned: false,
    songs: [MOCK_SONGS[3], MOCK_SONGS[4], MOCK_SONGS[0]]
  },
  {
    id: "playlist-6",
    title: "Midnight Drive",
    description: "Night synth, dark pop and atmospheric tracks for late night journeys.",
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80",
    owner: "Quant",
    followers: 840,
    colorTheme: "#2b2d42",
    isCustom: true,
    songs: [MOCK_SONGS[3], MOCK_SONGS[6], MOCK_SONGS[4]]
  }
]

export const MOCK_CATEGORIES: Category[] = [
  { id: "cat-1", title: "Nhạc Mới", color: "#e13300", imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80" },
  { id: "cat-2", title: "V-Pop", color: "#1e3264", imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80" },
  { id: "cat-3", title: "Pop", color: "#8d67ab", imageUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&auto=format&fit=crop&q=80" },
  { id: "cat-4", title: "Hip-Hop", color: "#bc5900", imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80" },
  { id: "cat-5", title: "Indie", color: "#e91429", imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=80" },
  { id: "cat-6", title: "Thư Giãn", color: "#0d73ec", imageUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=80" },
  { id: "cat-7", title: "Tập Luyện", color: "#777777", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&auto=format&fit=crop&q=80" },
  { id: "cat-8", title: "Tập Trung", color: "#503750", imageUrl: "https://images.unsplash.com/photo-1445985543469-433ecdd6294c?w=300&auto=format&fit=crop&q=80" },
  { id: "cat-9", title: "K-Pop", color: "#148a08", imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&auto=format&fit=crop&q=80" },
  { id: "cat-10", title: "Rock", color: "#d84000", imageUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&auto=format&fit=crop&q=80" },
  { id: "cat-11", title: "Tâm Trạng", color: "#8c1932", imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80" },
  { id: "cat-12", title: "Ngủ Ngon", color: "#1e3264", imageUrl: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=300&auto=format&fit=crop&q=80" }
]

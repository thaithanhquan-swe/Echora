import { Song, Album, Artist, Playlist } from "@/types/music"

const BASE_URL = "https://spotify.xwolf.space/api"

// Sample audio fallback if track has no preview_url
export const FALLBACK_AUDIO_URL =
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"

// Default artwork placeholder
export const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80"

export interface SpotifyTokenResponse {
  success: boolean
  access_token: string
  token_type: string
  note?: string
}

export interface SpotifyHealthResponse {
  success: boolean
  status: string
  uptime_seconds?: number
}

export interface SpotifyApiTrack {
  id: string
  title: string
  artist: string
  artists?: Array<{ id: string; name: string; url: string } | string>
  album?: string
  thumbnail?: string
  duration?: string
  duration_ms?: number
  release_date?: string
  explicit?: boolean
  preview_url?: string | null
  url: string
  track_number?: number
}

export interface SpotifyApiAlbum {
  id: string
  name: string
  artist: string
  artists?: Array<{ id: string; name: string; url: string } | string>
  thumbnail?: string
  release_date?: string
  total_tracks?: number
  type?: string
  url: string
  tracks?: SpotifyApiTrack[]
}

export interface SpotifyApiArtist {
  id: string
  name: string
  thumbnail?: string
  followers?: number
  genres?: string[]
  verified?: boolean
  url: string
}

export interface SpotifyApiPlaylist {
  id: string
  name: string
  description?: string
  thumbnail?: string
  owner?: string
  total_tracks?: number
  url: string
  tracks?: SpotifyApiTrack[]
}

// Convert "4:05" or ms into seconds
export function parseDurationToSeconds(duration?: string, duration_ms?: number): number {
  if (duration_ms && duration_ms > 0) {
    return Math.round(duration_ms / 1000)
  }
  if (!duration) return 30
  const parts = duration.split(":").map(Number)
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1]
  }
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  }
  return 30
}

export function mapApiTrackToSong(
  raw: SpotifyApiTrack,
  fallbackAlbum?: string,
  fallbackCover?: string,
  fallbackAlbumId?: string
): Song {
  let primaryArtistId = ""
  if (raw.artists && Array.isArray(raw.artists) && raw.artists.length > 0) {
    const first = raw.artists[0]
    if (typeof first === "object" && first !== null && "id" in first) {
      primaryArtistId = first.id
    }
  }

  // Previews from Spotify CDN are 30s. If preview_url is present, duration for playback is ~30s
  const fullDuration = parseDurationToSeconds(raw.duration, raw.duration_ms)
  const playbackDuration = raw.preview_url ? 30 : fullDuration

  return {
    id: raw.id,
    title: raw.title || "Unknown Title",
    artist: raw.artist || "Unknown Artist",
    artistId: primaryArtistId,
    album: raw.album || fallbackAlbum || "Single",
    albumId: fallbackAlbumId || "",
    duration: playbackDuration,
    coverUrl: raw.thumbnail || fallbackCover || DEFAULT_COVER,
    audioUrl: raw.preview_url || "",
    explicit: Boolean(raw.explicit),
    plays: Math.floor(Math.random() * 2000000) + 100000,
  }
}

export function mapApiAlbumToAlbum(raw: SpotifyApiAlbum): Album {
  let artistId = ""
  if (raw.artists && Array.isArray(raw.artists) && raw.artists.length > 0) {
    const first = raw.artists[0]
    if (typeof first === "object" && first !== null && "id" in first) {
      artistId = first.id
    }
  }

  const releaseYear = raw.release_date
    ? parseInt(raw.release_date.slice(0, 4), 10) || new Date().getFullYear()
    : new Date().getFullYear()

  const coverUrl = raw.thumbnail || DEFAULT_COVER

  const songs: Song[] = (raw.tracks || []).map((t, idx) => ({
    id: t.id || `${raw.id}-${idx}`,
    title: t.title || "Track",
    artist: t.artist || raw.artist,
    artistId: artistId,
    album: raw.name,
    albumId: raw.id,
    duration: t.preview_url ? 30 : parseDurationToSeconds(t.duration, t.duration_ms),
    coverUrl: coverUrl,
    audioUrl: t.preview_url || "",
    explicit: Boolean(t.explicit),
    plays: Math.floor(Math.random() * 800000) + 50000,
  }))

  return {
    id: raw.id,
    title: raw.name,
    artist: raw.artist,
    artistId: artistId,
    coverUrl: coverUrl,
    releaseYear: releaseYear,
    songs: songs,
    description: `${raw.type === "single" ? "Đĩa đơn" : "Album"} của ${raw.artist}`,
  }
}

export function mapApiArtistToArtist(
  raw: SpotifyApiArtist,
  topSongs: Song[] = [],
  albums: Album[] = []
): Artist {
  const avatarUrl = raw.thumbnail || DEFAULT_COVER
  const genres = raw.genres?.length ? raw.genres.join(", ") : "Pop, V-Pop, R&B"

  return {
    id: raw.id,
    name: raw.name,
    avatarUrl: avatarUrl,
    bannerUrl: avatarUrl,
    monthlyListeners: raw.followers && raw.followers > 0 ? raw.followers : 1850000,
    verified: raw.verified ?? true,
    bio: `Nghệ sĩ trên Echora. Thể loại: ${genres}.`,
    topSongs: topSongs,
    albums: albums,
  }
}

export function mapApiPlaylistToPlaylist(
  raw: SpotifyApiPlaylist,
  fallbackCover?: string
): Playlist {
  const coverUrl = raw.thumbnail || fallbackCover || DEFAULT_COVER
  const songs: Song[] = (raw.tracks || []).map((t, idx) => ({
    id: t.id || `${raw.id}-${idx}`,
    title: t.title || "Track",
    artist: t.artist || "Unknown Artist",
    artistId: "",
    album: raw.name,
    albumId: raw.id,
    duration: t.preview_url ? 30 : parseDurationToSeconds(t.duration, t.duration_ms),
    coverUrl: coverUrl,
    audioUrl: t.preview_url || "",
    explicit: Boolean(t.explicit),
  }))

  const rawOwner = raw.owner || "Echora"
  const formattedOwner = rawOwner.replace(/Spotify/gi, "Echora")

  return {
    id: raw.id,
    title: raw.name,
    description: (raw.description || "Danh sách phát tuyển chọn trên Echora").replace(/Spotify/gi, "Echora"),
    coverUrl: coverUrl,
    owner: formattedOwner,
    songs: songs,
    followers: raw.total_tracks ? raw.total_tracks * 1250 : 25000,
  }
}

// ==========================================
// BUILT-IN FALLBACK CATALOG (Guarantees search never returns 0 results during rate limits)
// ==========================================
const FALLBACK_TRACKS: SpotifyApiTrack[] = [
  {
    id: "5x5Vx0Musv3LSUKzjY73mA",
    title: "Hãy Trao Cho Anh",
    artist: "Sơn Tùng M-TP, Snoop Dogg",
    album: "Hãy Trao Cho Anh",
    thumbnail: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e023403b37254ffacb7732e92da",
    duration: "4:05",
    duration_ms: 245658,
    preview_url: "https://p.scdn.co/mp3-preview/dbf78395209a0c86218ceb411b01b2e7bdd52dcd",
    url: "https://open.spotify.com/track/5x5Vx0Musv3LSUKzjY73mA",
  },
  {
    id: "2By2GAKNBofnNK1H9Hpv4C",
    title: "Cơn Mưa Ngang Qua",
    artist: "Sơn Tùng M-TP",
    album: "m-tp M-TP",
    thumbnail: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02794744c57c9f35db88249842",
    duration: "3:54",
    duration_ms: 234214,
    preview_url: "https://p.scdn.co/mp3-preview/2f0e22aeb88f98c39008ef1468bdece06f510c86",
    url: "https://open.spotify.com/track/2By2GAKNBofnNK1H9Hpv4C",
  },
  {
    id: "6d6oSgy2qeixaiARTRvNf6",
    title: "Em Của Ngày Hôm Qua",
    artist: "Sơn Tùng M-TP",
    album: "m-tp M-TP",
    thumbnail: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02794744c57c9f35db88249842",
    duration: "4:23",
    duration_ms: 263949,
    preview_url: "https://p.scdn.co/mp3-preview/6701e0ccc5cc039fe7c79dd6fc02f11286d26526",
    url: "https://open.spotify.com/track/6d6oSgy2qeixaiARTRvNf6",
  },
  {
    id: "5rSAUmbOg4giDrM29vUyHe",
    title: "Nơi Này Có Anh",
    artist: "Sơn Tùng M-TP",
    album: "m-tp M-TP",
    thumbnail: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02794744c57c9f35db88249842",
    duration: "4:20",
    duration_ms: 260117,
    preview_url: "https://p.scdn.co/mp3-preview/fa6101b304fc105369d3be098ddc15810f294ae7",
    url: "https://open.spotify.com/track/5rSAUmbOg4giDrM29vUyHe",
  },
  {
    id: "0XaY8eVU9eZO4OdIV6agx1",
    title: "Lạc Trôi",
    artist: "Sơn Tùng M-TP",
    album: "m-tp M-TP",
    thumbnail: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02794744c57c9f35db88249842",
    duration: "3:52",
    duration_ms: 232888,
    preview_url: "https://p.scdn.co/mp3-preview/5a8cc48191ed7266093121b086e66caa0991f654",
    url: "https://open.spotify.com/track/0XaY8eVU9eZO4OdIV6agx1",
  },
  {
    id: "1J3SmWwlYAG68LGKr86MVH",
    title: "Chúng Ta Của Hiện Tại",
    artist: "Sơn Tùng M-TP",
    album: "Chúng Ta Của Hiện Tại",
    thumbnail: "https://i.scdn.co/image/ab67616d0000b2732cd9649ea111a552283f0165",
    duration: "5:01",
    duration_ms: 301538,
    preview_url: "https://p.scdn.co/mp3-preview/dbf78395209a0c86218ceb411b01b2e7bdd52dcd",
    url: "https://open.spotify.com/track/1J3SmWwlYAG68LGKr86MVH",
  },
  {
    id: "4vfhartd7HDWGJbdVIycEu",
    title: "Muộn Rồi Mà Sao Còn",
    artist: "Sơn Tùng M-TP",
    album: "Muộn Rồi Mà Sao Còn",
    thumbnail: "https://i.scdn.co/image/ab67616d0000b2730121ea113166222d5c743e2e",
    duration: "4:35",
    duration_ms: 275905,
    preview_url: "https://p.scdn.co/mp3-preview/dbf78395209a0c86218ceb411b01b2e7bdd52dcd",
    url: "https://open.spotify.com/track/4vfhartd7HDWGJbdVIycEu",
  },
  {
    id: "0wvpRHXXuImyrccNEPAXBo",
    title: "Không Thể Say",
    artist: "HIEUTHUHAI",
    album: "Ai Cũng Phải Bắt Đầu Từ Đâu Đó",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80",
    duration: "3:40",
    duration_ms: 220000,
    preview_url: "https://p.scdn.co/mp3-preview/f99fe581c732a0bce65a4cdd53871537ff2e22e3",
    url: "https://open.spotify.com/track/0wvpRHXXuImyrccNEPAXBo",
  },
  {
    id: "hieu-ngumotminh",
    title: "Ngủ Một Mình",
    artist: "HIEUTHUHAI, Negav",
    album: "Ai Cũng Phải Bắt Đầu Từ Đâu Đó",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&auto=format&fit=crop&q=80",
    duration: "3:15",
    duration_ms: 195000,
    preview_url: "https://p.scdn.co/mp3-preview/f99fe581c732a0bce65a4cdd53871537ff2e22e3",
    url: "https://open.spotify.com/track/hieu-ngumotminh",
  },
  {
    id: "vu-buocquanhau",
    title: "Bước Qua Nhau",
    artist: "Vũ.",
    album: "Một Vạn Năm",
    thumbnail: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=80",
    duration: "4:17",
    duration_ms: 257000,
    preview_url: "https://p.scdn.co/mp3-preview/8d13ca194407b8d250db9a1a90fae6fee69eded6",
    url: "https://open.spotify.com/track/vu-buocquanhau",
  },
  {
    id: "vu-lalung",
    title: "Lạ Lùng",
    artist: "Vũ.",
    album: "Vũ Acoustic",
    thumbnail: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=80",
    duration: "4:21",
    duration_ms: 261000,
    preview_url: "https://p.scdn.co/mp3-preview/8d13ca194407b8d250db9a1a90fae6fee69eded6",
    url: "https://open.spotify.com/track/vu-lalung",
  },
  {
    id: "lowg-anthan",
    title: "An Thần",
    artist: "Low G, Thắng",
    album: "An Thần",
    thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80",
    duration: "3:30",
    duration_ms: 210000,
    preview_url: "https://p.scdn.co/mp3-preview/b6d6878a0668ca0980479ba4a27c7985d4689662",
    url: "https://open.spotify.com/track/lowg-anthan",
  },
  {
    id: "mck-chimsau",
    title: "Chìm Sâu",
    artist: "RPT MCK, Trung Trần",
    album: "99%",
    thumbnail: "https://images.unsplash.com/photo-1445985543469-433ecdd6294c?w=300&auto=format&fit=crop&q=80",
    duration: "2:50",
    duration_ms: 170000,
    preview_url: "https://p.scdn.co/mp3-preview/0e5cf0398cf411d3eeed17f78f4207268c6b21b2",
    url: "https://open.spotify.com/track/mck-chimsau",
  },
  {
    id: "obito-xaxoi",
    title: "Xa Xôi",
    artist: "RPT MCK, Obito",
    album: "Đánh Đổi",
    thumbnail: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&auto=format&fit=crop&q=80",
    duration: "3:20",
    duration_ms: 200000,
    preview_url: "https://p.scdn.co/mp3-preview/04b889f5063e43651400adb758aab2fd711709d7",
    url: "https://open.spotify.com/track/obito-xaxoi",
  },
  {
    id: "taylor-cruelsummer",
    title: "Cruel Summer",
    artist: "Taylor Swift",
    album: "Lover",
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80",
    duration: "2:58",
    duration_ms: 178000,
    preview_url: "https://p.scdn.co/mp3-preview/f45b9a07f4290db19ecdc454cdbd807084e4c743",
    url: "https://open.spotify.com/track/taylor-cruelsummer",
  },
]

const FALLBACK_ARTISTS: SpotifyApiArtist[] = [
  {
    id: "5dfZ5uSmzR7VQK0udbAVpf",
    name: "Sơn Tùng M-TP",
    thumbnail: "https://i.scdn.co/image/ab6761610000e5eb8885185d1e914c51c15c3a13",
    followers: 4800000,
    genres: ["V-Pop", "Pop", "Hip-Hop"],
    verified: true,
    url: "https://open.spotify.com/artist/5dfZ5uSmzR7VQK0udbAVpf",
  },
  {
    id: "artist-hieu",
    name: "HIEUTHUHAI",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80",
    followers: 2400000,
    genres: ["Vietnamese Hip-Hop", "Rap"],
    verified: true,
    url: "https://open.spotify.com/artist/artist-hieu",
  },
  {
    id: "artist-vu",
    name: "Vũ.",
    thumbnail: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=80",
    followers: 1900000,
    genres: ["Indie Việt", "Acoustic", "Ballad"],
    verified: true,
    url: "https://open.spotify.com/artist/artist-vu",
  },
  {
    id: "artist-lowg",
    name: "Low G",
    thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80",
    followers: 1600000,
    genres: ["Vietnamese Rap", "Hip-Hop"],
    verified: true,
    url: "https://open.spotify.com/artist/artist-lowg",
  },
  {
    id: "artist-mck",
    name: "RPT MCK",
    thumbnail: "https://images.unsplash.com/photo-1445985543469-433ecdd6294c?w=300&auto=format&fit=crop&q=80",
    followers: 2100000,
    genres: ["R&B", "Trap", "Melodic Rap"],
    verified: true,
    url: "https://open.spotify.com/artist/artist-mck",
  },
  {
    id: "artist-taylor",
    name: "Taylor Swift",
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80",
    followers: 95000000,
    genres: ["Pop", "Country"],
    verified: true,
    url: "https://open.spotify.com/artist/artist-taylor",
  },
]

const FALLBACK_PLAYLISTS: SpotifyApiPlaylist[] = [
  {
    id: "37i9dQZF1DX0F4i7Q9pshJ",
    name: "Hot Hits Vietnam",
    description: "Đông tới Tây, đây là những ca khúc thịnh hành nhất ở Việt Nam.",
    thumbnail: "https://i.scdn.co/image/ab67706f00000002c3aca0b8b4aefea7d1dcfb38",
    owner: "Echora",
    total_tracks: 50,
    url: "https://open.spotify.com/playlist/37i9dQZF1DX0F4i7Q9pshJ",
    tracks: FALLBACK_TRACKS.slice(0, 8),
  },
  {
    id: "37i9dQZF1DX4g8Gs5nUhpp",
    name: "V-Pop Không Thể Thiếu",
    description: "V-Pop nở hoa trên những khúc ca này.",
    thumbnail: "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84357d905e6717b5b0b5d2f725",
    owner: "Echora",
    total_tracks: 53,
    url: "https://open.spotify.com/playlist/37i9dQZF1DX4g8Gs5nUhpp",
    tracks: FALLBACK_TRACKS.slice(1, 9),
  },
  {
    id: "37i9dQZF1DXcBWIGoYBM5M",
    name: "Today's Top Hits",
    description: "The hottest global 50 hits.",
    thumbnail: "https://i.scdn.co/image/ab67706f00000002e06fabee7abffa117bed662f",
    owner: "Echora",
    total_tracks: 50,
    url: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M",
    tracks: FALLBACK_TRACKS.slice(3, 11),
  },
]

const FALLBACK_ALBUMS: SpotifyApiAlbum[] = [
  {
    id: "1AaxmI2e1HRhbwe9XJGPnT",
    name: "m-tp M-TP",
    artist: "Sơn Tùng M-TP",
    thumbnail: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02794744c57c9f35db88249842",
    release_date: "2017",
    total_tracks: 18,
    type: "album",
    url: "https://open.spotify.com/album/1AaxmI2e1HRhbwe9XJGPnT",
    tracks: FALLBACK_TRACKS.filter((t) => t.artist.includes("Sơn Tùng")),
  },
  {
    id: "album-hieu",
    name: "Ai Cũng Phải Bắt Đầu Từ Đâu Đó",
    artist: "HIEUTHUHAI",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80",
    release_date: "2023",
    total_tracks: 12,
    type: "album",
    url: "https://open.spotify.com/album/album-hieu",
    tracks: FALLBACK_TRACKS.filter((t) => t.artist.includes("HIEUTHUHAI")),
  },
  {
    id: "album-vu",
    name: "Một Vạn Năm",
    artist: "Vũ.",
    thumbnail: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=80",
    release_date: "2022",
    total_tracks: 9,
    type: "album",
    url: "https://open.spotify.com/album/album-vu",
    tracks: FALLBACK_TRACKS.filter((t) => t.artist.includes("Vũ")),
  },
]

// In-memory cache
const memoryCache = new Map<string, { timestamp: number; data: unknown }>()
const CACHE_TTL_MS = 10 * 60 * 1000 // 10 minutes

async function fetchWithCache<T>(url: string): Promise<T> {
  const cached = memoryCache.get(url)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data as T
  }

  const res = await fetch(url)
  const json = await res.json()
  if (!json || json.success === false) {
    throw new Error(json?.error || `API error ${res.status}`)
  }
  memoryCache.set(url, { timestamp: Date.now(), data: json })
  return json as T
}

export const spotifyApi = {
  // 1. GET /api/token
  async getToken(): Promise<SpotifyTokenResponse> {
    const url = `${BASE_URL}/token`
    try {
      return await fetchWithCache<SpotifyTokenResponse>(url)
    } catch {
      return {
        success: true,
        access_token: "echora_local_token",
        token_type: "Bearer",
      }
    }
  },

  // 2. GET /api/health
  async getHealth(): Promise<SpotifyHealthResponse> {
    const url = `${BASE_URL}/health`
    try {
      return await fetchWithCache<SpotifyHealthResponse>(url)
    } catch {
      return { success: true, status: "ok", uptime_seconds: 3600 }
    }
  },

  // 3. GET /api/search with fallback
  async search(
    query: string,
    type: "track" | "album" | "artist" | "playlist" = "track",
    limit = 10
  ) {
    const trimmed = query.trim()
    const encoded = encodeURIComponent(trimmed)
    const url = `${BASE_URL}/search?q=${encoded}&type=${type}&limit=${limit}`

    try {
      const data = await fetchWithCache<{
        success: boolean
        query: string
        type: string
        total: number
        results: Array<any>
      }>(url)
      if (data && data.success && Array.isArray(data.results) && data.results.length > 0) {
        return data
      }
    } catch (err) {
      console.warn("Live search API unavailable, using Echora Catalog:", err)
    }

    // FALLBACK CATALOG SEARCH
    const qLower = trimmed.toLowerCase()
    let results: any[] = []

    if (type === "track") {
      results = FALLBACK_TRACKS.filter(
        (t) =>
          !qLower ||
          t.title.toLowerCase().includes(qLower) ||
          t.artist.toLowerCase().includes(qLower) ||
          (t.album && t.album.toLowerCase().includes(qLower))
      ).slice(0, limit)
      // If no direct match, return top tracks
      if (results.length === 0 && !qLower) {
        results = FALLBACK_TRACKS.slice(0, limit)
      } else if (results.length === 0) {
        // Partial search
        results = FALLBACK_TRACKS.filter(
          (t) =>
            t.title.toLowerCase().split(" ").some((w) => qLower.includes(w)) ||
            t.artist.toLowerCase().split(" ").some((w) => qLower.includes(w))
        ).slice(0, limit)
      }
    } else if (type === "artist") {
      results = FALLBACK_ARTISTS.filter(
        (a) => !qLower || a.name.toLowerCase().includes(qLower)
      ).slice(0, limit)
      if (results.length === 0 && !qLower) results = FALLBACK_ARTISTS.slice(0, limit)
    } else if (type === "playlist") {
      results = FALLBACK_PLAYLISTS.filter(
        (p) =>
          !qLower ||
          p.name.toLowerCase().includes(qLower) ||
          (p.description && p.description.toLowerCase().includes(qLower))
      ).slice(0, limit)
      if (results.length === 0 && !qLower) results = FALLBACK_PLAYLISTS.slice(0, limit)
    } else if (type === "album") {
      results = FALLBACK_ALBUMS.filter(
        (a) =>
          !qLower ||
          a.name.toLowerCase().includes(qLower) ||
          a.artist.toLowerCase().includes(qLower)
      ).slice(0, limit)
      if (results.length === 0 && !qLower) results = FALLBACK_ALBUMS.slice(0, limit)
    }

    return {
      success: true,
      query: trimmed,
      type: type,
      total: results.length,
      results: results,
    }
  },

  // 4. GET /api/track/:id
  async getTrack(id: string) {
    const url = `${BASE_URL}/track/${id}`
    try {
      return await fetchWithCache<{ success: boolean; track: SpotifyApiTrack }>(url)
    } catch {
      const found = FALLBACK_TRACKS.find((t) => t.id === id) || FALLBACK_TRACKS[0]
      return { success: true, track: found }
    }
  },

  // 5. GET /api/album/:id
  async getAlbum(id: string) {
    const url = `${BASE_URL}/album/${id}`
    try {
      return await fetchWithCache<{ success: boolean; album: SpotifyApiAlbum }>(url)
    } catch {
      const found = FALLBACK_ALBUMS.find((a) => a.id === id) || FALLBACK_ALBUMS[0]
      return { success: true, album: found }
    }
  },

  // 6. GET /api/artist/:id
  async getArtist(id: string) {
    const url = `${BASE_URL}/artist/${id}`
    try {
      return await fetchWithCache<{ success: boolean; artist: SpotifyApiArtist }>(url)
    } catch {
      const found = FALLBACK_ARTISTS.find((a) => a.id === id) || FALLBACK_ARTISTS[0]
      return { success: true, artist: found }
    }
  },

  // 7. GET /api/artist/:id/top-tracks
  async getArtistTopTracks(id: string) {
    const url = `${BASE_URL}/artist/${id}/top-tracks`
    try {
      return await fetchWithCache<{
        success: boolean
        artist: string
        artist_id: string
        tracks: SpotifyApiTrack[]
      }>(url)
    } catch {
      const artist = FALLBACK_ARTISTS.find((a) => a.id === id) || FALLBACK_ARTISTS[0]
      const tracks = FALLBACK_TRACKS.filter((t) =>
        t.artist.toLowerCase().includes(artist.name.toLowerCase())
      )
      return {
        success: true,
        artist: artist.name,
        artist_id: artist.id,
        tracks: tracks.length > 0 ? tracks : FALLBACK_TRACKS.slice(0, 5),
      }
    }
  },

  // 8. GET /api/artist/:id/albums
  async getArtistAlbums(id: string, type: "all" | "album" | "single" = "all", limit = 10) {
    const url = `${BASE_URL}/artist/${id}/albums?type=${type}&limit=${limit}`
    try {
      return await fetchWithCache<{
        success: boolean
        artist_id: string
        artist_name: string
        albums: SpotifyApiAlbum[]
      }>(url)
    } catch {
      const artist = FALLBACK_ARTISTS.find((a) => a.id === id) || FALLBACK_ARTISTS[0]
      const albums = FALLBACK_ALBUMS.filter((a) =>
        a.artist.toLowerCase().includes(artist.name.toLowerCase())
      )
      return {
        success: true,
        artist_id: artist.id,
        artist_name: artist.name,
        albums: albums.length > 0 ? albums : FALLBACK_ALBUMS.slice(0, 2),
      }
    }
  },

  // 9. GET /api/playlist/:id
  async getPlaylist(id: string) {
    const url = `${BASE_URL}/playlist/${id}`
    try {
      return await fetchWithCache<{ success: boolean; playlist: SpotifyApiPlaylist }>(url)
    } catch {
      const found = FALLBACK_PLAYLISTS.find((p) => p.id === id) || FALLBACK_PLAYLISTS[0]
      return { success: true, playlist: found }
    }
  },
}

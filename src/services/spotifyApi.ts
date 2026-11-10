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
  if (!duration) return 180
  const parts = duration.split(":").map(Number)
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1]
  }
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  }
  return 180
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

  return {
    id: raw.id,
    title: raw.title || "Unknown Title",
    artist: raw.artist || "Unknown Artist",
    artistId: primaryArtistId,
    album: raw.album || fallbackAlbum || "Single",
    albumId: fallbackAlbumId || "",
    duration: parseDurationToSeconds(raw.duration, raw.duration_ms),
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
    duration: parseDurationToSeconds(t.duration, t.duration_ms),
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
    duration: parseDurationToSeconds(t.duration, t.duration_ms),
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

// In-memory cache to avoid redundant network requests
const memoryCache = new Map<string, { timestamp: number; data: unknown }>()
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

async function fetchWithCache<T>(url: string): Promise<T> {
  const cached = memoryCache.get(url)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data as T
  }

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`)
  }
  const json = await res.json()
  memoryCache.set(url, { timestamp: Date.now(), data: json })
  return json as T
}

export const spotifyApi = {
  // 1. GET /api/token - Fetch live access token
  async getToken(): Promise<SpotifyTokenResponse> {
    const url = `${BASE_URL}/token`
    return fetchWithCache<SpotifyTokenResponse>(url)
  },

  // 2. GET /api/health - Check API health and uptime
  async getHealth(): Promise<SpotifyHealthResponse> {
    const url = `${BASE_URL}/health`
    return fetchWithCache<SpotifyHealthResponse>(url)
  },

  // 3. GET /api/search - Search tracks, albums, artists, or playlists
  async search(
    query: string,
    type: "track" | "album" | "artist" | "playlist" = "track",
    limit = 10
  ) {
    const encoded = encodeURIComponent(query.trim())
    const url = `${BASE_URL}/search?q=${encoded}&type=${type}&limit=${limit}`
    return fetchWithCache<{
      success: boolean
      query: string
      type: string
      total: number
      results: Array<any>
    }>(url)
  },

  // 4. GET /api/track/:id - Fetch track metadata + preview_url
  async getTrack(id: string) {
    const url = `${BASE_URL}/track/${id}`
    return fetchWithCache<{
      success: boolean
      track: SpotifyApiTrack
    }>(url)
  },

  // 5. GET /api/album/:id - Fetch album metadata + tracklist
  async getAlbum(id: string) {
    const url = `${BASE_URL}/album/${id}`
    return fetchWithCache<{
      success: boolean
      album: SpotifyApiAlbum
    }>(url)
  },

  // 6. GET /api/artist/:id - Fetch artist profile & metadata
  async getArtist(id: string) {
    const url = `${BASE_URL}/artist/${id}`
    return fetchWithCache<{
      success: boolean
      artist: SpotifyApiArtist
    }>(url)
  },

  // 7. GET /api/artist/:id/top-tracks - Fetch artist top tracks
  async getArtistTopTracks(id: string) {
    const url = `${BASE_URL}/artist/${id}/top-tracks`
    return fetchWithCache<{
      success: boolean
      artist: string
      artist_id: string
      artist_thumbnail?: string
      tracks: SpotifyApiTrack[]
    }>(url)
  },

  // 8. GET /api/artist/:id/albums - Fetch artist discography
  async getArtistAlbums(id: string, type: "all" | "album" | "single" = "all", limit = 10) {
    const url = `${BASE_URL}/artist/${id}/albums?type=${type}&limit=${limit}`
    return fetchWithCache<{
      success: boolean
      artist_id: string
      artist_name: string
      albums: SpotifyApiAlbum[]
    }>(url)
  },

  // 9. GET /api/playlist/:id - Fetch playlist metadata + tracks
  async getPlaylist(id: string) {
    const url = `${BASE_URL}/playlist/${id}`
    return fetchWithCache<{
      success: boolean
      playlist: SpotifyApiPlaylist
    }>(url)
  },
}

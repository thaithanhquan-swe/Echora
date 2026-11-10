import { Song, Album, Artist, Playlist } from "@/types/music"

const BASE_URL = "https://spotify.xwolf.space/api"

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
  artist?: string
  artists?: Array<{ id: string; name: string; url?: string } | string>
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
  artist?: string
  artists?: Array<{ id: string; name: string; url?: string } | string>
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
  followers?: number
  url: string
  tracks?: SpotifyApiTrack[]
}

// Convert "4:05" or ms into seconds
export function parseDurationToSeconds(duration?: string, duration_ms?: number): number {
  if (duration_ms && duration_ms > 0) {
    return Math.round(duration_ms / 1000)
  }
  if (!duration) return 0
  const parts = duration.split(":").map(Number)
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1]
  }
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  }
  return 0
}

function getArtistNames(
  artists?: Array<{ id: string; name: string; url?: string } | string>
): string {
  return (artists || [])
    .map((artist) => typeof artist === "string" ? artist : artist.name)
    .filter(Boolean)
    .join(", ")
}

export function mapApiTrackToSong(
  raw: SpotifyApiTrack,
  fallbackAlbum?: string,
  fallbackCover?: string,
  fallbackAlbumId?: string
): Song {
  let primaryArtistId = ""
  let artists = raw.artist || "Unknown Artist"
  if (raw.artists && Array.isArray(raw.artists) && raw.artists.length > 0) {
    const first = raw.artists[0]
    if (typeof first === "object" && first !== null && "id" in first) {
      primaryArtistId = first.id
    }
    artists = getArtistNames(raw.artists) || artists
  }

  // Display the FULL song duration (e.g. 3:23, 4:05)
  const fullDuration = parseDurationToSeconds(raw.duration, raw.duration_ms)

  return {
    id: raw.id,
    title: raw.title || "Unknown Title",
    artist: artists,
    artistId: primaryArtistId,
    album: raw.album || fallbackAlbum || "Single",
    albumId: fallbackAlbumId || "",
    duration: fullDuration,
    coverUrl: raw.thumbnail || fallbackCover || DEFAULT_COVER,
    audioUrl: raw.preview_url || "",
    explicit: Boolean(raw.explicit),
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
    ? parseInt(raw.release_date.slice(0, 4), 10) || 0
    : 0

  const coverUrl = raw.thumbnail || DEFAULT_COVER
  const artistName = raw.artist || getArtistNames(raw.artists) || "Unknown Artist"

  const songs: Song[] = (raw.tracks || []).map((track) =>
    mapApiTrackToSong(track, raw.name, coverUrl, raw.id)
  )

  return {
    id: raw.id,
    title: raw.name,
    artist: artistName,
    artistId: artistId,
    coverUrl: coverUrl,
    releaseYear: releaseYear,
    songs: songs,
    description: `${raw.type === "single" ? "Đĩa đơn" : "Album"} của ${artistName}`,
  }
}

export function mapApiArtistToArtist(
  raw: SpotifyApiArtist,
  topSongs: Song[] = [],
  albums: Album[] = []
): Artist {
  const avatarUrl = raw.thumbnail || DEFAULT_COVER
  const genres = raw.genres?.length ? raw.genres.join(", ") : ""

  return {
    id: raw.id,
    name: raw.name,
    avatarUrl: avatarUrl,
    bannerUrl: avatarUrl,
    followers: raw.followers ?? 0,
    verified: raw.verified ?? false,
    bio: genres ? `Thể loại: ${genres}.` : "Hồ sơ nghệ sĩ trên Spotify.",
    topSongs: topSongs,
    albums: albums,
  }
}

export function mapApiPlaylistToPlaylist(
  raw: SpotifyApiPlaylist,
  fallbackCover?: string
): Playlist {
  const coverUrl = raw.thumbnail || fallbackCover || DEFAULT_COVER
  const songs: Song[] = (raw.tracks || []).map((track) =>
    mapApiTrackToSong(track, raw.name, coverUrl, raw.id)
  )

  const owner = raw.owner || "Spotify"

  return {
    id: raw.id,
    title: raw.name,
    description: raw.description || "",
    coverUrl: coverUrl,
    owner,
    songs: songs,
    followers: raw.followers,
  }
}

const CACHE_TTL_MS = 60_000
const memoryCache = new Map<string, { timestamp: number; data: unknown }>()

async function fetchWithCache<T>(url: string): Promise<T> {
  const cached = memoryCache.get(url)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data as T
  }

  const response = await fetch(url, { headers: { Accept: "application/json" } })
  if (!response.ok) {
    throw new Error(`Spotify API returned HTTP ${response.status}`)
  }

  const data = await response.json() as T & { success?: boolean; error?: string }
  if (!data || data.success === false) {
    throw new Error(data?.error || "Spotify API request failed")
  }

  memoryCache.set(url, { timestamp: Date.now(), data })
  return data
}

function encodeId(id: string): string {
  return encodeURIComponent(id)
}

export const spotifyApi = {
  async getToken(): Promise<SpotifyTokenResponse> {
    return fetchWithCache<SpotifyTokenResponse>(`${BASE_URL}/token`)
  },

  async getHealth(): Promise<SpotifyHealthResponse> {
    return fetchWithCache<SpotifyHealthResponse>(`${BASE_URL}/health`)
  },

  async search(
    query: string,
    type: "track" | "album" | "artist" | "playlist" = "track",
    limit = 10,
    offset = 0
  ) {
    const trimmed = query.trim()
    if (!trimmed) throw new Error("A search query is required")

    const params = new URLSearchParams({
      q: trimmed,
      type,
      limit: String(Math.min(Math.max(limit, 1), 50)),
      offset: String(Math.max(offset, 0)),
    })
    return fetchWithCache<{
      success: boolean
      query: string
      type: string
      total: number
      results: any[]
    }>(`${BASE_URL}/search?${params.toString()}`)
  },

  async getTrack(id: string) {
    return fetchWithCache<{ success: boolean; track: SpotifyApiTrack }>(
      `${BASE_URL}/track/${encodeId(id)}`
    )
  },

  async getAlbum(id: string) {
    return fetchWithCache<{ success: boolean; album: SpotifyApiAlbum }>(
      `${BASE_URL}/album/${encodeId(id)}`
    )
  },

  async getArtist(id: string) {
    return fetchWithCache<{ success: boolean; artist: SpotifyApiArtist }>(
      `${BASE_URL}/artist/${encodeId(id)}`
    )
  },

  async getArtistTopTracks(id: string) {
    return fetchWithCache<{
      success: boolean
      artist: string
      artist_id: string
      tracks: SpotifyApiTrack[]
    }>(`${BASE_URL}/artist/${encodeId(id)}/top-tracks`)
  },

  async getArtistAlbums(
    id: string,
    type: "all" | "album" | "single" = "all",
    limit = 10,
    offset = 0
  ) {
    const params = new URLSearchParams({
      type,
      limit: String(Math.min(Math.max(limit, 1), 50)),
      offset: String(Math.max(offset, 0)),
    })
    return fetchWithCache<{
      success: boolean
      artist_id: string
      artist_name: string
      albums: SpotifyApiAlbum[]
    }>(`${BASE_URL}/artist/${encodeId(id)}/albums?${params.toString()}`)
  },

  async getPlaylist(id: string) {
    return fetchWithCache<{ success: boolean; playlist: SpotifyApiPlaylist }>(
      `${BASE_URL}/playlist/${encodeId(id)}`
    )
  },
}

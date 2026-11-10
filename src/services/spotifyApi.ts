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
  album?: string | {
    id?: string
    name?: string
    thumbnail?: string
    images?: Array<{ url: string }>
  } | null
  album_id?: string
  album_thumbnail?: string
  thumbnail?: string
  images?: Array<{ url: string }>
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
  const nestedAlbum = typeof raw.album === "object" ? raw.album : undefined
  const albumName = typeof raw.album === "string" ? raw.album : nestedAlbum?.name
  const coverUrl =
    raw.thumbnail ||
    raw.album_thumbnail ||
    nestedAlbum?.thumbnail ||
    nestedAlbum?.images?.[0]?.url ||
    raw.images?.[0]?.url ||
    fallbackCover ||
    DEFAULT_COVER

  return {
    id: raw.id,
    title: raw.title || "Unknown Title",
    artist: artists,
    artistId: primaryArtistId,
    album: albumName || fallbackAlbum || "Unknown Album",
    albumId: raw.album_id || nestedAlbum?.id || fallbackAlbumId || "",
    duration: fullDuration,
    coverUrl,
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
  const songs: Song[] = (raw.tracks || []).map((track) => mapApiTrackToSong(track))

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

function trackHasAlbumArtwork(track: SpotifyApiTrack): boolean {
  const album = typeof track.album === "object" ? track.album : undefined
  return Boolean(
    track.thumbnail ||
    track.album_thumbnail ||
    album?.thumbnail ||
    album?.images?.[0]?.url ||
    track.images?.[0]?.url
  )
}

function trackHasAlbumName(track: SpotifyApiTrack): boolean {
  return Boolean(
    typeof track.album === "string"
      ? track.album
      : track.album?.name
  )
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

  async getTrendingPlaylists(limit = 12): Promise<SpotifyApiPlaylist[]> {
    const searchTerms = [
      "hot hits vietnam",
      "top vietnamese songs",
      "viral vietnamese",
      "Vietnamese",
    ]
    const responses = await Promise.all(
      searchTerms.map((query) =>
        spotifyApi.search(query, "playlist", Math.min(limit, 50)).catch(() => null)
      )
    )

    const uniquePlaylists = new Map<string, SpotifyApiPlaylist>()
    responses.forEach((response) => {
      if (!response?.success || !Array.isArray(response.results)) return
      response.results.forEach((playlist) => {
        if (playlist?.id && !uniquePlaylists.has(playlist.id)) {
          uniquePlaylists.set(playlist.id, playlist as SpotifyApiPlaylist)
        }
      })
    })

    return Array.from(uniquePlaylists.values())
      .sort((a, b) => (b.followers || 0) - (a.followers || 0))
      .slice(0, limit)
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
    const response = await fetchWithCache<{ success: boolean; playlist: SpotifyApiPlaylist }>(
      `${BASE_URL}/playlist/${encodeId(id)}`
    )

    const tracks = response.playlist.tracks || []
    const incompleteTracks = tracks
      .map((track, index) => ({ track, index }))
      .filter(({ track }) => !trackHasAlbumArtwork(track) || !trackHasAlbumName(track))

    for (let start = 0; start < incompleteTracks.length; start += 4) {
      const batch = incompleteTracks.slice(start, start + 4)
      await Promise.all(
        batch.map(async ({ track, index }) => {
          try {
            const detail = await spotifyApi.getTrack(track.id)
            if (detail.success && detail.track) {
              const detailedTrack = detail.track
              tracks[index] = {
                ...track,
                ...detailedTrack,
                album: detailedTrack.album || track.album,
                album_id: detailedTrack.album_id || track.album_id,
                album_thumbnail: detailedTrack.album_thumbnail || track.album_thumbnail,
                thumbnail: detailedTrack.thumbnail || track.thumbnail,
                images: detailedTrack.images?.length ? detailedTrack.images : track.images,
                artist: detailedTrack.artist || track.artist,
                artists: detailedTrack.artists?.length ? detailedTrack.artists : track.artists,
                title: detailedTrack.title || track.title,
                duration: detailedTrack.duration || track.duration,
                duration_ms: detailedTrack.duration_ms || track.duration_ms,
                preview_url: detailedTrack.preview_url || track.preview_url,
              }
            }
          } catch {
            // Keep the playlist track when its detail endpoint is unavailable.
          }
        })
      )
    }

    return { ...response, playlist: { ...response.playlist, tracks } }
  },
}

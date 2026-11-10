import { Song } from "@/types/music"

const AUDIUS_BASE_URL = "https://api.audius.co/v1"
const AUDIUS_APP_NAME = "Echora"

interface AudiusTrack {
  id: string | number
  track_id?: string | number
  title?: string
  duration?: number
  is_stream_gated?: boolean
  is_streamable?: boolean
  stream?: { url?: string | null }
  user?: { name?: string }
  artists?: Array<{ name?: string; artist_name?: string } | string>
  artwork?: Record<string, string | undefined>
  play_count?: number
  explicit?: boolean
}

interface AudiusResponse<T> {
  data?: T
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
}

function splitArtists(value: string): string[] {
  return value.split(/\s*(?:,|&| feat\.? | ft\.? | x )\s*/i).map(normalize).filter(Boolean)
}

function matchesSong(track: AudiusTrack, title: string, artist: string, duration: number): boolean {
  if (track.is_streamable === false || track.is_stream_gated || !track.title) return false
  if (normalize(track.title) !== normalize(title)) return false

  const expectedArtists = splitArtists(artist)
  const creditedArtists = [track.user?.name, ...(track.artists || []).map((entry) =>
    typeof entry === "string" ? entry : entry.name || entry.artist_name || ""
  )].map((name) => normalize(name || ""))
  if (!expectedArtists.some((name) => creditedArtists.includes(name))) return false

  // Reject same-title uploads with a clearly different length (e.g. edits/live versions).
  if (duration > 0 && track.duration && Math.abs(track.duration - duration) > Math.max(20, duration * 0.08)) {
    return false
  }
  return true
}

function mapAudiusTrack(track: AudiusTrack): Song | null {
  const trackId = track.track_id || track.id
  const artist = track.artists?.map((entry) =>
    typeof entry === "string" ? entry : entry.name || entry.artist_name || ""
  ).filter(Boolean).join(", ") || track.user?.name || "Unknown Artist"
  const audioUrl = `${AUDIUS_BASE_URL}/tracks/${encodeURIComponent(String(trackId))}/stream?app_name=${AUDIUS_APP_NAME}`
  if (!trackId || !track.title || track.is_streamable === false || track.is_stream_gated) return null

  return {
    id: `audius:${trackId}`,
    title: track.title,
    artist,
    artistId: "",
    album: "Audius",
    albumId: "",
    duration: track.duration || 0,
    coverUrl: track.artwork?.["480x480"] || track.artwork?.["1000x1000"] || "",
    audioUrl,
    playbackSource: "audius",
    plays: track.play_count,
    explicit: Boolean(track.explicit),
  }
}

async function fetchAudiusTracks(path: string, signal?: AbortSignal): Promise<Song[]> {
  const response = await fetch(`${AUDIUS_BASE_URL}${path}`, { signal })
  if (!response.ok) throw new Error(`Audius request failed (${response.status})`)
  const result = (await response.json()) as AudiusResponse<AudiusTrack[]>
  return (result.data || []).map(mapAudiusTrack).filter((song): song is Song => song !== null)
}

export async function searchAudiusTracks(query: string, limit = 10, signal?: AbortSignal): Promise<Song[]> {
  const params = new URLSearchParams({
    query,
    limit: String(limit),
    sort_method: "relevant",
    app_name: AUDIUS_APP_NAME,
  })
  return fetchAudiusTracks(`/tracks/search?${params}`, signal)
}

export async function getTrendingAudiusTracks(limit = 10, signal?: AbortSignal): Promise<Song[]> {
  const params = new URLSearchParams({ app_name: AUDIUS_APP_NAME, limit: String(limit) })
  return fetchAudiusTracks(`/tracks/trending?${params}`, signal)
}

export async function findAudiusTrackStream(
  title: string,
  artist: string,
  duration: number,
  signal?: AbortSignal
): Promise<string | null> {
  const query = new URLSearchParams({
    query: `${title} ${artist}`,
    limit: "10",
    sort_method: "relevant",
    app_name: AUDIUS_APP_NAME,
  })
  const response = await fetch(`${AUDIUS_BASE_URL}/tracks/search?${query}`, { signal })
  if (!response.ok) throw new Error(`Audius search failed (${response.status})`)

  const result = (await response.json()) as AudiusResponse<AudiusTrack[]>
  const match = result.data?.find((track) => matchesSong(track, title, artist, duration))
  if (!match) return null

  if (match.stream?.url) return match.stream.url
  const streamQuery = new URLSearchParams({ app_name: AUDIUS_APP_NAME })
  return `${AUDIUS_BASE_URL}/tracks/${encodeURIComponent(String(match.track_id || match.id))}/stream?${streamQuery}`
}

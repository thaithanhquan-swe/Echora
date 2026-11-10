import { Song } from "@/types/music"

const JAMENDO_API_URL = "https://api.jamendo.com/v3.0"
const CLIENT_ID = import.meta.env.VITE_JAMENDO_CLIENT_ID?.trim()

interface JamendoTrack {
  id: string
  name: string
  artist_name?: string
  duration?: number | string
  image?: string
  album_image?: string
  audio?: string
  shorturl?: string
  license_ccurl?: string
  artist_id?: string
  album_id?: string
}

interface JamendoResponse {
  headers?: { status?: string; error_message?: string }
  results?: JamendoTrack[]
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
}

function mapTrack(track: JamendoTrack): Song | null {
  if (!track.id || !track.name || !track.audio) return null
  return {
    id: `jamendo:${track.id}`,
    title: track.name,
    artist: track.artist_name || "Unknown Artist",
    artistId: track.artist_id || "",
    album: "Jamendo",
    albumId: track.album_id || "",
    duration: Number(track.duration) || 0,
    coverUrl: track.image || track.album_image || "",
    audioUrl: track.audio,
    playbackSource: "jamendo",
    sourceUrl: track.shorturl || `https://www.jamendo.com/track/${track.id}`,
  }
}

async function fetchTracks(params: URLSearchParams, signal?: AbortSignal): Promise<Song[]> {
  if (!CLIENT_ID) return []
  params.set("client_id", CLIENT_ID)
  params.set("format", "json")
  params.set("audioformat", "mp32")
  params.set("include", "licenses")
  // Echora currently uses Jamendo's non-commercial API plan. Keep playback in
  // that catalog and expose each track's license/source link in the player.
  params.set("ccnc", "true")

  const response = await fetch(`${JAMENDO_API_URL}/tracks/?${params}`, { signal })
  if (!response.ok) throw new Error(`Jamendo request failed (${response.status})`)
  const result = (await response.json()) as JamendoResponse
  if (result.headers?.status === "failed") {
    throw new Error(result.headers.error_message || "Jamendo request failed")
  }
  return (result.results || []).map(mapTrack).filter((song): song is Song => song !== null)
}

export async function searchJamendoTracks(query: string, limit = 10, signal?: AbortSignal): Promise<Song[]> {
  const params = new URLSearchParams({
    namesearch: query,
    limit: String(limit),
    order: "popularity_month_desc",
    type: "single albumtrack",
  })
  return fetchTracks(params, signal)
}

export async function getTrendingJamendoTracks(limit = 10, signal?: AbortSignal): Promise<Song[]> {
  const params = new URLSearchParams({
    limit: String(limit),
    order: "popularity_week_desc",
    type: "single albumtrack",
  })
  return fetchTracks(params, signal)
}

export async function findJamendoTrackStream(
  title: string,
  artist: string,
  duration: number,
  signal?: AbortSignal
): Promise<string | null> {
  if (!CLIENT_ID) return null
  const candidates = await searchJamendoTracks(`${title} ${artist}`, 25, signal)
  const titleKey = normalize(title)
  const artists = artist.split(/\s*(?:,|&| feat\.? | ft\.? | x )\s*/i).map(normalize).filter(Boolean)
  const match = candidates.find((song) => {
    if (normalize(song.title) !== titleKey) return false
    if (!artists.some((name) => normalize(song.artist).includes(name))) return false
    return !(duration > 0 && song.duration > 0 && Math.abs(song.duration - duration) > Math.max(20, duration * 0.08))
  })
  return match?.audioUrl || null
}

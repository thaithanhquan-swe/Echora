import { Song } from "@/types/music"

const BASE_URL = "https://api.freetouse.com/v3"

interface FreeToUseTrack {
  id?: string
  title: string
  artists?: Array<[number, { name?: string }]>
  duration?: number
  is_premium?: boolean
  files?: { mp3?: string }
  thumbnails?: { md?: string; lg?: string }
}

interface SearchResponse {
  data?: FreeToUseTrack[]
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
}

function matches(track: FreeToUseTrack, title: string, artist: string, duration: number): boolean {
  if (!track.title || track.is_premium || !track.files?.mp3) return false
  if (normalize(track.title) !== normalize(title)) return false

  const expectedArtists = artist.split(/\s*(?:,|&| feat\.? | ft\.? )\s*/i).map(normalize)
  const actualArtists = (track.artists || []).map(([, entry]) => normalize(entry?.name || ""))
  if (!expectedArtists.some((name) => actualArtists.includes(name))) return false
  if (duration > 0 && track.duration && Math.abs(track.duration - duration) > Math.max(20, duration * 0.08)) {
    return false
  }
  return true
}

function mapTrack(track: FreeToUseTrack): Song | null {
  if (!track.id || !track.title || track.is_premium || !track.files?.mp3) return null
  const artists = (track.artists || []).map(([, artist]) => artist?.name || "").filter(Boolean)
  return {
    id: `freetouse:${track.id}`,
    title: track.title,
    artist: artists.join(", ") || "Unknown Artist",
    artistId: "",
    album: "Free To Use",
    albumId: "",
    duration: track.duration || 0,
    coverUrl: track.thumbnails?.md || track.thumbnails?.lg || "",
    audioUrl: track.files.mp3,
    playbackSource: "freetouse",
  }
}

export async function searchFreeToUseTracks(query: string, limit = 10, signal?: AbortSignal): Promise<Song[]> {
  const params = new URLSearchParams({ query, limit: String(limit) })
  const response = await fetch(`${BASE_URL}/music/tracks/search?${params}`, { signal })
  if (!response.ok) throw new Error(`Free To Use search failed (${response.status})`)
  const result = (await response.json()) as SearchResponse
  return (result.data || []).map(mapTrack).filter((song): song is Song => song !== null)
}

export async function findFreeToUseStream(
  title: string,
  artist: string,
  duration: number,
  signal?: AbortSignal
): Promise<string | null> {
  const params = new URLSearchParams({ query: `${title} ${artist}`, limit: "10" })
  const response = await fetch(`${BASE_URL}/music/tracks/search?${params}`, { signal })
  if (!response.ok) throw new Error(`Free To Use search failed (${response.status})`)

  const result = (await response.json()) as SearchResponse
  return result.data?.find((track) => matches(track, title, artist, duration))?.files?.mp3 || null
}

const BASE_URL = "https://api.freetouse.com/v3"

interface FreeToUseTrack {
  title: string
  artists?: Array<[number, { name?: string }]>
  duration?: number
  is_premium?: boolean
  files?: { mp3?: string }
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

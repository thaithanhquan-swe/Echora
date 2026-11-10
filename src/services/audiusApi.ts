const AUDIUS_BASE_URL = "https://api.audius.co/v1"
const AUDIUS_APP_NAME = "Echora"

interface AudiusTrack {
  id: string
  title?: string
  duration?: number
  is_stream_gated?: boolean
  user?: { name?: string }
  artists?: Array<{ name?: string; artist_name?: string } | string>
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
  if (!track.id || track.is_stream_gated || !track.title) return false
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
  })
  const response = await fetch(`${AUDIUS_BASE_URL}/tracks/search?${query}`, { signal })
  if (!response.ok) throw new Error(`Audius search failed (${response.status})`)

  const result = (await response.json()) as AudiusResponse<AudiusTrack[]>
  const match = result.data?.find((track) => matchesSong(track, title, artist, duration))
  if (!match) return null

  const streamQuery = new URLSearchParams({ app_name: AUDIUS_APP_NAME })
  return `${AUDIUS_BASE_URL}/tracks/${encodeURIComponent(match.id)}/stream?${streamQuery}`
}

import { Song } from "@/types/music"

const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3"
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY?.trim()

interface YouTubeSearchResponse {
  items?: Array<{
    id?: { videoId?: string }
    snippet?: { title?: string; channelTitle?: string }
  }>
}

interface YouTubeVideoDetailsResponse {
  items?: Array<{ id?: string; status?: { embeddable?: boolean; madeForKids?: boolean } }>
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
}

export async function findYouTubeVideo(song: Song, signal?: AbortSignal): Promise<string | null> {
  if (!API_KEY) return null

  const query = `${song.artist} ${song.title} official`
  const params = new URLSearchParams({
    key: API_KEY,
    part: "snippet",
    q: query,
    type: "video",
    videoEmbeddable: "true",
    maxResults: "10",
    safeSearch: "none",
  })

  const response = await fetch(`${YOUTUBE_API_URL}/search?${params}`, { signal })
  if (!response.ok) throw new Error(`YouTube search failed (${response.status})`)
  const result = (await response.json()) as YouTubeSearchResponse
  const titleNeedle = normalize(song.title)
  const artistNeedle = normalize(song.artist.split(/\s*(?:,|&| feat\.? | ft\.? )\s*/i)[0] || song.artist)

  const exact = (result.items || []).find((item) => {
    const title = normalize(item.snippet?.title || "")
    const channel = normalize(item.snippet?.channelTitle || "")
    return Boolean(item.id?.videoId && title.includes(titleNeedle) && channel.includes(artistNeedle))
  })
  const videoId = exact?.id?.videoId
  if (!videoId) return null

  const detailsParams = new URLSearchParams({ key: API_KEY, part: "status", id: videoId })
  const detailsResponse = await fetch(`${YOUTUBE_API_URL}/videos?${detailsParams}`, { signal })
  if (!detailsResponse.ok) throw new Error(`YouTube video check failed (${detailsResponse.status})`)
  const details = (await detailsResponse.json()) as YouTubeVideoDetailsResponse
  const video = details.items?.[0]
  if (!video || video.status?.embeddable !== true || video.status.madeForKids === true) return null
  return videoId
}

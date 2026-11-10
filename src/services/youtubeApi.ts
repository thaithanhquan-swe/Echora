import { Song } from "@/types/music"

const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search"
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined
const VERIFIED_OFFICIAL_VIDEOS = new Map([
  [
    "come my way|son tung m tp tyga",
    "Pv8urr9RH6Y",
  ],
])

interface YouTubeSearchResponse {
  items?: Array<{
    id?: { videoId?: string }
    snippet?: { title?: string; channelTitle?: string }
  }>
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
}

function findEmbeddableMatch(items: YouTubeSearchResponse["items"], song: Song): string | null {
  const expectedTitle = normalize(song.title)
  const titleWords = expectedTitle.split(" ").filter((word) => word.length > 1)
  const mainArtist = normalize(song.artist.split(/,|&| feat\.? | ft\.? /i)[0] || "")
  const artistWords = mainArtist.split(" ").filter((word) => word.length > 1)

  const candidates = (items || []).flatMap((item) => {
    const videoId = item.id?.videoId
    const videoTitle = normalize(item.snippet?.title || "")
    const channelTitle = normalize(item.snippet?.channelTitle || "")
    if (!videoId || !videoTitle) return []

    const matchingTitleWords = titleWords.filter((word) => videoTitle.includes(word)).length
    const titleScore = titleWords.length ? matchingTitleWords / titleWords.length : 0
    const artistMatches = artistWords.filter((word) =>
      `${videoTitle} ${channelTitle}`.includes(word)
    ).length
    const artistScore = artistWords.length ? artistMatches / artistWords.length : 0

    // Require the complete title (allowing punctuation/diacritics) and a credited artist hint.
    if (titleScore < 1 || artistScore < 0.5) return []
    return [{ videoId, score: titleScore + artistScore }]
  })

  return candidates.sort((a, b) => b.score - a.score)[0]?.videoId || null
}

export async function findYouTubeVideo(song: Song, signal?: AbortSignal): Promise<string> {
  const knownOfficialVideo = VERIFIED_OFFICIAL_VIDEOS.get(
    `${normalize(song.title)}|${normalize(song.artist)}`
  )
  if (knownOfficialVideo) return knownOfficialVideo

  if (!YOUTUBE_API_KEY) {
    throw new Error("Thiếu VITE_YOUTUBE_API_KEY để tìm video YouTube trọn bài.")
  }

  const params = new URLSearchParams({
    part: "snippet",
    type: "video",
    videoEmbeddable: "true",
    maxResults: "10",
    q: `${song.title} ${song.artist} official audio`,
    key: YOUTUBE_API_KEY,
  })
  const response = await fetch(`${YOUTUBE_API_URL}?${params}`, { signal })
  if (!response.ok) throw new Error(`YouTube search failed (${response.status})`)

  const result = (await response.json()) as YouTubeSearchResponse
  const videoId = findEmbeddableMatch(result.items, song)
  if (!videoId) throw new Error("Không tìm thấy video YouTube khớp đủ chính xác để nhúng.")
  return videoId
}

import { Artist, Playlist, Song } from "@/types/music"

const API_URL = "https://www.googleapis.com/youtube/v3"
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY?.trim()
const responseCache = new Map<string, { expiresAt: number; value: unknown }>()

type Snippet = {
  title?: string
  description?: string
  channelTitle?: string
  channelId?: string
  thumbnails?: Record<string, { url?: string }>
  publishedAt?: string
}
type Video = { id?: string; snippet?: Snippet; contentDetails?: { duration?: string }; status?: { embeddable?: boolean; madeForKids?: boolean }; statistics?: { viewCount?: string } }
type SearchItem = { id?: { videoId?: string; channelId?: string; playlistId?: string }; snippet?: Snippet }

function apiKey() {
  if (!API_KEY) throw new Error("Thiếu VITE_YOUTUBE_API_KEY. Hãy thêm API key trong cấu hình môi trường.")
  return API_KEY
}

async function request<T>(endpoint: string, params: Record<string, string>, signal?: AbortSignal): Promise<T> {
  const cacheKey = `${endpoint}:${JSON.stringify(Object.entries(params).sort(([a], [b]) => a.localeCompare(b)))}`
  const cached = responseCache.get(cacheKey)
  if (cached && cached.expiresAt > Date.now()) return cached.value as T
  const query = new URLSearchParams({ ...params, key: apiKey() })
  const response = await fetch(`${API_URL}/${endpoint}?${query}`, { signal })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const reason = data?.error?.errors?.[0]?.reason
    const message = reason === "quotaExceeded" || reason === "dailyLimitExceeded"
      ? "Hệ thống âm nhạc Echora đã đạt hạn mức hôm nay."
      : data?.error?.message || `Hệ thống Echora gặp lỗi (${response.status}).`
    throw new Error(message)
  }
  responseCache.set(cacheKey, { expiresAt: Date.now() + 5 * 60_000, value: data })
  return data as T
}

function thumbnail(snippet?: Snippet) {
  const images = snippet?.thumbnails
  return images?.high?.url || images?.medium?.url || images?.default?.url || ""
}

function durationSeconds(iso = "") {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  return Number(match[1] || 0) * 3600 + Number(match[2] || 0) * 60 + Number(match[3] || 0)
}

function toSong(video: Video): Song | null {
  const id = video.id
  const snippet = video.snippet
  if (!id || !snippet) return null
  return {
    id: `youtube:${id}`,
    title: snippet.title || "Bài hát không có tiêu đề",
    artist: snippet.channelTitle || "Echora",
    artistId: snippet.channelId || "",
    album: "Echora",
    albumId: "",
    duration: durationSeconds(video.contentDetails?.duration),
    coverUrl: thumbnail(snippet),
    audioUrl: "",
    playbackSource: "youtube",
    youtubeVideoId: id,
    plays: Number(video.statistics?.viewCount || 0),
    addedAt: snippet.publishedAt,
  }
}

function embeddable(video: Video) {
  return video.status?.embeddable === true && video.status.madeForKids !== true
}

async function getVideos(ids: string[], signal?: AbortSignal): Promise<Song[]> {
  if (!ids.length) return []
  const result = await request<{ items?: Video[] }>("videos", {
    part: "snippet,contentDetails,status,statistics", id: ids.join(","), maxResults: "50",
  }, signal)
  return (result.items || []).filter(embeddable).map(toSong).filter((song): song is Song => Boolean(song))
}

async function searchItems(query: string, type: "video" | "channel" | "playlist", limit = 12, signal?: AbortSignal) {
  const result = await request<{ items?: SearchItem[] }>("search", {
    part: "snippet", q: query, type, maxResults: String(Math.min(50, Math.max(1, limit))),
    regionCode: "VN", ...(type === "video" ? { videoEmbeddable: "true", safeSearch: "none" } : {}),
  }, signal)
  return result.items || []
}

export async function searchYouTubeVideos(query: string, limit = 20, signal?: AbortSignal): Promise<Song[]> {
  const items = await searchItems(query, "video", limit, signal)
  return getVideos(items.map((item) => item.id?.videoId || "").filter(Boolean), signal)
}

export async function findYouTubeVideo(song: Song, signal?: AbortSignal): Promise<string | null> {
  if (song.youtubeVideoId) return song.youtubeVideoId
  const results = await searchYouTubeVideos(`${song.artist} ${song.title} official`, 10, signal)
  const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
  const title = normalize(song.title)
  const artist = normalize(song.artist.split(/\s*(?:,|&| feat\.? | ft\.? )\s*/i)[0] || song.artist)
  const match = results.find((video) => normalize(video.title).includes(title) && normalize(video.artist).includes(artist))
  return match?.youtubeVideoId || results[0]?.youtubeVideoId || null
}

export async function getTrendingVideos(limit = 24, signal?: AbortSignal): Promise<Song[]> {
  const result = await request<{ items?: Video[] }>("videos", {
    part: "snippet,contentDetails,status,statistics", chart: "mostPopular", videoCategoryId: "10",
    regionCode: "VN", maxResults: String(Math.min(50, limit)),
  }, signal)
  return (result.items || []).filter(embeddable).map(toSong).filter((song): song is Song => Boolean(song))
}

export async function searchYouTubeChannels(query: string, limit = 12, signal?: AbortSignal): Promise<Artist[]> {
  const items = await searchItems(query, "channel", limit, signal)
  return items.flatMap((item) => {
    const id = item.id?.channelId
    const snippet = item.snippet
    if (!id || !snippet) return []
    const image = thumbnail(snippet)
    return [{ id, name: snippet.channelTitle || snippet.title || "Kênh Echora", avatarUrl: image, bannerUrl: image, followers: 0, verified: false, bio: snippet.description || "Kênh nghệ sĩ Echora", topSongs: [], albums: [] }]
  })
}

export async function searchYouTubePlaylists(query: string, limit = 12, signal?: AbortSignal): Promise<Playlist[]> {
  const items = await searchItems(query, "playlist", limit, signal)
  return items.flatMap((item) => {
    const id = item.id?.playlistId
    const snippet = item.snippet
    if (!id || !snippet) return []
    return [{ id, title: snippet.title || "Danh sách phát Echora", description: snippet.description || "Danh sách phát trên Echora", coverUrl: thumbnail(snippet), owner: snippet.channelTitle || "Echora", songs: [] }]
  })
}

export async function getYouTubePlaylist(id: string, signal?: AbortSignal): Promise<Playlist> {
  const [playlistData, itemsData] = await Promise.all([
    request<{ items?: Array<{ snippet?: Snippet; contentDetails?: { itemCount?: number } }> }>("playlists", { part: "snippet,contentDetails", id }, signal),
    request<{ items?: Array<{ contentDetails?: { videoId?: string } }> }>("playlistItems", { part: "contentDetails", playlistId: id, maxResults: "50" }, signal),
  ])
  const data = playlistData.items?.[0]
  if (!data?.snippet) throw new Error("Không tìm thấy danh sách phát Echora.")
  const ids = (itemsData.items || []).map((item) => item.contentDetails?.videoId || "").filter(Boolean)
  return { id, title: data.snippet.title || "Danh sách phát Echora", description: data.snippet.description || "Danh sách phát trên Echora", coverUrl: thumbnail(data.snippet), owner: data.snippet.channelTitle || "Echora", songs: await getVideos(ids, signal) }
}

export async function getYouTubeChannel(id: string, signal?: AbortSignal): Promise<Artist> {
  const result = await request<{ items?: Array<{ snippet?: Snippet; statistics?: { subscriberCount?: string }; contentDetails?: { relatedPlaylists?: { uploads?: string } } }> }>("channels", { part: "snippet,statistics,contentDetails", id }, signal)
  const channel = result.items?.[0]
  if (!channel?.snippet) throw new Error("Không tìm thấy kênh nghệ sĩ Echora.")
  const uploadsId = channel.contentDetails?.relatedPlaylists?.uploads
  let topSongs: Song[] = []
  if (uploadsId) {
    const uploads = await request<{ items?: Array<{ contentDetails?: { videoId?: string } }> }>("playlistItems", { part: "contentDetails", playlistId: uploadsId, maxResults: "20" }, signal)
    topSongs = await getVideos((uploads.items || []).map((item) => item.contentDetails?.videoId || "").filter(Boolean), signal)
  }
  const image = thumbnail(channel.snippet)
  return { id, name: channel.snippet.title || "Kênh Echora", avatarUrl: image, bannerUrl: image, followers: Number(channel.statistics?.subscriberCount || 0), verified: false, bio: channel.snippet.description || "Kênh nghệ sĩ Echora", topSongs, albums: [] }
}

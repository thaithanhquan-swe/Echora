import React, { useEffect, useState } from "react"
import { ViewType, Song, Playlist, Artist } from "@/types/music"
import { QuickPickCard } from "@/components/common/QuickPickCard"
import { MediaCard } from "@/components/common/MediaCard"
import { TrackRow } from "@/components/common/TrackRow"
import { Badge } from "@/components/ui/badge"
import { usePlayer } from "@/context/PlayerContext"
import { getTrendingVideos, searchYouTubePlaylists, searchYouTubeChannels } from "@/services/youtubeApi"
import { Loader2 } from "lucide-react"

interface HomeViewProps { onNavigate: (view: ViewType, id?: string) => void }
type ContentFilter = "all" | "music" | "playlists" | "artists"
export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<ContentFilter>("all")
  const { playTrack } = usePlayer()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [songs, setSongs] = useState<Song[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  useEffect(() => {
    const controller = new AbortController()
    Promise.all([getTrendingVideos(24, controller.signal), searchYouTubePlaylists("nhạc Việt", 10, controller.signal), searchYouTubeChannels("nhạc Việt", 8, controller.signal)])
      .then(([videoList, playlistList, artistList]) => { setSongs(videoList); setPlaylists(playlistList); setArtists(artistList) })
      .catch((e) => { if (!controller.signal.aborted) setError(e instanceof Error ? e.message : "Không thể tải YouTube.") })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [])
  const quickPicks = songs.slice(0, 7).map((song) => ({ title: song.title, imageUrl: song.coverUrl, songs: [song], onClick: () => playTrack(song, songs) }))
  return <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-300 select-none">
    <div className="flex items-center gap-2">{([["all", "Tất cả"], ["music", "Video âm nhạc"], ["playlists", "Danh sách phát"], ["artists", "Kênh nghệ sĩ"]] as Array<[ContentFilter, string]>).map(([key, name]) => <Badge key={key} variant={filter === key ? "active" : "default"} onClick={() => setFilter(key)} className="cursor-pointer py-1.5 px-4 text-xs font-bold">{name}</Badge>)}</div>
    {loading ? <div className="flex flex-col items-center justify-center py-24 text-spotify-subdued"><Loader2 className="h-8 w-8 animate-spin text-spotify-green mb-3"/><p className="text-sm font-semibold text-white">Đang tải nhạc thịnh hành từ YouTube...</p></div> : error ? <div className="py-16 text-center text-sm text-spotify-subdued">{error}<p className="mt-2">Kiểm tra API key và quota YouTube Data API v3.</p></div> : <>
      {(filter === "all" || filter === "music") && <>
        <div><h2 className="text-2xl font-bold text-white tracking-tight mb-4">Đang thịnh hành tại Việt Nam</h2><div className="space-y-1">{songs.slice(0, 12).map((song, index) => <TrackRow key={song.id} song={song} index={index} contextSongs={songs} showAlbum={false} showDateAdded={false}/>)}</div></div>
        <div><h2 className="text-2xl font-bold text-white mb-4">Phát nhanh</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">{quickPicks.map((item, i) => <QuickPickCard key={i} {...item}/>)}</div></div>
      </>}
      {(filter === "all" || filter === "playlists") && playlists.length > 0 && <section><h2 className="text-2xl font-bold text-white mb-4">Playlist YouTube</h2><div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">{playlists.slice(0, 10).map((p) => <MediaCard key={p.id} id={p.id} title={p.title} subtitle={`Bởi ${p.owner}`} imageUrl={p.coverUrl} type="playlist" songs={p.songs} onClick={() => onNavigate("playlist", p.id)}/>)}</div></section>}
      {(filter === "all" || filter === "artists") && artists.length > 0 && <section><h2 className="text-2xl font-bold text-white mb-4">Kênh âm nhạc</h2><div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">{artists.slice(0, 10).map((a) => <MediaCard key={a.id} id={a.id} title={a.name} subtitle="Kênh YouTube" imageUrl={a.avatarUrl} type="artist" songs={a.topSongs} onClick={() => onNavigate("artist", a.id)}/>)}</div></section>}
      {songs.length === 0 && playlists.length === 0 && <div className="text-center py-16 text-spotify-subdued">YouTube chưa trả về video nào.</div>}
    </>}
  </div>
}

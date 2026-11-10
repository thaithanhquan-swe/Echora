import React, { useEffect, useState } from "react"
import { ViewType, Song, Artist, Playlist } from "@/types/music"
import { usePlayer } from "@/context/PlayerContext"
import { TrackRow } from "@/components/common/TrackRow"
import { MediaCard } from "@/components/common/MediaCard"
import { CategoryGrid } from "./search/CategoryGrid"
import { TopResultCard } from "./search/TopResultCard"
import { Badge } from "@/components/ui/badge"
import { searchYouTubeVideos, searchYouTubeChannels, searchYouTubePlaylists } from "@/services/youtubeApi"
import { Loader2 } from "lucide-react"

interface SearchViewProps { searchQuery: string; onNavigate: (view: ViewType, id?: string) => void }
type SearchTab = "all" | "tracks" | "artists" | "playlists"

export const SearchView: React.FC<SearchViewProps> = ({ searchQuery, onNavigate }) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer()
  const [activeTab, setActiveTab] = useState<SearchTab>("all")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [songs, setSongs] = useState<Song[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const query = searchQuery.trim()

  useEffect(() => {
    if (!query) { setSongs([]); setArtists([]); setPlaylists([]); setError(""); setLoading(false); return }
    const controller = new AbortController()
    setLoading(true); setError("")
    const timer = window.setTimeout(async () => {
      try {
        const [videoResults, channelResults, playlistResults] = await Promise.all([
          activeTab === "all" || activeTab === "tracks" ? searchYouTubeVideos(query, activeTab === "tracks" ? 20 : 8, controller.signal) : Promise.resolve([]),
          activeTab === "all" || activeTab === "artists" ? searchYouTubeChannels(query, 8, controller.signal) : Promise.resolve([]),
          activeTab === "all" || activeTab === "playlists" ? searchYouTubePlaylists(query, 8, controller.signal) : Promise.resolve([]),
        ])
        if (controller.signal.aborted) return
        setSongs(videoResults); setArtists(channelResults); setPlaylists(playlistResults)
      } catch (err) {
        if (!controller.signal.aborted) { setError(err instanceof Error ? err.message : "Không thể tìm kiếm trên YouTube."); setSongs([]); setArtists([]); setPlaylists([]) }
      } finally { if (!controller.signal.aborted) setLoading(false) }
    }, 400)
    return () => { window.clearTimeout(timer); controller.abort() }
  }, [query, activeTab])

  const topResult = songs[0] || null
  const any = songs.length + artists.length + playlists.length > 0
  const tabs: Array<[SearchTab, string]> = [["all", "Tất cả"], ["tracks", "Video âm nhạc"], ["artists", "Kênh nghệ sĩ"], ["playlists", "Danh sách phát"]]
  return <div className="p-6 space-y-6 animate-in fade-in duration-300 select-none">
    {!query ? <CategoryGrid onNavigate={onNavigate} /> : <div className="space-y-6">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">{tabs.map(([tab, title]) => <Badge key={tab} variant={activeTab === tab ? "active" : "default"} onClick={() => setActiveTab(tab)} className="cursor-pointer py-1.5 px-4 text-xs font-bold shrink-0">{title}</Badge>)}</div>
      {loading ? <div className="flex flex-col items-center justify-center py-24 text-spotify-subdued"><Loader2 className="h-8 w-8 animate-spin text-spotify-green mb-3"/><p className="text-sm font-semibold text-white">Đang tìm video trên YouTube...</p></div>
        : error ? <div className="text-center py-20"><p className="text-lg font-semibold text-white">Không thể tải dữ liệu YouTube</p><p className="text-sm mt-2 text-spotify-subdued">{error}</p></div>
        : !any ? <div className="text-center py-20 text-spotify-subdued"><p className="text-lg font-semibold text-white">Không tìm thấy kết quả cho “{query}”</p><p className="text-sm mt-2">Thử tên bài hát, nghệ sĩ hoặc playlist khác.</p></div>
        : <div className="space-y-8">
          {(activeTab === "all" || activeTab === "tracks") && songs.length > 0 && <section><p className="mb-1 text-xs text-spotify-subdued">Video công khai từ YouTube · phát trong khung video bên phải</p><div className="grid grid-cols-1 lg:grid-cols-12 gap-6">{topResult && <TopResultCard topResult={topResult} isCurrent={currentTrack?.id === topResult.id} isPlaying={Boolean(currentTrack?.id === topResult.id && isPlaying)} allMatchingSongs={songs} onPlaySong={playTrack} onTogglePlay={togglePlay}/>}<div className={`${topResult ? "lg:col-span-7" : "col-span-12"}`}><h3 className="text-xl font-bold text-white mb-3">Video âm nhạc</h3><div className="space-y-1">{songs.slice(0, activeTab === "tracks" ? 20 : 5).map((song, i) => <TrackRow key={song.id} song={song} index={i} contextSongs={songs} showAlbum={false} showDateAdded={false} onNavigate={onNavigate}/>)}</div></div></div></section>}
          {(activeTab === "all" || activeTab === "artists") && artists.length > 0 && <section><h3 className="text-xl font-bold text-white mb-4">Kênh nghệ sĩ</h3><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">{artists.map((a) => <MediaCard key={a.id} id={a.id} title={a.name} subtitle="Kênh YouTube" imageUrl={a.avatarUrl} type="artist" songs={a.topSongs} onClick={() => onNavigate("artist", a.id)}/>)}</div></section>}
          {(activeTab === "all" || activeTab === "playlists") && playlists.length > 0 && <section><h3 className="text-xl font-bold text-white mb-4">Danh sách phát YouTube</h3><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">{playlists.map((p) => <MediaCard key={p.id} id={p.id} title={p.title} subtitle={`Bởi ${p.owner}`} imageUrl={p.coverUrl} type="playlist" songs={p.songs} onClick={() => onNavigate("playlist", p.id)}/>)}</div></section>}
        </div>}
    </div>}
  </div>
}

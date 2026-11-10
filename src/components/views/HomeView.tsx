import React, { useEffect, useState } from "react"
import { ViewType, Song, Playlist, Artist } from "@/types/music"
import { QuickPickCard } from "@/components/common/QuickPickCard"
import { MediaCard } from "@/components/common/MediaCard"
import { TrackRow } from "@/components/common/TrackRow"
import { Badge } from "@/components/ui/badge"
import { usePlayer } from "@/context/PlayerContext"
import { getTrendingVideos, searchYouTubePlaylists, searchYouTubeChannels } from "@/services/youtubeApi"
import { Loader2 } from "lucide-react"

interface HomeViewProps {
  onNavigate: (view: ViewType, id?: string) => void
}

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
    Promise.all([
      getTrendingVideos(24, controller.signal),
      searchYouTubePlaylists("nhạc Việt", 12, controller.signal),
      searchYouTubeChannels("nhạc Việt", 10, controller.signal),
    ])
      .then(([videoList, playlistList, artistList]) => {
        setSongs(videoList)
        setPlaylists(playlistList)
        setArtists(artistList)
      })
      .catch((e) => {
        if (!controller.signal.aborted) setError(e instanceof Error ? e.message : "Không thể tải dữ liệu Echora.")
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [])

  const quickPicks = songs.slice(0, 8).map((song) => ({
    title: song.title,
    imageUrl: song.coverUrl,
    songs: [song],
    onClick: () => playTrack(song, songs),
  }))

  const filterOptions: Array<[ContentFilter, string]> = [
    ["all", "Tất cả"],
    ["music", "Bài hát thịnh hành"],
    ["playlists", "Danh sách phát"],
    ["artists", "Kênh nghệ sĩ"],
  ]

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 sm:space-y-10 animate-in fade-in duration-300 select-none">
      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {filterOptions.map(([key, name]) => (
          <Badge
            key={key}
            variant={filter === key ? "active" : "default"}
            onClick={() => setFilter(key)}
            className="cursor-pointer py-1.5 sm:py-2 px-4 sm:px-5 text-xs sm:text-sm font-semibold shrink-0 rounded-full transition-all"
          >
            {name}
          </Badge>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-28 text-spotify-subdued">
          <Loader2 className="h-9 w-9 animate-spin text-spotify-green mb-3" />
          <p className="text-base font-semibold text-white">Đang tải nhạc thịnh hành từ Echora...</p>
        </div>
      ) : error ? (
        <div className="py-20 text-center text-sm text-spotify-subdued">
          <p className="text-white text-base font-bold mb-1">Không thể tải dữ liệu</p>
          <p>{error}</p>
          <p className="mt-2 text-xs">Kiểm tra kết nối và cấu hình dịch vụ Echora.</p>
        </div>
      ) : (
        <>
          {/* Quick Picks / Phát nhanh */}
          {(filter === "all" || filter === "music") && quickPicks.length > 0 && (
            <section>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
                Phát nhanh
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {quickPicks.map((item, i) => (
                  <QuickPickCard key={i} {...item} />
                ))}
              </div>
            </section>
          )}

          {/* Trending Tracks */}
          {(filter === "all" || filter === "music") && songs.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Đang thịnh hành tại Việt Nam
                </h2>
              </div>
              <div className="space-y-1">
                {songs.slice(0, 10).map((song, index) => (
                  <TrackRow
                    key={song.id}
                    song={song}
                    index={index}
                    contextSongs={songs}
                    showAlbum={false}
                    showDateAdded={false}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Playlists Grid */}
          {(filter === "all" || filter === "playlists") && playlists.length > 0 && (
            <section>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
                Danh sách phát Echora
              </h2>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 sm:gap-6">
                {playlists.map((p) => (
                  <MediaCard
                    key={p.id}
                    id={p.id}
                    title={p.title}
                    subtitle={`Bởi ${p.owner}`}
                    imageUrl={p.coverUrl}
                    type="playlist"
                    songs={p.songs}
                    onClick={() => onNavigate("playlist", p.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Artists Grid */}
          {(filter === "all" || filter === "artists") && artists.length > 0 && (
            <section>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
                Kênh nghệ sĩ
              </h2>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 sm:gap-6">
                {artists.map((a) => (
                  <MediaCard
                    key={a.id}
                    id={a.id}
                    title={a.name}
                    subtitle="Kênh Echora"
                    imageUrl={a.avatarUrl}
                    type="artist"
                    songs={a.topSongs}
                    onClick={() => onNavigate("artist", a.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {songs.length === 0 && playlists.length === 0 && (
            <div className="text-center py-20 text-spotify-subdued">
              Echora chưa tìm thấy nội dung phù hợp. Hãy thử lại sau.
            </div>
          )}
        </>
      )}
    </div>
  )
}

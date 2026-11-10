import React, { useState, useEffect } from "react"
import { Heart, Loader2 } from "lucide-react"
import { ViewType, Playlist, Artist } from "@/types/music"
import { usePlayer } from "@/context/PlayerContext"
import { Badge } from "@/components/ui/badge"
import { MediaCard } from "@/components/common/MediaCard"
import { searchYouTubePlaylists, searchYouTubeChannels } from "@/services/youtubeApi"

interface LibraryViewProps {
  onNavigate: (view: ViewType, id?: string) => void
}

type LibraryFilter = "all" | "playlists" | "artists"

export const LibraryView: React.FC<LibraryViewProps> = ({ onNavigate }) => {
  const { likedSongs, likedSongIds } = usePlayer()
  const [filter, setFilter] = useState<LibraryFilter>("all")
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    Promise.all([
      searchYouTubePlaylists("nhạc Việt", 12),
      searchYouTubeChannels("nhạc Việt", 8),
    ])
      .then(([pl, ar]) => {
        if (!isMounted) return
        setPlaylists(pl)
        setArtists(ar)
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 animate-in fade-in duration-300 select-none pb-24">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
          Thư viện của bạn
        </h1>
        <p className="text-sm text-spotify-subdued">
          Danh sách phát, nghệ sĩ và các bài hát bạn đã lưu trong Echora
        </p>
      </div>

      {/* Filter Badges */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {([
          ["all", "Tất cả"],
          ["playlists", "Danh sách phát"],
          ["artists", "Nghệ sĩ"],
        ] as Array<[LibraryFilter, string]>).map(([key, name]) => (
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

      {/* Liked Songs Highlight Card */}
      {(filter === "all" || filter === "playlists") && (
        <div
          onClick={() => onNavigate("liked-songs")}
          className="p-5 sm:p-6 rounded-xl bg-gradient-to-br from-indigo-800 via-purple-700 to-pink-600 hover:brightness-110 cursor-pointer shadow-xl transition-all duration-300 flex items-center justify-between group"
        >
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
              <Heart className="h-8 w-8 sm:h-10 sm:w-10 text-white fill-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Bài hát đã thích
              </h2>
              <p className="text-xs sm:text-sm text-white/80 mt-1 font-medium">
                {likedSongIds.size} bài hát đã lưu
              </p>
            </div>
          </div>
          <span className="text-xs sm:text-sm font-bold bg-white text-black px-4 py-2 rounded-full shadow-lg group-hover:scale-105 transition-transform">
            Mở xem
          </span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-spotify-subdued">
          <Loader2 className="h-8 w-8 animate-spin text-spotify-green mb-3" />
          <p className="text-sm font-semibold text-white">Đang tải thư viện...</p>
        </div>
      ) : (
        <>
          {/* Playlists */}
          {(filter === "all" || filter === "playlists") && playlists.length > 0 && (
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 tracking-tight">
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

          {/* Artists */}
          {(filter === "all" || filter === "artists") && artists.length > 0 && (
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 tracking-tight">
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
        </>
      )}
    </div>
  )
}

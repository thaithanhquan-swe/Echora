import React, { useEffect, useState } from "react"
import { Playlist, ViewType } from "@/types/music"
import { usePlayer } from "@/context/PlayerContext"
import { HeroHeader } from "@/components/common/HeroHeader"
import { ActionBar } from "@/components/common/ActionBar"
import { TrackTable } from "@/components/common/TrackTable"
import { spotifyApi, mapApiPlaylistToPlaylist } from "@/services/spotifyApi"
import { Loader2 } from "lucide-react"

interface PlaylistDetailViewProps {
  playlist?: Playlist
  playlistId?: string
  onNavigate: (view: ViewType, id?: string) => void
}

export const PlaylistDetailView: React.FC<PlaylistDetailViewProps> = ({
  playlist: initialPlaylist,
  playlistId,
  onNavigate,
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer()
  const [playlist, setPlaylist] = useState<Playlist | null>(initialPlaylist || null)
  const [loading, setLoading] = useState<boolean>(!initialPlaylist || Boolean(playlistId))
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const targetId = playlistId || initialPlaylist?.id

  useEffect(() => {
    if (!targetId) return

    let isMounted = true
    setLoading(true)
    setError(null)

    spotifyApi
      .getPlaylist(targetId)
      .then((res) => {
        if (!isMounted) return
        if (res.success && res.playlist) {
          const mapped = mapApiPlaylistToPlaylist(
            res.playlist,
            initialPlaylist?.coverUrl
          )
          setPlaylist(mapped)
        } else {
          setError("Không thể tải danh sách phát này.")
        }
      })
      .catch((err) => {
        if (!isMounted) return
        console.error("Error fetching playlist:", err)
        setError(
          `Không tải được playlist từ API catalog${err instanceof Error ? `: ${err.message}` : "."}`
        )
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [targetId, retryCount])

  if (loading && !playlist) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-spotify-subdued">
        <Loader2 className="h-10 w-10 animate-spin text-spotify-green mb-3" />
        <p className="text-sm font-semibold text-white">Đang tải danh sách phát...</p>
      </div>
    )
  }

  if (error || !playlist) {
    return (
      <div className="p-8 text-center text-spotify-subdued">
        <p className="text-lg font-bold text-white mb-2">{error || "Không tìm thấy danh sách phát"}</p>
        <button
          onClick={() => onNavigate("home")}
          className="text-spotify-green font-bold text-sm hover:underline"
        >
          Quay lại trang chủ
        </button>
        <button
          onClick={() => setRetryCount((count) => count + 1)}
          className="ml-4 text-spotify-green font-bold text-sm hover:underline"
        >
          Thử tải lại
        </button>
      </div>
    )
  }

  const isPlaylistPlaying =
    playlist.songs.some((s) => s.id === currentTrack?.id) && isPlaying

  const handlePlayPlaylist = () => {
    if (isPlaylistPlaying) {
      togglePlay()
    } else if (playlist.songs.length > 0) {
      playTrack(playlist.songs[0], playlist.songs.slice(1))
    }
  }

  const totalDuration = playlist.songs.reduce((acc, s) => acc + s.duration, 0)
  const totalMinutes = Math.floor(totalDuration / 60)

  return (
    <div className="min-h-full pb-12 animate-in fade-in duration-300">
      {/* 1. Dynamic Hero Header */}
      <HeroHeader
        type="Danh sách phát công khai"
        title={playlist.title}
        description={playlist.description}
        coverUrl={playlist.coverUrl}
        colorTheme={playlist.colorTheme || "#1db954"}
        metaInfo={
          <>
            <span className="font-bold text-white hover:underline cursor-pointer">
              {playlist.owner}
            </span>
            <span>•</span>
            {playlist.followers && (
              <>
                <span>{playlist.followers.toLocaleString()} người theo dõi</span>
                <span>•</span>
              </>
            )}
            <span>{playlist.songs.length} bài hát,</span>
            <span className="text-neutral-300">khoảng {totalMinutes} phút</span>
          </>
        }
      />

      {/* 2. Action Bar */}
      <ActionBar
        isPlaying={isPlaylistPlaying}
        onTogglePlay={handlePlayPlaylist}
      />

      {/* 3. Reusable Track Table */}
      <TrackTable
        songs={playlist.songs}
        onNavigate={onNavigate}
      />
    </div>
  )
}

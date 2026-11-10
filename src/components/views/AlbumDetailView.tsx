import React, { useEffect, useState } from "react"
import { Album, ViewType } from "@/types/music"
import { usePlayer } from "@/context/PlayerContext"
import { HeroHeader } from "@/components/common/HeroHeader"
import { ActionBar } from "@/components/common/ActionBar"
import { TrackTable } from "@/components/common/TrackTable"
import { spotifyApi, mapApiAlbumToAlbum } from "@/services/spotifyApi"
import { Loader2 } from "lucide-react"

interface AlbumDetailViewProps {
  album?: Album
  albumId?: string
  onNavigate: (view: ViewType, id?: string) => void
}

export const AlbumDetailView: React.FC<AlbumDetailViewProps> = ({
  album: initialAlbum,
  albumId,
  onNavigate,
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer()
  const [album, setAlbum] = useState<Album | null>(initialAlbum || null)
  const [loading, setLoading] = useState<boolean>(!initialAlbum || Boolean(albumId))
  const [error, setError] = useState<string | null>(null)

  const targetId = albumId || initialAlbum?.id

  useEffect(() => {
    if (!targetId) return

    let isMounted = true
    setLoading(true)
    setError(null)

    spotifyApi
      .getAlbum(targetId)
      .then((res) => {
        if (!isMounted) return
        if (res.success && res.album) {
          const mapped = mapApiAlbumToAlbum(res.album)
          setAlbum(mapped)
        } else {
          setError("Không thể tải thông tin Album này.")
        }
      })
      .catch((err) => {
        if (!isMounted) return
        console.error("Error fetching album:", err)
        setError("Lỗi kết nối tới máy chủ Echora.")
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [targetId])

  if (loading && !album) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-spotify-subdued">
        <Loader2 className="h-10 w-10 animate-spin text-spotify-green mb-3" />
        <p className="text-sm font-semibold text-white">Đang tải Album...</p>
      </div>
    )
  }

  if (error || !album) {
    return (
      <div className="p-8 text-center text-spotify-subdued">
        <p className="text-lg font-bold text-white mb-2">{error || "Không tìm thấy Album"}</p>
        <button
          onClick={() => onNavigate("home")}
          className="text-spotify-green font-bold text-sm hover:underline"
        >
          Quay lại trang chủ
        </button>
      </div>
    )
  }

  const isAlbumPlaying =
    album.songs.some((s) => s.id === currentTrack?.id) && isPlaying

  const handlePlayAlbum = () => {
    if (isAlbumPlaying) {
      togglePlay()
    } else if (album.songs.length > 0) {
      playTrack(album.songs[0], album.songs.slice(1))
    }
  }

  const totalDuration = album.songs.reduce((acc, s) => acc + s.duration, 0)
  const totalMinutes = Math.floor(totalDuration / 60)

  return (
    <div className="min-h-full pb-12 animate-in fade-in duration-300">
      {/* 1. Hero Header */}
      <HeroHeader
        type="Album"
        title={album.title}
        coverUrl={album.coverUrl}
        colorTheme={album.colorTheme || "#3a506b"}
        metaInfo={
          <>
            <span
              onClick={() => {
                if (album.artistId) {
                  onNavigate("artist", album.artistId)
                }
              }}
              className="font-bold text-white hover:underline cursor-pointer"
            >
              {album.artist}
            </span>
            {album.releaseYear > 0 && (
              <>
                <span>•</span>
                <span>{album.releaseYear}</span>
              </>
            )}
            <span>•</span>
            <span>{album.songs.length} bài hát,</span>
            <span className="text-neutral-300">khoảng {totalMinutes} phút</span>
          </>
        }
      />

      {/* 2. Action Bar */}
      <ActionBar
        isPlaying={isAlbumPlaying}
        onTogglePlay={handlePlayAlbum}
      />

      {/* 3. Track Table */}
      <TrackTable
        songs={album.songs}
        showAlbum={false}
        onNavigate={onNavigate}
      />
    </div>
  )
}

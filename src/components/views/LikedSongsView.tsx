import React from "react"
import { Heart } from "lucide-react"
import { ViewType } from "@/types/music"
import { usePlayer } from "@/context/PlayerContext"
import { HeroHeader } from "@/components/common/HeroHeader"
import { ActionBar } from "@/components/common/ActionBar"
import { TrackTable } from "@/components/common/TrackTable"

interface LikedSongsViewProps {
  onNavigate: (view: ViewType, id?: string) => void
}

export const LikedSongsView: React.FC<LikedSongsViewProps> = ({ onNavigate }) => {
  const { likedSongs, currentTrack, isPlaying, playTrack, togglePlay } = usePlayer()

  const isPlayingLiked =
    likedSongs.some((s) => s.id === currentTrack?.id) && isPlaying

  const handlePlayLiked = () => {
    if (isPlayingLiked) {
      togglePlay()
    } else if (likedSongs.length > 0) {
      playTrack(likedSongs[0], likedSongs.slice(1))
    }
  }

  const totalDuration = likedSongs.reduce((acc, s) => acc + s.duration, 0)
  const totalMinutes = Math.floor(totalDuration / 60)

  return (
    <div className="min-h-full pb-12 animate-in fade-in duration-300">
      {/* 1. Hero Header */}
      <HeroHeader
        type="Danh sách phát"
        title="Bài hát đã thích"
        colorTheme="#450af5"
        customCover={
          <div className="h-48 w-48 lg:h-60 lg:w-60 rounded-md bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-2xl shrink-0">
            <Heart className="h-24 w-24 text-white fill-white drop-shadow-lg" />
          </div>
        }
        metaInfo={
          <>
            <span className="font-bold text-white">Bạn</span>
            <span>•</span>
            <span>{likedSongs.length} bài hát</span>
            <span>•</span>
            <span className="text-neutral-300">khoảng {totalMinutes} phút</span>
          </>
        }
      />

      {/* 2. Action Bar (only if there are songs) */}
      {likedSongs.length > 0 && (
        <ActionBar
          isPlaying={isPlayingLiked}
          onTogglePlay={handlePlayLiked}
        />
      )}

      {/* 3. Track Table or Empty Message */}
      <TrackTable
        songs={likedSongs}
        onNavigate={onNavigate}
        emptyMessage={
          <div className="text-center py-24 text-spotify-subdued">
            <Heart className="h-16 w-16 mx-auto mb-4 stroke-[1.5] text-neutral-600" />
            <h3 className="text-xl font-bold text-white">
              Các bài hát bạn thích sẽ xuất hiện ở đây
            </h3>
            <p className="text-sm mt-2 max-w-sm mx-auto">
              Lưu bài hát bằng cách nhấn vào biểu tượng trái tim khi bạn nghe nhạc.
            </p>
          </div>
        }
      />
    </div>
  )
}

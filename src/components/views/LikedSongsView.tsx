import React from "react"
import { Play, Pause, Heart, Clock } from "lucide-react"
import { MOCK_SONGS } from "@/data/mockData"
import { ViewType } from "@/types/music"
import { usePlayer } from "@/context/PlayerContext"
import { TrackRow } from "@/components/common/TrackRow"

interface LikedSongsViewProps {
  onNavigate: (view: ViewType, id?: string) => void
}

export const LikedSongsView: React.FC<LikedSongsViewProps> = ({ onNavigate }) => {
  const { likedSongIds, currentTrack, isPlaying, playTrack, togglePlay } = usePlayer()

  const likedSongs = MOCK_SONGS.filter((s) => likedSongIds.has(s.id))
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
      {/* Hero Header */}
      <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-end gap-6 pt-16 bg-gradient-to-b from-indigo-800 via-purple-900/60 to-neutral-900">
        <div className="h-48 w-48 lg:h-60 lg:w-60 rounded-md bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-2xl shrink-0">
          <Heart className="h-24 w-24 text-white fill-white drop-shadow-lg" />
        </div>

        <div className="flex flex-col gap-2 min-w-0">
          <span className="text-xs uppercase font-extrabold tracking-widest text-white/90">
            Danh sách phát
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight drop-shadow-md">
            Bài hát đã thích
          </h1>

          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-white/90 mt-2 flex-wrap">
            <span className="font-bold text-white">Bạn</span>
            <span>•</span>
            <span>{likedSongs.length} bài hát</span>
            <span>•</span>
            <span className="text-neutral-300">khoảng {totalMinutes} phút</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      {likedSongs.length > 0 && (
        <div className="px-6 md:px-8 py-5 flex items-center gap-6">
          <button
            onClick={handlePlayLiked}
            className="h-14 w-14 rounded-full bg-spotify-green hover:scale-105 active:scale-95 text-black flex items-center justify-center transition-all shadow-xl hover:bg-spotify-lightgreen"
            title="Phát tất cả bài hát đã thích"
          >
            {isPlayingLiked ? (
              <Pause className="h-6 w-6 fill-black" />
            ) : (
              <Play className="h-6 w-6 fill-black ml-1" />
            )}
          </button>
        </div>
      )}

      {/* Songs Table */}
      <div className="px-4 md:px-6">
        {likedSongs.length === 0 ? (
          <div className="text-center py-24 text-neutral-400">
            <Heart className="h-16 w-16 mx-auto mb-4 stroke-[1.5] text-neutral-600" />
            <h3 className="text-xl font-bold text-white">
              Các bài hát bạn thích sẽ xuất hiện ở đây
            </h3>
            <p className="text-sm mt-2 max-w-sm mx-auto">
              Lưu bài hát bằng cách nhấn vào biểu tượng trái tim khi bạn nghe nhạc.
            </p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-[16px_1fr_auto] md:grid-cols-[16px_4fr_3fr_minmax(120px,1fr)] lg:grid-cols-[16px_6fr_4fr_3fr_minmax(100px,1fr)] items-center gap-4 px-4 py-2 border-b border-neutral-800 text-neutral-400 text-xs font-semibold uppercase tracking-wider">
              <span className="text-center">#</span>
              <span>Tiêu đề</span>
              <span className="hidden md:block">Album</span>
              <span className="hidden lg:block">Ngày thêm</span>
              <span className="flex justify-end pr-2">
                <Clock className="h-4 w-4" />
              </span>
            </div>

            {/* Songs */}
            <div className="mt-2 space-y-0.5">
              {likedSongs.map((song, index) => (
                <TrackRow
                  key={song.id}
                  song={song}
                  index={index}
                  contextSongs={likedSongs}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

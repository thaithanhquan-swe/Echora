import React from "react"
import { X, Heart, MoreHorizontal, Play, Pause, Trash2, ListMusic } from "lucide-react"
import { usePlayer } from "@/context/PlayerContext"
import { MOCK_ARTISTS } from "@/data/mockData"
import { formatNumber } from "@/lib/utils"
import { ViewType } from "@/types/music"

interface RightSidebarProps {
  onNavigate?: (view: ViewType, id?: string) => void
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ onNavigate }) => {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    queue,
    history,
    likedSongIds,
    toggleLike,
    playTrack,
    removeFromQueue,
    isRightSidebarOpen,
    setRightSidebarOpen,
    isQueueOpen,
    setQueueOpen,
  } = usePlayer()

  if (!isRightSidebarOpen && !isQueueOpen) {
    return null
  }

  const artist = MOCK_ARTISTS.find(a => a.id === currentTrack?.artistId)
  const isLiked = currentTrack ? likedSongIds.has(currentTrack.id) : false

  return (
    <aside className="w-80 lg:w-96 bg-neutral-900 rounded-lg flex flex-col h-full overflow-hidden shrink-0 animate-in slide-in-from-right-4 duration-200">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-neutral-800">
        <div className="flex items-center gap-2">
          {isQueueOpen && <ListMusic className="h-5 w-5 text-spotify-green" />}
          <h3 className="font-bold text-base text-white truncate">
            {isQueueOpen ? "Danh sách chờ" : currentTrack?.title || "Đang phát"}
          </h3>
        </div>

        <button
          onClick={() => {
            setRightSidebarOpen(false)
            setQueueOpen(false)
          }}
          className="h-8 w-8 rounded-full hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          title="Đóng"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* If Queue Mode */}
        {isQueueOpen ? (
          <div className="space-y-6">
            {/* Currently playing */}
            {currentTrack && (
              <div>
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
                  Đang phát
                </h4>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-neutral-800/80 group">
                  <div className="relative h-12 w-12 rounded overflow-hidden shrink-0">
                    <img
                      src={currentTrack.coverUrl}
                      alt={currentTrack.title}
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={togglePlay}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5 text-white fill-white" />
                      ) : (
                        <Play className="h-5 w-5 text-white fill-white ml-0.5" />
                      )}
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-spotify-green truncate">
                      {currentTrack.title}
                    </p>
                    <p className="text-xs text-neutral-400 truncate">
                      {currentTrack.artist}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Next Up in Queue */}
            <div>
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
                Tiếp theo trong danh sách ({queue.length})
              </h4>

              {queue.length === 0 ? (
                <p className="text-sm text-neutral-500 py-4 text-center">
                  Không có bài hát nào trong hàng đợi
                </p>
              ) : (
                <div className="space-y-1">
                  {queue.map((song, idx) => (
                    <div
                      key={`${song.id}-${idx}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-800/60 group transition-colors"
                    >
                      <span className="text-xs text-neutral-500 w-4 text-center">
                        {idx + 1}
                      </span>
                      <img
                        src={song.coverUrl}
                        alt={song.title}
                        className="h-10 w-10 rounded object-cover shrink-0"
                      />
                      <div
                        onClick={() => playTrack(song)}
                        className="flex-1 min-w-0 cursor-pointer"
                      >
                        <p className="font-medium text-sm text-white truncate group-hover:text-spotify-green transition-colors">
                          {song.title}
                        </p>
                        <p className="text-xs text-neutral-400 truncate">
                          {song.artist}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromQueue(idx)}
                        className="h-8 w-8 rounded-full hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Xóa khỏi hàng đợi"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Normal Now Playing Mode */
          currentTrack && (
            <>
              {/* Big Artwork */}
              <div className="relative aspect-square rounded-lg overflow-hidden shadow-2xl group">
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Artist & Like */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2
                    onClick={() => onNavigate && onNavigate("album", currentTrack.albumId)}
                    className="font-bold text-xl text-white hover:underline cursor-pointer truncate"
                  >
                    {currentTrack.title}
                  </h2>
                  <p
                    onClick={() => onNavigate && onNavigate("artist", currentTrack.artistId)}
                    className="text-neutral-400 hover:text-white hover:underline cursor-pointer text-sm font-medium mt-0.5"
                  >
                    {currentTrack.artist}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleLike(currentTrack.id)}
                    className="p-2 text-neutral-400 hover:text-white transition-colors"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isLiked ? "text-spotify-green fill-spotify-green" : ""
                      }`}
                    />
                  </button>
                  <button className="p-2 text-neutral-400 hover:text-white transition-colors">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* About Artist Card */}
              {artist && (
                <div className="rounded-xl overflow-hidden bg-neutral-800/70 border border-neutral-700/50">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={artist.bannerUrl}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
                    <span className="absolute top-3 left-3 text-xs font-bold uppercase tracking-wider text-white drop-shadow">
                      Thông tin về nghệ sĩ
                    </span>
                  </div>

                  <div className="p-4 -mt-6 relative">
                    <h4
                      onClick={() => onNavigate && onNavigate("artist", artist.id)}
                      className="font-bold text-base text-white hover:underline cursor-pointer"
                    >
                      {artist.name}
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      {formatNumber(artist.monthlyListeners)} người nghe hàng tháng
                    </p>
                    <p className="text-xs text-neutral-300 mt-3 line-clamp-3 leading-relaxed">
                      {artist.bio}
                    </p>
                  </div>
                </div>
              )}

              {/* Next In Queue Preview */}
              {queue.length > 0 && (
                <div className="rounded-xl p-4 bg-neutral-800/50 border border-neutral-800">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      Tiếp theo trong danh sách
                    </h4>
                    <button
                      onClick={() => setQueueOpen(true)}
                      className="text-xs font-bold text-neutral-300 hover:text-white hover:underline"
                    >
                      Mở hàng đợi
                    </button>
                  </div>

                  <div
                    onClick={() => playTrack(queue[0])}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <img
                      src={queue[0].coverUrl}
                      alt={queue[0].title}
                      className="h-12 w-12 rounded object-cover shadow"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-white truncate group-hover:text-spotify-green">
                        {queue[0].title}
                      </p>
                      <p className="text-xs text-neutral-400 truncate">
                        {queue[0].artist}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )
        )}
      </div>
    </aside>
  )
}

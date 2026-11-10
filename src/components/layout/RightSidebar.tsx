import React from "react"
import { X, ListMusic, Music2 } from "lucide-react"
import { usePlayer } from "@/context/PlayerContext"
import { ViewType } from "@/types/music"
import { NowPlayingView } from "@/components/sidebar/NowPlayingView"
import { QueueListView } from "@/components/sidebar/QueueListView"
import { YouTubeVideoPanel } from "@/components/sidebar/YouTubeVideoPanel"

interface RightSidebarProps {
  onNavigate?: (view: ViewType, id?: string) => void
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ onNavigate }) => {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    queue,
    likedSongIds,
    toggleLike,
    playTrack,
    removeFromQueue,
    isRightSidebarOpen,
    setRightSidebarOpen,
    isQueueOpen,
    setQueueOpen,
  } = usePlayer()

  if (!isRightSidebarOpen && !isQueueOpen && currentTrack?.playbackSource !== "youtube") {
    return null
  }

  const isLiked = currentTrack ? likedSongIds.has(currentTrack.id) : false

  return (
    <aside className="w-[340px] xl:w-[380px] 2xl:w-[420px] bg-spotify-black rounded-lg flex flex-col h-full overflow-hidden shrink-0 animate-in slide-in-from-right-4 duration-200">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-neutral-800 select-none">
        <div className="flex items-center gap-2">
          {isQueueOpen && <ListMusic className="h-5 w-5 text-spotify-green stroke-[2]" />}
          <h3 className="font-bold text-base text-white truncate tracking-tight">
            {isQueueOpen
              ? "Danh sách chờ"
              : currentTrack
              ? currentTrack.title
              : "Đang phát"}
          </h3>
        </div>

        {currentTrack?.playbackSource !== "youtube" && <button
          onClick={() => {
            setRightSidebarOpen(false)
            setQueueOpen(false)
          }}
          className="h-8 w-8 rounded-full hover:bg-neutral-800 flex items-center justify-center text-spotify-subdued hover:text-white transition-colors focus:outline-none"
          title="Đóng"
        >
          <X className="h-4 w-4 stroke-[2]" />
        </button>}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 spotify-scroll">
        {currentTrack?.youtubeVideoId && <YouTubeVideoPanel track={currentTrack} />}
        {isQueueOpen ? (
          <QueueListView
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            queue={queue}
            onTogglePlay={togglePlay}
            onPlayTrack={playTrack}
            onRemoveFromQueue={removeFromQueue}
          />
        ) : currentTrack ? (
          <NowPlayingView
            currentTrack={currentTrack}
            isLiked={isLiked}
            queue={queue}
            onToggleLike={toggleLike}
            onOpenQueue={() => setQueueOpen(true)}
            onPlayTrack={playTrack}
            onNavigate={onNavigate}
            hideMedia={Boolean(currentTrack.youtubeVideoId)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center p-6 text-spotify-subdued">
            <Music2 className="h-12 w-12 mb-3 stroke-[1.5] text-neutral-600 animate-pulse" />
            <p className="font-bold text-white text-base">Chưa phát bài hát nào</p>
            <p className="text-xs mt-1 text-neutral-400">
              Hãy chọn bất kỳ bài hát nào từ Trang chủ hoặc Tìm kiếm để bắt đầu nghe nhạc.
            </p>
          </div>
        )}
      </div>
    </aside>
  )
}

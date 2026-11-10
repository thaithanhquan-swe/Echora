import React from "react"
import { X, ListMusic, Music2 } from "lucide-react"
import { usePlayer } from "@/context/PlayerContext"
import { ViewType } from "@/types/music"
import { NowPlayingView } from "@/components/sidebar/NowPlayingView"
import { QueueListView } from "@/components/sidebar/QueueListView"
import { YouTubeVideoPanel } from "@/components/sidebar/YouTubeVideoPanel"

interface RightSidebarProps {
  onNavigate?: (view: ViewType, id?: string) => void
  width?: number
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ onNavigate, width = 340 }) => {
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

  const isLiked = currentTrack ? likedSongIds.has(currentTrack.id) : false
  const isOpen = isRightSidebarOpen || isQueueOpen

  const handleClose = () => {
    setRightSidebarOpen(false)
    setQueueOpen(false)
  }

  return (
    <>
      {/* Mobile Backdrop when open on screens < 1024px */}
      {isOpen && (
        <div
          onClick={handleClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Persistent sidebar container:
          On desktop: static inline column that smoothly collapses to w-0 without unmounting the YouTube iframe.
          On mobile/tablet: fixed slide-over drawer when open, hidden offscreen when closed without unmounting. */}
      <aside
        style={{ "--right-sidebar-width": `${width}px` } as React.CSSProperties}
        data-resizable-panel="right"
        className={`bg-spotify-black rounded-lg flex flex-col overflow-hidden shrink-0 ${
          isOpen
            ? "fixed inset-y-2 right-2 z-50 w-[92vw] sm:w-[380px] lg:static lg:h-full lg:z-auto lg:w-[var(--right-sidebar-width)] opacity-100 shadow-2xl lg:shadow-none"
            : "w-0 p-0 m-0 border-0 pointer-events-none opacity-0 overflow-hidden h-0 lg:h-full"
        }`}
      >
        <div className="w-[92vw] sm:w-[380px] lg:w-[var(--right-sidebar-width)] flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b border-neutral-800 select-none shrink-0">
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

            <button
              onClick={handleClose}
              className="h-8 w-8 rounded-full hover:bg-neutral-800 flex items-center justify-center text-spotify-subdued hover:text-white transition-colors focus:outline-none"
              title="Đóng"
            >
              <X className="h-5 w-5 stroke-[2]" />
            </button>
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
        </div>
      </aside>
    </>
  )
}

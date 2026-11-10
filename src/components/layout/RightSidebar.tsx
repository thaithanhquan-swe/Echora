import React from "react"
import { X } from "lucide-react"
import { usePlayer } from "@/context/PlayerContext"
import { MOCK_ARTISTS } from "@/data/mockData"
import { ViewType } from "@/types/music"
import { SpotifyQueueIcon } from "@/components/icons/SpotifyIcons"
import { NowPlayingView } from "@/components/sidebar/NowPlayingView"
import { QueueListView } from "@/components/sidebar/QueueListView"

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

  if (!isRightSidebarOpen && !isQueueOpen) {
    return null
  }

  const artist = MOCK_ARTISTS.find((a) => a.id === currentTrack?.artistId)
  const isLiked = currentTrack ? likedSongIds.has(currentTrack.id) : false

  return (
    <aside className="w-[340px] xl:w-[380px] 2xl:w-[420px] bg-spotify-black rounded-lg flex flex-col h-full overflow-hidden shrink-0 animate-in slide-in-from-right-4 duration-200">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-neutral-800 select-none">
        <div className="flex items-center gap-2">
          {isQueueOpen && <SpotifyQueueIcon size={18} className="text-spotify-green" />}
          <h3 className="font-bold text-base text-white truncate tracking-tight">
            {isQueueOpen ? "Danh sách chờ" : currentTrack?.title || "Đang phát"}
          </h3>
        </div>

        <button
          onClick={() => {
            setRightSidebarOpen(false)
            setQueueOpen(false)
          }}
          className="h-8 w-8 rounded-full hover:bg-neutral-800 flex items-center justify-center text-spotify-subdued hover:text-white transition-colors focus:outline-none"
          title="Đóng"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 spotify-scroll">
        {isQueueOpen ? (
          <QueueListView
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            queue={queue}
            onTogglePlay={togglePlay}
            onPlayTrack={playTrack}
            onRemoveFromQueue={removeFromQueue}
          />
        ) : (
          currentTrack && (
            <NowPlayingView
              currentTrack={currentTrack}
              artist={artist}
              isLiked={isLiked}
              queue={queue}
              onToggleLike={toggleLike}
              onOpenQueue={() => setQueueOpen(true)}
              onPlayTrack={playTrack}
              onNavigate={onNavigate}
            />
          )
        )}
      </div>
    </aside>
  )
}

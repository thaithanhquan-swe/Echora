import React from "react"
import { Mic2, ListMusic, Tv, Maximize2 } from "lucide-react"
import { VolumeControl } from "./VolumeControl"

interface PlayerExtraControlsProps {
  isLyricsOpen: boolean
  isRightSidebarOpen: boolean
  isQueueOpen: boolean
  volume: number
  isMuted: boolean
  onToggleLyrics: () => void
  onToggleRightSidebar: () => void
  onToggleQueue: () => void
  onVolumeChange: (vol: number) => void
  onToggleMute: () => void
}

export const PlayerExtraControls: React.FC<PlayerExtraControlsProps> = ({
  isLyricsOpen,
  isRightSidebarOpen,
  isQueueOpen,
  volume,
  isMuted,
  onToggleLyrics,
  onToggleRightSidebar,
  onToggleQueue,
  onVolumeChange,
  onToggleMute,
}) => {
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.warn)
    } else {
      document.exitFullscreen().catch(console.warn)
    }
  }

  return (
    <div className="flex items-center justify-end gap-3 w-[30%] min-w-[180px] select-none">
      {/* Right Sidebar / Now Playing View toggle */}
      <button
        onClick={onToggleRightSidebar}
        className={`p-1.5 rounded-full hover:bg-neutral-800 transition-colors focus:outline-none ${
          isRightSidebarOpen
            ? "text-spotify-green"
            : "text-spotify-subdued hover:text-white"
        }`}
        title="Chế độ xem Đang phát"
      >
        <Tv className="h-4 w-4 stroke-[2]" />
      </button>

      {/* Lyrics toggle */}
      <button
        onClick={onToggleLyrics}
        className={`p-1.5 rounded-full hover:bg-neutral-800 transition-colors focus:outline-none ${
          isLyricsOpen
            ? "text-spotify-green"
            : "text-spotify-subdued hover:text-white"
        }`}
        title="Lời bài hát"
      >
        <Mic2 className="h-4 w-4 stroke-[2]" />
      </button>

      {/* Queue toggle */}
      <button
        onClick={onToggleQueue}
        className={`p-1.5 rounded-full hover:bg-neutral-800 transition-colors focus:outline-none ${
          isQueueOpen
            ? "text-spotify-green"
            : "text-spotify-subdued hover:text-white"
        }`}
        title="Danh sách chờ"
      >
        <ListMusic className="h-4 w-4 stroke-[2]" />
      </button>

      {/* Volume Control */}
      <VolumeControl
        volume={volume}
        isMuted={isMuted}
        onVolumeChange={onVolumeChange}
        onToggleMute={onToggleMute}
      />

      {/* Fullscreen button */}
      <button
        onClick={handleFullscreen}
        className="p-1.5 text-spotify-subdued hover:text-white transition-colors focus:outline-none hidden sm:block"
        title="Toàn màn hình"
      >
        <Maximize2 className="h-4 w-4 stroke-[2]" />
      </button>
    </div>
  )
}

import React from "react"
import { ListMusic, Tv, Maximize2, PictureInPicture2 } from "lucide-react"
import { VolumeControl } from "./VolumeControl"

interface PlayerExtraControlsProps {
  isRightSidebarOpen: boolean
  isQueueOpen: boolean
  volume: number
  isMuted: boolean
  onToggleRightSidebar: () => void
  onToggleQueue: () => void
  onVolumeChange: (vol: number) => void
  onToggleMute: () => void
}

export const PlayerExtraControls: React.FC<PlayerExtraControlsProps> = ({
  isRightSidebarOpen,
  isQueueOpen,
  volume,
  isMuted,
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
    <div className="flex items-center justify-end gap-2.5 sm:gap-3.5 w-auto sm:w-[30%] min-w-0 sm:min-w-[180px] select-none">
      {/* 1. Now Playing View toggle */}
      <button
        onClick={onToggleRightSidebar}
        className={`p-1.5 transition-all hover:scale-105 focus:outline-none ${
          isRightSidebarOpen
            ? "text-spotify-green"
            : "text-spotify-subdued hover:text-white"
        }`}
        title="Chế độ xem Đang phát / Video"
      >
        <Tv className="h-5 w-5 stroke-[1.8]" />
      </button>

      {/* 2. Queue toggle */}
      <button
        onClick={onToggleQueue}
        className={`p-1.5 transition-all hover:scale-105 focus:outline-none ${
          isQueueOpen
            ? "text-spotify-green"
            : "text-spotify-subdued hover:text-white"
        }`}
        title="Danh sách chờ"
      >
        <ListMusic className="h-5 w-5 stroke-[1.8]" />
      </button>

      {/* 3. Volume Control - Desktop & Tablet */}
      <div className="hidden md:flex items-center">
        <VolumeControl
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={onVolumeChange}
          onToggleMute={onToggleMute}
        />
      </div>

      {/* 4. Miniplayer */}
      <button
        onClick={() => alert("Chế độ cửa sổ thu nhỏ (Miniplayer)!")}
        className="p-1 text-spotify-subdued hover:text-white transition-all hover:scale-105 focus:outline-none hidden xl:block"
        title="Mở Miniplayer"
      >
        <PictureInPicture2 className="h-5 w-5 stroke-[1.8]" />
      </button>

      {/* 5. Fullscreen button */}
      <button
        onClick={handleFullscreen}
        className="p-1 text-spotify-subdued hover:text-white transition-all hover:scale-105 focus:outline-none hidden sm:block"
        title="Toàn màn hình"
      >
        <Maximize2 className="h-5 w-5 stroke-[1.8]" />
      </button>
    </div>
  )
}

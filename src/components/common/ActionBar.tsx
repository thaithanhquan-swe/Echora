import React from "react"
import { Download, MoreHorizontal } from "lucide-react"
import {
  SpotifyPlayIcon,
  SpotifyPauseIcon,
  SpotifyHeartIcon,
} from "@/components/icons/SpotifyIcons"

interface ActionBarProps {
  isPlaying: boolean
  isLiked?: boolean
  onTogglePlay: () => void
  onToggleLike?: () => void
  onDownload?: () => void
  onMore?: () => void
}

export const ActionBar: React.FC<ActionBarProps> = ({
  isPlaying,
  isLiked = false,
  onTogglePlay,
  onToggleLike,
  onDownload,
  onMore,
}) => {
  return (
    <div className="px-6 md:px-8 py-5 flex items-center gap-6 select-none">
      {/* Huge Spotify Green Play/Pause Button */}
      <button
        onClick={onTogglePlay}
        className="h-14 w-14 rounded-full bg-spotify-green hover:scale-105 active:scale-95 text-black flex items-center justify-center transition-all shadow-xl hover:bg-spotify-lightgreen focus:outline-none"
        title={isPlaying ? "Tạm dừng" : "Phát"}
      >
        {isPlaying ? (
          <SpotifyPauseIcon size={22} className="fill-black text-black" />
        ) : (
          <SpotifyPlayIcon size={22} className="fill-black text-black ml-1" />
        )}
      </button>

      {/* Heart button */}
      {onToggleLike && (
        <button
          onClick={onToggleLike}
          className="text-spotify-subdued hover:text-white transition-colors focus:outline-none"
          title={isLiked ? "Bỏ thích" : "Lưu vào Thư viện"}
        >
          <SpotifyHeartIcon size={32} filled={isLiked} />
        </button>
      )}

      {/* Download button */}
      <button
        onClick={onDownload || (() => alert("Tính năng tải xuống ngoại tuyến dành cho gói Premium!"))}
        className="text-spotify-subdued hover:text-white transition-colors focus:outline-none"
        title="Tải xuống"
      >
        <Download className="h-6 w-6 stroke-[1.8]" />
      </button>

      {/* More options button */}
      <button
        onClick={onMore}
        className="text-spotify-subdued hover:text-white transition-colors focus:outline-none"
        title="Tùy chọn khác"
      >
        <MoreHorizontal className="h-6 w-6" />
      </button>
    </div>
  )
}

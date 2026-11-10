import React from "react"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  PictureInPicture2,
} from "lucide-react"
import { RepeatMode } from "@/context/PlayerContext"

interface PlayerControlsProps {
  isPlaying: boolean
  isShuffled: boolean
  repeatMode: RepeatMode
  onTogglePlay: () => void
  onPrevTrack: () => void
  onNextTrack: () => void
  onToggleShuffle: () => void
  onToggleRepeat: () => void
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  isShuffled,
  repeatMode,
  onTogglePlay,
  onPrevTrack,
  onNextTrack,
  onToggleShuffle,
  onToggleRepeat,
}) => {
  return (
    <div className="flex items-center gap-5 mb-1 select-none">
      {/* Shuffle Button */}
      <button
        onClick={onToggleShuffle}
        className={`relative p-1 transition-colors focus:outline-none ${
          isShuffled
            ? "text-spotify-green hover:text-spotify-brightgreen"
            : "text-spotify-subdued hover:text-white"
        }`}
        title={isShuffled ? "Tắt trộn bài" : "Bật trộn bài"}
      >
        <Shuffle className="h-4 w-4 stroke-[2]" />
        {isShuffled && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-spotify-green" />
        )}
      </button>

      {/* Prev Button */}
      <button
        onClick={onPrevTrack}
        className="p-1 text-spotify-subdued hover:text-white transition-all active:scale-90 focus:outline-none"
        title="Trước đó"
      >
        <SkipBack className="h-5 w-5 fill-current stroke-none" />
      </button>

      {/* Big Circular Play / Pause Button */}
      <button
        onClick={onTogglePlay}
        className="h-8 w-8 rounded-full bg-white hover:scale-105 active:scale-95 text-black flex items-center justify-center transition-all shadow-md focus:outline-none"
        title={isPlaying ? "Tạm dừng" : "Phát"}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4 fill-black text-black" />
        ) : (
          <Play className="h-4 w-4 fill-black text-black ml-0.5" />
        )}
      </button>

      {/* Next Button */}
      <button
        onClick={onNextTrack}
        className="p-1 text-spotify-subdued hover:text-white transition-all active:scale-90 focus:outline-none"
        title="Kế tiếp"
      >
        <SkipForward className="h-5 w-5 fill-current stroke-none" />
      </button>

      {/* Repeat Button */}
      <button
        onClick={onToggleRepeat}
        className={`relative p-1 transition-colors focus:outline-none ${
          repeatMode !== "off"
            ? "text-spotify-green hover:text-spotify-brightgreen"
            : "text-spotify-subdued hover:text-white"
        }`}
        title={
          repeatMode === "off"
            ? "Bật lặp lại"
            : repeatMode === "all"
            ? "Lặp lại một bài"
            : "Tắt lặp lại"
        }
      >
        {repeatMode === "one" ? (
          <Repeat1 className="h-4 w-4 stroke-[2]" />
        ) : (
          <Repeat className="h-4 w-4 stroke-[2]" />
        )}
        {repeatMode !== "off" && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-spotify-green" />
        )}
      </button>

      {/* Mini-player / PIP icon */}
      <button
        onClick={() => alert("Chế độ cửa sổ thu nhỏ (Miniplayer)!")}
        className="p-1 text-spotify-subdued hover:text-white transition-colors focus:outline-none hidden sm:block"
        title="Miniplayer"
      >
        <PictureInPicture2 className="h-4 w-4 stroke-[2]" />
      </button>
    </div>
  )
}

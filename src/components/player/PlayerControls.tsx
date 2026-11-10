import React from "react"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
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
    <div className="flex items-center gap-4 sm:gap-6 mb-1.5 select-none">
      {/* 1. Shuffle Button */}
      <button
        onClick={onToggleShuffle}
        className={`relative p-1 transition-all hover:scale-110 active:scale-95 focus:outline-none hidden sm:block ${
          isShuffled
            ? "text-spotify-green hover:text-spotify-brightgreen"
            : "text-spotify-subdued hover:text-white"
        }`}
        title={isShuffled ? "Tắt trộn bài" : "Bật trộn bài"}
      >
        <Shuffle className="h-5 w-5 stroke-[2]" />
        {isShuffled && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-spotify-green" />
        )}
      </button>

      {/* 2. Prev Track Button */}
      <button
        onClick={onPrevTrack}
        className="p-1 text-spotify-subdued hover:text-white transition-all hover:scale-110 active:scale-90 focus:outline-none hidden sm:block"
        title="Trước đó"
      >
        <SkipBack className="h-5 w-5 sm:h-6 sm:w-6 fill-current stroke-none" />
      </button>

      {/* 3. Play / Pause Button - Enlarged to 40px sm:48px */}
      <button
        onClick={onTogglePlay}
        className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white hover:scale-105 active:scale-95 text-black flex items-center justify-center transition-all shadow-lg focus:outline-none"
        title={isPlaying ? "Tạm dừng" : "Phát"}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5 sm:h-6 sm:w-6 fill-black text-black" />
        ) : (
          <Play className="h-5 w-5 sm:h-6 sm:w-6 fill-black text-black ml-0.5" />
        )}
      </button>

      {/* 4. Next Track Button */}
      <button
        onClick={onNextTrack}
        className="p-1 text-spotify-subdued hover:text-white transition-all hover:scale-110 active:scale-90 focus:outline-none"
        title="Kế tiếp"
      >
        <SkipForward className="h-5 w-5 sm:h-6 sm:w-6 fill-current stroke-none" />
      </button>

      {/* 5. Repeat Button */}
      <button
        onClick={onToggleRepeat}
        className={`relative p-1 transition-all hover:scale-110 active:scale-95 focus:outline-none hidden sm:block ${
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
          <Repeat1 className="h-5 w-5 stroke-[2]" />
        ) : (
          <Repeat className="h-5 w-5 stroke-[2]" />
        )}
        {repeatMode !== "off" && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-spotify-green" />
        )}
      </button>
    </div>
  )
}

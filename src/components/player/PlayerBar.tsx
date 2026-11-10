import React, { useState } from "react"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  Heart,
  Mic2,
  ListMusic,
  Tv,
  Maximize2,
} from "lucide-react"
import { usePlayer } from "@/context/PlayerContext"
import { formatTime } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { ViewType } from "@/types/music"

interface PlayerBarProps {
  onNavigate?: (view: ViewType, id?: string) => void
}

export const PlayerBar: React.FC<PlayerBarProps> = ({ onNavigate }) => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    likedSongIds,
    isLyricsOpen,
    isRightSidebarOpen,
    isQueueOpen,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    toggleLyrics,
    toggleRightSidebar,
    toggleQueue,
  } = usePlayer()

  const [isHoveringSeek, setIsHoveringSeek] = useState(false)
  const isLiked = currentTrack ? likedSongIds.has(currentTrack.id) : false

  if (!currentTrack) {
    return null
  }

  const handleSeek = (value: number[]) => {
    if (value && value[0] !== undefined) {
      seekTo(value[0])
    }
  }

  const handleVolumeChange = (value: number[]) => {
    if (value && value[0] !== undefined) {
      setVolume(value[0] / 100)
    }
  }

  const renderVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <VolumeX className="h-4 w-4 text-neutral-400 hover:text-white" />
    }
    if (volume < 0.5) {
      return <Volume1 className="h-4 w-4 text-neutral-400 hover:text-white" />
    }
    return <Volume2 className="h-4 w-4 text-neutral-400 hover:text-white" />
  }

  return (
    <footer className="h-20 w-full bg-black border-t border-neutral-900 px-4 flex items-center justify-between select-none z-40">
      {/* Left: Track Info & Like Button */}
      <div className="flex items-center gap-3 w-1/4 min-w-[180px] max-w-[320px]">
        <div className="relative group shrink-0">
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="h-14 w-14 rounded object-cover shadow-md"
          />
        </div>

        <div className="flex flex-col min-w-0">
          <span
            onClick={() => onNavigate && onNavigate("album", currentTrack.albumId)}
            className="text-sm font-semibold text-white truncate hover:underline cursor-pointer"
          >
            {currentTrack.title}
          </span>
          <span
            onClick={() => onNavigate && onNavigate("artist", currentTrack.artistId)}
            className="text-xs text-neutral-400 truncate hover:underline hover:text-white cursor-pointer"
          >
            {currentTrack.artist}
          </span>
        </div>

        <button
          onClick={() => toggleLike(currentTrack.id)}
          className="text-neutral-400 hover:text-white p-1 rounded-full transition-transform active:scale-125 ml-1 shrink-0"
          title={isLiked ? "Xóa khỏi Bài hát đã thích" : "Lưu vào Bài hát đã thích"}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isLiked ? "text-spotify-green fill-spotify-green" : "hover:text-white"
            }`}
          />
        </button>
      </div>

      {/* Center: Controls & Scrubber */}
      <div className="flex flex-col items-center max-w-xl w-2/4 px-4">
        {/* Playback action buttons */}
        <div className="flex items-center gap-5 mb-1">
          {/* Shuffle */}
          <button
            onClick={toggleShuffle}
            className={`relative p-1 text-neutral-400 hover:text-white transition-colors ${
              isShuffled ? "text-spotify-green hover:text-spotify-green" : ""
            }`}
            title={isShuffled ? "Tắt trộn bài" : "Bật trộn bài"}
          >
            <Shuffle className="h-4 w-4" />
            {isShuffled && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-spotify-green" />
            )}
          </button>

          {/* Prev */}
          <button
            onClick={prevTrack}
            className="p-1 text-neutral-300 hover:text-white transition-transform active:scale-95"
            title="Trước đó"
          >
            <SkipBack className="h-5 w-5 fill-current" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="h-8 w-8 rounded-full bg-white hover:scale-105 active:scale-95 text-black flex items-center justify-center transition-all shadow-md"
            title={isPlaying ? "Tạm dừng" : "Phát"}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 fill-black" />
            ) : (
              <Play className="h-4 w-4 fill-black ml-0.5" />
            )}
          </button>

          {/* Next */}
          <button
            onClick={nextTrack}
            className="p-1 text-neutral-300 hover:text-white transition-transform active:scale-95"
            title="Kế tiếp"
          >
            <SkipForward className="h-5 w-5 fill-current" />
          </button>

          {/* Repeat */}
          <button
            onClick={toggleRepeat}
            className={`relative p-1 text-neutral-400 hover:text-white transition-colors ${
              repeatMode !== "off" ? "text-spotify-green hover:text-spotify-green" : ""
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
              <Repeat1 className="h-4 w-4" />
            ) : (
              <Repeat className="h-4 w-4" />
            )}
            {repeatMode !== "off" && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-spotify-green" />
            )}
          </button>
        </div>

        {/* Scrubber slider & time display */}
        <div
          className="flex items-center gap-2.5 w-full text-xs text-neutral-400"
          onMouseEnter={() => setIsHoveringSeek(true)}
          onMouseLeave={() => setIsHoveringSeek(false)}
        >
          <span className="w-10 text-right tabular-nums">
            {formatTime(currentTime)}
          </span>

          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="flex-1"
            showThumbOnHoverOnly={!isHoveringSeek}
          />

          <span className="w-10 text-left tabular-nums">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Right: Extra Controls & Volume */}
      <div className="flex items-center justify-end gap-3 w-1/4 min-w-[180px]">
        {/* Right Sidebar / Now Playing View toggle */}
        <button
          onClick={toggleRightSidebar}
          className={`p-1.5 rounded-full hover:bg-neutral-800 transition-colors ${
            isRightSidebarOpen ? "text-spotify-green" : "text-neutral-400 hover:text-white"
          }`}
          title="Chế độ xem Đang phát"
        >
          <Tv className="h-4 w-4" />
        </button>

        {/* Lyrics toggle */}
        <button
          onClick={toggleLyrics}
          className={`p-1.5 rounded-full hover:bg-neutral-800 transition-colors ${
            isLyricsOpen ? "text-spotify-green" : "text-neutral-400 hover:text-white"
          }`}
          title="Lời bài hát"
        >
          <Mic2 className="h-4 w-4" />
        </button>

        {/* Queue toggle */}
        <button
          onClick={toggleQueue}
          className={`p-1.5 rounded-full hover:bg-neutral-800 transition-colors ${
            isQueueOpen ? "text-spotify-green" : "text-neutral-400 hover:text-white"
          }`}
          title="Danh sách chờ"
        >
          <ListMusic className="h-4 w-4" />
        </button>

        {/* Volume controls */}
        <div className="flex items-center gap-2 w-28 group">
          <button
            onClick={toggleMute}
            className="focus:outline-none"
            title={isMuted ? "Bật âm" : "Tắt âm"}
          >
            {renderVolumeIcon()}
          </button>
          <Slider
            value={[isMuted ? 0 : volume * 100]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="w-20"
          />
        </div>

        {/* Fullscreen button */}
        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(console.warn)
            } else {
              document.exitFullscreen().catch(console.warn)
            }
          }}
          className="p-1.5 text-neutral-400 hover:text-white transition-colors hidden sm:block"
          title="Toàn màn hình"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
    </footer>
  )
}

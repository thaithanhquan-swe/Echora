import React from "react"
import { usePlayer } from "@/context/PlayerContext"
import { ViewType } from "@/types/music"
import { PlayerTrackInfo } from "./PlayerTrackInfo"
import { PlayerControls } from "./PlayerControls"
import { ProgressBar } from "./ProgressBar"
import { PlayerExtraControls } from "./PlayerExtraControls"

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
    toggleRightSidebar,
    toggleQueue,
  } = usePlayer()

  if (!currentTrack) {
    return null
  }

  const isLiked = likedSongIds.has(currentTrack.id)
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <footer className="w-full bg-black border-t border-neutral-900 text-white select-none z-40 shrink-0 relative">
      {/* Mobile Top Progress Accent Bar (on screens < 640px) */}
      <div className="sm:hidden w-full h-[2px] bg-neutral-800 absolute top-0 left-0">
        <div
          className="h-full bg-spotify-green transition-all duration-200"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="h-20 sm:h-24 px-3 sm:px-6 flex items-center justify-between gap-2">
        {/* 1. Track Info (Left - min 180px) */}
        <PlayerTrackInfo
          currentTrack={currentTrack}
          isLiked={isLiked}
          onToggleLike={() => toggleLike(currentTrack.id, currentTrack)}
          onNavigate={onNavigate}
        />

        {/* 2. Playback Controls & Progress Bar (Center - 40% width on tablet/desktop) */}
        <div className="flex flex-col items-center flex-1 max-w-xl px-2 sm:px-4">
          {currentTrack.playbackSource === "unavailable" ? (
            <span className="text-xs text-spotify-subdued text-center">
              Không tìm thấy bài hát có thể phát trong Echora
            </span>
          ) : (
            <>
              <PlayerControls
                isPlaying={isPlaying}
                isShuffled={isShuffled}
                repeatMode={repeatMode}
                onTogglePlay={togglePlay}
                onPrevTrack={prevTrack}
                onNextTrack={nextTrack}
                onToggleShuffle={toggleShuffle}
                onToggleRepeat={toggleRepeat}
              />

              <div className="w-full hidden sm:block">
                <ProgressBar
                  currentTime={currentTime}
                  duration={duration}
                  onSeek={seekTo}
                />
              </div>
            </>
          )}
        </div>

        {/* 3. Extra Controls: Queue, Volume, Fullscreen, Video (Right) */}
        <PlayerExtraControls
          isRightSidebarOpen={isRightSidebarOpen}
          isQueueOpen={isQueueOpen}
          volume={volume}
          isMuted={isMuted}
          onToggleRightSidebar={toggleRightSidebar}
          onToggleQueue={toggleQueue}
          onVolumeChange={setVolume}
          onToggleMute={toggleMute}
        />
      </div>
    </footer>
  )
}

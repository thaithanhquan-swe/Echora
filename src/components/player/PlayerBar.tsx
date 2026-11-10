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

  return (
    <footer className="h-20 sm:h-[88px] w-full bg-black border-t border-neutral-900 px-4 flex items-center justify-between text-white select-none z-40 shrink-0">
      {/* 1. Track Info (Left - min 200px) */}
      <PlayerTrackInfo
        currentTrack={currentTrack}
        isLiked={isLiked}
        onToggleLike={() => toggleLike(currentTrack.id, currentTrack)}
        onNavigate={onNavigate}
      />

      {/* 2. Playback Controls & Progress Bar (Center - 40% width) */}
      <div className="flex flex-col items-center max-w-xl w-[40%] px-4">
        {currentTrack.playbackSource === "unavailable" ? (
          <span className="text-xs text-spotify-subdued">Không tìm thấy video YouTube công khai có thể phát</span>
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

            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={seekTo}
            />
          </>
        )}
      </div>

      {/* 3. Extra Controls: Queue, Volume, Fullscreen (Right - 30% width) */}
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
    </footer>
  )
}

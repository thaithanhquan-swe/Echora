import React from "react"
import { usePlayer } from "@/context/PlayerContext"
import { Song } from "@/types/music"
import { SpotifyPlayIcon, SpotifyPauseIcon } from "@/components/icons/SpotifyIcons"

interface QuickPickCardProps {
  title: string
  imageUrl: string
  songs?: Song[]
  onClick?: () => void
}

export const QuickPickCard: React.FC<QuickPickCardProps> = ({
  title,
  imageUrl,
  songs = [],
  onClick,
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer()

  const isCurrentPlayingContext =
    songs.length > 0 && songs.some((s) => s.id === currentTrack?.id)

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isCurrentPlayingContext) {
      togglePlay()
    } else if (songs.length > 0) {
      playTrack(songs[0], songs.slice(1))
    }
  }

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 bg-white/5 hover:bg-white/10 rounded overflow-hidden cursor-pointer group transition-colors pr-4 h-14 select-none relative"
    >
      <img
        src={imageUrl}
        alt={title}
        className="h-14 w-14 object-cover shrink-0 shadow-md"
      />

      <span className="font-bold text-sm text-white truncate flex-1 tracking-tight">
        {title}
      </span>

      {songs.length > 0 && (
        <button
          onClick={handlePlay}
          className={`h-9 w-9 rounded-full bg-spotify-green text-black flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 focus:outline-none ${
            isCurrentPlayingContext && isPlaying
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          }`}
          title="Phát"
        >
          {isCurrentPlayingContext && isPlaying ? (
            <SpotifyPauseIcon size={14} className="fill-black text-black" />
          ) : (
            <SpotifyPlayIcon size={14} className="fill-black text-black ml-0.5" />
          )}
        </button>
      )}
    </div>
  )
}

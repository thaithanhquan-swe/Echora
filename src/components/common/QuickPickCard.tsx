import React from "react"
import { Play, Pause } from "lucide-react"
import { usePlayer } from "@/context/PlayerContext"
import { Song } from "@/types/music"
import { MarqueeText } from "./MarqueeText"

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
      className="flex items-center gap-3 sm:gap-4 bg-white/5 hover:bg-white/15 rounded-md overflow-hidden cursor-pointer group transition-all duration-200 pr-3 sm:pr-4 h-16 sm:h-20 select-none relative shadow-sm hover:shadow-md"
    >
      <img
        src={imageUrl}
        alt={title}
        loading="lazy"
        className="h-16 w-16 sm:h-20 sm:w-20 object-cover shrink-0 shadow-md"
      />

      <MarqueeText className="font-bold text-sm sm:text-base text-white flex-1 min-w-0 tracking-tight">
        {title}
      </MarqueeText>

      {songs.length > 0 && (
        <button
          onClick={handlePlay}
          className={`hidden sm:flex h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-spotify-green text-black items-center justify-center shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 focus:outline-none ${
            isCurrentPlayingContext && isPlaying
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          }`}
          title="Phát"
        >
          {isCurrentPlayingContext && isPlaying ? (
            <Pause className="h-5 w-5 fill-black text-black" />
          ) : (
            <Play className="h-5 w-5 fill-black text-black ml-0.5" />
          )}
        </button>
      )}
    </div>
  )
}

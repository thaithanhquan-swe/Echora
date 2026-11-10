import React from "react"
import { Play, Pause } from "lucide-react"
import { usePlayer } from "@/context/PlayerContext"
import { Song } from "@/types/music"
import { MarqueeText } from "./MarqueeText"

interface MediaCardProps {
  id: string
  title: string
  subtitle: string
  imageUrl: string
  type?: "playlist" | "album" | "artist"
  songs?: Song[]
  onClick?: () => void
}

export const MediaCard: React.FC<MediaCardProps> = ({
  title,
  subtitle,
  imageUrl,
  type = "playlist",
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

  const isArtist = type === "artist"

  return (
    <div
      onClick={onClick}
      className="p-3.5 sm:p-4 rounded-lg bg-[#181818] hover:bg-[#282828] transition-all duration-300 group cursor-pointer flex flex-col relative select-none shadow-md hover:shadow-2xl"
    >
      {/* Artwork container */}
      <div className="relative mb-3.5 w-full aspect-square">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className={`w-full h-full object-cover shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-transform duration-300 ${
            isArtist ? "rounded-full" : "rounded-md"
          }`}
        />

        {/* Hover Floating Green Play Button */}
        {songs.length > 0 && (
          <button
            onClick={handlePlay}
            className={`absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 h-12 w-12 sm:h-13 sm:w-13 rounded-full bg-spotify-green text-black flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-108 active:scale-95 hover:bg-spotify-lightgreen focus:outline-none ${
              isCurrentPlayingContext && isPlaying
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
            }`}
            title="Phát"
          >
            {isCurrentPlayingContext && isPlaying ? (
              <Pause className="h-5 w-5 sm:h-6 sm:w-6 fill-black text-black" />
            ) : (
              <Play className="h-5 w-5 sm:h-6 sm:w-6 fill-black text-black ml-0.5" />
            )}
          </button>
        )}
      </div>

      {/* Metadata */}
      <MarqueeText className="font-bold text-sm sm:text-base text-white group-hover:underline tracking-tight">
        {title}
      </MarqueeText>
      <p className="text-xs sm:text-sm text-spotify-subdued mt-1 line-clamp-2 leading-relaxed">
        {subtitle}
      </p>
    </div>
  )
}

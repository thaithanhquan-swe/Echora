import React from "react"
import { Play, Pause } from "lucide-react"
import { usePlayer } from "@/context/PlayerContext"
import { Song } from "@/types/music"

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
      className="p-3.5 rounded-md bg-neutral-900/60 hover:bg-neutral-800/80 transition-all duration-300 group cursor-pointer flex flex-col relative select-none"
    >
      {/* Artwork container */}
      <div className="relative mb-3.5 w-full aspect-square">
        <img
          src={imageUrl}
          alt={title}
          className={`w-full h-full object-cover shadow-lg transition-transform duration-300 ${
            isArtist ? "rounded-full" : "rounded"
          }`}
        />

        {/* Hover Floating Green Play Button */}
        {songs.length > 0 && (
          <button
            onClick={handlePlay}
            className={`absolute bottom-2 right-2 h-12 w-12 rounded-full bg-spotify-green text-black flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-spotify-lightgreen focus:outline-none ${
              isCurrentPlayingContext && isPlaying
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
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

      {/* Metadata */}
      <h3 className="font-bold text-sm text-white truncate group-hover:underline tracking-tight">
        {title}
      </h3>
      <p className="text-xs text-spotify-subdued mt-1 line-clamp-2 leading-relaxed">
        {subtitle}
      </p>
    </div>
  )
}

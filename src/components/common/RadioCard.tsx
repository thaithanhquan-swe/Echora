import React from "react"
import { Radio, Play, Pause } from "lucide-react"
import { RadioStation } from "@/data/mockData"
import { usePlayer } from "@/context/PlayerContext"

interface RadioCardProps {
  station: RadioStation
  onClick?: () => void
}

export const RadioCard: React.FC<RadioCardProps> = ({ station, onClick }) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer()

  const isCurrentPlayingContext =
    station.songs.length > 0 && station.songs.some((s) => s.id === currentTrack?.id)

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isCurrentPlayingContext) {
      togglePlay()
    } else if (station.songs.length > 0) {
      playTrack(station.songs[0], station.songs.slice(1))
    }
  }

  return (
    <div
      onClick={onClick}
      className="p-3.5 rounded-lg bg-[#181818]/60 hover:bg-[#282828] transition-all duration-300 group cursor-pointer flex flex-col relative select-none"
    >
      {/* Big Radio Artwork Box */}
      <div
        style={{ backgroundColor: station.color }}
        className="relative w-full aspect-square rounded-md overflow-hidden p-3.5 flex flex-col justify-between mb-3 text-black shadow-xl"
      >
        {/* Top Header inside card: Radio icon + "RADIO" tag */}
        <div className="flex items-center justify-between text-black font-black">
          <Radio className="h-5 w-5 stroke-[2.5]" />
          <span className="text-xs font-black tracking-widest uppercase">
            RADIO
          </span>
        </div>

        {/* Center / Large Circular Artist Cutout */}
        <div className="flex items-center justify-center my-auto py-2">
          <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden border-2 border-black/20 shadow-2xl">
            <img
              src={station.artistImageUrl}
              alt={station.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Card Title inside Artwork */}
        <h3 className="font-black text-xl text-black truncate tracking-tight text-left drop-shadow-sm pb-1">
          {station.title}
        </h3>

        {/* Floating Green Play Button on Hover */}
        <button
          onClick={handlePlay}
          className={`absolute bottom-3.5 right-3.5 h-12 w-12 rounded-full bg-spotify-green text-black flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-spotify-lightgreen focus:outline-none ${
            isCurrentPlayingContext && isPlaying
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
          }`}
          title="Phát đài phát thanh"
        >
          {isCurrentPlayingContext && isPlaying ? (
            <Pause className="h-5 w-5 fill-black text-black" />
          ) : (
            <Play className="h-5 w-5 fill-black text-black ml-0.5" />
          )}
        </button>
      </div>

      {/* Description below card */}
      <p className="text-xs text-spotify-subdued font-medium line-clamp-2 leading-relaxed">
        {station.description}
      </p>
    </div>
  )
}

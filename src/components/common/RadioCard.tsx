import React from "react"
import { RadioStation } from "@/data/mockData"
import { SpotifyLogo, SpotifyPlayIcon, SpotifyPauseIcon } from "@/components/icons/SpotifyIcons"
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
      className="p-3 rounded-md bg-neutral-900/60 hover:bg-neutral-800/80 transition-all duration-300 group cursor-pointer flex flex-col relative select-none"
    >
      {/* Radio Artwork Box */}
      <div
        style={{ backgroundColor: station.color }}
        className="relative w-full aspect-square rounded overflow-hidden p-3 flex flex-col justify-between mb-3 text-black shadow-lg"
      >
        {/* Top Header inside card: Logo + "RADIO" tag */}
        <div className="flex items-center justify-between text-black/80 font-black">
          <SpotifyLogo size={18} className="text-black" />
          <span className="text-[11px] font-black tracking-widest uppercase">
            RADIO
          </span>
        </div>

        {/* Center / Circular Artist Cutout */}
        <div className="flex items-center justify-center my-auto">
          <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-black/20 shadow-xl">
            <img
              src={station.artistImageUrl}
              alt={station.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Card Title inside Artwork */}
        <h3 className="font-black text-lg text-black truncate tracking-tight text-left drop-shadow-sm">
          {station.title}
        </h3>

        {/* Floating Green Play Button on Hover */}
        <button
          onClick={handlePlay}
          className={`absolute bottom-3 right-3 h-11 w-11 rounded-full bg-spotify-green text-black flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-spotify-lightgreen focus:outline-none ${
            isCurrentPlayingContext && isPlaying
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
          }`}
          title="Phát đài phát thanh"
        >
          {isCurrentPlayingContext && isPlaying ? (
            <SpotifyPauseIcon size={16} className="fill-black text-black" />
          ) : (
            <SpotifyPlayIcon size={16} className="fill-black text-black ml-0.5" />
          )}
        </button>
      </div>

      {/* Description below card */}
      <p className="text-xs text-spotify-subdued line-clamp-2 leading-relaxed">
        {station.description}
      </p>
    </div>
  )
}

import React from "react"
import { Song } from "@/types/music"
import { SpotifyPlayIcon, SpotifyPauseIcon } from "@/components/icons/SpotifyIcons"

interface TopResultCardProps {
  topResult: Song
  isPlaying: boolean
  allMatchingSongs: Song[]
  onPlaySong: (song: Song, queue: Song[]) => void
  onTogglePlay: () => void
}

export const TopResultCard: React.FC<TopResultCardProps> = ({
  topResult,
  isPlaying,
  allMatchingSongs,
  onPlaySong,
  onTogglePlay,
}) => {
  return (
    <div className="lg:col-span-5 flex flex-col select-none">
      <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
        Kết quả hàng đầu
      </h3>

      <div
        onClick={() => onPlaySong(topResult, allMatchingSongs)}
        className="flex-1 bg-neutral-900/80 hover:bg-neutral-800 p-5 rounded-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between relative shadow-lg"
      >
        <div>
          <img
            src={topResult.coverUrl}
            alt={topResult.title}
            className="h-24 w-24 rounded-md object-cover shadow-xl mb-4"
          />
          <h4 className="text-2xl font-bold text-white truncate mb-1 tracking-tight">
            {topResult.title}
          </h4>
          <p className="text-sm text-spotify-subdued">
            <span className="font-medium text-white">{topResult.artist}</span>
            <span className="mx-2">•</span>
            <span className="bg-neutral-800 text-neutral-300 text-xs px-2 py-0.5 rounded-full font-semibold">
              Bài hát
            </span>
          </p>
        </div>

        {/* Hover play button */}
        <div className="self-end mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onTogglePlay()
            }}
            className={`h-12 w-12 rounded-full bg-spotify-green text-black flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none ${
              isPlaying
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0"
            }`}
          >
            {isPlaying ? (
              <SpotifyPauseIcon size={18} className="fill-black text-black" />
            ) : (
              <SpotifyPlayIcon size={18} className="fill-black text-black ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

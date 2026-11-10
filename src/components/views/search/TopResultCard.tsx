import React from "react"
import { Play, Pause } from "lucide-react"
import { Song } from "@/types/music"

interface TopResultCardProps {
  topResult: Song
  isCurrent: boolean
  isPlaying: boolean
  allMatchingSongs: Song[]
  onPlaySong: (song: Song, queue: Song[]) => void
  onTogglePlay: () => void
}

export const TopResultCard: React.FC<TopResultCardProps> = ({
  topResult,
  isCurrent,
  isPlaying,
  allMatchingSongs,
  onPlaySong,
  onTogglePlay,
}) => {
  return (
    <div className="lg:col-span-5 flex flex-col select-none">
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">
        Kết quả hàng đầu
      </h3>

      <div
        onClick={() => onPlaySong(topResult, allMatchingSongs)}
        className="flex-1 bg-[#181818] hover:bg-[#282828] p-5 sm:p-6 rounded-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between relative shadow-xl"
      >
        <div>
          <img
            src={topResult.coverUrl}
            alt={topResult.title}
            loading="lazy"
            className="h-28 w-28 sm:h-32 sm:w-32 rounded-md object-cover shadow-2xl mb-4"
          />
          <h4 className="text-2xl sm:text-3xl font-extrabold text-white truncate mb-1 tracking-tight">
            {topResult.title}
          </h4>
          <p className="text-sm sm:text-base text-spotify-subdued">
            <span className="font-semibold text-white">{topResult.artist}</span>
            <span className="mx-2">•</span>
            <span className="bg-neutral-800 text-white text-xs px-2.5 py-1 rounded-full font-bold">
              Bài hát Echora
            </span>
          </p>
        </div>

        {/* Hover play button */}
        <div className="self-end mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (isCurrent) {
                onTogglePlay()
              } else {
                onPlaySong(topResult, allMatchingSongs)
              }
            }}
            className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-spotify-green text-black flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-108 active:scale-95 focus:outline-none ${
              isPlaying
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0"
            }`}
            title={isPlaying ? "Tạm dừng" : "Phát"}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 fill-black text-black" />
            ) : (
              <Play className="h-6 w-6 fill-black text-black ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

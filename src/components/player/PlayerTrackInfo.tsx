import React from "react"
import { PlusCircle, CheckCircle2 } from "lucide-react"
import { Song, ViewType } from "@/types/music"

interface PlayerTrackInfoProps {
  currentTrack: Song
  isLiked: boolean
  onToggleLike: (id: string) => void
  onNavigate?: (view: ViewType, id?: string) => void
}

export const PlayerTrackInfo: React.FC<PlayerTrackInfoProps> = ({
  currentTrack,
  isLiked,
  onToggleLike,
  onNavigate,
}) => {
  return (
    <div className="flex items-center gap-3.5 w-[30%] min-w-[180px] max-w-[360px] select-none">
      {/* Cover artwork */}
      <div className="relative group shrink-0">
        <img
          src={currentTrack.coverUrl}
          alt={currentTrack.title}
          className="h-14 w-14 rounded-md object-cover shadow-lg"
        />
      </div>

      {/* Title & Artist */}
      <div className="flex flex-col min-w-0 pr-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            onClick={() => onNavigate && onNavigate("album", currentTrack.albumId)}
            className="text-sm font-semibold text-white truncate hover:underline cursor-pointer tracking-tight"
          >
            {currentTrack.title}
          </span>
          <span className="text-[10px] bg-neutral-800 text-spotify-green border border-spotify-green/40 px-1.5 py-0.5 rounded-full font-bold shrink-0">
            Preview 30s
          </span>
        </div>
        <span
          onClick={() => onNavigate && onNavigate("artist", currentTrack.artistId)}
          className="text-xs text-spotify-subdued truncate hover:underline hover:text-white cursor-pointer transition-colors"
        >
          {currentTrack.artist}
        </span>
      </div>

      {/* Echora "+" / Add to Library button from screenshot */}
      <button
        onClick={() => onToggleLike(currentTrack.id)}
        className="text-spotify-subdued hover:text-white p-1 rounded-full transition-transform active:scale-125 shrink-0 focus:outline-none"
        title={isLiked ? "Đã lưu vào thư viện" : "Thêm vào thư viện"}
      >
        {isLiked ? (
          <CheckCircle2 className="h-5 w-5 text-spotify-green fill-spotify-green/20" />
        ) : (
          <PlusCircle className="h-5 w-5 stroke-[1.8] hover:scale-105" />
        )}
      </button>
    </div>
  )
}

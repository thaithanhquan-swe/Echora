import React from "react"
import { PlusCircle, CheckCircle2, Search } from "lucide-react"
import { Song, ViewType } from "@/types/music"
import { MarqueeText } from "@/components/common/MarqueeText"

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
  const playbackLabel = currentTrack.playbackSource === "youtube"
    ? "Echora Music"
    : "Không tìm thấy bài hát"

  return (
    <div className="flex items-center gap-3 sm:gap-3.5 w-auto sm:w-[30%] min-w-0 sm:min-w-[180px] max-w-[360px] select-none">
      <div className="relative group shrink-0">
        <img
          src={currentTrack.coverUrl}
          alt={currentTrack.title}
          className="h-12 w-12 sm:h-14 sm:w-14 rounded-md object-cover shadow-lg"
        />
      </div>

      <div className="flex flex-col min-w-0 pr-1">
        <MarqueeText
          onClick={() => onNavigate && onNavigate("album", currentTrack.albumId)}
          className="text-sm sm:text-base font-semibold text-white hover:underline cursor-pointer tracking-tight"
        >
          {currentTrack.title}
        </MarqueeText>
        <span
          onClick={() => onNavigate && onNavigate("artist", currentTrack.artistId)}
          className="text-xs sm:text-sm text-spotify-subdued truncate hover:underline hover:text-white cursor-pointer transition-colors"
        >
          {currentTrack.artist}
        </span>
        <span className="hidden sm:flex items-center gap-1.5 text-[11px] text-spotify-subdued truncate">
          <span className="truncate">{playbackLabel}</span>
          {onNavigate && (
            <button
              onClick={() => onNavigate("search", `${currentTrack.title} ${currentTrack.artist}`)}
              className="inline-flex shrink-0 items-center gap-0.5 text-spotify-green hover:underline"
              aria-label="Tìm kiếm trên Echora"
            >
              <Search className="h-3 w-3" /> Tìm bài
            </button>
          )}
        </span>
      </div>

      <button
        onClick={() => onToggleLike(currentTrack.id)}
        className="text-spotify-subdued hover:text-white p-1 rounded-full transition-transform active:scale-125 shrink-0 focus:outline-none"
        title={isLiked ? "Đã lưu vào thư viện" : "Thêm vào thư viện"}
      >
        {isLiked ? (
          <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-spotify-green fill-spotify-green/20" />
        ) : (
          <PlusCircle className="h-5 w-5 sm:h-6 sm:w-6 stroke-[1.8] hover:scale-105" />
        )}
      </button>
    </div>
  )
}

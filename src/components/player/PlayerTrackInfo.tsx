import React from "react"
import { PlusCircle, CheckCircle2, Search } from "lucide-react"
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
  const playbackLabel = currentTrack.playbackSource === "audius"
    ? "Bản đầy đủ · Audius"
    : currentTrack.playbackSource === "freetouse"
      ? "Bản đầy đủ · Free To Use"
      : currentTrack.playbackSource === "jamendo"
        ? "Bản đầy đủ · Jamendo"
      : "Không có nguồn phát đầy đủ công khai"

  return (
    <div className="flex items-center gap-3.5 w-[30%] min-w-[180px] max-w-[360px] select-none">
      <div className="relative group shrink-0">
        <img
          src={currentTrack.coverUrl}
          alt={currentTrack.title}
          className="h-14 w-14 rounded-md object-cover shadow-lg"
        />
      </div>

      <div className="flex flex-col min-w-0 pr-1">
        <span
          onClick={() => onNavigate && onNavigate("album", currentTrack.albumId)}
          className="text-sm font-semibold text-white truncate hover:underline cursor-pointer tracking-tight"
        >
          {currentTrack.title}
        </span>
        <span
          onClick={() => onNavigate && onNavigate("artist", currentTrack.artistId)}
          className="text-xs text-spotify-subdued truncate hover:underline hover:text-white cursor-pointer transition-colors"
        >
          {currentTrack.artist}
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-spotify-subdued truncate">
          <span className="truncate">{playbackLabel}</span>
          {onNavigate && (
            <button
              onClick={() => onNavigate("search", `${currentTrack.title} ${currentTrack.artist}`)}
              className="inline-flex shrink-0 items-center gap-0.5 text-spotify-green hover:underline"
              aria-label="Tìm bản đầy đủ trong nguồn nhạc công khai"
            >
              <Search className="h-3 w-3" /> Tìm nguồn
            </button>
          )}
        </span>
        {currentTrack.playbackSource === "freetouse" && (
          <a
            href="https://freetouse.com/music"
            target="_blank"
            rel="noreferrer"
            className="text-[10px] text-spotify-green hover:underline"
          >
            Free To Use · nghe miễn phí
          </a>
        )}
        {currentTrack.playbackSource === "jamendo" && currentTrack.sourceUrl && (
          <a
            href={currentTrack.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[10px] text-spotify-green hover:underline"
          >
            Jamendo · thông tin và license
          </a>
        )}
      </div>

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

import React, { useState } from "react"
import { PlusCircle, CheckCircle2, ExternalLink, X } from "lucide-react"
import { Song, ViewType } from "@/types/music"
import { usePlayer } from "@/context/PlayerContext"

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
  const [isSpotifyEmbedOpen, setIsSpotifyEmbedOpen] = useState(false)
  const { pause } = usePlayer()
  const spotifyTrackUrl = `https://open.spotify.com/track/${encodeURIComponent(currentTrack.id)}`

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
        <span className="flex items-center gap-1.5 text-[10px] text-spotify-subdued">
          <span>Bản nghe thử</span>
          <button
            onClick={() => {
              pause()
              setIsSpotifyEmbedOpen(true)
            }}
            className="inline-flex items-center gap-0.5 text-spotify-green hover:underline"
            aria-label="Nghe trọn bài trong Echora"
          >
            Nghe trọn bài
          </button>
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

      {isSpotifyEmbedOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsSpotifyEmbedOpen(false)
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label={`Nghe trọn bài ${currentTrack.title}`}
            className="w-full max-w-md rounded-xl border border-neutral-700 bg-neutral-900 p-4 shadow-2xl"
          >
            <div className="mb-3 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold text-white">Nghe trọn bài</h2>
                <p className="truncate text-xs text-neutral-400">
                  {currentTrack.title} · {currentTrack.artist}
                </p>
              </div>
              <button
                onClick={() => setIsSpotifyEmbedOpen(false)}
                className="rounded p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                aria-label="Đóng trình phát Spotify"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <iframe
              title={`Spotify player: ${currentTrack.title}`}
              src={`https://open.spotify.com/embed/track/${encodeURIComponent(currentTrack.id)}?utm_source=generator&theme=0`}
              width="100%"
              height="152"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="overflow-hidden rounded-lg border-0"
            />

            <a
              href={spotifyTrackUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs text-spotify-green hover:underline"
            >
              Mở trang Spotify <ExternalLink className="h-3 w-3" />
            </a>
          </section>
        </div>
      )}
    </div>
  )
}

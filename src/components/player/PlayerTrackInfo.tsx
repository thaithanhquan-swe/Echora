import React, { useEffect, useState } from "react"
import { PlusCircle, CheckCircle2, ExternalLink, X } from "lucide-react"
import { Song, ViewType } from "@/types/music"
import { usePlayer } from "@/context/PlayerContext"
import { findYouTubeVideo } from "@/services/youtubeApi"

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
  const [isFullTrackOpen, setIsFullTrackOpen] = useState(false)
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null)
  const [youtubeError, setYoutubeError] = useState<string | null>(null)
  const [isSearchingYouTube, setIsSearchingYouTube] = useState(false)
  const { pause } = usePlayer()
  const spotifyTrackUrl = `https://open.spotify.com/track/${encodeURIComponent(currentTrack.id)}`

  useEffect(() => {
    if (!isFullTrackOpen) return

    const controller = new AbortController()
    setYoutubeVideoId(null)
    setYoutubeError(null)
    setIsSearchingYouTube(true)
    findYouTubeVideo(currentTrack, controller.signal)
      .then(setYoutubeVideoId)
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setYoutubeError(error instanceof Error ? error.message : "Không thể tìm video YouTube.")
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsSearchingYouTube(false)
      })

    return () => controller.abort()
  }, [isFullTrackOpen, currentTrack.id])

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
          <span>
            {currentTrack.playbackSource === "audius"
              ? "Bản đầy đủ · Audius"
              : currentTrack.playbackSource === "unavailable"
                ? "Chưa có nguồn phát phù hợp"
                : "Bản nghe thử · Spotify"}
          </span>
          <button
            onClick={() => {
              pause()
              setIsFullTrackOpen(true)
            }}
            className="inline-flex items-center gap-0.5 text-spotify-green hover:underline"
            aria-label="Tìm và phát bản đầy đủ trên YouTube"
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

      {isFullTrackOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsFullTrackOpen(false)
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label={`Nghe trọn bài ${currentTrack.title}`}
            className="w-full max-w-2xl rounded-xl border border-neutral-700 bg-neutral-900 p-4 shadow-2xl"
          >
            <div className="mb-3 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold text-white">Nghe trọn bài trên YouTube</h2>
                <p className="truncate text-xs text-neutral-400">
                  {currentTrack.title} · {currentTrack.artist}
                </p>
              </div>
              <button
                onClick={() => setIsFullTrackOpen(false)}
                className="rounded p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                aria-label="Đóng trình phát YouTube"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {isSearchingYouTube && (
              <div className="flex h-56 items-center justify-center rounded-lg bg-neutral-950 text-sm text-neutral-400">
                Đang tìm bản đầy đủ...
              </div>
            )}

            {youtubeVideoId && (
              <iframe
                title={`YouTube player: ${currentTrack.title}`}
                src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeVideoId)}?autoplay=1&playsinline=1&rel=0`}
                width="100%"
                height="360"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                loading="eager"
                className="overflow-hidden rounded-lg border-0"
              />
            )}

            {youtubeError && (
              <div className="rounded-lg bg-neutral-950 p-4 text-sm text-neutral-300">
                <p>{youtubeError}</p>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${currentTrack.title} ${currentTrack.artist} official audio`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-spotify-green hover:underline"
                >
                  Tìm trên YouTube <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

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

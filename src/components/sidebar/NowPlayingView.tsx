import React, { useEffect, useState } from "react"
import { PlusCircle, MoreHorizontal } from "lucide-react"
import { Song, Artist, ViewType } from "@/types/music"
import { formatNumber } from "@/lib/utils"
import { spotifyApi, mapApiArtistToArtist } from "@/services/spotifyApi"

interface NowPlayingViewProps {
  currentTrack: Song
  artist?: Artist
  isLiked: boolean
  queue: Song[]
  onToggleLike: (id: string) => void
  onOpenQueue: () => void
  onPlayTrack: (song: Song) => void
  onNavigate?: (view: ViewType, id?: string) => void
  hideMedia?: boolean
}

export const NowPlayingView: React.FC<NowPlayingViewProps> = ({
  currentTrack,
  artist: propArtist,
  isLiked,
  queue,
  onToggleLike,
  onOpenQueue,
  onPlayTrack,
  onNavigate,
  hideMedia = false,
}) => {
  const [artistDetails, setArtistDetails] = useState<Artist | null>(propArtist || null)

  useEffect(() => {
    let isMounted = true
    if (currentTrack.artistId) {
      spotifyApi
        .getArtist(currentTrack.artistId)
        .then((res) => {
          if (isMounted && res.success && res.artist) {
            setArtistDetails(mapApiArtistToArtist(res.artist))
          }
        })
        .catch(() => {})
    } else {
      setArtistDetails(null)
    }
    return () => {
      isMounted = false
    }
  }, [currentTrack.artistId])

  const displayArtist = artistDetails || propArtist
  const nextTrack = queue.length > 0 ? queue[0] : null

  return (
    <div className="space-y-5 select-none pb-4">
      {/* 1. Big Album Artwork (Full width of the right panel) */}
      {!hideMedia && (
        <div className="relative aspect-square rounded-lg overflow-hidden shadow-2xl group bg-neutral-950">
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="w-full h-full object-cover filter contrast-110"
          />
        </div>
      )}

      {/* 2. Track Title, Artists & "+" Add Circle Button */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2
            onClick={() => {
              if (currentTrack.albumId && onNavigate) {
                onNavigate("album", currentTrack.albumId)
              }
            }}
            className="font-extrabold text-2xl text-white hover:underline cursor-pointer truncate tracking-tight"
          >
            {currentTrack.title}
          </h2>
          <p
            onClick={() => {
              if (currentTrack.artistId && onNavigate) {
                onNavigate("artist", currentTrack.artistId)
              }
            }}
            className="text-spotify-subdued hover:text-white hover:underline cursor-pointer text-sm font-semibold mt-0.5 transition-colors"
          >
            {currentTrack.artist}
          </p>
        </div>

        {/* Echora "+" in circle button */}
        <div className="flex items-center gap-1 shrink-0 pt-1">
          <button
            onClick={() => onToggleLike(currentTrack.id)}
            className="text-spotify-subdued hover:text-white transition-colors focus:outline-none"
            title={isLiked ? "Đã lưu vào thư viện" : "Thêm vào thư viện"}
          >
            <PlusCircle
              className={`h-6 w-6 stroke-[1.8] ${
                isLiked ? "text-spotify-green fill-spotify-green/20" : ""
              }`}
            />
          </button>
          <button className="text-spotify-subdued hover:text-white transition-colors focus:outline-none p-1">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 3. Next in Queue Card (Replaces lyrics preview card cleanly) */}
      {nextTrack && (
        <div
          onClick={onOpenQueue}
          className="rounded-xl p-4 bg-neutral-800/60 hover:bg-neutral-800 transition-colors cursor-pointer border border-neutral-700/30 shadow-md group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-spotify-subdued">
              Tiếp theo trong danh sách chờ
            </span>
            <span className="text-xs text-spotify-green font-semibold group-hover:underline">
              Mở hàng đợi
            </span>
          </div>
          <div className="flex items-center gap-3">
            <img
              src={nextTrack.coverUrl}
              alt={nextTrack.title}
              className="h-11 w-11 rounded object-cover shadow"
            />
            <div className="min-w-0 flex-1">
              <p className="text-white font-bold text-sm truncate group-hover:text-spotify-green transition-colors">
                {nextTrack.title}
              </p>
              <p className="text-spotify-subdued text-xs truncate">
                {nextTrack.artist}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. About the artist Card */}
      {displayArtist && (
        <div className="rounded-xl overflow-hidden bg-neutral-800/80 border border-neutral-700/40 shadow-xl">
          <div className="relative h-48 overflow-hidden">
            <img
              src={displayArtist.bannerUrl || currentTrack.coverUrl}
              alt={displayArtist.name}
              className="w-full h-full object-cover filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
            <span className="absolute top-3 left-3 text-xs font-bold text-white drop-shadow">
              Thông tin nghệ sĩ
            </span>
          </div>

          <div className="p-4 -mt-6 relative">
            <h4
              onClick={() => onNavigate && onNavigate("artist", displayArtist.id)}
              className="font-bold text-base text-white hover:underline cursor-pointer tracking-tight"
            >
              {displayArtist.name}
            </h4>
            <p className="text-xs text-spotify-subdued mt-1 font-semibold">
              {formatNumber(displayArtist.followers)} người theo dõi
            </p>
            <p className="text-xs text-neutral-300 mt-3 line-clamp-3 leading-relaxed">
              {displayArtist.bio}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

import React from "react"
import { MoreHorizontal } from "lucide-react"
import { Song, Artist, ViewType } from "@/types/music"
import { formatNumber } from "@/lib/utils"
import { SpotifyHeartIcon } from "@/components/icons/SpotifyIcons"

interface NowPlayingViewProps {
  currentTrack: Song
  artist?: Artist
  isLiked: boolean
  queue: Song[]
  onToggleLike: (id: string) => void
  onOpenQueue: () => void
  onPlayTrack: (song: Song) => void
  onNavigate?: (view: ViewType, id?: string) => void
}

export const NowPlayingView: React.FC<NowPlayingViewProps> = ({
  currentTrack,
  artist,
  isLiked,
  queue,
  onToggleLike,
  onOpenQueue,
  onPlayTrack,
  onNavigate,
}) => {
  return (
    <div className="space-y-6 select-none">
      {/* Big Album Artwork */}
      <div className="relative aspect-square rounded-lg overflow-hidden shadow-2xl group">
        <img
          src={currentTrack.coverUrl}
          alt={currentTrack.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title & Artist & Like */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2
            onClick={() => onNavigate && onNavigate("album", currentTrack.albumId)}
            className="font-bold text-xl text-white hover:underline cursor-pointer truncate tracking-tight"
          >
            {currentTrack.title}
          </h2>
          <p
            onClick={() => onNavigate && onNavigate("artist", currentTrack.artistId)}
            className="text-spotify-subdued hover:text-white hover:underline cursor-pointer text-sm font-medium mt-0.5 transition-colors"
          >
            {currentTrack.artist}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onToggleLike(currentTrack.id)}
            className="p-2 text-spotify-subdued hover:text-white transition-colors focus:outline-none"
            title={isLiked ? "Bỏ thích" : "Thích"}
          >
            <SpotifyHeartIcon size={20} filled={isLiked} />
          </button>
          <button className="p-2 text-spotify-subdued hover:text-white transition-colors focus:outline-none">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* About Artist Card */}
      {artist && (
        <div className="rounded-xl overflow-hidden bg-neutral-800/70 border border-neutral-700/50">
          <div className="relative h-44 overflow-hidden">
            <img
              src={artist.bannerUrl}
              alt={artist.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
            <span className="absolute top-3 left-3 text-xs font-bold uppercase tracking-wider text-white drop-shadow">
              Thông tin về nghệ sĩ
            </span>
          </div>

          <div className="p-4 -mt-6 relative">
            <h4
              onClick={() => onNavigate && onNavigate("artist", artist.id)}
              className="font-bold text-base text-white hover:underline cursor-pointer tracking-tight"
            >
              {artist.name}
            </h4>
            <p className="text-xs text-spotify-subdued mt-1 font-medium">
              {formatNumber(artist.monthlyListeners)} người nghe hàng tháng
            </p>
            <p className="text-xs text-neutral-300 mt-3 line-clamp-3 leading-relaxed">
              {artist.bio}
            </p>
          </div>
        </div>
      )}

      {/* Next In Queue Preview */}
      {queue.length > 0 && (
        <div className="rounded-xl p-4 bg-neutral-800/50 border border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-spotify-subdued">
              Tiếp theo trong danh sách
            </h4>
            <button
              onClick={onOpenQueue}
              className="text-xs font-bold text-neutral-300 hover:text-white hover:underline focus:outline-none"
            >
              Mở hàng đợi
            </button>
          </div>

          <div
            onClick={() => onPlayTrack(queue[0])}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src={queue[0].coverUrl}
              alt={queue[0].title}
              className="h-12 w-12 rounded object-cover shadow"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-white truncate group-hover:text-spotify-green transition-colors">
                {queue[0].title}
              </p>
              <p className="text-xs text-spotify-subdued truncate">
                {queue[0].artist}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

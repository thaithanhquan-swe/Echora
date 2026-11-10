import React from "react"
import { PlusCircle, MoreHorizontal } from "lucide-react"
import { Song, Artist, ViewType } from "@/types/music"
import { formatNumber } from "@/lib/utils"

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
  onToggleLike,
  onNavigate,
}) => {
  const lyricsLines = currentTrack.lyrics?.slice(1, 3) || [
    { time: 0, text: "Oh-ooh-ooh-ooh" },
    { time: 10, text: "(Nhìn người Việt b-b-b-bay mà không cần cánh kìa)" },
  ]

  return (
    <div className="space-y-5 select-none pb-4">
      {/* 1. Big Album Artwork (Full width of the right panel) */}
      <div className="relative aspect-square rounded-lg overflow-hidden shadow-2xl group bg-neutral-950">
        <img
          src={currentTrack.coverUrl}
          alt={currentTrack.title}
          className="w-full h-full object-cover filter contrast-110"
        />
      </div>

      {/* 2. Track Title, Artists & "+" Add Circle Button */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2
            onClick={() => onNavigate && onNavigate("album", currentTrack.albumId)}
            className="font-extrabold text-2xl text-white hover:underline cursor-pointer truncate tracking-tight"
          >
            {currentTrack.title}
          </h2>
          <p
            onClick={() => onNavigate && onNavigate("artist", currentTrack.artistId)}
            className="text-spotify-subdued hover:text-white hover:underline cursor-pointer text-sm font-semibold mt-0.5 transition-colors"
          >
            {currentTrack.artist}
          </p>
        </div>

        {/* Spotify "+" in circle button */}
        <div className="flex items-center gap-1 shrink-0 pt-1">
          <button
            onClick={() => onToggleLike(currentTrack.id)}
            className="text-spotify-subdued hover:text-white transition-colors focus:outline-none"
            title={isLiked ? "Saved to Your Library" : "Add to Your Library"}
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

      {/* 3. Lyrics Preview Card (Exact Dark Burgundy card from screenshot) */}
      <div className="rounded-xl p-5 bg-[#59161a] hover:bg-[#681a1f] transition-colors cursor-pointer group shadow-xl">
        <p className="text-xs font-bold text-white/80 uppercase tracking-wider mb-3">
          Lyrics preview
        </p>
        <div className="space-y-1.5 text-white font-extrabold text-xl leading-snug tracking-tight">
          <p className="line-clamp-2">
            {lyricsLines[0]?.text || "Oh-ooh-ooh-ooh"}
          </p>
          <p className="text-white/60 line-clamp-2">
            {lyricsLines[1]?.text || "(Nhìn người Việt b-b-b-bay mà không cần cánh kìa)"}
          </p>
        </div>
      </div>

      {/* 4. About the artist Card */}
      {artist && (
        <div className="rounded-xl overflow-hidden bg-neutral-800/80 border border-neutral-700/40 shadow-xl">
          <div className="relative h-48 overflow-hidden">
            <img
              src={artist.bannerUrl}
              alt={artist.name}
              className="w-full h-full object-cover filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
            <span className="absolute top-3 left-3 text-xs font-bold text-white drop-shadow">
              About the artist
            </span>
          </div>

          <div className="p-4 -mt-6 relative">
            <h4
              onClick={() => onNavigate && onNavigate("artist", artist.id)}
              className="font-bold text-base text-white hover:underline cursor-pointer tracking-tight"
            >
              {artist.name}
            </h4>
            <p className="text-xs text-spotify-subdued mt-1 font-semibold">
              {formatNumber(artist.monthlyListeners)} monthly listeners
            </p>
            <p className="text-xs text-neutral-300 mt-3 line-clamp-3 leading-relaxed">
              {artist.bio}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

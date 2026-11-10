import React from "react"
import { MoreHorizontal } from "lucide-react"
import { Song, ViewType } from "@/types/music"
import { usePlayer } from "@/context/PlayerContext"
import { formatTime } from "@/lib/utils"
import {
  SpotifyPlayIcon,
  SpotifyPauseIcon,
  SpotifyHeartIcon,
} from "@/components/icons/SpotifyIcons"

interface TrackRowProps {
  song: Song
  index: number
  contextSongs?: Song[]
  showAlbum?: boolean
  showDateAdded?: boolean
  onNavigate?: (view: ViewType, id?: string) => void
}

export const TrackRow: React.FC<TrackRowProps> = ({
  song,
  index,
  contextSongs,
  showAlbum = true,
  showDateAdded = true,
  onNavigate,
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlay, likedSongIds, toggleLike } = usePlayer()

  const isCurrentSong = currentTrack?.id === song.id
  const isLiked = likedSongIds.has(song.id)

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isCurrentSong) {
      togglePlay()
    } else {
      playTrack(song, contextSongs)
    }
  }

  return (
    <div
      onDoubleClick={() => playTrack(song, contextSongs)}
      className="grid grid-cols-[16px_1fr_auto] md:grid-cols-[16px_4fr_3fr_minmax(120px,1fr)] lg:grid-cols-[16px_6fr_4fr_3fr_minmax(100px,1fr)] items-center gap-4 px-4 py-2.5 rounded-md hover:bg-white/10 group text-spotify-subdued text-sm select-none transition-colors"
    >
      {/* 1. Track Number or Play/Pause Button / Equalizer */}
      <div className="flex items-center justify-center w-4 text-center">
        {isCurrentSong && isPlaying ? (
          <div className="flex items-end gap-[2px] h-3.5 group-hover:hidden">
            <span className="w-[3px] bg-spotify-green animate-wave-1 rounded-full" />
            <span className="w-[3px] bg-spotify-green animate-wave-2 rounded-full" />
            <span className="w-[3px] bg-spotify-green animate-wave-3 rounded-full" />
            <span className="w-[3px] bg-spotify-green animate-wave-4 rounded-full" />
          </div>
        ) : (
          <span
            className={`text-sm tabular-nums group-hover:hidden ${
              isCurrentSong ? "text-spotify-green font-semibold" : "text-spotify-subdued"
            }`}
          >
            {index + 1}
          </span>
        )}

        <button
          onClick={handlePlayClick}
          className="hidden group-hover:flex items-center justify-center text-white focus:outline-none"
        >
          {isCurrentSong && isPlaying ? (
            <SpotifyPauseIcon size={12} className="fill-white text-white" />
          ) : (
            <SpotifyPlayIcon size={12} className="fill-white text-white ml-0.5" />
          )}
        </button>
      </div>

      {/* 2. Title & Artist Info */}
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={song.coverUrl}
          alt={song.title}
          className="h-10 w-10 rounded object-cover shrink-0 shadow"
        />
        <div className="flex flex-col min-w-0">
          <span
            onClick={handlePlayClick}
            className={`font-semibold tracking-tight truncate cursor-pointer hover:underline ${
              isCurrentSong ? "text-spotify-green" : "text-white"
            }`}
          >
            {song.title}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-spotify-subdued">
            {song.explicit && (
              <span className="bg-neutral-600 text-black text-[10px] font-bold px-1 rounded-sm leading-tight">
                E
              </span>
            )}
            <span
              onClick={(e) => {
                e.stopPropagation()
                onNavigate && onNavigate("artist", song.artistId)
              }}
              className="truncate hover:underline hover:text-white cursor-pointer transition-colors"
            >
              {song.artist}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Album Column */}
      {showAlbum && (
        <div className="hidden md:block truncate">
          <span
            onClick={(e) => {
              e.stopPropagation()
              onNavigate && onNavigate("album", song.albumId)
            }}
            className="text-spotify-subdued hover:text-white hover:underline cursor-pointer text-xs truncate transition-colors"
          >
            {song.album}
          </span>
        </div>
      )}

      {/* 4. Date Added */}
      {showDateAdded && (
        <div className="hidden lg:block text-spotify-subdued text-xs">
          {song.addedAt || "1 ngày trước"}
        </div>
      )}

      {/* 5. Like button & Duration */}
      <div className="flex items-center justify-end gap-3 text-spotify-subdued text-xs tabular-nums">
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleLike(song.id)
          }}
          className={`opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none ${
            isLiked ? "!opacity-100 text-spotify-green" : "hover:text-white"
          }`}
          title={isLiked ? "Bỏ thích" : "Thích"}
        >
          <SpotifyHeartIcon size={16} filled={isLiked} />
        </button>

        <span className="w-10 text-right">{formatTime(song.duration)}</span>

        <button
          onClick={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity p-1 focus:outline-none"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

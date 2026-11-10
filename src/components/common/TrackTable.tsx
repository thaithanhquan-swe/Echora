import React from "react"
import { Song, ViewType } from "@/types/music"
import { TrackRow } from "./TrackRow"
import { SpotifyClockIcon } from "@/components/icons/SpotifyIcons"

interface TrackTableProps {
  songs: Song[]
  contextSongs?: Song[]
  showAlbum?: boolean
  showDateAdded?: boolean
  emptyMessage?: React.ReactNode
  onNavigate?: (view: ViewType, id?: string) => void
}

export const TrackTable: React.FC<TrackTableProps> = ({
  songs,
  contextSongs,
  showAlbum = true,
  showDateAdded = true,
  emptyMessage,
  onNavigate,
}) => {
  if (songs.length === 0 && emptyMessage) {
    return <>{emptyMessage}</>
  }

  return (
    <div className="px-4 md:px-6">
      {/* Sticky Table Header */}
      <div className="grid grid-cols-[16px_1fr_auto] md:grid-cols-[16px_4fr_3fr_minmax(120px,1fr)] lg:grid-cols-[16px_6fr_4fr_3fr_minmax(100px,1fr)] items-center gap-4 px-4 py-2 border-b border-neutral-800 text-spotify-subdued text-xs font-semibold uppercase tracking-wider select-none">
        <span className="text-center">#</span>
        <span>Tiêu đề</span>
        {showAlbum && <span className="hidden md:block">Album</span>}
        {showDateAdded && <span className="hidden lg:block">Ngày thêm</span>}
        <span className="flex justify-end pr-2">
          <SpotifyClockIcon size={16} />
        </span>
      </div>

      {/* Track rows */}
      <div className="mt-2 space-y-0.5">
        {songs.map((song, index) => (
          <TrackRow
            key={song.id}
            song={song}
            index={index}
            contextSongs={contextSongs || songs}
            showAlbum={showAlbum}
            showDateAdded={showDateAdded}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  )
}

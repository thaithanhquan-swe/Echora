import React from "react"
import { Playlist, ViewType } from "@/types/music"
import { usePlayer } from "@/context/PlayerContext"
import { HeroHeader } from "@/components/common/HeroHeader"
import { ActionBar } from "@/components/common/ActionBar"
import { TrackTable } from "@/components/common/TrackTable"

interface PlaylistDetailViewProps {
  playlist: Playlist
  onNavigate: (view: ViewType, id?: string) => void
}

export const PlaylistDetailView: React.FC<PlaylistDetailViewProps> = ({
  playlist,
  onNavigate,
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer()

  const isPlaylistPlaying =
    playlist.songs.some((s) => s.id === currentTrack?.id) && isPlaying

  const handlePlayPlaylist = () => {
    if (isPlaylistPlaying) {
      togglePlay()
    } else if (playlist.songs.length > 0) {
      playTrack(playlist.songs[0], playlist.songs.slice(1))
    }
  }

  const totalDuration = playlist.songs.reduce((acc, s) => acc + s.duration, 0)
  const totalMinutes = Math.floor(totalDuration / 60)

  return (
    <div className="min-h-full pb-12 animate-in fade-in duration-300">
      {/* 1. Dynamic Hero Header */}
      <HeroHeader
        type="Danh sách phát công khai"
        title={playlist.title}
        description={playlist.description}
        coverUrl={playlist.coverUrl}
        colorTheme={playlist.colorTheme || "#1db954"}
        metaInfo={
          <>
            <span className="font-bold text-white hover:underline cursor-pointer">
              {playlist.owner}
            </span>
            <span>•</span>
            {playlist.followers && (
              <>
                <span>{playlist.followers.toLocaleString()} lượt lưu</span>
                <span>•</span>
              </>
            )}
            <span>{playlist.songs.length} bài hát,</span>
            <span className="text-neutral-300">khoảng {totalMinutes} phút</span>
          </>
        }
      />

      {/* 2. Action Bar */}
      <ActionBar
        isPlaying={isPlaylistPlaying}
        onTogglePlay={handlePlayPlaylist}
      />

      {/* 3. Reusable Track Table */}
      <TrackTable
        songs={playlist.songs}
        onNavigate={onNavigate}
      />
    </div>
  )
}

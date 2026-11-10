import React from "react"
import { Album, ViewType } from "@/types/music"
import { usePlayer } from "@/context/PlayerContext"
import { HeroHeader } from "@/components/common/HeroHeader"
import { ActionBar } from "@/components/common/ActionBar"
import { TrackTable } from "@/components/common/TrackTable"

interface AlbumDetailViewProps {
  album: Album
  onNavigate: (view: ViewType, id?: string) => void
}

export const AlbumDetailView: React.FC<AlbumDetailViewProps> = ({
  album,
  onNavigate,
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer()

  const isAlbumPlaying =
    album.songs.some((s) => s.id === currentTrack?.id) && isPlaying

  const handlePlayAlbum = () => {
    if (isAlbumPlaying) {
      togglePlay()
    } else if (album.songs.length > 0) {
      playTrack(album.songs[0], album.songs.slice(1))
    }
  }

  const totalDuration = album.songs.reduce((acc, s) => acc + s.duration, 0)
  const totalMinutes = Math.floor(totalDuration / 60)

  return (
    <div className="min-h-full pb-12 animate-in fade-in duration-300">
      {/* 1. Hero Header */}
      <HeroHeader
        type="Album"
        title={album.title}
        coverUrl={album.coverUrl}
        colorTheme={album.colorTheme || "#3a506b"}
        metaInfo={
          <>
            <span
              onClick={() => onNavigate("artist", album.artistId)}
              className="font-bold text-white hover:underline cursor-pointer"
            >
              {album.artist}
            </span>
            <span>•</span>
            <span>{album.releaseYear}</span>
            <span>•</span>
            <span>{album.songs.length} bài hát,</span>
            <span className="text-neutral-300">khoảng {totalMinutes} phút</span>
          </>
        }
      />

      {/* 2. Action Bar */}
      <ActionBar
        isPlaying={isAlbumPlaying}
        onTogglePlay={handlePlayAlbum}
      />

      {/* 3. Track Table */}
      <TrackTable
        songs={album.songs}
        showAlbum={false}
        onNavigate={onNavigate}
      />
    </div>
  )
}

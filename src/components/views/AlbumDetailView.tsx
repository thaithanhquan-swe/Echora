import React from "react"
import { Play, Pause, Heart, Clock, MoreHorizontal } from "lucide-react"
import { Album, ViewType } from "@/types/music"
import { usePlayer } from "@/context/PlayerContext"
import { TrackRow } from "@/components/common/TrackRow"

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

  const headerColor = album.colorTheme || "#3a506b"
  const totalDuration = album.songs.reduce((acc, s) => acc + s.duration, 0)
  const totalMinutes = Math.floor(totalDuration / 60)

  return (
    <div className="min-h-full pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(180deg, ${headerColor}99 0%, ${headerColor}33 80%, rgba(18,18,18,0.95) 100%)`,
        }}
        className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-end gap-6 pt-16"
      >
        <img
          src={album.coverUrl}
          alt={album.title}
          className="h-48 w-48 lg:h-60 lg:w-60 rounded-md object-cover shadow-2xl shrink-0"
        />

        <div className="flex flex-col gap-2 min-w-0">
          <span className="text-xs uppercase font-extrabold tracking-widest text-white/90">
            Album
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight drop-shadow-md">
            {album.title}
          </h1>

          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-white/90 mt-2 flex-wrap">
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
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-6 md:px-8 py-5 flex items-center gap-6">
        <button
          onClick={handlePlayAlbum}
          className="h-14 w-14 rounded-full bg-spotify-green hover:scale-105 active:scale-95 text-black flex items-center justify-center transition-all shadow-xl hover:bg-spotify-lightgreen"
          title="Phát album"
        >
          {isAlbumPlaying ? (
            <Pause className="h-6 w-6 fill-black" />
          ) : (
            <Play className="h-6 w-6 fill-black ml-1" />
          )}
        </button>

        <button
          className="text-neutral-400 hover:text-white transition-colors"
          title="Lưu album"
        >
          <Heart className="h-8 w-8" />
        </button>

        <button
          className="text-neutral-400 hover:text-white transition-colors"
          title="Tùy chọn khác"
        >
          <MoreHorizontal className="h-6 w-6" />
        </button>
      </div>

      {/* Songs */}
      <div className="px-4 md:px-6">
        <div className="grid grid-cols-[16px_1fr_auto] md:grid-cols-[16px_4fr_3fr_minmax(120px,1fr)] lg:grid-cols-[16px_6fr_4fr_3fr_minmax(100px,1fr)] items-center gap-4 px-4 py-2 border-b border-neutral-800 text-neutral-400 text-xs font-semibold uppercase tracking-wider">
          <span className="text-center">#</span>
          <span>Tiêu đề</span>
          <span className="hidden md:block">Album</span>
          <span className="hidden lg:block">Ngày thêm</span>
          <span className="flex justify-end pr-2">
            <Clock className="h-4 w-4" />
          </span>
        </div>

        <div className="mt-2 space-y-0.5">
          {album.songs.map((song, index) => (
            <TrackRow
              key={song.id}
              song={song}
              index={index}
              contextSongs={album.songs}
              showAlbum={false}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

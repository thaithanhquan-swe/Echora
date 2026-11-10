import React from "react"
import { MOCK_PLAYLISTS, MOCK_ARTISTS, MOCK_ALBUMS, MOCK_SONGS } from "@/data/mockData"
import { ViewType } from "@/types/music"
import { QuickPickCard } from "@/components/common/QuickPickCard"
import { MediaCard } from "@/components/common/MediaCard"
import { usePlayer } from "@/context/PlayerContext"

interface HomeViewProps {
  onNavigate: (view: ViewType, id?: string) => void
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { likedSongIds } = usePlayer()

  // Get dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) return "Chào buổi sáng"
    if (hour >= 12 && hour < 18) return "Chào buổi chiều"
    return "Chào buổi tối"
  }

  // Liked songs pseudo-playlist for quick pick
  const likedSongsList = MOCK_SONGS.filter(s => likedSongIds.has(s.id))

  const quickPicks = [
    {
      title: "Bài hát đã thích",
      imageUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=80",
      songs: likedSongsList,
      onClick: () => onNavigate("liked-songs"),
    },
    {
      title: MOCK_PLAYLISTS[0].title,
      imageUrl: MOCK_PLAYLISTS[0].coverUrl,
      songs: MOCK_PLAYLISTS[0].songs,
      onClick: () => onNavigate("playlist", MOCK_PLAYLISTS[0].id),
    },
    {
      title: MOCK_PLAYLISTS[1].title,
      imageUrl: MOCK_PLAYLISTS[1].coverUrl,
      songs: MOCK_PLAYLISTS[1].songs,
      onClick: () => onNavigate("playlist", MOCK_PLAYLISTS[1].id),
    },
    {
      title: MOCK_ARTISTS[0].name,
      imageUrl: MOCK_ARTISTS[0].avatarUrl,
      songs: MOCK_ARTISTS[0].topSongs,
      onClick: () => onNavigate("artist", MOCK_ARTISTS[0].id),
    },
    {
      title: MOCK_ARTISTS[1].name,
      imageUrl: MOCK_ARTISTS[1].avatarUrl,
      songs: MOCK_ARTISTS[1].topSongs,
      onClick: () => onNavigate("artist", MOCK_ARTISTS[1].id),
    },
    {
      title: MOCK_PLAYLISTS[2].title,
      imageUrl: MOCK_PLAYLISTS[2].coverUrl,
      songs: MOCK_PLAYLISTS[2].songs,
      onClick: () => onNavigate("playlist", MOCK_PLAYLISTS[2].id),
    },
  ]

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-300">
      {/* Top Hero Greeting & Quick 6-Grid */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-5">
          {getGreeting()}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickPicks.map((item, idx) => (
            <QuickPickCard
              key={idx}
              title={item.title}
              imageUrl={item.imageUrl}
              songs={item.songs}
              onClick={item.onClick}
            />
          ))}
        </div>
      </div>

      {/* Section 1: Made For You Playlists */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight hover:underline cursor-pointer">
              Dành Cho Bạn
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Những danh sách phát tuyển chọn riêng theo sở thích của bạn
            </p>
          </div>
          <button className="text-xs font-bold text-neutral-400 hover:underline hover:text-white">
            Hiện tất cả
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {MOCK_PLAYLISTS.slice(0, 6).map((playlist) => (
            <MediaCard
              key={playlist.id}
              id={playlist.id}
              title={playlist.title}
              subtitle={playlist.description}
              imageUrl={playlist.coverUrl}
              type="playlist"
              songs={playlist.songs}
              onClick={() => onNavigate("playlist", playlist.id)}
            />
          ))}
        </div>
      </div>

      {/* Section 2: Popular Artists */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight hover:underline cursor-pointer">
              Nghệ Sĩ Nổi Tiếng
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Các nghệ sĩ đang thống trị các bảng xếp hạng âm nhạc
            </p>
          </div>
          <button className="text-xs font-bold text-neutral-400 hover:underline hover:text-white">
            Hiện tất cả
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {MOCK_ARTISTS.slice(0, 6).map((artist) => (
            <MediaCard
              key={artist.id}
              id={artist.id}
              title={artist.name}
              subtitle="Nghệ sĩ"
              imageUrl={artist.avatarUrl}
              type="artist"
              songs={artist.topSongs}
              onClick={() => onNavigate("artist", artist.id)}
            />
          ))}
        </div>
      </div>

      {/* Section 3: Popular Albums & Singles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight hover:underline cursor-pointer">
              Album & Đĩa Đơn Phổ Biến
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Những phát hành tạo nên làn sóng lớn gần đây
            </p>
          </div>
          <button className="text-xs font-bold text-neutral-400 hover:underline hover:text-white">
            Hiện tất cả
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {MOCK_ALBUMS.map((album) => (
            <MediaCard
              key={album.id}
              id={album.id}
              title={album.title}
              subtitle={`${album.releaseYear} • ${album.artist}`}
              imageUrl={album.coverUrl}
              type="album"
              songs={album.songs}
              onClick={() => onNavigate("album", album.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

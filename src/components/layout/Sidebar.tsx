import React, { useState } from "react"
import {
  Library,
  Plus,
  ArrowRight,
  Search,
  ListFilter,
  Heart,
  Pin,
  Volume2,
} from "lucide-react"
import { MOCK_PLAYLISTS, MOCK_ARTISTS } from "@/data/mockData"
import { ViewType } from "@/types/music"
import { usePlayer } from "@/context/PlayerContext"
import { Badge } from "@/components/ui/badge"

interface SidebarProps {
  currentView: ViewType
  selectedId?: string
  onNavigate: (view: ViewType, id?: string) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

type LibraryFilter = "all" | "playlists" | "artists" | "albums"

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  selectedId,
  onNavigate,
  isCollapsed = false,
}) => {
  const { currentTrack, isPlaying, likedSongIds } = usePlayer()
  const [filter, setFilter] = useState<LibraryFilter>("all")
  const [searchLibrary, setSearchLibrary] = useState("")
  const [showSearchInput, setShowSearchInput] = useState(false)

  // Filter items
  const filteredPlaylists = MOCK_PLAYLISTS.filter(p => {
    if (filter === "artists" || filter === "albums") return false
    if (!searchLibrary) return true
    return p.title.toLowerCase().includes(searchLibrary.toLowerCase())
  })

  const filteredArtists = MOCK_ARTISTS.filter(a => {
    if (filter === "playlists" || filter === "albums") return false
    if (!searchLibrary) return true
    return a.name.toLowerCase().includes(searchLibrary.toLowerCase())
  })

  return (
    <aside
      className={`bg-neutral-900 rounded-lg flex flex-col h-full overflow-hidden transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-72 lg:w-80"
      }`}
    >
      {/* Library Top Header */}
      <div className="p-4 pb-2 flex items-center justify-between text-neutral-400 hover:text-white transition-colors">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-3 font-bold text-base hover:text-white transition-colors group"
          title="Thư viện của bạn"
        >
          <Library className="h-6 w-6 stroke-[2.2] group-hover:scale-105 transition-transform" />
          {!isCollapsed && <span className="tracking-tight">Thư viện</span>}
        </button>

        {!isCollapsed && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                alert("Tính năng tạo Playlist mới: Sẽ được hỗ trợ thêm trong phiên bản tiếp theo!")
              }}
              className="h-8 w-8 rounded-full hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
              title="Tạo danh sách phát hoặc thư mục"
            >
              <Plus className="h-5 w-5" />
            </button>
            <button
              className="h-8 w-8 rounded-full hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
              title="Mở rộng thư viện"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Filter Badges */}
      {!isCollapsed && (
        <div className="px-3 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {filter !== "all" && (
            <button
              onClick={() => setFilter("all")}
              className="h-7 w-7 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center text-xs shrink-0"
            >
              ✕
            </button>
          )}
          <Badge
            variant={filter === "playlists" ? "active" : "default"}
            onClick={() => setFilter(filter === "playlists" ? "all" : "playlists")}
            className="cursor-pointer shrink-0"
          >
            Danh sách phát
          </Badge>
          <Badge
            variant={filter === "artists" ? "active" : "default"}
            onClick={() => setFilter(filter === "artists" ? "all" : "artists")}
            className="cursor-pointer shrink-0"
          >
            Nghệ sĩ
          </Badge>
          <Badge
            variant={filter === "albums" ? "active" : "default"}
            onClick={() => setFilter(filter === "albums" ? "all" : "albums")}
            className="cursor-pointer shrink-0"
          >
            Album
          </Badge>
        </div>
      )}

      {/* Search and Sort controls inside library */}
      {!isCollapsed && (
        <div className="px-3 py-1 flex items-center justify-between text-neutral-400 text-xs">
          <div className="flex items-center gap-1.5 flex-1 mr-2">
            {showSearchInput ? (
              <div className="flex items-center bg-neutral-800 rounded px-2 py-1 w-full animate-in fade-in">
                <Search className="h-3.5 w-3.5 text-neutral-400 mr-1.5 shrink-0" />
                <input
                  type="text"
                  placeholder="Tìm trong thư viện..."
                  value={searchLibrary}
                  onChange={e => setSearchLibrary(e.target.value)}
                  className="bg-transparent text-white text-xs w-full focus:outline-none"
                  autoFocus
                  onBlur={() => {
                    if (!searchLibrary) setShowSearchInput(false)
                  }}
                />
              </div>
            ) : (
              <button
                onClick={() => setShowSearchInput(true)}
                className="p-1.5 rounded-full hover:bg-neutral-800 hover:text-white transition-colors"
                title="Tìm trong thư viện"
              >
                <Search className="h-4 w-4" />
              </button>
            )}
          </div>

          <button className="flex items-center gap-1 hover:text-white transition-colors py-1 px-2 rounded hover:bg-neutral-800">
            <span>Gần đây</span>
            <ListFilter className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Scrollable Library List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-4">
        {/* Liked Songs Item (always first unless filtered out) */}
        {filter !== "artists" && filter !== "albums" && (
          <div
            onClick={() => onNavigate("liked-songs")}
            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-all ${
              currentView === "liked-songs"
                ? "bg-neutral-800 text-white"
                : "text-neutral-300 hover:bg-neutral-800/60"
            }`}
          >
            <div className="h-12 w-12 rounded bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 flex items-center justify-center shrink-0 shadow-md">
              <Heart className="h-5 w-5 text-white fill-white" />
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate text-white">
                  Bài hát đã thích
                </p>
                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <Pin className="h-3 w-3 text-spotify-green fill-spotify-green shrink-0" />
                  <span>Danh sách phát</span>
                  <span>•</span>
                  <span>{likedSongIds.size} bài hát</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Playlists */}
        {filteredPlaylists.map(playlist => {
          const isSelected = currentView === "playlist" && selectedId === playlist.id
          const hasActiveTrack = playlist.songs.some(s => s.id === currentTrack?.id)

          return (
            <div
              key={playlist.id}
              onClick={() => onNavigate("playlist", playlist.id)}
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-all group ${
                isSelected
                  ? "bg-neutral-800 text-white"
                  : "text-neutral-300 hover:bg-neutral-800/60"
              }`}
            >
              <img
                src={playlist.coverUrl}
                alt={playlist.title}
                className="h-12 w-12 rounded object-cover shrink-0 shadow"
              />

              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p
                      className={`font-semibold text-sm truncate ${
                        hasActiveTrack ? "text-spotify-green" : "text-white"
                      }`}
                    >
                      {playlist.title}
                    </p>
                    {hasActiveTrack && isPlaying && (
                      <Volume2 className="h-3.5 w-3.5 text-spotify-green shrink-0 animate-pulse ml-1" />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    {playlist.isPinned && (
                      <Pin className="h-3 w-3 text-spotify-green fill-spotify-green shrink-0" />
                    )}
                    <span>Danh sách phát</span>
                    <span>•</span>
                    <span className="truncate">{playlist.owner}</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* Artists */}
        {filteredArtists.map(artist => {
          const isSelected = currentView === "artist" && selectedId === artist.id
          const isCurrentArtist = currentTrack?.artistId === artist.id

          return (
            <div
              key={artist.id}
              onClick={() => onNavigate("artist", artist.id)}
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-all group ${
                isSelected
                  ? "bg-neutral-800 text-white"
                  : "text-neutral-300 hover:bg-neutral-800/60"
              }`}
            >
              <img
                src={artist.avatarUrl}
                alt={artist.name}
                className="h-12 w-12 rounded-full object-cover shrink-0 shadow"
              />

              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p
                      className={`font-semibold text-sm truncate ${
                        isCurrentArtist ? "text-spotify-green" : "text-white"
                      }`}
                    >
                      {artist.name}
                    </p>
                    {isCurrentArtist && isPlaying && (
                      <Volume2 className="h-3.5 w-3.5 text-spotify-green shrink-0 animate-pulse ml-1" />
                    )}
                  </div>
                  <p className="text-xs text-neutral-400">Nghệ sĩ</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}

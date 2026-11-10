import React, { useState } from "react"
import { Heart } from "lucide-react"
import { MOCK_PLAYLISTS, MOCK_ARTISTS } from "@/data/mockData"
import { ViewType } from "@/types/music"
import { usePlayer } from "@/context/PlayerContext"
import { LibraryHeader } from "@/components/sidebar/LibraryHeader"
import { LibraryFilterChips, LibraryFilterType } from "@/components/sidebar/LibraryFilterChips"
import { LibrarySearchSort } from "@/components/sidebar/LibrarySearchSort"
import { LibraryItem } from "@/components/sidebar/LibraryItem"

interface SidebarProps {
  currentView: ViewType
  selectedId?: string
  onNavigate: (view: ViewType, id?: string) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  selectedId,
  onNavigate,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { currentTrack, isPlaying, likedSongIds } = usePlayer()
  const [filter, setFilter] = useState<LibraryFilterType>("all")
  const [searchLibrary, setSearchLibrary] = useState("")

  // Filter items
  const filteredPlaylists = MOCK_PLAYLISTS.filter((p) => {
    if (filter === "artists" || filter === "albums") return false
    if (!searchLibrary) return true
    return p.title.toLowerCase().includes(searchLibrary.toLowerCase())
  })

  const filteredArtists = MOCK_ARTISTS.filter((a) => {
    if (filter === "playlists" || filter === "albums") return false
    if (!searchLibrary) return true
    return a.name.toLowerCase().includes(searchLibrary.toLowerCase())
  })

  return (
    <aside
      className={`bg-spotify-black rounded-lg flex flex-col h-full overflow-hidden transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-72 lg:w-80"
      }`}
    >
      {/* 1. Library Top Header */}
      <LibraryHeader
        isCollapsed={isCollapsed}
        onHeaderClick={() => onNavigate("home")}
        onPlusClick={() => {
          alert("Tính năng tạo Playlist mới: Sẽ được hỗ trợ thêm trong phiên bản tiếp theo!")
        }}
        onToggleCollapse={onToggleCollapse}
      />

      {/* 2. Filter Badges */}
      {!isCollapsed && (
        <LibraryFilterChips
          filter={filter}
          onSelectFilter={setFilter}
        />
      )}

      {/* 3. Search & Sort in library */}
      {!isCollapsed && (
        <LibrarySearchSort
          searchQuery={searchLibrary}
          onSearchChange={setSearchLibrary}
        />
      )}

      {/* 4. Scrollable Library List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-4 spotify-scroll">
        {/* Liked Songs Special Item */}
        {filter !== "artists" && filter !== "albums" && (
          <LibraryItem
            id="liked-songs"
            title="Bài hát đã thích"
            subtitle={`Danh sách phát • ${likedSongIds.size} bài hát`}
            isPinned={true}
            isSelected={currentView === "liked-songs"}
            isCollapsed={isCollapsed}
            customIcon={
              <div className="h-12 w-12 rounded bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 flex items-center justify-center shrink-0 shadow-md">
                <Heart className="h-5 w-5 text-white fill-white" />
              </div>
            }
            onClick={() => onNavigate("liked-songs")}
          />
        )}

        {/* Playlists */}
        {filteredPlaylists.map((playlist) => {
          const isSelected = currentView === "playlist" && selectedId === playlist.id
          const hasActiveTrack = playlist.songs.some((s) => s.id === currentTrack?.id)

          return (
            <LibraryItem
              key={playlist.id}
              id={playlist.id}
              title={playlist.title}
              subtitle={`Danh sách phát • ${playlist.owner}`}
              imageUrl={playlist.coverUrl}
              isPinned={playlist.isPinned}
              isActiveTrack={hasActiveTrack}
              isPlaying={isPlaying}
              isSelected={isSelected}
              isCollapsed={isCollapsed}
              onClick={() => onNavigate("playlist", playlist.id)}
            />
          )
        })}

        {/* Artists */}
        {filteredArtists.map((artist) => {
          const isSelected = currentView === "artist" && selectedId === artist.id
          const isCurrentArtist = currentTrack?.artistId === artist.id

          return (
            <LibraryItem
              key={artist.id}
              id={artist.id}
              title={artist.name}
              subtitle="Nghệ sĩ"
              imageUrl={artist.avatarUrl}
              isArtist={true}
              isActiveTrack={isCurrentArtist}
              isPlaying={isPlaying}
              isSelected={isSelected}
              isCollapsed={isCollapsed}
              onClick={() => onNavigate("artist", artist.id)}
            />
          )
        })}
      </div>
    </aside>
  )
}

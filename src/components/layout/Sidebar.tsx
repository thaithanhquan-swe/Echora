import React, { useState } from "react"
import { Heart } from "lucide-react"
import { MOCK_PLAYLISTS } from "@/data/mockData"
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
  const { currentTrack, isPlaying } = usePlayer()
  const [filter, setFilter] = useState<LibraryFilterType>("all")
  const [searchLibrary, setSearchLibrary] = useState("")

  const filteredItems = MOCK_PLAYLISTS.filter((p) => {
    if (filter === "podcasts") return false
    if (filter === "albums" && !p.description.toLowerCase().includes("album")) return false
    if (filter === "playlists" && !p.description.toLowerCase().includes("playlist")) return false
    if (!searchLibrary) return true
    return (
      p.title.toLowerCase().includes(searchLibrary.toLowerCase()) ||
      p.description.toLowerCase().includes(searchLibrary.toLowerCase())
    )
  })

  return (
    <aside
      className={`bg-spotify-black rounded-lg flex flex-col h-full overflow-hidden transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-72 lg:w-80"
      }`}
    >
      {/* 1. Header */}
      <LibraryHeader
        isCollapsed={isCollapsed}
        onHeaderClick={() => onNavigate("home")}
        onPlusClick={() => {
          alert("Tạo Playlist mới thành công!")
        }}
        onToggleCollapse={onToggleCollapse}
      />

      {/* 2. Filter chips */}
      {!isCollapsed && (
        <LibraryFilterChips
          filter={filter}
          onSelectFilter={setFilter}
        />
      )}

      {/* 3. Search & Sort */}
      {!isCollapsed && (
        <LibrarySearchSort
          searchQuery={searchLibrary}
          onSearchChange={setSearchLibrary}
        />
      )}

      {/* 4. Library Items list matching the screenshot */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-4 spotify-scroll">
        {filteredItems.map((item) => {
          const isSelected = currentView === "playlist" && selectedId === item.id
          const hasActiveTrack = item.songs.some((s) => s.id === currentTrack?.id)
          const isLikedSongs = item.id === "pl-liked"

          return (
            <LibraryItem
              key={item.id}
              id={item.id}
              title={item.title}
              subtitle={item.description}
              imageUrl={item.coverUrl}
              isPinned={item.isPinned}
              isActiveTrack={hasActiveTrack}
              isPlaying={isPlaying}
              isSelected={isSelected}
              isCollapsed={isCollapsed}
              customIcon={
                isLikedSongs ? (
                  <div className="h-12 w-12 rounded bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 flex items-center justify-center shrink-0 shadow-md">
                    <Heart className="h-5 w-5 text-white fill-white" />
                  </div>
                ) : undefined
              }
              onClick={() => {
                if (isLikedSongs) {
                  onNavigate("liked-songs")
                } else {
                  onNavigate("playlist", item.id)
                }
              }}
            />
          )
        })}
      </div>
    </aside>
  )
}

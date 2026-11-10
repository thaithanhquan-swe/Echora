import React, { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { ViewType, Playlist } from "@/types/music"
import { usePlayer } from "@/context/PlayerContext"
import { LibraryHeader } from "@/components/sidebar/LibraryHeader"
import { LibraryFilterChips, LibraryFilterType } from "@/components/sidebar/LibraryFilterChips"
import { LibrarySearchSort } from "@/components/sidebar/LibrarySearchSort"
import { LibraryItem } from "@/components/sidebar/LibraryItem"
import { searchYouTubePlaylists } from "@/services/youtubeApi"

interface SidebarProps {
  currentView: ViewType
  selectedId?: string
  onNavigate: (view: ViewType, id?: string) => void
  isCollapsed?: boolean
  width?: number
  onToggleCollapse?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  selectedId,
  onNavigate,
  isCollapsed = false,
  width = 260,
  onToggleCollapse,
}) => {
  const { currentTrack, isPlaying, likedSongIds } = usePlayer()
  const [filter, setFilter] = useState<LibraryFilterType>("all")
  const [searchLibrary, setSearchLibrary] = useState("")
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [playlistError, setPlaylistError] = useState("")

  useEffect(() => {
    if (filter !== "playlists" || isCollapsed) {
      setPlaylists([])
      setPlaylistError("")
      return
    }

    const controller = new AbortController()
    const timer = window.setTimeout(() => {
      setPlaylistError("")
      searchYouTubePlaylists(searchLibrary.trim() || "nhạc Việt", 12, controller.signal)
        .then(setPlaylists)
        .catch((error: unknown) => {
          if (!controller.signal.aborted) {
            setPlaylistError(error instanceof Error ? error.message : "Không thể tải danh sách phát.")
          }
        })
    }, 400)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [filter, isCollapsed, searchLibrary])

  const filteredItems = playlists.filter((p) => {
    if (!searchLibrary) return true
    return (
      p.title.toLowerCase().includes(searchLibrary.toLowerCase()) ||
      p.description.toLowerCase().includes(searchLibrary.toLowerCase())
    )
  })

  return (
    <aside
      style={{ width: isCollapsed ? 72 : width }}
      data-resizable-panel="library"
      className="bg-spotify-black rounded-lg flex-col h-full overflow-hidden shrink-0 hidden md:flex"
    >
      {/* 1. Header */}
      <LibraryHeader
        isCollapsed={isCollapsed}
        onHeaderClick={() => onNavigate("home")}
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

      {/* 4. Library Items list */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-4 spotify-scroll">
        {/* Liked Songs pinned item */}
        <LibraryItem
          id="pl-liked"
          title="Bài hát đã thích"
          subtitle={`Danh sách phát • ${likedSongIds.size} bài hát`}
          imageUrl=""
          isPinned={true}
          isActiveTrack={false}
          isPlaying={isPlaying}
          isSelected={currentView === "liked-songs"}
          isCollapsed={isCollapsed}
          customIcon={
            <div className="h-12 w-12 rounded bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 flex items-center justify-center shrink-0 shadow-md">
              <Heart className="h-5 w-5 text-white fill-white" />
            </div>
          }
          onClick={() => onNavigate("liked-songs")}
        />

        {playlistError && !isCollapsed && (
          <p role="status" className="px-3 py-2 text-xs text-spotify-subdued">
            {playlistError}
          </p>
        )}

        {filter === "playlists" && !playlistError && filteredItems.length === 0 && !isCollapsed && (
          <p className="px-3 py-2 text-xs text-spotify-subdued">
            Nhập từ khóa để tìm danh sách phát.
          </p>
        )}

        {/* Echora playlists */}
        {filteredItems.map((item) => {
          const isSelected =
            (currentView === "playlist" || currentView === "album") &&
            selectedId === item.id
          const hasActiveTrack =
            currentTrack?.albumId === item.id ||
            item.songs.some((s) => s.id === currentTrack?.id)

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
              onClick={() => {
                onNavigate("playlist", item.id)
              }}
            />
          )
        })}
      </div>
    </aside>
  )
}

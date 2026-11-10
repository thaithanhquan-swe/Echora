import React, { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { ViewType, Playlist } from "@/types/music"
import { usePlayer } from "@/context/PlayerContext"
import { LibraryHeader } from "@/components/sidebar/LibraryHeader"
import { LibraryFilterChips, LibraryFilterType } from "@/components/sidebar/LibraryFilterChips"
import { LibrarySearchSort } from "@/components/sidebar/LibrarySearchSort"
import { LibraryItem } from "@/components/sidebar/LibraryItem"
import { spotifyApi, mapApiPlaylistToPlaylist } from "@/services/spotifyApi"

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
  const [playlists, setPlaylists] = useState<Playlist[]>([])

  useEffect(() => {
    let isMounted = true
    spotifyApi
      .getTrendingPlaylists(12)
      .then((res) => {
        if (!isMounted) return
        setPlaylists(res.map((playlist) => mapApiPlaylistToPlaylist(playlist)))
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [])

  const filteredItems = playlists.filter((p) => {
    if (filter === "albums" && !p.description.toLowerCase().includes("album")) return false
    if (filter === "artists" && !p.description.toLowerCase().includes("artist")) return false
    if (!searchLibrary) return true
    return (
      p.title.toLowerCase().includes(searchLibrary.toLowerCase()) ||
      p.description.toLowerCase().includes(searchLibrary.toLowerCase())
    )
  })

  return (
    <aside
      className={`bg-spotify-black rounded-lg flex flex-col h-full overflow-hidden transition-all duration-300 shrink-0 ${
        isCollapsed ? "w-20" : "w-[340px] xl:w-[380px] 2xl:w-[420px]"
      }`}
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

        {/* Playlist / Album items */}
        {filteredItems.map((item) => {
          const isSelected =
            (currentView === "playlist" || currentView === "album") &&
            selectedId === item.id
          const hasActiveTrack =
            currentTrack?.albumId === item.id ||
            item.songs.some((s) => s.id === currentTrack?.id)
          const isAlbum = item.description.toLowerCase().includes("album")

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
                if (isAlbum) {
                  onNavigate("album", item.id)
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

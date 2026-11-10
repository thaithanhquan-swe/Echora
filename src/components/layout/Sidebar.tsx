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

const DEFAULT_PLAYLISTS: Playlist[] = [
  {
    id: "37i9dQZF1DX0F4i7Q9pshJ",
    title: "Hot Hits Vietnam",
    description: "Playlist • Echora",
    coverUrl: "https://i.scdn.co/image/ab67706f00000002c3aca0b8b4aefea7d1dcfb38",
    owner: "Echora",
    songs: [],
    isPinned: true,
  },
  {
    id: "37i9dQZF1DXcBWIGoYBM5M",
    title: "Today's Top Hits",
    description: "Playlist • Echora",
    coverUrl: "https://i.scdn.co/image/ab67706f00000002e06fabee7abffa117bed662f",
    owner: "Echora",
    songs: [],
    isPinned: false,
  },
  {
    id: "37i9dQZF1DX4g8Gs5nUhpp",
    title: "V-Pop Không Thể Thiếu",
    description: "Playlist • Echora",
    coverUrl: "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da84357d905e6717b5b0b5d2f725",
    owner: "Echora",
    songs: [],
    isPinned: false,
  },
  {
    id: "1AaxmI2e1HRhbwe9XJGPnT",
    title: "m-tp M-TP",
    description: "Album • Sơn Tùng M-TP",
    coverUrl: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02794744c57c9f35db88249842",
    owner: "Sơn Tùng M-TP",
    songs: [],
    isPinned: false,
  },
]

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
  const [playlists, setPlaylists] = useState<Playlist[]>(DEFAULT_PLAYLISTS)

  useEffect(() => {
    let isMounted = true
    spotifyApi
      .search("Vietnamese", "playlist", 6)
      .then((res) => {
        if (!isMounted) return
        if (res.success && Array.isArray(res.results)) {
          const mapped = res.results.map((p) => mapApiPlaylistToPlaylist(p))
          setPlaylists((prev) => {
            const map = new Map<string, Playlist>()
            prev.forEach((p) => map.set(p.id, p))
            mapped.forEach((p) => {
              if (!map.has(p.id)) map.set(p.id, p)
            })
            return Array.from(map.values())
          })
        }
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

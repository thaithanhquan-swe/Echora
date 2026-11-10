import React from "react"
import { ViewType } from "@/types/music"
import { HomeView } from "@/components/views/HomeView"
import { SearchView } from "@/components/views/SearchView"
import { PlaylistDetailView } from "@/components/views/PlaylistDetailView"
import { ArtistDetailView } from "@/components/views/ArtistDetailView"
import { LikedSongsView } from "@/components/views/LikedSongsView"

interface MainContentProps {
  currentView: ViewType
  selectedId?: string
  searchQuery: string
  onNavigate: (view: ViewType, id?: string) => void
}

export const MainContent: React.FC<MainContentProps> = ({
  currentView,
  selectedId,
  searchQuery,
  onNavigate,
}) => {
  const renderView = () => {
    switch (currentView) {
      case "home":
        return <HomeView onNavigate={onNavigate} />

      case "search":
        return (
          <SearchView
            searchQuery={searchQuery}
            onNavigate={onNavigate}
          />
        )

      case "playlist":
        return (
          <PlaylistDetailView
            playlistId={selectedId}
            onNavigate={onNavigate}
          />
        )

      case "artist":
        return (
          <ArtistDetailView
            artistId={selectedId}
            onNavigate={onNavigate}
          />
        )

      case "album":
        return <HomeView onNavigate={onNavigate} />

      case "liked-songs":
        return <LikedSongsView onNavigate={onNavigate} />

      default:
        return <HomeView onNavigate={onNavigate} />
    }
  }

  return (
    <main className="flex-1 bg-neutral-900 rounded-lg overflow-y-auto overflow-x-hidden relative flex flex-col h-full focus:outline-none scroll-smooth">
      {renderView()}
    </main>
  )
}

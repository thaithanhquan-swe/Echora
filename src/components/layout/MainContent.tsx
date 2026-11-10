import React from "react"
import { ViewType } from "@/types/music"
import { HomeView } from "@/components/views/HomeView"
import { SearchView } from "@/components/views/SearchView"
import { PlaylistDetailView } from "@/components/views/PlaylistDetailView"
import { ArtistDetailView } from "@/components/views/ArtistDetailView"
import { AlbumDetailView } from "@/components/views/AlbumDetailView"
import { LikedSongsView } from "@/components/views/LikedSongsView"
import { LyricsModal } from "@/components/player/LyricsModal"
import { MOCK_PLAYLISTS, MOCK_ARTISTS, MOCK_ALBUMS } from "@/data/mockData"

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

      case "playlist": {
        const playlist =
          MOCK_PLAYLISTS.find((p) => p.id === selectedId) || MOCK_PLAYLISTS[0]
        return <PlaylistDetailView playlist={playlist} onNavigate={onNavigate} />
      }

      case "artist": {
        const artist =
          MOCK_ARTISTS.find((a) => a.id === selectedId) || MOCK_ARTISTS[0]
        return <ArtistDetailView artist={artist} onNavigate={onNavigate} />
      }

      case "album": {
        const album =
          MOCK_ALBUMS.find((a) => a.id === selectedId) || MOCK_ALBUMS[0]
        return <AlbumDetailView album={album} onNavigate={onNavigate} />
      }

      case "liked-songs":
        return <LikedSongsView onNavigate={onNavigate} />

      default:
        return <HomeView onNavigate={onNavigate} />
    }
  }

  return (
    <main className="flex-1 bg-neutral-900 rounded-lg overflow-y-auto overflow-x-hidden relative flex flex-col h-full focus:outline-none scroll-smooth">
      {renderView()}
      <LyricsModal />
    </main>
  )
}

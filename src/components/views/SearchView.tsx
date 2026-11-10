import React from "react"
import {
  MOCK_SONGS,
  MOCK_ARTISTS,
  MOCK_PLAYLISTS,
} from "@/data/mockData"
import { ViewType, Song } from "@/types/music"
import { usePlayer } from "@/context/PlayerContext"
import { TrackRow } from "@/components/common/TrackRow"
import { MediaCard } from "@/components/common/MediaCard"
import { CategoryGrid } from "./search/CategoryGrid"
import { TopResultCard } from "./search/TopResultCard"

interface SearchViewProps {
  searchQuery: string
  onNavigate: (view: ViewType, id?: string) => void
}

export const SearchView: React.FC<SearchViewProps> = ({
  searchQuery,
  onNavigate,
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer()

  const trimmedQuery = searchQuery.trim().toLowerCase()

  // Filter items based on search query
  const matchingSongs = MOCK_SONGS.filter(
    (s) =>
      s.title.toLowerCase().includes(trimmedQuery) ||
      s.artist.toLowerCase().includes(trimmedQuery) ||
      s.album.toLowerCase().includes(trimmedQuery)
  )

  const matchingArtists = MOCK_ARTISTS.filter((a) =>
    a.name.toLowerCase().includes(trimmedQuery)
  )

  const matchingPlaylists = MOCK_PLAYLISTS.filter((p) =>
    p.title.toLowerCase().includes(trimmedQuery) ||
    p.description.toLowerCase().includes(trimmedQuery)
  )

  const topResult: Song | null = matchingSongs.length > 0 ? matchingSongs[0] : null
  const isTopResultPlaying = Boolean(
    topResult && currentTrack?.id === topResult.id && isPlaying
  )

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-300">
      {!trimmedQuery ? (
        /* Empty Query: Browse All Categories Grid */
        <CategoryGrid onNavigate={onNavigate} />
      ) : (
        /* Active Search Results */
        <div className="space-y-8">
          {/* Top Result & Songs Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Top Result Card (5 cols) */}
            {topResult && (
              <TopResultCard
                topResult={topResult}
                isPlaying={isTopResultPlaying}
                allMatchingSongs={matchingSongs}
                onPlaySong={playTrack}
                onTogglePlay={togglePlay}
              />
            )}

            {/* Matching Songs list (7 cols) */}
            <div className={`${topResult ? "lg:col-span-7" : "col-span-12"}`}>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Bài hát</h3>
              <div className="space-y-1">
                {matchingSongs.slice(0, 4).map((song, idx) => (
                  <TrackRow
                    key={song.id}
                    song={song}
                    index={idx}
                    contextSongs={matchingSongs}
                    showAlbum={false}
                    showDateAdded={false}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Artists Matching */}
          {matchingArtists.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4 tracking-tight">Nghệ sĩ</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {matchingArtists.map((artist) => (
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
          )}

          {/* Playlists Matching */}
          {matchingPlaylists.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4 tracking-tight">Danh sách phát</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {matchingPlaylists.map((pl) => (
                  <MediaCard
                    key={pl.id}
                    id={pl.id}
                    title={pl.title}
                    subtitle={`Bởi ${pl.owner}`}
                    imageUrl={pl.coverUrl}
                    type="playlist"
                    songs={pl.songs}
                    onClick={() => onNavigate("playlist", pl.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {matchingSongs.length === 0 &&
            matchingArtists.length === 0 &&
            matchingPlaylists.length === 0 && (
              <div className="text-center py-20 text-spotify-subdued">
                <p className="text-lg font-semibold text-white">
                  Không tìm thấy kết quả nào cho "{searchQuery}"
                </p>
                <p className="text-sm mt-2">
                  Hãy thử tìm kiếm với từ khóa khác, hoặc kiểm tra lại chính tả.
                </p>
              </div>
            )}
        </div>
      )}
    </div>
  )
}

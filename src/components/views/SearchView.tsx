import React from "react"
import { Play, Pause } from "lucide-react"
import {
  MOCK_CATEGORIES,
  MOCK_SONGS,
  MOCK_ARTISTS,
  MOCK_PLAYLISTS,
} from "@/data/mockData"
import { ViewType, Song } from "@/types/music"
import { usePlayer } from "@/context/PlayerContext"
import { TrackRow } from "@/components/common/TrackRow"
import { MediaCard } from "@/components/common/MediaCard"

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

  // Top result (best match)
  const topResult: Song | null = matchingSongs.length > 0 ? matchingSongs[0] : null
  const isTopResultPlaying =
    topResult && currentTrack?.id === topResult.id && isPlaying

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-300">
      {!trimmedQuery ? (
        /* Empty Query: Browse All Categories */
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-5">
            Duyệt tìm tất cả
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {MOCK_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  // Filter playlists matching or navigate to category
                  onNavigate("playlist", MOCK_PLAYLISTS[0].id)
                }}
                style={{ backgroundColor: cat.color }}
                className="relative h-44 rounded-lg p-4 overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform duration-200 select-none shadow-md group"
              >
                <h3 className="font-bold text-xl text-white tracking-tight break-words pr-2">
                  {cat.title}
                </h3>

                <img
                  src={cat.imageUrl}
                  alt={cat.title}
                  className="absolute -bottom-2 -right-3 h-24 w-24 object-cover rounded shadow-2xl transform rotate-[25deg] group-hover:rotate-[28deg] group-hover:scale-105 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Active Search Results */
        <div className="space-y-8">
          {/* Top Result & Songs Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Top Result Card (5 cols) */}
            {topResult && (
              <div className="lg:col-span-5 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-3">
                  Kết quả hàng đầu
                </h3>
                <div
                  onClick={() => playTrack(topResult, matchingSongs)}
                  className="flex-1 bg-neutral-900/80 hover:bg-neutral-800 p-5 rounded-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between relative shadow-lg"
                >
                  <div>
                    <img
                      src={topResult.coverUrl}
                      alt={topResult.title}
                      className="h-24 w-24 rounded-lg object-cover shadow-xl mb-4"
                    />
                    <h4 className="text-2xl font-bold text-white truncate mb-1">
                      {topResult.title}
                    </h4>
                    <p className="text-sm text-neutral-400">
                      <span className="font-medium text-white">{topResult.artist}</span>
                      <span className="mx-2">•</span>
                      <span className="bg-neutral-800 text-neutral-300 text-xs px-2 py-0.5 rounded-full">
                        Bài hát
                      </span>
                    </p>
                  </div>

                  {/* Play Button */}
                  <div className="self-end mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (currentTrack?.id === topResult.id) {
                          togglePlay()
                        } else {
                          playTrack(topResult, matchingSongs)
                        }
                      }}
                      className={`h-12 w-12 rounded-full bg-spotify-green text-black flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
                        isTopResultPlaying
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0"
                      }`}
                    >
                      {isTopResultPlaying ? (
                        <Pause className="h-5 w-5 fill-black" />
                      ) : (
                        <Play className="h-5 w-5 fill-black ml-0.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Songs matching list (7 cols) */}
            <div className={`${topResult ? "lg:col-span-7" : "col-span-12"}`}>
              <h3 className="text-xl font-bold text-white mb-3">Bài hát</h3>
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
              <h3 className="text-xl font-bold text-white mb-4">Nghệ sĩ</h3>
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
              <h3 className="text-xl font-bold text-white mb-4">Danh sách phát</h3>
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
              <div className="text-center py-20 text-neutral-400">
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

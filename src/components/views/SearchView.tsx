import React, { useState, useEffect } from "react"
import { ViewType, Song, Artist, Playlist, Album } from "@/types/music"
import { usePlayer } from "@/context/PlayerContext"
import { TrackRow } from "@/components/common/TrackRow"
import { MediaCard } from "@/components/common/MediaCard"
import { CategoryGrid } from "./search/CategoryGrid"
import { TopResultCard } from "./search/TopResultCard"
import { Badge } from "@/components/ui/badge"
import {
  spotifyApi,
  mapApiTrackToSong,
  mapApiArtistToArtist,
  mapApiPlaylistToPlaylist,
  mapApiAlbumToAlbum,
} from "@/services/spotifyApi"
import { searchAudiusTracks } from "@/services/audiusApi"
import { searchFreeToUseTracks } from "@/services/freeToUseApi"
import { Loader2 } from "lucide-react"

interface SearchViewProps {
  searchQuery: string
  onNavigate: (view: ViewType, id?: string) => void
}

type SearchTab = "all" | "tracks" | "artists" | "playlists" | "albums"

export const SearchView: React.FC<SearchViewProps> = ({
  searchQuery,
  onNavigate,
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer()
  const [activeTab, setActiveTab] = useState<SearchTab>("all")
  const [loading, setLoading] = useState(false)
  const [searchError, setSearchError] = useState(false)
  const [matchingSongs, setMatchingSongs] = useState<Song[]>([])
  const [matchingPublicSongs, setMatchingPublicSongs] = useState<Song[]>([])
  const [matchingArtists, setMatchingArtists] = useState<Artist[]>([])
  const [matchingPlaylists, setMatchingPlaylists] = useState<Playlist[]>([])
  const [matchingAlbums, setMatchingAlbums] = useState<Album[]>([])

  const trimmedQuery = searchQuery.trim()

  useEffect(() => {
    if (!trimmedQuery) {
      setSearchError(false)
      setMatchingSongs([])
      setMatchingPublicSongs([])
      setMatchingArtists([])
      setMatchingPlaylists([])
      setMatchingAlbums([])
      setLoading(false)
      return
    }

    setLoading(true)
    setSearchError(false)
    setMatchingPublicSongs([])
    const timeout = setTimeout(() => {
      const promises: Promise<any>[] = []

      if (activeTab === "all" || activeTab === "tracks") {
        promises.push(
          Promise.all([
            searchAudiusTracks(trimmedQuery, 10).catch(() => []),
            searchFreeToUseTracks(trimmedQuery, 10).catch(() => []),
          ]).then(([audiusSongs, freeToUseSongs]) => {
            const unique = new Map<string, Song>()
            ;[...audiusSongs, ...freeToUseSongs].forEach((song) => unique.set(song.id, song))
            setMatchingPublicSongs(Array.from(unique.values()))
          })
        )

        promises.push(
          spotifyApi
            .search(trimmedQuery, "track", activeTab === "tracks" ? 15 : 8)
            .then((res) => {
              if (res?.success && Array.isArray(res.results)) {
                setMatchingSongs(res.results.map((t) => mapApiTrackToSong(t)))
              } else {
                setMatchingSongs([])
              }
            })
            .catch(() => {
              setMatchingSongs([])
              setSearchError(true)
            })
        )
      }

      if (activeTab === "all" || activeTab === "artists") {
        promises.push(
          spotifyApi
            .search(trimmedQuery, "artist", activeTab === "artists" ? 10 : 5)
            .then((res) => {
              if (res?.success && Array.isArray(res.results)) {
                setMatchingArtists(
                  res.results.map((a) => mapApiArtistToArtist(a))
                )
              } else {
                setMatchingArtists([])
              }
            })
            .catch(() => {
              setMatchingArtists([])
              setSearchError(true)
            })
        )
      }

      if (activeTab === "all" || activeTab === "playlists") {
        promises.push(
          spotifyApi
            .search(trimmedQuery, "playlist", activeTab === "playlists" ? 10 : 5)
            .then((res) => {
              if (res?.success && Array.isArray(res.results)) {
                setMatchingPlaylists(
                  res.results.map((p) => mapApiPlaylistToPlaylist(p))
                )
              } else {
                setMatchingPlaylists([])
              }
            })
            .catch(() => {
              setMatchingPlaylists([])
              setSearchError(true)
            })
        )
      }

      if (activeTab === "all" || activeTab === "albums") {
        promises.push(
          spotifyApi
            .search(trimmedQuery, "album", activeTab === "albums" ? 10 : 5)
            .then((res) => {
              if (res?.success && Array.isArray(res.results)) {
                setMatchingAlbums(
                  res.results.map((a) => mapApiAlbumToAlbum(a))
                )
              } else {
                setMatchingAlbums([])
              }
            })
            .catch(() => {
              setMatchingAlbums([])
              setSearchError(true)
            })
        )
      }

      Promise.all(promises).finally(() => {
        setLoading(false)
      })
    }, 400)

    return () => clearTimeout(timeout)
  }, [trimmedQuery, activeTab])

  const topResult: Song | null = matchingSongs.length > 0 ? matchingSongs[0] : null
  const isTopResultPlaying = Boolean(
    topResult && currentTrack?.id === topResult.id && isPlaying
  )

  const hasAnyResults =
    matchingSongs.length > 0 ||
    matchingPublicSongs.length > 0 ||
    matchingArtists.length > 0 ||
    matchingPlaylists.length > 0 ||
    matchingAlbums.length > 0

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-300 select-none">
      {!trimmedQuery ? (
        /* Empty Query: Browse All Categories Grid */
        <CategoryGrid onNavigate={onNavigate} />
      ) : (
        /* Active Search Results */
        <div className="space-y-6">
          {/* Filter Tabs matching available API endpoints */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <Badge
              variant={activeTab === "all" ? "active" : "default"}
              onClick={() => setActiveTab("all")}
              className="cursor-pointer py-1.5 px-4 text-xs font-bold shrink-0"
            >
              Tất cả
            </Badge>
            <Badge
              variant={activeTab === "tracks" ? "active" : "default"}
              onClick={() => setActiveTab("tracks")}
              className="cursor-pointer py-1.5 px-4 text-xs font-bold shrink-0"
            >
              Bài hát
            </Badge>
            <Badge
              variant={activeTab === "artists" ? "active" : "default"}
              onClick={() => setActiveTab("artists")}
              className="cursor-pointer py-1.5 px-4 text-xs font-bold shrink-0"
            >
              Nghệ sĩ
            </Badge>
            <Badge
              variant={activeTab === "playlists" ? "active" : "default"}
              onClick={() => setActiveTab("playlists")}
              className="cursor-pointer py-1.5 px-4 text-xs font-bold shrink-0"
            >
              Danh sách phát
            </Badge>
            <Badge
              variant={activeTab === "albums" ? "active" : "default"}
              onClick={() => setActiveTab("albums")}
              className="cursor-pointer py-1.5 px-4 text-xs font-bold shrink-0"
            >
              Album
            </Badge>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-spotify-subdued">
              <Loader2 className="h-8 w-8 animate-spin text-spotify-green mb-3" />
              <p className="text-sm font-semibold text-white">Đang tìm kiếm trên Echora...</p>
            </div>
          ) : !hasAnyResults && searchError ? (
            <div className="text-center py-20 text-spotify-subdued">
              <p className="text-lg font-semibold text-white">
                Không thể kết nối đến danh mục Spotify.
              </p>
              <p className="text-sm mt-2">Vui lòng thử lại sau.</p>
            </div>
          ) : !hasAnyResults ? (
            <div className="text-center py-20 text-spotify-subdued">
              <p className="text-lg font-semibold text-white">
                Không tìm thấy kết quả nào cho "{searchQuery}"
              </p>
              <p className="text-sm mt-2">
                Hãy thử kiểm tra lại chính tả hoặc tìm theo tên bài hát, nghệ sĩ khác.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {(activeTab === "all" || activeTab === "tracks") && matchingPublicSongs.length > 0 && (
                <section>
                  <p className="mb-1 text-xs font-medium text-spotify-subdued">
                    Public audio · stream trọn bài ngay trong Echora
                  </p>
                  <h3 className="mb-3 text-xl font-bold tracking-tight text-white">
                    Bản đầy đủ có thể phát
                  </h3>
                  <div className="space-y-1">
                    {matchingPublicSongs.map((song, index) => (
                      <TrackRow
                        key={song.id}
                        song={song}
                        index={index}
                        contextSongs={matchingPublicSongs}
                        showAlbum={false}
                        showDateAdded={false}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* All or Tracks: Top Result & Songs List */}
              {(activeTab === "all" || activeTab === "tracks") && matchingSongs.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Top Result Card */}
                  {topResult && (
                    <TopResultCard
                      topResult={topResult}
                      isCurrent={currentTrack?.id === topResult.id}
                      isPlaying={isTopResultPlaying}
                      allMatchingSongs={matchingSongs}
                      onPlaySong={playTrack}
                      onTogglePlay={togglePlay}
                    />
                  )}

                  {/* Matching Songs list */}
                  <div className={`${topResult ? "lg:col-span-7" : "col-span-12"}`}>
                    <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Bài hát</h3>
                    <div className="space-y-1">
                      {matchingSongs.slice(0, activeTab === "tracks" ? 15 : 4).map((song, idx) => (
                        <TrackRow
                          key={song.id}
                          song={song}
                          index={idx}
                          contextSongs={matchingSongs}
                          showAlbum={true}
                          showDateAdded={false}
                          onNavigate={onNavigate}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Artists Matching */}
              {(activeTab === "all" || activeTab === "artists") && matchingArtists.length > 0 && (
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
              {(activeTab === "all" || activeTab === "playlists") && matchingPlaylists.length > 0 && (
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

              {/* Albums Matching */}
              {(activeTab === "all" || activeTab === "albums") && matchingAlbums.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 tracking-tight">Album</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {matchingAlbums.map((album) => (
                      <MediaCard
                        key={album.id}
                        id={album.id}
                        title={album.title}
                        subtitle={`${album.releaseYear ? `${album.releaseYear} • ` : ""}${album.artist}`}
                        imageUrl={album.coverUrl}
                        type="album"
                        songs={album.songs}
                        onClick={() => onNavigate("album", album.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

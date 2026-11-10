import React, { useState, useEffect } from "react"
import { ViewType, Playlist, Artist, Album, Song } from "@/types/music"
import { QuickPickCard } from "@/components/common/QuickPickCard"
import { MediaCard } from "@/components/common/MediaCard"
import { Badge } from "@/components/ui/badge"
import { usePlayer } from "@/context/PlayerContext"
import {
  spotifyApi,
  mapApiPlaylistToPlaylist,
  mapApiArtistToArtist,
  mapApiAlbumToAlbum,
  mapApiTrackToSong,
} from "@/services/spotifyApi"
import { Loader2 } from "lucide-react"

interface HomeViewProps {
  onNavigate: (view: ViewType, id?: string) => void
}

type ContentFilter = "all" | "music" | "playlists" | "artists"

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<ContentFilter>("all")
  const { playTrack } = usePlayer()

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [quickSongs, setQuickSongs] = useState<Song[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [albums, setAlbums] = useState<Album[]>([])

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setLoadError(false)

    Promise.all([
      // Popular Vietnamese tracks
      spotifyApi.search("Son Tung M-TP", "track", 8).catch(() => null),
      // Popular playlists
      spotifyApi.search("Vietnam", "playlist", 8).catch(() => null),
      // Popular artists
      spotifyApi.search("HIEUTHUHAI", "artist", 5).catch(() => null),
      spotifyApi.search("Son Tung M-TP", "artist", 5).catch(() => null),
      // Popular albums
      spotifyApi.search("V-Pop", "album", 6).catch(() => null),
    ])
      .then(([tracksRes, playlistsRes, artistRes1, artistRes2, albumsRes]) => {
        if (!isMounted) return
        if (![tracksRes, playlistsRes, artistRes1, artistRes2, albumsRes].some(Boolean)) {
          setLoadError(true)
          return
        }

        if (tracksRes?.success && Array.isArray(tracksRes.results)) {
          setQuickSongs(tracksRes.results.map((t) => mapApiTrackToSong(t)))
        }

        if (playlistsRes?.success && Array.isArray(playlistsRes.results)) {
          setPlaylists(playlistsRes.results.map((p) => mapApiPlaylistToPlaylist(p)))
        }

        const combinedArtists: Artist[] = []
        if (artistRes1?.success && Array.isArray(artistRes1.results)) {
          combinedArtists.push(...artistRes1.results.map((a) => mapApiArtistToArtist(a)))
        }
        if (artistRes2?.success && Array.isArray(artistRes2.results)) {
          combinedArtists.push(...artistRes2.results.map((a) => mapApiArtistToArtist(a)))
        }
        // Deduplicate artists by id
        const uniqueArtists = Array.from(
          new Map(combinedArtists.map((a) => [a.id, a])).values()
        )
        setArtists(uniqueArtists)

        if (albumsRes?.success && Array.isArray(albumsRes.results)) {
          setAlbums(albumsRes.results.map((a) => mapApiAlbumToAlbum(a)))
        }
      })
      .catch((err) => {
        console.error("HomeView data loading error:", err)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // 8 Quick Picks
  const quickPicks = [
    {
      title: "Bài hát đã thích",
      imageUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=80",
      songs: quickSongs,
      onClick: () => onNavigate("liked-songs"),
    },
    ...quickSongs.slice(0, 7).map((song) => ({
      title: song.title,
      imageUrl: song.coverUrl,
      songs: [song],
      onClick: () => playTrack(song, quickSongs),
    })),
  ]

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-300 select-none">
      {/* 1. Top Content Filter Pills (only endpoints that exist!) */}
      <div className="flex items-center gap-2">
        <Badge
          variant={filter === "all" ? "active" : "default"}
          onClick={() => setFilter("all")}
          className="cursor-pointer py-1.5 px-4 text-xs font-bold"
        >
          Tất cả
        </Badge>
        <Badge
          variant={filter === "music" ? "active" : "default"}
          onClick={() => setFilter("music")}
          className="cursor-pointer py-1.5 px-4 text-xs font-bold"
        >
          Bài hát
        </Badge>
        <Badge
          variant={filter === "playlists" ? "active" : "default"}
          onClick={() => setFilter("playlists")}
          className="cursor-pointer py-1.5 px-4 text-xs font-bold"
        >
          Danh sách phát
        </Badge>
        <Badge
          variant={filter === "artists" ? "active" : "default"}
          onClick={() => setFilter("artists")}
          className="cursor-pointer py-1.5 px-4 text-xs font-bold"
        >
          Nghệ sĩ
        </Badge>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-spotify-subdued">
          <Loader2 className="h-8 w-8 animate-spin text-spotify-green mb-3" />
          <p className="text-sm font-semibold text-white">Đang tải dữ liệu âm nhạc trên Echora...</p>
        </div>
      ) : (
        <>
          {loadError && (
            <p className="py-8 text-center text-sm text-spotify-subdued">
              Không thể tải danh mục Spotify. Vui lòng thử lại sau.
            </p>
          )}
          {/* 2. Quick Picks 8-card grid */}
          {(filter === "all" || filter === "music") && quickPicks.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {quickPicks.map((item, idx) => (
                <QuickPickCard
                  key={idx}
                  title={item.title}
                  imageUrl={item.imageUrl}
                  songs={item.songs}
                  onClick={item.onClick}
                />
              ))}
            </div>
          )}

          {/* 3. Section 1: Featured Playlists */}
          {(filter === "all" || filter === "playlists") && playlists.length > 0 && (
            <div>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-xs text-spotify-subdued font-medium mb-1">
                    Âm nhạc chọn lọc dựa trên sở thích của bạn.
                  </p>
                  <h2 className="text-2xl font-bold text-white tracking-tight hover:underline cursor-pointer">
                    Danh sách phát nổi bật
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {playlists.slice(0, 5).map((pl) => (
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

          {/* 4. Section 2: Popular Artists */}
          {(filter === "all" || filter === "artists") && artists.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white tracking-tight hover:underline cursor-pointer">
                  Nghệ sĩ phổ biến
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {artists.slice(0, 5).map((artist) => (
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

          {/* 5. Section 3: Popular Albums */}
          {(filter === "all" || filter === "music") && albums.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white tracking-tight hover:underline cursor-pointer">
                  Album phổ biến
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {albums.slice(0, 5).map((album) => (
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
        </>
      )}
    </div>
  )
}

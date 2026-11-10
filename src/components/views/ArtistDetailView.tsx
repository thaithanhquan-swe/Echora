import React, { useEffect, useState } from "react"
import { Play, Pause, CheckCircle2, MoreHorizontal, Loader2 } from "lucide-react"
import { Artist, ViewType, Song, Album } from "@/types/music"
import { usePlayer } from "@/context/PlayerContext"
import { TrackRow } from "@/components/common/TrackRow"
import { Button } from "@/components/ui/button"
import { MediaCard } from "@/components/common/MediaCard"
import { formatNumber } from "@/lib/utils"
import {
  spotifyApi,
  mapApiArtistToArtist,
  mapApiTrackToSong,
  mapApiAlbumToAlbum,
} from "@/services/spotifyApi"

interface ArtistDetailViewProps {
  artist?: Artist
  artistId?: string
  onNavigate: (view: ViewType, id?: string) => void
}

export const ArtistDetailView: React.FC<ArtistDetailViewProps> = ({
  artist: initialArtist,
  artistId,
  onNavigate,
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer()
  const [artist, setArtist] = useState<Artist | null>(initialArtist || null)
  const [loading, setLoading] = useState<boolean>(!initialArtist || Boolean(artistId))
  const [error, setError] = useState<string | null>(null)
  const [isFollowing, setIsFollowing] = useState(false)

  const targetId = artistId || initialArtist?.id

  useEffect(() => {
    if (!targetId) return

    let isMounted = true
    setLoading(true)
    setError(null)

    Promise.all([
      spotifyApi.getArtist(targetId).catch(() => null),
      spotifyApi.getArtistTopTracks(targetId).catch(() => null),
      spotifyApi.getArtistAlbums(targetId, "all", 8).catch(() => null),
    ])
      .then(([artistRes, topTracksRes, albumsRes]) => {
        if (!isMounted) return

        if (!artistRes?.success || !artistRes.artist) {
          setError("Không thể tải thông tin nghệ sĩ.")
          return
        }

        const topSongs: Song[] = (topTracksRes?.tracks || []).map((t) =>
          mapApiTrackToSong(t)
        )

        const albums: Album[] = (albumsRes?.albums || []).map((a) =>
          mapApiAlbumToAlbum(a)
        )

        const mappedArtist = mapApiArtistToArtist(
          artistRes.artist,
          topSongs,
          albums
        )

        setArtist(mappedArtist)
      })
      .catch((err) => {
        if (!isMounted) return
        console.error("Error fetching artist details:", err)
        setError("Lỗi kết nối tới Spotify API.")
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [targetId])

  if (loading && !artist) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-spotify-subdued">
        <Loader2 className="h-10 w-10 animate-spin text-spotify-green mb-3" />
        <p className="text-sm font-semibold text-white">Đang tải nghệ sĩ từ Spotify...</p>
      </div>
    )
  }

  if (error || !artist) {
    return (
      <div className="p-8 text-center text-spotify-subdued">
        <p className="text-lg font-bold text-white mb-2">{error || "Không tìm thấy nghệ sĩ"}</p>
        <button
          onClick={() => onNavigate("home")}
          className="text-spotify-green font-bold text-sm hover:underline"
        >
          Quay lại trang chủ
        </button>
      </div>
    )
  }

  const isArtistPlaying =
    currentTrack?.artistId === artist.id && isPlaying

  const handlePlayArtist = () => {
    if (isArtistPlaying) {
      togglePlay()
    } else if (artist.topSongs.length > 0) {
      playTrack(artist.topSongs[0], artist.topSongs.slice(1))
    }
  }

  return (
    <div className="min-h-full pb-12 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="relative h-80 sm:h-96 w-full flex items-end p-6 md:p-8 overflow-hidden select-none bg-neutral-950">
        <img
          src={artist.bannerUrl}
          alt={artist.name}
          className="absolute inset-0 w-full h-full object-cover filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent" />

        <div className="relative z-10 flex flex-col gap-2">
          {artist.verified && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
              <CheckCircle2 className="h-5 w-5 text-sky-400 fill-sky-400 stroke-black stroke-[1.5]" />
              <span>Nghệ sĩ được xác minh</span>
            </div>
          )}

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight drop-shadow-lg">
            {artist.name}
          </h1>

          <p className="text-sm font-medium text-white/90 drop-shadow">
            {formatNumber(artist.monthlyListeners)} người nghe hàng tháng
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-6 md:px-8 py-5 flex items-center gap-6 select-none">
        <button
          onClick={handlePlayArtist}
          className="h-14 w-14 rounded-full bg-spotify-green hover:scale-105 active:scale-95 text-black flex items-center justify-center transition-all shadow-xl hover:bg-spotify-lightgreen focus:outline-none"
          title="Phát nghệ sĩ"
        >
          {isArtistPlaying ? (
            <Pause className="h-6 w-6 fill-black text-black" />
          ) : (
            <Play className="h-6 w-6 fill-black text-black ml-1" />
          )}
        </button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFollowing(!isFollowing)}
          className={`border-white/40 hover:border-white font-bold text-xs uppercase px-4 h-8 ${
            isFollowing ? "border-white bg-white/10" : ""
          }`}
        >
          {isFollowing ? "Đang theo dõi" : "Theo dõi"}
        </Button>

        <button
          className="text-spotify-subdued hover:text-white transition-colors focus:outline-none"
          title="Tùy chọn khác"
        >
          <MoreHorizontal className="h-6 w-6 stroke-[2]" />
        </button>
      </div>

      {/* Popular Tracks Section */}
      {artist.topSongs.length > 0 && (
        <div className="px-6 md:px-8 space-y-4 mb-10">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Phổ biến
          </h2>

          <div className="space-y-0.5">
            {artist.topSongs.slice(0, 10).map((song, index) => (
              <TrackRow
                key={song.id}
                song={song}
                index={index}
                contextSongs={artist.topSongs}
                showAlbum={true}
                showDateAdded={false}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      )}

      {/* Discography / Albums Section */}
      {artist.albums.length > 0 && (
        <div className="px-6 md:px-8 space-y-4 mb-10">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Danh sách đĩa hát
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {artist.albums.map((album) => (
              <MediaCard
                key={album.id}
                id={album.id}
                title={album.title}
                subtitle={`${album.releaseYear} • Album`}
                imageUrl={album.coverUrl}
                type="album"
                songs={album.songs}
                onClick={() => onNavigate("album", album.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* About Section */}
      <div className="px-6 md:px-8 space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Giới thiệu
        </h2>

        <div className="relative rounded-2xl overflow-hidden bg-neutral-800/80 p-8 max-w-3xl border border-neutral-700/40">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={artist.avatarUrl}
              alt={artist.name}
              className="h-32 w-32 rounded-full object-cover shadow-2xl shrink-0"
            />
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xl font-bold text-white block">
                {artist.name}
              </span>
              <p className="text-sm font-semibold text-spotify-green">
                {formatNumber(artist.monthlyListeners)} người nghe hàng tháng
              </p>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {artist.bio}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

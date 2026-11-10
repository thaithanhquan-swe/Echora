import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react"
import { Song } from "@/types/music"
import { spotifyApi, FALLBACK_AUDIO_URL } from "@/services/spotifyApi"

export type RepeatMode = "off" | "all" | "one"

// Initial real track loaded from Spotify
const INITIAL_TRACK: Song = {
  id: "5x5Vx0Musv3LSUKzjY73mA",
  title: "Hãy Trao Cho Anh",
  artist: "Sơn Tùng M-TP, Snoop Dogg",
  artistId: "5dfZ5uSmzR7VQK0udbAVpf",
  album: "Hãy Trao Cho Anh",
  albumId: "5x5Vx0Musv3LSUKzjY73mA",
  duration: 245,
  coverUrl: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e023403b37254ffacb7732e92da",
  audioUrl: "https://p.scdn.co/mp3-preview/dbf78395209a0c86218ceb411b01b2e7bdd52dcd",
  isLiked: true,
  explicit: false,
}

interface PlayerContextType {
  currentTrack: Song | null
  isPlaying: boolean
  volume: number
  isMuted: boolean
  currentTime: number
  duration: number
  queue: Song[]
  history: Song[]
  isShuffled: boolean
  repeatMode: RepeatMode
  likedSongIds: Set<string>
  likedSongs: Song[]
  isRightSidebarOpen: boolean
  isQueueOpen: boolean

  // Actions
  playTrack: (song: Song, contextQueue?: Song[]) => Promise<void>
  togglePlay: () => void
  pause: () => void
  resume: () => void
  nextTrack: () => void
  prevTrack: () => void
  seekTo: (seconds: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  toggleShuffle: () => void
  toggleRepeat: () => void
  toggleLike: (songOrId: string | Song, songData?: Song) => void
  addToQueue: (song: Song) => void
  removeFromQueue: (index: number) => void
  setRightSidebarOpen: (open: boolean) => void
  toggleRightSidebar: () => void
  setQueueOpen: (open: boolean) => void
  toggleQueue: () => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

const LOCAL_STORAGE_LIKES_KEY = "echora_liked_songs"
const LOCAL_STORAGE_LIKED_DATA_KEY = "echora_liked_songs_data"

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Song | null>(INITIAL_TRACK)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [volume, setVolumeState] = useState<number>(0.7)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(INITIAL_TRACK.duration)
  const [queue, setQueue] = useState<Song[]>([])
  const [history, setHistory] = useState<Song[]>([])
  const [isShuffled, setIsShuffled] = useState<boolean>(false)
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("off")

  const [likedSongIds, setLikedSongIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_LIKES_KEY)
      if (saved) {
        return new Set(JSON.parse(saved))
      }
    } catch (e) {
      console.warn("Could not load liked song ids:", e)
    }
    return new Set([INITIAL_TRACK.id])
  })

  const [likedSongs, setLikedSongs] = useState<Song[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_LIKED_DATA_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.warn("Could not load liked songs data:", e)
    }
    return [INITIAL_TRACK]
  })

  const [isRightSidebarOpen, setRightSidebarOpen] = useState<boolean>(true)
  const [isQueueOpen, setQueueOpen] = useState<boolean>(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const prevVolumeRef = useRef<number>(0.7)

  // Persist liked song ids and songs array
  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_LIKES_KEY,
        JSON.stringify(Array.from(likedSongIds))
      )
      localStorage.setItem(
        LOCAL_STORAGE_LIKED_DATA_KEY,
        JSON.stringify(likedSongs)
      )
    } catch (e) {
      console.warn("Could not persist likes:", e)
    }
  }, [likedSongIds, likedSongs])

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio()
    audio.preload = "metadata"
    audioRef.current = audio

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration)
      }
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", handlePause)
      audio.pause()
      audio.src = ""
    }
  }, [])

  // Sync volume to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  // Play a specific track (with Spotify audio preview)
  const playTrack = useCallback(
    async (song: Song, contextQueue?: Song[]) => {
      if (!audioRef.current) return

      // Save previous track to history
      if (currentTrack && currentTrack.id !== song.id) {
        setHistory((prev) => [currentTrack, ...prev.slice(0, 30)])
      }

      if (contextQueue) {
        const remaining = contextQueue.filter((s) => s.id !== song.id)
        setQueue(remaining)
      }

      let audioUrl = song.audioUrl

      if (!audioUrl) {
        try {
          const res = await spotifyApi.getTrack(song.id)
          if (res.success && res.track?.preview_url) {
            audioUrl = res.track.preview_url
          } else {
            audioUrl = FALLBACK_AUDIO_URL
          }
        } catch (e) {
          console.warn("Failed to fetch track preview url:", e)
          audioUrl = FALLBACK_AUDIO_URL
        }
      }

      const updatedSong: Song = {
        ...song,
        audioUrl,
      }

      setCurrentTrack(updatedSong)
      setDuration(song.duration)
      setCurrentTime(0)

      audioRef.current.src = audioUrl
      audioRef.current.load()
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true)
        })
        .catch((err) => {
          console.warn("Autoplay prevented or stream issue:", err)
          setIsPlaying(false)
        })
    },
    [currentTrack]
  )

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      if (!audioRef.current.src && currentTrack) {
        audioRef.current.src = currentTrack.audioUrl || FALLBACK_AUDIO_URL
      }
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Play failed:", err)
          setIsPlaying(false)
        })
    }
  }, [isPlaying, currentTrack])

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }, [])

  const resume = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.warn)
    }
  }, [])

  const nextTrack = useCallback(() => {
    if (queue.length > 0) {
      let nextIndex = 0
      if (isShuffled && queue.length > 1) {
        nextIndex = Math.floor(Math.random() * queue.length)
      }
      const nextSong = queue[nextIndex]
      const newQueue = queue.filter((_, i) => i !== nextIndex)
      setQueue(newQueue)
      playTrack(nextSong)
    } else if (repeatMode === "all" && history.length > 0) {
      const allSongs = [...history].reverse()
      if (currentTrack) allSongs.push(currentTrack)
      if (allSongs.length > 0) {
        const first = allSongs[0]
        setQueue(allSongs.slice(1))
        setHistory([])
        playTrack(first)
      }
    }
  }, [queue, isShuffled, repeatMode, history, currentTrack, playTrack])

  const prevTrack = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0
      setCurrentTime(0)
      return
    }

    if (history.length > 0) {
      const prevSong = history[0]
      setHistory((prev) => prev.slice(1))
      if (currentTrack) {
        setQueue((prev) => [currentTrack, ...prev])
      }
      playTrack(prevSong)
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0
      setCurrentTime(0)
    }
  }, [history, currentTrack, playTrack])

  // Track ending logic
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0
        audio.play().catch(console.warn)
      } else {
        nextTrack()
      }
    }

    audio.addEventListener("ended", handleEnded)
    return () => {
      audio.removeEventListener("ended", handleEnded)
    }
  }, [repeatMode, nextTrack])

  const seekTo = useCallback((seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds
      setCurrentTime(seconds)
    }
  }, [])

  const setVolume = useCallback(
    (newVol: number) => {
      const clamped = Math.max(0, Math.min(1, newVol))
      setVolumeState(clamped)
      if (clamped > 0 && isMuted) {
        setIsMuted(false)
      }
    },
    [isMuted]
  )

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setIsMuted(false)
      setVolumeState(prevVolumeRef.current || 0.5)
    } else {
      prevVolumeRef.current = volume
      setIsMuted(true)
    }
  }, [isMuted, volume])

  const toggleShuffle = useCallback(() => {
    setIsShuffled((prev) => !prev)
  }, [])

  const toggleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === "off") return "all"
      if (prev === "all") return "one"
      return "off"
    })
  }, [])

  const toggleLike = useCallback(
    (songOrId: string | Song, songData?: Song) => {
      const id = typeof songOrId === "string" ? songOrId : songOrId.id
      const resolvedSong: Song | null =
        typeof songOrId === "object"
          ? songOrId
          : songData || (currentTrack?.id === id ? currentTrack : null)

      setLikedSongIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) {
          next.delete(id)
        } else {
          next.add(id)
        }
        return next
      })

      setLikedSongs((prev) => {
        if (prev.some((s) => s.id === id)) {
          return prev.filter((s) => s.id !== id)
        } else if (resolvedSong) {
          return [resolvedSong, ...prev]
        }
        return prev
      })
    },
    [currentTrack]
  )

  const addToQueue = useCallback((song: Song) => {
    setQueue((prev) => [...prev, song])
  }, [])

  const removeFromQueue = useCallback((index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const toggleRightSidebar = useCallback(() => {
    setRightSidebarOpen((prev) => !prev)
  }, [])

  const toggleQueue = useCallback(() => {
    setQueueOpen((prev) => !prev)
  }, [])

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        volume,
        isMuted,
        currentTime,
        duration,
        queue,
        history,
        isShuffled,
        repeatMode,
        likedSongIds,
        likedSongs,
        isRightSidebarOpen,
        isQueueOpen,
        playTrack,
        togglePlay,
        pause,
        resume,
        nextTrack,
        prevTrack,
        seekTo,
        setVolume,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        toggleLike,
        addToQueue,
        removeFromQueue,
        setRightSidebarOpen,
        toggleRightSidebar,
        setQueueOpen,
        toggleQueue,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider")
  }
  return context
}

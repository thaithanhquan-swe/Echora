import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react"
import { Song } from "@/types/music"
import { MOCK_SONGS } from "@/data/mockData"

export type RepeatMode = "off" | "all" | "one"

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
  isLyricsOpen: boolean
  isRightSidebarOpen: boolean
  isQueueOpen: boolean

  // Actions
  playTrack: (song: Song, contextQueue?: Song[]) => void
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
  toggleLike: (songId: string) => void
  addToQueue: (song: Song) => void
  removeFromQueue: (index: number) => void
  setLyricsOpen: (open: boolean) => void
  toggleLyrics: () => void
  setRightSidebarOpen: (open: boolean) => void
  toggleRightSidebar: () => void
  setQueueOpen: (open: boolean) => void
  toggleQueue: () => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Song | null>(MOCK_SONGS[0])
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [volume, setVolumeState] = useState<number>(0.7)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(187) // 3:07 matching screenshot
  const [duration, setDuration] = useState<number>(MOCK_SONGS[0].duration) // 3:37
  const [queue, setQueue] = useState<Song[]>(MOCK_SONGS.slice(1))
  const [history, setHistory] = useState<Song[]>([])
  const [isShuffled, setIsShuffled] = useState<boolean>(false)
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("off")
  const [likedSongIds, setLikedSongIds] = useState<Set<string>>(
    new Set(MOCK_SONGS.filter(s => s.isLiked).map(s => s.id))
  )
  const [isLyricsOpen, setLyricsOpen] = useState<boolean>(false)
  const [isRightSidebarOpen, setRightSidebarOpen] = useState<boolean>(true) // Open by default matching screenshot
  const [isQueueOpen, setQueueOpen] = useState<boolean>(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const prevVolumeRef = useRef<number>(0.7)

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

  // Play a specific track
  const playTrack = useCallback((song: Song, contextQueue?: Song[]) => {
    if (!audioRef.current) return

    // If changing track, save old one to history
    if (currentTrack && currentTrack.id !== song.id) {
      setHistory(prev => [currentTrack, ...prev.slice(0, 20)])
    }

    setCurrentTrack(song)
    setDuration(song.duration)
    setCurrentTime(0)

    if (contextQueue) {
      const remaining = contextQueue.filter(s => s.id !== song.id)
      setQueue(remaining)
    }

    audioRef.current.src = song.audioUrl
    audioRef.current.load()
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true)
      })
      .catch(err => {
        console.warn("Autoplay was prevented or audio failed:", err)
        setIsPlaying(false)
      })
  }, [currentTrack])

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      if (!audioRef.current.src && currentTrack) {
        audioRef.current.src = currentTrack.audioUrl
      }
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(err => {
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
      // Loop back to beginning
      const allSongs = [...history].reverse()
      if (currentTrack) allSongs.push(currentTrack)
      if (allSongs.length > 0) {
        const first = allSongs[0]
        setQueue(allSongs.slice(1))
        setHistory([])
        playTrack(first)
      }
    } else {
      // Default loop back to mock songs
      const nextSong = MOCK_SONGS[0]
      playTrack(nextSong, MOCK_SONGS.slice(1))
    }
  }, [queue, isShuffled, repeatMode, history, currentTrack, playTrack])

  const prevTrack = useCallback(() => {
    // If more than 3 seconds in, restart the song
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0
      setCurrentTime(0)
      return
    }

    if (history.length > 0) {
      const prevSong = history[0]
      setHistory(prev => prev.slice(1))
      if (currentTrack) {
        setQueue(prev => [currentTrack, ...prev])
      }
      playTrack(prevSong)
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0
      setCurrentTime(0)
    }
  }, [history, currentTrack, playTrack])

  // Handle track ending with repeat logic
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

  const setVolume = useCallback((newVol: number) => {
    const clamped = Math.max(0, Math.min(1, newVol))
    setVolumeState(clamped)
    if (clamped > 0 && isMuted) {
      setIsMuted(false)
    }
  }, [isMuted])

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
    setIsShuffled(prev => !prev)
  }, [])

  const toggleRepeat = useCallback(() => {
    setRepeatMode(prev => {
      if (prev === "off") return "all"
      if (prev === "all") return "one"
      return "off"
    })
  }, [])

  const toggleLike = useCallback((songId: string) => {
    setLikedSongIds(prev => {
      const next = new Set(prev)
      if (next.has(songId)) {
        next.delete(songId)
      } else {
        next.add(songId)
      }
      return next
    })
  }, [])

  const addToQueue = useCallback((song: Song) => {
    setQueue(prev => [...prev, song])
  }, [])

  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index))
  }, [])

  const toggleLyrics = useCallback(() => {
    setLyricsOpen(prev => !prev)
  }, [])

  const toggleRightSidebar = useCallback(() => {
    setRightSidebarOpen(prev => !prev)
  }, [])

  const toggleQueue = useCallback(() => {
    setQueueOpen(prev => !prev)
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
        isLyricsOpen,
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
        setLyricsOpen,
        toggleLyrics,
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

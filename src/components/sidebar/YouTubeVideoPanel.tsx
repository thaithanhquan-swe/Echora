import React, { useEffect, useRef, useState } from "react"
import { ExternalLink } from "lucide-react"
import { usePlayer } from "@/context/PlayerContext"
import { Song } from "@/types/music"

interface YouTubeVideoPanelProps {
  track: Song
}

const IFRAME_API_URL = "https://www.youtube.com/iframe_api"

function loadYouTubeIframeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve()

  return new Promise((resolve) => {
    const previousCallback = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.()
      resolve()
    }

    if (!document.querySelector(`script[src="${IFRAME_API_URL}"]`)) {
      const script = document.createElement("script")
      script.src = IFRAME_API_URL
      script.async = true
      document.head.appendChild(script)
    }
  })
}

export const YouTubeVideoPanel: React.FC<YouTubeVideoPanelProps> = ({ track }) => {
  const { volume, isMuted, registerYouTubePlayer, updateYouTubeTime, handleYouTubeStateChange } = usePlayer()
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YouTubePlayer | null>(null)
  const loadedVideoRef = useRef<string | null>(null)
  const [error, setError] = useState(false)
  const videoId = track.youtubeVideoId

  useEffect(() => {
    let cancelled = false

    loadYouTubeIframeApi().then(() => {
      if (cancelled || !containerRef.current || !window.YT?.Player) return

      const player = new window.YT.Player(containerRef.current, {
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 0,
          controls: 1,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            if (cancelled) return
            playerRef.current = event.target
            registerYouTubePlayer(event.target)
            event.target.setVolume(Math.round(volume * 100))
            if (isMuted) event.target.mute()
            if (videoId) {
              loadedVideoRef.current = videoId
              event.target.loadVideoById(videoId)
            }
          },
          onStateChange: (event) => {
            if (typeof event.data === "number") handleYouTubeStateChange(event.data)
          },
          onError: () => setError(true),
          onAutoplayBlocked: () => handleYouTubeStateChange(2),
        },
      })

      playerRef.current = player
    })

    return () => {
      cancelled = true
      registerYouTubePlayer(null)
      playerRef.current?.destroy()
      playerRef.current = null
    }
  }, [])

  useEffect(() => {
    const player = playerRef.current
    if (!player || !videoId || loadedVideoRef.current === videoId) return
    setError(false)
    loadedVideoRef.current = videoId
    player.loadVideoById(videoId)
  }, [videoId])

  useEffect(() => {
    const player = playerRef.current
    if (!player) return
    if (isMuted) player.mute()
    else {
      player.unMute()
      player.setVolume(Math.round(volume * 100))
    }
  }, [volume, isMuted])

  useEffect(() => {
    const timer = window.setInterval(() => {
      const player = playerRef.current
      if (!player) return
      const length = player.getDuration()
      const time = player.getCurrentTime()
      if (Number.isFinite(time) && Number.isFinite(length)) updateYouTubeTime(time, length)
    }, 500)
    return () => window.clearInterval(timer)
  }, [updateYouTubeTime])

  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`

  return (
    <div className="space-y-2">
      <div className="relative aspect-video w-full min-h-[200px] overflow-hidden rounded-lg bg-black shadow-xl">
        <div ref={containerRef} className="absolute inset-0 h-full w-full" />
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-neutral-950/95 p-4 text-center">
            <p className="text-sm font-semibold text-white">Video này không phát được trong Echora.</p>
            <a href={videoUrl} target="_blank" rel="noreferrer" className="text-xs text-spotify-green hover:underline">
              Mở liên kết nguồn <ExternalLink className="inline h-3 w-3" />
            </a>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 text-[10px] text-spotify-subdued">
        <span>Trình phát Echora · Đồng bộ cùng thanh điều khiển</span>
        <a href={videoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-white">
          Nguồn phát <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <p className="text-[10px] text-spotify-subdued">
        Trình phát đa phương tiện thuộc nền tảng Echora.
      </p>
    </div>
  )
}

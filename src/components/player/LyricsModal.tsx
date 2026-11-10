import React, { useEffect, useRef } from "react"
import { X, Mic2 } from "lucide-react"
import { usePlayer } from "@/context/PlayerContext"

export const LyricsModal: React.FC = () => {
  const { currentTrack, currentTime, isLyricsOpen, setLyricsOpen, seekTo } = usePlayer()
  const activeLineRef = useRef<HTMLParagraphElement | null>(null)

  const lyrics = currentTrack?.lyrics || [
    { time: 0, text: "♪ Không có lời bài hát cho bài hát này ♪" },
  ]

  // Find currently active lyric line
  let activeIndex = -1
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      activeIndex = i
    } else {
      break
    }
  }

  // Auto-scroll active line into center
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }, [activeIndex])

  if (!isLyricsOpen || !currentTrack) {
    return null
  }

  return (
    <div className="absolute inset-0 z-30 bg-gradient-to-b from-emerald-950 via-neutral-900 to-black p-6 md:p-12 overflow-y-auto animate-in fade-in zoom-in-95 duration-200 select-none spotify-scroll">
      {/* Top Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between pb-6 backdrop-blur-md bg-transparent">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-spotify-green flex items-center justify-center text-black">
            <Mic2 className="h-5 w-5 stroke-[2]" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-white tracking-tight">
              {currentTrack.title}
            </h2>
            <p className="text-xs text-neutral-300 font-medium">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        <button
          onClick={() => setLyricsOpen(false)}
          className="h-10 w-10 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white transition-colors focus:outline-none"
          title="Đóng lời bài hát"
        >
          <X className="h-6 w-6 stroke-[2]" />
        </button>
      </div>

      {/* Lyrics lines */}
      <div className="max-w-3xl mx-auto py-12 space-y-6">
        {lyrics.map((line, idx) => {
          const isActive = idx === activeIndex
          const isPassed = idx < activeIndex

          return (
            <p
              key={idx}
              ref={isActive ? activeLineRef : null}
              onClick={() => seekTo(line.time)}
              className={`cursor-pointer transition-all duration-300 font-extrabold leading-relaxed ${
                isActive
                  ? "text-3xl md:text-5xl text-white scale-100 origin-left drop-shadow-lg tracking-tight"
                  : isPassed
                  ? "text-2xl md:text-3xl text-white/50 hover:text-white/80 tracking-tight"
                  : "text-2xl md:text-3xl text-white/30 hover:text-white/60 tracking-tight"
              }`}
            >
              {line.text}
            </p>
          )
        })}
      </div>
    </div>
  )
}

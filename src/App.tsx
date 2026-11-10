import { useState, useCallback, useEffect } from "react"
import { PlayerProvider, usePlayer } from "@/context/PlayerContext"
import { TooltipProvider } from "@/components/ui/tooltip"
import { TopNav } from "@/components/layout/TopNav"
import { Sidebar } from "@/components/layout/Sidebar"
import { MainContent } from "@/components/layout/MainContent"
import { RightSidebar } from "@/components/layout/RightSidebar"
import { PlayerBar } from "@/components/player/PlayerBar"
import { ViewType, NavigationState } from "@/types/music"
import { spotifyApi } from "@/services/spotifyApi"

function AppContent() {
  // Navigation stack state
  const [navHistory, setNavHistory] = useState<NavigationState[]>([
    { view: "home" },
  ])
  const [historyIndex, setHistoryIndex] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Verify API health & token on mount
  useEffect(() => {
    Promise.all([
      spotifyApi.getHealth().catch(console.warn),
      spotifyApi.getToken().catch(console.warn),
    ]).then(([health, token]) => {
      if (health?.success) {
        console.log("Echora API Status: Online | Uptime:", health.uptime_seconds, "s")
      }
      if (token?.success) {
        console.log("Echora Live Token: Active")
      }
    })
  }, [])

  const currentState = navHistory[historyIndex] || { view: "home" }

  const navigate = useCallback((view: ViewType, id?: string) => {
    if (view === "search" && id) setSearchQuery(id)
    setNavHistory((prev) => {
      const nextStack = prev.slice(0, historyIndex + 1)
      return [...nextStack, { view, id }]
    })
    setHistoryIndex((prev) => prev + 1)
  }, [historyIndex])

  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1)
    }
  }, [historyIndex])

  const goForward = useCallback(() => {
    if (historyIndex < navHistory.length - 1) {
      setHistoryIndex((prev) => prev + 1)
    }
  }, [historyIndex, navHistory.length])

  // Global keyboard shortcuts
  const { togglePlay, toggleMute } = usePlayer()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      if (e.code === "Space") {
        e.preventDefault()
        togglePlay()
      } else if (e.code === "KeyM") {
        toggleMute()
      } else if (e.code === "Slash" || (e.ctrlKey && e.code === "KeyK")) {
        e.preventDefault()
        navigate("search")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [togglePlay, toggleMute, navigate])

  return (
    <div className="h-screen w-screen flex flex-col bg-black text-white p-2 gap-2 overflow-hidden select-none">
      {/* Top Header Navigation */}
      <TopNav
        currentView={currentState.view}
        onNavigate={navigate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        canGoBack={historyIndex > 0}
        canGoForward={historyIndex < navHistory.length - 1}
        onGoBack={goBack}
        onGoForward={goForward}
      />

      {/* Main 3-Column Work Area */}
      <div className="flex-1 flex gap-2 min-h-0 overflow-hidden">
        {/* Left Library Sidebar */}
        <Sidebar
          currentView={currentState.view}
          selectedId={currentState.id}
          onNavigate={navigate}
        />

        {/* Center Main Dynamic Content */}
        <MainContent
          currentView={currentState.view}
          selectedId={currentState.id}
          searchQuery={searchQuery}
          onNavigate={navigate}
        />

        {/* Right Now Playing / Queue Sidebar */}
        <RightSidebar onNavigate={navigate} />
      </div>

      {/* Persistent Bottom Echora Player Bar */}
      <PlayerBar onNavigate={navigate} />
    </div>
  )
}

export default function App() {
  return (
    <TooltipProvider>
      <PlayerProvider>
        <AppContent />
      </PlayerProvider>
    </TooltipProvider>
  )
}

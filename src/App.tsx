import { useState, useCallback, useEffect, useRef } from "react"
import { PlayerProvider, usePlayer } from "@/context/PlayerContext"
import { TooltipProvider } from "@/components/ui/tooltip"
import { TopNav } from "@/components/layout/TopNav"
import { Sidebar } from "@/components/layout/Sidebar"
import { MainContent } from "@/components/layout/MainContent"
import { RightSidebar } from "@/components/layout/RightSidebar"
import { PlayerBar } from "@/components/player/PlayerBar"
import { MobileBottomNav } from "@/components/layout/MobileBottomNav"
import { ViewType, NavigationState } from "@/types/music"

function AppContent() {
  // Navigation stack state
  const [navHistory, setNavHistory] = useState<NavigationState[]>([
    { view: "home" },
  ])
  const [historyIndex, setHistoryIndex] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isLibraryCollapsed, setIsLibraryCollapsed] = useState<boolean>(false)
  const [libraryWidth, setLibraryWidth] = useState(260)
  const [rightSidebarWidth, setRightSidebarWidth] = useState(340)
  const { togglePlay, toggleMute, isRightSidebarOpen, isQueueOpen } = usePlayer()
  const resizeStart = useRef<{
    side: "library" | "right"
    pointerId: number
    startX: number
    startWidth: number
    panel: HTMLElement
  } | null>(null)

  const startResize = (
    side: "library" | "right",
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (event.button !== 0) return
    const panel = document.querySelector<HTMLElement>(
      `[data-resizable-panel="${side}"]`,
    )
    if (!panel) return

    event.currentTarget.setPointerCapture(event.pointerId)
    resizeStart.current = {
      side,
      pointerId: event.pointerId,
      startX: event.clientX,
      startWidth: side === "library" ? libraryWidth : rightSidebarWidth,
      panel,
    }
    event.preventDefault()
  }

  const resizePanel = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = resizeStart.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const direction = drag.side === "library" ? 1 : -1
    const nextWidth = drag.startWidth + (event.clientX - drag.startX) * direction
    const maxWidth = Math.min(480, window.innerWidth * 0.4)
    const minWidth = drag.side === "library" ? 220 : 280
    const width = Math.round(Math.min(maxWidth, Math.max(minWidth, nextWidth)))

    if (drag.side === "library") {
      drag.panel.style.width = `${width}px`
    } else {
      drag.panel.style.setProperty("--right-sidebar-width", `${width}px`)
    }
  }

  const stopResize = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = resizeStart.current
    if (drag?.pointerId !== event.pointerId) return
    resizeStart.current = null
    const width = Number.parseFloat(
      drag.side === "library"
        ? drag.panel.style.width
        : drag.panel.style.getPropertyValue("--right-sidebar-width"),
    )
    if (Number.isFinite(width)) {
      if (drag.side === "library") setLibraryWidth(width)
      else setRightSidebarWidth(width)
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

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
    <div className="app-shell flex flex-col bg-black text-white gap-1 sm:gap-2 overflow-hidden select-none">
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

      {/* Main Work Area: Left Sidebar (Desktop/Tablet) + Center Content + Right Video/Queue Sidebar */}
      <div className="flex-1 flex gap-0.5 min-h-0 overflow-hidden relative">
        {/* Left Library Sidebar (Desktop/Tablet only; on mobile, handled by MobileBottomNav) */}
        <Sidebar
          currentView={currentState.view}
          selectedId={currentState.id}
          onNavigate={navigate}
          isCollapsed={isLibraryCollapsed}
          width={libraryWidth}
          onToggleCollapse={() => setIsLibraryCollapsed((prev) => !prev)}
        />

        {!isLibraryCollapsed && (
          <div
            role="separator"
            aria-label="Thay đổi chiều rộng thư viện"
            aria-orientation="vertical"
            aria-valuenow={libraryWidth}
            tabIndex={0}
            onPointerDown={(event) => startResize("library", event)}
            onPointerMove={resizePanel}
            onPointerUp={stopResize}
            onPointerCancel={stopResize}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") setLibraryWidth((width) => Math.max(220, width - 16))
              if (event.key === "ArrowRight") setLibraryWidth((width) => Math.min(480, width + 16))
            }}
            className="panel-resize-handle hidden md:flex"
          />
        )}

        {/* Center Main Dynamic Content */}
        <MainContent
          currentView={currentState.view}
          selectedId={currentState.id}
          searchQuery={searchQuery}
          onNavigate={navigate}
        />

        {(isRightSidebarOpen || isQueueOpen) && (
          <div
            role="separator"
            aria-label="Thay đổi chiều rộng bảng bên phải"
            aria-orientation="vertical"
            aria-valuenow={rightSidebarWidth}
            tabIndex={0}
            onPointerDown={(event) => startResize("right", event)}
            onPointerMove={resizePanel}
            onPointerUp={stopResize}
            onPointerCancel={stopResize}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") setRightSidebarWidth((width) => Math.min(480, width + 16))
              if (event.key === "ArrowRight") setRightSidebarWidth((width) => Math.max(280, width - 16))
            }}
            className="panel-resize-handle hidden lg:flex"
          />
        )}

        {/* Right Now Playing / Video / Queue Sidebar */}
        <RightSidebar onNavigate={navigate} width={rightSidebarWidth} />
      </div>

      {/* Persistent Bottom Echora Player Bar */}
      <PlayerBar onNavigate={navigate} />

      {/* Mobile Bottom Navigation Bar (Home, Search, Library) */}
      <MobileBottomNav
        currentView={currentState.view}
        onNavigate={navigate}
      />
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

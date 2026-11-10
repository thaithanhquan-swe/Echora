import React, { useEffect, useState } from "react"
import {
  X,
  Layers,
  Home,
  Search,
  AudioLines,
  ChevronLeft,
  ChevronRight,
  Download,
  X as CloseIcon,
} from "lucide-react"
import { ViewType } from "@/types/music"

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

interface TopNavProps {
  currentView: ViewType
  onNavigate: (view: ViewType, id?: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  canGoBack: boolean
  canGoForward: boolean
  onGoBack: () => void
  onGoForward: () => void
}

export const TopNav: React.FC<TopNavProps> = ({
  currentView,
  onNavigate,
  searchQuery,
  onSearchChange,
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null)
  const [showInstallHelp, setShowInstallHelp] = useState(false)
  const [installPlatform, setInstallPlatform] = useState<"ios" | "android" | "desktop">("desktop")
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const userAgent = navigator.userAgent
    const isIos = /iPad|iPhone|iPod/.test(userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    setInstallPlatform(isIos ? "ios" : /Android/i.test(userAgent) ? "android" : "desktop")
    setIsInstalled(
      window.matchMedia("(display-mode: standalone)").matches ||
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone),
    )

    const handleInstallAvailable = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as InstallPromptEvent)
    }
    const handleInstalled = () => {
      setIsInstalled(true)
      setInstallPrompt(null)
      setShowInstallHelp(false)
    }

    window.addEventListener("beforeinstallprompt", handleInstallAvailable)
    window.addEventListener("appinstalled", handleInstalled)
    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallAvailable)
      window.removeEventListener("appinstalled", handleInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (isInstalled) return
    if (!installPrompt || installPlatform === "ios") {
      setShowInstallHelp(true)
      return
    }
    try {
      await installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      if (outcome === "accepted") setShowInstallHelp(false)
      setInstallPrompt(null)
    } catch (error) {
      console.error("Không thể mở lời nhắc cài đặt Echora:", error)
      setShowInstallHelp(true)
    }
  }

  return (
    <header className="h-16 w-full grid grid-cols-[minmax(0,1fr)_minmax(0,560px)_minmax(0,1fr)] items-center px-3 sm:px-4 z-30 select-none bg-black shrink-0 gap-2">
      {/* Left: Echora Logo & History Buttons */}
      <div className="flex items-center gap-3 shrink-0 min-w-0">
        <div
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2.5 cursor-pointer group focus:outline-none"
        >
          <div className="h-10 w-10 rounded-full bg-spotify-green flex items-center justify-center transition-transform group-hover:scale-105 shadow-md shadow-spotify-green/20 shrink-0">
            <AudioLines className="h-5 w-5 text-black stroke-[2.5]" />
          </div>
          <span className="font-black text-xl sm:text-2xl tracking-tighter text-white group-hover:text-spotify-green transition-colors font-sans hidden min-[400px]:inline">
            Echora
          </span>
        </div>

        {/* History Back / Forward navigation */}
        <div className="hidden md:flex items-center gap-1.5 ml-2">
          <button
            onClick={onGoBack}
            disabled={!canGoBack}
            className={`h-8 w-8 rounded-full bg-black/60 flex items-center justify-center transition-colors focus:outline-none ${
              canGoBack
                ? "text-white hover:bg-neutral-800 cursor-pointer"
                : "text-neutral-600 cursor-not-allowed"
            }`}
            title="Quay lại"
          >
            <ChevronLeft className="h-5 w-5 stroke-[2]" />
          </button>
          <button
            onClick={onGoForward}
            disabled={!canGoForward}
            className={`h-8 w-8 rounded-full bg-black/60 flex items-center justify-center transition-colors focus:outline-none ${
              canGoForward
                ? "text-white hover:bg-neutral-800 cursor-pointer"
                : "text-neutral-600 cursor-not-allowed"
            }`}
            title="Tiến lên"
          >
            <ChevronRight className="h-5 w-5 stroke-[2]" />
          </button>
        </div>
      </div>

      {/* Center: Home icon + Pill Search Bar */}
      <div className="flex items-center gap-2 min-w-0 w-full px-1 sm:px-2 justify-self-center">
        {/* Home Button */}
        <button
          onClick={() => onNavigate("home")}
          className={`h-11 w-11 sm:h-12 sm:w-12 rounded-full flex items-center justify-center shrink-0 transition-all focus:outline-none ${
            currentView === "home"
              ? "bg-neutral-800 text-white scale-105 shadow-md"
              : "bg-neutral-900 text-spotify-subdued hover:text-white hover:bg-neutral-800"
          }`}
          title="Trang chủ"
        >
          <Home className="h-5 w-5 stroke-[2.2]" />
        </button>

        {/* Pill Search Input */}
        <div
          className={`relative flex-1 flex items-center h-11 sm:h-12 rounded-full bg-neutral-900 hover:bg-neutral-850 transition-all border border-transparent ${
            isFocused ? "border-white bg-neutral-850 ring-2 ring-white/20" : ""
          }`}
        >
          <Search className="h-4 w-4 sm:h-5 sm:w-5 text-spotify-subdued absolute left-3.5 sm:left-4 pointer-events-none stroke-[2]" />

          <input
            type="text"
            placeholder="Bạn muốn nghe gì?"
            value={searchQuery}
            onFocus={() => {
              setIsFocused(true)
              if (currentView !== "search") {
                onNavigate("search")
              }
            }}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => {
              onSearchChange(e.target.value)
              if (currentView !== "search") {
                onNavigate("search")
              }
            }}
            className="w-full h-full bg-transparent text-white placeholder:text-spotify-subdued text-sm sm:text-base pl-10 sm:pl-12 pr-16 rounded-full focus:outline-none font-medium"
          />

          <div className="absolute right-3.5 flex items-center gap-2 text-spotify-subdued">
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="hover:text-white focus:outline-none"
                title="Xóa tìm kiếm"
              >
                <X className="h-4 w-4 stroke-[2]" />
              </button>
            )}
            <div className="h-4 w-[1px] bg-neutral-700" />
            <button
              onClick={() => onNavigate("search")}
              className="hover:text-white focus:outline-none"
              title="Duyệt tìm"
            >
              <Layers className="h-4 w-4 stroke-[2]" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative flex justify-end min-w-0">
        <button
          onClick={handleInstall}
          disabled={isInstalled}
          title={isInstalled ? "Echora đã được cài đặt" : "Cài đặt ứng dụng"}
          className="inline-flex items-center justify-center gap-1.5 h-9 px-2 sm:px-3.5 rounded-full text-xs font-bold text-white hover:scale-105 hover:bg-white/10 transition-all focus:outline-none disabled:text-spotify-green disabled:hover:scale-100"
        >
          <Download className="h-4 w-4 stroke-[2] shrink-0" />
          <span className="hidden sm:inline whitespace-nowrap">{isInstalled ? "Đã cài đặt" : "Cài ứng dụng"}</span>
        </button>
        {showInstallHelp && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-help-title"
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
            onClick={() => setShowInstallHelp(false)}
          >
            <section
              className="w-full max-w-sm rounded-xl border border-white/10 bg-neutral-900 p-5 text-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 id="install-help-title" className="text-lg font-bold">Cài Echora</h2>
                <button
                  onClick={() => setShowInstallHelp(false)}
                  aria-label="Đóng hướng dẫn"
                  className="rounded-full p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>
              {installPlatform === "ios" ? (
                <ol className="list-decimal space-y-2 pl-5 text-sm text-neutral-300">
                  <li>Mở trang này bằng Safari.</li>
                  <li>Chạm nút <strong className="text-white">Chia sẻ</strong> ở thanh công cụ.</li>
                  <li>Chọn <strong className="text-white">Thêm vào màn hình chính</strong>, rồi chạm <strong className="text-white">Thêm</strong>.</li>
                </ol>
              ) : installPlatform === "android" ? (
                <ol className="list-decimal space-y-2 pl-5 text-sm text-neutral-300">
                  <li>Mở menu <strong className="text-white">⋮</strong> của Chrome hoặc trình duyệt hỗ trợ.</li>
                  <li>Chọn <strong className="text-white">Cài đặt ứng dụng</strong> hoặc <strong className="text-white">Thêm vào màn hình chính</strong>.</li>
                  <li>Xác nhận cài đặt Echora.</li>
                </ol>
              ) : (
                <ol className="list-decimal space-y-2 pl-5 text-sm text-neutral-300">
                  <li>Dùng Chrome hoặc Edge và mở trang Echora qua HTTPS hoặc localhost.</li>
                  <li>Chọn biểu tượng cài đặt trên thanh địa chỉ, hoặc mở menu trình duyệt.</li>
                  <li>Chọn <strong className="text-white">Cài đặt Echora</strong> và xác nhận.</li>
                </ol>
              )}
            </section>
          </div>
        )}
      </div>
    </header>
  )
}

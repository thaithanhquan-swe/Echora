import React, { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  Users,
  ExternalLink,
  Sparkles,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ViewType } from "@/types/music"
import {
  SpotifyLogo,
  SpotifyHomeIcon,
  SpotifySearchIcon,
} from "@/components/icons/SpotifyIcons"

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

  return (
    <header className="h-14 w-full flex items-center justify-between px-3 z-30 select-none bg-black">
      {/* Left: Spotify Logo & History Navigation arrows */}
      <div className="flex items-center gap-3">
        {/* App Logo */}
        <div
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2.5 cursor-pointer group pr-2"
        >
          <SpotifyLogo
            size={32}
            className="text-spotify-green hover:scale-105 transition-transform"
          />
          <span className="font-extrabold text-lg tracking-tighter hidden sm:inline text-white group-hover:text-spotify-green transition-colors font-sans">
            Spotify
          </span>
        </div>

        {/* Back / Forward arrows */}
        <div className="flex items-center gap-1.5 ml-1">
          <button
            onClick={onGoBack}
            disabled={!canGoBack}
            className="h-8 w-8 rounded-full bg-neutral-900/80 hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors focus:outline-none"
            title="Quay lại"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={onGoForward}
            disabled={!canGoForward}
            className="h-8 w-8 rounded-full bg-neutral-900/80 hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors focus:outline-none"
            title="Tiếp theo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Center: Home icon + Spotify-style Pill Search Bar */}
      <div className="flex items-center gap-2 max-w-lg w-full px-2">
        <button
          onClick={() => onNavigate("home")}
          className={`h-11 w-11 rounded-full flex items-center justify-center shrink-0 transition-all focus:outline-none ${
            currentView === "home"
              ? "bg-white text-black font-bold scale-105 shadow-md"
              : "bg-neutral-900 text-spotify-subdued hover:text-white hover:bg-neutral-800"
          }`}
          title="Trang chủ"
        >
          <SpotifyHomeIcon size={22} filled={currentView === "home"} />
        </button>

        <div
          className={`relative flex-1 flex items-center h-11 rounded-full bg-neutral-900 hover:bg-neutral-800 transition-all border border-transparent ${
            isFocused ? "border-white bg-neutral-850 ring-1 ring-white/20" : ""
          }`}
        >
          <SpotifySearchIcon
            size={20}
            className="text-spotify-subdued absolute left-3.5 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Bạn muốn phát nội dung gì?"
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
            className="w-full h-full bg-transparent text-white placeholder:text-spotify-subdued text-sm pl-11 pr-9 rounded-full focus:outline-none font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 text-spotify-subdued hover:text-white focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Right: Actions & User profile */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="default"
          size="sm"
          className="hidden md:inline-flex bg-white hover:bg-neutral-200 text-black font-bold text-xs rounded-full h-8 px-3.5 tracking-tight"
        >
          <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-500 fill-amber-500" />
          Khám phá Premium
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="hidden lg:inline-flex text-spotify-subdued hover:text-white text-xs h-8 px-3 rounded-full hover:bg-white/10 font-semibold"
        >
          <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
          Cài đặt ứng dụng
        </Button>

        <button
          className="h-8 w-8 rounded-full bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center text-spotify-subdued hover:text-white transition-colors focus:outline-none"
          title="Thông báo"
        >
          <Bell className="h-4 w-4" />
        </button>

        <button
          className="h-8 w-8 rounded-full bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center text-spotify-subdued hover:text-white transition-colors hidden sm:flex focus:outline-none"
          title="Hoạt động bạn bè"
        >
          <Users className="h-4 w-4" />
        </button>

        {/* User profile avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-neutral-700 transition-all focus:outline-none ml-1">
              <Avatar className="h-9 w-9 border border-neutral-700">
                <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80" />
                <AvatarFallback>QT</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-neutral-900 border-neutral-800 text-neutral-200 rounded-lg shadow-2xl p-1.5 font-medium"
          >
            <DropdownMenuLabel className="font-semibold text-white px-2 py-1.5 tracking-tight">
              Tài khoản của bạn
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-neutral-800" />
            <DropdownMenuItem className="hover:bg-neutral-800 rounded cursor-pointer px-2 py-1.5 text-sm">
              Hồ sơ
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-neutral-800 rounded cursor-pointer px-2 py-1.5 text-sm">
              Nâng cấp lên Premium
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-neutral-800 rounded cursor-pointer px-2 py-1.5 text-sm">
              Cài đặt
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-neutral-800" />
            <DropdownMenuItem className="hover:bg-neutral-800 rounded cursor-pointer px-2 py-1.5 text-sm text-red-400">
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

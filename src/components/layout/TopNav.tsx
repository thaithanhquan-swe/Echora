import React, { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Home,
  Bell,
  Users,
  ExternalLink,
  Sparkles,
  Music2,
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
      {/* Left: Logo & Navigation arrows */}
      <div className="flex items-center gap-3">
        {/* App Logo */}
        <div
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 cursor-pointer group pr-2"
        >
          <div className="h-9 w-9 rounded-full bg-spotify-green flex items-center justify-center transition-transform group-hover:scale-105 shadow-md shadow-spotify-green/20">
            <Music2 className="h-5 w-5 text-black stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-lg tracking-tight hidden sm:inline text-white group-hover:text-spotify-green transition-colors">
            Echora
          </span>
        </div>

        {/* Back / Forward arrows */}
        <div className="flex items-center gap-1.5 ml-1">
          <button
            onClick={onGoBack}
            disabled={!canGoBack}
            className="h-8 w-8 rounded-full bg-neutral-900/80 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors"
            title="Go back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={onGoForward}
            disabled={!canGoForward}
            className="h-8 w-8 rounded-full bg-neutral-900/80 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors"
            title="Go forward"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Center: Home icon + Spotify-style Search bar */}
      <div className="flex items-center gap-2 max-w-lg w-full px-2">
        <button
          onClick={() => onNavigate("home")}
          className={`h-11 w-11 rounded-full flex items-center justify-center shrink-0 transition-all ${
            currentView === "home"
              ? "bg-white text-black font-bold scale-105 shadow-md"
              : "bg-neutral-900 text-neutral-300 hover:text-white hover:bg-neutral-800"
          }`}
          title="Home"
        >
          <Home className="h-5 w-5" />
        </button>

        <div
          className={`relative flex-1 flex items-center h-11 rounded-full bg-neutral-900 hover:bg-neutral-800 transition-all border border-transparent ${
            isFocused ? "border-white bg-neutral-850 ring-1 ring-white/20" : ""
          }`}
        >
          <Search className="h-5 w-5 text-neutral-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Bạn muốn nghe bài gì nào?"
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
            className="w-full h-full bg-transparent text-white placeholder-neutral-400 text-sm pl-11 pr-9 rounded-full focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 text-neutral-400 hover:text-white"
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
          className="hidden md:inline-flex bg-white hover:bg-neutral-200 text-black font-bold text-xs rounded-full h-8 px-3.5"
        >
          <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-500 fill-amber-500" />
          Khám phá Premium
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="hidden lg:inline-flex text-neutral-300 hover:text-white text-xs h-8 px-3 rounded-full hover:bg-white/10"
        >
          <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
          Cài đặt ứng dụng
        </Button>

        <button
          className="h-8 w-8 rounded-full bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
          title="Thông báo"
        >
          <Bell className="h-4 w-4" />
        </button>

        <button
          className="h-8 w-8 rounded-full bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white transition-colors hidden sm:flex"
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
            className="w-56 bg-neutral-900 border-neutral-800 text-neutral-200 rounded-lg shadow-2xl p-1.5"
          >
            <DropdownMenuLabel className="font-semibold text-white px-2 py-1.5">
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

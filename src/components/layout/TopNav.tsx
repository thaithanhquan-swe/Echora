import React, { useState } from "react"
import {
  Bell,
  Users,
  ArrowDownCircle,
  X,
  Layers,
  Home,
  Search,
  Radio,
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
}) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <header className="h-14 w-full flex items-center justify-between px-3 z-30 select-none bg-black">
      {/* Left: Echora Project Logo */}
      <div
        onClick={() => onNavigate("home")}
        className="flex items-center gap-2.5 cursor-pointer group pr-4 focus:outline-none"
      >
        <div className="h-9 w-9 rounded-full bg-spotify-green flex items-center justify-center transition-transform group-hover:scale-105 shadow-md shadow-spotify-green/20 shrink-0">
          <Radio className="h-5 w-5 text-black stroke-[2.5]" />
        </div>
        <span className="font-black text-xl tracking-tighter text-white group-hover:text-spotify-green transition-colors font-sans">
          Echora
        </span>
      </div>

      {/* Center: Home icon + Pill Search Bar */}
      <div className="flex items-center gap-2 max-w-lg w-full px-2">
        {/* Home Button */}
        <button
          onClick={() => onNavigate("home")}
          className={`h-11 w-11 rounded-full flex items-center justify-center shrink-0 transition-all focus:outline-none ${
            currentView === "home"
              ? "bg-neutral-800 text-white scale-105 shadow-md"
              : "bg-neutral-900 text-spotify-subdued hover:text-white hover:bg-neutral-800"
          }`}
          title="Home"
        >
          <Home className="h-5 w-5 stroke-[2.2]" />
        </button>

        {/* Pill Search Input */}
        <div
          className={`relative flex-1 flex items-center h-11 rounded-full bg-neutral-900 hover:bg-neutral-800 transition-all border border-transparent ${
            isFocused ? "border-white bg-neutral-850 ring-1 ring-white/20" : ""
          }`}
        >
          <Search className="h-4 w-4 text-spotify-subdued absolute left-3.5 pointer-events-none stroke-[2]" />

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
            className="w-full h-full bg-transparent text-white placeholder:text-spotify-subdued text-sm pl-10 pr-16 rounded-full focus:outline-none font-medium"
          />

          <div className="absolute right-3 flex items-center gap-2 text-spotify-subdued">
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

      {/* Right: Actions & User profile */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="default"
          size="sm"
          className="hidden md:inline-flex bg-white hover:bg-neutral-200 text-black font-bold text-xs rounded-full h-8 px-4 tracking-tight"
        >
          Explore Premium
        </Button>

        <button
          className="hidden lg:inline-flex items-center gap-1.5 text-white hover:scale-105 text-xs font-bold h-8 px-3 rounded-full hover:bg-white/10 transition-all focus:outline-none"
          title="Install App"
        >
          <ArrowDownCircle className="h-4 w-4 stroke-[2]" />
          <span>Install App</span>
        </button>

        <button
          className="h-8 w-8 rounded-full hover:bg-neutral-800 flex items-center justify-center text-spotify-subdued hover:text-white transition-colors focus:outline-none"
          title="Notifications"
        >
          <Bell className="h-4 w-4 stroke-[2]" />
        </button>

        <button
          className="h-8 w-8 rounded-full hover:bg-neutral-800 flex items-center justify-center text-spotify-subdued hover:text-white transition-colors hidden sm:flex focus:outline-none"
          title="Friend Activity"
        >
          <Users className="h-4 w-4 stroke-[2]" />
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
              Quân Thái (Account)
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

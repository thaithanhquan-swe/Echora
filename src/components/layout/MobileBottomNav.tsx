import React from "react"
import { Home, Search, Library } from "lucide-react"
import { ViewType } from "@/types/music"

interface MobileBottomNavProps {
  currentView: ViewType
  onNavigate: (view: ViewType, id?: string) => void
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
}) => {
  const navItems = [
    {
      id: "home" as ViewType,
      label: "Trang chủ",
      icon: Home,
      isActive: currentView === "home",
    },
    {
      id: "search" as ViewType,
      label: "Tìm kiếm",
      icon: Search,
      isActive: currentView === "search",
    },
    {
      id: "library" as ViewType,
      label: "Thư viện",
      icon: Library,
      isActive: currentView === "library" || currentView === "liked-songs",
    },
  ]

  return (
    <nav className="mobile-bottom-nav w-full bg-black/95 backdrop-blur-md border-t border-neutral-900 flex items-center justify-around px-2 z-40 select-none md:hidden shrink-0">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all focus:outline-none ${
              item.isActive
                ? "text-white"
                : "text-spotify-subdued hover:text-white"
            }`}
          >
            <Icon
              className={`h-5 w-5 mb-1 transition-transform ${
                item.isActive ? "scale-110 text-spotify-green stroke-[2.2]" : "stroke-[1.8]"
              }`}
            />
            <span
              className={`text-[11px] font-semibold tracking-tight ${
                item.isActive ? "text-white font-bold" : "text-spotify-subdued"
              }`}
            >
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

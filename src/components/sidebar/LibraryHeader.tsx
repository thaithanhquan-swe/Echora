import React from "react"
import { Plus, ArrowRight } from "lucide-react"
import { SpotifyLibraryIcon } from "@/components/icons/SpotifyIcons"

interface LibraryHeaderProps {
  isCollapsed: boolean
  onHeaderClick: () => void
  onPlusClick: () => void
  onToggleCollapse?: () => void
}

export const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  isCollapsed,
  onHeaderClick,
  onPlusClick,
  onToggleCollapse,
}) => {
  return (
    <div className="p-4 pb-2 flex items-center justify-between text-spotify-subdued hover:text-white transition-colors select-none">
      <button
        onClick={onHeaderClick}
        className="flex items-center gap-3 font-bold text-base hover:text-white transition-colors group focus:outline-none"
        title="Thư viện của bạn"
      >
        <SpotifyLibraryIcon
          size={24}
          className="group-hover:scale-105 transition-transform text-spotify-subdued group-hover:text-white"
        />
        {!isCollapsed && (
          <span className="tracking-tight text-spotify-subdued group-hover:text-white transition-colors">
            Thư viện
          </span>
        )}
      </button>

      {!isCollapsed && (
        <div className="flex items-center gap-1">
          <button
            onClick={onPlusClick}
            className="h-8 w-8 rounded-full hover:bg-neutral-800 flex items-center justify-center text-spotify-subdued hover:text-white transition-colors focus:outline-none"
            title="Tạo danh sách phát hoặc thư mục"
          >
            <Plus className="h-5 w-5" />
          </button>
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="h-8 w-8 rounded-full hover:bg-neutral-800 flex items-center justify-center text-spotify-subdued hover:text-white transition-colors focus:outline-none"
              title="Mở rộng thư viện"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

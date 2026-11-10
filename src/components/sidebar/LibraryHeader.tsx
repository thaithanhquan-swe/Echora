import React from "react"
import { ArrowRight, Library } from "lucide-react"

interface LibraryHeaderProps {
  isCollapsed: boolean
  onHeaderClick: () => void
  onToggleCollapse?: () => void
}

export const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  isCollapsed,
  onHeaderClick,
  onToggleCollapse,
}) => {
  return (
    <div className="p-4 pb-2 flex items-center justify-between text-spotify-subdued hover:text-white transition-colors select-none">
      <button
        onClick={isCollapsed && onToggleCollapse ? onToggleCollapse : onHeaderClick}
        className="flex items-center gap-2.5 font-bold text-sm hover:text-white transition-colors group focus:outline-none"
        title={isCollapsed ? "Mở rộng thư viện" : "Your Library"}
      >
        <Library
          className="h-5 w-5 stroke-[2] group-hover:scale-105 transition-transform text-spotify-subdued group-hover:text-white shrink-0"
        />
        {!isCollapsed && (
          <span className="tracking-tight text-white font-bold transition-colors">
            Your Library
          </span>
        )}
      </button>

      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? "Mở rộng thư viện" : "Thu gọn thư viện"}
          aria-expanded={!isCollapsed}
          className="h-7 w-7 rounded-full hover:bg-neutral-800 flex items-center justify-center text-spotify-subdued hover:text-white transition-colors focus:outline-none"
          title={isCollapsed ? "Mở rộng thư viện" : "Thu gọn thư viện"}
        >
          <ArrowRight
            className={`h-4 w-4 stroke-[2] transition-transform duration-200 ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      )}
    </div>
  )
}

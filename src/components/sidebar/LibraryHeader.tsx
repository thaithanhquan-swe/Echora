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
        className="flex items-center gap-2.5 font-bold text-sm hover:text-white transition-colors group focus:outline-none"
        title="Your Library"
      >
        <SpotifyLibraryIcon
          size={22}
          className="group-hover:scale-105 transition-transform text-spotify-subdued group-hover:text-white"
        />
        {!isCollapsed && (
          <span className="tracking-tight text-white font-bold transition-colors">
            Your Library
          </span>
        )}
      </button>

      {!isCollapsed && (
        <div className="flex items-center gap-2">
          {/* Exact "+ Create" pill button from screenshot */}
          <button
            onClick={onPlusClick}
            className="h-7 px-3 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center gap-1 text-xs font-bold text-white transition-colors focus:outline-none hover:scale-105 active:scale-95"
            title="Create playlist or folder"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Create</span>
          </button>

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="h-7 w-7 rounded-full hover:bg-neutral-800 flex items-center justify-center text-spotify-subdued hover:text-white transition-colors focus:outline-none"
              title="Expand Your Library"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

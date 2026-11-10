import React from "react"
import { Badge } from "@/components/ui/badge"

export type LibraryFilterType = "all" | "playlists"

interface LibraryFilterChipsProps {
  filter: LibraryFilterType
  onSelectFilter: (filter: LibraryFilterType) => void
}

export const LibraryFilterChips: React.FC<LibraryFilterChipsProps> = ({
  filter,
  onSelectFilter,
}) => {
  return (
    <div className="px-3 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar select-none">
      {filter !== "all" && (
        <button
          onClick={() => onSelectFilter("all")}
          className="h-7 w-7 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center text-xs shrink-0 transition-colors focus:outline-none"
          title="Clear filter"
        >
          ✕
        </button>
      )}

      <Badge
        variant={filter === "playlists" ? "active" : "default"}
        onClick={() => onSelectFilter(filter === "playlists" ? "all" : "playlists")}
        className="cursor-pointer shrink-0 py-1.5 px-3 text-xs font-semibold"
      >
        Playlists
      </Badge>


    </div>
  )
}

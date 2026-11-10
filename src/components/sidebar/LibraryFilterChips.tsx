import React from "react"
import { Badge } from "@/components/ui/badge"

export type LibraryFilterType = "all" | "playlists" | "artists" | "albums"

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
          title="Xóa bộ lọc"
        >
          ✕
        </button>
      )}

      <Badge
        variant={filter === "playlists" ? "active" : "default"}
        onClick={() => onSelectFilter(filter === "playlists" ? "all" : "playlists")}
        className="cursor-pointer shrink-0 py-1.5 px-3 text-xs font-semibold"
      >
        Danh sách phát
      </Badge>

      <Badge
        variant={filter === "artists" ? "active" : "default"}
        onClick={() => onSelectFilter(filter === "artists" ? "all" : "artists")}
        className="cursor-pointer shrink-0 py-1.5 px-3 text-xs font-semibold"
      >
        Nghệ sĩ
      </Badge>

      <Badge
        variant={filter === "albums" ? "active" : "default"}
        onClick={() => onSelectFilter(filter === "albums" ? "all" : "albums")}
        className="cursor-pointer shrink-0 py-1.5 px-3 text-xs font-semibold"
      >
        Album
      </Badge>
    </div>
  )
}

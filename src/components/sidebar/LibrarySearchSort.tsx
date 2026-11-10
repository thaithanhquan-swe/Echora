import React, { useState } from "react"
import { Search, List, X } from "lucide-react"

interface LibrarySearchSortProps {
  searchQuery: string
  onSearchChange: (q: string) => void
}

export const LibrarySearchSort: React.FC<LibrarySearchSortProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  const [showSearch, setShowSearch] = useState(false)

  return (
    <div className="px-3 py-1 flex items-center justify-between text-spotify-subdued text-xs select-none">
      <div className="flex items-center gap-1.5 flex-1 mr-2">
        {showSearch ? (
          <div className="flex items-center bg-neutral-800 rounded px-2 py-1 w-full animate-in fade-in">
            <Search className="h-3.5 w-3.5 text-spotify-subdued mr-1.5 shrink-0" />
            <input
              type="text"
              placeholder="Search in Your Library..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-transparent text-white text-xs w-full focus:outline-none"
              autoFocus
              onBlur={() => {
                if (!searchQuery) setShowSearch(false)
              }}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="text-spotify-subdued hover:text-white ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="p-1.5 rounded-full hover:bg-neutral-800 hover:text-white transition-colors focus:outline-none"
            title="Search in Your Library"
          >
            <Search className="h-4 w-4" />
          </button>
        )}
      </div>

      <button className="flex items-center gap-1.5 hover:text-white transition-colors py-1 px-2 rounded hover:bg-neutral-800 focus:outline-none font-semibold text-xs">
        <span>Recents</span>
        <List className="h-4 w-4" />
      </button>
    </div>
  )
}

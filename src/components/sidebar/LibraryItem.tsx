import React from "react"
import { Volume2, Pin } from "lucide-react"

interface LibraryItemProps {
  id: string
  title: string
  subtitle: string
  imageUrl?: string
  isPinned?: boolean
  isActiveTrack?: boolean
  isPlaying?: boolean
  isSelected?: boolean
  isArtist?: boolean
  isCollapsed?: boolean
  customIcon?: React.ReactNode
  onClick?: () => void
}

export const LibraryItem: React.FC<LibraryItemProps> = ({
  title,
  subtitle,
  imageUrl,
  isPinned = false,
  isActiveTrack = false,
  isPlaying = false,
  isSelected = false,
  isArtist = false,
  isCollapsed = false,
  customIcon,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-all select-none group ${
        isSelected
          ? "bg-neutral-800 text-white"
          : "text-neutral-300 hover:bg-neutral-800/60"
      }`}
    >
      {/* Thumbnail or Custom Gradient Icon */}
      {customIcon ? (
        customIcon
      ) : (
        <img
          src={imageUrl}
          alt={title}
          className={`h-12 w-12 object-cover shrink-0 shadow-md ${
            isArtist ? "rounded-full" : "rounded"
          }`}
        />
      )}

      {!isCollapsed && (
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p
              className={`font-semibold text-sm truncate tracking-tight ${
                isActiveTrack ? "text-spotify-green" : "text-white"
              }`}
            >
              {title}
            </p>
            {isActiveTrack && isPlaying && (
              <Volume2 className="h-3.5 w-3.5 text-spotify-green shrink-0 animate-pulse ml-1" />
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-spotify-subdued">
            {isPinned && (
              <Pin className="h-3 w-3 text-spotify-green fill-spotify-green shrink-0" />
            )}
            <span className="truncate">{subtitle}</span>
          </div>
        </div>
      )}
    </div>
  )
}

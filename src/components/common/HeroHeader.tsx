import React from "react"

interface HeroHeaderProps {
  type: string
  title: string
  description?: string
  coverUrl?: string
  colorTheme?: string
  customCover?: React.ReactNode
  metaInfo: React.ReactNode
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({
  type,
  title,
  description,
  coverUrl,
  colorTheme = "#1db954",
  customCover,
  metaInfo,
}) => {
  return (
    <div
      style={{
        background: `linear-gradient(180deg, ${colorTheme}aa 0%, ${colorTheme}33 75%, rgba(18,18,18,0.98) 100%)`,
      }}
      className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-end gap-6 pt-16 select-none transition-colors duration-500"
    >
      {/* Cover image or custom avatar/gradient */}
      {customCover ? (
        customCover
      ) : (
        <img
          src={coverUrl}
          alt={title}
          className="h-48 w-48 lg:h-60 lg:w-60 rounded-md object-cover shadow-2xl shrink-0"
        />
      )}

      {/* Title & Metadata */}
      <div className="flex flex-col gap-2 min-w-0">
        <span className="text-xs uppercase font-extrabold tracking-widest text-white/90">
          {type}
        </span>
        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight drop-shadow-md">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-neutral-300 mt-1 line-clamp-2 max-w-2xl font-medium">
            {description}
          </p>
        )}

        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-white/90 mt-2 flex-wrap">
          {metaInfo}
        </div>
      </div>
    </div>
  )
}

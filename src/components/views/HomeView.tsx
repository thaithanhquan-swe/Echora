import React, { useState } from "react"
import {
  MOCK_SONGS,
  RECOMMENDED_STATIONS,
  JUMP_BACK_IN,
} from "@/data/mockData"
import { ViewType } from "@/types/music"
import { QuickPickCard } from "@/components/common/QuickPickCard"
import { RadioCard } from "@/components/common/RadioCard"
import { MediaCard } from "@/components/common/MediaCard"
import { Badge } from "@/components/ui/badge"

interface HomeViewProps {
  onNavigate: (view: ViewType, id?: string) => void
}

type ContentFilter = "all" | "music" | "podcasts" | "audiobooks"

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<ContentFilter>("all")

  // The 8 Quick Pick items from user's exact screenshot
  const quickPicks = [
    {
      title: "ĐÔI CHÂN ĐI",
      imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80",
      songs: [MOCK_SONGS[2]],
      onClick: () => onNavigate("album", "album-doichandi"),
    },
    {
      title: "Liked Songs",
      imageUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=80",
      songs: MOCK_SONGS,
      onClick: () => onNavigate("liked-songs"),
    },
    {
      title: "Như Một Người Rưng",
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&auto=format&fit=crop&q=80",
      songs: [MOCK_SONGS[3]],
      onClick: () => onNavigate("album", "album-hieu"),
    },
    {
      title: "Ai Cũng Phải Bắt Đầu Từ Đâu Đó",
      imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80",
      songs: [MOCK_SONGS[4]],
      onClick: () => onNavigate("album", "album-hieu"),
    },
    {
      title: "ANH BỜ VAI (Ấn Bản KIM)",
      imageUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=80",
      songs: [MOCK_SONGS[5]],
      onClick: () => onNavigate("album", "album-anhbovai"),
    },
    {
      title: "Kiss It Better Radio",
      imageUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&auto=format&fit=crop&q=80",
      songs: [MOCK_SONGS[6]],
      onClick: () => onNavigate("home"),
    },
    {
      title: "phonk",
      imageUrl: "https://images.unsplash.com/photo-1445985543469-433ecdd6294c?w=300&auto=format&fit=crop&q=80",
      songs: [MOCK_SONGS[7]],
      onClick: () => onNavigate("playlist", "pl-phonk"),
    },
    {
      title: "Chúng Ta Đều Muốn Một Thứ",
      imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=300&auto=format&fit=crop&q=80",
      songs: [MOCK_SONGS[8]],
      onClick: () => onNavigate("artist", "artist-vu"),
    },
  ]

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-300 select-none">
      {/* 1. Top Content Filter Pills */}
      <div className="flex items-center gap-2">
        <Badge
          variant={filter === "all" ? "active" : "default"}
          onClick={() => setFilter("all")}
          className="cursor-pointer py-1.5 px-4 text-xs font-bold"
        >
          All
        </Badge>
        <Badge
          variant={filter === "music" ? "active" : "default"}
          onClick={() => setFilter("music")}
          className="cursor-pointer py-1.5 px-4 text-xs font-bold"
        >
          Music
        </Badge>
        <Badge
          variant={filter === "podcasts" ? "active" : "default"}
          onClick={() => setFilter("podcasts")}
          className="cursor-pointer py-1.5 px-4 text-xs font-bold"
        >
          Podcasts
        </Badge>
        <Badge
          variant={filter === "audiobooks" ? "active" : "default"}
          onClick={() => setFilter("audiobooks")}
          className="cursor-pointer py-1.5 px-4 text-xs font-bold"
        >
          Audiobooks
        </Badge>
      </div>

      {/* 2. Quick Picks 8-card grid (Large roomy cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {quickPicks.map((item, idx) => (
          <QuickPickCard
            key={idx}
            title={item.title}
            imageUrl={item.imageUrl}
            songs={item.songs}
            onClick={item.onClick}
          />
        ))}
      </div>

      {/* 3. Section 1: Recommended Stations (Large spacious cards) */}
      <div>
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-xs text-spotify-subdued font-medium mb-1">
              Non-stop music based on your favorite songs and artists.
            </p>
            <h2 className="text-2xl font-bold text-white tracking-tight hover:underline cursor-pointer">
              Recommended Stations
            </h2>
          </div>
          <button className="text-xs font-bold text-spotify-subdued hover:underline hover:text-white transition-colors focus:outline-none">
            Show all
          </button>
        </div>

        {/* 5 Big Columns max matching real Spotify layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {RECOMMENDED_STATIONS.slice(0, 5).map((station) => (
            <RadioCard
              key={station.id}
              station={station}
              onClick={() => onNavigate("home")}
            />
          ))}
        </div>
      </div>

      {/* 4. Section 2: Jump back in (Matching exact second screenshot from user) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white tracking-tight hover:underline cursor-pointer">
            Jump back in
          </h2>
          <button className="text-xs font-bold text-spotify-subdued hover:underline hover:text-white transition-colors focus:outline-none">
            Show all
          </button>
        </div>

        {/* 5 Big Columns max */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {JUMP_BACK_IN.slice(0, 5).map((item) => (
            <MediaCard
              key={item.id}
              id={item.id}
              title={item.title}
              subtitle={item.subtitle}
              imageUrl={item.imageUrl}
              type={item.type}
              songs={item.songs}
              onClick={() => onNavigate("home")}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

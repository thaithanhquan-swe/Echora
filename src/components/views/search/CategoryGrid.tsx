import React from "react"
import { MOCK_CATEGORIES, MOCK_PLAYLISTS } from "@/data/mockData"
import { ViewType } from "@/types/music"

interface CategoryGridProps {
  onNavigate: (view: ViewType, id?: string) => void
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onNavigate }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white tracking-tight mb-5">
        Duyệt tìm tất cả
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {MOCK_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            onClick={() => {
              onNavigate("playlist", MOCK_PLAYLISTS[0].id)
            }}
            style={{ backgroundColor: cat.color }}
            className="relative h-44 rounded-lg p-4 overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform duration-200 select-none shadow-md group"
          >
            <h3 className="font-bold text-xl text-white tracking-tight break-words pr-2">
              {cat.title}
            </h3>

            <img
              src={cat.imageUrl}
              alt={cat.title}
              className="absolute -bottom-2 -right-3 h-24 w-24 object-cover rounded shadow-2xl transform rotate-[25deg] group-hover:rotate-[28deg] group-hover:scale-105 transition-all duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

import React from "react"
import { ViewType } from "@/types/music"

interface CategoryGridProps {
  onNavigate: (view: ViewType, id?: string) => void
}

interface CategoryItem {
  id: string
  title: string
  color: string
  imageUrl: string
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "v-pop",
    title: "V-Pop",
    color: "#e1118c",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "pop",
    title: "Pop Hits",
    color: "#148a08",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "hip-hop",
    title: "Hip-Hop",
    color: "#ba5d07",
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "dance",
    title: "Dance/EDM",
    color: "#006450",
    imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "indie",
    title: "Indie Việt",
    color: "#608108",
    imageUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "chill",
    title: "Chill & Relax",
    color: "#477d95",
    imageUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "k-pop",
    title: "K-Pop",
    color: "#8d67ab",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "rock",
    title: "Rock",
    color: "#e61e32",
    imageUrl: "https://images.unsplash.com/photo-1445985543469-433ecdd6294c?w=300&auto=format&fit=crop&q=80",
  },
]

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onNavigate }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white tracking-tight mb-5">
        Duyệt tìm tất cả
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onNavigate("search", cat.title)}
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

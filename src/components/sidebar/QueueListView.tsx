import React from "react"
import { Trash2, Play, Pause } from "lucide-react"
import { Song } from "@/types/music"

interface QueueListViewProps {
  currentTrack: Song | null
  isPlaying: boolean
  queue: Song[]
  onTogglePlay: () => void
  onPlayTrack: (song: Song) => void
  onRemoveFromQueue: (index: number) => void
}

export const QueueListView: React.FC<QueueListViewProps> = ({
  currentTrack,
  isPlaying,
  queue,
  onTogglePlay,
  onPlayTrack,
  onRemoveFromQueue,
}) => {
  return (
    <div className="space-y-6 select-none">
      {/* Currently Playing Track */}
      {currentTrack && (
        <div>
          <h4 className="text-xs font-bold text-spotify-subdued uppercase tracking-wider mb-3">
            Đang phát
          </h4>
          <div className="flex items-center gap-3 p-2 rounded-lg bg-neutral-800/80 group">
            <div className="relative h-12 w-12 rounded overflow-hidden shrink-0">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="h-full w-full object-cover"
              />
              <button
                onClick={onTogglePlay}
                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 fill-white text-white" />
                ) : (
                  <Play className="h-4 w-4 fill-white text-white ml-0.5" />
                )}
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-spotify-green truncate tracking-tight">
                {currentTrack.title}
              </p>
              <p className="text-xs text-spotify-subdued truncate">
                {currentTrack.artist}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Next Up List */}
      <div>
        <h4 className="text-xs font-bold text-spotify-subdued uppercase tracking-wider mb-3">
          Tiếp theo trong danh sách ({queue.length})
        </h4>

        {queue.length === 0 ? (
          <p className="text-sm text-spotify-subdued py-4 text-center">
            Không có bài hát nào trong hàng đợi
          </p>
        ) : (
          <div className="space-y-1">
            {queue.map((song, idx) => (
              <div
                key={`${song.id}-${idx}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-800/60 group transition-colors"
              >
                <span className="text-xs text-spotify-subdued w-4 text-center">
                  {idx + 1}
                </span>
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="h-10 w-10 rounded object-cover shrink-0"
                />
                <div
                  onClick={() => onPlayTrack(song)}
                  className="flex-1 min-w-0 cursor-pointer"
                >
                  <p className="font-medium text-sm text-white truncate group-hover:text-spotify-green transition-colors tracking-tight">
                    {song.title}
                  </p>
                  <p className="text-xs text-spotify-subdued truncate">
                    {song.artist}
                  </p>
                </div>
                <button
                  onClick={() => onRemoveFromQueue(idx)}
                  className="h-8 w-8 rounded-full hover:bg-neutral-700 flex items-center justify-center text-spotify-subdued hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
                  title="Xóa khỏi hàng đợi"
                >
                  <Trash2 className="h-4 w-4 stroke-[2]" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

import React from "react"
import { Slider } from "@/components/ui/slider"
import { SpotifyVolumeIcon } from "@/components/icons/SpotifyIcons"

interface VolumeControlProps {
  volume: number
  isMuted: boolean
  onVolumeChange: (vol: number) => void
  onToggleMute: () => void
}

export const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}) => {
  const handleSlider = (vals: number[]) => {
    if (vals && vals[0] !== undefined) {
      onVolumeChange(vals[0] / 100)
    }
  }

  return (
    <div className="flex items-center gap-2 w-28 group select-none">
      <button
        onClick={onToggleMute}
        className="text-spotify-subdued hover:text-white transition-colors focus:outline-none"
        title={isMuted ? "Bật âm" : "Tắt âm"}
      >
        <SpotifyVolumeIcon size={16} volume={volume} isMuted={isMuted} />
      </button>

      <Slider
        value={[isMuted ? 0 : volume * 100]}
        max={100}
        step={1}
        onValueChange={handleSlider}
        className="w-20"
      />
    </div>
  )
}

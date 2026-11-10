import React from "react"
import { Volume2, Volume1, VolumeX } from "lucide-react"
import { Slider } from "@/components/ui/slider"

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

  const renderVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <VolumeX className="h-4 w-4 stroke-[2]" />
    }
    if (volume < 0.5) {
      return <Volume1 className="h-4 w-4 stroke-[2]" />
    }
    return <Volume2 className="h-4 w-4 stroke-[2]" />
  }

  return (
    <div className="flex items-center gap-2 w-28 group select-none">
      <button
        onClick={onToggleMute}
        className="text-spotify-subdued hover:text-white transition-colors focus:outline-none"
        title={isMuted ? "Bật âm" : "Tắt âm"}
      >
        {renderVolumeIcon()}
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

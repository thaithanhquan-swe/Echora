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
      return <VolumeX className="h-5 w-5 stroke-[1.8]" />
    }
    if (volume < 0.5) {
      return <Volume1 className="h-5 w-5 stroke-[1.8]" />
    }
    return <Volume2 className="h-5 w-5 stroke-[1.8]" />
  }

  return (
    <div className="flex items-center gap-2.5 w-32 group select-none">
      <button
        onClick={onToggleMute}
        className="text-spotify-subdued hover:text-white transition-colors focus:outline-none shrink-0"
        title={isMuted ? "Bật âm" : "Tắt âm"}
      >
        {renderVolumeIcon()}
      </button>

      <Slider
        value={[isMuted ? 0 : volume * 100]}
        max={100}
        step={1}
        onValueChange={handleSlider}
        className="w-24"
      />
    </div>
  )
}

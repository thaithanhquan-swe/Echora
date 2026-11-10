import React, { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { formatTime } from "@/lib/utils"

interface ProgressBarProps {
  currentTime: number
  duration: number
  onSeek: (seconds: number) => void
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onSeek,
}) => {
  const [isHovering, setIsHovering] = useState(false)

  const handleSliderChange = (value: number[]) => {
    if (value && value[0] !== undefined) {
      onSeek(value[0])
    }
  }

  return (
    <div
      className="flex items-center gap-2 w-full text-[11px] font-medium text-spotify-subdued tabular-nums select-none"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <span className="w-10 text-right">{formatTime(currentTime)}</span>

      <Slider
        value={[currentTime]}
        max={duration || 100}
        step={1}
        onValueChange={handleSliderChange}
        className="flex-1"
        showThumbOnHoverOnly={!isHovering}
      />

      <span className="w-10 text-left">{formatTime(duration)}</span>
    </div>
  )
}

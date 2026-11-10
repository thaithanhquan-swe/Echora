import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    showThumbOnHoverOnly?: boolean
  }
>(({ className, showThumbOnHoverOnly = true, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center group cursor-pointer py-1.5",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-neutral-600 group-hover:h-1.5 transition-all">
      <SliderPrimitive.Range className="absolute h-full bg-white group-hover:bg-spotify-green transition-colors" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        "block h-3 w-3 rounded-full bg-white shadow-md transition-opacity focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        showThumbOnHoverOnly ? "opacity-0 group-hover:opacity-100" : "opacity-100"
      )}
    />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }

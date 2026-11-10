import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-white text-black hover:scale-105 active:scale-95 shadow-md",
        spotify:
          "bg-spotify-green text-black font-bold hover:scale-105 hover:bg-spotify-lightgreen active:scale-95 shadow-lg shadow-black/40",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-white/20 bg-transparent text-white hover:border-white hover:scale-105",
        secondary:
          "bg-white/10 text-white hover:bg-white/20 active:bg-white/15",
        ghost:
          "text-neutral-400 hover:text-white hover:bg-white/10",
        link:
          "text-white underline-offset-4 hover:underline",
        icon:
          "text-neutral-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 rounded-full px-4 text-xs",
        lg: "h-12 rounded-full px-8 text-base",
        icon: "h-10 w-10 p-0",
        iconSm: "h-8 w-8 p-0",
        play: "h-12 w-12 rounded-full p-0 flex items-center justify-center",
        playLg: "h-14 w-14 rounded-full p-0 flex items-center justify-center",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

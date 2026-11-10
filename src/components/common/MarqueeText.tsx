import React, { useEffect, useRef, useState } from "react"

interface MarqueeTextProps {
  children: string
  className?: string
  onClick?: React.MouseEventHandler<HTMLSpanElement>
}

export const MarqueeText: React.FC<MarqueeTextProps> = ({
  children,
  className = "",
  onClick,
}) => {
  const containerRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [overflowDistance, setOverflowDistance] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    const text = textRef.current
    if (!container || !text) return

    const measureOverflow = () => {
      setOverflowDistance(Math.max(0, text.scrollWidth - container.clientWidth))
    }

    measureOverflow()
    const observer = new ResizeObserver(measureOverflow)
    observer.observe(container)
    observer.observe(text)
    return () => observer.disconnect()
  }, [children])

  return (
    <span
      ref={containerRef}
      className={`marquee-container ${className}`}
      title={children}
      onClick={onClick}
    >
      <span
        ref={textRef}
        className="marquee-content"
        data-overflow={overflowDistance > 0}
        style={
          overflowDistance > 0
            ? {
                "--marquee-distance": `${overflowDistance}px`,
                "--marquee-duration": `${Math.max(4, overflowDistance / 30)}s`,
              } as React.CSSProperties
            : undefined
        }
      >
        {children}
      </span>
    </span>
  )
}

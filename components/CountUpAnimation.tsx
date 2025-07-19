"use client"

import { useEffect, useRef } from "react"

interface CountUpAnimationProps {
  end: number
  start?: number
  duration?: number
  className?: string
  onComplete?: () => void
}

export default function CountUpAnimation({
  end,
  start = 0,
  duration = 2000,
  className = "",
  onComplete,
}: CountUpAnimationProps) {
  const elementRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!elementRef.current) return

    const element = elementRef.current
    const startTime = Date.now()
    const startValue = start
    const endValue = end
    const totalDuration = duration

    const animate = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / totalDuration, 1)

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOut)

      element.textContent = currentValue.toString()

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        element.textContent = endValue.toString()
        onComplete?.()
      }
    }

    animate()
  }, [end, start, duration, onComplete])

  return (
    <span ref={elementRef} className={className}>
      {start}
    </span>
  )
}

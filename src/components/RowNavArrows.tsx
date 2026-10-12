import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Props = {
  canScrollLeft: boolean
  canScrollRight: boolean
  onScrollLeft: () => void
  onScrollRight: () => void
}

export default function RowNavArrows({ canScrollLeft, canScrollRight, onScrollLeft, onScrollRight }: Props) {
  return (
    <div className="hidden lg:flex items-center gap-4 shrink-0">
      <button
        type="button"
        onClick={onScrollLeft}
        disabled={!canScrollLeft}
        className={`p-1 transition-colors ${canScrollLeft ? "text-white/90 hover:text-white" : "text-white/25 cursor-default"}`}
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-6 w-6 stroke-[1.75]" />
      </button>
      <button
        type="button"
        onClick={onScrollRight}
        disabled={!canScrollRight}
        className={`p-1 transition-colors ${canScrollRight ? "text-white hover:text-white" : "text-white/25 cursor-default"}`}
        aria-label="Scroll right"
      >
        <ChevronRight className="h-6 w-6 stroke-[1.75]" />
      </button>
    </div>
  )
}

export function useHorizontalRowScroll(deps: unknown[] = []) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const previousScrollBehaviorRef = useRef<string | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollState = () => {
    const el = scrollerRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    const hasOverflow = scrollWidth > clientWidth + 4
    setCanScrollLeft(hasOverflow && scrollLeft > 8)
    setCanScrollRight(hasOverflow && scrollLeft < scrollWidth - clientWidth - 8)
  }

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const run = () => requestAnimationFrame(updateScrollState)
    run()
    const t = window.setTimeout(run, 120)
    el.addEventListener("scroll", run, { passive: true })
    window.addEventListener("resize", run)
    return () => {
      window.clearTimeout(t)
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current)
      if (previousScrollBehaviorRef.current !== null) {
        el.style.scrollBehavior = previousScrollBehaviorRef.current
        previousScrollBehaviorRef.current = null
      }
      el.removeEventListener("scroll", run)
      window.removeEventListener("resize", run)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  const scrollByPage = (direction: "left" | "right") => {
    const el = scrollerRef.current
    if (!el) return
    const amount = Math.max(el.clientWidth * 0.85, 320)
    const start = el.scrollLeft
    const target = start + (direction === "left" ? -amount : amount)
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const duration = reducedMotion ? 800 : 1100

    if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current)
    animationFrameRef.current = null

    if (previousScrollBehaviorRef.current === null) {
      previousScrollBehaviorRef.current = el.style.scrollBehavior
    }
    el.style.scrollBehavior = "auto"
    const startedAt = performance.now()
    const animate = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1)
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2
      el.scrollLeft = start + (target - start) * eased

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        animationFrameRef.current = null
        el.style.scrollBehavior = previousScrollBehaviorRef.current ?? ""
        previousScrollBehaviorRef.current = null
        updateScrollState()
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)
  }

  return { scrollerRef, canScrollLeft, canScrollRight, scrollByPage, updateScrollState }
}

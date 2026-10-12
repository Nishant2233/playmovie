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
      el.removeEventListener("scroll", run)
      window.removeEventListener("resize", run)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  const scrollByPage = (direction: "left" | "right") => {
    const el = scrollerRef.current
    if (!el) return
    const amount = Math.max(el.clientWidth * 0.85, 320)
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" })
    window.setTimeout(updateScrollState, 280)
  }

  return { scrollerRef, canScrollLeft, canScrollRight, scrollByPage, updateScrollState }
}

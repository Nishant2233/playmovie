import { useRef, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useWatchProgress } from "../contex/watchProgress.context"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

const ContinueWatching = () => {
  const { items, remove } = useWatchProgress()
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    const checkScroll = () => {
      if (!scrollRef.current) return
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      const hasMoreContent = scrollWidth > clientWidth
      setCanScrollLeft(scrollLeft > 10)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10 && hasMoreContent)
    }

    // Initial check
    setTimeout(checkScroll, 100)
    
    const scrollElement = scrollRef.current
    scrollElement?.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)

    return () => {
      scrollElement?.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [items])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const cardWidth = 320 // width of each card + gap
    const scrollAmount = cardWidth * 2 // scroll 2 cards at a time
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
    
    // Update arrow visibility after scroll
    setTimeout(() => {
      if (!scrollRef.current) return
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 10)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }, 100)
  }

  if (items.length === 0) return null

  return (
    <div className="px-0 md:px-10 mb-10">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1 h-6 bg-[var(--accent)]" />
        <h2 className="text-2xl md:text-3xl font-bold">Continue Watching</h2>
      </div>
      
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-black/80 hover:bg-black backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all shadow-lg ${
            canScrollLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2 pl-0 pr-0"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            paddingLeft: canScrollLeft ? '0' : '0',
            paddingRight: canScrollRight ? '0' : '0'
          }}
        >
          {items.map((item) => {
            const progressPercent = Math.min(100, Math.max(0, item.progress))
            const isTV = item.type === 'tv'
            const playUrl = isTV 
              ? `/tv/${item.id}${item.season && item.episode ? `?season=${item.season}&episode=${item.episode}` : ''}`
              : `/player/${item.id}`

            const handleRemove = (e: React.MouseEvent) => {
              e.stopPropagation()
              remove(item.id, item.type)
            }

            return (
              <div
                key={`${item.type}-${item.id}`}
                className="relative group flex-shrink-0 w-[280px] md:w-[320px] cursor-pointer"
                onClick={() => navigate(playUrl)}
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-900">
                  <img
                    src={item.backdrop_path 
                      ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}`
                      : item.poster_path
                      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                      : ''}
                    alt={item.title || item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div
                      className="h-full bg-purple-600 transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Overlay on hover - only shows on this specific card */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white text-2xl">
                      ▶
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={handleRemove}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/80 hover:bg-red-600/80 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Remove from continue watching"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Type badge */}
                  <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/70 backdrop-blur text-xs font-semibold text-white">
                    {isTV ? `S${item.season || 1}E${item.episode || 1}` : 'Movie'}
                  </div>

                  {/* Progress percentage */}
                  <div className="absolute top-12 right-3 px-2 py-1 rounded bg-black/70 backdrop-blur text-xs font-semibold text-white">
                    {Math.round(progressPercent)}%
                  </div>
                </div>

                {/* Title */}
                <div className="mt-2">
                  <h3 className="text-white font-semibold line-clamp-1 group-hover:text-purple-400 transition-colors">
                    {item.title || item.name}
                  </h3>
                  <p className="text-white/60 text-sm mt-1">
                    {isTV && item.season && item.episode 
                      ? `Season ${item.season} • Episode ${item.episode}`
                      : 'Continue watching'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-black/80 hover:bg-black backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all shadow-lg ${
            canScrollRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default ContinueWatching


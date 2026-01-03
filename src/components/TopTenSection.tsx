import { useRef, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"
import apiClient from "../services/api-client"

type SlidingSectionProps = {
  title: string
  items: any[]
  type: 'movie' | 'tv'
}

const SlidingSection = ({ title, items, type }: SlidingSectionProps) => {
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
    const cardWidth = 400
    const scrollAmount = cardWidth * 2
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
    
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
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
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
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {items.map((item, index) => {
            const playUrl = type === 'tv' ? `/tv/${item.id}` : `/player/${item.id}`

            return (
              <div
                key={`${type}-${item.id}`}
                className="relative group flex-shrink-0 w-[360px] md:w-[400px] cursor-pointer"
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
                  
                  {/* Rank Number */}
                  <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-purple-600/90 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white text-2xl">
                      ▶
                    </div>
                  </div>

                  {/* Type badge */}
                  <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/70 backdrop-blur text-xs font-semibold text-white">
                    {type === 'tv' ? 'TV Series' : 'Movie'}
                  </div>

                  {/* Rating badge */}
                  {item.vote_average && (
                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/70 backdrop-blur text-xs font-semibold text-white">
                      ⭐ {item.vote_average.toFixed(1)}
                    </div>
                  )}
                </div>

                {/* Title */}
                <div className="mt-2">
                  <h3 className="text-white font-semibold line-clamp-1 group-hover:text-purple-400 transition-colors">
                    {item.title || item.name}
                  </h3>
                  <p className="text-white/60 text-sm mt-1 line-clamp-2">
                    {item.overview || 'Top rated content'}
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

const TopTenSection = () => {
  const [topMovies, setTopMovies] = useState<any[]>([])
  const [topTvShows, setTopTvShows] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      apiClient.get('/movie/popular', { params: { page: 1 } }),
      apiClient.get('/tv/popular', { params: { page: 1 } })
    ]).then(([movies, tv]) => {
      setTopMovies((movies.data.results || []).slice(0, 10))
      setTopTvShows((tv.data.results || []).slice(0, 10))
    }).catch(() => {})
  }, [])

  return (
    <>
      <SlidingSection title="Top 10 Movies" items={topMovies} type="movie" />
      <SlidingSection title="Top 10 TV Series" items={topTvShows} type="tv" />
    </>
  )
}

export default TopTenSection


import { useNavigate } from "react-router-dom"
import { useWatchProgress } from "../contex/watchProgress.context"
import { X } from "lucide-react"
import RowNavArrows, { useHorizontalRowScroll } from "./RowNavArrows"

const ContinueWatching = () => {
  const { items, remove } = useWatchProgress()
  const navigate = useNavigate()
  const { scrollerRef, canScrollLeft, canScrollRight, scrollByPage } = useHorizontalRowScroll([items.length])

  if (items.length === 0) return null

  return (
    <div className="px-0 md:px-10 mb-10">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-1 h-6 bg-[var(--accent)] shrink-0" />
          <h2 className="text-2xl md:text-3xl font-bold truncate">Continue Watching</h2>
        </div>
        <RowNavArrows
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          onScrollLeft={() => scrollByPage("left")}
          onScrollRight={() => scrollByPage("right")}
        />
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {items.map((item) => {
          const progressPercent = Math.min(100, Math.max(0, item.progress))
          const isTV = item.type === "tv"
          const playUrl = isTV
            ? `/tv/${item.id}${item.season && item.episode ? `?season=${item.season}&episode=${item.episode}` : ""}`
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
                  src={
                    item.backdrop_path
                      ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}`
                      : item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : ""
                  }
                  alt={item.title || item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                  <div className="h-full bg-purple-600 transition-all" style={{ width: `${progressPercent}%` }} />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white text-2xl">
                    ▶
                  </div>
                </div>

                <button
                  onClick={handleRemove}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/80 hover:bg-red-600/80 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Remove from continue watching"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/70 backdrop-blur text-xs font-semibold text-white">
                  {isTV ? `S${item.season || 1}E${item.episode || 1}` : "Movie"}
                </div>

                <div className="absolute top-12 right-3 px-2 py-1 rounded bg-black/70 backdrop-blur text-xs font-semibold text-white">
                  {Math.round(progressPercent)}%
                </div>
              </div>

              <div className="mt-2">
                <h3 className="text-white font-semibold line-clamp-1 group-hover:text-purple-400 transition-colors">
                  {item.title || item.name}
                </h3>
                <p className="text-white/60 text-sm mt-1">
                  {isTV && item.season && item.episode
                    ? `Season ${item.season} • Episode ${item.episode}`
                    : "Continue watching"}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ContinueWatching

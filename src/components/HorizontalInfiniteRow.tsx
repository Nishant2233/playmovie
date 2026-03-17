import { useEffect, useMemo, useRef, useState } from "react"
import MovieCard from "./MovieCard"
import TvShowCard from "./TvShowCard"

type Kind = "movie" | "tv" | "mixed"

type Props = {
  title: string
  kind: Kind
  fetchPage: (page: number) => Promise<any[]>
  initialItems?: any[]
  initialPage?: number
  className?: string
}

const renderCard = (kind: Kind, it: any) => {
  if (kind === "tv") return <TvShowCard tvShowResult={it} />
  if (kind === "mixed") return it.media_type === "tv" ? <TvShowCard tvShowResult={it} /> : <MovieCard movieResult={it} />
  return <MovieCard movieResult={it} />
}

export default function HorizontalInfiniteRow({
  title,
  kind,
  fetchPage,
  initialItems,
  initialPage = 1,
  className
}: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [items, setItems] = useState<any[]>(initialItems || [])
  const [page, setPage] = useState(initialPage)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    let cancelled = false
    if ((initialItems?.length || 0) > 0) return
    setLoading(true)
    fetchPage(initialPage)
      .then((next) => {
        if (cancelled) return
        setItems(next || [])
        setHasMore((next || []).length > 0)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadMore = async () => {
    if (loading || !hasMore) return
    setLoading(true)
    const nextPage = page + 1
    try {
      const next = await fetchPage(nextPage)
      if (!next || next.length === 0) {
        setHasMore(false)
      } else {
        setItems((prev) => [...prev, ...next])
        setPage(nextPage)
      }
    } finally {
      setLoading(false)
    }
  }

  const onScroll = () => {
    const el = scrollerRef.current
    if (!el || loading || !hasMore) return
    const nearEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 240
    if (nearEnd) void loadMore()
  }

  const cardWidth = useMemo(() => "w-[120px] sm:w-[140px] md:w-[170px] lg:w-[190px]", [])

  if (!items?.length && !loading) return null

  return (
    <div className={`px-2 md:px-10 mb-10 w-full max-w-full ${className || ""}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1 h-6 bg-purple-600" />
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
      </div>

      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="flex gap-2 md:gap-4 overflow-x-auto pb-2 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
      >
        {items.map((it) => (
          <div key={`${kind}-${it.media_type || kind}-${it.id}`} className={`flex-shrink-0 ${cardWidth}`}>
            {renderCard(kind, it)}
          </div>
        ))}

        {loading && (
          <div className={`flex-shrink-0 ${cardWidth}`}>
            <div className="w-full aspect-[2/3] rounded-md bg-white/5 border border-white/10" />
          </div>
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}


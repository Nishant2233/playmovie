import { useRef } from "react"
import MovieCard from "./MovieCard"

const ContentRow = ({ title, items }: { title: string; items?: any[] }) => {
  const scroller = useRef<HTMLDivElement>(null)
  const scrollBy = (d: number) => scroller.current?.scrollBy({ left: d*400, behavior: 'smooth' })
  return (
    <div className="px-5 md:px-10 mb-8">
      <div className="flex items-end justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-1 h-6 bg-[var(--accent)]" />
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        </div>
        <div className="hidden md:flex gap-2">
          <button onClick={()=>scrollBy(-1)} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10">‹</button>
          <button onClick={()=>scrollBy(1)} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10">›</button>
        </div>
      </div>
      <div ref={scroller} className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {items?.map(m => (
          <div key={m.id} className="min-w-[150px] max-w-[150px] md:min-w-[180px] md:max-w-[180px]">
            <MovieCard movieResult={m as any} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ContentRow



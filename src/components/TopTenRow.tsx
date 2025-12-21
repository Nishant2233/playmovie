import MovieCard from "./MovieCard"

const TopTenRow = ({ items }: { items?: any[] }) => {
  return (
    <div id="top10" className="px-5 md:px-10 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1 h-6 bg-purple-600" />
        <h2 className="text-2xl md:text-3xl font-bold">Top 10</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {items?.slice(0,10).map((m, idx) => (
          <div key={m.id} className="relative min-w-[150px] max-w-[150px] md:min-w-[180px] md:max-w-[180px]">
            <div className="absolute -left-3 top-10 text-7xl md:text-8xl font-extrabold text-transparent" style={{ WebkitTextStroke: '2px var(--accent)' }}>{idx+1}</div>
            <MovieCard movieResult={m as any} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopTenRow



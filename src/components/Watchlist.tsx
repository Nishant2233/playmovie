import { useWatchlist } from "../contex/watchlist.context"
import MovieCard from "./MovieCard"

const Watchlist = () => {
  const { items, remove } = useWatchlist()
  return (
    <div className="px-5 md:px-10 mb-10">
      <div className="relative -mx-5 md:-mx-10 px-5 md:px-10 pt-8 pb-6 mb-6 overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0f1d]/80 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(147,51,234,0.12)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_transparent_0%,_rgba(0,0,0,0.3)_100%)]" />
        <h2 className="relative text-2xl md:text-3xl font-bold">My List</h2>
      </div>
      {items.length === 0 ? (
        <div className="text-neutral-400">Your watchlist is empty.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map(item => (
            <div key={item.id} className="relative group">
              <MovieCard movieResult={item as any} />
              <button onClick={()=> remove(item.id)} className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-black/60 hover:bg-black/80">Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Watchlist



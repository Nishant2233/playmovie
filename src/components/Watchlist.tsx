import { useWatchlist } from "../contex/watchlist.context"
import MovieCard from "./MovieCard"

const Watchlist = () => {
  const { items, remove } = useWatchlist()
  return (
    <div className="px-5 md:px-10 mb-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">My List</h2>
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



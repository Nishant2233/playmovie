
import { Card, CardContent } from './ui/card'
import { useNavigate } from 'react-router-dom'
import { useWatchlist } from '../contex/watchlist.context'


const TvShowCard = ({tvShowResult}: { tvShowResult: any }) => {
  const navigate = useNavigate()
  const { add, remove, has } = useWatchlist()
  return (
    <Card className="border-0 bg-transparent">
      <CardContent className="px-0">
        <div className="relative group">
          <img
            src={`https://image.tmdb.org/t/p/w500${tvShowResult.poster_path}`}
            alt={tvShowResult.title || tvShowResult.name || "poster"}
            loading="lazy"
            className="w-full aspect-[2/3] object-cover rounded-md cursor-pointer transition-transform duration-300 group-hover:scale-[1.02]"
            onClick={() => navigate(`/details/tv/${tvShowResult.id}`)}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-md" />
          <div className="absolute top-2 left-2 text-[10px] font-bold bg-white/90 text-black px-2 py-0.5 rounded">HD</div>
          <div className="absolute inset-x-2 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="rounded-lg bg-black/70 border border-white/15 backdrop-blur p-3">
              <div className="text-sm font-semibold text-white mb-2 line-clamp-1">{tvShowResult.title ? tvShowResult.title : tvShowResult.name}</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e)=>{ e.stopPropagation(); navigate(`/tv/${tvShowResult.id}`) }}
                  className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center"
                  aria-label="Play"
                >▶</button>
                <button
                  onClick={(e)=>{ e.stopPropagation(); has(tvShowResult.id) ? remove(tvShowResult.id) : add(tvShowResult as any) }}
                  className={`px-3 py-1.5 text-xs rounded-full font-semibold ${has(tvShowResult.id)? 'bg-green-600 text-white' : 'bg-purple-600/90 hover:bg-purple-600 text-white'}`}
                >{has(tvShowResult.id) ? 'Added' : 'Add'}</button>
                <button
                  onClick={(e)=>{ e.stopPropagation(); navigate(`/details/tv/${tvShowResult.id}`) }}
                  className="px-3 py-1.5 text-xs rounded-full bg-white/10 text-white border border-white/20"
                >More</button>
              </div>
            </div>
          </div>
          <h1 className="mt-3 text-white">{tvShowResult.title ? tvShowResult.title : tvShowResult.name}</h1>
        </div>
      </CardContent>
    </Card>
  )
}

export default TvShowCard
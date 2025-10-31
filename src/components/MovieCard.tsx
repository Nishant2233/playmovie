import { Card, CardContent } from "./ui/card"
import type { MovieResult } from "../hooks/UseMovies"
import { useNavigate } from "react-router-dom"
import { useWatchlist } from "../contex/watchlist.context"
import { useDetails } from "../contex/details.context"

interface Props{
    movieResult: MovieResult
}


const MovieCard = ({ movieResult }: Props) => {
    const navigate = useNavigate()
    const { add, remove, has } = useWatchlist()
    const { open } = useDetails()
    return (
        <Card className="border-0 bg-transparent">
            <CardContent className="px-0">
                <div className="relative group">
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movieResult.poster_path}`}
                        alt={movieResult.title || movieResult.name || "poster"}
                        loading="lazy"
                        className="w-full aspect-[2/3] object-cover rounded-md cursor-pointer transition-transform duration-300 group-hover:scale-[1.02]"
                        onClick={()=>{ open(movieResult.id, 'movie') }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-md" />
                    <div className="absolute top-2 left-2 text-[10px] font-bold bg-white/90 text-black px-2 py-0.5 rounded">HD</div>
                    <div className="absolute inset-x-2 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="rounded-lg bg-black/70 border border-white/15 backdrop-blur p-3">
                        <div className="text-sm font-semibold text-white mb-2 line-clamp-1">{movieResult.title ? movieResult.title : movieResult.name}</div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e)=>{ e.stopPropagation(); navigate(`/player/${movieResult.id}`) }}
                            className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center"
                            aria-label="Play"
                          >▶</button>
                          <button
                            onClick={(e)=>{ e.stopPropagation(); has(movieResult.id) ? remove(movieResult.id) : add(movieResult as any) }}
                            className={`px-3 py-1.5 text-xs rounded-full font-semibold ${has(movieResult.id)? 'bg-green-600 text-white' : 'bg-purple-600/90 hover:bg-purple-600 text-white'}`}
                          >{has(movieResult.id) ? 'Added' : 'Add'}</button>
                          <button
                            onClick={(e)=>{ e.stopPropagation(); open(movieResult.id, 'movie') }}
                            className="px-3 py-1.5 text-xs rounded-full bg-white/10 text-white border border-white/20"
                          >More</button>
                        </div>
                      </div>
                    </div>
                    <h1 className="mt-3 text-white">{movieResult.title ? movieResult.title : movieResult.name}</h1>
                </div>
            </CardContent>
        </Card>
    )
}
export default MovieCard
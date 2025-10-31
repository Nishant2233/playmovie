import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import apiClient from "../services/api-client"
import { useWatchlist } from "../contex/watchlist.context"
import GridSection from "../components/GridSection"

type Movie = any
type Credits = { cast?: Array<{ id: number; name: string; character?: string; profile_path?: string }>; crew?: any[] }

const DetailsPage = () => {
  const { id = "", type = "movie" } = useParams()
  const navigate = useNavigate()
  const { add, has, remove } = useWatchlist()

  const [item, setItem] = useState<Movie | null>(null)
  const [credits, setCredits] = useState<Credits>({})
  const [related, setRelated] = useState<any[]>([])

  useEffect(() => {
    if (!id) return
    setItem(null)
    apiClient.get(`/${type}/${id}`).then(r => setItem(r.data)).catch(()=>{})
    apiClient.get(`/${type}/${id}/credits`).then(r => setCredits(r.data)).catch(()=>{})
    apiClient.get(`/${type}/${id}/similar`).then(r => setRelated(r.data.results || [])).catch(()=>{})
    window.scrollTo({ top: 0 })
  }, [id, type])

  const poster = useMemo(() => item?.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : undefined, [item])
  const backdrop = useMemo(() => item?.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : undefined, [item])
  const title = item?.title || item?.name || ''
  const year = (item?.release_date || item?.first_air_date || '').slice(0,4)
  const rating = item?.vote_average ? item.vote_average.toFixed(1) : undefined
  const genres = (item?.genres || []).map((g: any) => g.name).join(', ')
  const runtime = item?.runtime || (Array.isArray(item?.episode_run_time) ? item.episode_run_time[0] : undefined)
  const country = (item?.production_countries || [])[0]?.name
  const actors = (credits?.cast || []).slice(0,6).map(c => c.name).join(', ')
  const director = credits?.crew?.find?.((p: any) => p.job === 'Director')?.name

  return (
    <div className="text-white">
      <div className="relative w-full aspect-[16/7] lg:aspect-[16/6]">
        {backdrop && <img src={backdrop} alt={title} className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center"
          aria-label="Back"
        >
          ←
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-5 md:px-10 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 -mt-28 md:-mt-32 relative">
          {poster && <img src={poster} alt={title} className="w-full rounded-xl shadow-xl" />}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {rating && <span className="px-3 py-1 rounded-full bg-[#e50914]">IMDb {rating}</span>}
              {year && <span className="px-2 py-1 rounded-full bg-black/50 border border-white/20">{year}</span>}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-3">{title}</h1>
            {item?.overview && <p className="text-neutral-200 max-w-3xl mb-6">{item.overview}</p>}
            <div className="flex gap-4 flex-wrap mb-8 items-center">
              <button onClick={() => navigate(type === 'movie' ? `/player/${id}` : `/tv/${id}`)} className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-neutral-200">▶ Play</button>
              {item && (
                <button onClick={() => (has(item.id) ? remove(item.id) : add({ id: item.id, title: item.title, name: item.name, poster_path: item.poster_path }))} className={`px-6 py-3 rounded-full border font-semibold ${item && has(item.id) ? 'bg-green-600 text-white border-green-600' : 'bg-purple-600/90 hover:bg-purple-600 text-white border-purple-600'}`}>
                  {item && has(item.id) ? 'Added' : 'Add to Watchlist'}
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div className="space-y-2">
                {genres && (<div><span className="opacity-70">Genre:</span> <span className="font-semibold">{genres}</span></div>)}
                {actors && (<div><span className="opacity-70">Actors:</span> <span className="font-semibold">{actors}</span></div>)}
                {director && (<div><span className="opacity-70">Director:</span> <span className="font-semibold">{director}</span></div>)}
                {country && (<div><span className="opacity-70">Country:</span> <span className="font-semibold">{country}</span></div>)}
              </div>
              <div className="space-y-2">
                <div><span className="opacity-70">Quality:</span> <span className="font-semibold">HD</span></div>
                {runtime && (<div><span className="opacity-70">Runtime:</span> <span className="font-semibold">{runtime} min</span></div>)}
                {year && (<div><span className="opacity-70">Release:</span> <span className="font-semibold">{year}</span></div>)}
                {rating && (<div><span className="opacity-70">IMDb:</span> <span className="font-semibold">{rating}/10</span></div>)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related section */}
      <GridSection title="You May Like" items={related} kind={type === 'tv' ? 'tv' : 'movie'} />
    </div>
  )
}

export default DetailsPage



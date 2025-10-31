import { useEffect, useState } from "react"
import apiClient from "../services/api-client"
import { useDetails } from "../contex/details.context"
import { useWatchlist } from "../contex/watchlist.context"

type Media = { id: number; title?: string; name?: string; backdrop_path?: string; poster_path?: string; vote_average?: number; overview?: string; release_date?: string; first_air_date?: string }

const HeroCarousel = () => {
  const [slides, setSlides] = useState<Media[]>([])
  const [index, setIndex] = useState(0)
  const { open } = useDetails()
  const { add, has } = useWatchlist()

  useEffect(() => {
    apiClient.get('/movie/now_playing', { params: { page: 1 } }).then(r => setSlides(r.data.results?.slice(0,5) || [])).catch(()=>{})
  }, [])

  useEffect(() => {
    if (slides.length === 0) return
    const id = setInterval(() => setIndex(i => (i + 1) % slides.length), 5000)
    return () => clearInterval(id)
  }, [slides.length])

  if (slides.length === 0) return null
  const current = slides[index]
  const title = current.title || current.name || ''
  const year = (current.release_date || current.first_air_date || '').slice(0,4)
  const rating = current.vote_average ? current.vote_average.toFixed(1) : undefined

  return (
    <div className="relative w-full overflow-hidden -mt-20">
      {/* Backdrop slideshow */}
      <div className="relative aspect-[16/7] lg:aspect-[16/6]">
        {slides.map((s, i) => (
          <img key={s.id} src={`https://image.tmdb.org/t/p/original${s.backdrop_path}`} alt={title} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i===index?'opacity-100':'opacity-0'}`} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
        {/* Center play button */}
        <button
          onClick={()=> open(current.id, 'movie')}
          className="absolute inset-0 m-auto w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur flex items-center justify-center text-white text-2xl"
          aria-label="Open details"
        >
          ▶
        </button>
        {/* Slide arrows */}
        <button onClick={()=> setIndex((index-1+slides.length)%slides.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60">‹</button>
        <button onClick={()=> setIndex((index+1)%slides.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60">›</button>
        <div className="absolute right-6 bottom-4 text-sm opacity-80 text-white">{index+1}/{slides.length}</div>
      </div>

      {/* Info section below */}
      <div className="px-5 md:px-10 py-6 text-white">
        <div className="flex gap-6 items-start justify-between">
          {current.poster_path && (
            <img src={`https://image.tmdb.org/t/p/w300${current.poster_path}`} alt={title} className="w-28 md:w-40 rounded-lg shadow-lg" />
          )}
          <div className="flex-1">
            <div className="text-sm opacity-80 mb-1">Movie • {year}</div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-3">{title}</h1>
            <div className="flex gap-3 items-center mb-4 text-sm">
              {rating && <span className="px-3 py-1 rounded-full bg-[#e50914]">IMDb {rating}</span>}
            </div>
            <p className="text-neutral-300 max-w-3xl line-clamp-3 md:line-clamp-none">{current.overview}</p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={()=> add({ id: current.id, title, poster_path: current.poster_path || "", backdrop_path: current.backdrop_path })}
              disabled={has(current.id)}
              className={`px-6 h-11 rounded-full font-semibold ${has(current.id) ? 'bg-purple-600/60 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
            >
              {has(current.id) ? 'Added to Watchlist' : 'Add to Watchlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroCarousel



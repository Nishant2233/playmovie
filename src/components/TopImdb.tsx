import { useEffect, useState } from "react"
import apiClient from "../services/api-client"
import MovieCard from "./MovieCard"
import TvShowCard from "./TvShowCard"
import Pagination from "./Pagination"

const TopImdb = () => {
  const [movies, setMovies] = useState<any[]>()
  const [tv, setTv] = useState<any[]>()
  const [pageMovie, setPageMovie] = useState(1)
  const [pageTv, setPageTv] = useState(1)
  const [totalMoviePages, setTotalMoviePages] = useState(1)
  const [totalTvPages, setTotalTvPages] = useState(1)
  const [filter, setFilter] = useState<'all' | 'movie' | 'tv'>('all')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pageMovie, pageTv, filter]);

  useEffect(() => {
    apiClient.get('/movie/top_rated', { params: { page: pageMovie } }).then(r=> { setMovies(r.data.results); setTotalMoviePages(r.data.total_pages || 1) }).catch(()=>{})
  }, [pageMovie])
  useEffect(() => {
    apiClient.get('/tv/top_rated', { params: { page: pageTv } }).then(r=> { setTv(r.data.results); setTotalTvPages(r.data.total_pages || 1) }).catch(()=>{})
  }, [pageTv])

  // Reset to first page when changing filter
  useEffect(() => {
    setPageMovie(1)
    setPageTv(1)
  }, [filter])

  return (
    <div className="px-5 md:px-10 mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl md:text-3xl font-bold">Top IMDb</h2>
        <div className="flex items-center gap-2 text-sm">
          <button onClick={()=> setFilter('all')} className={`px-3 py-1.5 rounded-full ${filter==='all'?'bg-white/10 border border-white/20':'bg-white/5'}`}>All</button>
          <button onClick={()=> setFilter('movie')} className={`px-3 py-1.5 rounded-full ${filter==='movie'?'bg-white/10 border border-white/20':'bg-white/5'}`}>Movies</button>
          <button onClick={()=> setFilter('tv')} className={`px-3 py-1.5 rounded-full ${filter==='tv'?'bg-white/10 border border-white/20':'bg-white/5'}`}>TV Shows</button>
        </div>
      </div>

      {(filter==='all' || filter==='movie') && (
        <>
          {filter==='all' && <h3 className="text-xl font-semibold mb-3">Movies</h3>}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
            {movies?.map(m => (
              <MovieCard key={m.id} movieResult={m} />
            ))}
          </div>
          <div className="mb-8"><Pagination total={Math.min(500, totalMoviePages)} page={pageMovie} onChange={(p:number)=> setPageMovie(p)} /></div>
        </>
      )}

      {(filter==='all' || filter==='tv') && (
        <>
          {filter==='all' && <h3 className="text-xl font-semibold mb-3">TV Shows</h3>}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
            {tv?.map(t => (
              <TvShowCard key={t.id} tvShowResult={t} />
            ))}
          </div>
          <Pagination total={Math.min(500, totalTvPages)} page={pageTv} onChange={(p:number)=> setPageTv(p)} />
        </>
      )}
    </div>
  )
}

export default TopImdb




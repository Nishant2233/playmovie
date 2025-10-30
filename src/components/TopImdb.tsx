import { useEffect, useState } from "react"
import apiClient from "../services/api-client"
import MovieCard from "./MovieCard"
import TvShowCard from "./TvShowCard"

const TopImdb = () => {
  const [movies, setMovies] = useState<any[]>()
  const [tv, setTv] = useState<any[]>()

  useEffect(() => {
    apiClient.get('/movie/top_rated').then(r=> setMovies(r.data.results)).catch(()=>{})
    apiClient.get('/tv/top_rated').then(r=> setTv(r.data.results)).catch(()=>{})
  }, [])

  return (
    <div className="px-5 md:px-10 mb-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Top IMDb Movies</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
        {movies?.map(m => (
          <MovieCard key={m.id} movieResult={m} />
        ))}
      </div>
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Top IMDb TV</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {tv?.map(t => (
          <TvShowCard key={t.id} tvShowResult={t} />
        ))}
      </div>
    </div>
  )
}

export default TopImdb




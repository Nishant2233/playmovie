import { useContext, useEffect } from "react"
import useMovieList from "../hooks/UseMovies"
import MovieCard from "./MovieCard"
import { GenresContext } from "../contex/genres.contex"
import { useSearchParams } from "react-router-dom"
import Pagination from "./Pagination"
import Genres from "./Genres"
const MovieList = () => {
  const{ genres }= useContext(GenresContext)
  const [params] = useSearchParams()
  const page = Number(params.get('page') || 1)
  const { movieLists, totalPages } = useMovieList(genres, page)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div className="px-5 md:px-10 mb-10">
      <div className="relative -mx-5 md:-mx-10 px-5 md:px-10 pt-8 pb-8 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0f1d]/80 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(147,51,234,0.12)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_transparent_0%,_rgba(0,0,0,0.3)_100%)]" />
        <div className="relative flex items-center justify-between">
          <h1 className="text-4xl font-semibold">Movies</h1>
          <div className="hidden md:block"><Genres /></div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movieLists?.map((movieList: any) => (
          <div key={movieList.id}>
            <MovieCard movieResult={movieList} />
          </div>
        ))}
      </div>
      <Pagination total={Math.min(500, totalPages || 1)} />
    </div>
  )
}

export default MovieList
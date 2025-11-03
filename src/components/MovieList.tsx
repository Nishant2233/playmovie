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
      <div className="flex items-center justify-between py-8">
        <h1 className="text-4xl font-semibold">Movies</h1>
        <div className="hidden md:block"><Genres /></div>
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
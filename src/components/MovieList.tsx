import { useContext } from "react"
import useMovieList from "../hooks/UseMovies"
import MovieCard from "./MovieCard"
import { GenresContext } from "../contex/genres.contex"
import { useSearchParams } from "react-router-dom"
import Pagination from "./Pagination"


const MovieList = () => {
  const{ genres }= useContext(GenresContext)
  const [params] = useSearchParams()
  const page = Number(params.get('page') || 1)
  const { movieLists } = useMovieList(genres, page)
  console.log(movieLists)

  return (
    <div className="p-3 mb-4">
      <h1 className="text-4xl font-semibold p-5 py-8">Movies</h1> 
    <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 gap-4">
      {movieLists?.map((movieList: any) => (
        <div key={movieList.id}>
          <MovieCard movieResult={movieList} />
        </div>
      ))}
    </div>
    <Pagination total={5} />
    </div>
  )

}

export default MovieList
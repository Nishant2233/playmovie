import { useContext } from "react"
import useMovieList from "../hooks/UseMovies"
import MovieCard from "./MovieCard"
import { GenresContext } from "../contex/genres.contex"


const MovieList = () => {
  const{ genres }= useContext(GenresContext)
  const { movieLists } = useMovieList(genres)
  console.log(movieLists)

  return (
    <div className="p-3 mb-4">
      <h1 className="text-4xl font-semibold p-5 py-8">Movie</h1> 
    <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 gap-y-3">
      {movieLists?.map((movieList: any) => (
        <div key={movieList.id}>
          <MovieCard movieResult={movieList} />
        </div>
      ))}
    </div>
    </div>
  )

}

export default MovieList
import { useEffect, useState } from "react";
import apiClient from "../services/api-client"

export interface MovieResult{
 adult: boolean;
    id: number;
    original_title: string;
    original_language: string;
    title: string;
    backdrop_path: string;
    overview: string;
    poster_path: string;
    name?: string;
    
}

const useMovieList = (genres? :number | null, page: number = 1 ) => {

    const [movieLists, setMovieLists] = useState<MovieResult[]>();
    const fetchMovieList = async () => {
      try{
       const res = await apiClient.get("/discover/movie",{
        params: {
          with_genres: genres,
          page,
        }
       })
       setMovieLists(res.data.results)
       
      }
      catch(error){} // Fetch movie list logic here
    }
    useEffect(() => {
      fetchMovieList();
    }, [genres, page]);

    return {movieLists};
}
export default useMovieList;
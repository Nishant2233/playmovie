import React, { use, useContext } from 'react'
import { SearchResultContext } from '../contex/searchResult.Context'
import useMultiSearch from '../hooks/useMultiSearch'
import MovieCard from './MovieCard'
import TvShowCard from './TvShowCard'

const SearchList = () => {
  const {searchData, searchText} = useContext(SearchResultContext)
  useMultiSearch(searchText)


  return (
    <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 gap-y-3">
     {searchData?.map((data)=>{
         return(
        <div key={data.id}>
        {data.media_type==="movie"?(
            <MovieCard movieResult={data} />
        ):(<TvShowCard tvShowResult={data} />)}
        </div>
    
    )
     })}

   </div>
  )
}

export default SearchList
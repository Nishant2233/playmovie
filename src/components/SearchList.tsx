import { useContext } from 'react'
import { SearchResultContext } from '../contex/searchResult.context'
import useMultiSearch from '../hooks/useMultiSearch'
import MovieCard from './MovieCard'
import TvShowCard from './TvShowCard'

const SearchList = () => {
  const {searchData, searchText} = useContext(SearchResultContext)
  useMultiSearch(searchText)


  return (
    <div className="px-0 md:px-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4 mb-10">
     {searchData?.map((data: any)=>{
         return(
        <div key={data.id} className="px-2 md:px-0 box-border">
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
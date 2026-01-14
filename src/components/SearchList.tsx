import { useContext } from 'react'
import { SearchResultContext } from '../contex/searchResult.context'
import useMultiSearch from '../hooks/useMultiSearch'
import MovieCard from './MovieCard'
import TvShowCard from './TvShowCard'

const SearchList = () => {
  const {searchData, searchText} = useContext(SearchResultContext)
  useMultiSearch(searchText)


  return (
    <div className="px-2 md:px-10 mb-10 w-full max-w-full overflow-x-hidden">
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 md:gap-4">
     {searchData?.map((data: any)=>{
         return(
        <div key={data.id} className="w-full">
        {data.media_type==="movie"?(
            <MovieCard movieResult={data} />
        ):(<TvShowCard tvShowResult={data} />)}
        </div>
    
    )
     })}
      </div>

   </div>
  )
}

export default SearchList
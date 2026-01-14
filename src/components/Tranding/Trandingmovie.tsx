 
import useTrandingList from '../../hooks/useTrandingList'
import MovieCard from '../MovieCard';

const Trandingmovie = () => {
  
    const { trandingData}=useTrandingList("movie"); 
    return (
        <div className='px-2 md:p-3 mb-4 w-full max-w-full overflow-x-hidden'>
    <div>
        <h1 className="text-4xl font-semibold p-5 py-8">trandingMovie</h1>
         </div>
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 md:gap-4 gap-y-3">
          {(trandingData ?? []).map((movie: any)=> (
            <div key = {movie.id} className="w-full">
                <MovieCard movieResult={movie}/>
            </div>
          ))}

             </div>
    </div>
    
  
  )
}

export default Trandingmovie
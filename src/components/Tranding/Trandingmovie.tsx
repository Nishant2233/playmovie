 
import useTrandingList from '../../hooks/useTrandingList'
import MovieCard from '../MovieCard';

const Trandingmovie = () => {
  
    const { trandingData}=useTrandingList("movie"); 
    return (
        <div className='p-3 mb-4'>
    <div>
        <h1 className="text-4xl font-semibold p-5 py-8">trandingMovie</h1>
         </div>
            <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 gap-y-3">
          {(trandingData ?? []).map((movie: any)=> (
            <div key = {movie.id}>
                <MovieCard movieResult={movie}/>
            </div>
          ))}

             </div>
    </div>
    
  
  )
}

export default Trandingmovie
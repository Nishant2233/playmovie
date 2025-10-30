import useTvShowList from "../hooks/useTvShowList"
import TvShowCard from "./TvShowCard";
import { useSearchParams } from "react-router-dom";
import Pagination from "./Pagination";




const TvShowList = () => {
const [params] = useSearchParams();
const page = Number(params.get('page') || 1);
const { tvShows } = useTvShowList(page);
console.log(tvShows);
  return <div className="p-3 mb-4">
      <h1 className="text-4xl font-semibold p-5 py-8">TV Shows</h1>
       <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 gap-y-3">
        {tvShows?.map((tvShow) => (
          <div key={tvShow.id}>
            <TvShowCard tvShowResult={tvShow} />
          </div>  
        ))}
       </div>
       <Pagination total={5} />
  </div>
}

export default TvShowList
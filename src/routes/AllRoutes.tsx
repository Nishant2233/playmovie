import { Routes, Route } from "react-router-dom";
import MOvieList from "../components/MovieList";
import TvShowList from "../components/TvShowList";
import SearchList from "../components/SearchList";
import Tranding from "../components/Tranding/Tranding";
import Player from "../components/Player";
import TvPlayer from "../components/TvPlayer";
import Watchlist from "../components/Watchlist";
import TopImdb from "../components/TopImdb";

const AllRoutes = () => {
  return(
 <Routes>
  <Route path="/" element={<Tranding/>}/>
  <Route path ="/movies" element = {<MOvieList/>}/>
  <Route path ="/tvshows" element ={<TvShowList/>}/>
  <Route path ="/search/:searchName/" element={<SearchList/>}/>
  <Route path ="/player/:playerId" element={<Player/>}/>
  <Route path ="/tv/:tvId" element={<TvPlayer/>}/>
  <Route path ="/watchlist" element={<Watchlist/>}/>
  <Route path ="/top-imdb" element={<TopImdb/>}/>
 </Routes>
  );
}

export default AllRoutes
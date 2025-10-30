import { Routes, Route } from "react-router";
import MOvieList from "../components/MovieList";
import TvShowList from "../components/TvShowList";
import SearchList from "../components/SearchList";
import Tranding from "../components/Tranding/Tranding";
import Player from "../components/Player";

const AllRoutes = () => {
  return(
 <Routes>
<Route path="/" element={<Tranding/>}/>
<Route path ="/movies" element = {<MOvieList/>}/>
<Route path ="/tvshows" element ={<TvShowList/>}/>
<Route path ="/search/:searchName/"element={<SearchList/>}/>
<Route path ="/player/:playerId"element={<Player/>}/>

 </Routes>
  );
}

export default AllRoutes
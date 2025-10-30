import apiClient from "../services/api-client"
import { useEffect, useState } from "react";

const useTvShowList = () => {
const [tvShows, setTvShows] = useState();

    const fetchTvShowList  = async () => {
        try{
         const res = await apiClient.get("/discover/tv")
            setTvShows(res.data.results);
        
    }
    catch(error){}
    }



useEffect(() => {
    fetchTvShowList();
}, []);
return {tvShows};
}

export default useTvShowList
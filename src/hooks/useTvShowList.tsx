import apiClient from "../services/api-client"
import { useEffect, useState } from "react";

const useTvShowList = (page: number = 1) => {
const [tvShows, setTvShows] = useState();

    const fetchTvShowList  = async () => {
        try{
         const res = await apiClient.get("/discover/tv", { params: { page } })
            setTvShows(res.data.results);
        
    }
    catch(error){}
    }



useEffect(() => {
    fetchTvShowList();
}, [page]);
return {tvShows};
}

export default useTvShowList
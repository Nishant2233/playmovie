import apiClient from "../services/api-client"
import { useEffect, useState } from "react";

const useTvShowList = (page: number = 1, genres?: number | null) => {
const [tvShows, setTvShows] = useState<any[]>();
const [totalPages, setTotalPages] = useState<number>(1);

    const fetchTvShowList  = async () => {
        try{
         const res = await apiClient.get("/discover/tv", { params: { page, with_genres: genres } })
            setTvShows(res.data.results);
            setTotalPages(res.data.total_pages || 1);
        
    }
    catch(error){}
    }



useEffect(() => {
    fetchTvShowList();
}, [page, genres]);
return {tvShows, totalPages};
}

export default useTvShowList
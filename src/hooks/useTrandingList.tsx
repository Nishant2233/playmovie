import { useEffect, useState } from "react"
import apiClient from "../services/api-client"


const useTrandingList = (tranding: string="movie") => {
  const[trandingData ,setTrandingData]=useState();
    const fetchTrandingList = async () => {
        try{
     const res = await apiClient.get(`/trending/${tranding}/day`)
        setTrandingData (res.data.results);
     } catch(error){
        console.log(error);
     }
    }
    useEffect(() => {
        fetchTrandingList();
    }, []);
    return {trandingData,setTrandingData};
}
export default useTrandingList;

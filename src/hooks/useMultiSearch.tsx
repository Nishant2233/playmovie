import apiClient from "../services/api-client"
import { useContext, useEffect } from "react";
import { SearchResultContext } from "../contex/searchResult.context";


const useMultiSearch = (input : string) => {
   const {setSearchData}=useContext(SearchResultContext)
  const fetchSearch = async () => {
    const res = await apiClient.get("/search/multi",{
        params:{
            query:input,
        }, })

    setSearchData (res.data.results);
  }
  useEffect(() => {
    fetchSearch();
  }, [input]);
}
export default useMultiSearch


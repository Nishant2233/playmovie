import {createContext,useState} from "react"

export const SearchResultContext=createContext({})
export const SearchResultProvider=({ children }: {children:React.ReactNode})=>{
    const [searchText,setSearchText]=useState("")
    const [searchData,setSearchData]=useState();

    const value ={
        searchText,searchData,setSearchData,setSearchText}
    return(
    <SearchResultContext.Provider value={value}>
        {children}
    </SearchResultContext.Provider>
    )
    
    }
import { createContext, useState } from "react"

type SearchResultItem = any
type SearchResultContextValue = {
  searchText: string
  setSearchText: (v: string) => void
  searchData: SearchResultItem[] | undefined
  setSearchData: (v: SearchResultItem[] | undefined) => void
}

export const SearchResultContext = createContext<SearchResultContextValue>({
  searchText: "",
  setSearchText: () => {},
  searchData: undefined,
  setSearchData: () => {},
})

export const SearchResultProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchText, setSearchText] = useState("")
  const [searchData, setSearchData] = useState<SearchResultItem[] | undefined>(undefined)

  const value: SearchResultContextValue = {
    searchText,
    searchData,
    setSearchData,
    setSearchText,
  }
  return (
    <SearchResultContext.Provider value={value}>
      {children}
    </SearchResultContext.Provider>
  )
}

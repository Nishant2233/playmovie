import { createContext, useContext, useState } from "react"

type FilterContextValue = {
  genre: number | null
  setGenre: (v: number | null) => void
  type: 'movie' | 'tv' | 'all'
  setType: (v: 'movie' | 'tv' | 'all') => void
  quality: string | null
  setQuality: (v: string | null) => void
  year: string | null
  setYear: (v: string | null) => void
  sortBy: string
  setSortBy: (v: string) => void
  resetFilters: () => void
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined)

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [genre, setGenre] = useState<number | null>(null)
  const [type, setType] = useState<'movie' | 'tv' | 'all'>('all')
  const [quality, setQuality] = useState<string | null>(null)
  const [year, setYear] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>('popularity.desc')

  const resetFilters = () => {
    setGenre(null)
    setType('all')
    setQuality(null)
    setYear(null)
    setSortBy('popularity.desc')
  }

  return (
    <FilterContext.Provider value={{
      genre,
      setGenre,
      type,
      setType,
      quality,
      setQuality,
      year,
      setYear,
      sortBy,
      setSortBy,
      resetFilters
    }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters() {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error("useFilters must be used within FilterProvider")
  return ctx
}


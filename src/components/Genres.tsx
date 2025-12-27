import { DropdownMenuRadioGroup } from "@radix-ui/react-dropdown-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { useContext, useState, useEffect, useRef } from "react"
import { GenresContext } from "../contex/genres.contex"
import { useNavigate } from "react-router"
import { useFilters } from "../contex/filters.context"
import { ChevronDown, X } from "lucide-react"

const genreList = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" }
]

const sortOptions = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'popularity.asc', label: 'Least Popular' },
  { value: 'release_date.desc', label: 'Newest First' },
  { value: 'release_date.asc', label: 'Oldest First' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'vote_average.asc', label: 'Lowest Rated' }
]

const Genres = () => {
  const { genres, setGenres } = useContext(GenresContext)
  const { type, setType, sortBy, setSortBy, year, setYear, setGenre: setFilterGenre, resetFilters } = useFilters()
  const navigate = useNavigate()
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null)
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [showYearDropdown, setShowYearDropdown] = useState(false)
  const typeRef = useRef<HTMLDivElement>(null)
  const sortRef = useRef<HTMLDivElement>(null)
  const yearRef = useRef<HTMLDivElement>(null)

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typeRef.current && !typeRef.current.contains(event.target as Node)) {
        setShowTypeDropdown(false)
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false)
      }
      if (yearRef.current && !yearRef.current.contains(event.target as Node)) {
        setShowYearDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const typeLabel = type === 'all' ? 'All Types' : type === 'movie' ? 'Movies' : 'TV Shows'
  const sortLabel = sortOptions.find(s => s.value === sortBy)?.label || 'Most Popular'

  const handleGenreSelect = (genreId: number) => {
    setSelectedGenreId(genreId)
    setFilterGenre(genreId)
    setGenres(genreId)
    navigate("/filtered-results")
  }

  const handleClear = () => {
    setSelectedGenreId(null)
    setGenres(null)
    resetFilters()
  }

  const hasActiveFilters = selectedGenreId || type !== 'all' || sortBy !== 'popularity.desc' || year

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <h1 className="cursor-pointer hover:text-[var(--accent)] transition-colors">Genres</h1>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={12} className="w-[800px] max-w-[90vw] p-6 bg-[#0a0f1d] text-white border border-sky-500/60 rounded-2xl shadow-[0_12px_50px_rgba(46,130,255,0.25)]">
        <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-sky-500/30 p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(80,140,255,0.18)_0%,_transparent_55%)]" />
          
          {/* Filters Section */}
          <div className="relative mb-6">
            <div className="text-sm font-semibold text-white/90 mb-3">Filters:</div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Type Dropdown */}
              <div className="relative" ref={typeRef}>
                <button
                  onClick={() => { setShowTypeDropdown(!showTypeDropdown); setShowSortDropdown(false); setShowYearDropdown(false) }}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition-all"
                >
                  {typeLabel}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showTypeDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-40 bg-[#0a0f1d] border border-sky-500/30 rounded-lg shadow-lg z-50">
                    {[
                      { value: 'all', label: 'All Types' },
                      { value: 'movie', label: 'Movies' },
                      { value: 'tv', label: 'TV Shows' }
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setType(opt.value as any); setShowTypeDropdown(false) }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-all ${
                          type === opt.value ? 'bg-sky-500/20 text-white' : 'text-white/70'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort By Dropdown */}
              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => { setShowSortDropdown(!showSortDropdown); setShowTypeDropdown(false); setShowYearDropdown(false) }}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition-all"
                >
                  {sortLabel}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showSortDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-[#0a0f1d] border border-sky-500/30 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {sortOptions.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value); setShowSortDropdown(false) }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-all ${
                          sortBy === opt.value ? 'bg-sky-500/20 text-white' : 'text-white/70'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Year Dropdown */}
              <div className="relative" ref={yearRef}>
                <button
                  onClick={() => { setShowYearDropdown(!showYearDropdown); setShowTypeDropdown(false); setShowSortDropdown(false) }}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition-all"
                >
                  {year || 'Year'}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showYearDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-32 bg-[#0a0f1d] border border-sky-500/30 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    <button
                      onClick={() => { setYear(null); setShowYearDropdown(false) }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 text-white/70"
                    >
                      All Years
                    </button>
                    {years.map(y => (
                      <button
                        key={y}
                        onClick={() => { setYear(y.toString()); setShowYearDropdown(false) }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-all ${
                          year === y.toString() ? 'bg-sky-500/20 text-white' : 'text-white/70'
                        }`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Clear Button */}
              {hasActiveFilters && (
                <button
                  onClick={handleClear}
                  className="px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-sm font-medium flex items-center gap-2 transition-all"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Genre Grid */}
          <div className="relative">
            <div className="text-sm font-semibold text-white/90 mb-3">Filter by Genre:</div>
            <DropdownMenuRadioGroup value={(selectedGenreId ?? '').toString()} onValueChange={(val) => val && handleGenreSelect(Number(val))}>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {genreList.map((genre) => (
                  <DropdownMenuRadioItem
                    key={genre.id}
                    value={String(genre.id)}
                    className="cursor-pointer rounded-lg px-3 py-2 border border-transparent text-white/90 hover:text-white hover:border-sky-400/60 hover:bg-white/10 data-[state=checked]:border-sky-400 data-[state=checked]:bg-sky-500/15 data-[state=checked]:text-white transition-all duration-150"
                  >
                    {genre.name}
                  </DropdownMenuRadioItem>
                ))}
              </div>
            </DropdownMenuRadioGroup>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Genres
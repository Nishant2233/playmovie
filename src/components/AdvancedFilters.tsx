import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useFilters } from "../contex/filters.context"
import { X, Filter, Search } from "lucide-react"

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
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" }
]

const qualityOptions = [
  { value: 'hd', label: 'HD' },
  { value: '4k', label: '4K' },
  { value: 'theater', label: 'Theater' },
  { value: 'print', label: 'Print' },
  { value: 'new', label: 'New Releases' },
  { value: 'old', label: 'Classic' }
]

const sortOptions = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'popularity.asc', label: 'Least Popular' },
  { value: 'release_date.desc', label: 'Newest First' },
  { value: 'release_date.asc', label: 'Oldest First' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'vote_average.asc', label: 'Lowest Rated' }
]

const AdvancedFilters = () => {
  const navigate = useNavigate()
  const { genre, setGenre, type, setType, quality, setQuality, year, setYear, sortBy, setSortBy, resetFilters } = useFilters()
  const [isOpen, setIsOpen] = useState(false)

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i)

  const handleSearch = () => {
    setIsOpen(false)
    navigate('/filtered-results')
  }

  const hasActiveFilters = genre || type !== 'all' || quality || year || sortBy !== 'popularity.desc'

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative px-4 py-2 rounded-full bg-purple-600/90 hover:bg-purple-600 text-white text-sm font-semibold flex items-center gap-2"
      >
        <Filter className="w-4 h-4" />
        Filters
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0a0f1d] border border-sky-500/60 rounded-2xl shadow-[0_12px_50px_rgba(46,130,255,0.25)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Filter className="w-6 h-6" />
                Advanced Filters
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-6">
                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-semibold text-white/90 mb-3">Type</label>
                  <div className="flex gap-3">
                    {[
                      { value: 'all', label: 'All' },
                      { value: 'movie', label: 'Movies' },
                      { value: 'tv', label: 'TV Shows' }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => setType(option.value as any)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          type === option.value
                            ? 'bg-purple-600 text-white border-2 border-purple-400'
                            : 'bg-white/5 text-white/70 border-2 border-transparent hover:bg-white/10'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Genre Filter */}
                <div>
                  <label className="block text-sm font-semibold text-white/90 mb-3">Genre</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {genreList.map(g => (
                      <button
                        key={g.id}
                        onClick={() => setGenre(genre === g.id ? null : g.id)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          genre === g.id
                            ? 'bg-sky-500/20 text-white border-2 border-sky-400'
                            : 'bg-white/5 text-white/70 border-2 border-transparent hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {g.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quality Filter */}
                <div>
                  <label className="block text-sm font-semibold text-white/90 mb-3">Quality & Type</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {qualityOptions.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setQuality(quality === opt.value ? null : opt.value)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          quality === opt.value
                            ? 'bg-sky-500/20 text-white border-2 border-sky-400'
                            : 'bg-white/5 text-white/70 border-2 border-transparent hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-sm font-semibold text-white/90 mb-3">Year</label>
                  <select
                    value={year || ''}
                    onChange={(e) => setYear(e.target.value || null)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="">All Years</option>
                    {years.map(y => (
                      <option key={y} value={y.toString()}>{y}</option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-semibold text-white/90 mb-3">Sort By</label>
                  <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                    {sortOptions.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setSortBy(opt.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          sortBy === opt.value
                            ? 'bg-sky-500/20 text-white border-2 border-sky-400'
                            : 'bg-white/5 text-white/70 border-2 border-transparent hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-white/10">
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all"
              >
                Reset All
              </button>
              <button
                onClick={handleSearch}
                className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center gap-2 transition-all"
              >
                <Search className="w-4 h-4" />
                Search & Recommend
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AdvancedFilters


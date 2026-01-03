import { useEffect, useState } from "react"
import { useFilters } from "../contex/filters.context"
import apiClient from "../services/api-client"
import MovieCard from "./MovieCard"
import TvShowCard from "./TvShowCard"
import Pagination from "./Pagination"
import { useSearchParams } from "react-router-dom"

const FilteredResults = () => {
  const { genre, type, quality, year, sortBy } = useFilters()
  const [params] = useSearchParams()
  const page = Number(params.get('page') || 1)
  const [results, setResults] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [page])

  useEffect(() => {
    const fetchFilteredResults = async () => {
      setLoading(true)
      try {
        const params: any = {
          page,
          sort_by: sortBy
        }

        if (genre) params.with_genres = genre
        if (year) {
          if (type === 'movie') {
            params['primary_release_year'] = year
          } else if (type === 'tv') {
            params['first_air_date_year'] = year
          } else {
            // For 'all', we'll handle it separately
            params['primary_release_year'] = year
          }
        }

        // Quality filter simulation (TMDB doesn't have direct quality filter)
        // We can filter by vote_count or other criteria
        if (quality === 'new') {
          const twoYearsAgo = `${new Date().getFullYear() - 2}-01-01`
          if (type === 'movie') {
            params['primary_release_date.gte'] = twoYearsAgo
          } else if (type === 'tv') {
            params['first_air_date.gte'] = twoYearsAgo
          }
        } else if (quality === 'old') {
          if (type === 'movie') {
            params['primary_release_date.lte'] = '2000-12-31'
          } else if (type === 'tv') {
            params['first_air_date.lte'] = '2000-12-31'
          }
        }

        let allResults: any[] = []

        if (type === 'all') {
          // Fetch both movies and TV shows with separate params
          const movieParams = { ...params }
          const tvParams = { ...params }
          
          if (year) {
            movieParams['primary_release_year'] = year
            tvParams['first_air_date_year'] = year
            delete movieParams['first_air_date_year']
            delete tvParams['primary_release_year']
          }
          
          if (quality === 'new') {
            const twoYearsAgo = `${new Date().getFullYear() - 2}-01-01`
            movieParams['primary_release_date.gte'] = twoYearsAgo
            tvParams['first_air_date.gte'] = twoYearsAgo
          } else if (quality === 'old') {
            movieParams['primary_release_date.lte'] = '2000-12-31'
            tvParams['first_air_date.lte'] = '2000-12-31'
          }
          
          const [moviesRes, tvRes] = await Promise.all([
            apiClient.get('/discover/movie', { params: movieParams }),
            apiClient.get('/discover/tv', { params: tvParams })
          ])
          allResults = [
            ...(moviesRes.data.results || []).map((m: any) => ({ ...m, media_type: 'movie' })),
            ...(tvRes.data.results || []).map((t: any) => ({ ...t, media_type: 'tv' }))
          ]
          // Sort combined results
          allResults.sort((a, b) => {
            if (sortBy.includes('popularity')) {
              return sortBy === 'popularity.desc' ? b.popularity - a.popularity : a.popularity - b.popularity
            }
            if (sortBy.includes('vote_average')) {
              return sortBy === 'vote_average.desc' ? (b.vote_average || 0) - (a.vote_average || 0) : (a.vote_average || 0) - (b.vote_average || 0)
            }
            return 0
          })
          setTotalPages(Math.max(moviesRes.data.total_pages || 1, tvRes.data.total_pages || 1))
        } else if (type === 'movie') {
          const res = await apiClient.get('/discover/movie', { params })
          allResults = res.data.results || []
          setTotalPages(res.data.total_pages || 1)
        } else {
          const res = await apiClient.get('/discover/tv', { params })
          allResults = res.data.results || []
          setTotalPages(res.data.total_pages || 1)
        }

        setResults(allResults)
      } catch (error) {
        console.error('Error fetching filtered results:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    fetchFilteredResults()
  }, [genre, type, quality, year, sortBy, page])

  return (
    <div className="px-5 md:px-10 mb-10">
      <div className="relative -mx-5 md:-mx-10 px-5 md:px-10 pt-8 pb-8 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0f1d]/80 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(147,51,234,0.12)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_transparent_0%,_rgba(0,0,0,0.3)_100%)]" />
        <div className="relative">
          <h1 className="text-4xl font-semibold mb-2">Recommended Results</h1>
          <p className="text-white/70 text-sm">
            {genre && `Genre: ${genreList.find(g => g.id === genre)?.name || ''} • `}
            {type !== 'all' && `${type === 'movie' ? 'Movies' : 'TV Shows'} • `}
            {quality && `${qualityOptions.find(q => q.value === quality)?.label || ''} • `}
            {year && `Year: ${year} • `}
            {sortOptions.find(s => s.value === sortBy)?.label || ''}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20 text-white/70">
          <p className="text-xl">No results found. Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map((item: any) => (
              <div key={item.id}>
                {item.media_type === 'tv' || type === 'tv' ? (
                  <TvShowCard tvShowResult={item} />
                ) : (
                  <MovieCard movieResult={item} />
                )}
              </div>
            ))}
          </div>
          <Pagination total={Math.min(500, totalPages)} />
        </>
      )}
    </div>
  )
}

// Helper arrays for display
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

export default FilteredResults


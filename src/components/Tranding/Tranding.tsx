import HeroCarousel from '../HeroCarousel'
import useTrandingList from '../../hooks/useTrandingList'
import ContinueWatching from '../ContinueWatching'
import { useEffect, useState } from 'react'
import apiClient from '../../services/api-client'
import HorizontalInfiniteRow from '../HorizontalInfiniteRow'
import TopTenSection from '../TopTenSection'

const Tranding = () => {
  const trendingMovies = useTrandingList('movie').trandingData
  const trendingTv = useTrandingList('tv').trandingData
  const [topImdbSeed, setTopImdbSeed] = useState<any[]>([])
  const [animeSeed, setAnimeSeed] = useState<any[]>([])
  const [recommendedSeed, setRecommendedSeed] = useState<any[]>([])
  const [movieSeed, setMovieSeed] = useState<any[]>([])
  const [tvSeed, setTvSeed] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      apiClient.get('/movie/top_rated', { params: { page: 1 } }),
      apiClient.get('/tv/top_rated', { params: { page: 1 } })
    ]).then(([m,t]) => {
      const movies = (m.data.results || []).map((x: any) => ({ ...x, media_type: 'movie' }))
      const tv = (t.data.results || []).map((x: any) => ({ ...x, media_type: 'tv' }))
      const mixed = [...movies, ...tv].slice(0, 12)
      setTopImdbSeed(mixed)
    }).catch(()=>{})
  }, [])
  useEffect(() => {
    apiClient.get('/discover/tv', {
      params: {
        page: 1,
        with_genres: 16,
        with_origin_country: 'JP',
        sort_by: 'popularity.desc'
      }
    }).then(r => setAnimeSeed((r.data.results || []).slice(0, 12))).catch(()=>{})
  }, [])

  useEffect(() => {
    apiClient.get('/discover/movie', { params: { page: 1 } }).then(r => setMovieSeed((r.data.results || []).slice(0, 12))).catch(()=>{})
    apiClient.get('/discover/tv', { params: { page: 1 } }).then(r => setTvSeed((r.data.results || []).slice(0, 12))).catch(()=>{})
    apiClient.get('/discover/movie', { params: { page: 1, sort_by: 'vote_average.desc', 'vote_count.gte': 2000 } })
      .then(r => setRecommendedSeed((r.data.results || []).slice(0, 12)))
      .catch(()=>{})
  }, [])

  const fetchDiscoverMovies = async (page: number) => {
    const r = await apiClient.get('/discover/movie', { params: { page } })
    return r.data?.results || []
  }
  const fetchDiscoverTv = async (page: number) => {
    const r = await apiClient.get('/discover/tv', { params: { page } })
    return r.data?.results || []
  }
  const fetchTopImdbMixed = async (page: number) => {
    const [m, t] = await Promise.all([
      apiClient.get('/movie/top_rated', { params: { page } }),
      apiClient.get('/tv/top_rated', { params: { page } })
    ])
    const movies = (m.data.results || []).map((x: any) => ({ ...x, media_type: 'movie' }))
    const tv = (t.data.results || []).map((x: any) => ({ ...x, media_type: 'tv' }))
    return [...movies, ...tv]
  }
  const fetchAnime = async (page: number) => {
    const r = await apiClient.get('/discover/tv', {
      params: {
        page,
        with_genres: 16,
        with_origin_country: 'JP',
        sort_by: 'popularity.desc'
      }
    })
    return r.data?.results || []
  }
  const fetchRecommended = async (page: number) => {
    const r = await apiClient.get('/discover/movie', { params: { page, sort_by: 'vote_average.desc', 'vote_count.gte': 2000 } })
    return r.data?.results || []
  }

  const fetchTrendingMovies = async (page: number) => {
    const r = await apiClient.get('/trending/movie/day', { params: { page } })
    return r.data?.results || []
  }
  const fetchTrendingTv = async (page: number) => {
    const r = await apiClient.get('/trending/tv/day', { params: { page } })
    return r.data?.results || []
  }
  return (
    <div>
      <HeroCarousel />
      <ContinueWatching />
      <HorizontalInfiniteRow title="Trending Movies" kind="movie" initialItems={(trendingMovies || []).slice(0, 10)} fetchPage={fetchTrendingMovies} />
      <HorizontalInfiniteRow title="Trending TV Shows" kind="tv" initialItems={(trendingTv || []).slice(0, 10)} fetchPage={fetchTrendingTv} />

      <TopTenSection />

      <HorizontalInfiniteRow title="Movies" kind="movie" initialItems={movieSeed} fetchPage={fetchDiscoverMovies} />
      <HorizontalInfiniteRow title="TV Shows" kind="tv" initialItems={tvSeed} fetchPage={fetchDiscoverTv} />
      <HorizontalInfiniteRow title="Top IMDb" kind="mixed" initialItems={topImdbSeed} fetchPage={fetchTopImdbMixed} />
      <HorizontalInfiniteRow title="Anime Highlights" kind="tv" initialItems={animeSeed} fetchPage={fetchAnime} />
      <HorizontalInfiniteRow title="Recommended" kind="movie" initialItems={recommendedSeed} fetchPage={fetchRecommended} />
    </div>
  )
}

export default Tranding
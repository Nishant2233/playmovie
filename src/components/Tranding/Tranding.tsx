import HeroCarousel from '../HeroCarousel'
import useTrandingList from '../../hooks/useTrandingList'
import useDiscover from '../../hooks/useDiscover'
import GridSection from '../GridSection'
import ContinueWatching from '../ContinueWatching'
import TopTenSection from '../TopTenSection'
import { useEffect, useState } from 'react'
import apiClient from '../../services/api-client'

const Tranding = () => {
  const trendingMovies = useTrandingList('movie').trandingData
  const trendingTv = useTrandingList('tv').trandingData
  const recommended = useDiscover('movie').items
  const [topMixed, setTopMixed] = useState<any[]>([])
  const [animeList, setAnimeList] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      apiClient.get('/movie/top_rated', { params: { page: 1 } }),
      apiClient.get('/tv/top_rated', { params: { page: 1 } })
    ]).then(([m,t]) => {
      const mixed = [...(m.data.results||[]), ...(t.data.results||[])].slice(0,6)
      setTopMixed(mixed)
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
    }).then(r => setAnimeList((r.data.results || []).slice(0,6))).catch(()=>{})
  }, [])
  return (
    <div>
      <HeroCarousel />
      <ContinueWatching />
      <GridSection title="Trending Movies" items={trendingMovies} kind='movie' />
      <GridSection title="Trending TV Shows" items={trendingTv} kind='tv' />
      <GridSection title="Top IMDb" items={topMixed} kind='mixed' />
      <TopTenSection />
      <GridSection title="Anime Highlights" items={animeList} kind='tv' />
      <GridSection title="Recommended" items={recommended} kind='movie' />
    </div>
  )
}

export default Tranding
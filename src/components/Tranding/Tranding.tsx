import HeroCarousel from '../HeroCarousel'
import useTrandingList from '../../hooks/useTrandingList'
import useDiscover from '../../hooks/useDiscover'
import GridSection from '../GridSection'
import { useEffect, useState } from 'react'
import apiClient from '../../services/api-client'

const Tranding = () => {
  const trendingMovies = useTrandingList('movie').trandingData
  const trendingTv = useTrandingList('tv').trandingData
  const recommended = useDiscover('movie').items
  const [topMixed, setTopMixed] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      apiClient.get('/movie/top_rated', { params: { page: 1 } }),
      apiClient.get('/tv/top_rated', { params: { page: 1 } })
    ]).then(([m,t]) => {
      const mixed = [...(m.data.results||[]), ...(t.data.results||[])].slice(0,6)
      setTopMixed(mixed)
    }).catch(()=>{})
  }, [])
  return (
    <div>
      <HeroCarousel />
      <GridSection title="Trending Movies" items={trendingMovies} kind='movie' />
      <GridSection title="Trending TV Shows" items={trendingTv} kind='tv' />
      <GridSection title="Top IMDb" items={topMixed} kind='mixed' />
      <GridSection title="Recommended" items={recommended} kind='movie' />
    </div>
  )
}

export default Tranding
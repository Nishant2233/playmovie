import React from 'react'
import Trandingmovie from './Trandingmovie'
import TrandingTv from './TrandingTv'
import HeroCarousel from '../HeroCarousel'
import ContentRow from '../ContentRow'
import useTrandingList from '../../hooks/useTrandingList'
import useDiscover from '../../hooks/useDiscover'
import GridSection from '../GridSection'

const Tranding = () => {
  const trendingMovies = useTrandingList('movie').trandingData
  const trendingTv = useTrandingList('tv').trandingData
  const recommended = useDiscover('movie').items
  return (
    <div>
      <HeroCarousel />
      <GridSection title="Trending Movies" items={trendingMovies} kind='movie' />
      <GridSection title="Trending TV Shows" items={trendingTv} kind='tv' />
      <GridSection title="Recommended" items={recommended} kind='movie' />
    </div>
  )
}

export default Tranding
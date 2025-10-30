import React from 'react'
import { useParams } from 'react-router'

const Player = () => {
    const {playerId}=useParams();
    const movieUrl = `https://vidsrc-embed.ru/embed/movie/${playerId}`;


  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-black p-0 m-0">
      <div className="w-full max-w-5xl aspect-video relative">
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
          allow='autoplay; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          src={movieUrl}>
        </iframe>
      </div>
    </div>
  )
}

export default Player
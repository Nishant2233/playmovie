
import { useNavigate, useParams } from 'react-router-dom'

const Player = () => {
    const {playerId}=useParams();
    const navigate = useNavigate();
    const movieUrl = `https://vidsrc-embed.ru/embed/movie/${playerId}`;


  return (
    <div className="relative flex justify-center items-center w-full min-h-screen bg-black p-0 m-0">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-5 left-5 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white"
        aria-label="Back"
      >
        ←
      </button>
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
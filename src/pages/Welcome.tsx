import useMovieList from "../hooks/UseMovies"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { usePageTransition } from "../contex/pageTransition.context"

const Welcome = () => {
  const { movieLists } = useMovieList(undefined, 1)
  const navigate = useNavigate()
  const { startTransition, isTransitioning } = usePageTransition()

  // typewriter state for the PlayMovie word (run once on mount)
  const fullWord = 'PlayMovie'
  const [displayedWord, setDisplayedWord] = useState('')
  const [typingDone, setTypingDone] = useState(false)

  useEffect(() => {
    let idx = 0
    const speed = 90 // ms per char
    const interval = setInterval(() => {
      idx++
      setDisplayedWord(fullWord.slice(0, idx))
      if (idx >= fullWord.length) {
        clearInterval(interval)
        setTypingDone(true)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [])

  // pick first 24 movies for a full-bleed collage (6 cols x 4 rows)
  const cards = movieLists ? movieLists.slice(0, 24) : []

  return (
    <div className="min-h-screen relative bg-black text-white overflow-hidden">
      {/* Background rows of movie cards (non-interactive) */}
      <div className="absolute inset-0 overflow-hidden">
        {/* subtle dark cover so foreground text stays readable (gradient left->right) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 10,
            background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.25) 70%, rgba(0,0,0,0.15) 100%)'
          }}
        />

        <style>{`
          @keyframes float { 0% { transform: translateY(0);} 50% { transform: translateY(-6px);} 100% { transform: translateY(0);} }
          .float { animation: float 10s ease-in-out infinite; }
          @keyframes blink { 0% { opacity: 1 } 50% { opacity: 0 } 100% { opacity: 1 } }
          .type-caret::after { content: '|'; display: inline-block; margin-left: 6px; animation: blink 1s steps(2, start) infinite; color: rgba(255,255,255,0.85); }
          .type-caret.done::after { display: none; }
        `}</style>

  {/* collage grid: responsive - 3 cols on mobile, 6 on md+; fills viewport on mobile */}
  <div 
    id="welcome-cards-container"
    className={`grid grid-cols-3 md:grid-cols-6 gap-[3px] p-2 md:gap-[12px] md:p-6 h-full min-h-screen items-center justify-items-center pointer-events-none relative transition-all duration-[1500ms] ease-out`}
    style={{ 
      zIndex: 0,
      transform: isTransitioning ? 'scale(4) translateZ(0)' : 'scale(1) translateZ(0)',
      opacity: isTransitioning ? 0 : 1,
      filter: isTransitioning ? 'blur(15px)' : 'blur(0px)',
      transformOrigin: 'center center'
    }}
  >
          {Array.from({ length: 24 }).map((_, i) => {
            const m = cards[i]
            const col = i % 6
            const row = Math.floor(i / 6) // 0..3
            // tilt rows: left side down / right side up for even rows, opposite for odd rows
            const rowRotate = row % 2 === 0 ? '-3deg' : '3deg'
            // horizontal shift per row (even rows shift left, odd rows shift right)
            const rowShift = row % 2 === 0 ? -40 : 40
            // small per-item variation
            const itemRotate = (col % 2 === 0) ? '-0.6deg' : '0.6deg'
            const translateY = (col % 3 === 1) ? 10 : 0
            // z-index so top rows appear above lower rows
            const z = 100 - row
            return (
              <div
                key={i}
                className={`w-full h-44 sm:h-56 md:h-72 overflow-hidden rounded-lg shadow-lg float`}
                style={{ 
                  transform: `translateX(${rowShift}px) rotate(${rowRotate}) translateY(${translateY}px) rotate(${itemRotate})`, 
                  filter: 'brightness(0.82)', 
                  backgroundColor: '#111', 
                  zIndex: z
                }}
              >
                {m ? (
                  <img src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} alt={m.title || m.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-800" />
                )}
              </div>
            )
          })}
        </div>
      </div>

  {/* Foreground content */}
    <div 
      className="relative z-20 flex flex-col justify-center min-h-screen px-4 md:px-12 lg:px-20 transition-all duration-[1500ms] ease-out"
      style={{
        opacity: isTransitioning ? 0 : 1,
        transform: isTransitioning ? 'scale(0.8) translateZ(0)' : 'scale(1) translateZ(0)'
      }}
    >
    <div className="w-full mx-auto text-center">
          <h1 className="mb-4 w-full text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight whitespace-nowrap">
            <span className="text-white">Welcome to </span>
            <span className={`type-caret ${typingDone ? 'done' : ''} text-blue-400   bg-black/30 shadow-md`}>{displayedWord}</span>
          </h1>
          <p className="max-w-xl text-white/80 mb-8 mx-auto text-center">Browse trending movies and TV shows, build a watchlist, and enjoy an immersive experience.</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/home')}
              className="px-6 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 inline-flex items-center"
            >
              Go to Home
              <svg className="ml-3 -mr-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome

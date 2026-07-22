import useMovieList from "../hooks/UseMovies"
import { useNavigate } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"

const COL_COUNT = 6
const ROWS_PER_COL = 5

const Welcome = () => {
  const { movieLists } = useMovieList(undefined, 1)
  const navigate = useNavigate()

  const fullWord = "PlayMovie"

  const [displayedWord, setDisplayedWord] = useState("")
  const [typingDone, setTypingDone] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!showContent) return

    let idx = 0

    const interval = setInterval(() => {
      idx++
      setDisplayedWord(fullWord.slice(0, idx))

      if (idx >= fullWord.length) {
        clearInterval(interval)
        setTypingDone(true)
      }
    }, 120)

    return () => clearInterval(interval)
  }, [showContent])

  const columns = useMemo(() => {
    const pool = movieLists?.length ? movieLists : []

    return Array.from({ length: COL_COUNT }, (_, col) => {
      const items = Array.from({ length: ROWS_PER_COL }, (_, row) => {
        const idx = (col * ROWS_PER_COL + row) % Math.max(pool.length, 1)
        return pool[idx] ?? null
      })

      return [...items, ...items]
    })
  }, [movieLists])

  return (
    <div className="min-h-screen relative bg-black text-white overflow-hidden">
      <style>{`
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }

        @keyframes scroll-down {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }

        .scroll-col-up {
          animation: scroll-up 28s linear infinite;
        }

        .scroll-col-down {
          animation: scroll-down 32s linear infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .type-caret::after {
          content: '|';
          display: inline-block;
          margin-left: 4px;
          animation: blink 1s steps(2, start) infinite;
          color: rgba(167, 139, 250, 0.95);
        }

        .type-caret.done::after {
          display: none;
        }

        @keyframes zoom-in-fade {
          0% {
            opacity: 0;
            transform: scale(0.85);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .zoom-out-in {
          animation: zoom-in-fade 0.8s ease-out forwards;
        }
      `}</style>

      {/* Poster background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        {/* Overlay */}
        <div
          className="absolute inset-0 z-10 transition-all duration-700"
          style={{
            background: showContent
              ? "linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.58) 40%, rgba(0,0,0,0.42) 65%, rgba(0,0,0,0.62) 100%)"
              : "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.2) 65%, rgba(0,0,0,0.45) 100%)",
          }}
        />

        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.4) 100%)",
          }}
        />

        {/* Mobile fix: full viewport height */}
        <div className="absolute inset-0 h-[100svh] md:h-full grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 px-2 md:px-4 opacity-95">
          {columns.map((colItems, colIndex) => (
            <div
              key={colIndex}
              className="relative h-[100svh] md:h-full overflow-hidden"
            >
              <div
                className={`flex flex-col gap-3 md:gap-4 ${
                  colIndex % 2 === 0 ? "scroll-col-up" : "scroll-col-down"
                }`}
                style={{ animationDuration: `${24 + colIndex * 3}s` }}
              >
                {colItems.map((movie, i) => (
                  <div
                    key={`${colIndex}-${i}`}
                    className="w-full aspect-[2/3] shrink-0 overflow-hidden rounded-xl border border-white/5 shadow-lg"
                    style={{ filter: "brightness(0.92) saturate(1)" }}
                  >
                    {movie?.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title || movie.name || "Movie"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-900" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Foreground */}
      <div className="relative z-20 flex flex-col justify-center min-h-screen px-4 md:px-12 lg:px-20">
        <div className="w-full mx-auto text-center">

          {showContent && (
            <div className="zoom-out-in">

              {/* Heading */}
              <h1 className="mb-6 text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                <span className="text-[#E5DDFF]">Welcome to </span>

                <span
                  className={`type-caret ${
                    typingDone ? "done" : ""
                  } inline-flex items-center px-4 py-1 rounded-full border border-purple-300/20 bg-white/10 backdrop-blur-md text-[#A78BFA] shadow-[0_8px_24px_rgba(124,58,237,0.22),inset_0_1px_0_rgba(255,255,255,0.08)]`}
                >
                  {displayedWord}
                </span>
              </h1>

              {/* Description */}
              <p className="max-w-xl mx-auto mb-8 text-white/90 text-sm md:text-base">
                Browse trending movies and TV shows, build a watchlist, and enjoy an immersive experience.
              </p>

              {/* Button */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate("/home")}
                  className="px-6 py-3 rounded-full bg-red-600 text-white font-semibold inline-flex items-center hover:bg-red-700 transition-colors duration-200"
                >
                  Go to Home
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Welcome
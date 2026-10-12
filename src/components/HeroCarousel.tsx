import { useCallback, useEffect, useMemo, useState } from "react"
import apiClient from "../services/api-client"
import { useNavigate } from "react-router-dom"
import { useWatchlist } from "../contex/watchlist.context"
import { DEFAULT_GLOW, useHeroAmbience } from "../contex/heroAmbience.context"
import { extractDominantColor } from "../lib/extractImageColor"

type Media = {
  id: number
  title?: string
  name?: string
  backdrop_path?: string
  poster_path?: string
  vote_average?: number
  overview?: string
  release_date?: string
  first_air_date?: string
}

const HeroCarousel = () => {
  const [slides, setSlides] = useState<Media[]>([])
  const [index, setIndex] = useState(0)
  const [colorById, setColorById] = useState<Record<number, string>>({})
  const { glowColor, setGlowColor } = useHeroAmbience()
  const navigate = useNavigate()
  const { add, has } = useWatchlist()

  useEffect(() => {
    apiClient
      .get("/movie/now_playing", { params: { page: 1 } })
      .then((r) => setSlides(r.data.results?.slice(0, 5) || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    return () => setGlowColor(DEFAULT_GLOW)
  }, [setGlowColor])

  useEffect(() => {
    if (slides.length === 0) return
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000)
    return () => clearInterval(id)
  }, [slides.length])

  const loadColorForSlide = useCallback(async (slide: Media) => {
    const path = slide.poster_path || slide.backdrop_path
    if (!path) return DEFAULT_GLOW
    const url = `https://image.tmdb.org/t/p/w342${path}`
    return extractDominantColor(url)
  }, [])

  useEffect(() => {
    if (slides.length === 0) return
    let cancelled = false
    slides.forEach((slide) => {
      loadColorForSlide(slide).then((color) => {
        if (cancelled) return
        setColorById((prev) => (prev[slide.id] ? prev : { ...prev, [slide.id]: color }))
      })
    })
    return () => {
      cancelled = true
    }
  }, [slides, loadColorForSlide])

  useEffect(() => {
    const slide = slides[index]
    if (!slide) return
    const next = colorById[slide.id]
    if (next) {
      setGlowColor(next)
      return
    }
    loadColorForSlide(slide).then((color) => {
      setGlowColor(color)
      setColorById((prev) => ({ ...prev, [slide.id]: color }))
    })
  }, [index, slides, colorById, loadColorForSlide, setGlowColor])

  const ambientStyle = useMemo(
    () =>
      ({
        ["--hero-glow" as string]: glowColor,
      }) as React.CSSProperties,
    [glowColor]
  )

  if (slides.length === 0) return null
  const current = slides[index]
  const title = current.title || current.name || ""
  const year = (current.release_date || current.first_air_date || "").slice(0, 4)
  const rating = current.vote_average ? current.vote_average.toFixed(1) : undefined

  return (
    <section
      className="relative w-full overflow-hidden pb-2 transition-[background] duration-1000 ease-out"
      style={ambientStyle}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-16 md:-top-[4.5rem] bottom-0 -z-10 duration-1000"
        style={{
          background: `
            radial-gradient(ellipse 95% 70% at 50% 0%, color-mix(in srgb, var(--hero-glow) 72%, transparent) 0%, transparent 58%),
            radial-gradient(ellipse 80% 50% at 50% 22%, color-mix(in srgb, var(--hero-glow) 48%, #000) 0%, transparent 55%),
            linear-gradient(to bottom, color-mix(in srgb, var(--hero-glow) 32%, #030303) 0%, #000 68%)
          `,
          transition: "background 1s ease",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 -top-8 md:-top-4 h-72 w-[min(110%,980px)] -translate-x-1/2 rounded-full blur-[110px] opacity-55 duration-1000 -z-10"
        style={{ backgroundColor: "var(--hero-glow)", transition: "background-color 1s ease" }}
      />

      <div className="relative w-full px-3 sm:px-6 lg:px-12">
        <div className="relative w-full overflow-hidden rounded-xl md:rounded-2xl bg-neutral-900 shadow-[0_8px_40px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] md:aspect-[16/7] lg:aspect-[21/9]">
            {slides.map((s, i) => (
              <img
                key={s.id}
                src={`https://image.tmdb.org/t/p/original${s.backdrop_path}`}
                alt={title}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
            <div
              aria-hidden
              className="absolute inset-0 opacity-35 mix-blend-multiply duration-1000"
              style={{
                background: `linear-gradient(135deg, color-mix(in srgb, var(--hero-glow) 45%, transparent), transparent 55%)`,
                transition: "background 1s ease",
              }}
            />
            <button
              onClick={() => navigate(`/details/movie/${current.id}`)}
              className="absolute inset-0 m-auto w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur flex items-center justify-center text-white text-2xl"
              aria-label="Open details"
            >
              ▶
            </button>
            <button
              onClick={() => setIndex((index - 1 + slides.length) % slides.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white"
            >
              ‹
            </button>
            <button
              onClick={() => setIndex((index + 1) % slides.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white"
            >
              ›
            </button>
            <div className="absolute right-4 md:right-6 bottom-3 md:bottom-4 text-sm opacity-80 text-white">
              {index + 1}/{slides.length}
            </div>
          </div>
        </div>

        <div className="px-1 sm:px-2 md:px-0 py-5 md:py-6 text-white">
          <div className="flex gap-6 items-start justify-between">
            {current.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w300${current.poster_path}`}
                alt={title}
                className="w-28 md:w-40 rounded-lg shadow-lg ring-1 ring-white/10"
              />
            )}
            <div className="flex-1">
              <div className="text-sm opacity-80 mb-1">Movie • {year}</div>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-3">{title}</h1>
              <div className="flex gap-3 items-center mb-4 text-sm">
                {rating && <span className="px-3 py-1 rounded-full bg-[#e50914]">IMDb {rating}</span>}
              </div>
              <p className="text-neutral-300 max-w-3xl line-clamp-3 md:line-clamp-none">{current.overview}</p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() =>
                  add({
                    id: current.id,
                    title,
                    poster_path: current.poster_path || "",
                    backdrop_path: current.backdrop_path,
                  })
                }
                disabled={has(current.id)}
                className={`px-6 h-11 rounded-full font-semibold ${has(current.id) ? "bg-purple-600/60 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}`}
              >
                {has(current.id) ? "Added to Watchlist" : "Add to Watchlist"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroCarousel

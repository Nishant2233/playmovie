//@ts-nocheck
import pmlogo from "../assets/pmlogo.jpg"
import Genres from "./Genres"
import { Input } from "./ui/input"
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom"
import { useContext, useEffect, useRef, useState } from "react"
import { SearchResultContext } from "../contex/searchResult.context"
import { useHeroAmbience } from "../contex/heroAmbience.context"
import { ChevronRight, Menu, Search, X } from "lucide-react"

const NAV_LINKS = [
  { to: "/home", label: "Home" },
  { to: "/movies", label: "Movies" },
  { to: "/tvshows", label: "TV Shows" },
  { to: "/top-imdb", label: "Top IMDb" },
  { to: "/anime", label: "Anime" },
]

const BrandMark = ({ onClick }: { onClick?: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="shrink-0 text-purple-600 font-extrabold text-xl tracking-tight uppercase select-none"
    aria-label="PlayMovie home"
  >
    PlayMovie
  </button>
)

const GLASS_PILL =
  "rounded-[2rem] border border-white/10 bg-[#0b0b0b]/65 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl backdrop-saturate-150"

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { searchText, setSearchText } = useContext(SearchResultContext)
  const { glowColor } = useHeroAmbience()
  const isHome = location.pathname === "/home"
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 1024px)").matches : true
  )
  const lastYRef = useRef(0)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)")
    const onChange = () => setIsLargeScreen(mq.matches)
    onChange()
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  useEffect(() => {
    lastYRef.current = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setSolid(y > 24)

      if (open) {
        setHidden(false)
        lastYRef.current = y
        return
      }

      const lastY = lastYRef.current
      const goingDown = y > lastY

      if (y < 80) setHidden(false)
      else setHidden(goingDown)

      lastYRef.current = y
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    navigate(`/search/${e.target.value}`)
    if (e.target.value.length === 0) {
      navigate("/home")
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    navigate(`/search/${searchText}`)
  }

  const goHome = () => {
    setOpen(false)
    navigate("/home")
  }

  if (location.pathname === "/") return null

  const headerStyle: React.CSSProperties | undefined =
    isHome && isLargeScreen
      ? {
          background: solid
            ? `linear-gradient(to bottom, color-mix(in srgb, ${glowColor} 38%, rgba(0,0,0,0.82)) 0%, rgba(0,0,0,0.92) 100%)`
            : `radial-gradient(ellipse 90% 140% at 50% -40%, color-mix(in srgb, ${glowColor} 62%, transparent) 0%, transparent 62%), linear-gradient(to bottom, color-mix(in srgb, ${glowColor} 22%, rgba(0,0,0,0.15)) 0%, rgba(0,0,0,0.08) 100%)`,
          transition: "background 1s ease",
        }
      : undefined

  return (
    <>
      <header
        style={headerStyle}
        className={`fixed top-0 left-0 right-0 z-40 transform transition-all duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"} max-lg:bg-transparent max-lg:border-0 max-lg:shadow-none max-lg:backdrop-blur-none lg:border-0 lg:bg-transparent lg:shadow-none`}
      >
        {/* Mobile header */}
        <div className="relative flex h-16 w-full items-center justify-between gap-3 px-4 lg:hidden">
          <button type="button" onClick={goHome} className="flex shrink-0 items-center" aria-label="PlayMovie home">
            <img src={pmlogo} alt="PlayMovie" className="h-10 w-10 rounded-full object-cover" />
          </button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/20 text-white hover:bg-white/10 transition-colors"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Desktop glass pill navbar */}
        <div className="hidden px-6 pb-3 pt-2 lg:block xl:px-10">
          <div className={`mx-auto flex w-full max-w-6xl items-center gap-0.5 px-3 py-2 ${GLASS_PILL}`}>
            <button type="button" onClick={goHome} className="mr-1 shrink-0" aria-label="PlayMovie home">
              <img src={pmlogo} alt="PlayMovie" className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10" />
            </button>

            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative shrink-0 px-3.5 py-2 text-[15px] font-medium transition-colors whitespace-nowrap ${
                    isActive ? "text-white" : "text-white/80 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <span className="relative inline-block">
                    {link.label}
                    <span
                      className={`absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-purple-600 transition-opacity ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </span>
                )}
              </NavLink>
            ))}

            <div className="shrink-0 px-3.5 py-2 text-[15px] text-white/80 hover:text-white [&_h1]:cursor-pointer [&_h1]:text-[15px] [&_h1]:font-medium [&_h1]:text-inherit">
              <Genres />
            </div>

            <div className="min-w-4 flex-1" />

            <form onSubmit={handleSubmit} className="shrink-0">
              <div className="relative w-52 xl:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                <Input
                  type="text"
                  placeholder="Search"
                  className="h-9 rounded-2xl border-gray-700/80 bg-[#0f0f0f]/90 pl-9 text-sm text-white placeholder:text-white/50"
                  value={searchText}
                  onChange={handleChange}
                />
              </div>
            </form>

            <Link
              to="/watchlist"
              className="ml-2 shrink-0 rounded-full bg-purple-600/90 px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(147,51,234,0.35)] transition-colors hover:bg-purple-600"
            >
              Watchlist
            </Link>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <aside className="relative flex h-full w-[min(320px,88vw)] flex-col bg-black shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <BrandMark onClick={goHome} />
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 text-white hover:bg-neutral-700"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <form onSubmit={handleSubmit} className="mb-6">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                  <Input
                    type="text"
                    placeholder="Search"
                    className="h-10 w-full rounded-lg border-white/15 bg-neutral-900 pl-9 text-white placeholder:text-white/50"
                    value={searchText}
                    onChange={handleChange}
                  />
                </div>
              </form>

              <p className="mb-3 text-xs font-semibold tracking-widest text-neutral-500">BROWSE</p>
              <ul className="divide-y divide-white/5">
                {NAV_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between py-3.5 text-[15px] font-medium text-white hover:text-white/90"
                    >
                      <span>{link.label}</span>
                      <ChevronRight className="h-4 w-4 text-neutral-500" />
                    </Link>
                  </li>
                ))}
                <li className="py-3.5">
                  <div className="flex items-center justify-between text-[15px] font-medium text-white [&_h1]:text-[15px] [&_h1]:font-medium">
                    <Genres />
                    <ChevronRight className="h-4 w-4 text-neutral-500 pointer-events-none" />
                  </div>
                </li>
                <li className="pt-4">
                  <Link
                    to="/watchlist"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center rounded-full bg-purple-600/90 py-3 text-[15px] font-semibold text-white hover:bg-purple-600"
                  >
                    Watchlist
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}

export default Navbar

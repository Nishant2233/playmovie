//@ts-nocheck
import pmlogo from "../assets/pmlogo.jpg"
import Genres from "./Genres"
import { Input } from "./ui/input"
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { SearchResultContext } from "../contex/searchResult.context"
import { Search, Menu, X } from "lucide-react"
import { usePageTransition } from "../contex/pageTransition.context"

const Navbar = () => {
  const navigate=useNavigate()
  const location = useLocation()
  const {searchText,setSearchText}=useContext(SearchResultContext)
  const { startTransition } = usePageTransition()
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  useEffect(()=>{
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setSolid(y > 60)
      setHidden(y > last && y > 120)
      last = y
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  },[])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])
  const handleChange=(e: React.ChangeEvent<HTMLInputElement> )=>{
   setSearchText(e.target.value)
    navigate(`/search/${e.target.value}`)
    if(e.target.value.length===0){
      startTransition()
      setTimeout(() => navigate("/home"), 1500)
    }
  }

  const handleNavigateToHome = () => {
    if (location.pathname !== '/home') {
      startTransition()
      // Wait for zoom animation to complete (1500ms) before navigating
      setTimeout(() => navigate('/home'), 1500)
    }
  }
  const handleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    navigate(`/search/${searchText}`)
  }

  if (location.pathname === "/") return null
  return (
   <header className={`sticky top-0 z-50 ${solid? 'bg-transparent' : 'bg-transparent'} transition-all duration-300 ${hidden? '-translate-y-full' : 'translate-y-0'}`}>
     <div className="px-4 md:px-10 h-20 flex items-center justify-between gap-4">
      
      <div className="flex md:hidden items-center justify- w-full ">
        <div></div> 
        <button onClick={handleNavigateToHome} className="shrink-0">
          <img src={pmlogo} alt="logo" className="h-10 w-10 rounded-full object-cover cursor-pointer elevate" />
        </button>

      </div>
     
      <div className="hidden md:flex items-center justify-center flex-1">
        <div className="px-3 py-2 rounded-[2rem] bg-[#0b0b0b]/70 border border-white/10 backdrop-blur flex items-center gap-1 w-full max-w-6xl">
          {/* Logo inside the unified navbar */}
          <button onClick={handleNavigateToHome} className="shrink-0 mr-2">
            <img src={pmlogo} alt="logo" className="h-10 w-10 rounded-full object-cover cursor-pointer elevate" />
          </button>
          {/* Primary links */}
          {[{to:'/home',label:'Home'},{to:'/movies',label:'Movies'},{to:'/tvshows',label:'TV Shows'},{to:'/top-imdb',label:'Top IMDb'},{to:'/anime',label:'Anime'}].map(link => (
            link.to === '/home' ? (
              <button
                key={link.to}
                onClick={handleNavigateToHome}
                className="relative px-4 py-2 rounded-xl transition-colors text-white/80 hover:text-white"
              >
                <span className="relative">{link.label}</span>
              </button>
            ) : (
              <NavLink key={link.to} to={link.to} className={({isActive})=>`relative px-4 py-2 rounded-xl transition-colors ${isActive? 'text-white' : 'text-white/80 hover:text-white'}`}>
                 {({isActive}) => (
                   <span className="relative">{link.label}
                    <span className={`absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-purple-600 transition-opacity ${isActive? 'opacity-100' : 'opacity-0 group-hover:opacity-80 '}`}></span>
                   </span>
                 )}
               </NavLink>
            )
           ))}
           <div className="px-3 py-2"><Genres /></div>
          <div className="flex-1" />
          {/* Search inside unified navbar */}
          <form onSubmit={handleSubmit} className="hidden md:block">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input type="text" placeholder="Search" className="pl-9 border-gray-700 bg-[#0f0f0f] rounded-2xl w-64"
               value={searchText} onChange={handleChange} />
            </div>
          </form>
          {/* Watchlist inside unified navbar */}
           <Link to="/watchlist" className="ml-2 px-4 py-2 rounded-full bg-purple-600/90 hover:bg-purple-600 text-white text-sm font-semibold shrink-0">Watchlist</Link>
         </div>
       </div>

       <button 
         className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-white/20 hover:bg-white/10 transition-all duration-300 z-50 relative" 
         onClick={()=> setOpen(!open)} 
         aria-label={open ? "Close Menu" : "Open Menu"}
       >
         <Menu 
           className={`h-5 w-5 text-white absolute transition-all duration-300 ${
             open ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
           }`} 
         />
         <X 
           className={`h-5 w-5 text-white absolute transition-all duration-300 ${
             open ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
           }`} 
         />
       </button>
     </div>

     {/* Mobile Menu Overlay and Content */}
     <div 
       className={`md:hidden fixed inset-0 bg-black z-40 transition-opacity duration-500 ease-in-out ${
         open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
       }`}
       onClick={() => setOpen(false)}
     >
       <div 
         className={`absolute top-0 left-0 right-0 bg-black border-b border-white/10 transition-all duration-500 ease-in-out ${
           open ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
         }`}
         onClick={(e) => e.stopPropagation()}
       >
         <div className="px-4 pt-20 pb-6 max-h-screen overflow-y-auto">
           <form onSubmit={handleSubmit} className="py-3 mb-4">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
               <Input type="text" placeholder="Search" className="pl-9 border-gray-700 bg-[#0f0f0f] rounded-2xl w-full" value={searchText} onChange={handleChange} />
             </div>
           </form>
           <div className="grid gap-4 text-base">
            <Link 
              to="/home" 
              onClick={(e) => { 
                e.preventDefault()
                setOpen(false)
                handleNavigateToHome()
              }} 
              className="text-white hover:text-[var(--accent)] transition-colors duration-200 py-2"
            >
              Home
            </Link>
             <Link 
               to="/movies" 
               onClick={()=> setOpen(false)} 
               className="text-white hover:text-[var(--accent)] transition-colors duration-200 py-2"
             >
               Movies
             </Link>
             <Link 
               to="/tvshows" 
               onClick={()=> setOpen(false)} 
               className="text-white hover:text-[var(--accent)] transition-colors duration-200 py-2"
             >
               TV Shows
             </Link>
             <Link 
               to="/top-imdb" 
               onClick={()=> setOpen(false)} 
               className="text-white hover:text-[var(--accent)] transition-colors duration-200 py-2"
             >
               Top IMDb
             </Link>
             <Link 
               to="/anime" 
               onClick={()=> setOpen(false)} 
               className="text-white hover:text-[var(--accent)] transition-colors duration-200 py-2"
             >
               Anime
             </Link>
             <div className="py-2">
               <Genres />
             </div>
             <Link 
               to="/watchlist" 
               onClick={()=> setOpen(false)} 
               className="px-4 py-3 rounded-full bg-purple-600/90 hover:bg-purple-600 text-white text-center font-semibold transition-colors duration-200 mt-2"
             >
               Watchlist
             </Link>
           </div>
         </div>
       </div>
     </div>
   </header>
  )
}

export default Navbar
//@ts-nocheck
import pmlogo from "../assets/pmlogo.jpg"
import Genres from "./Genres"
import { Input } from "./ui/input"
import {Link, NavLink, useNavigate} from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { SearchResultContext } from "../contex/searchResult.Context";
import { Search } from "lucide-react"

const Navbar = () => {
  const navigate=useNavigate()
  const {searchText,setSearchText}=useContext(SearchResultContext)
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
  const handleChange=(e: React.ChangeEvent<HTMLInputElement> )=>{
   setSearchText(e.target.value)
    navigate(`/search/${e.target.value}`)
    if(e.target.value.length===0){
      navigate("/movies")
    }
  }
  const handleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    navigate(`/search/${searchText}`)
  }
  return (
   <header className={`sticky top-0 z-30 ${solid? 'bg-transparent' : 'bg-transparent'} transition-all duration-300 ${hidden? '-translate-y-full' : 'translate-y-0'}`}>
     <div className="px-4 md:px-10 h-20 flex items-center justify-between gap-4">
       <div className="flex items-center gap-3">
         <img src={pmlogo} alt="logo" className="h-10 w-10 rounded-full object-cover cursor-pointer elevate" onClick={()=> navigate('/')} />
       </div>

       <div className="hidden md:flex items-center justify-center flex-1">
         <div className="px-3 py-2 rounded-[2rem] bg-[#0b0b0b]/80 border border-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] flex items-center gap-1">
           {[
             {to:'/',label:'Home'},
             {to:'/movies',label:'Movies'},
             {to:'/tvshows',label:'TV Shows'},
             {to:'/top-imdb',label:'Top IMDb'}
           ].map(link => (
             <NavLink key={link.to} to={link.to} className={({isActive})=>`relative px-4 py-2 rounded-xl transition-colors ${isActive? 'text-white' : 'text-white/80 hover:text-white'}`}>
               {({isActive}) => (
                 <span className="relative">{link.label}
                   <span className={`absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-purple-500 to-sky-500 transition-opacity ${isActive? 'opacity-100' : 'opacity-0 group-hover:opacity-80'}`}></span>
                 </span>
               )}
             </NavLink>
           ))}
           <div className="px-3 py-2"><Genres /></div>
         </div>
       </div>

       <div className="hidden md:flex items-center gap-3">
         <Link to="/watchlist" className="px-4 py-2 rounded-full bg-purple-600/90 hover:bg-purple-600 text-white text-sm font-semibold">Watchlist</Link>
         <form onSubmit={handleSubmit}>
           <div className="relative w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
             <Input type="text" placeholder="Search" className="pl-9 border-gray-700 bg-[#0f0f0f] rounded-2xl w-64"
              value={searchText} onChange={handleChange} />
           </div>
         </form>
       </div>

       <button className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-white/20" onClick={()=> setOpen(!open)} aria-label="Menu">≡</button>
     </div>

     {open && (
       <div className="md:hidden border-t border-white/10 px-4 pb-4">
         <form onSubmit={handleSubmit} className="py-3">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
             <Input type="text" placeholder="Search" className="pl-9 border-gray-700 bg-[#0f0f0f] rounded-2xl w-full" value={searchText} onChange={handleChange} />
           </div>
         </form>
         <div className="grid gap-3 text-sm">
           <Link to="/" onClick={()=> setOpen(false)} className="hover:text-[var(--accent)]">Home</Link>
           <Link to="/movies" onClick={()=> setOpen(false)} className="hover:text-[var(--accent)]">Movies</Link>
           <Link to="/tvshows" onClick={()=> setOpen(false)} className="hover:text-[var(--accent)]">TV Shows</Link>
           <Link to="/top-imdb" onClick={()=> setOpen(false)} className="hover:text-[var(--accent)]">Top IMDb</Link>
           <Genres />
           <Link to="/watchlist" onClick={()=> setOpen(false)} className="px-4 py-2 rounded-full bg-purple-600/90 hover:bg-purple-600 text-white text-center font-semibold">Watchlist</Link>
         </div>
       </div>
     )}
   </header>
  )
}

export default Navbar
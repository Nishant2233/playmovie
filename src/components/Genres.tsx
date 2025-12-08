import { DropdownMenuRadioGroup } from "@radix-ui/react-dropdown-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
    DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { useContext, useState } from "react"
import { GenresContext } from "../contex/genres.contex"
import { useNavigate } from "react-router"


const genreList =  [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ]

  


const Genres = () => {
   
   const { genres, setGenres }=useContext (GenresContext)
   const[genreName, setGenreName]= useState<string | undefined>()

    console.log(genres);
    const navigate = useNavigate();
    console.log(genreName);
   
     const onChange = (data: string)=>{
       const id = Number(data)
       if (!Number.isNaN(id)) setGenres (id);
       navigate("/movies");
     }


  return (
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <h1 className="cursor-pointer hover:text-[var(--accent)] transition-colors">{!genres ? "Genres": genreName}</h1>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="start" sideOffset={12} className="w-[760px] max-w-[90vw] p-4 bg-[#0a0f1d] text-white border border-sky-500/60 rounded-2xl shadow-[0_12px_50px_rgba(46,130,255,0.25)]">
    <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-sky-500/30 p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(80,140,255,0.18)_0%,_transparent_55%)]" />
      <DropdownMenuRadioGroup value={(genres ?? '').toString()} onValueChange={onChange}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-3 gap-x-8">
    {genreList.map((genre) => (
            <DropdownMenuRadioItem
              key={genre.id}
              onClick={()=> setGenreName(genre.name)}
              value={String(genre.id)}
              className="cursor-pointer rounded-lg px-3 py-2 border border-transparent text-white/90 hover:text-white hover:border-sky-400/60 hover:bg-white/10 data-[state=checked]:border-sky-400 data-[state=checked]:bg-sky-500/15 data-[state=checked]:text-white transition-all duration-150"
            >
              {genre.name}
            </DropdownMenuRadioItem>
          ))}
        </div>
    </DropdownMenuRadioGroup>
    </div>
  </DropdownMenuContent>
</DropdownMenu>  )
}

export default Genres
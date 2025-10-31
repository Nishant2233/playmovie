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
  <DropdownMenuContent align="start" sideOffset={12} className="w-[760px] max-w-[90vw] p-4 bg-[#0f0f10] text-white border border-white/10 rounded-xl shadow-2xl">
    <div className="rounded-xl bg-white/5 border border-white/10 p-4">
      <DropdownMenuRadioGroup value={(genres ?? '').toString()} onValueChange={onChange}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-3 gap-x-8">
    {genreList.map((genre) => (
            <DropdownMenuRadioItem key={genre.id} onClick={()=> setGenreName(genre.name)} value={String(genre.id)} className="cursor-pointer data-[state=checked]:text-purple-400 focus:bg-white/5 rounded px-2 py-1">
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
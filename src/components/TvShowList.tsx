import useTvShowList from "../hooks/useTvShowList"
import { useState, useEffect } from "react"
import TvShowCard from "./TvShowCard";
import { useSearchParams } from "react-router-dom";
import Pagination from "./Pagination";
const TvShowList = () => {
  const [params] = useSearchParams();
  const page = Number(params.get('page') || 1);
  const [genre, setGenre] = useState<number | null>(null)
  const { tvShows, totalPages } = useTvShowList(page, genre);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div className="px-5 md:px-10 mb-10">
      <div className="relative -mx-5 md:-mx-10 px-5 md:px-10 pt-8 pb-8 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0f1d]/80 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(147,51,234,0.12)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_transparent_0%,_rgba(0,0,0,0.3)_100%)]" />
        <div className="relative flex items-center justify-between">
          <h1 className="text-4xl font-semibold">TV Shows</h1>
        <select className="bg-[#0f0f10] border border-white/10 rounded-xl px-3 py-2 text-sm" value={genre ?? ''} onChange={(e)=> setGenre(e.target.value? Number(e.target.value) : null)}>
          <option value="">All Genres</option>
          <option value="10759">Action & Adventure</option>
          <option value="16">Animation</option>
          <option value="35">Comedy</option>
          <option value="80">Crime</option>
          <option value="99">Documentary</option>
          <option value="18">Drama</option>
          <option value="10751">Family</option>
          <option value="10762">Kids</option>
          <option value="9648">Mystery</option>
          <option value="10763">News</option>
          <option value="10764">Reality</option>
          <option value="10765">Sci-Fi & Fantasy</option>
          <option value="10766">Soap</option>
          <option value="10767">Talk</option>
          <option value="10768">War & Politics</option>
          <option value="37">Western</option>
        </select>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {tvShows?.map((tvShow) => (
          <div key={tvShow.id}>
            <TvShowCard tvShowResult={tvShow} />
          </div>  
        ))}
      </div>
      <Pagination total={Math.min(500, totalPages || 1)} />
    </div>
  )
}

export default TvShowList

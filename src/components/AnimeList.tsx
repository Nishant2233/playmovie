import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import useAnimeList from "../hooks/useAnimeList"
import TvShowCard from "./TvShowCard"
import Pagination from "./Pagination"

const AnimeList = () => {
  const [params] = useSearchParams()
  const page = Number(params.get("page") || 1)
  const { anime, totalPages } = useAnimeList(page)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [page])

  return (
    <div className="px-5 md:px-10 mb-10">
      <div className="flex items-center justify-between py-8">
        <h1 className="text-4xl font-semibold">Anime</h1>
        <p className="text-sm text-white/70">Sorted by popularity (JP origin)</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {anime?.map((show) => (
          <div key={show.id}>
            <TvShowCard tvShowResult={show} />
          </div>
        ))}
      </div>
      <Pagination total={Math.min(500, totalPages || 1)} />
    </div>
  )
}

export default AnimeList


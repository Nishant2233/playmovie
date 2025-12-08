import { useEffect, useState } from "react"
import apiClient from "../services/api-client"

// Fetches anime (Japanese animation) TV series from TMDB.
const useAnimeList = (page: number = 1) => {
  const [anime, setAnime] = useState<any[]>()
  const [totalPages, setTotalPages] = useState<number>(1)

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const res = await apiClient.get("/discover/tv", {
          params: {
            page,
            with_genres: 16, // Animation genre
            with_origin_country: "JP",
            sort_by: "popularity.desc"
          }
        })
        setAnime(res.data.results)
        setTotalPages(res.data.total_pages || 1)
      } catch (error) {
        // fail silently to keep UI resilient
      }
    }
    fetchAnime()
  }, [page])

  return { anime, totalPages }
}

export default useAnimeList


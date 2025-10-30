import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import apiClient from "../services/api-client"

type Season = { season_number: number; episode_count: number; name: string }
type Episode = { episode_number: number; name: string }

const TvPlayer = () => {
  const { tvId } = useParams()
  const navigate = useNavigate()
  const [seasons, setSeasons] = useState<Season[]>([])
  const [seasonNumber, setSeasonNumber] = useState<number>(1)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [episodeNumber, setEpisodeNumber] = useState<number>(1)

  // Fetch TV details to get seasons
  useEffect(() => {
    if (!tvId) return
    apiClient.get(`/tv/${tvId}`).then(r => {
      const list: Season[] = (r.data?.seasons || []).filter((s: Season) => s.season_number > 0)
      setSeasons(list)
      if (list.length > 0) {
        setSeasonNumber(list[0].season_number)
      }
    }).catch(() => {})
  }, [tvId])

  // Fetch episodes for selected season
  useEffect(() => {
    if (!tvId || !seasonNumber) return
    apiClient.get(`/tv/${tvId}/season/${seasonNumber}`).then(r => {
      const eps: Episode[] = r.data?.episodes || []
      setEpisodes(eps)
      if (eps.length > 0) setEpisodeNumber(eps[0].episode_number)
    }).catch(() => {})
  }, [tvId, seasonNumber])

  const movieUrl = useMemo(() => {
    if (!tvId || !seasonNumber || !episodeNumber) return ""
    return `https://vidsrc-embed.ru/embed/tv?tmdb=${tvId}&season=${seasonNumber}&episode=${episodeNumber}&autoplay=1`
  }, [tvId, seasonNumber, episodeNumber])

  return (
    <div className="relative w-full min-h-screen bg-black text-white">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-5 left-5 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20"
        aria-label="Back"
      >
        ←
      </button>
      <div className="px-5 md:px-10 py-4 flex flex-col md:flex-row gap-4 items-start">
        <div className="flex items-center gap-3">
          <label className="text-sm opacity-80">Season</label>
          <select
            className="bg-neutral-900 border border-neutral-700 rounded px-3 py-2"
            value={seasonNumber}
            onChange={(e)=> setSeasonNumber(Number(e.target.value))}
          >
            {seasons.map(s => (
              <option key={s.season_number} value={s.season_number}>{s.name || `Season ${s.season_number}`}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm opacity-80">Episode</label>
          <select
            className="bg-neutral-900 border border-neutral-700 rounded px-3 py-2"
            value={episodeNumber}
            onChange={(e)=> setEpisodeNumber(Number(e.target.value))}
          >
            {episodes.map(ep => (
              <option key={ep.episode_number} value={ep.episode_number}>{ep.episode_number} — {ep.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-center items-center w-full">
        <div className="w-full max-w-5xl aspect-video relative">
          {movieUrl && (
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
              allow='autoplay; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
              src={movieUrl}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default TvPlayer



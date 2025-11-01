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
  const [server, setServer] = useState(1);

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
    return server === 1
      ? `https://vidsrc-embed.ru/embed/tv?tmdb=${tvId}&season=${seasonNumber}&episode=${episodeNumber}&autoplay=1`
      : `https://multiembed.mov/?video_id=${tvId}&tmdb=1&season=${seasonNumber}&episode=${episodeNumber}`;
  }, [tvId, seasonNumber, episodeNumber, server])

  return (
    <div className="relative w-full min-h-screen bg-black text-white flex flex-col items-center">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-5 left-5 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white"
        aria-label="Back"
      >
        ←
      </button>
      <div className="w-full max-w-5xl aspect-video relative mt-10">
        {movieUrl && (
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
            allow='autoplay; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
            src={movieUrl}
          />
        )}
      </div>
      <div className="w-full max-w-5xl mt-6 flex flex-col items-center">
        <span className="text-xs text-white/80 mb-2 text-center">If the current server is not working, please try switching to other servers.</span>
        <div className="flex gap-3 flex-wrap justify-center mb-6">
          <button
            className={`px-6 py-2 rounded bg-red-600 text-white font-semibold flex items-center gap-2 ${server === 1 ? '' : 'opacity-70'}`}
            onClick={() => setServer(1)}
          ><span>💾</span> Server 1</button>
          <button
            className={`px-6 py-2 rounded bg-gray-700 text-white font-semibold flex items-center gap-2 ${server === 2 ? '' : 'opacity-70'}`}
            onClick={() => setServer(2)}
          ><span>💾</span> Server 2</button>
        </div>
        <div className="w-full flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-semibold"><span className="mr-2">☰</span>Season</span>
            <select
              className="bg-neutral-800 border border-neutral-700 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
              value={seasonNumber}
              onChange={(e)=> setSeasonNumber(Number(e.target.value))}
            >
              {seasons.map(s => (
                <option key={s.season_number} value={s.season_number}>{s.name || `Season ${s.season_number}`}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-4xl">
            {episodes.map(ep => (
              <button
                key={ep.episode_number}
                className={`px-4 py-3 rounded-lg bg-neutral-800 text-white font-semibold text-left transition-all border border-neutral-700 hover:bg-purple-700/80 focus:bg-purple-700/80 ${ep.episode_number === episodeNumber ? 'bg-neutral-900 border-purple-600' : ''}`}
                onClick={() => setEpisodeNumber(ep.episode_number)}
              >{`EP ${ep.episode_number}: ${ep.name}`}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TvPlayer



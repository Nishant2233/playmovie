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
    <div className="relative w-full min-h-screen bg-gradient-to-b from-[#050505] via-[#0b0b0b] to-black text-white flex flex-col items-center pb-10">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.14)_0,_rgba(0,0,0,0)_45%)]" />

      <header className="w-full max-w-6xl flex items-center justify-between px-4 md:px-6 pt-6 relative z-20">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur"
          aria-label="Back"
        >
          ←
        </button>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-wide">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Streaming</span>
        </div>
      </header>

      <div className="w-full max-w-6xl px-4 md:px-6 mt-6 relative z-10">
        <div
          className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black"
        >
          {movieUrl && (
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              allow='autoplay; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
              src={movieUrl}
            />
          )}

        </div>

        <div className="mt-5 w-full flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <div className="px-3 py-1 rounded-full bg-white/10 text-xs border border-white/10">TV • S{seasonNumber}E{episodeNumber}</div>
            </div>
            <span className="text-xs text-white/70 text-center sm:text-left">Tap a server if playback fails.</span>
            <div className="flex flex-wrap justify-center sm:justify-end gap-3">
              <button
                className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition ${
                  server === 1
                    ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30'
                    : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                }`}
                onClick={() => setServer(1)}
              >Server 1</button>
              <button
                className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition ${
                  server === 2
                    ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30'
                    : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                }`}
                onClick={() => setServer(2)}
              >Server 2</button>
            </div>
          </div>

          <div className="w-full flex flex-col items-center bg-white/5 rounded-2xl border border-white/10 p-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-lg font-semibold"><span className="mr-2">☰</span>Season</span>
              <select
                className="bg-neutral-900 border border-white/10 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                value={seasonNumber}
                onChange={(e)=> setSeasonNumber(Number(e.target.value))}
              >
                {seasons.map(s => (
                  <option key={s.season_number} value={s.season_number}>{s.name || `Season ${s.season_number}`}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full">
              {episodes.map(ep => (
                <button
                  key={ep.episode_number}
                  className={`px-4 py-3 rounded-xl bg-neutral-900 text-white font-semibold text-left transition-all border border-white/10 hover:bg-purple-700/70 focus:bg-purple-700/70 ${
                    ep.episode_number === episodeNumber ? 'border-purple-500 shadow-lg shadow-purple-600/20' : ''
                  }`}
                  onClick={() => setEpisodeNumber(ep.episode_number)}
                >{`EP ${ep.episode_number}: ${ep.name}`}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TvPlayer



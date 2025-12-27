
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useWatchProgress } from '../contex/watchProgress.context'
import apiClient from '../services/api-client'

const Player = () => {
    const {playerId}=useParams();
    const navigate = useNavigate();
    const [server, setServer] = useState(1);
    const { updateProgress, getProgress } = useWatchProgress()
    const [movieData, setMovieData] = useState<any>(null)
    
    const movieUrl = server === 1
        ? `https://vidsrc-embed.ru/embed/movie/${playerId}`
        : `https://multiembed.mov/?video_id=${playerId}&tmdb=1`;

    useEffect(() => {
        if (!playerId) return
        apiClient.get(`/movie/${playerId}`).then(r => setMovieData(r.data)).catch(()=>{})
    }, [playerId])

    // Simulate progress tracking (since we can't access iframe video events)
    useEffect(() => {
        if (!playerId || !movieData) return
        
        // Check if there's existing progress
        const existing = getProgress(Number(playerId), 'movie')
        let currentProgress = existing?.progress || 0
        
        // Simulate progress increase every 10 seconds (in real app, this would come from video player events)
        const interval = setInterval(() => {
            if (currentProgress < 95) {
                currentProgress += 2 // Increase by 2% every 10 seconds
                updateProgress({
                    id: Number(playerId),
                    type: 'movie',
                    title: movieData.title,
                    poster_path: movieData.poster_path || '',
                    backdrop_path: movieData.backdrop_path || '',
                    progress: currentProgress
                })
            }
        }, 10000) // Update every 10 seconds

        return () => clearInterval(interval)
    }, [playerId, movieData, updateProgress, getProgress])

    return (
      <div className="relative flex flex-col items-center w-full min-h-screen bg-gradient-to-b from-[#050505] via-[#0b0b0b] to-black text-white pb-10 overflow-y-auto md:overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(128,90,213,0.15)_0,_rgba(0,0,0,0)_45%)]" />
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
            <span>Now Playing</span>
          </div>
        </header>

        <div className="w-full max-w-6xl px-4 md:px-6 mt-6 relative z-10">
          <style>{`
            /* Player wrapper: on small screens occupy viewport height minus header so controls are visible */
            .player-wrapper { height: calc(100vh - 120px); max-height: calc(100vh - 120px); }
            /* On md+ keep original aspect ratio and allow natural height */
            @media (min-width: 768px) {
              .player-wrapper { height: auto; max-height: none; aspect-ratio: 16/9; }
            }
          `}</style>

          <div
            className="relative w-full player-wrapper rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black"
          >
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              src={movieUrl}
              title="Movie Player"
              frameBorder="0"
              style={{ background: 'black', width: '100%', height: '100%' }}
            />
          </div>

          <div className="mt-5 flex flex-col gap-3 items-center text-center">
            <div className="px-3 py-1 rounded-full bg-white/10 text-xs border border-white/10">Movie</div>
            <span className="text-xs text-white/70">If a server fails, pick another option below.</span>
            <div className="flex flex-wrap justify-center gap-3">
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
        </div>
      </div>
    )
}

export default Player
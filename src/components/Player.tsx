
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'

const Player = () => {
    const {playerId}=useParams();
    const navigate = useNavigate();
    const [server, setServer] = useState(1);
    const movieUrl = server === 1
        ? `https://vidsrc-embed.ru/embed/movie/${playerId}`
        : `https://multiembed.mov/?video_id=${playerId}&tmdb=1`;

    return (
        <div className="relative flex flex-col justify-center items-center w-full min-h-screen bg-black p-0 m-0">
            <button
                onClick={() => navigate(-1)}
                className="absolute top-5 left-5 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white"
                aria-label="Back"
            >
                ←
            </button>
            <div className="w-full max-w-5xl aspect-video relative mt-10">
                <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                    allow='autoplay; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                    src={movieUrl}
                    title="Movie Player"
                    frameBorder="0"
                    style={{ minHeight: '300px', background: 'black' }}
                />
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
            </div>
        </div>
    )
}

export default Player
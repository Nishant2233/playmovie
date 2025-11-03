import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import apiClient from '../services/api-client'

interface MovieDetails {
  title: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  overview: string;
  genres: { id: number; name: string }[];
}

interface Episode {
  episode_number: number;
  name: string;
  overview: string;
  still_path: string;
  air_date: string;
}

interface Season {
  season_number: number;
  name: string;
  episode_count: number;
  poster_path: string;
}

const EnhancedPlayer = () => {
  const { playerId, tvId } = useParams();
  const navigate = useNavigate();
  const isTV = !!tvId;
  const id = tvId || playerId;
  
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentSeason, setCurrentSeason] = useState<number>(1);
  const [currentEpisode, setCurrentEpisode] = useState<number>(1);
  const [selectedServer, setSelectedServer] = useState<string>('server1');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [relatedVideos, setRelatedVideos] = useState<any[]>([]);
  const [viewers, setViewers] = useState<number>(Math.floor(Math.random() * 15000) + 5000);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(5432); // 90:32 in seconds
  
  // Available servers
  const servers = [
    { id: 'server1', name: 'Server 1', quality: '1080p' },
    { id: 'server2', name: 'Server 2', quality: '720p' },
    { id: 'server3', name: 'Server 3', quality: '4K' }
  ];
  
  // Get current server URL
  const getServerUrl = () => {
    if (isTV) {
      return `https://vidsrc-embed.ru/embed/tv?tmdb=${id}&season=${currentSeason}&episode=${currentEpisode}`;
    } else {
      return `https://vidsrc-embed.ru/embed/movie?tmdb=${id}`;
    }
  };
  
  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Fetch details
  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    const endpoint = isTV ? `/tv/${id}` : `/movie/${id}`;
    
    apiClient.get(endpoint)
      .then(response => {
        setDetails(response.data);
        if (isTV && response.data.seasons) {
          const validSeasons = response.data.seasons.filter((s: Season) => s.season_number > 0);
          setSeasons(validSeasons);
          if (validSeasons.length > 0) {
            setCurrentSeason(validSeasons[0].season_number);
          }
        }
        setLoading(false);
        
        // Fetch related videos
        const relatedEndpoint = isTV ? `/tv/${id}/similar` : `/movie/${id}/similar`;
        apiClient.get(relatedEndpoint).then(r => {
          setRelatedVideos(r.data.results.slice(0, 5));
        });
      })
      .catch(error => {
        console.error('Error fetching details:', error);
        setLoading(false);
      });
  }, [id, isTV]);
  
  // Fetch episodes for selected season (TV only)
  useEffect(() => {
    if (!isTV || !id || !currentSeason) return;
    
    apiClient.get(`/tv/${id}/season/${currentSeason}`)
      .then(response => {
        const eps = response.data?.episodes || [];
        setEpisodes(eps);
        if (eps.length > 0) {
          setCurrentEpisode(eps[0].episode_number);
        }
      })
      .catch(error => {
        console.error('Error fetching episodes:', error);
      });
  }, [id, isTV, currentSeason]);
  
  // Simulate progress
  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= duration) return prev;
          return prev + 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isPlaying, duration]);
  
  // Auto-hide controls after 3 seconds
  useEffect(() => {
    if (showControls) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showControls]);

  // Generate fake viewers
  useEffect(() => {
    const timer = setInterval(() => {
      setViewers(prev => {
        const change = Math.floor(Math.random() * 100) - 50;
        return Math.max(5000, prev + change);
      });
    }, 10000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className="flex flex-col lg:flex-row min-h-screen bg-black text-white"
    >
      {/* Left side - Video player */}
      <div className="flex-1 relative">
        {/* Video container */}
        <div 
          className="relative w-full aspect-video bg-black"
          onMouseMove={() => setShowControls(true)}
          onTouchStart={() => setShowControls(true)}
        >
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : (
            <>
              {/* Video iframe */}
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                allow='autoplay; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
                src={`${getServerUrl()}${isPlaying ? '&autoplay=1' : '&autoplay=0'}`}
              />
              
              {/* Overlay controls */}
              <div className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                {/* Top bar */}
                <div className="bg-gradient-to-b from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                      </button>
                      <div>
                        <h1 className="text-xl font-bold">{details?.title || 'Loading...'}</h1>
                        {isTV && (
                          <p className="text-sm text-white/70">
                            Season {currentSeason} • Episode {currentEpisode}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-purple-600 rounded-md px-2 py-1 text-xs font-medium flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-white mr-1"></span>
                        LIVE
                      </div>
                      <div className="text-sm">{viewers.toLocaleString()} viewers</div>
                    </div>
                  </div>
                </div>
                
                {/* Bottom bar */}
                <div className="bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="space-y-3">
                    {/* Progress bar */}
                    <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-600" 
                        style={{ width: `${(progress / duration) * 100}%` }}
                      ></div>
                    </div>
                    
                    {/* Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center"
                        >
                          {isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <rect x="6" y="4" width="4" height="16" />
                              <rect x="14" y="4" width="4" height="16" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <polygon points="5,3 19,12 5,21" />
                            </svg>
                          )}
                        </button>
                        <span className="text-sm">
                          {formatTime(progress)} / {formatTime(duration)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                          </svg>
                        </button>
                        <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Video info section */}
        <div className="p-6 space-y-6">
          {/* Title and actions */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{details?.title}</h1>
              <div className="flex items-center gap-3 text-sm text-white/70 mt-1">
                {details?.release_date?.substring(0, 4) && (
                  <span>{details.release_date.substring(0, 4)}</span>
                )}
                {details?.runtime && (
                  <span>• {details.runtime} min</span>
                )}
                {details?.vote_average && (
                  <span>• IMDb {details.vote_average.toFixed(1)}</span>
                )}
                {details?.genres && (
                  <span>• {details.genres.map(g => g.name).join(', ')}</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-full px-4 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span>Like</span>
              </button>
              <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-full px-4 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  <polyline points="16 6 12 2 8 6"></polyline>
                  <line x1="12" y1="2" x2="12" y2="15"></line>
                </svg>
                <span>Share</span>
              </button>
            </div>
          </div>
          
          {/* Description */}
          <div>
            <p className="text-white/80 leading-relaxed">
              {details?.overview || 'Loading description...'}
            </p>
          </div>
          
          {/* Server selection */}
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-3">Available Servers</h3>
            <div className="flex flex-wrap gap-3">
              {servers.map(server => (
                <button
                  key={server.id}
                  onClick={() => setSelectedServer(server.id)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    selectedServer === server.id 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <span>{server.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-black/30">{server.quality}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Seasons & Episodes */}
      <div className="w-full lg:w-80 xl:w-96 bg-neutral-900 border-l border-white/10">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-medium">
            {isTV ? 'Seasons & Episodes' : 'Related Videos'}
          </h2>
        </div>
        
        {isTV ? (
          <div className="h-[calc(100vh-64px)] overflow-y-auto">
            {/* Season selector */}
            <div className="p-4 border-b border-white/10">
              <select
                className="w-full bg-neutral-800 border border-white/10 rounded p-2 text-sm"
                value={currentSeason}
                onChange={(e) => setCurrentSeason(Number(e.target.value))}
              >
                {seasons.map(season => (
                  <option key={season.season_number} value={season.season_number}>
                    {season.name || `Season ${season.season_number}`} ({season.episode_count} episodes)
                  </option>
                ))}
              </select>
            </div>
            
            {/* Episodes list */}
            <div className="divide-y divide-white/10">
              {episodes.map(episode => (
                <div 
                  key={episode.episode_number}
                  className={`p-4 hover:bg-white/5 cursor-pointer ${currentEpisode === episode.episode_number ? 'bg-white/10' : ''}`}
                  onClick={() => setCurrentEpisode(episode.episode_number)}
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-neutral-800 rounded overflow-hidden flex-shrink-0">
                      {episode.still_path ? (
                        <img 
                          src={`https://image.tmdb.org/t/p/w200${episode.still_path}`} 
                          alt={episode.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/30">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/50">Episode {episode.episode_number}</span>
                        {currentEpisode === episode.episode_number && (
                          <span className="inline-block w-2 h-2 rounded-full bg-purple-600"></span>
                        )}
                      </div>
                      <h3 className="font-medium truncate">{episode.name}</h3>
                      <p className="text-xs text-white/70 truncate">{episode.overview}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-[calc(100vh-64px)] overflow-y-auto">
            {/* Related videos */}
            <div className="divide-y divide-white/10">
              {relatedVideos.map((video, index) => (
                <div 
                  key={video.id}
                  className="p-4 hover:bg-white/5 cursor-pointer"
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-neutral-800 rounded overflow-hidden flex-shrink-0">
                      {video.poster_path ? (
                        <img 
                          src={`https://image.tmdb.org/t/p/w200${video.poster_path}`} 
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/30">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium truncate">{video.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-white/70">
                        <span>{video.release_date?.substring(0, 4) || 'Unknown'}</span>
                        <span>• IMDb {video.vote_average?.toFixed(1) || 'N/A'}</span>
                      </div>
                      <p className="text-xs text-white/70 truncate">{video.overview}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedPlayer;
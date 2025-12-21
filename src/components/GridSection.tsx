import MovieCard from "./MovieCard"
import TvShowCard from "./TvShowCard"

type Props = {
  title: string
  items?: any[]
  kind?: 'movie' | 'tv' | 'mixed'
}

const GridSection = ({ title, items, kind = 'movie' }: Props) => {
  const render = (it: any) => {
    if (kind === 'tv') return <TvShowCard tvShowResult={it} />
    if (kind === 'mixed') return (it.media_type === 'tv' ? <TvShowCard tvShowResult={it} /> : <MovieCard movieResult={it} />)
    return <MovieCard movieResult={it} />
  }
  return (
    <div className="px-5 md:px-10 mb-10">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1 h-6 bg-purple-600" />
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items?.slice(0,12).map((it:any) => (
          <div key={it.id}>{render(it)}</div>
        ))}
      </div>
    </div>
  )
}

export default GridSection





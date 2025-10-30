import { useMemo } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

const Pagination = ({ total = 5 }: { total?: number }) => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const page = Number(params.get('page') || 1)
  const pages = useMemo(() => Array.from({ length: total }, (_, i) => i + 1), [total])

  const go = (p: number) => {
    const next = new URLSearchParams(params)
    next.set('page', String(p))
    navigate({ search: next.toString() })
  }

  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <button onClick={() => go(Math.max(1, page - 1))} aria-label="Prev">›</button>
      {pages.map(p => (
        <button
          key={p}
          onClick={() => go(p)}
          className={`w-9 h-9 rounded-full flex items-center justify-center ${p===page ? 'bg-[var(--accent)] text-white' : 'text-white/90 hover:underline'}`}
        >{p}</button>
      ))}
      <button onClick={() => go(Math.min(total, page + 1))} aria-label="Next">»</button>
    </div>
  )
}

export default Pagination



import { useMemo } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

type Props = {
  total?: number
  page?: number
  onChange?: (page: number) => void
}

const Pagination = ({ total = 5, page: controlledPage, onChange }: Props) => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const page = controlledPage ?? Number(params.get('page') || 1)
  const pages = useMemo(() => {
    const windowSize = 5
    const start = Math.floor((page - 1) / windowSize) * windowSize + 1
    const end = Math.min(total, start + windowSize - 1)
    return Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => start + i)
  }, [total, page])

  const go = (p: number) => {
    if (onChange) {
      onChange(p)
    } else {
      const next = new URLSearchParams(params)
      next.set('page', String(p))
      navigate({ search: next.toString() })
    }
  }

  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <button onClick={() => go(Math.max(1, page - 1))} aria-label="Prev">›</button>
      {pages.map(p => (
        <button
          key={p}
          onClick={() => go(p)}
          className={`w-9 h-9 rounded-full flex items-center justify-center ${p===page ? 'bg-purple-600 text-white' : 'text-white/90 hover:underline'}`}
        >{p}</button>
      ))}
      <button onClick={() => go(Math.min(total, page + 1))} aria-label="Next">»</button>
    </div>
  )
}

export default Pagination



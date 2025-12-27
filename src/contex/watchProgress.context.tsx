import { createContext, useContext, useEffect, useMemo, useState } from "react"

type WatchProgress = {
  id: number
  type: 'movie' | 'tv'
  title?: string
  name?: string
  poster_path: string
  backdrop_path?: string
  progress: number // percentage 0-100
  duration?: number // total duration in seconds (optional)
  lastWatched: number // timestamp
  season?: number // for TV shows
  episode?: number // for TV shows
}

type WatchProgressContextValue = {
  items: WatchProgress[]
  updateProgress: (item: Omit<WatchProgress, 'lastWatched'>) => void
  remove: (id: number, type: 'movie' | 'tv') => void
  getProgress: (id: number, type: 'movie' | 'tv') => WatchProgress | undefined
}

const WatchProgressContext = createContext<WatchProgressContextValue | undefined>(undefined)

export const WatchProgressProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<WatchProgress[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem("watchProgress")
      if (raw) {
        const parsed = JSON.parse(raw)
        // Filter out items older than 30 days
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
        const filtered = parsed.filter((item: WatchProgress) => item.lastWatched > thirtyDaysAgo)
        setItems(filtered)
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("watchProgress", JSON.stringify(items))
    } catch {}
  }, [items])

  const api = useMemo<WatchProgressContextValue>(() => ({
    items: items.sort((a, b) => b.lastWatched - a.lastWatched), // Most recent first
    updateProgress: (item) => {
      setItems(prev => {
        const existing = prev.findIndex(i => i.id === item.id && i.type === item.type)
        const newItem = { ...item, lastWatched: Date.now() }
        if (existing >= 0) {
          const updated = [...prev]
          updated[existing] = newItem
          return updated
        }
        return [...prev, newItem]
      })
    },
    remove: (id, type) => {
      setItems(prev => prev.filter(i => !(i.id === id && i.type === type)))
    },
    getProgress: (id, type) => {
      return items.find(i => i.id === id && i.type === type)
    }
  }), [items])

  return <WatchProgressContext.Provider value={api}>{children}</WatchProgressContext.Provider>
}

export function useWatchProgress() {
  const ctx = useContext(WatchProgressContext)
  if (!ctx) throw new Error("useWatchProgress must be used within WatchProgressProvider")
  return ctx
}


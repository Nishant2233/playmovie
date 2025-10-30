import { createContext, useContext, useEffect, useMemo, useState } from "react"

type Item = {
  id: number
  title?: string
  name?: string
  poster_path: string
  backdrop_path?: string
}

type WatchlistContextValue = {
  items: Item[]
  add: (item: Item) => void
  remove: (id: number) => void
  has: (id: number) => boolean
}

const WatchlistContext = createContext<WatchlistContextValue | undefined>(undefined)

export const WatchlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<Item[]>([])
  useEffect(() => {
    try {
      const raw = localStorage.getItem("watchlist")
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])
  useEffect(() => {
    try { localStorage.setItem("watchlist", JSON.stringify(items)) } catch {}
  }, [items])

  const api = useMemo<WatchlistContextValue>(() => ({
    items,
    add: (item) => setItems(prev => prev.find(i=>i.id===item.id) ? prev : [...prev, item]),
    remove: (id) => setItems(prev => prev.filter(i => i.id !== id)),
    has: (id) => items.some(i => i.id === id)
  }), [items])

  return <WatchlistContext.Provider value={api}>{children}</WatchlistContext.Provider>
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext)
  if (!ctx) throw new Error("useWatchlist must be used within WatchlistProvider")
  return ctx
}



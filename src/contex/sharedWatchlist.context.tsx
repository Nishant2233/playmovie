import { createContext, useContext, useEffect, useMemo, useState } from "react"

type Item = {
  id: number
  title?: string
  name?: string
  poster_path: string
  backdrop_path?: string
}

type SharedWatchlist = {
  id: string
  senderName: string
  items: Item[]
  sharedAt: number
}

type SharedWatchlistContextValue = {
  sharedWatchlists: SharedWatchlist[]
  shareWatchlist: (items: Item[], senderName: string) => string
  addSharedWatchlist: (id: string, senderName: string, items: Item[]) => void
  removeSharedWatchlist: (id: string) => void
  getSharedWatchlist: (id: string) => SharedWatchlist | undefined
}

const SharedWatchlistContext = createContext<SharedWatchlistContextValue | undefined>(undefined)

export const SharedWatchlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [sharedWatchlists, setSharedWatchlists] = useState<SharedWatchlist[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem("shared-watchlists")
      if (raw) {
        const parsed = JSON.parse(raw)
        setSharedWatchlists(parsed)
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("shared-watchlists", JSON.stringify(sharedWatchlists))
    } catch {}
  }, [sharedWatchlists])

  const generateId = () => {
    return Math.random().toString(36).substring(2, 9) + Date.now().toString(36).substring(2, 9)
  }

  const shareWatchlist = (items: Item[], senderName: string): string => {
    const id = generateId()
    const newShared: SharedWatchlist = {
      id,
      senderName,
      items,
      sharedAt: Date.now()
    }
    setSharedWatchlists(prev => [...prev, newShared])
    return id
  }

  const addSharedWatchlist = (id: string, senderName: string, items: Item[]) => {
    // Check if already exists
    if (sharedWatchlists.some(w => w.id === id)) {
      return
    }
    const newShared: SharedWatchlist = {
      id,
      senderName,
      items,
      sharedAt: Date.now()
    }
    setSharedWatchlists(prev => [...prev, newShared])
  }

  const removeSharedWatchlist = (id: string) => {
    setSharedWatchlists(prev => prev.filter(w => w.id !== id))
  }

  const getSharedWatchlist = (id: string): SharedWatchlist | undefined => {
    return sharedWatchlists.find(w => w.id === id)
  }

  const api = useMemo<SharedWatchlistContextValue>(() => ({
    sharedWatchlists,
    shareWatchlist,
    addSharedWatchlist,
    removeSharedWatchlist,
    getSharedWatchlist
  }), [sharedWatchlists])

  return <SharedWatchlistContext.Provider value={api}>{children}</SharedWatchlistContext.Provider>
}

export function useSharedWatchlist() {
  const ctx = useContext(SharedWatchlistContext)
  if (!ctx) throw new Error("useSharedWatchlist must be used within SharedWatchlistProvider")
  return ctx
}


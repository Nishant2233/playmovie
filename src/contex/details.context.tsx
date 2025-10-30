import { createContext, useContext, useMemo, useState } from "react"

type Selected = { id: number; mediaType: 'movie' | 'tv' } | null

type DetailsContextValue = {
  selected: Selected
  open: (id: number, mediaType: 'movie' | 'tv') => void
  close: () => void
}

const DetailsContext = createContext<DetailsContextValue | undefined>(undefined)

export const DetailsProvider = ({ children }: { children: React.ReactNode }) => {
  const [selected, setSelected] = useState<Selected>(null)
  const value = useMemo<DetailsContextValue>(() => ({
    selected,
    open: (id, mediaType) => setSelected({ id, mediaType }),
    close: () => setSelected(null),
  }), [selected])
  return <DetailsContext.Provider value={value}>{children}</DetailsContext.Provider>
}

export const useDetails = () => {
  const ctx = useContext(DetailsContext)
  if (!ctx) throw new Error('useDetails must be used within DetailsProvider')
  return ctx
}




import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

const DEFAULT_GLOW = "rgb(91, 33, 182)"

type HeroAmbienceContextValue = {
  glowColor: string
  setGlowColor: (color: string) => void
}

const HeroAmbienceContext = createContext<HeroAmbienceContextValue | null>(null)

export function HeroAmbienceProvider({ children }: { children: ReactNode }) {
  const [glowColor, setGlowColor] = useState(DEFAULT_GLOW)
  const value = useMemo(() => ({ glowColor, setGlowColor }), [glowColor])
  return <HeroAmbienceContext.Provider value={value}>{children}</HeroAmbienceContext.Provider>
}

export function useHeroAmbience() {
  const ctx = useContext(HeroAmbienceContext)
  if (!ctx) {
    return { glowColor: DEFAULT_GLOW, setGlowColor: () => {} }
  }
  return ctx
}

export { DEFAULT_GLOW }

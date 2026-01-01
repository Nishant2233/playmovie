import { createContext, useContext, useState, ReactNode } from 'react'

interface PageTransitionContextType {
  isTransitioning: boolean
  startTransition: () => void
  endTransition: () => void
}

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined)

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false)

  const startTransition = () => {
    setIsTransitioning(true)
  }

  const endTransition = () => {
    setIsTransitioning(false)
  }

  return (
    <PageTransitionContext.Provider value={{ isTransitioning, startTransition, endTransition }}>
      {children}
    </PageTransitionContext.Provider>
  )
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext)
  if (context === undefined) {
    throw new Error('usePageTransition must be used within a PageTransitionProvider')
  }
  return context
}


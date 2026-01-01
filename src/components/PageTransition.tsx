import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { usePageTransition } from '../contex/pageTransition.context'

const PageTransition = () => {
  const { isTransitioning, endTransition } = usePageTransition()
  const location = useLocation()
  const [phase, setPhase] = useState<'idle' | 'zoom' | 'reveal'>('idle')
  const isFromWelcome = location.pathname === '/' || location.pathname === '/home'

  useEffect(() => {
    if (isTransitioning) {
      // Phase 1: Zoom animation (0-1500ms)
      setPhase('zoom')
      
      // Phase 2: Immediately end after zoom completes (no black screen delay)
      const revealTimer = setTimeout(() => {
        setPhase('reveal')
        // End transition immediately - no delay
        setPhase('idle')
        endTransition()
      }, 1500)

      return () => {
        clearTimeout(revealTimer)
      }
    } else {
      setPhase('idle')
    }
  }, [isTransitioning, endTransition])

  if (!isTransitioning && phase === 'idle') return null

  return (
    <div 
      className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
    >
      {/* No black overlay - transparent transition */}
    </div>
  )
}

export default PageTransition


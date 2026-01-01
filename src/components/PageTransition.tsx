import { useEffect } from 'react'
import { usePageTransition } from '../contex/pageTransition.context'

const PageTransition = () => {
  const { isTransitioning, endTransition } = usePageTransition()

  useEffect(() => {
    if (isTransitioning) {
      // End transition after zoom animation completes (1500ms)
      const timer = setTimeout(() => {
        endTransition()
      }, 1500)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [isTransitioning, endTransition])

  // Component is empty but needed for transition timing
  return null
}

export default PageTransition


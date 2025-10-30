import { useEffect, useState } from "react"

const VerticalScrollIndicator = ({ targetId }: { targetId: string }) => {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY < 120)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTarget = () => {
    const el = document.getElementById(targetId)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (!visible) return null
  return (
    <button
      aria-label="Scroll down"
      onClick={scrollToTarget}
      className="fixed right-4 bottom-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur z-30 animate-bounce"
    >
      ↓
    </button>
  )
}

export default VerticalScrollIndicator



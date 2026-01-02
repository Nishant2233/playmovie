
import Navbar from "./components/Navbar"
import AllRoutes from "./routes/AllRoutes"
import DetailsModal from "./components/DetailsModal"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { Analytics } from "@vercel/analytics/react"
 



function App() {
  const location = useLocation()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setVisible(false)
    const id = window.requestAnimationFrame(() => setVisible(true))
    return () => window.cancelAnimationFrame(id)
  }, [location.pathname])

  return (
    <>
      <Navbar />
      <div className={`transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <AllRoutes />
      </div>
      <DetailsModal />
      <Analytics />
    </>
  )
}

export default App

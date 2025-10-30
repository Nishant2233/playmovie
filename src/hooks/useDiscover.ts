import { useEffect, useState } from "react"
import apiClient from "../services/api-client"

export default function useDiscover(kind: 'movie' | 'tv' = 'movie', page: number = 1) {
  const [items, setItems] = useState<any[]>()
  useEffect(() => {
    apiClient.get(`/discover/${kind}`, { params: { page } })
      .then(r => setItems(r.data?.results || []))
      .catch(() => {})
  }, [kind, page])
  return { items }
}



import { useState, useEffect } from "react"
import { useWatchlist } from "../contex/watchlist.context"
import { useSharedWatchlist } from "../contex/sharedWatchlist.context"
import MovieCard from "./MovieCard"
import { Share2, Copy, Check, X, Plus, Trash2 } from "lucide-react"
import apiClient from "../services/api-client"

// Helper functions for URL-safe encoding/decoding
// Using a reliable method that works in all environments including production
// Kept for backward compatibility with encoded link format
const encodeWatchlist = (data: any): string => {
  try {
    const jsonString = JSON.stringify(data)
    // Base64url (no % encoding) keeps links much shorter.
    const bytes = new TextEncoder().encode(jsonString)
    const binaryString = Array.from(bytes, (b) => String.fromCharCode(b)).join("")
    const base64 = btoa(binaryString)
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
  } catch (error) {
    console.error("Encoding error:", error)
    throw error
  }
}

const decodeWatchlist = (encoded: string): any => {
  try {
    // Accept both:
    // - current base64url tokens (short)
    // - older encodeURIComponent(base64) tokens (long)
    const maybeDecoded = encoded.includes("%") ? decodeURIComponent(encoded) : encoded
    const base64 =
      maybeDecoded.includes("-") || maybeDecoded.includes("_")
        ? maybeDecoded.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((maybeDecoded.length + 3) % 4)
        : maybeDecoded
    // Decode base64
    let jsonString: string
    try {
      // Modern approach using TextDecoder
      const binaryString = atob(base64)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      const decoder = new TextDecoder('utf-8')
      jsonString = decoder.decode(bytes)
    } catch {
      // Fallback: decode base64, then decode URI component
      const decoded = atob(base64)
      jsonString = decodeURIComponent(decoded)
    }
    return JSON.parse(jsonString)
  } catch (error) {
    console.error("Decoding error:", error)
    throw error
  }
}

type SharedPayloadV3 = {
  v: 3
  id: string
  s: string
  i: number[]
}

const isSharedPayloadV3 = (data: any): data is SharedPayloadV3 => {
  return (
    data &&
    data.v === 3 &&
    typeof data.id === "string" &&
    typeof data.s === "string" &&
    Array.isArray(data.i) &&
    data.i.every((x: any) => typeof x === "number")
  )
}

const fetchMovieItemsByIds = async (ids: number[]) => {
  const unique = Array.from(new Set(ids)).filter(Boolean)
  const results = await Promise.all(
    unique.map(async (movieId) => {
      try {
        const r = await apiClient.get(`/movie/${movieId}`)
        const item = r.data
        if (!item?.id || !item?.poster_path) return null
        return { id: item.id, title: item.title, name: item.name, poster_path: item.poster_path }
      } catch {
        return null
      }
    })
  )
  return results.filter(Boolean) as Array<{ id: number; title?: string; name?: string; poster_path: string }>
}

const Watchlist = () => {
  const { items, remove, add } = useWatchlist()
  const { sharedWatchlists, shareWatchlist, addSharedWatchlist, removeSharedWatchlist } = useSharedWatchlist()
  const [shareId, setShareId] = useState<string>("")
  const [shareLink, setShareLink] = useState<string>("")
  const [inputId, setInputId] = useState<string>("")
  const [senderName, setSenderName] = useState<string>("")
  const [copied, setCopied] = useState<string>("")
  const [showShareModal, setShowShareModal] = useState(false)

  const handleShare = () => {
    if (items.length === 0) {
      alert("Your watchlist is empty!")
      return
    }
    const name = prompt("Enter your name:") || "Anonymous"
    const id = shareWatchlist(items, name)
    // Share link must be self-contained to work across devices/browsers.
    // We encode {id, senderName, items} into the URL so the recipient can import it.
    try {
      // v3: keep payload minimal for shorter links (IDs only)
      const payload: SharedPayloadV3 = { v: 3, id, s: name, i: items.map((x) => x.id) }
      const encoded = encodeWatchlist(payload)
      const shortLink = `${window.location.origin}/watchlist?share=${encoded}`
      setShareId(id)
      setShareLink(shortLink)
      setShowShareModal(true)
    } catch (error) {
      console.error("Error generating share link:", error)
      alert("Error generating share link. Please try again.")
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(""), 2000)
  }

  const handleAddSharedWatchlist = async () => {
    if (!inputId.trim()) {
      alert("Please enter a watchlist ID or link")
      return
    }
    
    try {
      // Extract encoded data from link if it's a full URL
      let encodedData = inputId.trim()
      if (encodedData.includes("share=")) {
        encodedData = encodedData.split("share=")[1].split("&")[0]
      }
      if (encodedData.includes("/")) {
        const parts = encodedData.split("/")
        encodedData = parts[parts.length - 1]
      }

      // Decode URL-encoded data first
      try {
        const watchlistData = decodeWatchlist(encodedData)

        // v3 minimal payload (short links)
        if (isSharedPayloadV3(watchlistData)) {
          const fetched = await fetchMovieItemsByIds(watchlistData.i)
          if (fetched.length === 0) throw new Error("No items found")
          if (sharedWatchlists.some((w) => w.id === watchlistData.id)) {
            alert("This watchlist is already added!")
            return
          }
          addSharedWatchlist(watchlistData.id, watchlistData.s || senderName || "Anonymous", fetched)
          alert(`Successfully added ${watchlistData.s || senderName || "Anonymous"}'s watchlist!`)
          setInputId("")
          setSenderName("")
          return
        }

        // Legacy payload with full items
        if (!watchlistData.id || !watchlistData.items || !Array.isArray(watchlistData.items)) {
          throw new Error("Invalid watchlist data")
        }

        // Check if already exists
        if (sharedWatchlists.some(w => w.id === watchlistData.id)) {
          alert("This watchlist is already added!")
          return
        }

        // Add the shared watchlist
        addSharedWatchlist(
          watchlistData.id,
          watchlistData.senderName || senderName || "Anonymous",
          watchlistData.items
        )

        alert(`Successfully added ${watchlistData.senderName || senderName || "Anonymous"}'s watchlist!`)
        setInputId("")
        setSenderName("")
      } catch (decodeError) {
        // If decoding fails, it's likely an old ID-only link.
        // Without a backend, ID-only links cannot be imported on another device/browser.
        alert("This share link looks like an old format (ID-only) and can't be imported on another device. Ask the sender to re-share using the new link.")
        console.error("Decode error:", decodeError)
      }
    } catch (error) {
      alert("Error adding watchlist. Please check the link or ID and try again.")
      console.error("Error:", error)
    }
  }

  const copyAllToMyList = (sharedItems: any[]) => {
    sharedItems.forEach(item => {
      add(item)
    })
    alert(`Added ${sharedItems.length} item(s) to your watchlist!`)
  }

  // Check for share parameter in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const shareParam = urlParams.get("share")
    if (shareParam) {
      setInputId(shareParam)
      // Auto-import for self-contained (encoded) links
      try {
        const watchlistData = decodeWatchlist(shareParam)

        if (isSharedPayloadV3(watchlistData)) {
          fetchMovieItemsByIds(watchlistData.i).then((fetched) => {
            if (!fetched.length) return
            const exists = sharedWatchlists.some((w) => w.id === watchlistData.id)
            if (!exists) {
              addSharedWatchlist(watchlistData.id, watchlistData.s, fetched)
              window.history.replaceState({}, "", "/watchlist")
            }
          })
          return
        }

        if (watchlistData.items && Array.isArray(watchlistData.items) && watchlistData.senderName) {
          // Check if already exists
          const exists = sharedWatchlists.some(w => w.id === watchlistData.id)
          if (!exists) {
            addSharedWatchlist(
              watchlistData.id,
              watchlistData.senderName,
              watchlistData.items
            )
            // Clean URL
            window.history.replaceState({}, "", "/watchlist")
          }
        }
      } catch (e) {
        // If this is an old ID-only link, it cannot be resolved on another device (no backend).
        // Keep the value in the input so the user can see what they pasted.
        console.log("Could not decode share link (likely old ID-only format).")
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="px-2 md:px-10 mb-10 w-full max-w-full overflow-x-hidden">
      {/* My List Section */}
      <div className="relative -mx-2 md:-mx-10 px-2 md:px-10 pt-8 pb-6 mb-6 overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0f1d]/80 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(147,51,234,0.12)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_transparent_0%,_rgba(0,0,0,0.3)_100%)]" />
        <div className="relative flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold">My List</h2>
          {items.length > 0 && (
            <button
              onClick={handleShare}
              className="px-4 py-2 rounded-lg bg-purple-600/90 hover:bg-purple-600 text-white text-sm font-medium flex items-center gap-2 transition-all"
            >
              <Share2 className="w-4 h-4" />
              Share My List
            </button>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0f1d] border border-sky-500/60 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Share Your Watchlist</h3>
              <button onClick={() => setShowShareModal(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/70 mb-2 block">Share ID:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareId}
                    readOnly
                    className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                  />
                  <button
                    onClick={() => copyToClipboard(shareId, "id")}
                    className="px-4 py-2 rounded-lg bg-sky-600/80 hover:bg-sky-600 text-white"
                  >
                    {copied === "id" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm text-white/70 mb-2 block">Share Link:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(shareLink, "link")}
                    className="px-4 py-2 rounded-lg bg-sky-600/80 hover:bg-sky-600 text-white"
                  >
                    {copied === "link" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* My List Items */}
      {items.length === 0 ? (
        <div className="text-neutral-400">Your watchlist is empty.</div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 md:gap-4 mb-10">
          {items.map(item => (
            <div key={item.id} className="relative group w-full">
              <MovieCard movieResult={item as any} />
              <button onClick={() => remove(item.id)} className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-black/60 hover:bg-black/80">
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Shared Watchlist Section */}
      <div className="mb-10 p-6 rounded-2xl bg-white/5 border border-sky-500/30">
        <h3 className="text-xl font-bold mb-4">Add Friend's Watchlist</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/70 mb-2 block">Sender Name:</label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Enter sender's name"
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40"
            />
          </div>
          <div>
            <label className="text-sm text-white/70 mb-2 block">Watchlist ID or Link:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                placeholder="Enter watchlist ID or share link"
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40"
              />
              <button
                onClick={handleAddSharedWatchlist}
                className="px-4 py-2 rounded-lg bg-purple-600/90 hover:bg-purple-600 text-white font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Shared Watchlists */}
      {sharedWatchlists.length > 0 && (
        <div className="space-y-8">
          {sharedWatchlists.map((shared) => (
            <div key={shared.id}>
              <div className="relative -mx-2 md:-mx-10 px-2 md:px-10 pt-8 pb-6 mb-6 overflow-hidden">
                <div className="absolute inset-0 bg-[#0a0f1d]/80 backdrop-blur-sm" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(147,51,234,0.12)_0%,_transparent_60%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_transparent_0%,_rgba(0,0,0,0.3)_100%)]" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold">{shared.senderName}'s List</h2>
                    <p className="text-sm text-white/60 mt-1">
                      Shared {new Date(shared.sharedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyAllToMyList(shared.items)}
                      className="px-4 py-2 rounded-lg bg-green-600/90 hover:bg-green-600 text-white text-sm font-medium flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy All
                    </button>
                    <button
                      onClick={() => removeSharedWatchlist(shared.id)}
                      className="px-4 py-2 rounded-lg bg-red-600/90 hover:bg-red-600 text-white text-sm font-medium flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
              {shared.items.length === 0 ? (
                <div className="text-neutral-400">This watchlist is empty.</div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 md:gap-4">
                  {shared.items.map(item => (
                    <div key={item.id} className="relative group w-full">
                      <MovieCard movieResult={item as any} />
                      <button
                        onClick={() => add(item)}
                        className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-green-600/80 hover:bg-green-600 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Watchlist



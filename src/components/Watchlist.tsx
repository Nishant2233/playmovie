import { useState, useEffect } from "react"
import { useWatchlist } from "../contex/watchlist.context"
import { useSharedWatchlist } from "../contex/sharedWatchlist.context"
import MovieCard from "./MovieCard"
import { Share2, Copy, Check, X, Plus, Trash2 } from "lucide-react"

// Helper functions for URL-safe encoding/decoding
// Using a reliable method that works in all environments including production
const encodeWatchlist = (data: any): string => {
  try {
    const jsonString = JSON.stringify(data)
    // Convert string to base64 using UTF-8 safe method
    let base64: string
    try {
      // Modern approach using TextEncoder (available in all modern browsers)
      const encoder = new TextEncoder()
      const bytes = encoder.encode(jsonString)
      // Convert Uint8Array to string for btoa (safer method for large arrays)
      const binaryString = Array.from(bytes, byte => String.fromCharCode(byte)).join('')
      base64 = btoa(binaryString)
    } catch {
      // Fallback: encode URI component first, then convert to base64
      const uriEncoded = encodeURIComponent(jsonString)
      base64 = btoa(uriEncoded)
    }
    // URL-encode the base64 string to make it URL-safe
    return encodeURIComponent(base64)
  } catch (error) {
    console.error("Encoding error:", error)
    throw error
  }
}

const decodeWatchlist = (encoded: string): any => {
  try {
    // URL-decode first to get the base64 string
    const base64 = decodeURIComponent(encoded)
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
    // Encode watchlist data in the URL using URL-safe encoding
    try {
      const encodedData = encodeWatchlist({ id, senderName: name, items })
      const link = `${window.location.origin}/watchlist?share=${encodedData}`
      setShareId(id)
      setShareLink(link)
      setShowShareModal(true)
    } catch (error) {
      console.error("Error encoding watchlist:", error)
      alert("Error generating share link. Please try again.")
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(""), 2000)
  }

  const handleAddSharedWatchlist = () => {
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
        
        // Validate the data
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
        // If decoding fails, it might be just an ID (old format)
        // In that case, we need the sender name
        if (!senderName.trim()) {
          alert("Please enter sender name. If you have a share link, use that instead.")
          return
        }
        // Check if we can find it in our own shared watchlists (if we shared it)
        const existing = sharedWatchlists.find(w => w.id === encodedData)
        if (existing) {
          const watchlistData = {
            id: existing.id,
            senderName: senderName || existing.senderName,
            items: existing.items
          }
          
          // Check if already exists
          if (sharedWatchlists.some(w => w.id === watchlistData.id)) {
            alert("This watchlist is already added!")
            return
          }

          addSharedWatchlist(
            watchlistData.id,
            watchlistData.senderName,
            watchlistData.items
          )

          alert(`Successfully added ${watchlistData.senderName}'s watchlist!`)
          setInputId("")
          setSenderName("")
        } else {
          alert("Invalid share link or ID. Please use the full share link provided by the sender.")
          console.error("Decode error:", decodeError)
        }
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
      // Try to auto-add if we can decode it
      try {
        const watchlistData = decodeWatchlist(shareParam)
        
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
        // Not a valid encoded link, just set the input
        console.log("Could not auto-decode share link, user can manually add it")
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="px-5 md:px-10 mb-10">
      {/* My List Section */}
      <div className="relative -mx-5 md:-mx-10 px-5 md:px-10 pt-8 pb-6 mb-6 overflow-hidden">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
          {items.map(item => (
            <div key={item.id} className="relative group">
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
              <div className="relative -mx-5 md:-mx-10 px-5 md:px-10 pt-8 pb-6 mb-6 overflow-hidden">
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {shared.items.map(item => (
                    <div key={item.id} className="relative group">
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



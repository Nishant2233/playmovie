const FALLBACK = "#5b21b6"

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

/** Darken and saturate RGB for ambient hero glow (reference-style shade). */
export function toneForHeroGlow(r: number, g: number, b: number): string {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2 / 255
  let h = 0
  let s = 0
  const d = max - min

  if (d !== 0) {
    s = l > 0.5 ? d / (510 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }

  const outS = clamp(s * 1.35 + 0.12, 0.35, 0.95)
  const outL = clamp(l * 0.42 + 0.08, 0.12, 0.38)

  const hue2rgb = (p: number, q: number, t: number) => {
    let x = t
    if (x < 0) x += 1
    if (x > 1) x -= 1
    if (x < 1 / 6) return p + (q - p) * 6 * x
    if (x < 1 / 2) return q
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6
    return p
  }

  let rr: number
  let gg: number
  let bb: number
  if (outS === 0) {
    rr = gg = bb = outL
  } else {
    const q = outL < 0.5 ? outL * (1 + outS) : outL + outS - outL * outS
    const p = 2 * outL - q
    rr = hue2rgb(p, q, h + 1 / 3)
    gg = hue2rgb(p, q, h)
    bb = hue2rgb(p, q, h - 1 / 3)
  }

  return `rgb(${Math.round(rr * 255)}, ${Math.round(gg * 255)}, ${Math.round(bb * 255)})`
}

export function extractDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.decoding = "async"
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas")
        const size = 48
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext("2d", { willReadFrequently: true })
        if (!ctx) {
          resolve(FALLBACK)
          return
        }
        ctx.drawImage(img, 0, 0, size, size)
        const { data } = ctx.getImageData(0, 0, size, size)
        let r = 0
        let g = 0
        let b = 0
        let count = 0

        for (let i = 0; i < data.length; i += 4 * 3) {
          const alpha = data[i + 3]
          if (alpha < 140) continue
          const pr = data[i]
          const pg = data[i + 1]
          const pb = data[i + 2]
          const brightness = (pr + pg + pb) / 3
          if (brightness > 235 || brightness < 18) continue
          r += pr
          g += pg
          b += pb
          count++
        }

        if (!count) {
          resolve(FALLBACK)
          return
        }
        resolve(toneForHeroGlow(Math.round(r / count), Math.round(g / count), Math.round(b / count)))
      } catch {
        resolve(FALLBACK)
      }
    }
    img.onerror = () => resolve(FALLBACK)
    img.src = imageUrl
  })
}

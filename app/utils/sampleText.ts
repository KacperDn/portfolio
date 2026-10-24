interface SampleOptions {
  text: string
  font: string
  letterSpacing: string
  /** Top-left of the text box, in canvas pixels. */
  origin: { x: number; y: number }
  size: { width: number; height: number }
  count: number
}

/**
 * Renders text to an offscreen canvas and returns `count` random lit pixels
 * as flat x, y pairs, so the points land exactly where the DOM text sits.
 */
export function sampleText({ text, font, letterSpacing, origin, size, count }: SampleOptions): Float32Array {
  const canvas = document.createElement('canvas')
  canvas.width = size.width
  canvas.height = size.height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  ctx.font = font
  ctx.letterSpacing = letterSpacing
  ctx.fillStyle = '#fff'
  ctx.fillText(text, origin.x, origin.y + ctx.measureText(text).fontBoundingBoxAscent)

  const { data, width, height } = ctx.getImageData(0, 0, size.width, size.height)
  const lit: number[] = []
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3]! > 128) lit.push(x, y)
    }
  }

  const total = lit.length / 2
  const picked = Math.min(count, total)
  const out = new Float32Array(picked * 2)
  for (let i = 0; i < picked; i++) {
    const j = i + Math.floor(Math.random() * (total - i))
    const x = lit[j * 2]!
    const y = lit[j * 2 + 1]!
    lit[j * 2] = lit[i * 2]!
    lit[j * 2 + 1] = lit[i * 2 + 1]!
    out[i * 2] = x + Math.random() - 0.5
    out[i * 2 + 1] = y + Math.random() - 0.5
  }
  return out
}

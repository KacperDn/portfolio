<script setup lang="ts">
const canvas = useTemplateRef<HTMLCanvasElement>('canvas')

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))
const LIGHT = normalize([-0.55, 0.45, 0.7])
const RING_TILT = -0.16

function normalize([x, y, z]: number[]) {
  const length = Math.hypot(x!, y!, z!)
  return { x: x! / length, y: y! / length, z: z! / length }
}

function hash(x: number, y: number, z: number) {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453
  return s - Math.floor(s)
}

const smooth = (t: number) => t * t * (3 - 2 * t)
const mix = (a: number, b: number, t: number) => a + (b - a) * t

/** Value noise in 3D, enough to give the surface some texture. */
function noise(x: number, y: number, z: number) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const zi = Math.floor(z)
  const xf = smooth(x - xi)
  const yf = smooth(y - yi)
  const zf = smooth(z - zi)
  const corner = (dx: number, dy: number, dz: number) => hash(xi + dx, yi + dy, zi + dz)
  return mix(
    mix(mix(corner(0, 0, 0), corner(1, 0, 0), xf), mix(corner(0, 1, 0), corner(1, 1, 0), xf), yf),
    mix(mix(corner(0, 0, 1), corner(1, 0, 1), xf), mix(corner(0, 1, 1), corner(1, 1, 1), xf), yf),
    zf
  )
}

/** Dot positions on a sphere (x, y, z) and how bright each dot is. */
function buildSphere(count: number) {
  const points = new Float32Array(count * 3)
  const tone = new Float32Array(count)
  const craters = Array.from({ length: 16 }, () => {
    const y = Math.random() * 2 - 1
    const angle = Math.random() * Math.PI * 2
    const ring = Math.sqrt(1 - y * y)
    return { x: ring * Math.cos(angle), y, z: ring * Math.sin(angle), radius: 0.12 + Math.random() * 0.22 }
  })

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const ring = Math.sqrt(1 - y * y)
    const x = Math.cos(GOLDEN_ANGLE * i) * ring
    const z = Math.sin(GOLDEN_ANGLE * i) * ring
    points.set([x, y, z], i * 3)

    let value = (0.55 + 0.45 * noise(x * 2.2, y * 2.2, z * 2.2)) * (0.65 + 0.35 * noise(x * 7, y * 7, z * 7))
    for (const crater of craters) {
      const distance = Math.acos(Math.min(1, x * crater.x + y * crater.y + z * crater.z)) / crater.radius
      if (distance < 1) value *= 0.45 + 0.55 * distance * distance
      else if (distance < 1.25) value *= 1.25
    }
    tone[i] = Math.min(1, value)
  }
  return { points, tone }
}

onMounted(() => {
  const el = canvas.value
  const ctx = el?.getContext('2d')
  if (!el || !ctx) return

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const { points, tone } = buildSphere(window.innerWidth < 640 ? 2200 : 4600)
  const count = tone.length

  let ratio = 1
  let yaw = 0
  let orbit = 0
  let pointerX = 0
  let pointerY = 0
  let offsetX = 0
  let offsetY = 0
  let running = false
  let frame = 0
  let last = 0

  const draw = () => {
    const width = el.width
    const height = el.height
    const radius = Math.min(height * 0.36, width * 0.26)
    const centerX = width / 2
    const centerY = height / 2
    const ringX = Math.min(width * 0.47, radius * 3.4)
    const ringY = radius * 0.4
    const sinYaw = Math.sin(yaw + offsetX)
    const cosYaw = Math.cos(yaw + offsetX)
    const tilt = -0.25 + offsetY
    const sinTilt = Math.sin(tilt)
    const cosTilt = Math.cos(tilt)

    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#7ff3e9'
    for (let i = 0; i < count; i++) {
      const x = points[i * 3]!
      const y = points[i * 3 + 1]!
      const z = points[i * 3 + 2]!
      const rotatedX = x * cosYaw + z * sinYaw
      const rotatedZ = -x * sinYaw + z * cosYaw
      const rotatedY = y * cosTilt - rotatedZ * sinTilt
      const depth = y * sinTilt + rotatedZ * cosTilt
      if (depth < -0.05) continue

      const lit = Math.max(0, rotatedX * LIGHT.x + rotatedY * LIGHT.y + depth * LIGHT.z)
      const alpha = (0.1 + lit * 1.0) * (0.45 + 0.55 * tone[i]!) * (depth > 0 ? 1 : 0.4)
      if (alpha < 0.03) continue

      const dot = (1.1 + lit * 1.3) * ratio
      ctx.globalAlpha = alpha
      ctx.fillRect(centerX + rotatedX * radius - dot / 2, centerY - rotatedY * radius - dot / 2, dot, dot)
    }

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(RING_TILT)
    ctx.globalAlpha = 0.32
    ctx.strokeStyle = '#7ff3e9'
    ctx.lineWidth = ratio
    ctx.setLineDash([4 * ratio, 7 * ratio])
    ctx.beginPath()
    ctx.ellipse(0, 0, ringX, ringY, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.globalAlpha = 1
    ctx.shadowColor = '#2ee6d6'
    ctx.shadowBlur = 14 * ratio
    ctx.fillStyle = '#e6fffc'
    ctx.fillRect(Math.cos(orbit) * ringX - 2 * ratio, Math.sin(orbit) * ringY - 2 * ratio, 4 * ratio, 4 * ratio)
    ctx.restore()
    ctx.globalAlpha = 1
  }

  const tick = (time: number) => {
    const delta = Math.min(time - last, 50)
    last = time
    yaw += delta * 0.00018
    orbit += delta * 0.0005
    offsetX += (pointerX - offsetX) * 0.05
    offsetY += (pointerY - offsetY) * 0.05
    draw()
    frame = running ? requestAnimationFrame(tick) : 0
  }

  const start = () => {
    if (still || running) return
    running = true
    last = performance.now()
    frame = requestAnimationFrame(tick)
  }
  const stop = () => {
    running = false
    cancelAnimationFrame(frame)
  }

  const resize = () => {
    ratio = Math.min(window.devicePixelRatio || 1, 2)
    el.width = Math.round(el.clientWidth * ratio)
    el.height = Math.round(el.clientHeight * ratio)
    draw()
  }

  const onPointerMove = (event: PointerEvent) => {
    pointerX = (event.clientX / window.innerWidth - 0.5) * 0.9
    pointerY = (event.clientY / window.innerHeight - 0.5) * 0.5
  }

  const sizeObserver = new ResizeObserver(resize)
  const viewObserver = new IntersectionObserver(([entry]) => (entry?.isIntersecting ? start() : stop()))
  sizeObserver.observe(el)
  viewObserver.observe(el)
  if (!still) window.addEventListener('pointermove', onPointerMove, { passive: true })

  onBeforeUnmount(() => {
    stop()
    sizeObserver.disconnect()
    viewObserver.disconnect()
    window.removeEventListener('pointermove', onPointerMove)
  })
})
</script>

<template>
  <canvas ref="canvas" class="orb" />
</template>

<style scoped>
.orb {
  display: block;
  width: 100%;
  height: 100%;
}
</style>

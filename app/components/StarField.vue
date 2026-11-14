<script setup lang="ts">
const canvas = useTemplateRef<HTMLCanvasElement>('canvas')

interface Star {
  x: number
  y: number
  size: number
  alpha: number
  speed: number
  phase: number
}

onMounted(() => {
  const el = canvas.value
  const host = el?.parentElement
  const ctx = el?.getContext('2d')
  if (!el || !host || !ctx) return

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let stars: Star[] = []
  let ratio = 1
  let running = false
  let frame = 0
  let last = 0

  const populate = () => {
    const count = Math.min(Math.round((el.clientWidth * el.clientHeight) / 6500), 260)
    stars = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() < 0.06 ? 1.6 : 0.5 + Math.random() * 0.8,
      alpha: 0.25 + Math.random() * 0.55,
      speed: 0.0004 + Math.random() * 0.0012,
      phase: Math.random() * Math.PI * 2
    }))
  }

  const draw = (time: number) => {
    ctx.clearRect(0, 0, el.width, el.height)
    ctx.fillStyle = '#d9fffb'
    for (const star of stars) {
      const twinkle = still ? 1 : 0.65 + 0.35 * Math.sin(time * star.speed + star.phase)
      ctx.globalAlpha = star.alpha * twinkle
      const size = star.size * ratio
      if (star.size > 1.5) {
        ctx.shadowColor = '#2ee6d6'
        ctx.shadowBlur = 8 * ratio
      } else {
        ctx.shadowBlur = 0
      }
      ctx.fillRect(star.x * el.width - size / 2, star.y * el.height - size / 2, size, size)
    }
    ctx.shadowBlur = 0
    ctx.globalAlpha = 1
  }

  const tick = (time: number) => {
    if (time - last > 40) {
      last = time
      draw(time)
    }
    frame = running ? requestAnimationFrame(tick) : 0
  }

  const start = () => {
    if (still || running) return
    running = true
    frame = requestAnimationFrame(tick)
  }
  const stop = () => {
    running = false
    cancelAnimationFrame(frame)
  }

  const resize = () => {
    ratio = Math.min(window.devicePixelRatio || 1, 1.5)
    el.width = Math.round(el.clientWidth * ratio)
    el.height = Math.round(el.clientHeight * ratio)
    populate()
    draw(performance.now())
  }

  const sizeObserver = new ResizeObserver(resize)
  const viewObserver = new IntersectionObserver(([entry]) => (entry?.isIntersecting ? start() : stop()))
  sizeObserver.observe(host)
  viewObserver.observe(host)

  onBeforeUnmount(() => {
    stop()
    sizeObserver.disconnect()
    viewObserver.disconnect()
  })
})
</script>

<template>
  <canvas ref="canvas" class="stars" aria-hidden="true" />
</template>

<style scoped>
.stars {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>

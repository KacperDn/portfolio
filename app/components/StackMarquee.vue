<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const words = ['Symfony', 'Vue', 'TypeScript', 'JavaScript', 'PHP', 'Java', 'SQL', 'PostgreSQL', 'WordPress']
const BASE_SPEED = 70
const MAX_THROW = 3000

const root = useTemplateRef<HTMLElement>('root')
const track = useTemplateRef<HTMLElement>('track')
let mm: gsap.MatchMedia | undefined

/**
 * Sets up the strip. It always follows the pointer when dragged; with
 * `drift` it also scrolls on its own, speeds up with page scroll and keeps
 * the momentum of a throw.
 */
function setup(drift: boolean) {
  const strip = root.value
  const el = track.value
  const group = el?.firstElementChild as HTMLElement | null
  if (!strip || !el || !group) return

  let x = 0
  let width = group.offsetWidth
  let direction = 1
  let heading = 1
  let velocity = 0
  let visible = true
  let dragging = false
  let lastX = 0
  let lastTime = 0
  let thrown = 0
  let inertia = 0

  const render = () => {
    x = gsap.utils.wrap(-width, 0, x)
    el.style.transform = `translate3d(${x}px, 0, 0)`
  }
  const measure = () => (width = group.offsetWidth)

  const onDown = (event: PointerEvent) => {
    dragging = true
    lastX = event.clientX
    lastTime = performance.now()
    thrown = 0
    inertia = 0
    strip.setPointerCapture(event.pointerId)
    strip.classList.add('is-dragging')
  }
  const onMove = (event: PointerEvent) => {
    if (!dragging) return
    const now = performance.now()
    const dx = event.clientX - lastX
    const seconds = (now - lastTime) / 1000
    if (seconds > 0) thrown = gsap.utils.interpolate(thrown, dx / seconds, 0.4)
    x += dx
    lastX = event.clientX
    lastTime = now
    render()
  }
  const onUp = () => {
    if (!dragging) return
    dragging = false
    inertia = drift ? gsap.utils.clamp(-MAX_THROW, MAX_THROW, thrown) : 0
    strip.classList.remove('is-dragging')
  }

  strip.addEventListener('pointerdown', onDown)
  strip.addEventListener('pointermove', onMove)
  strip.addEventListener('pointerup', onUp)
  strip.addEventListener('pointercancel', onUp)
  ScrollTrigger.addEventListener('refresh', measure)

  const cleanups = [
    () => strip.removeEventListener('pointerdown', onDown),
    () => strip.removeEventListener('pointermove', onMove),
    () => strip.removeEventListener('pointerup', onUp),
    () => strip.removeEventListener('pointercancel', onUp),
    () => ScrollTrigger.removeEventListener('refresh', measure)
  ]

  if (drift) {
    const page = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        heading = self.direction
        velocity = Math.abs(self.getVelocity())
      }
    })
    const view = ScrollTrigger.create({
      trigger: strip,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => (visible = self.isActive)
    })

    const tick = (_time: number, delta: number) => {
      if (!visible || dragging) return
      direction += (heading - direction) * 0.08
      velocity *= 0.92
      inertia *= Math.pow(0.94, delta / 16.7)
      x += (-(BASE_SPEED + velocity * 0.12) * direction + inertia) * (delta / 1000)
      render()
    }
    gsap.ticker.add(tick)
    cleanups.push(() => gsap.ticker.remove(tick), () => page.kill(), () => view.kill())
  }

  return () => cleanups.forEach((cleanup) => cleanup())
}

onMounted(() => {
  mm = gsap.matchMedia()
  mm.add(
    { motion: '(prefers-reduced-motion: no-preference)', still: '(prefers-reduced-motion: reduce)' },
    (context) => setup(Boolean(context.conditions?.motion))
  )
})

onBeforeUnmount(() => mm?.revert())
</script>

<template>
  <div ref="root" class="marquee" aria-hidden="true">
    <div ref="track" class="marquee__track">
      <div v-for="copy in 2" :key="copy" class="marquee__group">
        <template v-for="word in words" :key="word">
          <span class="marquee__word" :data-word="word" />
          <span class="marquee__sep">/</span>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  overflow: hidden;
  border-top: 1px solid var(--line);
  padding: 0.4rem 0 0.2rem;
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 5.5rem);
  font-weight: 800;
  line-height: 1;
  text-transform: uppercase;
  cursor: grab;
  touch-action: pan-y;
  user-select: none;
}

.marquee.is-dragging {
  cursor: grabbing;
}

.marquee__track {
  display: flex;
  width: max-content;
  will-change: transform;
}

.marquee__group {
  display: flex;
  flex-shrink: 0;
}

.marquee__word::before {
  content: attr(data-word);
}

.marquee__word {
  padding: 0 0.25em;
  color: var(--line);
}

.marquee__sep {
  color: var(--accent);
}
</style>

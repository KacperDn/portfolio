import type { Ref } from 'vue'
import { gsap } from 'gsap'

interface HeroRefs {
  hero: Ref<HTMLElement | null>
  mask: Ref<HTMLElement | null>
  subline: Ref<HTMLElement | null>
}

const MAX_WEIGHT = 800
const MIN_WEIGHT = 200

/**
 * Hero choreography: letters rise out of a mask while their weight fills in,
 * then the cursor thins the letters near it and scrolling thins and lifts
 * them one after another. Skipped under reduced motion.
 */
export function useHeroMotion({ hero, mask, subline }: HeroRefs) {
  let mm: gsap.MatchMedia | undefined

  onMounted(() => {
    mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', (context) => {
      const host = hero.value
      const strip = mask.value
      if (!host || !strip) return

      const chars = gsap.utils.toArray<HTMLElement>('.hero__char', strip)
      const glyphs = gsap.utils.toArray<HTMLElement>('.hero__glyph', strip)
      const weights = chars.map(() => MAX_WEIGHT)
      const applied = chars.map(() => MAX_WEIGHT)
      let centers: [number, number][] = []
      let reach = 0
      let pointer: { x: number; y: number } | null = null
      let settled = false
      let visible = true
      let leave = 0

      const measure = () => {
        reach = parseFloat(getComputedStyle(strip).fontSize) * 0.9
        centers = chars.map((char) => [char.offsetLeft + char.offsetWidth / 2, char.offsetTop + char.offsetHeight / 2])
      }

      const tick = () => {
        if (!settled || !visible) return
        const dt = Math.min(gsap.ticker.deltaRatio(60), 2)
        const base = gsap.utils.interpolate(MAX_WEIGHT, MIN_WEIGHT, leave)
        chars.forEach((char, i) => {
          let target = base
          if (pointer) {
            const [cx, cy] = centers[i]!
            const strength = Math.max(0, 1 - Math.hypot(pointer.x - cx, pointer.y - cy) / reach)
            target = Math.max(MIN_WEIGHT, base - (MAX_WEIGHT - MIN_WEIGHT) * strength * strength)
          }
          weights[i] = weights[i]! + (target - weights[i]!) * Math.min(0.16 * dt, 1)
          const rounded = Math.round(weights[i]!)
          if (rounded !== applied[i]) {
            applied[i] = rounded
            char.style.fontWeight = String(rounded)
          }
        })
      }

      const onMove = (event: PointerEvent) => {
        const box = strip.getBoundingClientRect()
        pointer = { x: event.clientX - box.left, y: event.clientY - box.top }
      }
      const clearPointer = () => (pointer = null)

      const observer = new ResizeObserver(measure)

      document.fonts.ready.then(() =>
        context.add(() => {
          const size = parseFloat(getComputedStyle(strip).fontSize)
          for (const char of chars) char.style.width = `${char.getBoundingClientRect().width / size}em`
          measure()
          observer.observe(host)

          gsap
            .timeline({ onComplete: () => (settled = true) })
            .fromTo(
              chars,
              { yPercent: 110, opacity: 1, fontWeight: MIN_WEIGHT },
              { yPercent: 0, fontWeight: MAX_WEIGHT, duration: 1.2, ease: 'expo.out', stagger: 0.07 }
            )
            .fromTo(subline.value, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.7')

          gsap.fromTo(
            glyphs,
            { y: 0, opacity: 1 },
            {
              y: (i) => -(50 + i * 36),
              opacity: 0.08,
              ease: 'none',
              scrollTrigger: {
                trigger: host,
                start: 'top top',
                end: 'bottom 20%',
                scrub: true,
                onUpdate: (self) => (leave = self.progress),
                onLeave: () => (visible = false),
                onEnterBack: () => (visible = true)
              }
            }
          )
        })
      )

      gsap.ticker.add(tick)
      window.addEventListener('pointermove', onMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', clearPointer)

      return () => {
        gsap.ticker.remove(tick)
        observer.disconnect()
        window.removeEventListener('pointermove', onMove)
        document.documentElement.removeEventListener('pointerleave', clearPointer)
      }
    })
  })

  onBeforeUnmount(() => mm?.revert())
}

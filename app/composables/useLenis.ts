import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Smooth scroll driven by the GSAP ticker, so Lenis and ScrollTrigger share
 * a single RAF loop. Under reduced motion the browser keeps native scrolling.
 */
export function useLenis() {
  const reduced = useReducedMotion()
  let lenis: Lenis | undefined
  let tick: ((time: number) => void) | undefined

  const start = () => {
    lenis = new Lenis({ autoRaf: false, anchors: true })
    lenis.on('scroll', ScrollTrigger.update)
    tick = (time) => lenis?.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
  }

  const stop = () => {
    if (tick) gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = tick = undefined
  }

  onMounted(() => {
    watch(reduced, (value) => (value ? stop() : start()), { immediate: true })
  })

  onBeforeUnmount(stop)
}

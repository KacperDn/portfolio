import type { Ref } from 'vue'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Turns scroll position into a single scene position `s`: step N is centred
 * in the viewport at s = N, with fractions in between. Steps are the
 * `[data-step]` elements inside `root`, in document order.
 */
export function useScrollScene(root: Ref<HTMLElement | null>, onUpdate: (s: number) => void) {
  const reduced = useReducedMotion()
  let trigger: ScrollTrigger | undefined
  let centers: number[] = []

  const measure = () => {
    const steps = root.value?.querySelectorAll<HTMLElement>('[data-step]') ?? []
    centers = Array.from(steps, (el) => {
      const box = el.getBoundingClientRect()
      return box.top + window.scrollY + box.height / 2
    })
  }

  const compute = () => {
    if (centers.length < 2) return
    const y = window.scrollY + window.innerHeight / 2
    const last = centers.length - 1
    const i = Math.min(Math.max(centers.findLastIndex((center) => center <= y), 0), last - 1)
    onUpdate(i + (y - centers[i]!) / (centers[i + 1]! - centers[i]!))
  }

  const start = () => {
    trigger = ScrollTrigger.create({
      trigger: root.value,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: compute,
      onRefresh: () => {
        measure()
        compute()
      }
    })
  }

  const stop = () => {
    trigger?.kill()
    trigger = undefined
  }

  onMounted(() => {
    watch(reduced, (value) => (value ? stop() : start()), { immediate: true })
  })
  onBeforeUnmount(stop)

  return { reduced }
}

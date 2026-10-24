import { gsap } from 'gsap'

const cssColor = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()

/**
 * Scroll-triggered motion for the whole page, driven by data attributes:
 * `.rule-top` draws its line, `[data-mask]` slides its text out of a mask,
 * `[data-words]` lights up word by word with scroll and `[data-frame]` wipes
 * open once. Nothing runs under reduced motion.
 */
export function useScrollMotion() {
  let mm: gsap.MatchMedia | undefined

  onMounted(() => {
    mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ember = cssColor('--ember')
      const line = cssColor('--line')

      for (const el of gsap.utils.toArray<HTMLElement>('.rule-top')) {
        gsap.fromTo(
          el,
          { '--rule': 0, '--rule-color': ember },
          {
            '--rule': 1,
            '--rule-color': line,
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true }
          }
        )
      }

      for (const el of gsap.utils.toArray<HTMLElement>('[data-mask]')) {
        const mask = document.createElement('span')
        const inner = document.createElement('span')
        mask.className = 'mask'
        inner.className = 'mask__inner'
        inner.append(...el.childNodes)
        mask.append(inner)
        el.append(mask)
        gsap.fromTo(
          inner,
          { yPercent: 110 },
          { yPercent: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }
        )
      }

      for (const el of gsap.utils.toArray<HTMLElement>('[data-words]')) {
        const words = splitWords(el)
        gsap.fromTo(
          words,
          { opacity: 0.2 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.12,
            scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: true }
          }
        )
      }

      for (const el of gsap.utils.toArray<HTMLElement>('[data-frame]')) {
        gsap.fromTo(
          el,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.3,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true }
          }
        )
      }
    })
  })

  onBeforeUnmount(() => mm?.revert())
}

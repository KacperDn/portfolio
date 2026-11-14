/**
 * Fades `[data-reveal]` elements in as they scroll into view. Elements
 * already on screen at load stay put, and nothing is hidden before the
 * script runs.
 */
export function useReveal() {
  let observer: IntersectionObserver | undefined

  onMounted(() => {
    const pending = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]')).filter((el) => {
      const box = el.getBoundingClientRect()
      const onScreen = box.top < window.innerHeight && box.bottom > 0
      if (onScreen) el.classList.add('is-visible')
      return !onScreen
    })

    document.documentElement.classList.add('reveal-ready')
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px' }
    )
    for (const el of pending) observer.observe(el)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    document.documentElement.classList.remove('reveal-ready')
  })
}

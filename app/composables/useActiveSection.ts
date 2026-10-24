import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Tracks which section holds the middle of the viewport, so the header can
 * show where you are on the page.
 */
export function useActiveSection(ids: readonly string[]) {
  const active = ref('')
  const triggers: ScrollTrigger[] = []

  onMounted(() => {
    for (const id of ids) {
      const trigger = document.getElementById(id)
      if (!trigger) continue
      triggers.push(
        ScrollTrigger.create({
          trigger,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => {
            if (self.isActive) active.value = id
            else if (active.value === id) active.value = ''
          }
        })
      )
    }
  })

  onBeforeUnmount(() => triggers.forEach((trigger) => trigger.kill()))

  return active
}

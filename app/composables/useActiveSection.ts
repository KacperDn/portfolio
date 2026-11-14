/**
 * Tracks which section holds the middle of the viewport, so the floating
 * nav can show where you are on the page.
 */
export function useActiveSection(ids: readonly string[]) {
  const active = ref('')
  let observer: IntersectionObserver | undefined

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) active.value = entry.target.id
          else if (active.value === entry.target.id) active.value = ''
        }
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )
    for (const id of ids) {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    }
  })

  onBeforeUnmount(() => observer?.disconnect())

  return active
}

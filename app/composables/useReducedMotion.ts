/**
 * Reactive `prefers-reduced-motion: reduce`. Stays false during SSR and
 * resolves on mount.
 */
export function useReducedMotion() {
  const reduced = ref(false)
  let query: MediaQueryList | undefined

  const sync = (event: MediaQueryListEvent) => {
    reduced.value = event.matches
  }

  onMounted(() => {
    query = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduced.value = query.matches
    query.addEventListener('change', sync)
  })

  onBeforeUnmount(() => query?.removeEventListener('change', sync))

  return reduced
}

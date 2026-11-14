/**
 * Moves the soft highlight inside a `.card` to the pointer, by updating
 * its `--mx` and `--my` custom properties.
 */
export function useSpotlight() {
  const onMove = (event: PointerEvent) => {
    const card = (event.target as Element).closest<HTMLElement>('.card')
    if (!card) return
    const box = card.getBoundingClientRect()
    card.style.setProperty('--mx', `${event.clientX - box.left}px`)
    card.style.setProperty('--my', `${event.clientY - box.top}px`)
  }

  onMounted(() => document.addEventListener('pointermove', onMove, { passive: true }))
  onBeforeUnmount(() => document.removeEventListener('pointermove', onMove))
}

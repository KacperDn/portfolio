/** True on narrow screens and on devices with little CPU or memory. */
export function isLowPower(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number }
  return (
    window.innerWidth < 768 ||
    (nav.hardwareConcurrency ?? 8) <= 4 ||
    (nav.deviceMemory ?? 8) <= 4
  )
}

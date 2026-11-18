<script setup lang="ts">
// "KacperDn" and "Kacper Daniluk" share their letters, so the heading is one row of
// letters in which the extra ones (" ", "a", "iluk") open up and close again while the
// shared ones glide apart. Nothing is blurred or swapped: the name simply grows. It
// runs once shortly after load as a hint, then on hover (mouse) or tap (touch, it goes
// back by itself). Only the handle is exposed to assistive tech. Under reduced motion
// the swap is instant.
const parts = [
  { char: 'K' },
  { char: 'a' },
  { char: 'c' },
  { char: 'p' },
  { char: 'e' },
  { char: 'r' },
  { char: ' ', extra: 0 },
  { char: 'D' },
  { char: 'a', extra: 1 },
  { char: 'n' },
  { char: 'i', extra: 2 },
  { char: 'l', extra: 3 },
  { char: 'u', extra: 4 },
  { char: 'k', extra: 5 }
]
const EXTRAS = 6
const OPEN_MS = 900

const full = ref(false)

let hovering = false
let dead = false
const timers: ReturnType<typeof setTimeout>[] = []
let revert: ReturnType<typeof setTimeout> | undefined

function show(open: boolean) {
  if (!dead) full.value = open
}

function onEnter(event: PointerEvent) {
  if (event.pointerType !== 'mouse') return
  hovering = true
  clearTimeout(revert)
  show(true)
}

function onLeave(event: PointerEvent) {
  if (event.pointerType !== 'mouse') return
  hovering = false
  show(false)
}

function onClick(event: MouseEvent) {
  if ((event as PointerEvent).pointerType === 'mouse') return
  clearTimeout(revert)
  show(true)
  revert = setTimeout(() => show(false), 3600)
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  // the hint: open the full name once, then hand over to hover
  timers.push(setTimeout(() => !hovering && show(true), 1800))
  timers.push(setTimeout(() => !hovering && show(false), 1800 + OPEN_MS + 2400))
})

onBeforeUnmount(() => {
  dead = true
  timers.forEach(clearTimeout)
  clearTimeout(revert)
})
</script>

<template>
  <h1 class="name" :class="{ 'is-full': full }" @pointerenter="onEnter" @pointerleave="onLeave" @click="onClick">
    <span class="sr-only">KacperDn</span>
    <span class="name__row" aria-hidden="true">
      <template v-for="(part, index) in parts" :key="index">
        <span
          v-if="part.extra !== undefined"
          class="name__extra"
          :style="{ '--in': `${part.extra * 55}ms`, '--out': `${(EXTRAS - 1 - part.extra) * 35}ms` }"
        >
          <span>{{ part.char }}</span>
        </span>
        <span v-else>{{ part.char }}</span>
      </template>
    </span>
  </h1>
</template>

<style scoped>
.name__row {
  display: inline-flex;
  justify-content: center;
  white-space: nowrap;
}

/* An extra letter has no width until the full name is shown, so the others make room smoothly. */
.name__extra {
  display: inline-grid;
  grid-template-columns: 0fr;
  opacity: 0;
  transition:
    grid-template-columns 0.7s cubic-bezier(0.3, 0.7, 0.2, 1) var(--out),
    opacity 0.45s ease var(--out);
}

.name__extra > span {
  min-width: 0;
  /* clip the width, not the height of the glyphs */
  margin-block: -0.15em;
  padding-block: 0.15em;
  overflow: hidden;
}

.is-full .name__extra {
  grid-template-columns: 1fr;
  opacity: 1;
  transition-delay: var(--in);
}

@media (prefers-reduced-motion: reduce) {
  .name__extra {
    transition: none;
  }
}
</style>

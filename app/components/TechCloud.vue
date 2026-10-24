<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { tech } from '~/data/tech'

const root = useTemplateRef<HTMLElement>('root')
let mm: gsap.MatchMedia | undefined

onMounted(() => {
  mm = gsap.matchMedia()
  mm.add({ motion: '(prefers-reduced-motion: no-preference)', compact: '(max-width: 63.99rem)' }, (context) => {
    if (!context.conditions?.motion) return
    const compact = Boolean(context.conditions.compact)
    const cloud = root.value
    const hero = cloud?.parentElement
    if (!cloud || !hero) return

    const items = gsap.utils.toArray<HTMLElement>('.tech__item', cloud)
    const floats = items.map((item) => item.querySelector<HTMLElement>('.tech__float')!)
    const tiles = items.map((item) => item.querySelector<HTMLElement>('.tech__tile')!)

    gsap.fromTo(
      floats,
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(1.6)', stagger: 0.09, delay: 0.9 }
    )

    const drift = gsap.timeline()
    floats.forEach((float) => {
      drift.to(
        float,
        {
          y: gsap.utils.random(-26, -14) * (compact ? 0.3 : 1),
          rotation: gsap.utils.random(-5, 5),
          duration: gsap.utils.random(2.6, 4),
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        },
        0
      )
    })

    gsap.to(items, {
      y: (i) => -(80 + i * 30) * (compact ? 0.4 : 1),
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
    })

    ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      onLeave: () => drift.pause(),
      onEnterBack: () => drift.resume()
    })

    const followers = tiles.map((tile, i) => ({
      x: gsap.quickTo(tile, 'x', { duration: 0.9, ease: 'power3' }),
      y: gsap.quickTo(tile, 'y', { duration: 0.9, ease: 'power3' }),
      depth: tech[i]!.depth
    }))
    const onMove = (event: PointerEvent) => {
      const nx = (event.clientX / window.innerWidth - 0.5) * 2
      const ny = (event.clientY / window.innerHeight - 0.5) * 2
      for (const { x, y, depth } of followers) {
        x(nx * 22 * depth)
        y(ny * 22 * depth)
      }
    }
    if (compact) return

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  })
})

onBeforeUnmount(() => mm?.revert())
</script>

<template>
  <ul ref="root" class="tech" aria-label="Technologies I work with">
    <li
      v-for="item in tech"
      :key="item.name"
      class="tech__item"
      :style="{ left: `${item.x}%`, top: `${item.y}%`, '--size': item.size }"
    >
      <span class="tech__float">
        <span class="tech__tile">
          <span class="tech__icon" role="img" :aria-label="item.name" v-html="item.svg" />
          <span class="tech__name" aria-hidden="true">{{ item.name }}</span>
        </span>
      </span>
    </li>
  </ul>
</template>

<style scoped>
.tech {
  position: absolute;
  top: calc(var(--header-height) + 2rem);
  right: var(--gutter);
  bottom: 8rem;
  left: 50%;
  z-index: 1;
  margin: 0;
  padding: 0;
  list-style: none;
  pointer-events: none;
}

.tech__item {
  position: absolute;
  width: calc(var(--size) * 2.4%);
}

.tech__float,
.tech__tile {
  display: block;
}

.tech__tile {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  background: var(--panel);
  border: 1px solid var(--line);
  color: var(--text);
  pointer-events: auto;
  transition:
    border-color 0.25s,
    color 0.25s;
}

.tech__icon {
  display: grid;
  width: 46%;
}

.tech__icon :deep(svg) {
  width: 100%;
  height: auto;
  fill: currentColor;
}

.tech__tile:hover {
  border-color: var(--ember);
  color: var(--ember);
}

.tech__name {
  position: absolute;
  top: calc(100% + 0.4rem);
  left: 0;
  font-family: var(--font-display);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--ember);
  opacity: 0;
  transition: opacity 0.25s;
}

.tech__tile:hover .tech__name {
  opacity: 1;
}

@media (max-width: 63.99rem) {
  .tech {
    top: calc(var(--header-height) + 1.75rem);
    left: var(--gutter);
    right: auto;
    bottom: auto;
    width: min(34rem, calc(100% - 2 * var(--gutter)));
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.75rem;
  }

  .tech__item {
    position: static;
    width: auto;
  }

  .tech__icon {
    width: 50%;
  }

  .tech__name {
    display: none;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .js .tech__float {
    opacity: 0;
  }
}
</style>

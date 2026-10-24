<script setup lang="ts">
const letters = Array.from('KacperDn')

const hero = useTemplateRef<HTMLElement>('hero')
const mask = useTemplateRef<HTMLElement>('mask')

useHeroMotion({ hero, mask })
</script>

<template>
  <section id="top" ref="hero" class="hero" aria-labelledby="hero-title">
    <TechCloud />
    <h1 id="hero-title" class="hero__name" aria-label="KacperDn">
      <span ref="mask" class="hero__mask" aria-hidden="true">
        <span v-for="(letter, i) in letters" :key="i" class="hero__char"><span class="hero__glyph">{{ letter }}</span></span>
      </span>
    </h1>
    <div class="hero__row">
      <p class="hero__subline">
        Fullstack developer. I build backends in Symfony and interfaces in Vue.
      </p>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 88svh;
  padding: var(--header-height) var(--gutter) 0;
}

.hero__name {
  margin: 0 0 clamp(1.5rem, 4vw, 3rem) -0.04em;
  font-size: var(--step-hero);
  font-weight: 800;
  line-height: 0.82;
  letter-spacing: -0.03em;
  pointer-events: none;
}

.hero__mask {
  position: relative;
  display: block;
  overflow: hidden;
  padding: 0.06em 0 0.04em;
  margin: -0.06em 0 -0.04em;
  white-space: nowrap;
}

.hero__char {
  display: inline-block;
  text-align: center;
}

.hero__glyph {
  display: inline-block;
}

.hero__row {
  padding: 1.5rem 0 2rem;
  border-top: 1px solid var(--line);
}

.hero__subline {
  font-size: var(--step-2);
  line-height: 1.3;
  max-width: 32ch;
}

@media (max-width: 63.99rem) {
  .hero {
    min-height: 100svh;
    justify-content: flex-start;
  }

  .hero__name {
    margin-top: auto;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .js .hero__char {
    opacity: 0;
  }
}
</style>

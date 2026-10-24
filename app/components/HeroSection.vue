<script setup lang="ts">
const host = useTemplateRef<HTMLElement>('host')
const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const label = useTemplateRef<HTMLElement>('label')

const { ready } = useParticleField({ host, canvas, label })
</script>

<template>
  <section ref="host" class="hero" aria-labelledby="hero-title">
    <canvas ref="canvas" class="hero__field" aria-hidden="true" />
    <h1 id="hero-title" ref="label" class="hero__name" :class="{ 'hero__name--field': ready }">Kacper</h1>
    <p class="hero__subline">
      Fullstack developer. I build backends in Symfony and interfaces in Vue.
    </p>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 100svh;
  padding: 0 var(--gutter) clamp(3rem, 8vh, 6rem);
}

.hero__field {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.hero__name {
  position: relative;
  font-size: var(--step-hero);
  font-weight: 700;
  letter-spacing: -0.04em;
  margin-left: -0.05em;
}

.hero__name--field {
  color: transparent;
}

.hero__subline {
  position: relative;
  margin-top: 2rem;
  font-size: var(--step-1);
  color: var(--frost-dim);
}
</style>

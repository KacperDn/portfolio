<template>
  <section id="top" class="hero" aria-labelledby="hero-title">
    <h1 id="hero-title" class="hero__name">KacperDn</h1>
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
  font-stretch: 75%;
  line-height: 0.82;
  letter-spacing: -0.02em;
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
</style>

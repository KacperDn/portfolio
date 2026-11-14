<script setup lang="ts">
import { contactLinks } from '~/data/contact'

const github = contactLinks.find((link) => link.label === 'GitHub')
const flanks = [
  { side: 'left', label: 'Backend', items: ['PHP', 'Symfony', 'Java'] },
  { side: 'right', label: 'Frontend', items: ['Vue', 'TypeScript', 'JavaScript'] }
]
</script>

<template>
  <section id="top" class="hero" aria-labelledby="hero-title">
    <StarField />

    <div class="hero__visual" aria-hidden="true">
      <div class="hero__glow" />
      <OrbCanvas />
    </div>

    <div class="hero__copy">
      <h1 id="hero-title" class="hero__name">KacperDn</h1>
      <p class="label hero__role">Fullstack developer</p>
      <p class="hero__bio">I build backends in Symfony and interfaces in Vue.</p>
      <div class="hero__actions">
        <a class="btn btn--solid" href="#contact">Get in touch</a>
        <a v-if="github" class="btn btn--ghost" :href="github.href" target="_blank" rel="noopener noreferrer">
          GitHub<span class="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </div>

    <div class="hero__rest">
      <a class="hero__down" href="#about" aria-label="Scroll down">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </a>
    </div>

    <aside
      v-for="flank in flanks"
      :key="flank.side"
      class="hero__flank"
      :class="`hero__flank--${flank.side}`"
      :aria-label="`${flank.label} technologies`"
    >
      <p class="label">{{ flank.label }}</p>
      <ul>
        <li v-for="name in flank.items" :key="name">{{ name }}</li>
      </ul>
    </aside>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100svh;
  padding: clamp(1rem, 3svh, 2.5rem) var(--gutter) clamp(5.5rem, 13svh, 7.5rem);
  overflow: clip;
  text-align: center;
}

.hero__visual {
  position: relative;
  width: min(100%, 64rem);
  height: min(40svh, 26rem);
}

.hero__glow {
  position: absolute;
  inset: 6% 24%;
  border-radius: 50%;
  background: radial-gradient(ellipse, color-mix(in srgb, var(--accent) 24%, transparent), transparent 68%);
  filter: blur(30px);
}

.hero__copy {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 0.6rem;
}

.hero__name {
  font-size: clamp(2rem, 1.4rem + 2.6vw, 3.25rem);
}

.hero__bio {
  max-width: 34ch;
  margin-top: 0.4rem;
  font-size: 1.125rem;
  color: var(--dim);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1rem;
}

.hero__down {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: color-mix(in srgb, var(--text) 4%, transparent);
  color: var(--dim);
  transition:
    border-color 0.2s,
    color 0.2s;
}

.hero__down:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.hero__down svg {
  width: 1.25rem;
  height: 1.25rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.hero__flank {
  display: none;
}

@media (max-width: 47.99rem) {
  .hero {
    justify-content: flex-start;
    padding-bottom: 4.375rem;
  }

  .hero::before {
    content: '';
    flex: 1 1 0;
  }

  .hero__rest {
    display: grid;
    flex: 1 1 0;
    min-height: 4.5rem;
    place-items: center;
  }
}

@media (max-width: 39.99rem) {
  .hero__visual {
    height: min(32svh, 18rem);
  }
}

@media (min-width: 48rem) {
  .hero__rest {
    display: none;
  }
}

@media (min-width: 64rem) {
  .hero__flank {
    position: absolute;
    bottom: 2rem;
    display: grid;
    gap: 0.6rem;
    color: var(--dim);
    font-size: 0.9375rem;
  }

  .hero__flank ul {
    display: grid;
    gap: 0.3rem;
  }

  .hero__flank--left {
    left: var(--gutter);
    text-align: left;
  }

  .hero__flank--right {
    right: var(--gutter);
    text-align: right;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .hero__visual,
  .hero__copy > *,
  .hero__down,
  .hero__flank {
    animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both;
  }

  .hero__copy > :nth-child(1) {
    animation-delay: 0.15s;
  }

  .hero__copy > :nth-child(2) {
    animation-delay: 0.25s;
  }

  .hero__copy > :nth-child(3) {
    animation-delay: 0.35s;
  }

  .hero__copy > :nth-child(4) {
    animation-delay: 0.45s;
  }

  .hero__down,
  .hero__flank {
    animation-delay: 0.6s;
  }

  .hero__down svg {
    animation: bob 2.4s ease-in-out 1.6s infinite;
  }
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
}

@keyframes bob {
  50% {
    transform: translateY(3px);
  }
}
</style>

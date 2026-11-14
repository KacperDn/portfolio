<script setup lang="ts">
import { contactLinks } from '~/data/contact'

const links = contactLinks.filter((link) => link.href)
</script>

<template>
  <section id="contact" class="section" aria-labelledby="contact-title">
    <div class="container">
      <div class="card contact" data-reveal>
        <h2 id="contact-title">Contact</h2>
        <ul class="contact__links">
          <li v-for="link in links" :key="link.label">
            <a class="btn btn--ghost" :href="link.href" target="_blank" rel="noopener noreferrer">
              <span class="label">{{ link.label }}</span>
              {{ link.text }}<span class="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact {
  display: grid;
  justify-items: center;
  gap: 1rem;
  padding: clamp(2.5rem, 7vw, 5rem) var(--gutter);
  text-align: center;
  background:
    radial-gradient(60% 90% at 50% 120%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 70%),
    var(--card);
}

.contact__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.contact__links .btn {
  gap: 0.75rem;
  white-space: nowrap;
}

@media (max-width: 39.99rem) {
  .contact__links {
    flex-direction: column;
    align-items: stretch;
    width: min(100%, 20rem);
  }

  .contact__links li {
    display: flex;
  }

  .contact__links .btn {
    flex: 1;
    justify-content: space-between;
  }
}
</style>

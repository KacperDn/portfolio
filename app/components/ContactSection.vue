<script setup lang="ts">
import { contactLinks } from '~/data/contact'

const links = contactLinks.filter((link) => link.href)
</script>

<template>
  <section id="contact" class="sheet rule-top" aria-labelledby="contact-title">
    <h2 id="contact-title" class="sheet__label" data-mask>Contact</h2>
    <div class="sheet__body">
      <dl class="contact">
        <div v-for="link in links" :key="link.label" class="contact__row rule-top">
          <dt>{{ link.label }}</dt>
          <dd>
            <a :href="link.href" rel="noopener">{{ link.text }}</a>
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
.contact {
  margin: 0;
}

.contact__row {
  display: grid;
  gap: 0.25rem 2rem;
  padding: 1.25rem 0;
}

.contact__row:last-child {
  border-bottom: 1px solid var(--line);
}

.contact dt {
  font-family: var(--font-display);
  font-size: var(--step--1);
  font-weight: 500;
  color: var(--dim);
}

.contact dd {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--step-4);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  overflow-wrap: anywhere;
}

.contact a {
  background: linear-gradient(var(--accent), var(--accent)) no-repeat left / 0% 100%;
  text-decoration: none;
  transition:
    background-size 0.4s cubic-bezier(0.2, 0.7, 0.2, 1),
    color 0.4s;
}

.contact a:hover,
.contact a:focus-visible {
  background-color: transparent;
  background-size: 100% 100%;
  color: var(--ink);
}

@media (min-width: 48rem) {
  .contact__row {
    grid-template-columns: 8rem 1fr;
    align-items: baseline;
  }
}
</style>

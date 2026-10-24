<script setup lang="ts">
import { contactLinks } from '~/data/contact'
</script>

<template>
  <section id="contact" class="section" aria-labelledby="contact-title">
    <div class="split">
      <div class="split__text">
        <h2 id="contact-title">Contact</h2>
        <p>Email is the quickest way to reach me.</p>
        <dl class="contact">
          <div v-for="link in contactLinks" :key="link.label" class="contact__row">
            <dt>{{ link.label }}</dt>
            <dd>
              <span v-if="link.href === 'TODO'">{{ link.text }}</span>
              <a v-else :href="link.href" rel="noopener">{{ link.text }}</a>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact {
  margin: 2.5rem 0 0;
}

.contact__row {
  display: grid;
  grid-template-columns: 6rem 1fr;
  align-items: baseline;
  padding: 0.75rem 0;
  border-top: 1px solid var(--rule);
}

.contact__row:last-child {
  border-bottom: 1px solid var(--rule);
}

.contact dt {
  font-family: var(--font-display);
  font-size: var(--step--1);
  color: var(--frost-dim);
}

.contact dd {
  margin: 0;
}

.contact a {
  display: inline-block;
  padding: 0.25rem 0;
}
</style>

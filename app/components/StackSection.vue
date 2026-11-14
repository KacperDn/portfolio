<script setup lang="ts">
import { stack } from '~/data/stack'
</script>

<template>
  <section id="stack" class="section" aria-labelledby="stack-title">
    <div class="container">
      <h2 id="stack-title" class="section__title">Stack</h2>
      <dl class="stack">
        <div v-for="group in stack" :key="group.title" class="stack__row" data-reveal>
          <dt>{{ group.title }}</dt>
          <dd>
            <ul class="stack__items">
              <li v-for="item in group.items" :key="item.name">
                <span class="stack__icon" aria-hidden="true" v-html="item.svg" />
                {{ item.name }}
              </li>
            </ul>
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
.stack {
  margin: 0;
}

.stack__row {
  display: grid;
  gap: 0.75rem 2rem;
  padding: 1.5rem 0;
  border-top: 1px solid var(--line);
}

.stack__row:last-child {
  border-bottom: 1px solid var(--line);
}

.stack__row dt {
  font-weight: 600;
}

.stack__row dd {
  margin: 0;
}

.stack__items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 2rem;
}

.stack__items li {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.125rem;
  font-weight: 500;
}

.stack__icon {
  display: grid;
  width: 1.2rem;
  color: var(--accent);
}

.stack__icon :deep(svg) {
  width: 100%;
  height: auto;
  fill: currentColor;
}

@media (min-width: 48rem) {
  .stack__row {
    grid-template-columns: 14rem minmax(0, 1fr);
  }
}
</style>

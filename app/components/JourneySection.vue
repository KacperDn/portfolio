<script setup lang="ts">
import { journeySteps } from '~/data/journey'
</script>

<template>
  <section id="journey" aria-labelledby="journey-title">
    <article v-for="(step, index) in journeySteps" :key="step.id" class="step" data-step>
      <h2 v-if="index === 0" id="journey-title" class="journey__title">One request, end to end</h2>
      <h3>{{ step.title }}</h3>
      <p>{{ step.text }}</p>
      <ul v-if="step.id === 'gate'" class="request">
        <li class="request__line request__line--rejected">
          <span>POST /api/expenses {"amount": "abc"}</span>
          <strong>422</strong>
        </li>
        <li class="request__line">
          <span>POST /api/expenses {"amount": 12.5}</span>
          <strong>201</strong>
        </li>
      </ul>
    </article>
  </section>
</template>

<style scoped>
.journey__title {
  margin-bottom: 3rem;
}

.request {
  display: grid;
  gap: 0.5rem;
  margin: 1.75rem 0 0;
  padding: 0;
  list-style: none;
  font-family: var(--font-display);
  font-size: var(--step--1);
  font-stretch: 85%;
  font-variant-numeric: tabular-nums;
}

.request__line {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding: 0.65rem 0.9rem;
  background: var(--surface);
}

.request__line strong {
  color: var(--signal);
}

.request__line--rejected strong {
  color: var(--breach);
}
</style>

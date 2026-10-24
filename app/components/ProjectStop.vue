<script setup lang="ts">
import type { Project } from '~/data/projects'

defineProps<{ project: Project }>()
</script>

<template>
  <article class="stop rule-top">
    <div class="stop__text">
      <h3 data-mask>{{ project.name }}</h3>
      <p>{{ project.summary }}</p>
      <p v-if="project.detail">{{ project.detail }}</p>
      <ul v-if="project.links.length" class="stop__links">
        <li v-for="link in project.links" :key="link.href">
          <a :href="link.href" target="_blank" rel="noopener noreferrer">
            {{ link.label }}<span class="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      </ul>
    </div>
    <DeviceFrame :address="project.address">
      <ProjectVideo :media="project.media" />
    </DeviceFrame>
  </article>
</template>

<style scoped>
.stop {
  display: grid;
  gap: 1.5rem 2rem;
  padding-top: 1.5rem;
}

.stop h3 {
  margin-bottom: 1rem;
  font-size: var(--step-2);
  letter-spacing: -0.01em;
}

.stop__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  margin: 1.5rem 0 0;
  padding: 0;
  list-style: none;
}


@media (min-width: 60rem) {
  .stop {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr);
    align-items: start;
  }
}
</style>

<script setup lang="ts">
import type { Project } from '~/data/projects'

defineProps<{ project: Project }>()
</script>

<template>
  <article class="stop split">
    <div class="split__text">
      <h3>{{ project.name }}</h3>
      <p>{{ project.summary }}</p>
      <p v-if="project.detail">{{ project.detail }}</p>
      <ul v-if="project.links.length" class="stop__links">
        <li v-for="link in project.links" :key="link.href">
          <a :href="link.href" rel="noopener">{{ link.label }}</a>
        </li>
      </ul>
    </div>
    <DeviceFrame v-if="project.media" :device="project.device" :address="project.links[0]?.label">
      <ProjectVideo :media="project.media" />
    </DeviceFrame>
    <div v-else class="stop__slot">
      <p>Poster and recording go here.</p>
    </div>
  </article>
</template>

<style scoped>
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

.stop__slot {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 46rem;
  aspect-ratio: 16 / 10;
  padding: 2rem;
  border: 1px dashed var(--rule);
  color: var(--frost-dim);
}
</style>

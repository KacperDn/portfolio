<script setup lang="ts">
import type { Project } from '~/data/projects'

defineProps<{ project: Project }>()
</script>

<template>
  <article class="card project" data-reveal>
    <div class="project__shot">
      <img
        :src="project.screenshot.src"
        :alt="project.screenshot.alt"
        width="1280"
        height="800"
        loading="lazy"
        decoding="async"
      />
    </div>
    <div class="project__body">
      <div class="project__title">
        <h3>{{ project.name }}</h3>
        <p class="label">{{ project.address }}</p>
      </div>
      <p class="project__summary">{{ project.summary }}</p>
      <p v-if="project.detail" class="project__detail">{{ project.detail }}</p>
      <ul v-if="project.links.length" class="project__links">
        <li v-for="link in project.links" :key="link.href">
          <a class="btn btn--ghost" :href="link.href" target="_blank" rel="noopener noreferrer">
            {{ link.label }}<span class="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      </ul>
    </div>
  </article>
</template>

<style scoped>
.project {
  display: flex;
  flex-direction: column;
}

.project__shot {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-bottom: 1px solid var(--line);
  background: var(--ink);
}

.project__shot img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project__body {
  display: grid;
  flex: 1;
  align-content: start;
  gap: 0.9rem;
  padding: clamp(1.25rem, 3vw, 1.75rem);
}

.project__title {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.25rem 1rem;
}

.project__title .label {
  letter-spacing: 0.02em;
  text-transform: none;
}

.project__summary {
  color: var(--text);
}

.project__detail {
  color: var(--dim);
}

.project__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.4rem;
}

@media (prefers-reduced-motion: no-preference) {
  .project__shot img {
    transition: transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1);
  }

  .project:hover .project__shot img {
    transform: scale(1.035);
  }
}
</style>

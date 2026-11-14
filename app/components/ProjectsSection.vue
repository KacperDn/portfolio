<script setup lang="ts">
import { projects } from '~/data/projects'
</script>

<template>
  <section id="works" class="section" aria-labelledby="works-title">
    <div class="container">
      <h2 id="works-title" class="section__title">Projects</h2>
      <div class="works">
        <ProjectCard
          v-for="(project, index) in projects"
          :key="project.id"
          :project="project"
          :style="{ '--delay': `${index * 90}ms` }"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.works {
  display: grid;
  gap: 1.25rem;
}

@media (min-width: 56rem) {
  .works {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>

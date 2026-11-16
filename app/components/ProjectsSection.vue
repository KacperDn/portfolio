<script setup lang="ts">
import { projects } from '~/data/projects'
</script>

<template>
  <section id="projects" class="section" aria-labelledby="projects-title">
    <div class="container">
      <h2 id="projects-title" class="section__title">Projects</h2>
      <div class="projects">
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
.projects {
  display: grid;
  gap: 1.25rem;
}

@media (min-width: 56rem) {
  .projects {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>

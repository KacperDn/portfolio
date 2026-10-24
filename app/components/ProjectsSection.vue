<script setup lang="ts">
import { projects } from '~/data/projects'
</script>

<template>
  <section id="projects" class="section" aria-labelledby="projects-title">
    <h2 id="projects-title" class="projects__title">Projects</h2>
    <ProjectStop v-for="project in projects" :key="project.id" class="projects__stop" :project="project" />
  </section>
</template>

<style scoped>
.projects__stop {
  align-items: center;
  margin-top: clamp(4rem, 10vw, 9rem);
}

.projects__title {
  max-width: 30rem;
}
</style>

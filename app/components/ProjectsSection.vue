<script setup lang="ts">
import { projects } from '~/data/projects'
</script>

<template>
  <section id="projects" class="sheet rule-top" aria-labelledby="projects-title">
    <h2 id="projects-title" class="sheet__label" data-mask>Projects</h2>
    <div class="sheet__body projects">
      <ProjectStop v-for="project in projects" :key="project.id" :project="project" />
    </div>
  </section>
</template>

<style scoped>
.projects {
  display: grid;
  gap: clamp(3rem, 7vw, 6rem);
}
</style>

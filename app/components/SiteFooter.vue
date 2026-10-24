<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <p>© {{ year }} Kacper</p>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: var(--section-gap);
  padding: 2rem var(--gutter);
  border-top: 1px solid var(--rule);
  font-size: var(--step--1);
  color: var(--frost-dim);
}
</style>

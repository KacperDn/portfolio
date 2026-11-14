<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer container">
    <p>© {{ year }} KacperDn</p>
    <p>Logos belong to their respective owners.</p>
  </footer>
</template>

<style scoped>
.footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem 2rem;
  padding-top: var(--section-gap);
  padding-bottom: 6.5rem;
  font-size: 0.875rem;
  color: var(--dim);
}
</style>

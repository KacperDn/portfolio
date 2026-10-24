<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
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
  padding: 1.5rem var(--gutter);
  border-top: 1px solid var(--line);
  font-size: var(--step--1);
  color: var(--dim);
}

.footer p + p {
  margin-top: 0;
}
</style>

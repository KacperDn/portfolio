<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <p>© {{ year }} KacperDn</p>
  </footer>
</template>

<style scoped>
.footer {
  padding: 1.5rem var(--gutter);
  border-top: 1px solid var(--line);
  font-size: var(--step--1);
  color: var(--dim);
}
</style>

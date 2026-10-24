<script setup lang="ts">
defineProps<{ address: string }>()
</script>

<template>
  <div class="frame" data-frame>
    <p class="frame__bar">{{ address }}</p>
    <div class="frame__screen">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.frame {
  width: 100%;
  background: var(--panel);
  border: 1px solid var(--line);
}

.frame__bar {
  max-width: none;
  margin: 0;
  padding: 0.55rem 1rem;
  border-bottom: 1px solid var(--line);
  font-family: var(--font-display);
  font-size: 0.8125rem;
  color: var(--dim);
}

.frame__screen {
  overflow: hidden;
  aspect-ratio: 16 / 10;
  background: var(--ink);
}
</style>

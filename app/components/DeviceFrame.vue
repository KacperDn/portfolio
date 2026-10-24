<script setup lang="ts">
defineProps<{ device: 'browser' | 'phone'; address?: string }>()
</script>

<template>
  <div class="frame" :class="`frame--${device}`">
    <p v-if="device === 'browser'" class="frame__bar">{{ address }}</p>
    <div class="frame__screen">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.frame {
  background: var(--surface);
  border: 1px solid var(--rule);
}

.frame--browser {
  width: 100%;
  max-width: 46rem;
  border-radius: 6px;
}

.frame--phone {
  width: min(100%, 17.5rem);
  padding: 0.6rem;
  border-radius: 2rem;
}

.frame__bar {
  max-width: none;
  margin: 0;
  padding: 0.55rem 1rem;
  border-bottom: 1px solid var(--rule);
  font-family: var(--font-display);
  font-size: 0.8125rem;
  color: var(--frost-dim);
}

.frame__screen {
  overflow: hidden;
  background: var(--midnight);
}

.frame--browser .frame__screen {
  aspect-ratio: 16 / 10;
  border-radius: 0 0 5px 5px;
}

.frame--phone .frame__screen {
  aspect-ratio: 9 / 19;
  border-radius: 1.5rem;
}
</style>

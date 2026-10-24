<script setup lang="ts">
const root = useTemplateRef<HTMLElement>('root')
const scene = useTemplateRef<{ update: (s: number) => void }>('scene')

const { reduced } = useScrollScene(root, (s) => scene.value?.update(s))
</script>

<template>
  <div ref="root" class="story">
    <div class="story__text">
      <slot />
    </div>
    <StoryScene ref="scene" class="story__scene" :still="reduced" />
  </div>
</template>

<style scoped>
.story {
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr);
  column-gap: 1rem;
  padding: 0 var(--gutter);
}

.story__scene {
  grid-column: 1;
  grid-row: 1;
  position: sticky;
  top: 0;
  height: 100svh;
}

.story__text {
  grid-column: 2;
  grid-row: 1;
}

@media (min-width: 60rem) {
  .story {
    grid-template-columns: minmax(0, 30rem) minmax(0, 1fr);
    column-gap: clamp(3rem, 6vw, 7rem);
  }

  .story__text {
    grid-column: 1;
  }

  .story__scene {
    grid-column: 2;
  }
}
</style>

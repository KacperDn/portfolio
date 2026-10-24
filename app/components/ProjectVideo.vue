<script setup lang="ts">
import type { ProjectMedia } from '~/data/projects'

defineProps<{ media: ProjectMedia }>()

const video = useTemplateRef<HTMLVideoElement>('video')
const reduced = useReducedMotion()
const loaded = ref(false)
const inView = ref(false)
const observers: IntersectionObserver[] = []

const sync = () => {
  const el = video.value
  if (!el || !loaded.value || reduced.value) return
  if (inView.value) el.play().catch(() => undefined)
  else el.pause()
}

onMounted(() => {
  const el = video.value
  if (!el) return
  const preload = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return
      loaded.value = true
      preload.disconnect()
    },
    { rootMargin: '300px 0px' }
  )
  const playback = new IntersectionObserver(
    ([entry]) => {
      inView.value = entry?.isIntersecting ?? false
    },
    { threshold: 0.4 }
  )
  preload.observe(el)
  playback.observe(el)
  observers.push(preload, playback)
})

onBeforeUnmount(() => observers.forEach((observer) => observer.disconnect()))

watch(loaded, async () => {
  await nextTick()
  video.value?.load()
  sync()
})
watch([inView, reduced], sync)
</script>

<template>
  <video
    ref="video"
    class="video"
    muted
    loop
    playsinline
    preload="none"
    :poster="media.poster"
    :controls="reduced"
    :aria-label="media.description"
  >
    <template v-if="loaded">
      <source :src="media.webm" type="video/webm" />
      <source :src="media.mp4" type="video/mp4" />
    </template>
  </video>
</template>

<style scoped>
.video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: var(--panel);
}
</style>

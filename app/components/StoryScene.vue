<script setup lang="ts">
import { clamp01, ease, lerp, REQUEST_LINE, requestFraction, STEP, wideLayout, railLayout } from '~/utils/storyLayout'
import type { Point, SceneLayout } from '~/utils/storyLayout'

const props = defineProps<{ still: boolean }>()

const box = useTemplateRef<HTMLElement>('box')
const svg = useTemplateRef<SVGSVGElement>('svg')
const wide = ref(true)
const railHeight = ref(800)
const layout = computed<SceneLayout>(() => (wide.value ? wideLayout : railLayout(railHeight.value)))

const FRAGMENTS = 7
const fragmentSpread = Array.from({ length: FRAGMENTS }, (_, k) => (k / (FRAGMENTS - 1) - 0.5) * 2.4)

interface Parts {
  routeLit: SVGPathElement
  dot: SVGCircleElement
  bad: SVGCircleElement
  fragments: SVGCircleElement[]
  posts: SVGRectElement[]
  rejected: SVGTextElement | null
  typed: SVGTextElement | null
  aiLit: SVGPathElement
  aiDot: SVGCircleElement
  wpLit: SVGPathElement
  wpDot: SVGCircleElement
  lit: { el: SVGElement; at: number }[]
}

let parts: Parts | undefined
let lastS = 0

const place = (el: SVGCircleElement, point: Point, opacity: number) => {
  el.setAttribute('cx', String(point.x))
  el.setAttribute('cy', String(point.y))
  el.style.opacity = String(opacity)
}

function bind() {
  const root = svg.value
  if (!root) return
  const one = <T extends Element>(selector: string) => root.querySelector<T>(selector)!
  parts = {
    routeLit: one('[data-part="route-lit"]'),
    dot: one('[data-part="dot"]'),
    bad: one('[data-part="bad"]'),
    fragments: Array.from(root.querySelectorAll('[data-part="fragment"]')),
    posts: Array.from(root.querySelectorAll('[data-part="post"]')),
    rejected: root.querySelector('[data-part="rejected"]'),
    typed: root.querySelector('[data-part="typed"]'),
    aiLit: one('[data-part="ai-lit"]'),
    aiDot: one('[data-part="ai-dot"]'),
    wpLit: one('[data-part="wp-lit"]'),
    wpDot: one('[data-part="wp-dot"]'),
    lit: Array.from(root.querySelectorAll<SVGElement>('[data-lit-at]'), (el) => ({ el, at: Number(el.dataset.litAt) }))
  }
}

/** Draws the scene for scroll position `s`; `still` freezes the rejection on the gate for reduced motion. */
function render(s: number, still = false) {
  if (!parts) return
  lastS = s
  const l = layout.value
  const f = requestFraction(s)

  place(parts.dot, l.pointAt(f), clamp01((s + 0.15) / 0.15))
  parts.routeLit.style.strokeDashoffset = String(l.routeLength * (1 - f))

  const flight = still ? 1 : clamp01((s - 2.45) / 0.55)
  place(
    parts.bad,
    { x: lerp(l.badFrom.x, l.badTo.x, flight), y: lerp(l.badFrom.y, l.badTo.y, flight) },
    still || (s >= 2.45 && s < 3) ? 1 : 0
  )

  const burst = ease(clamp01((s - 3) / 0.35))
  const bounce = Math.atan2(l.badFrom.y - l.badTo.y, l.badFrom.x - l.badTo.x)
  parts.fragments.forEach((fragment, k) => {
    const angle = bounce + fragmentSpread[k]!
    place(
      fragment,
      { x: l.badTo.x + Math.cos(angle) * 34 * burst, y: l.badTo.y + Math.sin(angle) * 34 * burst },
      !still && s >= 3 ? 1 - burst : 0
    )
  })

  const open = ease(clamp01((s - 3.3) / 0.2))
  const flash = still || (s >= 3 && s < 3.35)
  parts.posts.forEach((post, k) => {
    const slide = l.slide[k]!
    const amount = still ? k : open
    post.style.transform = `translate(${slide.x * amount}px, ${slide.y * amount}px)`
    post.classList.toggle('is-breach', flash && (!still || k === 0))
  })
  if (parts.rejected) {
    parts.rejected.style.opacity = String(still ? 1 : clamp01((s - 3) / 0.1) * (1 - 0.45 * clamp01((s - 3.6) / 0.3)))
  }

  if (parts.typed) {
    parts.typed.textContent = REQUEST_LINE.slice(0, Math.round(clamp01((s + 0.6) / 0.5) * REQUEST_LINE.length))
  }

  for (const [name, lit, dot, at] of [
    ['ai', parts.aiLit, parts.aiDot, STEP.ai - 0.4],
    ['wordpress', parts.wpLit, parts.wpDot, STEP.wordpress - 0.4]
  ] as const) {
    const b = l.branches[name]
    const t = ease(clamp01((s - at) / 0.8))
    lit.style.strokeDashoffset = String(b.length * (1 - t))
    place(dot, { x: lerp(b.from.x, b.to.x, t), y: lerp(b.from.y, b.to.y, t) }, t > 0 && t < 1 ? 1 : 0)
  }

  for (const { el, at } of parts.lit) el.classList.toggle('is-lit', s >= at)
}

function renderStill() {
  render(STEP.wordpress + 0.9, true)
}

defineExpose({ update: (s: number) => !props.still && render(s) })

const refresh = async () => {
  await nextTick()
  bind()
  if (props.still) renderStill()
  else render(lastS)
}

watch(layout, refresh, { flush: 'post' })
watch(() => props.still, refresh)

onMounted(() => {
  const query = window.matchMedia('(min-width: 60rem)')
  const syncWide = () => (wide.value = query.matches)
  syncWide()
  const observer = new ResizeObserver(() => (railHeight.value = box.value?.clientHeight ?? railHeight.value))
  if (box.value) observer.observe(box.value)
  query.addEventListener('change', syncWide)
  refresh()
  onBeforeUnmount(() => {
    observer.disconnect()
    query.removeEventListener('change', syncWide)
  })
})
</script>

<template>
  <div ref="box" class="scene" aria-hidden="true">
    <svg
      ref="svg"
      class="scene__svg"
      :class="`scene__svg--${layout.kind}`"
      :viewBox="`0 0 ${layout.width} ${layout.height}`"
      preserveAspectRatio="xMinYMid meet"
    >
      <path class="route" :d="layout.route" />
      <path class="route route--lit" data-part="route-lit" :d="layout.route" :stroke-dasharray="layout.routeLength" />
      <path class="route" :d="`M${layout.badFrom.x} ${layout.badFrom.y}L${layout.badTo.x} ${layout.badTo.y}`" stroke-dasharray="3 5" />

      <path class="route" :d="layout.branches.ai.path" />
      <path class="route route--lit" data-part="ai-lit" :d="layout.branches.ai.path" :stroke-dasharray="layout.branches.ai.length" />
      <path class="route" :d="layout.branches.wordpress.path" />
      <path class="route route--lit" data-part="wp-lit" :d="layout.branches.wordpress.path" :stroke-dasharray="layout.branches.wordpress.length" />

      <g v-for="node in layout.nodes" :key="node.id" class="node" :data-lit-at="node.at">
        <rect v-if="node.kind === 'frame'" class="node__frame" :x="node.x" :y="node.y" :width="node.w" :height="node.h" rx="6" />
        <template v-else-if="node.kind === 'database'">
          <path
            class="node__shape"
            :d="`M${node.x} ${node.y + 14}a80 14 0 0 1 160 0a80 14 0 0 1 -160 0M${node.x} ${node.y + 14}V${node.y + node.h - 14}a80 14 0 0 0 160 0V${node.y + 14}`"
          />
        </template>
        <circle v-else-if="node.kind === 'marker'" class="node__shape" :cx="node.x" :cy="node.y" r="4.5" />
        <template v-else>
          <rect class="node__shape" :x="node.x" :y="node.y" :width="node.w" :height="node.h" rx="4" />
          <line v-if="node.kind === 'browser'" class="node__rule" :x1="node.x" :x2="node.x + node.w" :y1="node.y + 22" :y2="node.y + 22" />
        </template>
        <text
          v-if="node.label"
          class="node__label"
          :x="node.onRoute ? node.x + 18 : node.x + node.w / 2"
          :y="node.kind === 'browser' ? node.y + 62 : node.y + node.h / 2 + (node.kind === 'database' ? 12 : 6)"
          :text-anchor="node.onRoute ? 'start' : 'middle'"
        >
          {{ node.label }}
        </text>
      </g>

      <text v-for="label in layout.labels" :key="label.id" class="label" :data-lit-at="label.at" :x="label.x" :y="label.y" :text-anchor="label.anchor">
        {{ label.text }}
      </text>

      <template v-if="layout.kind === 'wide'">
        <text class="label label--request" data-part="typed" :x="layout.requestAnchor.x" :y="layout.requestAnchor.y" />
        <text class="label label--breach" data-part="rejected" :x="layout.badTo.x - 4" :y="layout.badTo.y - 14" text-anchor="end">422</text>
      </template>

      <rect
        v-for="(post, k) in layout.posts"
        :key="k"
        class="post"
        data-part="post"
        :x="post.x"
        :y="post.y"
        :width="post.w"
        :height="post.h"
      />

      <circle class="dot dot--bad" data-part="bad" r="5" />
      <circle v-for="k in FRAGMENTS" :key="k" class="dot dot--bad" data-part="fragment" r="2.4" />
      <circle class="dot" data-part="dot" r="6" />
      <circle class="dot" data-part="ai-dot" r="4" />
      <circle class="dot" data-part="wp-dot" r="4" />
    </svg>
  </div>
</template>

<style scoped>
.scene {
  width: 100%;
  height: 100%;
}

.scene__svg {
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: var(--font-display);
}

.route {
  fill: none;
  stroke: var(--rule);
  stroke-width: 2;
}

.route--lit {
  stroke: var(--signal);
  stroke-dashoffset: 0;
}

.node__shape,
.node__frame {
  fill: var(--surface);
  stroke: var(--rule);
  stroke-width: 1.5;
}

.node__frame {
  fill: none;
  stroke-dasharray: 4 6;
}

.node__rule {
  stroke: var(--rule);
  stroke-width: 1.5;
}

.node__label {
  fill: var(--frost-dim);
  font-size: 19px;
  font-weight: 600;
}

.label {
  fill: var(--frost-dim);
  font-size: 15px;
  font-weight: 500;
  font-stretch: 85%;
  letter-spacing: 0.01em;
  opacity: 0.45;
}

.label--request {
  fill: var(--frost);
  font-size: 17px;
  opacity: 1;
}

.label--breach {
  fill: var(--breach);
  font-size: 17px;
  font-weight: 700;
  opacity: 0;
}

.node.is-lit .node__shape,
.node.is-lit .node__frame {
  stroke: var(--signal);
}

.node.is-lit .node__label,
.label.is-lit {
  fill: var(--frost);
}

.label.is-lit {
  opacity: 1;
}

.post {
  fill: var(--frost-dim);
}

.post.is-breach {
  fill: var(--breach);
}

.dot {
  fill: var(--signal);
  opacity: 0;
}

.dot--bad {
  fill: var(--breach);
}
</style>

<script setup lang="ts">
// A soft cosmic cloud that fills an empty stretch between two sections. It is drawn once,
// as fractal noise on a small canvas that CSS scales up and blurs, so it costs nothing
// while scrolling. Each `seed` gives a different cloud. `below` hangs it under the seam
// instead of across it, and `ufo` adds a small ship that wanders about in it. Purely
// decorative.
const props = withDefaults(defineProps<{ seed?: number; below?: boolean; ufo?: boolean }>(), {
  seed: 7,
  below: false,
  ufo: false
})

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const ready = ref(false)

const W = 360
const H = 72

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
const mix = (a: number, b: number, t: number) => a + (b - a) * t

onMounted(() => {
  const el = canvas.value
  const ctx = el?.getContext('2d')
  if (!el || !ctx) return

  const random = seeded(props.seed)
  const lattice = Array.from({ length: 256 * 256 }, () => random())
  const cell = (x: number, y: number) => lattice[((y & 255) << 8) | (x & 255)]!

  const noise = (x: number, y: number) => {
    const xi = Math.floor(x)
    const yi = Math.floor(y)
    const xf = x - xi
    const yf = y - yi
    const u = xf * xf * (3 - 2 * xf)
    const v = yf * yf * (3 - 2 * yf)
    return mix(mix(cell(xi, yi), cell(xi + 1, yi), u), mix(cell(xi, yi + 1), cell(xi + 1, yi + 1), u), v)
  }

  const fbm = (x: number, y: number, octaves: number) => {
    let sum = 0
    let amp = 0.5
    let freq = 1
    for (let i = 0; i < octaves; i++) {
      sum += amp * noise(x * freq, y * freq)
      amp *= 0.5
      freq *= 2.03
    }
    return sum / (1 - 0.5 ** octaves)
  }

  el.width = W
  el.height = H
  const image = ctx.createImageData(W, H)

  for (let py = 0; py < H; py++) {
    for (let px = 0; px < W; px++) {
      const u = px / W
      const v = py / H

      // A band whose centre wanders up and down, so the cloud is not a straight stripe.
      const centre = 0.5 + (noise(u * 2.6 + 11, 3) - 0.5) * 0.3
      const band = Math.exp(-(((v - centre) / 0.22) ** 2))

      const body = smoothstep(0.36, 0.78, fbm(u * 4.2 + 3.1, v * 2.6 + 1.7, 5))
      const wisps = smoothstep(0.5, 0.86, fbm(u * 9 + 8, v * 5.5 + 2, 4))
      const edge = smoothstep(0, 0.1, u) * smoothstep(0, 0.1, 1 - u)
      const alpha = Math.min(1, (body * 0.7 + wisps * 0.35) * band) * edge

      // deep teal in the thin parts, aqua where the cloud is dense
      const t = Math.min(1, body * 0.6 + wisps * 0.6) ** 1.4
      const i = (py * W + px) * 4
      image.data[i] = mix(10, 60, t)
      image.data[i + 1] = mix(70, 235, t)
      image.data[i + 2] = mix(72, 220, t)
      image.data[i + 3] = alpha * 150
    }
  }
  ctx.putImageData(image, 0, 0)
  ready.value = true
})
</script>

<template>
  <div class="nebula" :class="{ 'is-below': below }" aria-hidden="true">
    <canvas ref="canvas" class="nebula__canvas" :class="{ 'is-ready': ready }" />
    <div v-if="ufo" class="ufo">
      <svg class="ufo__ship" viewBox="0 0 56 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <path class="ufo__beam" d="M22 24 16 32h24l-6-8Z" fill="currentColor" stroke="none" />
        <path d="M18 14c0-6.5 4.2-10.5 10-10.5S38 7.5 38 14" />
        <ellipse cx="28" cy="16" rx="25" ry="6" fill="var(--ink)" />
        <path d="M10 19.5c4 3 11 4.5 18 4.5s14-1.5 18-4.5" />
        <circle class="ufo__light" cx="15" cy="16.5" r="1.4" fill="currentColor" stroke="none" />
        <circle class="ufo__light" cx="28" cy="18" r="1.4" fill="currentColor" stroke="none" />
        <circle class="ufo__light" cx="41" cy="16.5" r="1.4" fill="currentColor" stroke="none" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
/* Zero height: it takes no room of its own, the canvas hangs half above and half below the seam. */
.nebula {
  --top: -9rem;

  position: relative;
  height: 0;
  overflow-x: clip;
  pointer-events: none;
}

/* The lower clouds sit mostly under the seam, behind the next section, not over the one above. */
.nebula.is-below {
  --top: -2rem;
}

.nebula__canvas {
  position: absolute;
  top: var(--top);
  left: 0;
  width: 100%;
  height: 18rem;
  object-fit: cover;
  opacity: 0;
  filter: blur(6px);
  transition: opacity 1.6s ease;
  -webkit-mask-image: linear-gradient(to bottom, transparent, #000 32%, #000 62%, transparent);
  mask-image: linear-gradient(to bottom, transparent, #000 32%, #000 62%, transparent);
}

.nebula__canvas.is-ready {
  opacity: 0.85;
}

/* The ship stays inside the band the whole time: it glides from point to point and never leaves. */
.ufo {
  position: absolute;
  top: var(--top);
  left: 0;
  color: var(--accent);
  opacity: 0.6;
  transform: translate(62vw, 8rem);
}

.ufo__ship {
  display: block;
  width: 2.6rem;
  height: auto;
  overflow: visible;
}

.ufo__beam {
  opacity: 0.1;
}

@media (prefers-reduced-motion: no-preference) {
  .nebula__canvas.is-ready {
    animation: drift 70s ease-in-out infinite alternate;
  }

  .ufo {
    animation: wander 64s infinite;
  }

  .ufo__ship {
    animation: wobble 1.6s ease-in-out infinite alternate;
  }

  .ufo__light {
    animation: blink 1.2s steps(1, end) infinite;
  }

  .ufo__light:nth-of-type(2) {
    animation-delay: 0.4s;
  }

  .ufo__light:nth-of-type(3) {
    animation-delay: 0.8s;
  }
}

@keyframes drift {
  from {
    transform: translateX(-2.5%) scale(1.06);
  }
  to {
    transform: translateX(2.5%) scale(1.06);
  }
}

/* Waypoints in vw / rem inside the band; each leg eases in and out, so it glides and lingers. */
@keyframes wander {
  0%,
  100% {
    transform: translate(10vw, 7rem);
  }
  12% {
    transform: translate(68vw, 3.5rem);
  }
  25% {
    transform: translate(86vw, 8.5rem);
  }
  38% {
    transform: translate(46vw, 11rem);
  }
  50% {
    transform: translate(18vw, 6rem);
  }
  62% {
    transform: translate(34vw, 2.5rem);
  }
  75% {
    transform: translate(80vw, 6rem);
  }
  88% {
    transform: translate(52vw, 9.5rem);
  }
}

@keyframes wobble {
  from {
    transform: translateY(-4px) rotate(-3deg);
  }
  to {
    transform: translateY(4px) rotate(3deg);
  }
}

@keyframes blink {
  50% {
    opacity: 0.25;
  }
}
</style>

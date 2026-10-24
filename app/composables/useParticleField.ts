import type { Ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface FieldRefs {
  host: Ref<HTMLElement | null>
  canvas: Ref<HTMLCanvasElement | null>
  label: Ref<HTMLElement | null>
}

const COUNTS = {
  full: { text: 15000, dust: 1400, pixelRatio: 2 },
  lite: { text: 5500, dust: 300, pixelRatio: 1 }
}
const SPRING_TEXT = 0.02
const SPRING_DUST = 0.006
const DAMPING = 0.88

const VERTEX = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  attribute float aSeed;
  uniform float uPixelRatio;
  uniform float uTime;
  varying float vAlpha;
  void main() {
    vAlpha = aAlpha;
    vec3 p = position;
    p.xy += 0.6 * vec2(sin(uTime * 0.9 + aSeed * 40.0), cos(uTime * 0.7 + aSeed * 31.0));
    gl_PointSize = aSize * uPixelRatio;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`
const FRAGMENT = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uFade;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    gl_FragColor = vec4(uColor, smoothstep(0.5, 0.3, d) * vAlpha * uFade);
  }
`

/**
 * Draws the hero label as a WebGL point field that shatters on load,
 * settles back into the text, repels from the cursor and scatters on scroll.
 * Falls back to the plain DOM headline under reduced motion or without WebGL.
 */
export function useParticleField({ host, canvas, label }: FieldRefs) {
  const reduced = useReducedMotion()
  const ready = ref(false)
  let dispose: (() => void) | undefined
  let unmounted = false

  const teardown = () => {
    dispose?.()
    dispose = undefined
    ready.value = false
  }

  onMounted(async () => {
    if (reduced.value || !host.value || !canvas.value || !label.value) return
    try {
      const stop = await mountField(host.value, canvas.value, label.value, () => (ready.value = true))
      if (unmounted) stop()
      else dispose = stop
    } catch {
      ready.value = false
    }
  })

  watch(reduced, (value) => value && teardown())
  onBeforeUnmount(() => {
    unmounted = true
    teardown()
  })

  return { ready }
}

async function mountField(
  host: HTMLElement,
  canvas: HTMLCanvasElement,
  label: HTMLElement,
  onReady: () => void
): Promise<() => void> {
  await new Promise<void>((resolve) =>
    'requestIdleCallback' in window ? window.requestIdleCallback(() => resolve(), { timeout: 1500 }) : setTimeout(resolve, 200)
  )
  const [THREE] = await Promise.all([import('three'), document.fonts.ready])

  const preset = isLowPower() ? COUNTS.lite : COUNTS.full
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, preset.pixelRatio))
  const camera = new THREE.OrthographicCamera(0, 1, 0, 1, -1, 1)
  const scene = new THREE.Scene()
  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthTest: false,
    uniforms: {
      uColor: { value: new THREE.Color(0xeceaf4) },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uTime: { value: 0 },
      uFade: { value: 1 }
    }
  })
  const geometry = new THREE.BufferGeometry()
  const points = new THREE.Points(geometry, material)
  points.frustumCulled = false
  scene.add(points)

  let count = 0
  let textCount = 0
  let pos = new Float32Array(0)
  let vel = new Float32Array(0)
  let home = new Float32Array(0)
  let scatter = new Float32Array(0)
  let radius = 100
  let disperse = 0
  let visible = true
  let pointer: { x: number; y: number } | null = null

  const build = (burst: boolean) => {
    const width = host.clientWidth
    const height = host.clientHeight
    renderer.setSize(width, height, false)
    camera.right = width
    camera.bottom = height
    camera.updateProjectionMatrix()
    radius = Math.min(Math.max(width * 0.07, 70), 110)

    const style = getComputedStyle(label)
    const range = document.createRange()
    range.selectNodeContents(label)
    const box = range.getBoundingClientRect()
    const hostBox = host.getBoundingClientRect()
    const origin = { x: box.left - hostBox.left, y: box.top - hostBox.top }
    const sampled = sampleText({
      text: label.textContent ?? '',
      font: `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`,
      letterSpacing: style.letterSpacing,
      origin,
      size: { width, height },
      count: preset.text
    })

    textCount = sampled.length / 2
    count = textCount + preset.dust
    pos = new Float32Array(count * 3)
    vel = new Float32Array(count * 2)
    home = new Float32Array(count * 2)
    scatter = new Float32Array(count * 2)
    const size = new Float32Array(count)
    const alpha = new Float32Array(count)
    const seed = new Float32Array(count)
    const cx = origin.x + box.width / 2
    const cy = origin.y + box.height / 2

    for (let i = 0; i < count; i++) {
      const isText = i < textCount
      const hx = isText ? sampled[i * 2]! : Math.random() * width
      const hy = isText ? sampled[i * 2 + 1]! : Math.random() * height
      home[i * 2] = hx
      home[i * 2 + 1] = hy
      pos[i * 3] = hx
      pos[i * 3 + 1] = hy

      const angle = Math.random() * Math.PI * 2
      const reach = 80 + Math.random() * 420
      scatter[i * 2] = Math.cos(angle) * reach
      scatter[i * 2 + 1] = Math.sin(angle) * reach

      if (burst && isText) {
        const away = Math.atan2(hy - cy, hx - cx) + (Math.random() - 0.5)
        const speed = 6 + Math.random() * 26
        vel[i * 2] = Math.cos(away) * speed
        vel[i * 2 + 1] = Math.sin(away) * speed
      }

      size[i] = isText ? 1.3 + Math.random() * 0.8 : 1 + Math.random() * 0.7
      alpha[i] = isText ? 0.85 + Math.random() * 0.15 : 0.22 + Math.random() * 0.2
      seed[i] = Math.random()
    }

    const position = new THREE.BufferAttribute(pos, 3)
    position.setUsage(THREE.DynamicDrawUsage)
    geometry.setAttribute('position', position)
    geometry.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
    geometry.setAttribute('aAlpha', new THREE.BufferAttribute(alpha, 1))
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
  }

  const step = () => {
    if (!visible) return
    const dt = Math.min(gsap.ticker.deltaRatio(60), 2)
    const damping = Math.pow(DAMPING, dt)
    const radiusSq = radius * radius
    for (let i = 0; i < count; i++) {
      const x = pos[i * 3]!
      const y = pos[i * 3 + 1]!
      const spring = i < textCount ? SPRING_TEXT : SPRING_DUST
      let fx = (home[i * 2]! + scatter[i * 2]! * disperse - x) * spring
      let fy = (home[i * 2 + 1]! + scatter[i * 2 + 1]! * disperse - y) * spring

      if (pointer) {
        const dx = x - pointer.x
        const dy = y - pointer.y
        const distSq = dx * dx + dy * dy
        if (distSq < radiusSq) {
          const dist = Math.sqrt(distSq) || 1
          const push = (1 - dist / radius) ** 2 * 3
          fx += (dx / dist) * push
          fy += (dy / dist) * push
        }
      }

      const vx = (vel[i * 2]! + fx * dt) * damping
      const vy = (vel[i * 2 + 1]! + fy * dt) * damping
      vel[i * 2] = vx
      vel[i * 2 + 1] = vy
      pos[i * 3] = x + vx * dt
      pos[i * 3 + 1] = y + vy * dt
    }
    geometry.attributes.position!.needsUpdate = true
    material.uniforms.uTime!.value = gsap.ticker.time
    material.uniforms.uFade!.value = 1 - disperse
    renderer.render(scene, camera)
  }

  const onPointerMove = (event: PointerEvent) => {
    const box = host.getBoundingClientRect()
    pointer = { x: event.clientX - box.left, y: event.clientY - box.top }
  }
  const clearPointer = () => (pointer = null)

  const trigger = ScrollTrigger.create({
    trigger: host,
    start: 'top top',
    end: 'bottom top',
    onUpdate: (self) => (disperse = Math.min(Math.max((self.progress - 0.1) / 0.7, 0), 1)),
    onLeave: () => (visible = false),
    onEnterBack: () => (visible = true)
  })

  let resizeTimer: number | undefined
  const observer = new ResizeObserver(() => {
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => build(false), 200)
  })

  build(true)
  step()
  onReady()
  gsap.ticker.add(step)
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('pointerup', clearPointer)
  window.addEventListener('pointercancel', clearPointer)
  document.documentElement.addEventListener('pointerleave', clearPointer)
  observer.observe(host)

  return () => {
    gsap.ticker.remove(step)
    trigger.kill()
    observer.disconnect()
    window.clearTimeout(resizeTimer)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', clearPointer)
    window.removeEventListener('pointercancel', clearPointer)
    document.documentElement.removeEventListener('pointerleave', clearPointer)
    geometry.dispose()
    material.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
  }
}

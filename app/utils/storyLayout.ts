export interface Point {
  x: number
  y: number
}

interface Rect extends Point {
  w: number
  h: number
}

export interface SceneNode extends Rect {
  id: string
  kind: 'box' | 'browser' | 'database' | 'marker' | 'frame'
  label?: string
  /** The request passes through the node, so its label sits clear of the centre. */
  onRoute?: boolean
  /** Scroll position (in steps) from which the node counts as reached. */
  at: number
}

export interface SceneLabel extends Point {
  id: string
  text: string
  anchor: 'start' | 'middle'
  at: number
}

export interface SceneLayout {
  kind: 'wide' | 'rail'
  width: number
  height: number
  route: string
  routeLength: number
  pointAt: (fraction: number) => Point
  badFrom: Point
  badTo: Point
  posts: [Rect, Rect]
  slide: [Point, Point]
  branches: Record<'ai' | 'wordpress', { path: string; length: number; from: Point; to: Point }>
  nodes: SceneNode[]
  labels: SceneLabel[]
  requestAnchor: Point
}

/** Order of the left-hand text blocks; the scene follows them. */
export const STEP = {
  about: 0,
  vue: 1,
  rest: 2,
  gate: 3,
  controller: 4,
  service: 5,
  ai: 6,
  dto: 7,
  db: 8,
  wordpress: 9
} as const

export const REQUEST_LINE = 'POST /api/expenses'

const ROUTE_LENGTH = 1085
const distances = { vueOut: 0, rest: 100, gateIn: 198, controller: 648, service: 768, dto: 888, db: ROUTE_LENGTH }

/** Position of the request along the route, as a fraction of its length. */
export const STOP = Object.fromEntries(
  Object.entries(distances).map(([name, distance]) => [name, distance / ROUTE_LENGTH])
) as Record<keyof typeof distances, number>

/** Keyframes of [scroll position in steps, route fraction]; flat spans are waits. */
const TRACK: ReadonlyArray<readonly [number, number]> = [
  [STEP.about, STOP.vueOut],
  [STEP.vue, STOP.vueOut],
  [STEP.rest, STOP.rest],
  [3.05, STOP.rest],
  [3.4, STOP.gateIn],
  [3.6, STOP.gateIn],
  [STEP.controller, STOP.controller],
  [STEP.service, STOP.service],
  [STEP.ai, STOP.service],
  [STEP.dto, STOP.dto],
  [STEP.db, STOP.db]
]

export const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1)
export const ease = (t: number) => t * t * (3 - 2 * t)
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

export function requestFraction(s: number): number {
  const first = TRACK[0]!
  const last = TRACK[TRACK.length - 1]!
  if (s <= first[0]) return first[1]
  if (s >= last[0]) return last[1]
  const i = TRACK.findIndex(([at]) => at > s)
  const [s0, f0] = TRACK[i - 1]!
  const [s1, f1] = TRACK[i]!
  return lerp(f0, f1, ease((s - s0) / (s1 - s0)))
}

const unreached = (step: number) => step - 0.45

function branch(from: Point, to: Point) {
  return {
    path: `M${from.x} ${from.y}L${to.x} ${to.y}`,
    length: Math.hypot(to.x - from.x, to.y - from.y),
    from,
    to
  }
}

/** Full architecture diagram, drawn in a fixed 760 x 900 box. */
export const wideLayout: SceneLayout = {
  kind: 'wide',
  width: 760,
  height: 900,
  route: 'M190 85H660V700',
  routeLength: ROUTE_LENGTH,
  pointAt: (fraction) => {
    const d = fraction * ROUTE_LENGTH
    return d <= 470 ? { x: 190 + d, y: 85 } : { x: 660, y: 85 + d - 470 }
  },
  badFrom: { x: 190, y: 60 },
  badTo: { x: 388, y: 60 },
  posts: [
    { x: 396, y: 40, w: 8, h: 45 },
    { x: 396, y: 85, w: 8, h: 45 }
  ],
  slide: [
    { x: 0, y: -36 },
    { x: 0, y: 36 }
  ],
  branches: {
    ai: branch({ x: 510, y: 383 }, { x: 410, y: 383 }),
    wordpress: branch({ x: 115, y: 130 }, { x: 115, y: 600 })
  },
  nodes: [
    { id: 'vue', kind: 'browser', x: 40, y: 40, w: 150, h: 90, label: 'Vue', at: -0.6 },
    { id: 'symfony', kind: 'frame', x: 480, y: 190, w: 240, h: 440, at: unreached(STEP.controller) },
    { id: 'controller', kind: 'box', onRoute: true, x: 510, y: 235, w: 180, h: 56, label: 'Controller', at: unreached(STEP.controller) },
    { id: 'service', kind: 'box', onRoute: true, x: 510, y: 355, w: 180, h: 56, label: 'Service', at: unreached(STEP.service) },
    { id: 'dto', kind: 'box', onRoute: true, x: 510, y: 475, w: 180, h: 56, label: 'DTO', at: unreached(STEP.dto) },
    { id: 'db', kind: 'database', x: 580, y: 700, w: 160, h: 80, label: 'Database', at: unreached(STEP.db) },
    { id: 'ai', kind: 'box', x: 250, y: 355, w: 160, h: 56, label: 'AI', at: unreached(STEP.ai) },
    { id: 'wordpress', kind: 'box', x: 40, y: 600, w: 150, h: 80, label: 'WordPress', at: unreached(STEP.wordpress) }
  ],
  labels: [
    { id: 'rest', x: 290, y: 114, text: 'REST', anchor: 'middle', at: unreached(STEP.rest) },
    { id: 'gate', x: 400, y: 206, text: 'validate + auth', anchor: 'middle', at: unreached(STEP.gate) },
    { id: 'symfony', x: 500, y: 214, text: 'Symfony', anchor: 'start', at: unreached(STEP.controller) }
  ],
  requestAnchor: { x: 196, y: 24 }
}

/** Slim vertical track that sits in the gutter on narrow screens. */
export function railLayout(height: number): SceneLayout {
  const top = 56
  const span = Math.max(height - top - 72, 200)
  const y = (fraction: number) => top + fraction * span
  const x = 30
  const marker = (id: string, fraction: number, at: number): SceneNode => ({
    id,
    kind: 'marker',
    x,
    y: y(fraction),
    w: 0,
    h: 0,
    at
  })
  const gateY = y(STOP.gateIn)

  return {
    kind: 'rail',
    width: 48,
    height,
    route: `M${x} ${y(0)}V${y(1)}`,
    routeLength: span,
    pointAt: (fraction) => ({ x, y: y(fraction) }),
    badFrom: { x: 10, y: y(0) },
    badTo: { x: 10, y: gateY },
    posts: [
      { x: 0, y: gateY + 10, w: 20, h: 5 },
      { x: 20, y: gateY + 10, w: 20, h: 5 }
    ],
    slide: [
      { x: -22, y: 0 },
      { x: 22, y: 0 }
    ],
    branches: {
      ai: branch({ x, y: y(0.75) }, { x: 44, y: y(0.75) }),
      wordpress: branch({ x, y: y(0.04) }, { x: 44, y: y(0.04) })
    },
    nodes: [
      marker('vue', 0, -0.6),
      marker('rest', STOP.rest, unreached(STEP.rest)),
      marker('controller', STOP.controller, unreached(STEP.controller)),
      marker('service', STOP.service, unreached(STEP.service)),
      marker('dto', STOP.dto, unreached(STEP.dto)),
      marker('db', STOP.db, unreached(STEP.db))
    ],
    labels: [],
    requestAnchor: { x, y: y(0) }
  }
}

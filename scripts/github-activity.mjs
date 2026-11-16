// Fetches the public contribution calendar of a GitHub user and stores the
// last 26 weeks in app/data/activity.json. No token needed: it reads the same
// public fragment the profile page uses (and shows private activity only if the
// profile setting "Private contributions" is on).
//
// If GitHub cannot be reached or the markup changed, the existing file is kept
// and the script still exits 0, so a deploy never fails because of this.
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const USER = 'KacperDn'
const WEEKS = 26
const target = fileURLToPath(new URL('../app/data/activity.json', import.meta.url))

function keepOld(reason) {
  console.warn(`[activity] ${reason}; keeping the existing app/data/activity.json`)
  process.exit(0)
}

let html
try {
  const res = await fetch(`https://github.com/users/${USER}/contributions`, { headers: { Accept: 'text/html' } })
  if (!res.ok) keepOld(`GitHub answered ${res.status}`)
  html = await res.text()
} catch (error) {
  keepOld(`request failed (${error.message})`)
}

const counts = new Map()
for (const m of html.matchAll(/<tool-tip[^>]*\bfor="(contribution-day-component-\d+-\d+)"[^>]*>\s*(No|\d+) contributions?\b/g)) {
  counts.set(m[1], m[2] === 'No' ? 0 : Number(m[2]))
}

// id is contribution-day-component-<weekday 0=Sun>-<week>
const grid = []
for (const m of html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"\s+id="(contribution-day-component-(\d+)-(\d+))"\s+data-level="(\d)"/g)) {
  const [, date, id, row, col, level] = m
  const week = (grid[Number(col)] ??= Array(7).fill(null))
  week[Number(row)] = { date, count: counts.get(id) ?? 0, level: Number(level) }
}

const weeks = grid.filter(Boolean).slice(-WEEKS)
if (weeks.length < WEEKS || !counts.size) keepOld('the calendar markup was not what was expected')

const days = weeks.flat().filter(Boolean)
const data = {
  user: USER,
  from: days[0].date,
  to: days[days.length - 1].date,
  total: days.reduce((sum, day) => sum + day.count, 0),
  weeks
}

let previous = ''
try {
  previous = await readFile(target, 'utf8')
} catch {}
const next = JSON.stringify(data) + '\n'
if (previous !== next) await writeFile(target, next)
console.log(`[activity] ${data.total} contributions, ${data.from} to ${data.to}${previous === next ? ' (unchanged)' : ''}`)

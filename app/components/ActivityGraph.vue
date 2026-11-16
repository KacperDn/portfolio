<script setup lang="ts">
import activity from '~/data/activity.json'

const profile = `https://github.com/${activity.user}`
const summary = `${activity.total} GitHub contributions in the last six months`

function monthOf(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleString('en', { month: 'short', timeZone: 'UTC' })
}

// A label above the first week of each month, as on the GitHub profile. A label
// that would collide with the next one (less than three columns apart) is dropped.
const monthLabels = (() => {
  const labels: string[] = []
  let previous = ''
  activity.weeks.forEach((week, index) => {
    const day = week[3] ?? week.find(Boolean)
    const month = day ? monthOf(day.date) : ''
    labels[index] = month !== previous ? month : ''
    previous = month
  })
  let next = labels.length
  for (let index = labels.length - 1; index >= 0; index--) {
    if (!labels[index]) continue
    if (next - index < 3) labels[index] = ''
    else next = index
  }
  return labels
})()

const weekdays = ['', 'Mon', '', 'Wed', '', 'Fri', '']
</script>

<template>
  <figure class="activity">
    <div class="activity__chart" role="img" :aria-label="summary">
      <span />
      <div class="activity__months" aria-hidden="true">
        <span v-for="(label, index) in monthLabels" :key="index">{{ label }}</span>
      </div>
      <div class="activity__weekdays" aria-hidden="true">
        <span v-for="(name, index) in weekdays" :key="index">{{ name }}</span>
      </div>
      <div class="activity__grid" aria-hidden="true">
        <div v-for="(week, index) in activity.weeks" :key="index" class="activity__week">
          <span
            v-for="(day, row) in week"
            :key="row"
            class="activity__day"
            :class="day ? `is-level-${day.level}` : 'is-empty'"
            :title="day ? `${day.count} contributions on ${day.date}` : undefined"
          />
        </div>
      </div>
    </div>

    <figcaption class="activity__caption">
      <span>
        <strong>{{ activity.total }}</strong> contributions in the last six months ·
        <a :href="profile" target="_blank" rel="noopener noreferrer">
          GitHub<span class="sr-only"> profile (opens in a new tab)</span>
        </a>
      </span>
      <span class="activity__legend" aria-hidden="true">
        Less
        <i class="activity__day is-level-0" />
        <i class="activity__day is-level-1" />
        <i class="activity__day is-level-2" />
        <i class="activity__day is-level-3" />
        <i class="activity__day is-level-4" />
        More
      </span>
    </figcaption>
  </figure>
</template>

<style scoped>
.activity {
  --gap: clamp(2px, 0.5vw, 4px);

  max-width: 42rem;
  margin: 0;
  font-size: 0.75rem;
  color: var(--dim);
}

.activity__chart {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  column-gap: 0.5rem;
  row-gap: 0.35rem;
}

.activity__months,
.activity__grid {
  display: grid;
  grid-template-columns: repeat(26, minmax(0, 1fr));
  gap: var(--gap);
}

.activity__months span {
  line-height: 1;
  white-space: nowrap;
}

.activity__weekdays {
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  gap: var(--gap);
}

.activity__weekdays span {
  display: flex;
  align-items: center;
  font-size: 0.625rem;
  line-height: 1;
}

.activity__week {
  display: grid;
  grid-template-rows: repeat(7, auto);
  gap: var(--gap);
}

.activity__day {
  display: block;
  aspect-ratio: 1;
  border-radius: 2px;
  background: color-mix(in srgb, var(--text) 8%, transparent);
}

.activity__day.is-empty {
  background: none;
}

.activity__day.is-level-1 {
  background: color-mix(in srgb, var(--accent) 28%, var(--ink));
}

.activity__day.is-level-2 {
  background: color-mix(in srgb, var(--accent) 52%, var(--ink));
}

.activity__day.is-level-3 {
  background: color-mix(in srgb, var(--accent) 76%, var(--ink));
}

.activity__day.is-level-4 {
  background: var(--accent);
}

.activity__caption {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 1rem;
  margin-top: 0.9rem;
}

.activity__caption strong {
  font-weight: 600;
  color: var(--text);
}

.activity__caption a {
  color: var(--dim);
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s;
}

.activity__caption a:hover {
  color: var(--accent);
}

.activity__legend {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.activity__legend .activity__day {
  width: 0.7rem;
}

.activity__legend .activity__day:first-of-type {
  margin-left: 0.25rem;
}

.activity__legend .activity__day:last-of-type {
  margin-right: 0.25rem;
}
</style>

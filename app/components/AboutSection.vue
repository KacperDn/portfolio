<script setup lang="ts">
const rows = [
  {
    title: 'At work',
    text: 'I work on both halves of an app: the server nobody sees and the interface everyone uses. PHP and Symfony behind it, Vue and TypeScript in front, Java as well, with APIs and integrations tying it together.'
  },
  {
    title: 'Studies',
    text: 'Computer science, with a focus on cybersecurity and AI.'
  },
  {
    title: 'Sites',
    text: 'I also build sites on CMSs, mostly WordPress. My own apps, like Moneta, are how I learn how whole systems fit together.'
  },
  {
    title: 'AI',
    text: 'A daily tool. It speeds me up, but I read and understand what ends up in my code.'
  }
]
</script>

<template>
  <section id="about" class="sheet rule-top" aria-labelledby="about-title">
    <h2 id="about-title" class="sheet__label" data-mask>About</h2>
    <div class="sheet__body">
      <p class="about__lead" data-words>I'm 20, a fullstack developer and a computer science student.</p>
      <div class="about__rows">
        <div v-for="row in rows" :key="row.title" class="about__row rule-top">
          <h3>{{ row.title }}</h3>
          <p data-words>{{ row.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about__lead {
  max-width: 24ch;
  font-size: var(--step-3);
  line-height: 1.15;
  letter-spacing: -0.01em;
}

.about__rows {
  margin-top: clamp(2.5rem, 6vw, 4.5rem);
}

.about__row {
  display: grid;
  gap: 0.5rem 2rem;
  padding: 1.25rem 0 1.5rem;
}

.about__row:last-child {
  border-bottom: 1px solid var(--line);
}

.about__row h3 {
  font-size: var(--step-1);
  letter-spacing: -0.01em;
}

@media (min-width: 48rem) {
  .about__row {
    grid-template-columns: 9rem minmax(0, 1fr);
  }
}
</style>

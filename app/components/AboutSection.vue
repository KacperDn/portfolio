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
  <section id="about" class="section" aria-labelledby="about-title">
    <div class="container">
      <h2 id="about-title" class="about__lead">I'm 20, a fullstack developer and a computer science student.</h2>
      <dl class="about__rows">
        <div v-for="row in rows" :key="row.title" class="about__row" data-reveal>
          <dt>{{ row.title }}</dt>
          <dd>{{ row.text }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
.about__lead {
  max-width: 22ch;
  font-size: clamp(2rem, 1.2rem + 3vw, 3.5rem);
  line-height: 1.05;
}

.about__rows {
  margin: clamp(2.5rem, 6vw, 4.5rem) 0 0;
}

.about__row {
  display: grid;
  gap: 0.5rem 2rem;
  padding: 1.5rem 0;
  border-top: 1px solid var(--line);
}

.about__row:last-child {
  border-bottom: 1px solid var(--line);
}

.about__row dt {
  font-weight: 600;
}

.about__row dd {
  max-width: 60ch;
  margin: 0;
  font-size: 1.125rem;
  color: var(--dim);
}

@media (min-width: 48rem) {
  .about__row {
    grid-template-columns: 14rem minmax(0, 1fr);
  }
}
</style>

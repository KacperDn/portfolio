<script setup lang="ts">
const links = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' }
]

const active = useActiveSection(links.map((link) => link.id))
</script>

<template>
  <header class="header">
    <a class="header__name" href="#top">KacperDn</a>
    <nav aria-label="Sections">
      <ul class="header__links">
        <li v-for="link in links" :key="link.id">
          <a :href="`#${link.id}`" :aria-current="active === link.id ? 'true' : undefined">{{ link.label }}</a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height);
  padding: 0 var(--gutter);
  background: var(--ink);
  border-bottom: 1px solid var(--line);
  font-family: var(--font-display);
}

.header__name {
  font-size: var(--step-1);
  font-weight: 800;
  text-decoration: none;
}

.header__links {
  display: flex;
  gap: clamp(1rem, 3vw, 2.5rem);
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--step--1);
  font-weight: 500;
}

.header__links a {
  display: inline-block;
  padding: 0.5rem 0;
  text-decoration: none;
}

.header__links a[aria-current='true'] {
  text-decoration: underline;
}
</style>

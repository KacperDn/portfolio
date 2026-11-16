<script setup lang="ts">
const links = [
  { id: 'about', label: 'About' },
  { id: 'stack', label: 'Stack' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' }
]

const active = useActiveSection(['top', ...links.map((link) => link.id)])
</script>

<template>
  <nav class="nav" aria-label="Sections">
    <a class="nav__logo" :class="{ 'is-active': active === 'top' }" href="#top" aria-label="Back to the top">
      <LogoMark />
    </a>
    <ul class="nav__list">
      <li v-for="link in links" :key="link.id">
        <a
          class="nav__link"
          :class="{ 'is-active': active === link.id }"
          :href="`#${link.id}`"
          :aria-current="active === link.id ? 'true' : undefined"
        >
          {{ link.label }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.nav {
  position: fixed;
  bottom: 1.25rem;
  left: 50%;
  z-index: 20;
  display: flex;
  align-items: center;
  max-width: calc(100vw - 1.5rem);
  padding: 0.35rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: color-mix(in srgb, var(--card) 78%, transparent);
  box-shadow: 0 12px 40px rgb(0 0 0 / 0.45);
  backdrop-filter: blur(16px);
  transform: translateX(-50%);
}

.nav__logo {
  position: relative;
  display: flex;
  flex: none;
  align-items: center;
  height: 2.5rem;
  margin-right: 0.35rem;
  padding: 0 1rem 0 0.9rem;
  color: var(--text);
  transition: color 0.2s;
}

.nav__logo::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 0;
  width: 1px;
  height: 1.25rem;
  background: var(--line);
  transform: translateY(-50%);
}

.nav__logo:hover,
.nav__logo.is-active {
  color: var(--accent);
}

.nav__logo.is-active :deep(.logo__dot) {
  filter: drop-shadow(0 0 5px var(--accent));
}

.nav__list {
  display: flex;
  gap: 0.15rem;
}

.nav__link {
  position: relative;
  display: block;
  padding: 0.55rem 1rem 0.55rem 1.55rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--dim);
  text-decoration: none;
  transition:
    background 0.2s,
    color 0.2s;
}

.nav__link::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0.8rem;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0;
  transform: translateY(-50%);
  transition: opacity 0.2s;
}

.nav__link:hover {
  color: var(--text);
}

.nav__link.is-active {
  background: color-mix(in srgb, var(--text) 9%, transparent);
  color: var(--text);
}

.nav__link.is-active::before {
  opacity: 1;
}

@media (max-width: 29.99rem) {
  .nav__logo {
    margin-right: 0.2rem;
    padding: 0 0.7rem 0 0.6rem;
  }

  .nav__logo :deep(.logo) {
    height: 1.05rem;
  }

  .nav__link {
    padding: 0.5rem 0.5rem 0.5rem 1.05rem;
    font-size: 0.8125rem;
  }

  .nav__link::before {
    left: 0.4rem;
  }
}

@media (max-width: 22.5rem) {
  .nav__logo {
    padding: 0 0.5rem 0 0.4rem;
  }

  .nav__logo :deep(.logo) {
    height: 0.95rem;
  }

  .nav__list {
    gap: 0;
  }

  .nav__link {
    padding: 0.5rem 0.35rem 0.5rem 0.9rem;
    font-size: 0.75rem;
  }

  .nav__link::before {
    left: 0.3rem;
  }
}
</style>

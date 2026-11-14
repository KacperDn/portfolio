# Portfolio

Personal portfolio of KacperDn, a fullstack developer. One page: a hero with a glowing dotted orb and a starfield, then About, Stack, Works and Contact, with a floating pill navigation at the bottom. Dark, with one aqua accent. About and Stack are ruled rows; projects and contact are rounded cards.

## Stack

- Nuxt 4 (Vue 3, `<script setup>`), TypeScript strict, used as a static site generator.
- Plain CSS on custom properties and CSS Grid. No UI kit, no Tailwind, no animation library.
- Fonts: Geist and Geist Mono, self-hosted through `@fontsource-variable`. Nothing is loaded from a CDN.
- Icons: `devicon`, inlined as SVG.
- Playwright is a dev dependency, used only for screenshots and the OG image.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run generate` | Static site in `.output/public` (what the deploy publishes) |
| `npm run build` / `npm run preview` | Server build and local preview |
| `npm run typecheck` | `nuxt typecheck` |
| `npm run shots` | Playwright screenshots at 1440 px and 390 px into `screenshots/` (`SITE_URL` sets the target) |
| `npm run og` | Regenerates `public/og.png` |

## Where things live

| Path | Content |
| --- | --- |
| `app/assets/css/tokens.css` | Colors, fonts, radius, spacing |
| `app/assets/css/base.css` | Reset, links, buttons, labels, focus ring |
| `app/assets/css/layout.css` | Container, sections, cards, reveal rules |
| `app/components/HeroSection.vue`, `OrbCanvas.vue`, `StarField.vue` | Hero (name, buttons, Backend and Frontend lists in the corners on wide screens, a scroll arrow on phones), the dotted orb and the starfield, both drawn on canvases |
| `app/components/SiteNav.vue`, `LogoMark.vue` | Floating pill navigation; the logo (letters outlined from Geist) scrolls back to the top |
| `app/components/AboutSection.vue` | About: a lead and four ruled rows |
| `app/components/StackSection.vue` | Stack: ruled rows with icons |
| `app/components/ProjectsSection.vue`, `ProjectCard.vue` | Projects (the `works` section) |
| `app/components/ContactSection.vue`, `SiteFooter.vue` | Contact and footer |
| `app/composables/` | `useReveal`, `useSpotlight`, `useActiveSection` |
| `app/data/projects.ts` | Project copy, links and screenshots |
| `app/data/stack.ts` | Stack groups and their icons |
| `app/data/contact.ts` | Email, GitHub and LinkedIn (`text` is what the button shows, `href` where it goes) |

## Colors and fonts

The palette is six custom properties in `tokens.css`: `--ink` (background), `--card`, `--line`, `--text`, `--dim` and the single accent `--accent`. Change them there and the whole page follows. The favicon, `theme-color` in `nuxt.config.ts`, the orb colors in `OrbCanvas.vue` and `scripts/og-image.mjs` repeat the values, so update those too.

Headings and body use `--font-sans` (Geist), small labels and project addresses use `--font-mono` (Geist Mono).

The logo (`LogoMark.vue`) and `public/favicon.svg` are the letters D and n taken as outlines from Geist at a heavy weight, with an accent dot. They are plain SVG paths, so changing the font does not change them.

## Motion

Everything is optional and switched off under `prefers-reduced-motion`; the page stays complete without it.

- **Orb** (`OrbCanvas`): about 4,600 dots on a sphere (2,200 on small screens) with craters, lit from one side, slowly rotating and tilting with the cursor, plus an orbit ring with a moving dot. It pauses when off screen. Under reduced motion it is drawn once.
- **Starfield** (`StarField`): a few hundred faint stars that twinkle slowly behind the hero, also paused off screen and static under reduced motion.
- **Reveal** (`useReveal`): cards and rows fade in as they scroll into view. Cards already on screen at load stay put, and nothing is hidden before the script runs.
- **Spotlight** (`useSpotlight`): a soft aqua highlight follows the pointer inside a card (projects and contact).
- **Navigation** (`useActiveSection`): marks the section that holds the middle of the viewport.
- The hero text rises in with a short CSS animation, and anchor links scroll smoothly.
- The scroll arrow in the hero exists only on phones; it sits halfway between the buttons and the bottom navigation.

## Projects and screenshots

Each project has a static screenshot in `app/assets/media/<name>/screenshot.webp`, imported in `app/data/projects.ts`, so the build gives it a hashed URL and a replaced file is never served from a stale cache.

- Use 1280 x 800 (for example `ffmpeg -i in.png -vf scale=1280:-2 -quality 80 screenshot.webp`); the card crops it to 16:10.
- To add a project, put its screenshot in `app/assets/media/<name>/`, import it in `app/data/projects.ts` and add an entry with an `alt` text.
- Project links open in a new tab and say so to screen readers.

## Stack section

Groups and items are in `app/data/stack.ts`. Icons come from the `devicon` package (MIT; the marks belong to their owners). SQL is a plain database symbol, because Devicon has no generic SQL mark. To add an item, import its file from `node_modules/devicon/icons/<name>/` with `?raw`, wrap it in `mono()` and add it to a group. The fills are dropped so the icons take the accent color.

## Publishing

The workflow in `.github/workflows/nuxtjs.yml` runs `npm run generate` on every push to `main` and publishes `.output/public` to GitHub Pages, so a push goes live. The site is served from the root of a custom domain.

- The code works at the root of any domain. Under a subpath (for example `user.github.io/portfolio/`) it would need `app.baseURL`, and the favicon and OG image links in `nuxt.config.ts` and `app/app.vue` would need the base path too.
- `og:image` and `og:url` need absolute URLs for social previews. `og:image` is currently `/og.png`.

## TODO

- Email in `app/data/contact.ts`. Entries with an empty `href` are hidden, so fill it in to show it (GitHub is taken from the Moneta repository; check it).
- Absolute `og:url`, `og:image` and a canonical link for the live domain.
- Check with the artist that her paintings may appear in the elzbietagrel.pl screenshot.

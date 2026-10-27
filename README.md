# Portfolio

Personal portfolio of KacperDn, a fullstack developer. One page, dark and raw: deep teal-black background, one aqua accent, hard rules and a 12-column grid. The left column holds the section title, the right one the content.

Sections: hero (name, floating tech tiles), a draggable stack strip, About, Projects, Contact.

## Stack

- Nuxt 4 (Vue 3, `<script setup>`), TypeScript strict, Vite, Nitro.
- GSAP + ScrollTrigger for motion, Lenis for smooth scroll (driven from the GSAP ticker, one RAF loop).
- Plain CSS on custom properties and CSS Grid. No UI kit, no Tailwind.
- Fonts: Geist (headings, menu, hero name) and Newsreader (body text), both self-hosted through `@fontsource-variable`. Nothing is loaded from a CDN at runtime.
- Icons: `devicon`, inlined as SVG.
- Playwright is a dev dependency, used only for screenshots and the OG image.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run build` / `npm run preview` | Production build and local preview |
| `npm run generate` | Static files in `.output/public`, for static hosting |
| `npm run typecheck` | `nuxt typecheck` |
| `npm run shots` | Playwright screenshots at 1440 px and 390 px into `screenshots/` (`SITE_URL` sets the target) |
| `npm run og` | Regenerates `public/og.png` |

## Where things live

| Path | Content |
| --- | --- |
| `app/assets/css/tokens.css` | Colors, type scale, spacing, hero name size |
| `app/assets/css/base.css`, `layout.css` | Reset, links, focus ring, section grid, rule and mask helpers |
| `app/components/HeroSection.vue` | Hero: name, subline, tech tiles |
| `app/components/TechCloud.vue` | Floating tech tiles |
| `app/components/StackMarquee.vue` | Draggable stack strip |
| `app/components/AboutSection.vue` | About copy: a lead and four rows |
| `app/components/ProjectsSection.vue`, `ProjectStop.vue`, `DeviceFrame.vue`, `ProjectVideo.vue` | Projects and their video frames |
| `app/components/ContactSection.vue`, `SiteHeader.vue`, `SiteFooter.vue` | Contact, header with active-section nav, footer |
| `app/composables/` | `useLenis`, `useHeroMotion`, `useScrollMotion`, `useActiveSection`, `useReducedMotion` |
| `app/data/projects.ts` | Project copy, links and media |
| `app/data/contact.ts` | Email, GitHub and LinkedIn |
| `app/data/tech.ts` | Tech tiles and their positions |

## Colors and fonts

The palette is six custom properties in `tokens.css`: `--ink` (background), `--panel`, `--line`, `--text`, `--dim` and the single accent `--accent`. Change them there and the whole page follows. The favicon, `theme-color` in `nuxt.config.ts` and `scripts/og-image.mjs` repeat the values, so update those too.

The display font is `--font-display` in `tokens.css`, loaded in `nuxt.config.ts`. The hero name size (`--step-hero`) is tuned to Geist's width (the name is about 4.7 em wide), so retune it if you swap fonts.

## Media

Files live in `app/assets/media/`: a `poster.jpg` plus the same clip as `.webm` and `.mp4` for each project. They are imported in `app/data/projects.ts`, so the build gives them hashed URLs and a replaced file is never served from a stale browser cache.

| Project | Poster | Video |
| --- | --- | --- |
| Moneta | `app/assets/media/moneta/poster.jpg` | `demo.webm`, `demo.mp4` |
| elzbietagrel.pl | `app/assets/media/elzbietagrel/poster.jpg` | `screen.webm`, `screen.mp4` |

- Both clips are recordings of the live pages scrolling top to bottom and back, made with Playwright. Moneta's recording shows its public landing page; the app itself needs a login, so record your own clip if you want the inside shown.
- To replace one, keep the names above. The frame is 16:10, for example 1280 x 800.
- To add a project, put its files in `app/assets/media/<name>/`, import them in `app/data/projects.ts` and add an entry.
- Videos are muted, loop, load only when they come within 300 px of the viewport and play while at least 40% visible. Under reduced motion they stay on the poster and show controls.
- Project links open in a new tab and say so to screen readers.
- Encoding used: `ffmpeg -i in.webm -an -vf scale=1280:-2 -c:v libvpx-vp9 -crf 38 -b:v 0 out.webm`, and `-c:v libx264 -crf 30 -preset slow -movflags +faststart` for the mp4.

## Tech tiles

The 12 tiles in the hero are listed in `app/data/tech.ts`. Icons come from the `devicon` package (MIT; the marks belong to their owners). SQL is a plain database symbol, because Devicon has no generic SQL mark.

To add one, import its file from `node_modules/devicon/icons/<name>/` with `?raw`, wrap it in `mono()` and add a position. The fills are dropped so the tiles take the page colors. `x` and `y` are percentages of the cloud, `size` is the tile width (size x 2.4 percent of the cloud) and `depth` sets how far it follows the cursor.

Below 1024 px the tiles become a tidy grid above the name (4 columns, 3 on phones) and the hero fills the first screen.

## Motion

All of it is switched off under `prefers-reduced-motion` (`gsap.matchMedia`), and the page stays fully readable without it.

- **Hero** (`useHeroMotion`): letters rise out of a mask while their weight fills in from 200 to 800. After that the cursor thins the letters near it, and scrolling lifts and thins them one after another. Letter widths are locked, so nothing shifts while the weight changes.
- **Tech tiles** (`TechCloud`): pop in, drift, follow the cursor with different strength and move away faster than the page on scroll. Pointer following is off on small screens.
- **Stack strip** (`StackMarquee`): drifts left, speeds up with page scroll and reverses when scrolling up. It can be dragged with a mouse or a finger and keeps the momentum of a throw. Vertical swipes still scroll the page. Under reduced motion only manual dragging remains.
- **Scroll motion** (`useScrollMotion`), driven by data attributes: `.rule-top` draws its line in the accent color, `[data-mask]` slides its text out of a mask, `[data-words]` lights up word by word with scroll, `[data-frame]` wipes open once.
- **Header** (`useActiveSection`): marks the section that holds the middle of the viewport.
- The `js` class on `<html>` hides the hero letters until the animation starts and is removed after 6 s as a safety net.

## Publishing

- The code works at the root of any domain. Under a subpath (for example `user.github.io/portfolio/`) it would need `app.baseURL`, and the favicon and OG image links in `nuxt.config.ts` and `app/app.vue` would need the base path too.
- `og:image` and `og:url` need absolute URLs for social previews. `og:image` is currently `/og.png`.
- `npm run generate` produces static files that any static host can serve.

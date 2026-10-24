# Portfolio

Dark, raw portfolio: deep teal-black background, one aqua accent, hard rules and a 12-column grid. Left column holds the section title, the right one the content.

Nuxt 4, TypeScript strict, GSAP + ScrollTrigger, Lenis. Fonts are self-hosted (`@fontsource-variable`), nothing is loaded from a CDN at runtime.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run build` / `npm run preview` | Production build and local preview |
| `npm run typecheck` | `nuxt typecheck` |
| `npm run shots` | Playwright screenshots at 1440 px and 390 px into `screenshots/` (`SITE_URL` sets the target) |
| `npm run og` | Regenerates `public/og.png` |

## Where things live

| Path | Content |
| --- | --- |
| `app/assets/css/tokens.css` | Colors, type scale, spacing |
| `app/data/projects.ts` | Project copy, links and media paths |
| `app/data/contact.ts` | Email, GitHub and LinkedIn |
| `app/components/AboutSection.vue` | About copy and the facts table |

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
- Encoding used: `ffmpeg -i in.webm -an -vf scale=1280:-2 -c:v libvpx-vp9 -crf 38 -b:v 0 out.webm`, and `-c:v libx264 -crf 30 -preset slow -movflags +faststart` for the mp4.

## TODO before publishing

- Email and LinkedIn in `app/data/contact.ts`. Entries with an empty `href` are hidden, so fill both in to show them (GitHub is taken from the Moneta repository; check it).
- Optional detail line for elzbietagrel.pl (`detail` in `app/data/projects.ts`): what you built there.
- Absolute `og:url` and canonical link once the domain is known.
- Real posters and recordings (above).

## Tech icons

The floating tiles in the hero are listed in `app/data/tech.ts`. Icons come from the `devicon` package (MIT; the marks belong to their owners). To add one, import its file from `node_modules/devicon/icons/<name>/` with `?raw`, wrap it in `mono()` and add a position. The fills are dropped so the tiles take the page colors.

## Motion

All of it is switched off under `prefers-reduced-motion` (`gsap.matchMedia`), and the page stays fully readable without it.

- **Hero** (`useHeroMotion`): letters rise out of a mask while their weight fills in from 200 to 800. After that the cursor thins the letters near it, and scrolling lifts and thins them one after another. Letter widths are locked, so nothing shifts while the weight changes.
- **Marquee** (`StackMarquee`): drifts left; scroll speed adds to it and scrolling up reverses it. It pauses off screen.
- **Scroll motion** (`useScrollMotion`), driven by data attributes: `.rule-top` draws its line in the accent color, `[data-mask]` slides its text out of a mask, `[data-words]` lights up word by word with scroll, `[data-frame]` wipes open once.
- **Header** (`useActiveSection`): marks the section that holds the middle of the viewport.
- **Smooth scroll** is Lenis, driven from the GSAP ticker.
- The `js` class on `<html>` hides the hero letters until the animation starts and is removed after 6 s as a safety net.

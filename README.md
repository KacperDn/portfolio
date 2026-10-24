# Portfolio

Dark, scroll-driven portfolio. The page follows one HTTP request from a Vue frontend through a Symfony backend to the database.

Nuxt 4, TypeScript strict, GSAP + ScrollTrigger, Lenis, three. Fonts are self-hosted (`@fontsource-variable`), nothing is loaded from a CDN at runtime.

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
| `app/data/journey.ts` | Copy for each stop of the journey |
| `app/data/projects.ts` | Project copy, links and media paths |
| `app/data/contact.ts` | Email, GitHub and LinkedIn |
| `app/utils/storyLayout.ts` | Geometry and timing of the journey scene |

## Drop your media here

Files live in `public/media/`. Placeholders are in place; replace them with the same names.

| Project | Poster | Video (both formats) |
| --- | --- | --- |
| elzbietagrel.pl | `public/media/elzbietagrel/poster.jpg` | `screen.webm`, `screen.mp4` in the same folder |
| Moneta | `public/media/moneta/poster.jpg` | `demo.webm`, `demo.mp4` in the same folder |
| Third project | add an entry with `media` to `app/data/projects.ts` | `public/media/<name>/` |

- `.mp4` placeholders do not exist yet (no ffmpeg here); browsers use the `.webm` until you add them.
- Browser frame: 16:10 poster and video, for example 1600 x 1000. Phone frame: 9:19, for example 540 x 1140.
- Videos are muted, loop, load only when they come within 300 px of the viewport and play while at least 40% visible. Under reduced motion they stay on the poster and show controls.
- Keep each video under about 3 MB: `ffmpeg -i in.mov -an -vf scale=1280:-2 -c:v libvpx-vp9 -crf 36 -b:v 0 screen.webm`, and `-c:v libx264 -crf 28 -movflags +faststart` for the mp4.

## TODO before publishing

- Email and LinkedIn in `app/data/contact.ts` (GitHub is taken from the Moneta repository; check it).
- Database and ORM in the last journey stop (`app/data/journey.ts`).
- What you built on elzbietagrel.pl, and the third project (`app/data/projects.ts`).
- Absolute `og:url` and canonical link once the domain is known.
- Real posters and recordings (above).

## Behaviour notes

- Hero: the particle field is sampled from the real `h1`, so it lands exactly on the text. Without WebGL, or under `prefers-reduced-motion`, the plain headline stays.
- Journey: one scalar (`s`, the scroll position measured in steps) drives the whole scene. Narrow screens get a slim rail instead of the full diagram. Under reduced motion the scene renders once, fully drawn.
- Low-power devices (narrow screen, 4 cores or fewer, 4 GB or less) get about a third of the particles and a pixel ratio of 1.

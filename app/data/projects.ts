import elzbietaShot from '~/assets/media/elzbietagrel/screenshot.webp'
import monetaShot from '~/assets/media/moneta/screenshot.webp'

export interface ProjectShot {
  src: string
  /** Describes the screenshot for people who cannot see it. */
  alt: string
}

export interface Project {
  id: string
  name: string
  /** Shown in the address bar of the frame. */
  address: string
  summary: string
  /** Optional second paragraph. */
  detail?: string
  links: { label: string; href: string }[]
  screenshot: ProjectShot
}

export const projects: Project[] = [
  {
    id: 'moneta',
    name: 'Moneta',
    address: 'kacperdn.github.io/moneta',
    summary:
      'A personal expense tracker: monthly breakdown by category, trends over time, an optional budget goal, and a Polish and English interface.',
    detail: 'Built with React, TypeScript and Supabase. Installable as a PWA.',
    links: [
      { label: 'Live demo', href: 'https://kacperdn.github.io/moneta/' },
      { label: 'Source', href: 'https://github.com/KacperDn/moneta' }
    ],
    screenshot: {
      src: monetaShot,
      alt: 'The Moneta landing page: a headline about seeing where your money goes, next to a spending chart.'
    }
  },
  {
    id: 'elzbietagrel',
    name: 'elzbietagrel.pl',
    address: 'elzbietagrel.pl',
    summary: 'A WordPress site for an artist. Live.',
    links: [{ label: 'elzbietagrel.pl', href: 'https://elzbietagrel.pl' }],
    screenshot: {
      src: elzbietaShot,
      alt: 'The elzbietagrel.pl homepage: a watercolor of cranes among reeds with the headline Malarstwo które zatrzymuje czas.'
    }
  }
]

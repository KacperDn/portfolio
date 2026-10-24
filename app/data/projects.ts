import elzbietaMp4 from '~/assets/media/elzbietagrel/screen.mp4'
import elzbietaWebm from '~/assets/media/elzbietagrel/screen.webm'
import elzbietaPoster from '~/assets/media/elzbietagrel/poster.jpg'
import monetaMp4 from '~/assets/media/moneta/demo.mp4'
import monetaWebm from '~/assets/media/moneta/demo.webm'
import monetaPoster from '~/assets/media/moneta/poster.jpg'

export interface ProjectMedia {
  poster: string
  webm: string
  mp4: string
  /** Describes the recording for people who cannot see it. */
  description: string
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
  media: ProjectMedia
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
    media: {
      poster: monetaPoster,
      webm: monetaWebm,
      mp4: monetaMp4,
      description: 'Screen recording of the Moneta landing page scrolling from top to bottom.'
    }
  },
  {
    id: 'elzbietagrel',
    name: 'elzbietagrel.pl',
    address: 'elzbietagrel.pl',
    summary: 'A WordPress site for an artist. Live.',
    links: [{ label: 'elzbietagrel.pl', href: 'https://elzbietagrel.pl' }],
    media: {
      poster: elzbietaPoster,
      webm: elzbietaWebm,
      mp4: elzbietaMp4,
      description: 'Screen recording of the elzbietagrel.pl homepage scrolling from top to bottom.'
    }
  }
]

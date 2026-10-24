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
  device: 'browser' | 'phone'
  summary: string
  /** Shown as-is, so unfinished copy can be flagged with TODO. */
  detail?: string
  links: { label: string; href: string }[]
  media?: ProjectMedia
}

export const projects: Project[] = [
  {
    id: 'elzbietagrel',
    name: 'elzbietagrel.pl',
    device: 'browser',
    summary: 'A WordPress site for an artist, live and maintained.',
    detail: 'TODO: what you built here (theme, gallery, performance, hosting).',
    links: [{ label: 'elzbietagrel.pl', href: 'https://elzbietagrel.pl' }],
    media: {
      poster: '/media/elzbietagrel/poster.jpg',
      webm: '/media/elzbietagrel/screen.webm',
      mp4: '/media/elzbietagrel/screen.mp4',
      description: 'Screen recording of the elzbietagrel.pl homepage.'
    }
  },
  {
    id: 'moneta',
    name: 'Moneta',
    device: 'phone',
    summary:
      'A personal expense tracker: monthly breakdown by category, trends over time, an optional budget goal, and a Polish and English interface.',
    detail: 'Built with React, TypeScript and Supabase. Installable as a PWA.',
    links: [
      { label: 'Live demo', href: 'https://kacperdn.github.io/moneta/' },
      { label: 'Source', href: 'https://github.com/KacperDn/moneta' }
    ],
    media: {
      poster: '/media/moneta/poster.jpg',
      webm: '/media/moneta/demo.webm',
      mp4: '/media/moneta/demo.mp4',
      description: 'Screen recording of adding an expense in Moneta and the monthly chart updating.'
    }
  },
  {
    id: 'next',
    name: 'Next project',
    device: 'browser',
    summary: 'TODO: a third project goes here.',
    links: []
  }
]

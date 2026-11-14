export interface ContactLink {
  label: string
  /** Text shown for the link. */
  text: string
  /** Empty until the real address is filled in; empty entries are not shown. */
  href: string
}

export const contactLinks: ContactLink[] = [
  { label: 'Email', text: '', href: '' },
  { label: 'GitHub', text: 'KacperDn', href: 'https://github.com/KacperDn' },
  {
    label: 'LinkedIn',
    text: 'Kacper Daniluk',
    href: 'https://www.linkedin.com/in/kacper-daniluk-301661397/'
  }
]

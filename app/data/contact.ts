export interface ContactLink {
  label: string
  /** Text shown for the link. */
  text: string
  /** `TODO` until the real address is filled in. */
  href: string
}

export const contactLinks: ContactLink[] = [
  { label: 'Email', text: 'TODO: add email', href: 'TODO' },
  { label: 'GitHub', text: 'github.com/KacperDn', href: 'https://github.com/KacperDn' },
  { label: 'LinkedIn', text: 'TODO: add LinkedIn', href: 'TODO' }
]

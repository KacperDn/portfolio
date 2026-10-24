export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  typescript: { strict: true },
  hooks: {
    /** Videos and posters load on demand; the default prefetch hints would fetch them all on page load. */
    'build:manifest': (manifest) => {
      for (const asset of Object.values(manifest) as { resourceType?: string; prefetch?: boolean }[]) {
        if (asset.resourceType === 'video' || asset.resourceType === 'image') asset.prefetch = false
      }
    }
  },
  css: [
    '@fontsource-variable/geist/wght.css',
    '@fontsource-variable/newsreader/wght.css',
    'lenis/dist/lenis.css',
    '~/assets/css/tokens.css',
    '~/assets/css/base.css',
    '~/assets/css/layout.css'
  ],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#091011' },
        { name: 'color-scheme', content: 'dark' }
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
    }
  }
})

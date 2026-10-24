export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  typescript: { strict: true },
  css: [
    '@fontsource-variable/bricolage-grotesque/wdth.css',
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
        { name: 'theme-color', content: '#0D0D0E' },
        { name: 'color-scheme', content: 'dark' }
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
    }
  }
})

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  typescript: { strict: true },
  hooks: {
    /** Nothing here needs to be fetched ahead of use: screenshots load lazily and the error pages are rarely seen. */
    'build:manifest': (manifest) => {
      for (const asset of Object.values(manifest) as { resourceType?: string; prefetch?: boolean }[]) {
        if (asset.resourceType === 'image' || asset.resourceType === 'style') asset.prefetch = false
      }
    }
  },
  css: [
    '@fontsource-variable/geist/wght.css',
    '@fontsource-variable/geist-mono/wght.css',
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

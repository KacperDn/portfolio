<script setup lang="ts">
const { siteUrl } = useRuntimeConfig().public

useHead({ link: [{ rel: 'canonical', href: `${siteUrl}/` }] })
useSeoMeta({
  title: 'KacperDn | Fullstack developer',
  description:
    'Fullstack developer. I build backends in Symfony and interfaces in Vue.',
  ogTitle: 'KacperDn | Fullstack developer',
  ogDescription:
    'Fullstack developer. I build backends in Symfony and interfaces in Vue.',
  ogImage: `${siteUrl}/og.png`,
  ogUrl: `${siteUrl}/`,
  ogType: 'website',
  twitterCard: 'summary_large_image'
})

useReveal()
useSpotlight()
</script>

<template>
  <NuxtRouteAnnouncer />
  <a class="skip-link" href="#main">Skip to content</a>
  <main id="main">
    <HeroSection />
    <AboutSection />
    <StackSection />
    <ProjectsSection />
    <ContactSection />
  </main>
  <SiteFooter />
  <SiteNav />
</template>

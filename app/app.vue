<script setup lang="ts">
useSeoMeta({
  title: 'Kacper | Fullstack developer',
  description:
    'Fullstack developer. I build backends in Symfony and interfaces in Vue.',
  ogTitle: 'Kacper | Fullstack developer',
  ogDescription:
    'Fullstack developer. I build backends in Symfony and interfaces in Vue.',
  ogImage: '/og.png',
  ogType: 'website',
  twitterCard: 'summary_large_image'
})

useLenis()
</script>

<template>
  <NuxtRouteAnnouncer />
  <a class="skip-link" href="#main">Skip to content</a>
  <main id="main">
    <HeroSection />
    <StoryFlow>
      <AboutSection />
      <JourneySection />
    </StoryFlow>
    <ProjectsSection />
    <ContactSection />
  </main>
  <SiteFooter />
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'KacperDn | Fullstack developer',
  description:
    'Fullstack developer. I build backends in Symfony and interfaces in Vue.',
  ogTitle: 'KacperDn | Fullstack developer',
  ogDescription:
    'Fullstack developer. I build backends in Symfony and interfaces in Vue.',
  ogImage: '/og.png',
  ogType: 'website',
  twitterCard: 'summary_large_image'
})

useHead({
  script: [
    {
      innerHTML:
        "document.documentElement.classList.add('js');setTimeout(function(){document.documentElement.classList.remove('js')},6000)"
    }
  ]
})

useLenis()
useScrollMotion()
</script>

<template>
  <NuxtRouteAnnouncer />
  <a class="skip-link" href="#main">Skip to content</a>
  <SiteHeader />
  <main id="main">
    <HeroSection />
    <StackMarquee />
    <AboutSection />
    <ProjectsSection />
    <ContactSection />
  </main>
  <SiteFooter />
</template>

<template>
  <section id="about" class="about" aria-labelledby="about-title">
    <div class="step about__step" data-step>
      <div class="about__pin">
        <h2 id="about-title">About</h2>
        <p>
          I'm 20, working as a PHP/Vue developer and studying computer science
          with a focus on cybersecurity and AI.
        </p>
        <p>
          At work I build REST APIs and integrations in Symfony, with a
          Controller → Service → DTO structure, and the frontends that consume
          them in Vue and TypeScript.
        </p>
        <p>
          Outside work I build WordPress sites for real clients and my own apps
          to learn how whole systems fit together. I use AI as a daily tool: it
          speeds me up, but I read and understand what ends up in my code.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about__step {
  display: block;
  min-height: 220svh;
}

.about__pin {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100svh;
}

.about__pin h2 {
  margin-bottom: 1.75rem;
}
</style>

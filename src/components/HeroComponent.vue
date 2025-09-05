<template>
  <section class="hero" role="banner" aria-label="Intro Mamma Elvira">
    <!-- Video come background, zero spaziatura -->
    <video
      v-if="shouldAutoplay"
      ref="videoEl"
      class="hero__video"
      :src="videoSrc"
      poster="/hero.jpg"
      autoplay muted loop playsinline preload="metadata"
    ></video>

    <!-- Poster se reduced-motion o blocchi autoplay -->
    <div v-else class="hero__poster" :style="{ backgroundImage: 'url(/hero.jpg)' }"></div>

    <!-- Overlay sottilissimo per leggibilità del testo -->
    <div class="hero__overlay"></div>

    <!-- Contenuto sovrapposto -->
    <div class="hero__content">
      <h1 class="title">La qualità del Salento, senza compromessi</h1>
      <p class="subtitle">Ingredienti scelti, artigianalità, ospitalità contemporanea.</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const videoEl = ref(null);
const shouldAutoplay = ref(true);
const videoSrc = ref('');

// Video placeholder; sostituisci con /hero.mp4 quando vuoi
const CANDIDATES = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
];

let io = null;

onMounted(() => {
  const m = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (m && m.matches) shouldAutoplay.value = false;

  videoSrc.value = CANDIDATES[Math.floor(Math.random() * CANDIDATES.length)];

  // Pausa/riavvia quando esce dalla viewport (ottimizzazione)
  if ('IntersectionObserver' in window && shouldAutoplay.value) {
    io = new IntersectionObserver((entries) => {
      const e = entries[0];
      if (!videoEl.value) return;
      if (e.isIntersecting) videoEl.value.play().catch(() => {});
      else videoEl.value.pause();
    }, { threshold: 0.1 });

    if (videoEl.value) io.observe(videoEl.value);
  }
});

onBeforeUnmount(() => {
  if (io) io.disconnect();
  io = null;
});
</script>

<style>
/* Nessun padding/margine. Copertura totale del viewport reale */
.hero{
  position: relative;
  height: 100dvh;      /* altezza viewport visibile (mobile ok) */
  min-height: 100vh;   /* fallback */
  width: 100vw;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* Video/poster = sfondo, a filo finestra */
.hero__video,
.hero__poster{
  position: absolute; inset: 0;
  display: block;
  width: 100%; height: 100%;
  object-fit: cover;
  background-size: cover; background-position: center;
  margin: 0; padding: 0; border: 0;
}

/* Leggerissimo gradiente per contrasto testo */
.hero__overlay{
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,.22) 0%, rgba(0,0,0,.08) 35%, rgba(0,0,0,.28) 100%);
  pointer-events: none;
  mix-blend-mode: multiply;
}

/* Testi sopra il video */
.hero__content{
  position: absolute; left: 0; right: 0; bottom: 14vh;  /* posizionamento elegante */
  z-index: 2;
  width: min(1100px, 92vw);
  margin: 0 auto;
  color: #fff;
  text-align: left;
  padding: 0 16px;   /* solo per i testi, non per il video */
}
.title{
  font-size: clamp(40px, 6.8vw, 84px);
  line-height: 1.02;
  letter-spacing: -0.02em;
  font-weight: 800;
  text-shadow: 0 6px 28px rgba(0,0,0,.35);
  margin: 0;
}
.subtitle{
  margin-top: .6rem;
  font-size: clamp(16px, 2.2vw, 22px);
  max-width: 72ch;
  opacity: .95;
  text-shadow: 0 3px 18px rgba(0,0,0,.32);
}
</style>

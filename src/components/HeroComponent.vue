<template>
  <section class="hero" :class="{ 'is-ready': ready }" role="banner" aria-label="Intro Mamma Elvira">
    <!-- Video YouTube come background -->
    <div v-if="useVideo" ref="ytWrap" class="hero__video">
      <iframe
        ref="ytEl"
        class="hero__iframe"
        :src="embedSrc"
        title="Background video"
        frameborder="0"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowfullscreen="false"
        aria-hidden="true"
      ></iframe>
    </div>

    <!-- Poster fallback (se reduced motion / autoplay bloccato / no ID) -->
    <div v-else class="hero__poster" :style="{ backgroundImage: `url(${poster})` }"></div>

    <!-- Overlay per contrasto -->
    <div class="hero__overlay"></div>

    <!-- Contenuto -->
    <div class="hero__content">
      <h1 class="title anim" style="--d:80ms">La qualità del Salento, senza compromessi</h1>
      <p class="subtitle anim" style="--d:180ms">Ingredienti scelti, artigianalità, ospitalità contemporanea.</p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

/**
 * Sostituisci questa URL con il tuo video YouTube.
 * Supporta formati:
 *  - https://youtu.be/VIDEO_ID
 *  - https://www.youtube.com/watch?v=VIDEO_ID
 *  - https://www.youtube.com/embed/VIDEO_ID
 */
const youtubeUrl = 'https://youtu.be/xPPLbEFbCAo'
const poster = '/hero.jpg' // fallback immagine

const ytEl = ref(null)
const ytWrap = ref(null)
const ready = ref(false)
const useVideo = ref(true) // viene disattivato se l’utente preferisce meno animazioni

// Estrae l'ID YouTube (11 caratteri)
function getYouTubeId (url) {
  const m = (url || '').match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|shorts\/|watch\?v=|v\/))([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}
const videoId = getYouTubeId(youtubeUrl)

const embedSrc = computed(() => {
  if (!videoId) return ''
  // Nota: playlist=VIDEO_ID è necessario per il loop
  const base = 'https://www.youtube-nocookie.com/embed/' + videoId
  const params = [
    'autoplay=1',
    'mute=1',
    'controls=0',
    'loop=1',
    `playlist=${videoId}`,
    'playsinline=1',
    'modestbranding=1',
    'rel=0',
    'showinfo=0',
    'iv_load_policy=3',
    'enablejsapi=1' // necessario per play/pause via postMessage
  ].join('&')
  return `${base}?${params}`
})

// Pausa quando l’hero esce dalla viewport (risparmia batteria)
let io = null
function ytCommand (func) {
  try {
    if (!ytEl.value || !ytEl.value.contentWindow) return
    ytEl.value.contentWindow.postMessage(JSON.stringify({
      event: 'command',
      func,
      args: []
    }), '*')
  } catch (e) {
    console.log(e)
  }
}

onMounted(async () => {
  // Rispetta prefers-reduced-motion
  const m = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)')
  if (m && m.matches) useVideo.value = false
  if (!videoId) useVideo.value = false

  await nextTick()
  requestAnimationFrame(() => { ready.value = true })

  if ('IntersectionObserver' in window && useVideo.value) {
    io = new IntersectionObserver((entries) => {
      const e = entries[0]
      if (e.isIntersecting && e.intersectionRatio > 0.4) ytCommand('playVideo')
      else ytCommand('pauseVideo')
    }, { threshold: [0, 0.4, 1] })
    if (ytWrap.value) io.observe(ytWrap.value)
  }
})

onBeforeUnmount(() => {
  if (io) io.disconnect()
  io = null
})
</script>

<style scoped>
/* Sezione full viewport, nessun margine/padding */
.hero{
  position: relative;
  height: 100dvh;
  min-height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* Wrapper video (iframe) a pieno schermo */
.hero__video{
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  pointer-events: none; /* non cliccabile */
}
.hero__iframe{
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  border: 0;
  /* Mantiene il crop tipo "cover" sfruttando l'iframe pieno */
  transform: scale(1.001); /* evita hairline gaps */
}

/* Poster fallback */
.hero__poster{
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
}

/* Overlay per contrasto testo */
.hero__overlay{
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,.22) 0%, rgba(0,0,0,.08) 35%, rgba(0,0,0,.28) 100%);
  mix-blend-mode: multiply;
  pointer-events: none;
}

/* Contenuto */
.hero__content{
  position: absolute; left: 0; right: 0; bottom: 14vh;
  z-index: 2; width: min(1100px, 92vw); margin: 0 auto;
  color: #fff; text-align: left; padding: 0 16px;
}
.title{
  font-size: clamp(40px, 6.8vw, 84px);
  line-height: 1.02; letter-spacing: -0.02em; font-weight: 800;
  text-shadow: 0 6px 28px rgba(0,0,0,.35); margin: 0;
}
.subtitle{
  margin-top: .6rem; font-size: clamp(16px, 2.2vw, 22px); max-width: 72ch;
  opacity: .95; text-shadow: 0 3px 18px rgba(0,0,0,.32);
}

/* Micro-entrance per il copy */
.anim{ opacity:0; transform: translateY(8px); }
.is-ready .anim{ opacity:1; transform:none; transition: opacity .6s ease, transform .6s ease; transition-delay: var(--d, 0ms); }
@media (prefers-reduced-motion: reduce){
  .anim, .is-ready .anim { opacity: 1 !important; transform: none !important; transition: none !important; }
}
</style>

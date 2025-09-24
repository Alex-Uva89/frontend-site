<!-- src/pages/ErrorNotFound.vue -->
<template>
  <div class="tv404 fullscreen">
    <!-- neve CRT super puntinata -->
    <canvas ref="noiseRef" class="noise"></canvas>

    <!-- scanlines + vignetta -->
    <div class="scanlines" aria-hidden="true"></div>
    <div class="vignette" aria-hidden="true"></div>

    <!-- contenuto -->
    <div class="content">
      <h1 class="title" aria-label="404">404</h1>
      <p class="subtitle">Page not found</p>

      <q-btn
        class="home-btn"
        color="white"
        text-color="dark"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const noiseRef = ref(null)

onMounted(() => {
  const cvs = noiseRef.value
  const ctx = cvs.getContext('2d', { alpha: false, willReadFrequently: true })

  // === Parametri facilmente regolabili ===
  const FPS = 30                    // 30 fps = look analogico e CPU ok
  const LEVELS = [0, 160, 255]      // nero / grigio / bianco
  const MIN_DENSITY = 4             // minimo 2× su desktop (puntini più piccoli)
  const MAX_DENSITY = 5             // limita il carico su schermi molto densi

  const getRes = () => {
    const dpr = Math.max(1, window.devicePixelRatio || 1)
    // usa almeno 2×; su mobile con DPR alto, limita a 3×
    return Math.min(Math.max(dpr, MIN_DENSITY), MAX_DENSITY)
  }

  let RES = getRes()

  const fit = () => {
    RES = getRes() // ricalcola in caso di zoom/cambio DPR
    const wCss = Math.max(1, Math.floor(cvs.clientWidth))
    const hCss = Math.max(1, Math.floor(cvs.clientHeight))
    const w = Math.max(1, Math.floor(wCss * RES))
    const h = Math.max(1, Math.floor(hCss * RES))

    // Dimensioni “logiche” del canvas (backing store)
    cvs.width  = w
    cvs.height = h
    // Stira al contenitore (dimensione CSS)
    cvs.style.width  = '100%'
    cvs.style.height = '100%'
  }

  const draw = () => {
    const { width: w, height: h } = cvs
    if (!w || !h) return
    const img = ctx.createImageData(w, h)
    const data = img.data
    // riempi con livelli quantizzati (puntinato fitto)
    for (let i = 0; i < data.length; i += 4) {
      const r = Math.random() * 255
      const q = r < 85 ? LEVELS[0] : r < 170 ? (LEVELS[1] ?? LEVELS[0]) : (LEVELS[2] ?? LEVELS[0])
      data[i] = data[i + 1] = data[i + 2] = q
      data[i + 3] = 255
    }
    ctx.putImageData(img, 0, 0)
  }

  let rafId = 0
  let last = 0
  const loop = (t) => {
    if (t - last > 1000 / FPS) { draw(); last = t }
    rafId = requestAnimationFrame(loop)
  }

  const onResize = () => { fit() }
  fit()
  addEventListener('resize', onResize, { passive: true })
  rafId = requestAnimationFrame(loop)

  onBeforeUnmount(() => {
    cancelAnimationFrame(rafId)
    removeEventListener('resize', onResize)
  })
})
</script>

<style scoped>
.tv404{
  position: relative;
  width: 100%;
  height: 100vh;     /* se vuoi centrarla nel contenitore TV, metti height: 100%; */
  background: #0a0a0a;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* === CANVAS NOISE (fitto) === */
.noise{
  position:absolute; inset:0;
  display:block;
  /* esalta il puntinato */
  filter: contrast(130%) brightness(110%);
  /* evita smoothing quando si scala: puntini piccoli e netti */
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  pointer-events: none;
}

/* === SCANLINES CRT === */
.scanlines{
  position:absolute; inset:0;
  background:
    repeating-linear-gradient(0deg,
      rgba(0,0,0,.22) 0px,
      rgba(0,0,0,.22) 1px,
      rgba(0,0,0,0)   3px,
      rgba(0,0,0,0)   4px
    );
  opacity: .6;
  mix-blend-mode: multiply;
  animation: roll 6s linear infinite;
}
@keyframes roll{ from{background-position-y:0} to{background-position-y:200px} }

/* === VIGNETTA === */
.vignette{
  position:absolute; inset:0;
  background: radial-gradient(ellipse at center,
    rgba(0,0,0,0) 0%,
    rgba(0,0,0,.15) 65%,
    rgba(0,0,0,.55) 100%);
  pointer-events:none;
}

/* === TESTO === */
.content{
  position: relative; z-index: 1;
  text-align: center; color:#f4f4f4; padding:24px;
  text-shadow: 0 0 4px rgba(255,255,255,.5), 0 0 18px rgba(255,255,255,.25);
  animation: microJitter 2.2s steps(2) infinite;
}
@keyframes microJitter{ 50% { transform: translateY(.2px) } }

.title{
  font-size: clamp(64px, 16vw, 220px);
  line-height: .85; font-weight: 900; letter-spacing: .02em;
  text-shadow:
    0 0 10px rgba(255,255,255,.35),
    1px 0 0 rgba(255,60,0,.35),
    -1px 0 0 rgba(0,180,255,.35);
}
.subtitle{
  margin-top:.2em; font-size: clamp(16px, 3.2vw, 28px);
  letter-spacing:.08em; text-transform: uppercase; color:#dcdcdc; opacity:.9;
  text-shadow:
    0 0 6px rgba(255,255,255,.25),
    1px 0 0 rgba(255,60,0,.25),
    -1px 0 0 rgba(0,180,255,.25);
}
.home-btn{
  margin-top:24px;
  font-weight:800; letter-spacing:.06em; border-radius:10px;
  box-shadow: 0 10px 18px rgba(0,0,0,.35);
}

/* riduci motion */
@media (prefers-reduced-motion: reduce){
  .content{ animation:none !important; }
  .scanlines{ animation:none !important; }
}
</style>

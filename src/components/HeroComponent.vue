<template>
  <section
    class="hero"
    :class="{ 'is-ready': ready }"
    role="banner"
    aria-label="Intro"
  >
    <!-- VIDEO YOUTUBE BACKGROUND -->
    <div v-if="useVideo && embedSrc" ref="ytWrap" class="video">
      <iframe
        ref="ytEl"
        class="iframe"
        :src="embedSrc"
        title="Background video"
        frameborder="0"
        allow="autoplay; fullscreen"
        aria-hidden="true"
      ></iframe>
    </div>

    <!-- FALLBACK POSTER -->
    <div v-else class="poster" :style="{ backgroundImage: `url(${poster})` }"></div>

    <div class="overlay"></div>

    <div class="content">
      <h1 class="title anim" style="--d:80ms">
        {{ $t('hero.title') }}
      </h1>
      <p class="subtitle anim" style="--d:160ms">
        {{ $t('hero.subtitle') }}
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

const youtubeUrl = 'https://www.youtube.com/watch?v=CHJ7DaF0b0w'
const poster = '/hero.jpg'

const ytEl = ref(null)
const ytWrap = ref(null)
const ready = ref(false)
const useVideo = ref(true)

function getYouTubeId (url) {
  const m = (url || '').match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|shorts\/|watch\?v=|v\/))([A-Za-z0-9_-]{11})/
  )
  return m ? m[1] : null
}

const videoId = getYouTubeId(youtubeUrl)

const embedSrc = computed(() => {
  if (!videoId) return ''
  const base = `https://www.youtube-nocookie.com/embed/${videoId}`
  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    controls: '0',
    loop: '1',
    playlist: videoId,
    playsinline: '1',
    modestbranding: '1',
    rel: '0',
    showinfo: '0',
    iv_load_policy: '3',
    enablejsapi: '1'
  })
  return `${base}?${params.toString()}`
})

let io = null

function ytCommand (func) {
  try {
    ytEl.value?.contentWindow?.postMessage(
      JSON.stringify({
        event: 'command',
        func,
        args: []
      }),
      '*'
    )
  } catch (e) {
    console.log(e)
  }
}

onMounted(async () => {
  const m =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)')

  // se l’utente preferisce meno animazioni o non hai un videoId → niente video
  if ((m && m.matches) || !videoId) {
    useVideo.value = false
  }

  await nextTick()
  requestAnimationFrame(() => {
    ready.value = true
  })

  if ('IntersectionObserver' in window && useVideo.value && embedSrc.value) {
    io = new IntersectionObserver(
      entries => {
        const entry = entries[0]
        if (!entry) return

        if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
          ytCommand('playVideo')
        } else {
          ytCommand('pauseVideo')
        }
      },
      { threshold: [0, 0.4, 1] }
    )

    if (ytWrap.value) {
      io.observe(ytWrap.value)
    }
  }
})

onBeforeUnmount(() => {
  if (io) io.disconnect()
})
</script>

<style scoped>
.hero {
  position: relative;
  height: 100dvh;
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.video {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.iframe {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 56.25vw; /* 16:9 base */
  min-width: 177.78vh;
  min-height: 100vh; /* cover anche in verticale */
  transform: translate(-50%, -50%);
  border: 0;
}

.poster {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.22) 0%,
    rgba(0, 0, 0, 0.08) 35%,
    rgba(0, 0, 0, 0.28) 100%
  );
  mix-blend-mode: multiply;
  pointer-events: none;
}

.content {
  width: fit-content;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 12vh;
  z-index: 2;
  width: min(1100px, 92vw);
  margin: 0 auto;
  color: #fff;
  padding: 0 12px;
  text-align: center;
}

.title {
  font-size: clamp(28px, 10%, 64px);
  line-height: 1.04;
  letter-spacing: -0.02em;
  font-weight: 800;
  text-shadow: 0 6px 28px rgba(0, 0, 0, 0.35);
  margin: 0;
}

.subtitle {
  margin-top: 0.5rem;
  font-size: clamp(14px, 3.8vw, 20px);
  opacity: 0.95;
  text-shadow: 0 3px 18px rgba(0, 0, 0, 0.32);
}

/* tablet+ */
@media (min-width: 768px) {
  .content {
    padding: 0 16px;
    bottom: 14vh;
  }
  .title {
    font-size: clamp(36px, 10%, 72px);
  }
  .subtitle {
    font-size: clamp(15px, 2.2vw, 22px);
  }
}
</style>

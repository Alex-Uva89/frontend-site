<template>
  <section class="hero" :class="{ 'is-ready': ready }" role="banner" :aria-label="ariaLabel">
    <!-- SLIDER (se >1 immagine) -->
    <div v-if="isSlider" class="media slider">
      <q-carousel
        ref="carouselEl"
        v-model="slide"
        swipeable
        animated
        infinite
        :autoplay="autoplayMs"
        transition-prev="slide-right"
        transition-next="slide-left"
        :arrows="false"
        :navigation="false"
        class="carousel"
      >
        <q-carousel-slide
          v-for="(img, i) in imagesArr"
          :key="i"
          :name="i"
          class="carousel__slide"
        >
          <!-- FULL COVER -->
          <div class="slide__img" :style="{ backgroundImage: `url(${img.src || img})` }"></div>
        </q-carousel-slide>
      </q-carousel>
    </div>

    <!-- IMMAGINE SINGOLA (FULL COVER) -->
    <div v-else class="media poster" :style="{ backgroundImage: `url(${imagesArr[0]})` }"></div>

    <!-- OVERLAY -->
    <div v-if="overlay" class="overlay" :style="{ background: overlayGradient }"></div>

    <!-- CONTENUTO -->
    <div class="content" :style="contentStyle">
      <slot name="eyebrow"></slot>
      <h1 v-if="title" class="title anim" style="--d:80ms">{{ title }}</h1>
      <p  v-if="subtitle" class="subtitle anim" style="--d:160ms">{{ subtitle }}</p>
      <slot />
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  images: { type: [Array, String], default: () => [] }, // ['url', ...] o [{src,alt}]
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  ariaLabel: { type: String, default: 'Hero' },

  autoplay: { type: Boolean, default: true }, // solo slider
  interval: { type: Number, default: 4500 },
  overlay: { type: Boolean, default: true },
  overlayGradient: {
    type: String,
    default: 'linear-gradient(180deg, rgba(0,0,0,.22) 0%, rgba(0,0,0,.08) 35%, rgba(0,0,0,.28) 100%)'
  },
  contentBottom: { type: String, default: '12vh' },
  align: { type: String, default: 'left' } // 'left' | 'center' | 'right'
})

const ready = ref(false)
const slide = ref(0)
const carouselEl = ref(null)
const inView = ref(true)

const imagesArr = computed(() => {
  if (Array.isArray(props.images)) return props.images
  return props.images ? [props.images] : []
})
const isSlider = computed(() => imagesArr.value.length > 1)

const autoplayMs = computed(() =>
  (props.autoplay && inView.value && isSlider.value) ? props.interval : 0
)

const contentStyle = computed(() => ({
  bottom: props.contentBottom,
  ...(props.align === 'center' ? { textAlign: 'center' } :
     props.align === 'right'  ? { textAlign: 'right' }  : {})
}))

// pausa autoplay quando l'hero non è visibile
let io = null
onMounted(async () => {
  await nextTick()
  requestAnimationFrame(() => { ready.value = true })

  if ('IntersectionObserver' in window && isSlider.value) {
    io = new IntersectionObserver((entries) => {
      inView.value = !!entries[0]?.isIntersecting
    }, { threshold: [0, 0.35, 1] })
    const target = carouselEl.value?.$el
    if (target) io.observe(target)
  }
})
onBeforeUnmount(() => { io && io.disconnect() })
</script>

<style scoped>
.hero{
  position: relative;
  height: 100dvh; min-height: 100vh; width: 100vw;
  margin: 0; padding: 0; overflow: hidden;
}

/* MEDIA WRAPPERS */
.media{ position:absolute; inset:0; width:100%; height:100%; }
.poster{ background-size: cover; background-position: center; }

/* CAROUSEL FULL-BLEED */
.carousel{ position:absolute; inset:0; width:100%; height:100%; }
.carousel__slide{ position:relative; width:100%; height:100%; }
.slide__img{
  position:absolute; inset:0;
  width:100%; height:100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* OVERLAY */
.overlay{
  position:absolute; inset:0; z-index:1;
  pointer-events:none; mix-blend-mode:multiply;
}

/* CONTENT */
.content{
  position:absolute; left:0; right:0; z-index:2;
  width:min(1100px, 92vw); margin:0 auto; color:#fff; padding:0 12px;
  text-align:left; bottom:12vh;
}
.title{
  margin:0; font-size:clamp(28px, 8vw, 64px); line-height:1.04;
  letter-spacing:-.02em; font-weight:800; text-shadow:0 6px 28px rgba(0,0,0,.35);
}
.subtitle{
  margin-top:.5rem; font-size:clamp(14px, 3.8vw, 20px);
  max-width:70ch; opacity:.95; text-shadow:0 3px 18px rgba(0,0,0,.32);
}

/* Motion */
.anim{ opacity:0; transform: translateY(8px); }
.is-ready .anim{ opacity:1; transform:none; transition: opacity .45s ease, transform .45s ease; transition-delay: var(--d,0ms); }
@media (prefers-reduced-motion: reduce){
  .anim, .is-ready .anim{ opacity:1 !important; transform:none !important; transition:none !important; }
}

/* Tablet+ */
@media (min-width:768px){
  .content{ padding:0 16px; bottom:14vh; }
  .title{ font-size:clamp(36px, 6vw, 72px); }
  .subtitle{ font-size:clamp(15px, 2.2vw, 22px); }
}
</style>

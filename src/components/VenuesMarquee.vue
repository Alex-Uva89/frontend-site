<template>
  <section class="venues">
    <div class="container">
      <div class="heading">
        <h2 class="title">{{ $t('venues.title', 'I nostri locali') }}</h2>
        <p class="subtitle">
          {{ $t('venues.subtitle', 'Cinque indirizzi a Lecce, una sola filosofia: qualità senza compromessi.') }}
        </p>
      </div>
    </div>

    <div
      ref="wrapEl"
      class="marquee"
      :style="{ '--speed': speed + 's' }"
      @mouseenter="pauseHover(true)"
      @mouseleave="pauseHover(false)"
      aria-hidden="true"
    >
      <div class="track" :class="{ paused: isPaused }">
        <div class="slide" v-for="(v, i) in looped" :key="v.id + '-' + i">
          <VenueCard :venue="v" :height="height" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { venues as defaultVenues } from 'src/stores/venues.js'
import VenueCard from './VenueCard.vue'

const props = defineProps({
  items: { type: Array, default: () => defaultVenues },
  speed: { type: Number, default: 48 },          // secondi per un ciclo completo
  height: { type: String, default: '760px' },     // altezza card fissa
  pauseOnHover: { type: Boolean, default: true }  // pausa su hover
})

const wrapEl = ref(null)
const paused = ref(false)
const inView = ref(true) // pausa auto quando la sezione esce dalla viewport

const isPaused = computed(() => paused.value || !inView.value)

// triplichiamo la lista per loop senza scatti
const looped = computed(() => [...props.items, ...props.items, ...props.items])

function pauseHover (state) {
  if (!props.pauseOnHover) return
  paused.value = state
}

let io = null
onMounted(() => {
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver((entries) => {
      const e = entries[0]
      inView.value = e.isIntersecting
    }, { threshold: 0.1 })
    if (wrapEl.value) io.observe(wrapEl.value)
  }
})
onBeforeUnmount(() => { if (io) io.disconnect() })
</script>

<style scoped>
.venues{
  background: #fff;
  padding: clamp(24px, 4vh, 40px) 0 clamp(40px, 6vh, 72px);
}
.container{
  max-width: 1100px;
  padding: 0 16px;
  margin: 100px 50px;
}
.heading{ display: grid; gap: 6px; margin-bottom: clamp(8px, 2vh, 16px); }
.title{
  font-size: clamp(22px, 3.2vw, 30px);
  margin: 0;
}
.subtitle{
  margin: 0;
  opacity: .8;
  font-size: clamp(13px, 2vw, 16px);
}

/* Marquee infinito con fade morbido ai lati */
.marquee{
  overflow: hidden;
  /* fade ai lati più ampio per card grandi */
  mask-image: linear-gradient(90deg, transparent 0%, #000 10%, #000 90%, transparent 100%);
}
.track{
  display: flex;
  gap: 24px;
  width: max-content;
  animation: scroll var(--speed) linear infinite;
  will-change: transform;
}
.track.paused{ animation-play-state: paused; }
.slide{ flex: 0 0 auto; }

@keyframes scroll{
  /* triplo elenco => trasliamo di 33.333% per un loop perfetto */
  0%   { transform: translateX(0); }
  100% { transform: translateX(-33.333%); }
}
</style>

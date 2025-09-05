<template>
  <section class="venues">
    <div class="container">
      <div class="heading">
        <h2 class="title">{{ $t('venues.title','I nostri locali') }}</h2>
        <p class="subtitle">{{ $t('venues.subtitle','Cinque indirizzi a Lecce, una sola filosofia: qualità senza compromessi.') }}</p>
      </div>
    </div>

    <div ref="wrapEl" class="marquee" :style="{ '--speed': speed + 's' }"
      @mouseenter="pauseHover(true)" @mouseleave="pauseHover(false)" aria-hidden="true">
      <div class="track" :class="{ paused: isPaused }">
        <div class="slide" v-for="(v,i) in looped" :key="v.id+'-'+i">
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
  speed: { type: Number, default: 52 },
  height: { type: String, default: '440px' },
  pauseOnHover: { type: Boolean, default: true }
})

const wrapEl = ref(null)
const paused = ref(false)
const inView = ref(true)
const isPaused = computed(() => paused.value || !inView.value)
const looped = computed(() => [...props.items, ...props.items, ...props.items])

function pauseHover(v){ if(props.pauseOnHover) paused.value=v }

let io=null
onMounted(()=>{ if('IntersectionObserver' in window){ io=new IntersectionObserver((e)=>{ inView.value=e[0].isIntersecting },{threshold:.1}); wrapEl.value && io.observe(wrapEl.value) } })
onBeforeUnmount(()=>{ io && io.disconnect() })
</script>

<style scoped>
.venues{ background:#fff; padding:24px 0 40px; }
.container{ max-width:1100px; margin:0 auto; padding:0 12px; }
.heading{ display:grid; gap:6px; margin-bottom:12px; }
.title{ font-size:clamp(20px,6vw,28px); margin:0; }
.subtitle{ margin:0; opacity:.8; font-size:clamp(12px,3.6vw,16px); }

/* marquee */
.marquee{ overflow:hidden; mask-image:linear-gradient(90deg, transparent 0%, #000 10%, #000 90%, transparent 100%); }
.track{ display:flex; gap:16px; width:max-content; animation:scroll var(--speed) linear infinite; will-change:transform; }
.track.paused{ animation-play-state:paused; }
.slide{ flex:0 0 auto; }

@keyframes scroll{ 0%{ transform:translateX(0) } 100%{ transform:translateX(-33.333%) } }

/* tablet+ */
@media (min-width:768px){
  .container{ padding:0 16px; }
  .track{ gap:24px; }
}

/* desktop+ */
@media (min-width:1200px){
  .container{ padding:0 24px; }
}
</style>

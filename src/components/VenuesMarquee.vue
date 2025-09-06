<template>
  <section class="venues">
    <div class="container">
      <div class="heading">
        <h2 class="title">{{ $t('venues.title','I nostri locali') }}</h2>
        <p class="subtitle">
          {{ $t('venues.subtitle','Cinque indirizzi a Lecce, una sola filosofia: qualità senza compromessi.') }}
        </p>
      </div>
    </div>

    <!-- MOBILE: scorrimento a dito + ghost arrows -->
    <div v-if="isMobile" ref="scrollerEl" class="scroller" role="region" :aria-label="$t('venues.title')"
         @scroll="onScroll">
      <div class="slides" ref="slidesEl">
        <div class="slide" v-for="v in items" :key="v.id">
          <VenueCard :venue="v" :height="cardHeight" />
        </div>
      </div>

      <!-- hint gradient ai lati -->
      <div class="edge edge--left" :class="{ hide: atStart || !canScroll }"></div>
      <div class="edge edge--right" :class="{ hide: atEnd || !canScroll }"></div>

      <!-- ghost arrows -->
      <q-btn v-if="canScroll" class="arrow arrow--left" flat round dense icon="chevron_left"
             :disable="atStart" :ripple="false" @click="scrollByStep(-1)" aria-label="precedente" />
      <q-btn v-if="canScroll" class="arrow arrow--right" flat round dense icon="chevron_right"
             :disable="atEnd" :ripple="false" @click="scrollByStep(1)" aria-label="successivo" />
    </div>

    <!-- DESKTOP: marquee auto -->
    <div v-else ref="wrapEl" class="marquee" :style="{ '--speed': autoSpeed + 's' }"
         @mouseenter="pauseHover(true)" @mouseleave="pauseHover(false)" aria-hidden="true">
      <div class="track" :class="{ paused: isPaused }">
        <div class="slide" v-for="(v,i) in looped" :key="v.id+'-'+i">
          <VenueCard :venue="v" :height="cardHeight" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { venues as defaultVenues } from 'src/stores/venues.js'
import VenueCard from './VenueCard.vue'

const props = defineProps({
  items: { type: Array, default: () => defaultVenues },
  speed: { type: Number, default: 52 },            // desktop
  pauseOnHover: { type: Boolean, default: true },
  cardHeight: { type: String, default: '640px' }
})

/* ----- desktop autoplay ----- */
const autoSpeed = computed(() => props.speed)
const wrapEl = ref(null)
const paused = ref(false)
const inView = ref(true)
const isPaused = computed(() => paused.value || !inView.value)
const looped = computed(() => [...props.items, ...props.items, ...props.items])

function pauseHover (v) { if (props.pauseOnHover) paused.value = v }

/* ----- mobile scroller + arrows + haptics ----- */
const isMobile = ref(true)
let mql

const scrollerEl = ref(null)
const slidesEl = ref(null)
const atStart = ref(true)
const atEnd = ref(false)
const canScroll = ref(false)
let step = 320 // fallback
let prevAtStart = true
let prevAtEnd = false

function vibrate (ms = 12) {
  if (navigator?.vibrate) navigator.vibrate(ms)
}

function measureStep () {
  const first = slidesEl.value?.querySelector('.slide')
  if (!first) return
  const style = window.getComputedStyle(slidesEl.value)
  const gap = parseFloat(style.columnGap || style.gap || '0')
  step = first.getBoundingClientRect().width + gap
}

function measureScrollable () {
  const el = scrollerEl.value
  if (!el) return
  canScroll.value = el.scrollWidth > el.clientWidth + 2
  updateEdges()
}

function updateEdges () {
  const el = scrollerEl.value
  if (!el) return
  const nearStart = el.scrollLeft <= 2
  const nearEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 2

  atStart.value = nearStart
  atEnd.value = nearEnd

  // haptic quando raggiungi un estremo
  if (nearStart && !prevAtStart) vibrate(10)
  if (nearEnd && !prevAtEnd) vibrate(10)
  prevAtStart = nearStart
  prevAtEnd = nearEnd
}

function onScroll () { updateEdges() }

function scrollByStep (dir = 1) {
  const el = scrollerEl.value
  if (!el) return
  vibrate(8) // feedback al tap
  el.scrollBy({ left: dir * step, behavior: 'smooth' })
}

onMounted(async () => {
  mql = window.matchMedia('(max-width: 768px)')
  const set = () => { isMobile.value = mql.matches }
  set()
  mql.addEventListener?.('change', set)

  await nextTick()
  measureStep()
  measureScrollable()
  window.addEventListener('resize', measureStep, { passive: true })
  window.addEventListener('resize', measureScrollable, { passive: true })

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((e) => { inView.value = e[0].isIntersecting }, { threshold: .1 })
    wrapEl.value && io.observe(wrapEl.value)
    onBeforeUnmount(() => io.disconnect())
  }
})

onBeforeUnmount(() => {
  mql?.removeEventListener?.('change', () => {})
  window.removeEventListener('resize', measureStep)
  window.removeEventListener('resize', measureScrollable)
})
</script>

<style scoped>
.venues{ background:#fff; padding:24px 0 40px; }
.container{ max-width:1100px; margin:0 auto; padding:0 12px; }
.heading{ display:grid; gap:6px; margin-bottom:12px; }
.title{ font-size:clamp(20px,6vw,28px); margin:0; }
.subtitle{ margin:0; opacity:.8; font-size:clamp(12px,3.6vw,16px); }

/* ===== MOBILE: scroll a dito ===== */
.scroller{
  position: relative;
  padding: 0 8px;
}
.slides{
  display:flex; gap:14px;
  overflow-x:auto;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type:x mandatory;
  scrollbar-width:none;
}
.slides::-webkit-scrollbar{ display:none; }
.slide{ flex:0 0 auto; scroll-snap-align:start; }

/* fade ai lati */
.edge{
  position:absolute; top:0; bottom:0; width:36px; pointer-events:none;
  background: linear-gradient(90deg, #fff 0%, rgba(255,255,255,0) 100%);
  transition: opacity .25s ease;
}
.edge.hide{ opacity:0; }
.edge--left{ left:0; }
.edge--right{ right:0; transform: scaleX(-1); }

/* ghost arrows */
.arrow{
  position:absolute; top:50%; transform:translateY(-50%);
  width:42px; height:42px;
  border:1px solid rgba(0,0,0,.25);
  border-radius:999px;
  backdrop-filter: blur(3px);
  background: rgba(255,255,255,.7);
  color:#111;
  box-shadow: 0 6px 16px rgba(0,0,0,.12);
}
.arrow--left{ left:12px; }
.arrow--right{ right:12px; }
.arrow:disabled{ opacity:.45; }

/* ===== DESKTOP: marquee auto ===== */
.marquee{ overflow:hidden; mask-image:linear-gradient(90deg, transparent 0%, #000 10%, #000 90%, transparent 100%); }
.track{ display:flex; gap:24px; width:max-content; animation:scroll var(--speed) linear infinite; will-change:transform; }
.track.paused{ animation-play-state:paused; }
@keyframes scroll{ 0%{ transform:translateX(0) } 100%{ transform:translateX(-33.333%) } }

/* tablet+ */
@media (min-width:768px){
  .container{ padding:0 16px; }
}

/* desktop+ */
@media (min-width:1200px){
  .container{ padding:0 24px; }
}
</style>

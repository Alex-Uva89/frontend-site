<template>
  <q-page class="venues-page q-pa-none">
    <div class="wrap">
      <!-- Header -->
      <header class="head">
        <div class="pretitle">{{ $t('venues.pretitle','Scopri i nostri spazi') }}</div>
        <h1 class="title">{{ $t('venues.title','I nostri locali') }}</h1>
        <p class="subtitle">
          {{ $t('venues.subtitle','Tutti nel cuore di Lecce — trova quello giusto per te') }}
        </p>
      </header>

      <!-- Controls -->
      <section class="controls" aria-label="Filtri e ricerca">
        <div class="controls__left">
          <q-input
            v-model="search"
            dense outlined clearable
            debounce="120"
            class="search"
            :placeholder="$t('search.placeholder','Cerca locale o indirizzo…')"
            :aria-label="$t('search.label','Cerca')"
            prefix-icon="search"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <div class="chips" role="tablist" aria-label="Filtra per tipologia">
            <button
              class="chip" role="tab"
              :aria-selected="activeKind===null" :class="{active: activeKind===null}"
              @click="setKind(null)"
            >{{ $t('all','Tutti') }}</button>

            <button
              v-for="k in kinds" :key="k"
              class="chip" role="tab"
              :aria-selected="activeKind===k" :class="{active: activeKind===k}"
              @click="setKind(k)"
            >{{ k }}</button>
          </div>
        </div>

        <div class="controls__right">
          <q-select
            v-model="sortMode"
            :options="sortOptions"
            dense outlined emit-value map-options
            class="sortSelect"
            :aria-label="$t('sort.by','Ordina per')"
          />
          <q-btn
            dense outline no-caps class="btn ghost"
            icon="my_location"
            :label="userLoc ? $t('near.recenter','Usa posizione') : $t('near.me','Vicino a me')"
            @click="locateMe"
          />
        </div>
      </section>

      <!-- Lista card -->
      <section class="cards" role="list">
        <article
          v-for="v in venuesListed"
          :key="v.id"
          class="vcard"
          role="listitem"
          @click="goToVenue(v.id)"
        >
          <!-- Bg immagine -->
          <div class="vcard__bg" :style="{ backgroundImage:`url(${v.image})` }" aria-hidden="true"></div>

          <!-- Top: nome + stato -->
          <div class="vcard__top">
            <h3 class="vcard__title">{{ v.name }}</h3>
            <span class="vcard__badge" :class="{ open: isOpenNow(v) }">
              {{ isOpenNow(v) ? $t('open.now','Aperto ora') : $t('closed.now','Chiuso') }}
            </span>
          </div>

          <!-- Meta -->
          <p class="vcard__meta">
            <span class="addr">{{ v.address }}</span>
            <template v-if="typeof v.distanceKm === 'number'">
              · <span class="km">{{ v.distanceKm.toFixed(1) }} km</span>
            </template>
            <span class="kind">{{ v.kind }}</span>
          </p>

          <!-- Bottom CTA -->
          <div class="vcard__bottom" @click.stop>
            <div class="vcard__cta">
              <q-btn no-caps unelevated class="btn primary"
                :label="$t('book','Prenota')" :href="v.bookingUrl" target="_blank" />
              <q-btn no-caps outline class="btn ghost"
                :label="$t('menu','Menu')" :href="v.menuUrl" />
              <q-btn no-caps flat class="btn link"
                :label="$t('details','Dettagli')" @click="goToVenue(v.id)" />
            </div>
          </div>
        </article>
      </section>

      <!-- Sezione estetica extra -->
      <section class="after-cards">

        <!-- Micro timeline / oggi in città -->
        <div class="timeline">
          <h2 class="timeline__title">
            {{ $t('today.title','Oggi nei nostri locali') }}
          </h2>
          <ul class="timeline__list">
            <li class="timeline__item" v-for="(p,i) in promos" :key="i">
              <span class="dot"></span>
              <div class="body">
                <div class="when">{{ p.when }}</div>
                <div class="what">{{ p.text }}</div>
              </div>
            </li>
          </ul>
        </div>

        <!-- Banner decorativo -->
        <div class="ribbon">
          <div class="ribbon__inner">
            <span>Salento vibes</span>
            <span aria-hidden="true">•</span>
            <span>caffè al sole</span>
            <span aria-hidden="true">•</span>
            <span>aperitivi lunghi</span>
            <span aria-hidden="true">•</span>
            <span>cucina locale</span>
          </div>
        </div>
      </section>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { venues as data } from 'src/stores/venues.js'

const router = useRouter()

/* ===== Stato UI ===== */
const search = ref('')
const activeKind = ref(null)
const sortMode = ref('open') // 'open' | 'alpha' | 'distance'

const sortOptions = [
  { label: 'Aperti prima', value: 'open' },
  { label: 'Alfabetico (A→Z)', value: 'alpha' },
  { label: 'Distanza', value: 'distance' }
]

/* ===== Dati & filtri ===== */
const all = computed(() =>
  data.filter(v => v.coords && Number.isFinite(v.coords.lng) && Number.isFinite(v.coords.lat))
)
const kinds = computed(() => Array.from(new Set(all.value.map(v => v.kind))).sort())
function setKind(k){ activeKind.value = k }

const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  return all.value.filter(v => {
    const byKind = activeKind.value ? v.kind === activeKind.value : true
    if (!term) return byKind
    const hay = `${v.name} ${v.address} ${v.kind}`.toLowerCase()
    return byKind && hay.includes(term)
  })
})

/* ===== Orari: aperto/chiuso ===== */
function isOpenNow (v){
  try{
    const now = new Date()
    const day = (now.getDay()+6)%7 // 0=Mon
    const today = v.hours?.[day]
    if (today === '24h') return true
    if (!Array.isArray(today) || !today.length) return false
    const t = now.toTimeString().slice(0,5)
    return today.some(({o,c}) => {
      if(!o||!c) return false
      if (c < o) return (t >= o) || (t <= c) // overnight
      return t >= o && t <= c
    })
  }catch{ return false }
}

/* ===== Geolocalizzazione (opzionale per ordinamento per distanza) ===== */
const userLoc = ref(null)
function locateMe(){
  if (!navigator.geolocation) return
  navigator.geolocation.getCurrentPosition(
    ({coords}) => { userLoc.value = { lng: coords.longitude, lat: coords.latitude } },
    () => {},
    { enableHighAccuracy: true, maximumAge: 20_000, timeout: 10_000 }
  )
}
function haversineKm(a, b){
  const R = 6371
  const toRad = (d) => d * Math.PI/180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat), lat2 = toRad(b.lat)
  const h = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLng/2)**2
  return 2*R*Math.asin(Math.sqrt(h))
}

/* ===== Lista ordinata ===== */
const venuesListed = computed(() => {
  const base = filtered.value.map(v => ({
    ...v,
    distanceKm: userLoc.value ? haversineKm(userLoc.value, v.coords) : null
  }))

  if (sortMode.value === 'alpha') {
    return base.sort((a,b) => a.name.localeCompare(b.name))
  }
  if (sortMode.value === 'distance') {
    return base.sort((a,b) => {
      if (a.distanceKm == null && b.distanceKm == null) return a.name.localeCompare(b.name)
      if (a.distanceKm == null) return 1
      if (b.distanceKm == null) return -1
      return a.distanceKm - b.distanceKm
    })
  }
  // default: open first, then alpha
  return base.sort((a,b) => {
    const ao = isOpenNow(a), bo = isOpenNow(b)
    if (ao !== bo) return ao ? -1 : 1
    return a.name.localeCompare(b.name)
  })
})


/* ===== Navigazione ===== */
function goToVenue (id){ router.push({ name: 'locale', params: { id } }) }
</script>

<style scoped>
/* ===== Palette =====
  Sepia 900: #2a2019
  Clay 400:  #c97e63
  Stone 100: #efe6d3
==================================== */
.venues-page{
  --sepia-900: #2a2019;
  --clay-400:  #c97e63;
  --stone-100: #efe6d3;
  background: var(--stone-100);
  min-height: 100%;
  color: var(--sepia-900);
  padding-top: max(84px, env(safe-area-inset-top));
}

/* ===== Wrapper ===== */
.wrap{ width:min(1120px, 92vw); margin: 10px auto 28px; }

/* ===== Header ===== */
.head{ text-align:left; }
.pretitle{
  display:inline-block; font-weight:800; letter-spacing:.08em; text-transform:uppercase;
  font-size:11px; opacity:.7; border:1px solid rgba(42,32,25,.18);
  padding:4px 8px; border-radius:999px; background: rgba(255,255,255,.6);
}
.title{ margin:.35rem 0 0; font-size: clamp(26px, 4vw, 40px); line-height:1.05; }
.subtitle{ margin:6px 0 0; opacity:.76; font-size: clamp(12px,3.2vw,15px); }

/* ===== Controls ===== */
.controls{
  display:flex; align-items:flex-start; justify-content:space-between;
  gap:14px; margin: 16px 0 10px; flex-wrap: wrap;
}
.controls__left{ display:flex; flex-direction:column; gap:10px; min-width: 240px; flex:1 }
.controls__right{ display:flex; gap:8px; align-items:center; flex-wrap: wrap; }

.search{ width:min(520px, 100%); }
.sortSelect{ min-width: 180px; }
.btn.ghost{ border-color: rgba(42,32,25,.3); color:#2a2019; background:#fff; }

.chips{
  display:flex; gap:8px; overflow:auto; padding:6px; flex-wrap: wrap;
  -webkit-overflow-scrolling:touch; scrollbar-width:none;
  background: rgba(255,255,255,.55);
  border:1px solid rgba(42,32,25,.12);
  border-radius: 14px;
}
.chips::-webkit-scrollbar{ display:none }
.chip{
  all:unset; cursor:pointer; padding:10px 14px; border-radius:999px;
  border:1px solid rgba(42,32,25,.16); background:#f6f1e7;
  color:#2a2019; font-weight:800; letter-spacing:.02em; font-size:14px; line-height:1; min-height:40px;
  white-space:nowrap;
}
.chip.active{ background: rgba(142,160,115,.18); border-color: rgba(42,32,25,.26); }

/* ===== Cards grid ===== */
.cards{
  display:grid;
  gap: 18px;
  margin-top: 12px;
  grid-template-columns: 1fr; /* mobile */
}

/* Tablet */
@media (min-width: 768px){
  .cards{ grid-template-columns: repeat(2, 1fr); }
}

/* Desktop 3 colonne */
@media (min-width: 1024px){
  .cards{ grid-template-columns: repeat(3, 1fr); gap: 20px; }
}

/* ===== Card ===== */
.vcard{
  position: relative;
  min-height: 72vh; /* mobile quasi fullscreen */
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(42,32,25,.12);
  background: #ddd;
  display: grid;
  grid-template-rows: auto 1fr auto; /* top | content | bottom */
  transition: transform .25s ease, box-shadow .25s ease;
  cursor: pointer;
}
@media (min-width: 1024px){
  .vcard{ min-height: 440px; }
}
.vcard:hover{
  transform: translateY(-2px);
  box-shadow: 0 18px 50px rgba(0,0,0,.15);
}

/* Bg & overlays */
.vcard__bg{
  position:absolute; inset:0; z-index:0;
  background-size: cover; background-position: center;
  transform: scale(1.02); transition: transform .35s ease;
  filter: saturate(1.02);
}
.vcard::before{
  /* top gradient */
  content:""; position:absolute; inset:0 0 52% 0; z-index:0;
  background: linear-gradient(to bottom, rgba(0,0,0,.6), rgba(0,0,0,0));
  pointer-events:none;
}
.vcard::after{
  /* bottom gradient */
  content:""; position:absolute; inset:58% 0 0 0; z-index:0;
  background: linear-gradient(to top, rgba(0,0,0,.55), rgba(0,0,0,0));
  pointer-events:none;
}
.vcard:hover .vcard__bg{ transform: scale(1.06); }

/* Top bar */
.vcard__top{
  position: relative; z-index:1;
  display:flex; align-items:center; justify-content:space-between;
  padding: 16px;
}
.vcard__title{
  margin:0; font-size: clamp(18px, 2.2vw, 24px); line-height:1.2;
  color:#fff; text-shadow: 0 1px 2px rgba(0,0,0,.35);
  max-width: 72%;
}
.vcard__badge{
  font-size:12px; font-weight:800;
  padding:8px 12px; border-radius:999px;
  background: rgba(42,32,25,.78); color:#fff; border:1px solid rgba(255,255,255,.25);
  white-space: nowrap;
}
.vcard__badge.open{ background: rgba(142,160,115,.92); color:#1b2316 }

/* Meta */
.vcard__meta{
  position: relative; z-index:1;
  margin: 2px 16px 0;
  color: #fff; opacity:.92;
  text-shadow: 0 1px 2px rgba(0,0,0,.35);
  font-size: 14px; display:flex; gap:8px; align-items:center; flex-wrap:wrap;
}
.vcard__meta .kind{
  margin-left:auto; font-size:11px; font-weight:800;
  padding:4px 8px; border-radius:999px; background: rgba(255,255,255,.22); border:1px solid rgba(255,255,255,.35);
}

/* Bottom CTA */
.vcard__bottom{
  position: relative; z-index:1;
  margin-top: auto;
  padding: 14px 16px 16px;
}
.vcard__cta{ display:flex; gap:10px; flex-wrap:wrap; }
.btn.primary{ background:var(--clay-400); color:#f6f1e7; }
.btn.ghost{ border-color: rgba(255,255,255,.7); color:#fff; background: rgba(255,255,255,.06); }
.btn.link{ color:#fff; text-decoration: underline; }

/* ===== After cards (estetica extra) ===== */
.after-cards{ margin-top: 28px; display:grid; gap:20px; }

/* Stats */
.stats{
  display:grid; grid-template-columns: repeat(3, 1fr); gap:12px;
}
@media (max-width: 640px){
  .stats{ grid-template-columns: 1fr 1fr 1fr; }
}
.stat{
  background: rgba(255,255,255,.7);
  border:1px solid rgba(42,32,25,.12);
  border-radius: 14px; padding: 14px;
  display:grid; gap:4px; place-items:center;
}
.stat__num{ font-size: 28px; font-weight: 900; line-height:1 }
.stat__label{ font-size: 12px; letter-spacing:.02em; opacity:.8 }

/* Micro timeline */
.timeline{
  background: linear-gradient(180deg, rgba(255,255,255,.7), rgba(255,255,255,.45));
  border:1px solid rgba(42,32,25,.12);
  border-radius: 16px; padding: 14px 14px 6px;
}
.timeline__title{ margin:0 0 8px; font-size:16px; opacity:.9 }
.timeline__list{
  list-style:none; margin:0; padding:0;
  display:grid; gap:10px;
}
.timeline__item{ display:flex; gap:10px; align-items:flex-start; }
.timeline .dot{
  width:10px; height:10px; border-radius:50%; margin-top:5px;
  background: var(--clay-400); box-shadow: 0 0 0 3px rgba(201,126,99,.2);
}
.timeline .body{ display:grid; gap:2px }
.timeline .when{ font-size:12px; opacity:.7 }
.timeline .what{ font-size:14px; font-weight:700 }

/* Ribbon decorativo */
.ribbon{
  overflow:hidden; border-radius: 14px; border:1px dashed rgba(42,32,25,.2);
  background: repeating-linear-gradient(45deg, rgba(201,126,99,.06), rgba(201,126,99,.06) 12px, rgba(0,0,0,0) 12px, rgba(0,0,0,0) 24px);
}
.ribbon__inner{
  display:flex; gap:18px; padding:10px 12px; font-weight:800; letter-spacing:.04em;
  text-transform:uppercase; font-size:12px; opacity:.85;
  animation: slideX 28s linear infinite;
  white-space:nowrap;
}
@keyframes slideX{
  from{ transform: translateX(0) }
  to{ transform: translateX(-50%) }
}

/* Motion safe */
@media (prefers-reduced-motion: reduce){
  *{ transition:none !important; animation:none !important; }
}
</style>

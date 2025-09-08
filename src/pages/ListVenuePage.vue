<template>
  <q-page class="map-experience q-pa-none">
    <div class="wrap">
      <!-- Header -->
      <header class="head">
        <h1 class="title">{{ $t('venues.title','I nostri locali') }}</h1>
        <p class="subtitle">
          {{ $t('venues.subtitle','Tutti nel cuore di Lecce — scopri quello giusto per te') }}
        </p>
      </header>

      <!-- Controls (mobile-first) -->
      <div class="controls">
        <!-- Filtri scrollabili orizzontali -->
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

        <!-- Azioni: stile mappa + geolocate -->
        <div class="actions">
          <q-select
            v-model="currentStyle"
            :options="mapStylesOptions"
            dense outlined emit-value map-options
            class="styleSelect"
            :aria-label="$t('map.style','Stile mappa')"
          />
          <q-btn dense outline no-caps class="btn ghost"
                 icon="my_location" :label="$t('near.me','Vicino a me')"
                 @click="locateMe" />
        </div>
      </div>

      <!-- MAP shell (non-hero) -->
      <section class="map-shell">
        <div ref="mapEl" class="map"></div>
        <!-- tinta + effetto sogno -->
        <div class="tint" aria-hidden="true"></div>
        <div class="dream-mask" aria-hidden="true"></div>

        <!-- legenda compatta -->
        <div class="legend">
          <details>
            <summary>{{ $t('venues.list','Elenco') }}</summary>
            <ul>
              <li v-for="v in venuesFiltered" :key="v.id">
                <button @click="focusVenue(v.id)">{{ v.name }}</button>
              </li>
            </ul>
          </details>
        </div>

        <!-- Scheda info (bottom sheet su mobile) -->
        <transition name="sheet">
          <aside v-if="selected" class="info" :class="{ mobile: isMobile }">
            <button class="info__close" @click="selected=null" aria-label="Chiudi">✕</button>
            <div class="info__media" :style="{ backgroundImage:`url(${selected.image})` }" />
            <div class="info__body">
              <h3 class="info__title">{{ selected.name }}</h3>
              <p class="info__addr">{{ selected.address }}</p>
              <div class="info__status" :class="{ open: isOpenNow(selected) }">
                {{ isOpenNow(selected) ? $t('open.now','Aperto ora') : $t('closed.now','Chiuso') }}
              </div>
              <div class="info__cta">
                <q-btn no-caps unelevated class="btn primary"
                       :label="$t('book','Prenota')" :href="selected.bookingUrl" target="_blank" />
                <q-btn no-caps outline class="btn ghost"
                       :label="$t('menu','Menu')" :href="selected.menuUrl" />
                <q-btn no-caps flat class="btn link"
                       :label="$t('details','Dettagli')" @click="goToVenue(selected.id)" />
              </div>
            </div>
          </aside>
        </transition>
      </section>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { venues as data } from 'src/stores/venues.js'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const router = useRouter()
const mapEl = ref(null)
let map = null
let markers = []

/* ========= Data ========= */
const all = computed(() =>
  data.filter(v => v.coords && Number.isFinite(v.coords.lng) && Number.isFinite(v.coords.lat))
)
const kinds = computed(() => Array.from(new Set(all.value.map(v => v.kind))).sort())
const activeKind = ref(null)
const venuesFiltered = computed(() =>
  activeKind.value ? all.value.filter(v => v.kind === activeKind.value) : all.value
)
function setKind(k){ activeKind.value = k }

/* ========= Stato / UI ========= */
const isMobile = computed(() => window.innerWidth < 768)
const selectedId = ref(null)
const selected = computed(() => all.value.find(v => v.id === selectedId.value))

function goToVenue (id){ router.push({ name: 'locale', params: { id } }) }
function focusVenue (id){
  const v = all.value.find(x => x.id === id); if(!v) return
  selectedId.value = id
  vibrate(12)
  map?.easeTo({ center: [v.coords.lng, v.coords.lat], zoom: Math.max(map.getZoom(), 15.2), duration: 600 })
}

/* ========= Orari ========= */
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

/* ========= Map Styles ========= */
const mapStylesOptions = [
  { label: 'OSM Standard', value: 'osm' },
  { label: 'OSM HOT',      value: 'osmHot' },
  { label: 'Carto Light',  value: 'cartoLight' },
  // Esempio VECTOR (serve key): { label:'MapTiler Streets', value:'maptiler' }
]
const currentStyle = ref('osm')

function rasterStyle (tiles, attribution, bg = '#e4d8c1'){
  return {
    version: 8,
    sources: {
      osm: { type: 'raster', tiles, tileSize: 256, attribution }
    },
    layers: [
      { id: 'bg', type: 'background', paint: { 'background-color': bg } },
      { id: 'raster', type: 'raster', source: 'osm' }
    ]
  }
}
function styleFor(id){
  switch(id){
    case 'osm':
      return rasterStyle(
        ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        '© OpenStreetMap contributors'
      )
    case 'osmHot':
      return rasterStyle(
        ['https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
         'https://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
         'https://c.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'],
        '© OpenStreetMap contributors, HOT'
      )
    case 'cartoLight':
      return rasterStyle(
        ['https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
         'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
         'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
         'https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'],
        '© CARTO, © OpenStreetMap'
      )
    // case 'maptiler': return 'https://api.maptiler.com/maps/streets/style.json?key=YOUR_KEY' // vettoriale
    default: return styleFor('osmHot')
  }
}

/* ========= Map init ========= */
onMounted(() => {
  map = new maplibregl.Map({
    container: mapEl.value,
    style: styleFor(currentStyle.value),
    center: [18.170, 40.352],
    zoom: 14,
    dragRotate: false,
    pitchWithRotate: false
  })
  map.addControl(new maplibregl.NavigationControl({ showCompass:false }), 'bottom-right')
  map.on('load', () => { addMarkers(); fitToVenues() })
})

onBeforeUnmount(() => { markers.forEach(m => m.remove()); map && map.remove() })

/* Cambia stile mappa al volo */
watch(currentStyle, (id) => {
  if (!map) return
  map.setStyle(styleFor(id))
  // I Marker DOM sopravvivono al cambio stile, ma rifittiamo
  map.once('styledata', () => fitToVenues())
})

/* ========= Marker handling (filtri FIX) ========= */
function clearMarkers(){ markers.forEach(m => m.remove()); markers = [] }

function addMarkers(){
  clearMarkers()
  venuesFiltered.value.forEach(v => {
    const el = document.createElement('button')
    el.className = 'pin2'; el.type='button'; el.setAttribute('aria-label', v.name)
    el.innerHTML = `
      <span class="glow"></span>
      <span class="ring"></span>
      <span class="core"></span>
      <span class="label">${v.name}</span>
    `
    el.style.padding = '10px 15px'
    el.style.borderRadius = '10px'
    el.addEventListener('click', () => focusVenue(v.id))
    el.addEventListener('mouseenter', () => el.classList.add('hover'))
    el.addEventListener('mouseleave', () => el.classList.remove('hover'))
    const mk = new maplibregl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat([v.coords.lng, v.coords.lat]).addTo(map)
    markers.push(mk)
  })
}

function fitToVenues () {
  if (!venuesFiltered.value.length) return

  // calcola il bounds dei locali filtrati
  const b = new maplibregl.LngLatBounds()
  venuesFiltered.value.forEach(v => b.extend([v.coords.lng, v.coords.lat]))

  // adatta la vista
  map.fitBounds(b, {
    padding: { top: 60, right: 60, bottom: 60, left: 60 },
    maxZoom: 16,
    duration: 550
  })

  // crea un bounds "ingrandito" manualmente (equivalente del .pad(0.35))
  const padRatio = 0.35
  const sw = b.getSouthWest()
  const ne = b.getNorthEast()
  const lngSpan = ne.lng - sw.lng || 0.01   // fallback se un solo punto
  const latSpan = ne.lat - sw.lat || 0.01

  const padded = new maplibregl.LngLatBounds(
    [sw.lng - lngSpan * padRatio, sw.lat - latSpan * padRatio],
    [ne.lng + lngSpan * padRatio, ne.lat + latSpan * padRatio]
  )

  // limita lo spostamento alla “zona” dei locali
  map.setMaxBounds(padded)
}


/* Re-render quando cambia filtro o dataset */
watch([activeKind, all], () => {
  if (!map) return
  addMarkers()
  fitToVenues()
})

/* ========= Geolocate ========= */
function locateMe(){
  if (!navigator.geolocation) return
  navigator.geolocation.getCurrentPosition(
    ({coords}) => {
      vibrate(8)
      map?.easeTo({ center: [coords.longitude, coords.latitude], zoom: 15.5, duration: 600 })
    },
    () => {},
    { enableHighAccuracy: true, maximumAge: 20_000, timeout: 10_000 }
  )
}

/* ========= Haptics ========= */
function vibrate(ms){ if (window.navigator?.vibrate) window.navigator.vibrate(ms) }
</script>

<style scoped>
/* ===== Layout ===== */
.map-experience{
  background: var(--stone-100, #efe6d3);
  min-height: 100dvh;
  color: var(--sepia-900, #2a2019);
  padding-top: 80px;
}
.wrap{ width: min(92vw, 1200px); margin: 14px auto 28px; }
.head{ margin: 6px 0 10px; }
.title{ margin:0; font-size: clamp(20px,5.4vw,32px); letter-spacing:-.01em; }
.subtitle{ margin:4px 0 0; opacity:.76; font-size: clamp(12px,3.2vw,16px); }

/* Controls – mobile-first */
.controls{ display:grid; gap:10px; margin: 8px 0 12px; }
.chips{
  display:flex; gap:8px; overflow:auto; padding-bottom:2px; -webkit-overflow-scrolling:touch;
  scrollbar-width:none;
}
.chips::-webkit-scrollbar{ display:none }
.chip{
  all:unset; cursor:pointer; padding:8px 12px; border-radius:999px;
  border:1px solid rgba(42,32,25,.16); background:#f6f1e7;
  color:#2a2019; font-weight:800; letter-spacing:.02em; font-size:14px;
  white-space:nowrap;
}
.chip.active{
  background: rgba(142,160,115,.18); border-color: rgba(42,32,25,.26);
}
.actions{ display:flex; gap:8px; align-items:center; }
.styleSelect{ min-width: 160px; }
.btn.ghost{ border-color: rgba(42,32,25,.3); color:#2a2019; }


/* Desktop controls */
@media (min-width: 768px){
  .controls{ grid-template-columns: 1fr auto; align-items:center; }
}

/* ===== Map Shell non-hero ===== */
.map-shell{
  position: relative;
  width: 100%;
  height: clamp(420px, 62vh, 720px);
  border-radius: 22px;
  overflow: hidden;
  background: var(--stone-100, #efe6d3);
}
.map{ position:absolute; inset:0; z-index:0; }

/* tinta soft */
.tint{
  position:absolute; inset:0; z-index:1; pointer-events:none;
  background:
    radial-gradient(120% 90% at 12% 0%, rgba(201,126,99,.10), transparent 60%),
    radial-gradient(120% 100% at 88% 24%, rgba(142,160,115,.10), transparent 62%);
}

/* bordi “sogno” */
.dream-mask{
  position:absolute; inset:-2% -2%; z-index:2; pointer-events:none;
  -webkit-mask-image:
    radial-gradient(120% 95% at 50% 50%, #000 60%, rgba(0,0,0,0) 100%);
          mask-image:
    radial-gradient(120% 95% at 50% 50%, #000 60%, rgba(0,0,0,0) 100%);
  background:
    radial-gradient(120% 95% at 50% 50%, rgba(239,230,211,.0) 55%, rgba(239,230,211,.72) 100%);
}

/* ===== Pin super visibili ===== */
.pin2{
  all: unset; position: relative; display:grid; place-items:center; cursor:pointer;
  transform-origin: bottom center;
}
.pin2 .core{
  width: 18px; height: 18px; border-radius: 50%;
  background: var(--clay-400, #c97e63);
  border: 3px solid #fff;       /* bordo bianco per contrasto su map dark */
  outline: 2px solid #2a2019;   /* contorno scuro per map light */
  position: relative; z-index: 2;
  box-shadow: 0 4px 18px rgba(201,126,99,.65);
}
.pin2 .ring{
  position:absolute; bottom:-2px; width: 40px; height: 40px; border-radius:50%;
  border: 2px solid rgba(201,126,99,.65);
  animation: pulse 2.4s ease-out infinite;
}
.pin2 .glow{
  position:absolute; width: 56px; height: 56px; border-radius:50%;
  background: radial-gradient(circle, rgba(201,126,99,.55), rgba(201,126,99,0) 72%);
  filter: blur(8px); transform: translateY(2px);
}
.pin2 .label{
  position:absolute; top:-46px; left:50%; transform: translateX(-50%);
  white-space:nowrap; font-size:12px; font-weight:900; letter-spacing:.02em;
  color: var(--sepia-900);
  background: rgba(246,241,231,.98);
  border:1px solid rgba(42,32,25,.18);
  padding: 5px 9px; border-radius: 10px;
  box-shadow: 0 6px 22px rgba(0,0,0,.18);
  opacity: 0; transition: opacity .18s ease, transform .18s ease;
}
.pin2.hover .label,
.pin2:focus-visible .label{ opacity:1; transform: translate(-50%,-2px) }

.pin2:hover{ transform: translateY(-2px) scale(1.03) }
@keyframes pulse{
  0%{ transform: scale(.55); opacity:.95 }
  70%{ transform: scale(1.22); opacity:.0 }
  100%{ transform: scale(1.22); opacity:0 }
}

/* ===== Info Card / Bottom Sheet ===== */
.info{
  position:absolute; right: 12px; top: 12px; z-index: 3;
  width: min(92vw, 380px);
  background: rgba(246,241,231,.98); color: var(--sepia-900);
  border: 1px solid rgba(42,32,25,.18); border-radius: 14px;
  overflow: hidden; backdrop-filter: blur(6px);
  box-shadow: 0 18px 60px rgba(0,0,0,.18);
}
.info.mobile{
  left: 12px; right: 12px; top: auto; bottom: 12px; width: auto; border-radius: 14px;
}
.info__close{
  position:absolute; top:6px; right:6px; z-index:2;
  all:unset; cursor:pointer; width:32px; height:32px; border-radius:8px;
  display:grid; place-items:center; color: var(--sepia-900);
  background: rgba(255,255,255,.7); border: 1px solid rgba(42,32,25,.14);
}
.info__media{ width:100%; height: 160px; background-size:cover; background-position:center; }
.info__body{ padding: 10px 12px 12px; }
.info__title{ margin:0; font-size:18px; line-height:1.15; }
.info__addr{ margin:.2rem 0 .4rem; opacity:.75; font-size:13px; }
.info__status{ display:inline-block; padding:4px 8px; border-radius:999px; font-size:12px; border:1px solid rgba(42,32,25,.14); }
.info__status.open{ background: rgba(142,160,115,.22); }
.info__cta{ margin-top:8px; display:flex; gap:8px; flex-wrap:wrap; }
.btn.primary{ background:#c97e63; color:#f6f1e7; }
.btn.ghost{ border-color: rgba(42,32,25,.2); color:#2a2019; }
.btn.link{ color:#2a2019; }

/* Transizioni */
.sheet-enter-active,.sheet-leave-active{ transition: opacity .22s ease, transform .22s ease }
.sheet-enter-from,.sheet-leave-to{ opacity:0; transform: translateY(6px) }

/* Legend */
.legend{
  position:absolute; left: 12px; bottom: 12px; z-index: 3;
  background: rgba(246,241,231,.92); color: var(--sepia-900);
  border: 1px solid rgba(42,32,25,.15);
  border-radius: 12px; padding: 8px 10px; max-width: min(86vw, 320px);
}
.legend summary{ list-style:none; cursor:pointer; font-weight:800; }
.legend summary::-webkit-details-marker{ display:none }
.legend ul{ margin:8px 0 0; padding:0; list-style:none; max-height:40vh; overflow:auto }
.legend li+li{ margin-top:6px }
.legend button{ all:unset; cursor:pointer; border-bottom:1px solid transparent }
.legend button:hover{ border-bottom-color: currentColor }
</style>

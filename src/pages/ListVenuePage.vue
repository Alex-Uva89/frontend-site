<template>
  <q-page class="map-experience q-pa-none">
    <div class="wrap">
      <!-- Header -->
      <header class="head">
        <h1 class="text-h2">{{ $t('venues.title','I nostri locali') }}</h1>
        <p class="subtitle">
          {{ $t('venues.subtitle','Tutti nel cuore di Lecce — scopri quello giusto per te') }}
        </p>
      </header>

      <!-- Controls (NON sticky) -->
      <div class="controls">
        <!-- Filtri tipologia -->
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

        <!-- Azioni + toggle vista -->
        <div class="actions">
          <div class="viewTabs" role="tablist" aria-label="Vista">
            <button
              class="viewTab" role="tab" :aria-selected="viewMode==='map'"
              :class="{ active: viewMode==='map' }"
              @click="setView('map')"
            >{{ $t('map','Mappa') }}</button>

            <button
              class="viewTab" role="tab" :aria-selected="viewMode==='list'"
              :class="{ active: viewMode==='list' }"
              @click="setView('list')"
            >{{ $t('list','Lista') }}</button>

            <button
              v-if="isDesktop"
              class="viewTab" role="tab" :aria-selected="viewMode==='split'"
              :class="{ active: viewMode==='split' }"
              @click="setView('split')"
            >{{ $t('split','Affianca') }}</button>
          </div>

          <q-select
            v-model="currentStyle"
            :options="mapStylesOptions"
            dense outlined emit-value map-options
            class="styleSelect"
            :aria-label="$t('map.style','Stile mappa')"
          />

          <q-btn dense outline no-caps class="btn ghost"
            icon="my_location"
            :label="userLoc ? $t('near.recenter','Riposiziona') : $t('near.me','Vicino a me')"
            @click="locateMe" />
        </div>
      </div>

      <!-- VISTE -->
      <section
        class="views"
        :class="{
          'is-map': viewMode==='map',
          'is-list': viewMode==='list',
          'is-split': viewMode==='split'
        }"
      >
        <!-- MAPPA -->
        <div class="map-shell" :class="{ hidden: viewMode==='list' }">
          <div ref="mapEl" class="map"></div>

          <!-- tinta + bordo “sogno” -->
          <div class="tint" aria-hidden="true"></div>
          <div class="dream-mask" aria-hidden="true"></div>

          <!-- legenda -->
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

          <!-- Scheda info -->
          <transition name="sheet">
            <aside v-if="selected" class="info" :class="{ mobile: !isDesktop }" role="dialog" aria-modal="false">
              <button class="info__close" @click="selected=null" aria-label="Chiudi">✕</button>
              <div class="info__media" :style="{ backgroundImage:`url(${selected.image})` }" />
              <div class="info__body">
                <h3 class="info__title">{{ selected.name }}</h3>
                <p class="info__addr">{{ selected.address }}</p>
                <div class="info__status" :class="{ open: isOpenNow(selected) }" aria-live="polite">
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
        </div>

        <!-- LISTA -->
        <div class="list-shell" :class="{ hidden: viewMode==='map' }" role="region" :aria-label="$t('list','Lista')">
          <ul class="vlist">
            <li v-for="v in venuesListed" :key="v.id">
              <article class="vcard">
                <button class="vcard__media" @click="onCardClick(v)">
                  <img :src="v.image" :alt="v.name" loading="lazy">
                  <span class="vcard__kind">{{ v.kind }}</span>
                  <span class="vcard__badge" :class="{ open: isOpenNow(v) }">
                    {{ isOpenNow(v) ? $t('open.now','Aperto ora') : $t('closed.now','Chiuso') }}
                  </span>
                </button>
                <div class="vcard__body">
                  <h3 class="vcard__title">{{ v.name }}</h3>
                  <p class="vcard__meta">
                    <span>{{ v.address }}</span>
                    <template v-if="typeof v.distanceKm === 'number'">
                      · <span>{{ v.distanceKm.toFixed(1) }} km</span>
                    </template>
                  </p>
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
            </li>
          </ul>
        </div>
      </section>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { venues as data } from 'src/stores/venues.js'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const router = useRouter()

/* ===== Responsive ===== */
const resizeW = ref(window.innerWidth)
const isDesktop = computed(() => resizeW.value >= 1024)
function onResize(){
  resizeW.value = window.innerWidth
  if (map) map.resize()
  if (isDesktop.value && viewMode.value === 'map') viewMode.value = 'split'
  if (!isDesktop.value && viewMode.value === 'split') viewMode.value = 'map'
}

/* ===== View mode ===== */
const viewMode = ref(window.innerWidth >= 1024 ? 'split' : 'map')
function setView(m){
  viewMode.value = m
  nextTick(() => { if (map) { map.resize(); fitToVenues() } })
}

/* ===== Data & filters ===== */
const all = computed(() =>
  data.filter(v => v.coords && Number.isFinite(v.coords.lng) && Number.isFinite(v.coords.lat))
)
const kinds = computed(() => Array.from(new Set(all.value.map(v => v.kind))).sort())
const activeKind = ref(null)
function setKind(k){
  activeKind.value = k
  selectedId.value = null
}
const venuesFiltered = computed(() =>
  activeKind.value ? all.value.filter(v => v.kind === activeKind.value) : all.value
)

/* ===== Selection ===== */
const selectedId = ref(null)
const selected = computed(() => all.value.find(v => v.id === selectedId.value) || null)
function goToVenue (id){ router.push({ name: 'locale', params: { id } }) }
function focusVenue (id){
  const v = all.value.find(x => x.id === id); if(!v) return
  selectedId.value = id
  vibrate(12)
  map?.easeTo({ center: [v.coords.lng, v.coords.lat], zoom: Math.max(map.getZoom(), 15.2), duration: 450 })
  updateMarkerStates()
}
function onCardClick(v){
  selectedId.value = v.id
  if (!isDesktop.value && viewMode.value !== 'map') viewMode.value = 'map'
  nextTick(() => focusVenue(v.id))
}

/* ===== Open hours ===== */
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

/* ===== Geolocate & distance ===== */
const userLoc = ref(null)
function locateMe(){
  if (!navigator.geolocation) return
  navigator.geolocation.getCurrentPosition(
    ({coords}) => {
      userLoc.value = { lng: coords.longitude, lat: coords.latitude }
      vibrate(8)
      map?.easeTo({ center: [coords.longitude, coords.latitude], zoom: 15.5, duration: 450 })
    },
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
const venuesListed = computed(() => {
  const base = venuesFiltered.value.map(v => ({
    ...v,
    distanceKm: userLoc.value ? haversineKm(userLoc.value, v.coords) : null
  }))
  return base.sort((a,b) => {
    const ao = isOpenNow(a), bo = isOpenNow(b)
    if (ao !== bo) return ao ? -1 : 1
    if (a.distanceKm != null && b.distanceKm != null) return a.distanceKm - b.distanceKm
    if (a.distanceKm != null) return -1
    if (b.distanceKm != null) return 1
    return a.name.localeCompare(b.name)
  })
})

/* ===== Maplibre ===== */
const mapEl = ref(null)
let map = null
let markers = [] // [{ id, marker, el }]

const mapStylesOptions = [
  { label: 'OSM Standard', value: 'osm' },
  { label: 'OSM HOT',      value: 'osmHot' },
  { label: 'Carto Light',  value: 'cartoLight' },
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
      return rasterStyle(['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], '© OpenStreetMap')
    case 'osmHot':
      return rasterStyle(
        ['https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png','https://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png','https://c.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'],
        '© OpenStreetMap, HOT'
      )
    case 'cartoLight':
      return rasterStyle(
        ['https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png','https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png','https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png','https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'],
        '© CARTO, © OpenStreetMap'
      )
    default: return rasterStyle(['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], '© OpenStreetMap')
  }
}

/* Init mappa */
onMounted(() => {
  window.addEventListener('resize', onResize, { passive: true })

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
onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  markers.forEach(m => m.marker.remove())
  if (map) map.remove()
})

watch(currentStyle, (id) => {
  if (!map) return
  map.setStyle(styleFor(id))
  map.once('styledata', () => fitToVenues())
})

/* Markers */
function clearMarkers(){
  markers.forEach(m => m.marker.remove())
  markers = []
}
function addMarkers(){
  clearMarkers()
  venuesFiltered.value.forEach(v => {
    const el = document.createElement('button')
    el.className = 'pin2'
    el.type='button'
    el.setAttribute('aria-label', v.name)
    el.innerHTML = `
      <span class="glow"></span>
      <span class="ring"></span>
      <span class="core"></span>
      <span class="label">${v.name}</span>
    `
    el.addEventListener('click', () => focusVenue(v.id))
    el.addEventListener('mouseenter', () => el.classList.add('hover'))
    el.addEventListener('mouseleave', () => el.classList.remove('hover'))

    const mk = new maplibregl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat([v.coords.lng, v.coords.lat])
      .addTo(map)

    markers.push({ id: v.id, marker: mk, el })
  })
  updateMarkerStates()
}
function updateMarkerStates(){
  markers.forEach(m => {
    if (m.id === selectedId.value) m.el.classList.add('active')
    else m.el.classList.remove('active')
  })
}

/* Fit bounds */
function fitToVenues () {
  if (!venuesFiltered.value.length || !map) return

  const b = new maplibregl.LngLatBounds()
  venuesFiltered.value.forEach(v => b.extend([v.coords.lng, v.coords.lat]))

  map.fitBounds(b, {
    padding: !isDesktop.value
      ? { top: 40, right: 24, bottom: 40, left: 24 }     // niente spazio extra per sticky
      : viewMode.value==='split'
        ? { top: 50, right: 320, bottom: 50, left: 50 }
        : { top: 60, right: 60, bottom: 60, left: 60 },
    maxZoom: 16,
    duration: 450
  })

  // bounds “padded” manuale
  const padRatio = 0.35
  const sw = b.getSouthWest()
  const ne = b.getNorthEast()
  const lngSpan = (ne.lng - sw.lng) || 0.01
  const latSpan = (ne.lat - sw.lat) || 0.01
  const padded = new maplibregl.LngLatBounds(
    [sw.lng - lngSpan * padRatio, sw.lat - latSpan * padRatio],
    [ne.lng + lngSpan * padRatio, ne.lat + latSpan * padRatio]
  )
  map.setMaxBounds(padded)

  if (venuesFiltered.value.length === 1) {
    const v = venuesFiltered.value[0]
    map.easeTo({ center: [v.coords.lng, v.coords.lat], zoom: 15.5, duration: 300 })
  }
}

/* Re-render on changes */
watch([activeKind, all], () => { if (!map) return; addMarkers(); fitToVenues() })

/* Haptics */
function vibrate(ms){ if (window.navigator?.vibrate) window.navigator.vibrate(ms) }
</script>

<style scoped>
/* ===== Layout base ===== */
.map-experience{
  background: var(--stone-100, #efe6d3);
  min-height: 100dvh;
  color: var(--sepia-900, #2a2019);
  padding-top: max(84px, env(safe-area-inset-top));
}
.wrap{ width: min(94vw, 1200px); margin: 10px auto 24px; }
.subtitle{ margin:4px 0 0; opacity:.76; font-size: clamp(12px,3.2vw,15px); }

/* ===== Controls (NON sticky) ===== */
.controls{
  display:grid;
  gap:12px;
  margin: 14px 0 16px; /* spazio naturale sopra la mappa */
}
.chips{
  display:flex; gap:8px; overflow:auto; padding:2px 2px 6px; flex-wrap: wrap;
  -webkit-overflow-scrolling:touch; scrollbar-width:none;
  background: rgba(255,255,255,.35);
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

.actions{ display:flex; gap:8px; align-items:center; flex-wrap: wrap; }
.styleSelect{ min-width: 160px; }
.btn.ghost{ border-color: rgba(42,32,25,.3); color:#2a2019; }

/* Toggle vista */
.viewTabs{ display:flex; gap:6px; padding:4px; border:1px solid rgba(42,32,25,.12); border-radius:12px; background:#fff }
.viewTab{
  all:unset; cursor:pointer; padding:8px 12px; border-radius:10px; font-weight:800;
}
.viewTab.active{ background: #2a2019; color:#f6f1e7 }

/* ===== Vista: contenitori ===== */
.views{ display:block }
.views.is-split{
  display:grid; grid-template-columns: 1fr min(480px, 42%); gap: 14px;
}

/* ===== MAP ===== */
.map-shell{
  position: relative;
  width: 100%;
  height: clamp(420px, 60vh, 720px);
  border-radius: 22px;
  overflow: hidden;
  background: var(--stone-100, #efe6d3);
}
.map-shell.hidden{ display: none }
.map{ position:absolute; inset:0; z-index:0; }

/* tinta + sogno */
.tint{
  position:absolute; inset:0; z-index:1; pointer-events:none;
  background:
    radial-gradient(120% 90% at 12% 0%, rgba(201,126,99,.10), transparent 60%),
    radial-gradient(120% 100% at 88% 24%, rgba(142,160,115,.10), transparent 62%);
}
.dream-mask{
  position:absolute; inset:-3% -3%; z-index:2; pointer-events:none;
  -webkit-mask-image: radial-gradient(140% 110% at 50% 52%, #000 58%, rgba(0,0,0,0) 100%);
          mask-image: radial-gradient(140% 110% at 50% 52%, #000 58%, rgba(0,0,0,0) 100%);
  background: radial-gradient(120% 95% at 50% 50%, rgba(239,230,211,0) 55%, rgba(239,230,211,.68) 100%);
}

/* Pin */
.pin2{
  all: unset; position: relative; display:grid; place-items:center; cursor:pointer;
  transform-origin: bottom center; min-width:44px; min-height:44px;
}
.pin2 .core{
  width: 22px; height: 22px; border-radius: 50%;
  background: var(--clay-400, #c97e63);
  border: 3px solid #fff;
  outline: 2px solid #2a2019;
  position: relative; z-index: 2;
  box-shadow: 0 6px 20px rgba(201,126,99,.65);
}
.pin2 .ring{
  position:absolute; bottom:-1px; width: 52px; height: 52px; border-radius:50%;
  border: 2px solid rgba(201,126,99,.65);
  animation: pulse 2.2s ease-out infinite;
}
.pin2 .glow{
  position:absolute; width: 68px; height: 68px; border-radius:50%;
  background: radial-gradient(circle, rgba(201,126,99,.6), rgba(201,126,99,0) 72%);
  filter: blur(8px); transform: translateY(3px);
}
.pin2 .label{
  position:absolute; top:-50px; left:50%; transform: translateX(-50%);
  white-space:nowrap; font-size:12px; font-weight:900; letter-spacing:.02em;
  color: var(--sepia-900);
  background: rgba(246,241,231,.98);
  border:1px solid rgba(42,32,25,.18);
  padding: 6px 10px; border-radius: 10px;
  box-shadow: 0 6px 22px rgba(0,0,0,.18);
  opacity: 0; transition: opacity .18s ease, transform .18s ease;
}
.pin2.hover .label,
.pin2:focus-visible .label,
.pin2.active .label{ opacity:1; transform: translate(-50%,-2px) }
.pin2:hover{ transform: translateY(-2px) scale(1.03) }
@keyframes pulse{
  0%{ transform: scale(.55); opacity:.95 }
  70%{ transform: scale(1.22); opacity:.0 }
  100%{ transform: scale(1.22); opacity:0 }
}

/* Info card */
.info{
  position:absolute; right: 12px; top: 12px; z-index: 3;
  width: min(92vw, 380px);
  background: rgba(246,241,231,.98); color: var(--sepia-900);
  border: 1px solid rgba(42,32,25,.18); border-radius: 14px;
  overflow: hidden; backdrop-filter: blur(6px);
  box-shadow: 0 18px 60px rgba(0,0,0,.18);
}
.info.mobile{ left: 12px; right: 12px; top: auto; bottom: 12px; width: auto; }
.info__close{
  position:absolute; top:6px; right:6px; z-index:2;
  all:unset; cursor:pointer; width:36px; height:36px; border-radius:9px;
  display:grid; place-items:center; color: var(--sepia-900);
  background: rgba(255,255,255,.78); border: 1px solid rgba(42,32,25,.14);
}
.info__media{ width:100%; height: 160px; background-size:cover; background-position:center; }
.info__body{ padding: 10px 12px 12px; }
.info__title{ margin:0; font-size:18px; line-height:1.15; }
.info__addr{ margin:.2rem 0 .4rem; opacity:.75; font-size:13px; }
.info__status{ display:inline-block; padding:6px 10px; border-radius:999px; font-size:12px; border:1px solid rgba(42,32,25,.14); }
.info__status.open{ background: rgba(142,160,115,.22); }
.info__cta{ margin-top:8px; display:flex; gap:8px; flex-wrap:wrap; }
.btn.primary{ background:#c97e63; color:#f6f1e7; }
.btn.ghost{ border-color: rgba(42,32,25,.2); color:#2a2019; }
.btn.link{ color:#2a2019; }

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

/* ===== LIST ===== */
.list-shell{ width:100% }
.list-shell.hidden{ display:none }
.vlist{
  list-style:none; margin:0; padding:0;
  display:grid; gap:12px;
}
.views.is-split .vlist{ max-height: clamp(420px, 60vh, 720px); overflow:auto; padding-right: 6px; }
.vcard{
  display:grid; grid-template-columns: 140px 1fr; gap:10px;
  background:#fff; border:1px solid rgba(42,32,25,.12); border-radius:14px; overflow:hidden;
}
.vcard__media{
  all:unset; cursor:pointer; position:relative; display:block;
  width:100%; height:100%;
}
.vcard__media img{
  display:block; width:100%; height:100%; object-fit:cover; min-height:120px;
}
.vcard__kind{
  position:absolute; left:8px; top:8px; font-size:11px; font-weight:800;
  background: rgba(246,241,231,.95); color:#2a2019; border:1px solid rgba(42,32,25,.16);
  padding:3px 6px; border-radius:999px;
}
.vcard__badge{
  position:absolute; right:8px; top:8px; font-size:11px; font-weight:800;
  background: rgba(42,32,25,.75); color:#fff; border:1px solid rgba(255,255,255,.25);
  padding:3px 6px; border-radius:999px;
}
.vcard__badge.open{ background: rgba(142,160,115,.9); color:#1b2316 }
.vcard__body{ padding:10px 12px; display:flex; flex-direction:column; gap:6px; }
.vcard__title{ margin:0; font-size:16px; line-height:1.2 }
.vcard__meta{ margin:0; opacity:.75; font-size:13px }
.vcard__cta{ display:flex; gap:8px; flex-wrap:wrap; }

@media (max-width: 767px){
  .vcard{ grid-template-columns: 1fr; }
}

/* Motion safe */
@media (prefers-reduced-motion: reduce){
  .pin2 .ring{ animation: none }
}

/* Transizioni */
.sheet-enter-active,.sheet-leave-active{ transition: opacity .22s ease, transform .22s ease }
.sheet-enter-from,.sheet-leave-to{ opacity:0; transform: translateY(6px) }
</style>

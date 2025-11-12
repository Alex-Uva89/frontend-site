<template>
  <q-page class="q-pa-none">
    <div v-if="loading" class="q-pa-md"><q-spinner size="32px" /></div>
    <div v-else-if="error" class="q-pa-md text-negative">{{ error }}</div>
    <div v-else>
    <HeroImage
      :images="heroImages"
      :title="venue?.name || 'Locale'"
      :subtitle="venue?.address || ''"
      content-bottom="10vh"
      :loop-duration="30"
      align="left"
    />

    <SectionFrame class="q-my-lg">
      <!-- EMOZIONALE -->
      <EmotionBlock :emotion="venue.emotion" />
    </SectionFrame>

    <!-- FOCUS + CTA -->
    <section class="focus">
      <div class="focus__wrap">
        <div class="focus__info">
          <h2 class="focus__title">{{ venue?.name }}</h2>
          <p class="focus__meta">{{ (venue?.kind || '').toUpperCase() }} · {{ venue?.address }}</p>
        </div>
        <div class="focus__ctas">
          <q-btn unelevated no-caps class="btn btn--primary"
                 :href="venue.bookingUrl" target="_blank">
            {{ $t('actions.book', 'Prenota') }}
          </q-btn>
          <q-btn outline no-caps class="btn btn--ghost"
                 :href="venue.menuUrl">
            {{ $t('actions.viewMenu', 'Menu') }}
          </q-btn>
        </div>
      </div>
    </section>

    <!-- SOLUZIONI PRENOTAZIONE -->
    <section class="solutions">
      <div class="container">
        <h3 class="sectionTitle">
          {{ solutionsTitle }}
        </h3>
      </div>

      <div class="solutions__rail" v-if="isMobile">
        <div class="solutions__track">
          <q-card v-for="s in solutions" :key="s.id" class="sol" clickable v-ripple
                  :to="s.to" :href="s.href" :target="s.target">
            <div class="sol__icon"><q-icon :name="s.icon" size="28px" /></div>
            <div class="sol__title">{{ s.title }}</div>
            <div class="sol__desc">{{ s.desc }}</div>
            <div class="sol__cta">{{ s.cta }}</div>
          </q-card>
        </div>
      </div>
      <div class="solutions__grid" v-else>
        <q-card v-for="s in solutions" :key="s.id" class="sol" clickable v-ripple
                :to="s.to" :href="s.href" :target="s.target">
          <div class="sol__icon"><q-icon :name="s.icon" size="28px" /></div>
          <div class="sol__title">{{ s.title }}</div>
          <div class="sol__desc">{{ s.desc }}</div>
          <div class="sol__cta">{{ s.cta }}</div>
        </q-card>
      </div>
    </section>

    <!-- ORARI -->
    <section class="hours">
      <div class="container">
        <div class="hours__head">
          <h3 class="sectionTitle">{{ hoursTitle }}</h3>
          <div class="hours__status" :class="{ open: isOpenNow }">
            <span class="dot"></span>
            {{ isOpenNow ? openNowLabel : closedNowLabel }}
          </div>
        </div>

        <q-list bordered separator class="hours__list">
          <q-item v-for="row in weekRows" :key="row.key" :class="{ today: row.isToday }">
            <q-item-section class="text-black">{{ row.label }}</q-item-section>
            <q-item-section side class="hours__range">{{ row.range }}</q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="hours__cta">
        <q-btn no-caps unelevated class="btn btn--primary"
               :href="venue.bookingUrl" target="_blank">
          {{ $t('actions.book', 'Prenota un tavolo') }}
        </q-btn>
      </div>
    </section>
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { fetchVenueById } from 'src/stores/venues.js'
import { useLangStore } from 'src/stores/langStore.js'
import HeroImage from 'components/HeroImage.vue'
import EmotionBlock from 'components/EmotionBlock.vue'
import SectionFrame from 'src/components/SectionFrame.vue'

const route = useRoute()
const { locale, t } = useI18n({ useScope: 'global' })
const langStore = useLangStore()

// ===== stato =====
const loading = ref(true)        // usalo solo per primo load o cambio ID
const error   = ref('')
const venue   = ref(null)
const site    = ref(null)

// ===== utils =====
const API_BASE = import.meta?.env?.VITE_API_BASE || 'http://localhost:8787'

// ====== traduzioni singole ======
const hoursTitle     = computed(() => site.value?.venueUi?.hoursTitle ?? 'Orari')
const openNowLabel   = computed(() => site.value?.venueUi?.openNow   ?? 'Aperto ora')
const closedNowLabel = computed(() => site.value?.venueUi?.closedNow ?? 'Chiuso ora')

// cache per switch fluido
const venueCache = new Map() // chiave: `${id}:${loc}` → venue
const siteCache  = new Map() // chiave: `${loc}`       → siteStrings

let aborter // per cancellare richieste in corso

async function fetchSiteStrings(loc, { signal } = {}) {
  // cache first
  if (siteCache.has(loc)) return siteCache.get(loc)
  const res = await fetch(`${API_BASE}/content/${encodeURIComponent(loc)}`, { signal })
  if (!res.ok) throw new Error(`HTTP ${res.status} on /content/${loc}`)
  const data = await res.json()
  siteCache.set(loc, data)
  return data
}

// loader “duale”: hard o soft
async function load({ soft = false } = {}) {
  const id = String(route.params.id)
  const loc = locale.value

  // se soft=false (primo load o cambio ID) mostra spinner
  if (!soft) {
    loading.value = true
    error.value = ''
    aborter?.abort?.()
    aborter = new AbortController()
  }

  try {
    // 1) venue: prova cache
    const vKey = `${id}:${loc}`
    const vPromise = (async () => {
      if (venueCache.has(vKey)) return venueCache.get(vKey)
      const v = await fetchVenueById(id, loc, { signal: aborter?.signal })
      venueCache.set(vKey, v)
      return v
    })()

    // 2) siteStrings (solutions): prova cache
    const sPromise = (async () => {
      if (siteCache.has(loc)) return siteCache.get(loc)
      const s = await fetchSiteStrings(loc, { signal: aborter?.signal })
      siteCache.set(loc, s)
      return s
    })()

    // Se soft=true e NON è in cache, non toccare lo stato finché non arriva;
    // se è in cache, aggiorna subito.
    if (soft) {
      if (venueCache.has(vKey)) venue.value = venueCache.get(vKey)
      if (siteCache.has(loc))   site.value  = siteCache.get(loc)
    }

    const [v, s] = await Promise.all([vPromise, sPromise])
    venue.value = v
    site.value  = s
  } catch (err) {
    // se soft, non mostrare errori a schermo: mantieni l’UI attuale
    if (!soft) {
      console.error('[venue load]', err)
      error.value = err?.message || 'Errore nel caricamento'
      venue.value = null
      site.value = null
    }
  } finally {
    if (!soft) loading.value = false
  }
}

onMounted(() => load({ soft: false }))

// cambio route id → hard load (spinner ok)
watch(() => route.params.id, () => load({ soft: false }))

// cambio lingua → soft load (niente spinner, UI fluida)
watch(() => locale.value, () => load({ soft: true }))

// ===== hero images =====
const heroImages = computed(() => {
  const v = venue.value
  if (!v) return ['https://picsum.photos/seed/fallback/1920/1080']
  if (Array.isArray(v.gallery) && v.gallery.length) {
    return v.gallery.map(g => g.src).filter(Boolean)
  }
  if (v.image) return [v.image]
  return ['https://picsum.photos/seed/fallback/1920/1080']
})

// ===== mobile detection =====
const isMobile = ref(true)
let mql
const onMedia = () => { isMobile.value = mql.matches }
onMounted(() => {
  mql = window.matchMedia('(max-width: 768px)')
  onMedia()
  mql.addEventListener?.('change', onMedia)
})
onBeforeUnmount(() => {
  mql?.removeEventListener?.('change', onMedia)
  aborter?.abort?.()
})

// ===== SOLUZIONI da Sanity =====
const solutionsTitle = computed(() =>
  site.value?.solutions?.title ||
  t('venue.solutionsTitle', 'Come vuoi prenotare?')
)

const solutions = computed(() => {
  const v = venue.value || {}
  const s = site.value?.solutions || {}
  console.log('solution', s)
  return [
    {
      id: 'table',
      title: s.table?.title || 'Prenota un tavolo',
      desc:  s.table?.desc  || 'Per 1–8 persone',
      cta:   s.table?.cta   || t('actions.book','Prenota'),
      icon:  'event_seat',
      href:  v.bookingUrl,
      target:'_blank'
    },
    {
      id: 'birthday',
      title: s.birthday?.title || 'Compleanno',
      desc:  s.birthday?.desc  || 'Torta, brindisi, setup personalizzato',
      cta:   s.birthday?.cta   || 'Richiedi',
      icon:  'cake',
      to: { path: '/events', query: { kind: 'birthday', venue: v.id } }
    },
    {
      id: 'private',
      title: s.private?.title || 'Evento privato',
      desc:  s.private?.desc  || 'Cene aziendali, feste, ricorrenze',
      cta:   s.private?.cta   || 'Richiedi',
      icon:  'groups',
      to: { path: '/events', query: { kind: 'private', venue: v.id } }
    }
  ]
})

/* ====== ORARI ====== */
function weekdaysForLocale(localeTag = 'it-IT') {
  const baseMonday = new Date(Date.UTC(2021, 5, 7)) // lunedì
  const fmt = new Intl.DateTimeFormat(localeTag, { weekday: 'long' })
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(baseMonday)
    d.setUTCDate(baseMonday.getUTCDate() + i)
    const name = fmt.format(d)
    return name.charAt(0).toLocaleUpperCase(localeTag) + name.slice(1)
  })
}
const dayLabels = computed(() => weekdaysForLocale(langStore.current))

const schedule = computed(() => Array.isArray(venue.value?.hours) ? venue.value.hours : [])

function toMinutes (hhmm) {
  const [h, m] = (hhmm || '').split(':').map(Number)
  return (h * 60) + (m || 0)
}
function formatRange (seg) {
  if (seg === '24h') return site.value?.venueUi?.open24h ?? 'Open 24 hours' // opzionale se vuoi aggiungere anche questa
  if (Array.isArray(seg) && seg.length === 0) return site.value?.venueUi?.closed ?? closedNowLabel.value
  if (Array.isArray(seg)) return seg.map(b => `${b.o}–${b.c}`).join(', ')
  return '—'
}
function isOpenAt (dayIdx, date = new Date()) {
  const seg = schedule.value[dayIdx]
  if (!seg) return false
  if (seg === '24h') return true
  if (Array.isArray(seg) && seg.length === 0) return false

  const nowMin = date.getHours() * 60 + date.getMinutes()
  for (const b of seg) {
    const o = toMinutes(b.o)
    const c = toMinutes(b.c)
    if (o <= c) {
      if (nowMin >= o && nowMin < c) return true
    } else {
      if (nowMin >= o || nowMin < c) return true
    }
  }
  return false
}

const weekRows = computed(() => {
  const todayJS = new Date().getDay() // 0=Dom … 6=Sab
  const todayIdx = (todayJS + 6) % 7   // 0=Lun … 6=Dom
  return dayLabels.value.map((label, i) => ({
    key: i,
    label,
    isToday: i === todayIdx,
    range: formatRange(schedule.value[i])
  }))
})

const isOpenNow = computed(() => {
  const js = new Date().getDay()
  const idx = (js + 6) % 7
  return isOpenAt(idx)
})
</script>

<style scoped>
:root{
  --paper:#f5f0e4;
  --sepia:#3b1d12;
  --sepia-40:rgba(59,29,18,.4);
}

/* ===== Focus locale ===== */
.focus{
  background:#fff;
  border-bottom:1px solid rgba(0, 0, 0, 0.61);
  padding: 24px 0px 34px;
}
.focus__wrap{
  width:min(92%,1100px);
  margin: 18px auto;
  display:grid; gap:12px;
  grid-template-columns: 1fr;
  align-items:center;
  padding: 0 12px;
}
.focus__title{
  margin:0; font-size:clamp(20px,5.4%,32px); line-height:1.1; letter-spacing:-.01em;
}
.focus__meta{
  margin:.2rem 0 0; opacity:.7; font-size:14px; letter-spacing:.04em; text-transform:uppercase;
}
.focus__ctas{ display:flex; gap:10px; flex-wrap:wrap; }
.btn{ border-radius:12px; font-weight:800; letter-spacing:.02em; }
.btn--primary{ background:#111; color:#fff; }
.btn--ghost{ border-color:#111; color:#111; }

@media (min-width: 768px){
  .focus__wrap{ grid-template-columns: 1fr auto; padding: 0 16px; margin: 22px auto; }
}

/* ===== Soluzioni ===== */
.solutions{ background:#fff; padding: 14px 0 18px; }
.container{ width:92%; margin:0 auto; padding:0 12px; }
.sectionTitle{ margin:0 0 8px 0; font-size:clamp(18px,4.8%,24px); }

.solutions__rail{ overflow-x:auto; -webkit-overflow-scrolling:touch; padding: 2px 8px 2px 12px; }
.solutions__track{ display:flex; gap:10px; }
.sol{
  flex:0 0 82%; max-width:520px;
  border-radius:16px; padding:14px;
  background: var(--paper);
  border: 1px solid rgba(0,0,0,.06);
}
.sol__icon{
  width:42px; height:42px; display:grid; place-items:center;
  border-radius:10px; border:1px solid rgba(0,0,0,.12);
  margin-bottom:8px;
}
.sol__title{ font-weight:900; letter-spacing:.04em; text-transform:uppercase; }
.sol__desc{ font-size:13px; opacity:.85; margin-top:4px; }
.sol__cta{ margin-top:10px; font-weight:700; text-decoration:underline; text-underline-offset:2px; }

@media (min-width: 900px){
  .solutions__rail{ display:none; }
  .solutions__grid{
    width:min(92%,1100px); margin:0 auto; padding:0 16px;
    display:grid; grid-template-columns: repeat(3, 1fr); gap:14px;
  }
  .sol{ flex:initial; }
}

/* ===== Orari ===== */
.hours{
  background: var(--paper);
  border-top: 1.5px solid var(--sepia);
  border-bottom: 1.5px solid var(--sepia);
  padding: 14px 0 18px;
  color: var(--sepia);
}
.hours .container{ padding: 0 12px; }
.hours__head{
  display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:8px;
}
.hours__status{
  display:flex; align-items:center; gap:8px;
  font-size:12px; letter-spacing:.08em; text-transform:uppercase; opacity:.8;
}
.hours__status .dot{
  width:8px; height:8px; border-radius:50%; background:#b44;
  box-shadow:0 0 0 2px rgba(0,0,0,.06) inset;
}
.hours__status.open .dot{ background:#2b8a3e; }

.hours__list{ border-radius:12px; overflow:hidden; background:#fff; }
:deep(.q-item){ min-height: 42px; }
:deep(.q-item:not(.today)) .q-item__label{ opacity:.92; }
.hours__list .today{ background: rgba(186,176,150,.18); }
.hours__range{ opacity:.9; }

.hours__cta{
  width:min(92%,1100px);
  margin:10px auto 0;
  padding:0 12px;
}
.hours__cta .btn--primary{ background:#111; color:#fff; }
</style>

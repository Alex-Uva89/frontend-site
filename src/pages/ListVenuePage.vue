<template>
  <div class="venues-grid q-pa-none">
    <section class="cards" role="list">
      <article
        v-for="v in venues"
        :key="v.id"
        class="vcard"
        role="listitem"
        @click="goToVenue(v.id)"
      >
        <!-- Immagine di sfondo -->
        <div class="vcard__bg" :style="{ backgroundImage:`url(${v.image})` }" aria-hidden="true"></div>

        <!-- Top: Nome centrato + Stato -->
        <div class="vcard__top">
          <h3 class="vcard__title">{{ v.name }}</h3>
          <span class="vcard__status" :class="{ open: isOpenNow(v) }">
            {{ isOpenNow(v) ? $t('open.now','Aperto ora') : $t('closed.now','Chiuso') }}
          </span>
        </div>

        <!-- Bottom: CTA (non propagano il click) -->
        <div class="vcard__bottom" @click.stop>
          <q-btn no-caps unelevated class="btn primary"
            :label="$t('book','Prenota')" :href="v.bookingUrl" target="_blank" />
          <q-btn no-caps outline class="btn ghost"
            :label="$t('menu','Menu')" :href="v.menuUrl" />
        </div>
      </article>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { venues as data } from 'src/stores/venues.js'

const router = useRouter()

/* Solo i locali, senza filtri/ordinamenti extra */
const venues = computed(() => Array.isArray(data) ? data : [])

/* Stato apertura */
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

/* Navigazione: tutta la card è cliccabile */
function goToVenue (id){ router.push({ name: 'locale', params: { id } }) }
</script>

<style scoped>
/* ===== Layout pagina: solo griglia ===== */
.venues-grid{
  --bg: #efe6d3;     /* stone-100 */
  --ink: #2a2019;    /* sepia-900 */
  --brand: #c97e63;  /* clay-400 */
  background: var(--bg);
  min-height: 100%;
  color: var(--ink);
}

/* ===== Griglia piena, senza spazi attorno ===== */
.cards{
  display:grid;
  gap: 0;                 /* NESSUN gap: tassellato pieno */
  grid-template-columns: 1fr; /* mobile */
}

/* tablet: 2 colonne */
@media (min-width: 768px){
  .cards{ grid-template-columns: repeat(2, 1fr); }
}
/* desktop: 3 colonne piene */
@media (min-width: 1024px){
  .cards{ grid-template-columns: repeat(3, 1fr); }
}

/* ===== Card rettangolo pieno ===== */
.vcard{
  position: relative;
  width: 100%;
  min-height: 70vh;           /* mobile: grandi quasi fullscreen */
  aspect-ratio: auto;         /* mobile lascia libertà d'altezza */
  cursor: pointer;
  overflow: hidden;
  border-radius: 0;           /* niente arrotondamenti */
}
@media (min-width: 768px){
  .vcard{ min-height: 44vh; } /* tablet */
}
@media (min-width: 1024px){
  .vcard{
    min-height: 360px;
    aspect-ratio: 9 / 8;
  }
}

/* Sfondo immagine */
.vcard__bg{
  position:absolute; inset:0; z-index:0;
  background-size: cover; background-position: center;
  transform: scale(1.02);
}

/* Overlays per leggibilità (solo top e bottom) */
.vcard::before{
  content:""; position:absolute; inset:0 0 55% 0; z-index:0;
  background: linear-gradient(to bottom, rgba(0,0,0,.65), rgba(0,0,0,0));
  pointer-events:none;
}
.vcard::after{
  content:""; position:absolute; inset:60% 0 0 0; z-index:0;
  background: linear-gradient(to top, rgba(0,0,0,.55), rgba(0,0,0,0));
  pointer-events:none;
}

/* ===== Top: Nome centrato + Stato (stack verticale) ===== */
.vcard__top{
  position:absolute; top: 35px; left:0; right:0; z-index:1;
  display:grid; place-items:center; gap:6px;
  padding: 8px 10px;
  text-align:center;
}
.vcard__title{
  margin:0;
  color:#fff;
  font-weight: 900;
  line-height: 1.1;
  text-shadow: 0 1px 2px rgba(0,0,0,.35);
  font-size: clamp(18px, 2.4vw, 26px);
}
.vcard__status{
  display:inline-block;
  padding:6px 12px;
  border-radius: 999px;
  font-weight: 800;
  font-size: 12px;
  color:#fff;
  background: rgba(42,32,25,.78);
  border:1px solid rgba(255,255,255,.25);
}
.vcard__status.open{
  background: rgba(142,160,115,.92);
  color:#1b2316;
}

/* ===== Bottom: CTA ===== */
.vcard__bottom{
  position:absolute; left:0; right:0; bottom: 60px; z-index:1;
  display:flex; gap:10px; justify-content:center; flex-wrap:wrap;
  padding: 8px 12px;
}
.btn.primary{ background: var(--brand); color:#f6f1e7; }
.btn.ghost{ border-color: rgba(255,255,255,.8); color:#fff; background: rgba(255,255,255,.06); }

/* Motion safe */
@media (prefers-reduced-motion: reduce){
  *{ transition:none !important; animation:none !important; }
}
</style>

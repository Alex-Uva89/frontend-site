<template>
  <aside class="tv-controls seventies" aria-label="TV control panel">
    <div class="panel-inner">
      <!-- DISPLAY: TESTO (vetro) -->
      <div class="display-block glass" aria-label="Text display">
        <svg
          class="dotmatrix"
          :viewBox="`0 0 ${charWidth * chars.length} ${charHeight}`"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          :aria-label="displayText"
        >
          <g v-for="(ch, ci) in chars" :key="ci" :transform="`translate(${ci * charWidth},0)`">
            <rect
              v-for="(dot, di) in dotRects(ch)"
              :key="di"
              class="dot"
              :x="dot.x" :y="dot.y"
              :width="dotSize" :height="dotSize" rx="1.5" ry="1.5"
            />
          </g>
        </svg>
      </div>

      <!-- MANOPOLE → BOTTONI -->
      <div class="knobs">
        <ConcaveButton to="/" :size="72" />
        <LanguageKnob
          :locales="lang.supported"
          v-model="currentLocale"
          :width="140"
          :height="44"
        />
      </div>

      <!-- PROGRAMMI (auto-scale + 2 colonne) -->
      <div class="programs" role="group" aria-label="Program buttons">
        <button
          v-for="(link, i) in programs"
          :key="(link.to || link.href || i)"
          class="prog"
          type="button"
          @click="go(link)"
        >
          <span class="num digital">{{ i + 1 }}</span>
          <span class="text digital">{{ link.label }}</span>
        </button>
      </div>

      <div class="container-contacts">
        <div class="contacts">
          <RouterLink to="/contact" aria-label="Contatti">Contatti</RouterLink>
        </div>
      </div>

      <!-- LED + marchietto -->
      <div class="panel-footer">
        <div class="led-wrap" :aria-label="power ? 'Power on' : 'Power off'">
          <span class="led" :class="{ on: power }"></span>
          <span class="tiny">POWER</span>
        </div>
        <div class="brand">Powered by Uva</div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDrawerStore } from 'src/stores/drawerStore'
import { useLangStore } from 'src/stores/langStore'

import LanguageKnob from './LanguageKnob.vue'
import ConcaveButton from './ConcaveButton.vue'

/* === Props === */
const props = defineProps({
  power: { type: Boolean, default: true },
  displayText: { type: String, default: 'MAMMA ELVIRA' }
})

/* === Store: programmi === */
const drawer = useDrawerStore()
const programs = computed(() => drawer.links ?? [])

/* === Router === */
const router = useRouter()
function go(link){
  if (!link) return
  if (link.href) window.open(link.href, '_blank', 'noopener')
  else if (link.to) router.push(link.to)
}

/* === DOT-MATRIX 5×7 === */
const DOTS = Object.freeze({
  'A': ['01110','10001','10001','11111','10001','10001','10001'],
  'B': ['11110','10001','11110','10001','10001','10001','11110'],
  'C': ['01111','10000','10000','10000','10000','10000','01111'],
  'D': ['11110','10001','10001','10001','10001','10001','11110'],
  'E': ['11111','10000','11110','10000','10000','10000','11111'],
  'F': ['11111','10000','11110','10000','10000','10000','10000'],
  'G': ['01111','10000','10000','10111','10001','10001','01111'],
  'H': ['10001','10001','11111','10001','10001','10001','10001'],
  'I': ['01110','00100','00100','00100','00100','00100','01110'],
  'L': ['10000','10000','10000','10000','10000','10000','11111'],
  'M': ['10001','11011','10101','10101','10001','10001','10001'],
  'N': ['10001','11001','10101','10011','10001','10001','10001'],
  'O': ['01110','10001','10001','10001','10001','10001','01110'],
  'P': ['11110','10001','10001','11110','10000','10000','10000'],
  'R': ['11110','10001','10001','11110','10100','10010','10001'],
  'S': ['01111','10000','10000','01110','00001','00001','11110'],
  'T': ['11111','00100','00100','00100','00100','00100','00100'],
  'U': ['10001','10001','10001','10001','10001','10001','01110'],
  'V': ['10001','10001','10001','10001','01010','01010','00100'],
  'Y': ['10001','01010','00100','00100','00100','00100','00100'],
  ' ': ['00000','00000','00000','00000','00000','00000','00000']
})
const text = computed(() => (props.displayText || '').toUpperCase())
const chars = computed(() => text.value.split('').map(c => DOTS[c] ? c : ' '))
const dotSize = 6
const dotGap = 3
const cols = 5, rows = 7
const charWidth = (dotSize*cols) + (dotGap*(cols-1)) + 10
const charHeight = (dotSize*rows) + (dotGap*(rows-1))
function dotRects(ch){
  const pattern = DOTS[ch] || DOTS[' ']
  const rects = []
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      if (pattern[r][c] === '1'){
        rects.push({ x: c*(dotSize+dotGap), y: r*(dotSize+dotGap) })
      }
    }
  }
  return rects
}

/* === Power === */
const power = computed(() => props.power)

/* === Lingua === */
const lang = useLangStore()
const currentLocale = computed({
  get: () => lang.current,
  set: (val) => lang.setLocale ? lang.setLocale(val) : (lang.current = val)
})
lang.init()

/* === Auto-scaling area Programmi === */
const programsRef = ref(null)
const progScale = ref(1)
let ro = null
let rafId = 0

function recomputeScale(){
  const el = programsRef.value
  if (!el) return
  // azzero la scala per misurare la dimensione reale del contenuto
  el.style.setProperty('--prog-scale', 1)
  // leggo dimensioni
  const ch = el.clientHeight
  const sh = el.scrollHeight
  // calcolo scala massima che fa entrare il contenuto (mai oltre 1)
  const k = Math.min(1, ch > 0 ? ch / sh : 1)
  progScale.value = Number.isFinite(k) ? k : 1
  el.style.setProperty('--prog-scale', progScale.value)
}

function scheduleRecompute(){
  cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(() => recomputeScale())
}

onMounted(async () => {
  await nextTick()
  recomputeScale()
  // Riosserva cambi di dimensione del container
  ro = new ResizeObserver(scheduleRecompute)
  ro.observe(programsRef.value)
  window.addEventListener('resize', scheduleRecompute)
})

// ricalcola quando cambiano i programmi o la lingua (etichette più lunghe/corte)
watch([programs, currentLocale], async () => {
  await nextTick()
  scheduleRecompute()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', scheduleRecompute)
  if (ro) ro.disconnect()
})
</script>

<style scoped>
/* === PALETTE ’70s === */
.seventies .panel-inner{
  --wood-1:#3d281c; --wood-2:#5a3a26; --wood-3:#744b2e;
  --brass-1:#d9a441; --brass-2:#8d6423;
  --amber:#ffb750; --amber-glow:rgba(255,156,47,.55);
  --cream:#f7ead9;
}

/* Posizione: l'aside occupa sempre tutta l'altezza disponibile */
.tv-controls{
  position: absolute;
  top:    calc(var(--tv-top, 12px) + 10px);
  bottom: calc(var(--tv-bottom, 12px) + 10px);
  right: 10px;
  width: calc(var(--tv-right) - 30px);
  max-width: calc(100% - 20px);
  left: auto;
  pointer-events: auto;
}

/* Scatola legno + filetto ottone */
.panel-inner{
  position: relative;
  height: 100%; /* riempie l'aside */
  border-radius: 16px;
  background:
    radial-gradient(180% 120% at 20% 0%, rgba(255,255,255,.18), transparent 50%),
    radial-gradient(120% 120% at 100% 100%, rgba(255,255,255,.08), transparent 50%),
    repeating-linear-gradient(0deg, var(--wood-2) 0 6px, var(--wood-1) 6px 10px, var(--wood-3) 10px 14px);
  box-shadow: 0 10px 24px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.12), inset 0 -10px 18px rgba(0,0,0,.35);
  padding: 16px 14px;
  display: grid;
  grid-template-rows: auto auto 1fr auto; /* i programmi occupano il resto */
  gap: 14px;
  color: var(--cream);
  border: 2px solid #6a4a2f;
}
.panel-inner::before{
  content:""; position:absolute; inset:6px; border-radius: 12px;
  background: linear-gradient(180deg, var(--brass-1), var(--brass-2));
  opacity:.28;
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0); mask-composite: exclude;
  padding: 2px;
}
.panel-inner > * { min-height: 0; } /* consente ai figli di comprimersi */

/* Display vetro */
.display-block.glass{
  --glass-panel: rgba(16,16,16,.48);
  --glass-brd:   rgba(255,255,255,.16);
  position: relative;
  display: grid; justify-items: center; gap: 8px;
  padding: 20px 14px 20px; border-radius: 12px;
  background: rgb(0,0,0);
  border: 1px solid var(--glass-brd);
  box-shadow: 0 10px 24px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.12);
  backdrop-filter: blur(12px) saturate(1.08);
  -webkit-backdrop-filter: blur(12px) saturate(1.08);
  margin-bottom: 50px;
}
.display-block.glass::after{
  content:""; position:absolute; inset:0; border-radius: 10px;
  background: linear-gradient(145deg, rgba(255,255,255,.22), rgba(255,255,255,0) 50%);
  mix-blend-mode: screen; pointer-events:none; opacity:.25;
}
.dotmatrix{
  width: 100%; max-width: 280px; height: auto; display: block;
  filter: drop-shadow(0 0 4px rgb(255,255,255)) drop-shadow(0 0 20px rgb(255,0,0));
}
.dot{ fill: red; }

/* Manopole */
.knobs{
  background-color: #2a1a12;
  padding: 15px 0;
  border-radius: 10px;
  box-shadow: inset 0 0 10px wheat;
  display: flex;
  justify-content: space-around;
}

/* === PROGRAMMI — GRID 2×2 con bottoni che si adattano al contenitore === */
.programs{
  /* estetica */
  background-color: #2a1a12;
  padding: 15px;
  border-radius: 10px;
  box-shadow: inset 0 0 10px wheat;

  /* layout 2 colonne */
  --gap: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap);
  align-content: start;
  align-items: flex-start;

  /* abilita cqw/cqh (container query units) */
  container-type: size;

  /* comportamento */
  min-height: 0;
  overflow: auto;
}

/* Bottone tondo “vetro” che si adatta */
.prog{
  width:  calc(50cqw - (var(--gap) / 2));
  min-height: 0;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  border: 1px solid var(--glass-brd);
  position: relative;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: flex-start;
  justify-content: center;
  gap: 8px;
  padding: 12px;

  --glass-btn: rgba(32,32,32,.42);
  --glass-brd: rgba(255,255,255,.18);
  --glass-hi:  rgba(255,255,255,.45);
  --inner-ring: rgba(255,255,255,.08);

  background:
    linear-gradient(180deg, rgba(255,255,255,.14), rgba(255,255,255,0) 48%) border-box,
    var(--glass-btn);
  box-shadow:
    inset 0 1px 0 var(--glass-hi),
    inset 0 0 0 8px var(--inner-ring),
    inset 0 -14px 18px rgba(0,0,0,.28),
    0 0 20px rgb(0, 0, 0);

  transition: transform .06s ease, filter .18s ease, box-shadow .18s ease;
}
.prog::after{
  content:""; position:absolute; top: 8%; left: 12%; width: 62%; height: 46%;
  border-radius: 100% 100% 60% 60%;
  background: radial-gradient(ellipse at 30% 20%, rgba(255,255,255,.38), rgba(255,255,255,0) 60%);
  pointer-events:none; opacity:.55; filter: blur(.3px);
}
.prog:hover{
  filter: brightness(1.06) saturate(1.03);
  box-shadow:
    inset 0 1px 0 var(--glass-hi),
    inset 0 0 0 8px var(--inner-ring),
    inset 0 -14px 20px rgba(0,0,0,.34),
    0 10px 24px rgba(0,0,0,.38);
}
.prog:active{ transform: translateY(1px); }
.prog:focus-visible{ outline: 2px solid #9cf2b8; outline-offset: 2px; }

/* ——— DIGITALE (numero + nome) ——— */
.digital{
  --digit: #ffb6b6;
  --glow:  rgba(255, 120, 120, 0.55);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","Courier New", monospace;
  text-transform: uppercase;
  letter-spacing: .06em;
  color: var(--digit);
  text-shadow:
    0 0 2px var(--digit),
    0 0 6px var(--glow),
    0 0 14px var(--glow),
    0 2px 0 rgba(0,0,0,.35);
}

/* CONTACTS */
.container-contacts{
  display: flex;
  align-items: center;
  justify-content: end;
}
.contacts{
  width: 50%;
  padding: 10px 30px;
  border-radius: 12px;

  --paper-top: #fff7e8;
  --paper-mid: #f8f0e2;
  --paper-bot: #eeddc5;
  --edge: #00000030;
  --drop: rgba(0,0,0,.40);

  position: relative;
  background: linear-gradient(180deg, var(--paper-top), var(--paper-mid) 55%, var(--paper-bot));
  border: 1px solid var(--edge);
  box-shadow:
    0 10px 0 rgba(90, 60, 30, .45),
    0 14px 24px var(--drop),
    inset 0 1px 0 rgba(255,255,255,.9),
    inset 0 -12px 18px rgba(0,0,0,.10);
  cursor: pointer;
  user-select: none;
  text-align: center;
}
.contacts::after{
  content:"";
  position:absolute; inset:0; border-radius: inherit;
  background: linear-gradient(155deg, rgba(255,255,255,.45) 0%, rgba(255,255,255,0) 46%);
  mix-blend-mode: screen; opacity:.35; pointer-events:none;
}
.contacts > a{
  display:block; width: 100%; height: 100%;
  color: #2a1a12; font-weight: 800; letter-spacing: .12em;
  text-transform: uppercase; text-decoration: none;
}
.contacts:hover{
  filter: brightness(1.03) saturate(1.03);
  box-shadow:
    0 10px 0 rgba(90, 60, 30, .5),
    0 16px 26px var(--drop),
    inset 0 1px 0 rgba(255,255,255,.95),
    inset 0 -14px 20px rgba(0,0,0,.12);
}
.contacts:active{
  transform: translateY(2px);
  box-shadow:
    0 7px 0 rgba(90, 60, 30, .45),
    0 10px 18px var(--drop),
    inset 0 2px 0 rgba(255,255,255,.85),
    inset 0 -10px 16px rgba(0,0,0,.14);
}
.contacts > a:focus-visible{
  outline: 3px solid rgba(255, 221, 130, .9);
  outline-offset: 4px; border-radius: 10px;
}

/* NUMERO */
.num{
  font-weight: 900;
  font-size: clamp(20px, 2.6vw, 30px);
  line-height: 1;
  margin-top: 2px;
}

/* DIVISORE tra numero e nome */
.text::before{
  content:"";
  display:block; width: 64%; height: 1px; margin: 8px auto 6px;
  background: linear-gradient(90deg, rgba(255,255,255,.85), rgba(255,255,255,.4) 40%, rgba(255,255,255,.85) 100%);
  box-shadow:
    0 0 8px rgba(120,255,180,.45), 0 1px 0 rgba(0,0,0,.35) inset;
  border-radius: 999px;
}

/* NOME PROGRAMMA */
.text{
  max-width: 82%;
  text-align: center;
  font-weight: 800;
  font-size: clamp(11px, .95vw, 13px);
  line-height: 1.2;
  white-space: wrap;
}

/* Fallback senza aspect-ratio */
@supports not (aspect-ratio: 1 / 1){
  .prog{ height: 0; padding-bottom: 100%; }
  .prog > .num, .prog > .text{ position: absolute; left: 50%; transform: translateX(-50%); }
  .prog > .num{ top: 18%; }
  .prog > .text{ bottom: 16%; width: 82%; }
}

/* Footer */
.panel-footer{ display: grid; grid-template-columns: auto 1fr; align-items: center; }
.led-wrap{ display: grid; justify-items: center; gap: 4px; }
.tiny{ font-size: 9px; letter-spacing:.18em; color:#f0e3d2; opacity:.9; }
.led{
  width: 12px; height: 12px; border-radius: 50%;
  background:
    radial-gradient(circle at 35% 35%, rgba(255,255,255,.9) 0 20%, rgba(255,120,50,.9) 35%, rgba(120,50,0,1) 60%),
    #7a3b00;
  box-shadow: 0 0 12px rgba(255,140,50,.9), 0 0 22px rgba(255,140,50,.4);
  opacity: .35;
}
.led.on{ opacity: 1; }
.brand{
  justify-self: center; font-size: 12px; letter-spacing: .28em; color:#f4e7d4; opacity:.9; text-transform: uppercase;
}
.brand::before{
  content:""; display:inline-block; vertical-align:middle; margin-right:8px; width:38px; height:8px; border-radius: 999px;
  background: linear-gradient(90deg, #ff8a00, #ff0066, #00aaff);
  opacity:.55; filter: saturate(1.1);
}
</style>


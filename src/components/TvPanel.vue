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
          <g v-for="(ch, ci) in chars" :key="ci" :transform="`translate(${ci*charWidth},0)`">
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
        <KnobButton
          label="TUNER"
          aria-label="Tuner"
          @press="$emit && $emit('tuner')"
        />
        <KnobButton
          label="LANG"
          :title="`Lingua: ${lang.current.toUpperCase()}`"
          :angle="volAngle"
          aria-label="Cambia lingua"
          @press="onPressLangAnimated"
        />
      </div>

      <!-- PROGRAMMI (glass + digitale) -->
      <div class="programs" role="group" aria-label="Program buttons">
        <button
          v-for="(link, i) in programs"
          :key="(link.to||link.href||i)"
          class="prog"
          type="button"
          @click="go(link)"
        >
          <span class="num digital">{{ i+1 }}</span>
          <span class="text digital">{{ link.label }}</span>
        </button>
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
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDrawerStore } from 'src/stores/drawerStore'
import { useLangStore } from 'src/stores/langStore'
import KnobButton from 'src/components/KnobButton.vue'

const props = defineProps({
  power: { type: Boolean, default: true },
  displayText: { type: String, default: 'MAMMA ELVIRA' }
})

/* Store: programmi */
const drawer = useDrawerStore()
const programs = computed(() => drawer.links ?? [])

/* Router */
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

/* Power */
const power = computed(() => props.power)

/* === LINGUA GLOBALE === */
const lang = useLangStore()
const volAngle = ref(0)
function onPressLangAnimated(){
  volAngle.value = (volAngle.value + 30) % 360
  lang.cycleLocale()
}
</script>

<style scoped>
/* === PALETTE ’70s === */
.seventies .panel-inner{
  --wood-1:#3d281c; --wood-2:#5a3a26; --wood-3:#744b2e;
  --brass-1:#d9a441; --brass-2:#8d6423;
  --amber:#ffb750; --amber-glow:rgba(255,156,47,.55);
  --cream:#f7ead9;
}

/* Posizione */
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
  position: relative; height: 100%;
  border-radius: 16px;
  background:
    radial-gradient(180% 120% at 20% 0%, rgba(255,255,255,.18), transparent 50%),
    radial-gradient(120% 120% at 100% 100%, rgba(255,255,255,.08), transparent 50%),
    repeating-linear-gradient(0deg, var(--wood-2) 0 6px, var(--wood-1) 6px 10px, var(--wood-3) 10px 14px);
  box-shadow: 0 10px 24px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.12), inset 0 -10px 18px rgba(0,0,0,.35);
  padding: 16px 14px;
  display: grid;
  grid-template-rows: auto auto 1fr auto;
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

/* Display vetro (coerente col mobile) */
.display-block.glass{
  --glass-panel: rgba(16,16,16,.48);
  --glass-brd:   rgba(255,255,255,.16);

  position: relative;
  display: grid; justify-items: center; gap: 8px;
  padding: 20px 14px 20px; border-radius: 12px;

  background:rgb(0, 0, 0);
  border: 1px solid var(--glass-brd);

  box-shadow:
    0 10px 24px rgba(0,0,0,.35),
    inset 0 1px 0 rgba(255,255,255,.12);
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
  filter: drop-shadow(0 0 6px var(--amber-glow)) drop-shadow(0 0 16px rgba(255,160,60,.28));
}
.dot{ fill: var(--amber); }

/* Manopole */
.knobs{ display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

/* === PROGRAM BUTTONS — GLASS + DIGITALE (2 per fila) === */
.programs{
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr)); /* 2 per fila */
  gap: 14px;
  align-content: start;
  overflow: auto;
  padding-right: 2px;
}

/* Bottone tondo “vetro” con blur, identico vibe al mobile */
.prog{
  --glass-btn: rgba(32,32,32,.42);
  --glass-brd: rgba(255,255,255,.18);
  --glass-hi:  rgba(255,255,255,.45);
  --inner-ring: rgba(255,255,255,.08);

  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  border: 1px solid var(--glass-brd);
  overflow: hidden;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;

  background:
    linear-gradient(180deg, rgba(255,255,255,.14), rgba(255,255,255,0) 48%) border-box,
    var(--glass-btn);
  box-shadow:
    inset 0 1px 0 var(--glass-hi),
    inset 0 0 0 8px var(--inner-ring),
    inset 0 -14px 18px rgba(0,0,0,.28),
    0 8px 20px rgba(0,0,0,.36);
  backdrop-filter: blur(10px) saturate(1.05);
  -webkit-backdrop-filter: blur(10px) saturate(1.05);

  transition: transform .06s ease, filter .18s ease, box-shadow .18s ease;
}
.prog::after{
  /* riflesso morbido diagonale */
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
  --digit: #ffb6b6;                 /* verde “display” */
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
  display:block;
  width: 64%;
  height: 1px;
  margin: 8px auto 6px;
  background:
    linear-gradient(90deg, rgba(255,255,255,.85), rgba(255,255,255,.4) 40%, rgba(255,255,255,.85) 100%);
  box-shadow:
    0 0 8px rgba(120,255,180,.45),
    0 1px 0 rgba(0,0,0,.35) inset;
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

/* fallback senza aspect-ratio */
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

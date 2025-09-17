<template>
  <aside class="tv-controls" aria-label="TV control panel">
    <div class="panel-inner">
      <!-- DISPLAY: VISITORS -->
      <div class="display-block" aria-label="Visitors display">
        <svg
          class="sevenseg"
          :viewBox="`0 0 ${70*digitCount} 80`"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          :aria-label="`Visitors ${displayValue}`"
        >
          <g v-for="(digit, idx) in digits" :key="idx" class="digit" :transform="`translate(${idx*70},0)`">
            <rect v-for="s in segList" :key="s" class="seg" :class="{ on: isOn(digit, s) }" v-bind="segAttrs[s]" />
          </g>
        </svg>
        <span class="label">VISITORS</span>
      </div>

      <!-- MANOPOLE (estetiche) -->
      <div class="knobs">
        <div class="knob-group">
          <div class="knob" data-role="tuner"><div class="notch"></div></div>
          <span class="knob-label">TUNER</span>
        </div>
        <div class="knob-group">
          <div class="knob" data-role="volume"><div class="notch"></div></div>
          <span class="knob-label">VOLUME</span>
        </div>
      </div>

      <!-- PROGRAMMI dal drawerStore -->
      <div class="programs" role="group" aria-label="Program buttons">
        <button
          v-for="(link, i) in programs"
          :key="(link.to||link.href||i)"
          class="prog"
          type="button"
          @click="go(link)"
        >
          <span class="num">{{ i+1 }}</span>
          <span class="text">{{ link.label }}</span>
        </button>
      </div>

      <!-- LED + marchietto -->
      <div class="panel-footer">
        <div class="led-wrap" :aria-label="power ? 'Power on' : 'Power off'">
          <span class="led" :class="{ on: power }"></span>
          <span class="tiny">POWER</span>
        </div>
        <div class="brand">SognoVision</div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDrawerStore } from 'src/stores/drawerStore'

const props = defineProps({
  visitors: { type: Number, default: null },
  power:    { type: Boolean, default: true  }
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

/* VISITORS fallback locale */
const localVisitors = ref(0)
onMounted(() => {
  try{
    const K = 'sv_visitors'
    const n = (parseInt(localStorage.getItem(K) || '0', 10) || 0) + 1
    localStorage.setItem(K, String(n))
    localVisitors.value = n
  }catch(e){
    console.log(e)
  }
})
const displayValue = computed(() => (props.visitors ?? localVisitors.value))

/* 7-segment */
const digitCount = 4
const MAP = { 0:['a','b','c','d','e','f'], 1:['b','c'], 2:['a','b','g','e','d'], 3:['a','b','g','c','d'],
  4:['f','g','b','c'], 5:['a','f','g','c','d'], 6:['a','f','g','e','c','d'], 7:['a','b','c'], 8:['a','b','c','d','e','f','g'], 9:['a','b','c','d','f','g'] }
const segList = ['a','b','c','d','e','f','g']
const segAttrs = {
  a:{ x:13, y:8,  width:44, height:10, rx:2 },
  g:{ x:13, y:35, width:44, height:10, rx:2 },
  d:{ x:13, y:62, width:44, height:10, rx:2 },
  f:{ x:8,  y:13, width:10, height:22, rx:2 },
  e:{ x:8,  y:39, width:10, height:22, rx:2 },
  b:{ x:57, y:13, width:10, height:22, rx:2 },
  c:{ x:57, y:39, width:10, height:22, rx:2 },
}
const digits = computed(() => {
  const v = Math.max(0, Math.min(9999, Math.floor(displayValue.value || 0)))
  return String(v).padStart(digitCount, '0').split('').map(n => +n)
})
const isOn = (digit, seg) => MAP[digit]?.includes(seg)
</script>

<style scoped>
/* Posizione nella “spalla” destra della TV (solo desktop; su mobile la shell nasconde tutto) */
.tv-controls{
  position: absolute;
  top:    calc(var(--tv-top) + 12px);
  bottom: calc(var(--tv-bottom) + 12px);
  left:   calc(100% - var(--tv-right) + 12px);
  right:  12px;
  pointer-events: auto;
}

/* Pannello nero lucido */
.panel-inner{
  position: relative; height: 100%; border-radius: 14px;
  background:
    radial-gradient(140% 120% at 20% 0%, rgba(255,255,255,.18), rgba(255,255,255,0) 50%),
    linear-gradient(160deg, #0b0b0b 0%, #111 40%, #1a1a1a 55%, #080808 100%);
  box-shadow:
    0 1px 0 rgba(255,255,255,.25) inset,
    0 -10px 20px rgba(0,0,0,.6) inset,
    0 10px 18px rgba(0,0,0,.6) inset,
    0 8px 24px rgba(0,0,0,.5);
  padding: 16px 14px;
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  gap: 14px;
}

/* Display digitale */
.display-block{
  display: grid; justify-items: center; gap: 6px;
  padding: 8px 6px 10px; border-radius: 10px;
  background: linear-gradient(180deg, #0a0a0a, #121212);
  box-shadow: 0 1px 0 rgba(255,255,255,.15) inset, 0 -6px 10px rgba(0,0,0,.6) inset;
}
.sevenseg{
  width: 100%; max-width: 220px; height: auto; display: block;
  filter: drop-shadow(0 0 4px rgba(255,0,0,.55)) drop-shadow(0 0 10px rgba(255,0,0,.25));
}
.sevenseg .seg{ fill: rgba(200,0,0,.10); }
.sevenseg .seg.on{ fill: rgba(255,40,30,.95); }
.label{ font-size: 10px; letter-spacing: .18em; color: #bcbcbc; opacity:.9; }

/* Manopole */
.knobs{ display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.knob-group{ text-align: center; }
.knob-label{ display: block; margin-top: 6px; font-size: 10px; letter-spacing:.2em; color:#cfcfcf; opacity:.9; }
.knob{
  --k: 64px;
  width: var(--k); height: var(--k); margin: 0 auto; border-radius: 50%;
  background:
    radial-gradient(120% 130% at 30% 25%, rgba(255,255,255,.25), rgba(255,255,255,0) 55%),
    conic-gradient(from 210deg, #1e1e1e, #0f0f0f, #1a1a1a, #0a0a0a, #1e1e1e);
  box-shadow: 0 2px 3px rgba(255,255,255,.2) inset, 0 -6px 10px rgba(0,0,0,.65) inset, 0 10px 16px rgba(0,0,0,.5);
  position: relative;
}
.knob .notch{
  position: absolute; top: 6px; left: 50%; width: 3px; height: 18px; transform: translateX(-50%);
  background: linear-gradient(180deg, #e6e6e6, #999);
  border-radius: 2px; box-shadow: 0 0 1px rgba(0,0,0,.6);
}

/* Program buttons */
.programs{
  display: grid; grid-auto-rows: minmax(36px, auto); gap: 10px; overflow:auto;
  padding-right: 2px;
}
.prog{
  display: grid; grid-template-columns: 40px 1fr; align-items: center; gap: 10px;
  width: 100%; padding: 8px 10px; border: 0; cursor: pointer; user-select: none;
  border-radius: 8px;
  background: linear-gradient(180deg, #f2f2f2, #cfcfcf);
  box-shadow: 0 1px 0 rgba(255,255,255,.85) inset, 0 -3px 6px rgba(0,0,0,.35) inset, 0 3px 10px rgba(0,0,0,.5);
  color: #111; text-align: left; font-weight: 700; letter-spacing: .02em;
  transition: transform .05s ease, filter .15s ease;
}
.prog:hover{ filter: brightness(1.05); }
.prog:active{ transform: translateY(1px); filter: brightness(.96); }
.num{
  display: inline-grid; place-items: center; height: 24px; min-width: 32px; padding: 0 6px;
  border-radius: 6px; background: #111; color: #e7e7e7; font-variant-numeric: tabular-nums;
  box-shadow: 0 1px 0 rgba(255,255,255,.15) inset, 0 2px 4px rgba(0,0,0,.45);
}
.text{ white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Footer */
.panel-footer{ display: grid; grid-template-columns: auto 1fr; align-items: center; }
.led-wrap{ display: grid; justify-items: center; gap: 4px; }
.tiny{ font-size: 9px; letter-spacing:.18em; color:#cfcfcf; opacity:.85; }
.led{
  width: 12px; height: 12px; border-radius: 50%;
  background:
    radial-gradient(circle at 35% 35%, rgba(255,255,255,.9) 0 20%, rgba(255,0,0,.8) 35%, rgba(120,0,0,1) 60%),
    #700;
  box-shadow: 0 0 10px rgba(255,0,0,.8), 0 0 20px rgba(255,0,0,.35);
  opacity: .35;
}
.led.on{ opacity: 1; }
.brand{
  justify-self: center; font-size: 12px; letter-spacing: .28em; color:#ddd; opacity:.9; text-transform: uppercase;
}
</style>

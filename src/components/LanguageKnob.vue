<template>
  <div
    class="lang-lever"
    :style="{
      '--w': width + 'px',
      '--h': height + 'px',
      '--state': currentIndex === 1 ? 1 : 0
    }"
  >
    <!-- etichette sopra -->
    <div class="legend">
      <button
        class="legend-label left"
        :class="{ active: currentIndex === 0 }"
        type="button"
        @click="setIndex(0)"
      >{{ labelFor(left) }}</button>

      <button
        class="legend-label right"
        :class="{ active: currentIndex === 1 }"
        type="button"
        @click="setIndex(1)"
      >{{ labelFor(right) }}</button>
    </div>

    <button
      class="lever"
      type="button"
      role="switch"
      :aria-checked="currentIndex === 1"
      :aria-label="ariaLabel"
      :title="labelFor(current)"
      @click="toggle"
      @keydown.prevent="onKeydown"
      @wheel.prevent="onWheel"
    >
      <!-- placca avorio -->
      <div class="plate"></div>

      <!-- binario + knob -->
      <div class="track"></div>
      <div class="knob">
        <div class="cap"></div>
        <div class="shine"></div>
      </div>
    </button>

    <span class="sr-only" aria-live="polite">
      {{ labelFor(current) }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  locales: { type: Array, required: true },     // ['it-IT','en-US']
  modelValue: { type: String, default: '' },    // 'it-IT' | 'en-US'
  width: { type: Number, default: 140 },
  height: { type: Number, default: 44 },
  ariaLabel: { type: String, default: 'Selettore lingua' },
})
const emit = defineEmits(['update:modelValue','change'])

const left  = computed(() => props.locales?.[0] ?? 'it-IT')
const right = computed(() => props.locales?.[1] ?? 'en-US')

const currentIndex = computed(() => (props.modelValue === right.value ? 1 : 0))
const current = computed(() => (currentIndex.value === 1 ? right.value : left.value))

function short(code){ return (code?.split?.('-')?.[0] || code || '').slice(0,2).toUpperCase() }
function labelFor(code){
  const base = (code || '').toLowerCase()
  if (base.startsWith('it')) return 'ITALIANO'
  if (base.startsWith('en')) return 'ENGLISH'
  return short(code)
}

function setIndex(i){
  const code = i === 1 ? right.value : left.value
  emit('update:modelValue', code)
  emit('change', code)
}
function toggle(){ setIndex(currentIndex.value === 0 ? 1 : 0) }
function onKeydown(e){
  if (e.key === 'ArrowRight') setIndex(1)
  else if (e.key === 'ArrowLeft') setIndex(0)
  else if (e.code === 'Space' || e.key === ' ') toggle()
}
function onWheel(e){
  if (Math.sign(e.deltaY) > 0) setIndex(1)
  else if (Math.sign(e.deltaY) < 0) setIndex(0)
}
</script>

<style scoped>
/* accessibilità */
.sr-only{ position:absolute!important; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }

/* wrapper: le var servono anche alla legenda */

.lang-lever{
  --w: 140px;
  --h: 44px;
  --r: 12px;
  --pad: 6px;
  --state: 0;           /* 0=sinistra, 1=destra */
  --edge: #00000035;
  display: inline-grid;
  grid-template-rows: auto auto;
  gap: 6px;
  align-items: center;
  justify-items: center;
}

/* ===== legenda sopra ===== */
.legend{
  width: var(--w);
  display: grid; grid-template-columns: 1fr 1fr; align-items: center;
}
.legend-label{
  appearance: none; border: 0; background: none; cursor: pointer;
  font-weight: 800; letter-spacing: .04em; font-size: 12px;
  color:#a7755c; opacity:.6; padding: 2px 4px; border-radius: 6px;
  transition: opacity .18s ease, transform .18s ease, background .18s ease;
}
.legend-label.left{ justify-self: start; }
.legend-label.right{ justify-self: end; }
.legend-label:hover{ opacity: .9; transform: translateY(-1px); }
.legend-label.active{
  opacity: 1;
  background: rgba(255,221,130,.18);
}

/* ===== LEVETTA ’70s ===== */
.lever{
  width: var(--w); height: var(--h);
  position: relative;
  padding: 0; border: none; background: none; cursor: pointer;
  outline: none;
}
.lever:focus-visible{
  outline: 3px solid rgba(255,221,130,.9);
  outline-offset: 4px; border-radius: calc(var(--r) + 2px);
}

/* placca avorio */
.plate{
  position:absolute; inset:0; border-radius: var(--r);
  background: linear-gradient(180deg, #fff8ec, #f8f0e2 55%, #eadcc8);
  border: 1px solid var(--edge);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.9),
    inset 0 -10px 14px rgba(0,0,0,.10),
    0 8px 16px rgba(0,0,0,.35);
}
.plate::after{
  content:""; position:absolute; inset: 6% 10% 46% 12%; border-radius: var(--r);
  background: linear-gradient(155deg, rgba(255,255,255,.4), rgba(255,255,255,0) 60%);
  mix-blend-mode: screen; opacity: .45; pointer-events: none;
}

/* binario */
.track{
  --inset: var(--pad);
  position: absolute;
  left: var(--inset); right: var(--inset); top: 50%;
  height: calc(var(--h) - var(--pad) * 2);
  transform: translateY(-50%);
  border-radius: calc(var(--h) / 2);
  background:
    radial-gradient(120% 140% at 30% 30%, rgba(255,255,255,.25), rgba(255,255,255,0) 55%),
    #3a3a3a;
  border: 1px solid rgba(217,164,65,.35);
  box-shadow:
    inset 0 2px 3px rgba(255,255,255,.18),
    inset 0 -8px 12px rgba(0,0,0,.55);
}

/* knob che scorre */
.knob{
  --kn: calc(var(--h) - var(--pad) * 2 - 6px); /* diametro */
  position: absolute; top: 50%;
  left: 0;
  transform: translate(
    calc(var(--pad) + var(--state) * (var(--w) - var(--pad) * 2 - var(--kn))),
    -50%
  );
  width: var(--kn); height: var(--kn); border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #fafafa, #cfcfcf 60%, #8a8a8a);
  border: 1px solid rgba(0,0,0,.28);
  box-shadow:
    inset 0 1px 1px rgba(255,255,255,.6),
    0 2px 6px rgba(0,0,0,.45);
  transition: transform .18s ease;
}
.knob .cap{
  position:absolute; inset: 22%;
  border-radius:50%;
  background: radial-gradient(circle at 35% 35%, #fff, #bdbdbd 65%, #8a8a8a);
  box-shadow: inset 0 1px 1px rgba(255,255,255,.6);
}
.knob .shine{
  content:""; position:absolute; left:18%; top:18%;
  width: 40%; height: 28%; border-radius: 50%;
  background: radial-gradient(ellipse at 30% 30%, rgba(255,255,255,.7), rgba(255,255,255,0) 60%);
  pointer-events:none;
}
</style>

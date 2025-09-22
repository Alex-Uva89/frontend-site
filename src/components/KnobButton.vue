<template>
  <button
    class="knob-btn"
    :class="[{ 'is-pill': variant === 'pill', 'is-knob': variant === 'knob' }]"
    type="button"
    :aria-label="ariaLabel || label"
    :title="title || ariaLabel || label"
    @click="$emit('press')"
    @keydown.enter.prevent="$emit('press')"
    @keydown.space.prevent="$emit('press')"
  >
    <!-- VARIANTE KNOB (default) -->
    <template v-if="variant === 'knob'">
      <div class="knob">
        <div class="notch" :style="notchStyle"></div>
      </div>
      <span class="knob-label">{{ label }}</span>
    </template>

    <!-- VARIANTE PILL (capsula lucida) -->
    <template v-else>
      <span class="pill-label">{{ label }}</span>
    </template>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  ariaLabel: { type: String, default: '' },
  title: { type: String, default: '' },
  angle: { type: Number, default: 0 },  // per ruotare la tacca della knob
  variant: { type: String, default: 'knob' } // 'knob' | 'pill'
})

defineEmits(['press'])

const notchStyle = computed(() => ({
  transform: `translateX(-50%) rotate(${props.angle}deg)`
}))
</script>

<style scoped>
/* Base */
.knob-btn{
  background: none; border: 0; cursor: pointer; user-select: none;
  display:grid; justify-items:center; gap:6px; padding:0;
  color:#f4e7d4;
}
.knob-btn:focus-visible{ outline: 3px solid rgba(255, 221, 130, .9); outline-offset: 3px; border-radius: 12px; }

/* === Variant: KNOB (tonda, metal lucida) === */
.is-knob .knob{
  --k: 64px;
  width: var(--k); height: var(--k); border-radius: 50%;
  background:
    radial-gradient(120% 130% at 30% 25%, rgba(255,255,255,.35), rgba(255,255,255,0) 55%),
    conic-gradient(from 210deg, #434343, #2a2a2a, #4a4a4a, #1a1a1a, #434343);
  border: 2px solid rgba(217,164,65,.35); /* ottone */
  box-shadow:
    inset 0 2px 3px rgba(255,255,255,.2),
    inset 0 -10px 14px rgba(0,0,0,.55),
    0 8px 16px rgba(0,0,0,.45);
  position: relative;
  transition: transform .06s ease, filter .18s ease;
}
.is-knob .knob .notch{
  position: absolute; top: 6px; left: 50%;
  width: 3px; height: 20px; transform: translateX(-50%);
  background: linear-gradient(180deg, #fff, #bbb);
  border-radius: 2px; box-shadow: 0 0 1px rgba(0,0,0,.6);
}
.is-knob .knob-label{ font-size: 10px; letter-spacing:.22em; opacity:.95; }
.is-knob .knob:active{ transform: translateY(1px) scale(.995); filter: brightness(.98); }

/* === Variant: PILL (capsula lucida, coerente coi .prog) === */
.is-pill{
  grid-auto-flow: column; align-items: center;
  gap: 10px; padding: 10px 16px;
}
.is-pill{
  --btn-top:#ffe08f; --btn-mid:#d49b32; --btn-bot:#b7771e;
  --shine:rgba(255,255,255,.75); --shine2:rgba(255,255,255,.35); --edge:#0000003d;

  border: 1px solid var(--edge);
  border-radius: 999px;
  background:
    radial-gradient(120% 180% at 50% 0%, var(--shine2), transparent 55%),
    linear-gradient(180deg, var(--btn-top), var(--btn-mid) 60%, var(--btn-bot) 100%);
  box-shadow:
    inset 0 2px 0 var(--shine),
    inset 0 -10px 16px rgba(0,0,0,.35),
    0 8px 16px rgba(0,0,0,.45);
  position: relative;
  transition: transform .06s ease, filter .18s ease, box-shadow .18s ease;
}
.is-pill::before{
  content:""; position:absolute; inset: 2px; border-radius: inherit;
  background: linear-gradient(180deg, rgba(255,255,255,.65), rgba(255,255,255,0) 55%);
  mix-blend-mode: screen; opacity: .6; pointer-events: none;
}
.is-pill::after{
  content:""; position:absolute; top: 6%; left: 8%; width: 60%; height: 45%;
  border-radius: 100% 100% 60% 60%;
  background: radial-gradient(ellipse at 30% 20%, rgba(255,255,255,.55), rgba(255,255,255,0) 60%);
  filter: blur(0.4px); opacity: .45; pointer-events: none;
}
.is-pill:hover{ filter: brightness(1.06) saturate(1.03); }
.is-pill:active{
  transform: translateY(1px);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.6), inset 0 -6px 12px rgba(0,0,0,.4), 0 4px 10px rgba(0,0,0,.4);
}
.pill-label{ font-weight: 800; letter-spacing: .02em; color:#2a1a12; }
</style>

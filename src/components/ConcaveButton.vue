<template>
  <RouterLink
    class="home-concave"
    :style="{ '--k': size + 'px' }"
    :to="to"
    :aria-label="ariaLabel || label"
    :title="title || ariaLabel || label"
  >
    <span>{{ label }}</span>
  </RouterLink>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  label: { type: String, default: 'Home' },
  ariaLabel: { type: String, default: '' },
  title: { type: String, default: '' },
  to: { type: [String, Object], default: '/' },
  size: { type: Number, default: 72 }
})
</script>

<style scoped>

/* bottone tondo bianco incavo (’70s) */
.home-concave{
  --k: 72px;
  --edge:#00000035;
  --ivory-top:#fff8ec;
  --ivory-mid:#f8f0e2;
  --ivory-bot:#eadcc8;
  --drop: rgba(0,0,0,.35);

  display:flex;
  align-items: center;
  justify-content: center;
  width: var(--k); height: var(--k);
  border-radius: 50%;
  text-decoration: none;
  color: var(--drop);

  background: radial-gradient(120% 120% at 50% 35%, var(--ivory-top), var(--ivory-mid) 55%, var(--ivory-bot) 100%);
  border: 1px solid var(--edge);
  box-shadow:
    inset 0 10px 16px rgba(0, 0, 0, 0.527),
    inset 0 -10px 18px rgba(0, 0, 0, 0.514),
    inset 12px 0 16px rgba(0,0,0,.06),
    inset -12px 0 16px rgba(0,0,0,.06),
    0 10px 18px var(--drop);
  position: relative;
  transition: transform .06s ease, filter .18s ease, box-shadow .18s ease;
}
.home-concave::before{
  content:""; position:absolute; inset:0; border-radius: 50%;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.9), inset 0 -1px 0 rgba(0,0,0,.25);
}
.home-concave::after{
  content:""; position:absolute; inset: 4% 10% 40% 12%; border-radius: 50%;
  background: radial-gradient(ellipse at 30% 20%, rgba(255,255,255,.55), rgba(255,255,255,0) 60%);
  mix-blend-mode: screen; opacity: .45; filter: blur(.4px);
}
.home-concave:hover{
  filter: brightness(1.03) saturate(1.02);
  box-shadow:
    inset 0 10px 18px rgba(0,0,0,.15),
    inset 0 -12px 20px rgba(0,0,0,.12),
    inset 14px 0 18px rgba(0,0,0,.07),
    inset -14px 0 18px rgba(0,0,0,.07),
    0 12px 22px var(--drop);
}
.home-concave:active{
  transform: translateY(1px);
  box-shadow:
    inset 0 12px 20px rgba(0,0,0,.18),
    inset 0 -14px 22px rgba(0,0,0,.14),
    inset 16px 0 22px rgba(0,0,0,.09),
    inset -16px 0 22px rgba(0,0,0,.09),
    0 8px 16px var(--drop);
}
.home-concave:focus-visible{
  outline: 3px solid rgba(255,221,130,.9);
  outline-offset: 4px;
}
</style>

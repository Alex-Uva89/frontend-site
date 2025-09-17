<template>
  <nav class="tv-menu-mobile" aria-label="Programmi">
    <button class="menu-toggle" type="button" @click="open = !open" :aria-expanded="open">
      <span class="bar"></span>
    </button>

    <div class="tray" :class="{ open }" role="list">
      <button
        v-for="(link, i) in programs"
        :key="link.to || link.href || i"
        class="key retro"
        type="button"
        role="listitem"
        @click="go(link)"
      >
        <span class="knum">{{ i+1 }}</span>
        <span class="klabel">{{ link.label }}</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDrawerStore } from 'src/stores/drawerStore'

const open = ref(false)
const drawer = useDrawerStore()
const programs = computed(() => drawer.links ?? [])

const router = useRouter()
function go(link){
  if (!link) return
  open.value = false
  if (link.href) window.open(link.href, '_blank', 'noopener')
  else if (link.to) router.push(link.to)
}
</script>

<style scoped>
/* Visibile solo su mobile */
.tv-menu-mobile{ display:none; }
@media (max-width:700px){
  .tv-menu-mobile{
    display:block;
    position: fixed;
    /* allineato dentro lo schermo TV */
    left:   calc(var(--tv-gap-x) + var(--tv-left));
    right:  calc(var(--tv-gap-x) + var(--tv-right));
    bottom: calc(var(--tv-gap-bottom) + var(--tv-bottom) + env(safe-area-inset-bottom,0px));
    z-index: 50;
  }

  /* “tappo” retrò */
  .menu-toggle{
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    bottom: calc(100% + 8px);
    width: 72px; height: 18px;
    border:0; cursor:pointer; border-radius: 10px 10px 0 0;
    background:
      radial-gradient(140% 120% at 20% 0%, rgba(255,255,255,.25), rgba(255,255,255,0) 55%),
      linear-gradient(160deg, #0b0b0b 0%, #111 40%, #1a1a1a 55%, #080808 100%);
    box-shadow: 0 1px 0 rgba(255,255,255,.25) inset, 0 8px 14px rgba(0,0,0,.5);
  }
  .menu-toggle .bar{
    display:block; width: 36px; height: 3px; margin: 0 auto;
    border-radius: 2px;
    background: linear-gradient(180deg, #e9e9e9, #bdbdbd);
    box-shadow: 0 1px 0 rgba(255,255,255,.5) inset, 0 1px 2px rgba(0,0,0,.5);
  }

  /* Vassoio tasti */
  .tray{
    background: linear-gradient(180deg, #202020, #111);
    border-radius: 12px;
    box-shadow:
      0 1px 0 rgba(255,255,255,.2) inset,
      0 -10px 20px rgba(0,0,0,.5) inset,
      0 8px 20px rgba(0,0,0,.45);
    padding: 10px;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(140px, 44vw);
    gap: 10px;
    overflow-x: auto; overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
    transform: translateY(8px);
    opacity: 0; pointer-events: none;
    transition: transform .28s cubic-bezier(.2,.7,.2,1), opacity .2s ease;
    mask-image: linear-gradient(to right, transparent 0, #000 14px, #000 calc(100% - 14px), transparent 100%);
  }
  .tray.open{ transform: translateY(0); opacity: 1; pointer-events: auto; }

  /* Tasti retrò */
  .key.retro{
    scroll-snap-align: start;
    display:grid; grid-template-columns: 44px 1fr; align-items:center; gap:10px;
    padding: 12px 12px; border:0; cursor:pointer; user-select:none;
    border-radius: 12px;
    background: linear-gradient(180deg, #ffdf85, #d29a2e 60%, #b87f1f 100%);
    box-shadow:
      0 2px 0 rgba(255,255,255,.65) inset,
      0 -5px 10px rgba(0,0,0,.35) inset,
      0 4px 10px rgba(0,0,0,.45);
    color:#221; font-weight:800; letter-spacing:.02em;
    transition: transform .05s ease, filter .12s ease;
  }
  .key.retro:active{ transform: translateY(1px); filter: brightness(.96); }

  .knum{
    display:inline-grid; place-items:center;
    height: 28px; min-width: 36px; padding: 0 6px; border-radius: 8px;
    background: linear-gradient(180deg, #2a2a2a, #0f0f0f);
    color:#f2f2f2;
    box-shadow: 0 1px 0 rgba(255,255,255,.15) inset, 0 2px 4px rgba(0,0,0,.45);
    font-variant-numeric: tabular-nums;
  }
  .klabel{ white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
}
</style>

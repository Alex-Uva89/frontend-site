<!-- TvMenuMobile.vue -->
<template>
  <!-- Dock fissa in basso (mobile) -->
  <nav class="tv-mobile-dock seventies" aria-label="Programmi">
    <ul class="dock-list" role="menu">
      <li
        v-for="(link, i) in programs"
        :key="link.to || link.href || i"
        class="dock-item"
      >
        <button
          class="prog prog--dock"
          type="button"
          role="menuitem"
          @click="go(link)"
        >
          <span class="num digital">{{ i + 1 }}</span>
          <span class="text digital">{{ link.label }}</span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDrawerStore } from 'src/stores/drawerStore'

/* Programmi: usa linksMobile se presente, altrimenti links */
const drawer = useDrawerStore()
const programs = computed(() => {
  const m = drawer.linksMobile
  const d = drawer.links
  return (Array.isArray(m) && m.length) ? m : (Array.isArray(d) ? d : [])
})

/* Navigazione */
const router = useRouter()
function go(link){
  if (!link) return
  if (link.href) window.open(link.href, '_blank', 'noopener')
  else if (link.to) router.push(link.to)
}
</script>

<style scoped>
/* ====== mobile-only ====== */
.tv-mobile-dock{ display:none; }

@media (max-width:700px){
  .tv-mobile-dock{
    display:block;                       /* visibile su mobile */
    position: fixed;
    left: max(10px, env(safe-area-inset-left));
    right: max(10px, env(safe-area-inset-right));
    bottom: calc(10px + env(safe-area-inset-bottom));
    z-index: 2147483647;

    /* pannello legno/ottone in linea con la plancia desk */
    border-radius: 14px;
    padding: 10px 8px;
    background:
      radial-gradient(180% 120% at 20% 0%, rgba(255,255,255,.12), transparent 50%),
      radial-gradient(120% 120% at 100% 100%, rgba(255,255,255,.06), transparent 50%),
      repeating-linear-gradient(0deg, #5a3a26 0 6px, #3d281c 6px 10px, #744b2e 10px 14px);
    border: 2px solid #6a4a2f;
    box-shadow:
      0 10px 24px rgba(0,0,0,.45),
      inset 0 1px 0 rgba(255,255,255,.12),
      inset 0 -10px 18px rgba(0,0,0,.35);
  }

  /* lista orizzontale con snap */
  .dock-list{
    list-style: none; margin:0; padding:0;
    display:flex; gap:10px;
    overflow-x:auto; overflow-y:hidden;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x proximity;
  }
  .dock-item{
    scroll-snap-align: center;
    flex: 0 0 auto;
  }

  /* === Bottoni circolari stile desk, compatti per mobile === */
  .prog{
    --glass-brd: rgba(255,255,255,.18);
    --glass-hi:  rgba(255,255,255,.45);
    --inner-ring: rgba(255,255,255,.08);

    position: relative;
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px;
    width: 84px; height: 84px;        /* dimensione dock */
    border-radius: 50%;
    border: 1px solid var(--glass-brd);
    background:
      linear-gradient(180deg, rgba(255,255,255,.14), rgba(255,255,255,0) 48%) border-box,
      rgba(32,32,32,.42);
    box-shadow:
      inset 0 1px 0 var(--glass-hi),
      inset 0 0 0 6px var(--inner-ring),
      inset 0 -12px 16px rgba(0,0,0,.28),
      0 0 16px rgb(0 0 0 / .5);
    text-align:center;
    padding: 10px;
    color: #f7ead9;
  }
  .prog::after{
    content:""; position:absolute; top: 10%; left: 14%; width: 58%; height: 44%;
    border-radius: 100% 100% 60% 60%;
    background: radial-gradient(ellipse at 30% 20%, rgba(255,255,255,.32), rgba(255,255,255,0) 60%);
    pointer-events:none; opacity:.5; filter: blur(.3px);
  }
  .prog:focus-visible{ outline: 2px solid #ffcf66; outline-offset: 2px; }
  .prog:active{ transform: translateY(1px); }

  .digital{
    --digit: #ffb6b6;
    --glow:  rgba(255,120,120,.55);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","Courier New", monospace;
    text-transform: uppercase; letter-spacing:.06em;
    color: var(--digit);
    text-shadow:
      0 0 2px var(--digit),
      0 0 6px var(--glow),
      0 0 14px var(--glow),
      0 2px 0 rgba(0,0,0,.35);
  }
  .num{ font-weight:900; font-size: 18px; line-height:1; }
  .text{
    font-weight:800; font-size: 10px; line-height:1.1;
    max-width: 66px; white-space: wrap;
  }

  /* evita che la dock copra i contenuti (nota: :global richiede Vue SFC) */
  :global(body){ padding-bottom: calc(120px + env(safe-area-inset-bottom)); }
}

/* desktop: la dock non serve (plancia già presente) */
@media (min-width:701px){
  .tv-mobile-dock{ display:none; }
}
</style>

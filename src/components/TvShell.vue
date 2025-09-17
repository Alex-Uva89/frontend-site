<template>
  <div class="tv-shell">
    <!-- Piedini (solo desktop) -->
    <div class="tv-feet" aria-hidden="true">
      <div class="foot left"></div>
      <div class="foot right"></div>
    </div>

    <!-- Plancia (solo desktop) -->
    <div class="panel-desktop">
      <TvPanel />
    </div>
  </div>
</template>

<script setup>
import TvPanel from './TvPanel.vue'
</script>

<style scoped>
.tv-shell{
  position: fixed;
  top:    var(--tv-gap-top, 2.5vh);
  left:   var(--tv-gap-x,   2.5vw);
  right:  var(--tv-gap-x,   2.5vw);
  bottom: calc(var(--tv-gap-bottom, 6vh) + env(safe-area-inset-bottom, 0px));
  z-index: 999999;
  pointer-events: none; /* il contenuto dell'app resta cliccabile */
}

/* Cornice plastica rossa: anello con interno arrotondato */
.tv-shell::before{
  content:""; position:absolute; inset:0;
  padding: var(--tv-top) var(--tv-right) var(--tv-bottom) var(--tv-left);
  border-radius: var(--tv-radius);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  background:
    radial-gradient(130% 70% at 22% -10%, var(--plastic-highlight) 0%, rgba(255,255,255,.22) 18%, transparent 45%),
    radial-gradient(110% 70% at 100% 100%, rgba(255,255,255,.14) 0%, transparent 40%),
    linear-gradient(180deg, var(--plastic-600) 0%, var(--plastic-500) 38%, var(--plastic-400) 62%, var(--plastic-600) 100%);
  background-blend-mode: screen, screen, normal;
}
.tv-shell::after{
  content:""; position:absolute; inset:0;
  padding-top:    calc(var(--tv-top)    + var(--hair, 0.75px));
  padding-right:  calc(var(--tv-right)  + var(--hair, 0.75px));
  padding-bottom: calc(var(--tv-bottom) + var(--hair, 0.75px));
  padding-left:   calc(var(--tv-left)   + var(--hair, 0.75px));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  background:
    radial-gradient(farthest-side at var(--tv-left) var(--tv-top), var(--plastic-shadow-deep) 0%, transparent 28px),
    radial-gradient(farthest-side at calc(100% - var(--tv-right)) var(--tv-top), var(--plastic-shadow) 0%, transparent 26px),
    radial-gradient(farthest-side at calc(100% - var(--tv-right)) calc(100% - var(--tv-bottom)), var(--plastic-shadow) 0%, transparent 26px),
    radial-gradient(farthest-side at var(--tv-left) calc(100% - var(--tv-bottom)), var(--plastic-shadow) 0%, transparent 28px),
    linear-gradient(180deg, rgba(255,255,255,.22), transparent)
      top 0 left var(--tv-left) / calc(100% - var(--tv-left) - var(--tv-right)) 8px no-repeat,
    linear-gradient(90deg, rgba(255,255,255,.18), transparent)
      top var(--tv-top) left 0 / 8px calc(100% - var(--tv-top) - var(--tv-bottom)) no-repeat;
}

/* Piedini (desktop) */
.tv-feet{
  position: fixed;
  left:   var(--tv-gap-x, 2.5vw);
  right:  var(--tv-gap-x, 2.5vw);
  bottom: calc( max(1.2vh, var(--tv-gap-bottom, 6vh) * 0.4) );
  display: flex; justify-content: space-between; gap: 6vw;
  pointer-events: none; z-index: 999998;
}
.foot{
  position: relative;
  width:  clamp(80px, 12vw, 160px);
  height: clamp(10px, 1.4vh, 16px);
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(255,255,255,.16), rgba(0,0,0,.2)), #1b1b1b;
  box-shadow: 0 2px 2px rgba(255,255,255,.1) inset, 0 -2px 4px rgba(0,0,0,.35) inset, 0 6px 14px rgba(0,0,0,.45);
}
.foot::after{
  content:""; position:absolute; left:10%; right:10%; top:10%; height:40%;
  border-radius:999px; background: linear-gradient(180deg, rgba(255,255,255,.2), transparent);
  filter: blur(0.5px);
}

/* Plancia desktop container (abilita i click) */
.panel-desktop{ pointer-events: auto; }

/* Mobile: SOLO contorno rosso (niente plancia/piedini) */
@media (max-width:700px){
  .panel-desktop{ display: none; }
  .tv-feet{ display: none; }
}
</style>

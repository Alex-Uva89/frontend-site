<template>
  <!-- Defs SVG: sagoma convessa + mask per angoli interni -->
  <svg width="0" height="0" style="position:absolute; pointer-events:none" aria-hidden="true">
    <defs>
      <!-- Sagoma CRT convessa (lati verso l’esterno).
           Regola .06/.94 per avere meno/più spazio ai lati -->
      <clipPath id="crtClip" clipPathUnits="objectBoundingBox">
        <path d="
          M .06 .03
          C .35 -0.02, .65 -0.02, .94 .03
          C 1.00 .30, 1.00 .70, .94 .97
          C .65 1.02, .35 1.02, .06 .97
          C 0.00 .70, 0.00 .30, .06 .03 Z
        " />
      </clipPath>

      <!-- Mask per gli angoli interni rossi: tutto bianco (visibile),
           la sagoma CRT è nera (bucata). -->
      <mask id="innerCornersMask" maskUnits="objectBoundingBox">
        <rect x="0" y="0" width="1" height="1" fill="white"/>
        <path d="
          M .06 .03
          C .35 -0.02, .65 -0.02, .94 .03
          C 1.00 .30, 1.00 .70, .94 .97
          C .65 1.02, .35 1.02, .06 .97
          C 0.00 .70, 0.00 .30, .06 .03 Z
        " fill="black"/>
      </mask>
    </defs>
  </svg>

  <div class="tv-shell">
    <!-- anelli interni -->
    <div class="tv-bezel" aria-hidden="true"></div>
    <div class="tv-mesh" aria-hidden="true"></div>
    <div class="tv-vignette" aria-hidden="true"></div>

    <!-- angoli interni rossi che seguono la curva CRT -->
    <div class="tv-inner-corners" aria-hidden="true"></div>

    <!-- plancia -->
    <div class="panel-desktop">
      <TvPanel />
    </div>
  </div>
</template>

<script setup>
import TvPanel from './TvPanel.vue'
</script>

<style scoped>
/* ============== SHELL ESTERNA (scocca rossa) ============== */
.tv-shell{
  position: fixed;
  top: var(--tv-gap-top);
  left: var(--tv-gap-x);
  right: var(--tv-gap-x);
  bottom: var(--tv-gap-bottom);
  z-index: 999999;
  pointer-events: none;

  /* arrotonda anche la scocca fuori */
  border-radius: var(--tv-radius);
  overflow: hidden;

  /* fallback palette */
  --plastic-400: var(--plastic-400-fb, #d13b3f);
  --plastic-500: var(--plastic-500-fb, #b32329);
  --plastic-600: var(--plastic-600-fb, #7f1119);
  --plastic-highlight: var(--plastic-highlight-fb, rgba(255,255,255,.35));
  --plastic-shadow: var(--plastic-shadow-fb, rgba(0,0,0,.28));
  --plastic-shadow-deep: var(--plastic-shadow-deep-fb, rgba(0,0,0,.55));
  --tv-radius: var(--tv-radius, 22px);
}

/* plastica esterna (come avevi) */
.tv-shell::before{
  content:""; position:absolute; inset:0;
  padding: var(--tv-top) var(--tv-right) var(--tv-bottom) var(--tv-left);
  border-radius: inherit;

  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask-composite: exclude;

  background:
    radial-gradient(140% 90% at 22% -18%, rgba(255,255,255,.32) 0%, rgba(255,255,255,.18) 18%, rgba(255,255,255,0) 44%),
    radial-gradient(120% 80% at 100% 100%, rgba(255,255,255,.16) 0%, rgba(255,255,255,0) 46%),
    linear-gradient(180deg, var(--plastic-600) 0%, var(--plastic-500) 40%, var(--plastic-400) 62%, var(--plastic-600) 100%),
    radial-gradient(140% 120% at 50% 50%, rgba(0,0,0,.15), rgba(0,0,0,0) 60%),
    repeating-linear-gradient(135deg, rgba(255,255,255,.015) 0 2px, rgba(0,0,0,.015) 2px 4px);
    background-blend-mode: screen, screen, normal, multiply, soft-light;
    border-radius: 60px;
}
.tv-shell::after{
  content:""; position:absolute; inset:0;
  padding-top:    calc(var(--tv-top)    + var(--hair, .75px));
  padding-right:  calc(var(--tv-right)  + var(--hair, .75px));
  padding-bottom: calc(var(--tv-bottom) + var(--hair, .75px));
  padding-left:   calc(var(--tv-left)   + var(--hair, .75px));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask-composite: exclude;
  background:
    radial-gradient(farthest-side at var(--tv-left) var(--tv-top), var(--plastic-shadow-deep) 0%, transparent 28px),
    radial-gradient(farthest-side at calc(100% - var(--tv-right)) var(--tv-top), var(--plastic-shadow) 0%, transparent 26px),
    radial-gradient(farthest-side at calc(100% - var(--tv-right)) calc(100% - var(--tv-bottom)), var(--plastic-shadow) 0%, transparent 26px),
    radial-gradient(farthest-side at var(--tv-left) calc(100% - var(--tv-bottom)), var(--plastic-shadow) 0%, transparent 28px),
    linear-gradient(180deg, rgba(255,255,255,.24), transparent)
      top 0 left var(--tv-left) / calc(100% - var(--tv-left) - var(--tv-right)) 8px no-repeat,
    linear-gradient(90deg, rgba(255,255,255,.18), transparent)
      top var(--tv-top) left 0 / 8px calc(100% - var(--tv-top) - var(--tv-bottom)) no-repeat;

}

/* ============== ANELLI INTERNI (seguono la sagoma) ============== */
.tv-bezel,
.tv-mesh,
.tv-vignette{
  position:absolute;
  top:var(--tv-top); right:var(--tv-right); bottom:var(--tv-bottom); left:var(--tv-left);
  width: calc(100% - var(--tv-left) - var(--tv-right));
  height: calc(100% - var(--tv-top) - var(--tv-bottom));
  padding: calc(var(--bezel-width) + var(--mesh-width));
  pointer-events:none;
  -webkit-clip-path: url(#crtClip);
          clip-path: url(#crtClip);
}

/* ombre rimosse */
.tv-bezel{ z-index:999998; box-shadow:none; }
.tv-mesh{  z-index:999999; box-shadow:none;
  background:
    radial-gradient(circle at center, rgba(255,255,255,.08) 0 1px, transparent 1px) 0 0/6px 6px,
    radial-gradient(circle at center, rgba(0,0,0,.08) 0 1px, transparent 1px) 3px 3px/6px 6px;
  opacity:.9;
}
.tv-vignette{ z-index:1000000; box-shadow:none; }

/* ============== ANGOLI INTERNI ROSSI (curvi) ============== */
.tv-inner-corners{
  position:absolute;
  top:var(--tv-top); right:var(--tv-right); bottom:var(--tv-bottom); left:var(--tv-left);
  width: calc(100% - var(--tv-left) - var(--tv-right));
  height: calc(100% - var(--tv-top) - var(--tv-bottom));
  pointer-events:none;

  border-radius: 10px;
  /* stesso “vernice” della scocca (semplice gradiente coerente) */
  background: linear-gradient(180deg, var(--plastic-600) 0%, var(--plastic-500) 40%, var(--plastic-400) 62%, var(--plastic-600) 100%);

  /* mostra solo la zona tra rettangolo e CRT → angoli curvi */
  -webkit-mask: url(#innerCornersMask);
          mask: url(#innerCornersMask);

  /* assicurati che stia SOPRA il fondo ma SOTTO agli anelli */
  z-index: 999997;
}

/* plancia cliccabile */
.panel-desktop{ pointer-events:auto; }

/* mobile */
@media (max-width:700px){
  .tv-shell{ display:none; }
  .panel-desktop{ display:none; }
  .tv-feet{ display:none; }
}
</style>

<template>
  <div class="tv-shell">
    <!-- 1) BEZEL NERO LUCIDO (anello più esterno, sotto il retinato) -->
    <div class="tv-bezel" aria-hidden="false"></div>

    <!-- 2) ANELLO RETINATO tra scocca e schermo -->
    <div class="tv-mesh" aria-hidden="false"></div>

    <!-- 3) SFUMATURA VERSO L’INTERNO: nero → trasparente sopra il retinato -->
    <div class="tv-vignette" aria-hidden="false"></div>

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
/* Shell TV: overlay a filo del layout della pagina */
.tv-shell{
  position: fixed;
  top:    var(--tv-gap-top);
  left:   var(--tv-gap-x);
  right:  var(--tv-gap-x);
  bottom: var(--tv-gap-bottom);
  z-index: 999999;
  pointer-events: none; /* il contenuto dell'app resta cliccabile */

  /* fallback per i colori plastica se non definiti globalmente */
  --plastic-400: var(--plastic-400-fb, #d13b3f);
  --plastic-500: var(--plastic-500-fb, #b32329);
  --plastic-600: var(--plastic-600-fb, #7f1119);
  --plastic-highlight: var(--plastic-highlight-fb, rgba(255,255,255,.35));
  --plastic-shadow: var(--plastic-shadow-fb, rgba(0,0,0,.28));
  --plastic-shadow-deep: var(--plastic-shadow-deep-fb, rgba(0,0,0,.55));
  --tv-radius: var(--tv-radius, 22px);
}

/* ========== SCOSSA PLASTICA (più realistica) ========== */
/* Anello rosso in plastica: riflessi + micro-grana + occlusione interna */
.tv-shell::before{
  content:""; position:absolute; inset:0;
  padding: var(--tv-top) var(--tv-right) var(--tv-bottom) var(--tv-left);
  border-radius: var(--tv-radius);

  /* “anello” con foro centrale */
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;

  /* STRATI:
     1-2 riflessi speculari curvi (screen)
     3   base colore plastica (verticale)
     4   vignetta bordo per curva (multiply)
     5   micro-grana diagonale (soft-light)
  */
  background:
    radial-gradient(140% 90% at 22% -18%, rgba(255,255,255,.32) 0%, rgba(255,255,255,.18) 18%, rgba(255,255,255,0) 44%) ,
    radial-gradient(120% 80% at 100% 100%, rgba(255,255,255,.16) 0%, rgba(255,255,255,0) 46%) ,
    linear-gradient(180deg, var(--plastic-600) 0%, var(--plastic-500) 40%, var(--plastic-400) 62%, var(--plastic-600) 100%),
    radial-gradient(140% 120% at 50% 50%, rgba(0,0,0,.15), rgba(0,0,0,0) 60%),
    repeating-linear-gradient(135deg, rgba(255,255,255,.015) 0 2px, rgba(0,0,0,.015) 2px 4px);
  background-blend-mode:
    screen,
    screen,
    normal,
    multiply,
    soft-light;

  /* bordo leggermente bombato */
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.18),
    inset 0 -10px 18px rgba(0,0,0,.25);
}

/* Occlusione ai quattro angoli + hairline lucide interne */
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

  /* ombre d'angolo + riflessi linea sottile sui bordi interni */
  background:
    radial-gradient(farthest-side at var(--tv-left) var(--tv-top), var(--plastic-shadow-deep) 0%, transparent 28px),
    radial-gradient(farthest-side at calc(100% - var(--tv-right)) var(--tv-top), var(--plastic-shadow) 0%, transparent 26px),
    radial-gradient(farthest-side at calc(100% - var(--tv-right)) calc(100% - var(--tv-bottom)), var(--plastic-shadow) 0%, transparent 26px),
    radial-gradient(farthest-side at var(--tv-left) calc(100% - var(--tv-bottom)), var(--plastic-shadow) 0%, transparent 28px),
    /* hairline highlights */
    linear-gradient(180deg, rgba(255,255,255,.24), transparent)
      top 0 left var(--tv-left) / calc(100% - var(--tv-left) - var(--tv-right)) 8px no-repeat,
    linear-gradient(90deg, rgba(255,255,255,.18), transparent)
      top var(--tv-top) left 0 / 8px calc(100% - var(--tv-top) - var(--tv-bottom)) no-repeat;
}

/* ========== ANELLI INTERNI (correzioni calc + piccoli ritocchi) ========== */

/* 1) BEZEL NERO LUCIDO (sotto la mesh) */
.tv-bezel{
  position: absolute;
  top:    var(--tv-top);
  right:  var(--tv-right);
  bottom: var(--tv-bottom);
  left:   var(--tv-left);
  /* width/height non necessari con inset, ma se vuoi tenerli: */
  width: calc(100% - var(--tv-left) - var(--tv-right));
  height: calc(100% - var(--tv-top) - var(--tv-bottom));
  padding: calc(var(--bezel-width) + var(--mesh-width));
  box-shadow:
    inset 0 0 18px 12px rgba(0,0,0,.9),
    0 0 18px 12px rgba(0,0,0,.6);
  pointer-events: none;
  z-index: 999998; /* sotto mesh/vignette */
  border-radius: calc(var(--tv-radius) - 2px);
}

/* 2) ANELLO RETINATO (sopra il bezel, sotto la sfumatura) */
.tv-mesh{
  position: absolute;
  top:    var(--tv-top);
  right:  var(--tv-right);
  bottom: var(--tv-bottom);
  left:   var(--tv-left);
  width: calc(100% - var(--tv-left) - var(--tv-right));
  height: calc(100% - var(--tv-top) - var(--tv-bottom));
  padding: calc(var(--bezel-width) + var(--mesh-width));
  pointer-events: none;
  z-index: 999999;

  /* retinato: puntinato morbido + ombra interna */
  background:
    radial-gradient(circle at center, rgba(255,255,255,.08) 0 1px, transparent 1px) 0 0/6px 6px,
    radial-gradient(circle at center, rgba(0,0,0,.08) 0 1px, transparent 1px) 3px 3px/6px 6px;
  opacity:.9;
  box-shadow: inset 0 0 20px 20px rgba(0, 0, 0, .35);
  border-radius: calc(var(--tv-radius) - 4px);
}

/* 3) SFUMATURA VERSO L’INTERNO (nero→trasparente sopra la mesh) */
.tv-vignette{
  position: absolute;
  top:    var(--tv-top);
  right:  var(--tv-right);
  bottom: var(--tv-bottom);
  left:   var(--tv-left);
  width: calc(100% - var(--tv-left) - var(--tv-right));
  height: calc(100% - var(--tv-top) - var(--tv-bottom));
  padding: calc(var(--bezel-width) + var(--mesh-width));
  pointer-events: none;
  z-index: 1000000;
  border-radius: calc(var(--tv-radius) - 6px);

  /* sfumatura morbida sui 4 lati (resta nell’anello grazie al padding) */
  box-shadow:
    inset 0 0 24px 28px rgba(0, 0, 0, .42),
    inset 0 0 60px 30px rgba(0, 0, 0, .25);
}

/* Plancia desktop (click attivi qui) */
.panel-desktop{ pointer-events: auto; }

/* Mobile: solo contorno rosso */
@media (max-width:700px){
  .tv-shell{height: 95vh;}
  .panel-desktop{ display: none; }
  .tv-feet{ display: none; }
}
</style>

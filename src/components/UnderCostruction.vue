<template>
  <q-page class="page producers nosignal">
    <!-- Layer: barre TV -->
    <div class="tv-bars" aria-hidden="true"></div>

    <!-- Layer: disturbo / scanlines / vignette -->
    <div class="tv-noise" aria-hidden="true"></div>
    <div class="tv-scanlines" aria-hidden="true"></div>
    <div class="tv-vignette" aria-hidden="true"></div>

    <!-- Cartello centrale -->
    <section class="uc-center">
      <div class="uc-sign" role="status" aria-live="polite">
        <!-- metà bianca (testo nero) -->
        <div class="sign-half light">
          <div class="label it">IN&nbsp;ALLESTIMENTO</div>
        </div>

        <!-- divisore “disturbato” -->
        <div class="divider" aria-hidden="true"></div>

        <!-- metà nera (testo bianco) -->
        <div class="sign-half dark">
          <div class="label en">UNDER&nbsp;CONSTRUCTION</div>
        </div>

        <!-- micro-glitch RGB sul bordo -->
        <div class="glitch" aria-hidden="true">
          <span class="g g-r"></span>
          <span class="g g-c"></span>
          <span class="g g-b"></span>
        </div>
      </div>

      <div class="uc-cta">
        <q-btn to="/" color="primary" icon="home" no-caps class="cta-btn" label="Torna alla Home" />
        <q-btn flat color="white" icon="schedule" no-caps class="cta-btn" label="Aggiornamenti presto" />
      </div>
    </section>
  </q-page>
</template>

<script setup>

</script>

<style scoped>
/* -------------------------
   MOBILE-FIRST  (default)
   ------------------------- */

/* Schermo pieno e pulito su mobile, senza padding di QPage */
.page.producers.nosignal{
  padding: 0 !important;
  position: relative;
  min-height: 100svh;   /* viewport “small” reale sui mobile */
  min-height: 100dvh;   /* fallback */
  min-height: 100vh;    /* fallback vecchi */
  overflow: hidden;
  /* brand: legno attenuato sotto */
  background:
    radial-gradient(120% 90% at 20% 0%, rgba(0,0,0,.28), rgba(0,0,0,0) 50%),
    repeating-linear-gradient(0deg, #5a3a26 0 6px, #3f281c 6px 10px, #6f4a2e 10px 14px);
}

/* Barre TV (no signal) */
.tv-bars{
  position: absolute; inset: 0;
  background:
    linear-gradient(90deg,
      #c0c0c0 0% 12.5%,
      #ff0033 12.5% 25%,
      #ffa500 25% 37.5%,
      #ffee00 37.5% 50%,
      #00ff66 50% 62.5%,
      #00ccff 62.5% 75%,
      #6666ff 75% 87.5%,
      #ff00aa 87.5% 100%
    );
  filter: saturate(1.02) contrast(1.02);
  animation: barWobble 10s ease-in-out infinite;  /* più lenta su mobile */
  will-change: transform;
}
@keyframes barWobble{
  0%,100%{ transform: translateX(0) }
  50%{ transform: translateX(-0.6%) }
}

/* Disturbo / noise (alleggerito) */
.tv-noise{
  position: absolute; inset: 0;
  background:
    /* righe orizzontali leggere */
    repeating-linear-gradient(0deg,  rgba(255,255,255,.02) 0 3px, rgba(0,0,0,.02) 3px 6px),
    /* righe verticali larghe (meno pesanti) */
    repeating-linear-gradient(90deg, rgba(255,255,255,.012) 0 5px, rgba(0,0,0,.012) 5px 10px),
    /* puntinato sparso */
    radial-gradient(circle at 20% 30%, rgba(255,255,255,.05) 0 1px, transparent 1px),
    radial-gradient(circle at 70% 60%, rgba(0,0,0,.05) 0 1px, transparent 1px);
  background-size: 100% 6px, 10px 100%, 3px 3px, 3px 3px;
  mix-blend-mode: overlay;
  animation: noiseShift .9s steps(2,end) infinite, vRoll 12s linear infinite;
  opacity: .70;
  pointer-events: none;
  will-change: filter, transform, opacity;
}
@keyframes noiseShift{ 0%{filter:brightness(1)} 50%{filter:brightness(1.06)} 100%{filter:brightness(1)} }
@keyframes vRoll{ 0%{transform: translateY(0)} 100%{transform: translateY(-1.6%)} }

/* Scanlines CRT */
.tv-scanlines{
  position: absolute; inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    rgba(0,0,0,.10) 0 1px,
    rgba(255,255,255,.02) 1px 2px
  );
  mix-blend-mode: multiply;
  animation: scanFlicker 3s ease-in-out infinite;
  pointer-events: none;
}
@keyframes scanFlicker{ 0%,100%{opacity:.26} 50%{opacity:.34} }

/* Vignetta */
.tv-vignette{
  position: absolute; inset: 0;
  background: radial-gradient(80% 80% at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,.55) 100%);
  pointer-events: none;
}

/* Cartello centrato (mobile safe-areas) */
.uc-center{
  position: relative; z-index: 1;
  min-height: 100svh;
  min-height: 100dvh;
  min-height: 100vh;
  display: grid; place-items: center;
  padding: 20px;
  padding-left: max(20px, env(safe-area-inset-left));
  padding-right: max(20px, env(safe-area-inset-right));
  padding-top: max(20px, env(safe-area-inset-top));
  padding-bottom: max(20px, env(safe-area-inset-bottom));
}

/* Cornice “vetro” del cartello */
.uc-sign{
  position: relative;
  width: 92%;
  max-width: 680px;            /* mobile-first; aumentiamo su desktop in @media */
  border-radius: 16px;
  border: 2px solid transparent;
  background:
    linear-gradient(180deg, rgba(255,255,255,.18), rgba(255,255,255,0) 48%) padding-box,
    linear-gradient(180deg, rgba(255,255,255,.35), rgba(255,255,255,.15)) border-box;
  box-shadow: 0 10px 22px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.35);
  overflow: hidden;
  transform: translateZ(0);
  animation: emJitter 3.2s ease-in-out infinite;
  will-change: transform;
}
@keyframes emJitter{ 0%,100%{transform: translateX(0)} 30%{transform: translateX(-0.4px)} 60%{transform: translateX(0.6px)} }

/* Metà bianca/nera */
.sign-half{
  display: grid; place-items: center;
  padding: 18px 16px;
}
.sign-half.light{ background:#fff; color:#111; }
.sign-half.dark{
  background:#0d0d0d; color:#fafafa;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.08);
}

/* Testo responsivo */
.uc-sign .label{
  font-weight: 900;
  letter-spacing: .10em;
  text-transform: uppercase;
  text-align: center;
  line-height: 1.15;
  font-size: clamp(18px, 6vw, 34px);
  text-shadow: 0 2px 0 rgba(0,0,0,.22);
}
.uc-sign .en{ font-size: clamp(16px, 5.2vw, 28px); }

/* Divisore disturbato */
.uc-sign .divider{
  width: 100%; height: 2px;
  background: linear-gradient(90deg, rgba(0,0,0,.85), rgba(255,255,255,.85), rgba(0,0,0,.85));
  animation: barNoise 1.2s steps(2,end) infinite;
  will-change: transform;
}
@keyframes barNoise{ 0%{transform:translateX(0)} 50%{transform:translateX(.6%)} 100%{transform:translateX(0)} }

/* Micro RGB-split glitch */
.uc-sign .glitch{ pointer-events: none; }
.uc-sign .g{
  position:absolute; inset:0; border-radius:14px;
  mix-blend-mode:screen; opacity:.16;
}
.uc-sign .g-r{ box-shadow:0 0 0 2px rgba(255,70,70,.65) inset; transform:translateX(-0.5px) }
.uc-sign .g-c{ box-shadow:0 0 0 2px rgba(70,255,255,.65) inset;  transform:translateX( 0.5px) }
.uc-sign .g-b{ box-shadow:0 0 0 1px rgba(90,90,255,.55) inset;   transform:translateY( 0.4px) }

/* CTA: stack vertical su mobile, tap-friendly */
.uc-cta{
  margin-top: 14px;
  width: 92%; max-width: 680px;
  display: flex; flex-direction: column; gap: 8px;
}
.cta-btn{ width: 100%; }

/* -------------------------
   DESKTOP ENHANCEMENTS
   ------------------------- */
@media (min-width: 900px){
  .tv-bars{ animation-duration: 8s; }
  .tv-noise{
    background-size: 100% 4px, 6px 100%, 3px 3px, 3px 3px;
    opacity: .75;
    animation-duration: .8s, 9s;
  }
  .tv-scanlines{ animation-duration: 2.8s; }

  .uc-center{ padding: 24px; }
  .uc-sign{ max-width: 780px; box-shadow: 0 12px 26px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.35); }
  .sign-half{ padding: 22px 28px; }
  .uc-cta{ flex-direction: row; justify-content: center; }
  .cta-btn{ width: auto; }
}

/* Riduzione motion (rispetta preferenze utente) */
@media (prefers-reduced-motion: reduce){
  .tv-bars, .tv-noise, .tv-scanlines, .uc-sign .divider, .uc-sign{
    animation: none !important;
  }
}
</style>

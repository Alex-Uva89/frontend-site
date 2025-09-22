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
        <q-btn to="/" color="primary" icon="home" no-caps label="Torna alla Home" />
        <q-btn flat color="white" icon="schedule" no-caps label="Aggiornamenti presto" />
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { useMeta } from 'quasar'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
useMeta(() => ({
  title: t('pages.producers.metaTitle') || 'Produttori | Mamma Elvira'
}))
</script>

<style scoped>
/* ===== LAYOUT BASE ===== */
.page.producers.nosignal{
  padding: 0 !important;
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(120% 90% at 20% 0%, rgba(0,0,0,.28), rgba(0,0,0,0) 50%),
    repeating-linear-gradient(0deg, #5a3a26 0 6px, #3f281c 6px 10px, #6f4a2e 10px 14px);
}

/* ===== BARRE TV ===== */
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
  filter: saturate(1.05) contrast(1.02);
  animation: barWobble 8s ease-in-out infinite;
}
@keyframes barWobble{ 0%,100%{ transform: translateX(0) } 50%{ transform: translateX(-0.6%) } }

/* ===== DISTURBO / NOISE ===== */
.tv-noise{
  position: absolute; inset: 0;
  background:
    repeating-linear-gradient(0deg,  rgba(255,255,255,.02) 0 2px, rgba(0,0,0,.02) 2px 4px),
    repeating-linear-gradient(90deg, rgba(255,255,255,.015) 0 3px, rgba(0,0,0,.015) 3px 6px),
    radial-gradient(circle at 20% 30%, rgba(255,255,255,.05) 0 1px, transparent 1px),
    radial-gradient(circle at 70% 60%, rgba(0,0,0,.05) 0 1px, transparent 1px);
  background-size: 100% 4px, 6px 100%, 3px 3px, 3px 3px;
  mix-blend-mode: overlay;
  animation: noiseShift .8s steps(2,end) infinite, vRoll 9s linear infinite;
  opacity: .75;
  pointer-events: none;
}
@keyframes noiseShift{ 0%{ filter:brightness(1) } 50%{ filter:brightness(1.08) } 100%{ filter:brightness(1) } }
@keyframes vRoll{ 0%{ transform: translateY(0) } 100%{ transform: translateY(-2%) } }

/* ===== SCANLINES CRT ===== */
.tv-scanlines{
  position: absolute; inset: 0;
  background: repeating-linear-gradient(to bottom, rgba(0,0,0,.12) 0 1.5px, rgba(255,255,255,.02) 1.5px 2.5px);
  mix-blend-mode: multiply; animation: scanFlicker 2.8s ease-in-out infinite; pointer-events:none;
}
@keyframes scanFlicker{ 0%,100%{ opacity:.28 } 50%{ opacity:.38 } }

/* ===== VIGNETTE ===== */
.tv-vignette{ position:absolute; inset:0; background: radial-gradient(80% 80% at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,.55) 100%); pointer-events:none; }

/* ===== CARTELLO CENTRALE ===== */
.uc-center{
  position: relative; z-index: 1;
  height: 100dvh; display: grid; place-items: center; padding: 24px;
}

/* cornice “vetro” */
.uc-sign{
  position: relative;
  width: min(780px, 92vw);
  border-radius: 16px;
  border: 2px solid transparent;
  background:
    linear-gradient(180deg, rgba(255,255,255,.18), rgba(255,255,255,0) 48%) padding-box,
    linear-gradient(180deg, rgba(255,255,255,.35), rgba(255,255,255,.15)) border-box;
  box-shadow: 0 12px 26px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.35);
  overflow: hidden; /* per i bordi arrotondati delle metà */
  transform: translateZ(0);
  animation: emJitter 3.2s ease-in-out infinite;
}
@keyframes emJitter{ 0%,100%{ transform: translateZ(0) translateX(0) } 30%{ transform: translateX(-0.4px) } 60%{ transform: translateX(0.6px) } }

/* metà superior/inferior */
.sign-half{
  display:grid; place-items:center;
  padding: 22px 28px;
}
.sign-half.light{
  background: #ffffff;
  color:#111;
}
.sign-half.dark{
  background: #0d0d0d;
  color:#fafafa;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.08);
}

/* testo — eredita il colore dal contenitore */
.uc-sign .label{
  font-weight: 900;
  letter-spacing: .12em;
  text-transform: uppercase;
  text-align: center;
  line-height: 1.1;
  font-size: clamp(20px, 6vw, 40px);
  text-shadow: 0 2px 0 rgba(0,0,0,.24);
}
.uc-sign .en{
  font-size: clamp(18px, 5vw, 32px);
}

/* divisore “disturbato” tra le due metà */
.uc-sign .divider{
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, rgba(0,0,0,.85), rgba(255,255,255,.85), rgba(0,0,0,.85));
  position: relative;
  animation: barNoise 1.2s steps(2,end) infinite;
}
@keyframes barNoise{ 0%{ transform: translateX(0) } 50%{ transform: translateX(.6%) } 100%{ transform: translateX(0) } }

/* micro “RGB split” glitch sul bordo del cartello */
.uc-sign .glitch{ pointer-events:none; }
.uc-sign .g{
  position:absolute; inset:0; border-radius:14px;
  mix-blend-mode:screen; opacity:.18;
}
.uc-sign .g-r{ box-shadow:0 0 0 2px rgba(255,70,70,.7) inset; transform: translateX(-0.6px) }
.uc-sign .g-c{ box-shadow:0 0 0 2px rgba(70,255,255,.7) inset; transform: translateX( 0.6px) }
.uc-sign .g-b{ box-shadow:0 0 0 1px rgba(90,90,255,.6) inset;  transform: translateY( 0.4px) }

/* CTA */
.uc-cta{ margin-top:16px; display:flex; gap:8px; flex-wrap:wrap; justify-content:center; }

/* riduzione motion */
@media (prefers-reduced-motion: reduce){
  .tv-bars, .tv-noise, .tv-scanlines, .uc-sign .divider, .uc-sign{ animation: none !important; }
}

/* safe areas */
@supports(padding: max(0px)){
  .uc-center{ padding: max(24px, env(safe-area-inset-left)) max(24px, env(safe-area-inset-right)); }
}
</style>

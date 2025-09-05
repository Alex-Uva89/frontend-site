<template>
  <q-layout view="lHh Lpr lFf">
    <Navbar
      booking-url="https://prenota.example"
      instagram-url="https://instagram.com/mammaelvira"
      facebook-url="https://facebook.com/mammaelvira"
      @menu="drawer = true"
    />

    <!-- Drawer emozionale -->
    <q-drawer
      v-model="drawer"
      side="left"
      overlay
      elevated
      width="420"
      content-class="drawer drawer--emotional"
    >
      <q-scroll-area class="fit">
        <div class="drawer__wrap">
          <!-- Close -->
          <div class="drawer__header">
            <q-btn flat round dense icon="close" aria-label="Chiudi" @click="drawer = false" />
          </div>

          <!-- Blocco hero emozionale -->
          <div class="drawer__hero">
            <h2>mamma elvira group</h2>
            <p>Ingredienti selezionati, artigianalità radicale, ospitalità contemporanea. Lecce, casa.</p>
          </div>

          <q-separator dark spaced />

          <!-- Link di sezione -->
          <div class="drawer__links">
            <q-item clickable to="/" v-ripple class="link"><q-item-section>Home</q-item-section></q-item>
            <q-item clickable to="/venues" v-ripple class="link"><q-item-section>I nostri locali</q-item-section></q-item>
            <q-item clickable to="/story" v-ripple class="link"><q-item-section>La nostra storia</q-item-section></q-item>
            <q-item clickable to="/producers" v-ripple class="link"><q-item-section>Produttori</q-item-section></q-item>
            <q-item clickable to="/jobs" v-ripple class="link"><q-item-section>Lavora con noi</q-item-section></q-item>
            <q-item clickable to="/contact" v-ripple class="link"><q-item-section>FAQ & Contatti</q-item-section></q-item>
          </div>

          <!-- CTA principali -->
          <div class="drawer__ctas">
            <q-btn
              unelevated
              class="cta cta--primary"
              label="Prenota un tavolo"
              :href="bookingUrl"
              target="_blank"
              @click="drawer = false"
            />
            <q-btn
              outline
              class="cta cta--ghost"
              label="Eventi privati"
              to="/events"
              @click="drawer = false"
            />
          </div>

          <!-- Social + Lingua -->
          <div class="drawer__social">
            <a :href="instagramUrl" target="_blank" aria-label="Instagram" class="social">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor"
                  d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 4.5a5.5 5.5 0 1 1 0 11a5.5 5.5 0 0 1 0-11Zm0 2a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7Zm5.75-.75a.75.75 0 1 1 0-1.5a.75.75 0 0 1 0 1.5Z"/>
              </svg>
            </a>

            <a :href="facebookUrl" target="_blank" aria-label="Facebook" class="social">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor"
                  d="M13 10h3l-.5 3H13v9h-3v-9H8v-3h2V8.5A4.5 4.5 0 0 1 14.5 4H17v3h-2.5A1.5 1.5 0 0 0 13 8.5V10Z"/>
              </svg>
            </a>

            <q-btn flat dense no-caps class="lang" @click="toggleLocale">
              {{ nextLocale }}
            </q-btn>
          </div>

          <div class="drawer__footnote">“La qualità del Salento, senza compromessi.”</div>
        </div>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue';
import Navbar from 'components/NavbarComponent.vue';

const drawer = ref(false);

const bookingUrl = 'https://prenota.example';
const instagramUrl = 'https://instagram.com/mammaelvira';
const facebookUrl = 'https://facebook.com/mammaelvira';

const locale = ref('it');
const toggleLocale = () => { locale.value = locale.value === 'it' ? 'en' : 'it'; };
const nextLocale = computed(() => (locale.value === 'it' ? 'EN' : 'IT'));
</script>

<style>
/* nessun offset globale: video a filo */
.q-page-container { padding-top: 0 !important; }

/* Drawer “emozionale” */
.drawer--emotional{
  color: #fff;
  background:
    radial-gradient(120% 100% at 10% 0%, rgba(201,126,99,.55), rgba(109,122,79,.35) 40%, rgba(0,0,0,.55) 100%),
    linear-gradient(160deg, rgba(0,0,0,.25), rgba(0,0,0,.55));
  backdrop-filter: blur(6px);
  position: relative;
  overflow: hidden;
}
.drawer--emotional::before{
  content: '';
  position: absolute; inset: -50% -20%;
  background: conic-gradient(from 0deg, rgba(255,255,255,.05), rgba(255,255,255,0) 20%, rgba(255,255,255,.05) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,.05) 80%, rgba(255,255,255,0) 100%);
  animation: swirl 16s linear infinite;
  pointer-events: none;
}
.drawer--emotional::after{
  content: '';
  position: absolute; inset: 0;
  background-image: radial-gradient(rgba(255,255,255,.06) 1px, transparent 1px);
  background-size: 3px 3px;
  opacity: .55;
  pointer-events: none;
}

@keyframes swirl {
  0% { transform: rotate(0deg) scale(1); }
  100% { transform: rotate(360deg) scale(1); }
}
@media (prefers-reduced-motion: reduce){
  .drawer--emotional::before{ animation: none; }
}

/* Layout interno */
.drawer__wrap{ padding: 18px 16px 24px; position: relative; z-index: 1; }
.drawer__header{ display: flex; justify-content: flex-end; }
.drawer__hero{ padding: 12px 6px 8px; }
.drawer__hero h2{
  margin: 0 0 6px 0;
  font-size: clamp(28px, 4.8vw, 40px);
  line-height: 1.08;
  letter-spacing: .02em;
  text-shadow: 0 4px 18px rgba(0,0,0,.35);
}
.drawer__hero p{
  margin: 0;
  opacity: .95;
  max-width: 36ch;
}

.drawer__links{ margin: 14px 0 10px; }
.drawer__links .link{
  border-radius: 12px;
  margin: 2px 0;
  color: #fff;
}
.drawer__links .link:hover{
  background: rgba(255,255,255,.06);
}

.drawer__ctas{ display: grid; gap: 10px; margin: 14px 0 16px; }
.cta{
  text-transform: none; font-weight: 800; letter-spacing: .02em;
}
.cta--primary{ background: #fff; color: #111; }
.cta--ghost{ border-color: rgba(255,255,255,.9); color: #fff; }

.drawer__social{
  display: flex; align-items: center; gap: 8px;
  margin: 6px 0 10px;
}
.social{
  width: 36px; height: 36px; display: grid; place-items: center;
  color: #fff;
  border: 1px solid rgba(255,255,255,.4);
  border-radius: 50%;
  backdrop-filter: blur(2px);
}
.lang{
  color: #fff; font-weight: 700; letter-spacing: .06em;
}

.drawer__footnote{
  opacity: .75;
  font-size: 12px;
  margin-top: 10px;
}
</style>

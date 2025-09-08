<template>
  <q-header class="nav" :class="{ 'is-stuck': isStuck }">
    <!-- Top bar -->
    <q-toolbar class="nav__bar">
      <!-- SX: lingua -->
      <q-btn flat dense no-caps class="nav__lang" @click="toggle">
        {{ nextLabel }}
      </q-btn>

      <!-- DX: menu -->
      <q-btn
        flat round dense icon="menu"
        class="nav__menu"
        :aria-label="$t('nav.menu')"
        @click="$emit('menu')"
      />

      <!-- Centro: brand -->
      <router-link to="/" class="nav__brand">
        {{ $t('brand') }}
      </router-link>

      <!-- Desktop-only: cluster destro con CTA + social + lingua -->
      <div class="nav__right">
        <q-btn flat dense no-caps class="nav__link" to="/events" :label="$t('nav.events')" />
        <q-btn outline dense no-caps class="nav__cta" :href="bookingUrl" target="_blank" :label="$t('nav.booking')" />
        <q-btn flat round dense class="nav__icon" :aria-label="$t('nav.instagram')" :href="instagramUrl" target="_blank">
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 4.5a5.5 5.5 0 1 1 0 11a5.5 5.5 0 0 1 0-11Zm0 2a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7Zm5.75-.75a.75.75 0 1 1 0-1.5a.75.75 0 0 1 0 1.5Z"/>
          </svg>
        </q-btn>
        <q-btn flat round dense class="nav__icon" :aria-label="$t('nav.facebook')" :href="facebookUrl" target="_blank">
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M13 10h3l-.5 3H13v9h-3v-9H8v-3h2V8.5A4.5 4.5 0 0 1 14.5 4H17v3h-2.5A1.5 1.5 0 0 0 13 8.5V10Z"/>
          </svg>
        </q-btn>
        <q-btn flat dense no-caps class="nav__link" @click="toggle">{{ nextLabel }}</q-btn>
      </div>
    </q-toolbar>

    <!-- Mobile-only: CTA prenotazioni sotto la barra -->
    <div class="nav__ctaRow">
      <q-btn unelevated no-caps class="nav__ctaMobile" :href="bookingUrl" target="_blank">
        {{ $t('nav.booking') }}
      </q-btn>
    </div>
  </q-header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useLang } from 'src/composables/useLang'

defineProps({
  bookingUrl:  { type: String, default: 'https://prenota.example' },
  instagramUrl:{ type: String, default: 'https://instagram.com/mammaelvira' },
  facebookUrl: { type: String, default: 'https://facebook.com/mammaelvira' }
})

const { nextLabel, toggle } = useLang()

/* Sticky logic: cambia stato dopo uno scroll minimo */
const isStuck = ref(false)
const THRESHOLD = 10 // px
function onScroll(){
  isStuck.value = (window.scrollY || window.pageYOffset || 0) > THRESHOLD
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
/* NAVBAR mobile-first */
.nav{
  position: fixed; inset: 0 0 auto 0;
  background: transparent; box-shadow: none; border: 0;
  z-index: 1000;
  transition: background-color .24s ease, backdrop-filter .24s ease, border-color .24s ease;
}

/* Stato sticky: pietra leccese + testo scuro */
.nav.is-stuck{
  background: var(--stone-100); /* pietra leccese */
  border-bottom: 1px solid rgba(0,0,0,.06);
  backdrop-filter: saturate(1.1);
}

/* Top bar */
.nav__bar{
  position: relative;
  min-height: 56px;
  padding: 0 12px;
  background: transparent;
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: .1px solid rgba(255, 255, 255, 0.185);
}
.nav.is-stuck .nav__bar{
  border-bottom: 1px solid rgba(0,0,0,.06);
}

/* Brand centrato in overlay su mobile */
.nav__brand{
  position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%);
  color: #fff; text-decoration: none; text-transform: lowercase;
  font-weight: 700; letter-spacing: .06em; white-space: nowrap;
  text-shadow: 0 2px 14px rgba(0,0,0,.35);
  transition: color .2s ease, text-shadow .2s ease;
}
.nav.is-stuck .nav__brand{
  color: var(--sepia-900);
  text-shadow: none;
}

/* Lingua (sx) + Menu (dx) */
.nav__lang,
.nav__menu,
.nav__link,
.nav__icon{
  color: #fff;
  transition: color .2s ease, border-color .2s ease, background-color .2s ease;
}
.nav.is-stuck .nav__lang,
.nav.is-stuck .nav__menu,
.nav.is-stuck .nav__link,
.nav.is-stuck .nav__icon{
  color: var(--sepia-900);
}

/* Barra CTA mobile */
.nav__ctaRow{
  padding: 8px 12px 10px;
  background: transparent;
  transition: background-color .2s ease, border-color .2s ease;
}
.nav.is-stuck .nav__ctaRow{
  background: var(--stone-100);
  border-bottom: 1px solid rgba(0,0,0,.04);
}
.nav__ctaMobile{
  width: 100%;
  background: #fff; color: #111;
  font-weight: 800; letter-spacing: .02em; text-transform: none;
  border-radius: 12px;
  padding: 10px 14px;
  box-shadow: 0 8px 30px rgba(0,0,0,.08);
}

/* Cluster destro DESKTOP (nascosto su mobile) */
.nav__right{ display: none; }

/* Tablet+ */
@media (min-width: 768px){
  .nav__bar{ min-height: 64px; padding: 0 16px; }
  .nav__ctaRow{ padding: 10px 16px 12px; }
}

/* Desktop+: brand allineato a sx, cluster destro visibile */
@media (min-width: 1024px){
  .nav__brand{
    position: static; transform: none; margin-left: 8px;
  }
  .nav__lang{ display: none; }        /* la lingua passa nel cluster destro */
  .nav__right{ display: inline-flex; align-items: center; gap: 8px; margin-left: auto; }
  .nav__link{ text-transform:none; font-weight:600; }
  .nav__cta{
    border-color: rgba(255,255,255,.9); color: #fff; text-transform: none; font-weight: 700;
  }
  .nav.is-stuck .nav__cta{
    border-color: rgba(0,0,0,.25); color: var(--sepia-900);
    background: transparent;
  }
  .nav__icon svg path{ transition: fill .2s ease; }
  .nav.is-stuck .nav__icon svg path{ fill: var(--sepia-900); }
  .nav__ctaRow{ display: none; }
}
</style>

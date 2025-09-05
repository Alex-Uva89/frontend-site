<template>
  <q-header class="nav--transparent">
    <q-toolbar class="nav__toolbar">
      <div class="nav__left">
        <q-btn flat round dense icon="menu" class="nav__menu" :aria-label="$t('nav.menu')" @click="$emit('menu')" />
        <router-link to="/" class="nav__brand">{{ $t('brand') }}</router-link>
      </div>

      <q-space />

      <nav class="nav__right">
        <q-btn flat dense no-caps class="navlink anim" style="--d:60ms" to="/events" :label="$t('nav.events')" />
        <q-btn outline dense no-caps class="navcta anim" style="--d:120ms" :href="bookingUrl" target="_blank" :label="$t('nav.booking')" />

        <q-btn flat round dense class="navicon anim" style="--d:180ms" :aria-label="$t('nav.instagram')" :href="instagramUrl" target="_blank">
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 4.5a5.5 5.5 0 1 1 0 11a5.5 5.5 0 0 1 0-11Zm0 2a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7Zm5.75-.75a.75.75 0 1 1 0-1.5a.75.75 0 0 1 0 1.5Z"/></svg>
        </q-btn>

        <q-btn flat round dense class="navicon anim" style="--d:240ms" :aria-label="$t('nav.facebook')" :href="facebookUrl" target="_blank">
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13 10h3l-.5 3H13v9h-3v-9H8v-3h2V8.5A4.5 4.5 0 0 1 14.5 4H17v3h-2.5A1.5 1.5 0 0 0 13 8.5V10Z"/></svg>
        </q-btn>

        <q-btn flat dense no-caps class="navlink q-ml-sm anim" style="--d:300ms" @click="toggle">{{ nextLabel }}</q-btn>
      </nav>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { useLang } from 'src/composables/useLang'

defineProps({
  bookingUrl: { type: String, default: 'https://prenota.example' },
  instagramUrl: { type: String, default: 'https://instagram.com/mammaelvira' },
  facebookUrl: { type: String, default: 'https://facebook.com/mammaelvira' }
})

const { nextLabel, toggle } = useLang()
</script>

<style scoped>
.nav--transparent{ background:transparent!important; box-shadow:none!important; border:0; position:fixed; inset:0 0 auto 0; height:64px; z-index:1000; }
.nav__toolbar{ background:transparent; min-height:64px; padding:0 16px; }
.nav__left{ display:inline-flex; align-items:center; gap:10px; }
.nav__brand{ color:#fff; font-weight:700; letter-spacing:.06em; text-decoration:none; text-transform:lowercase; text-shadow:0 2px 14px rgba(0,0,0,.35); }
.nav__right{ display:inline-flex; align-items:center; gap:6px; }
.navlink{ color:#fff; font-weight:600; letter-spacing:.04em; text-transform:none; text-shadow:0 2px 12px rgba(0,0,0,.35); }
.navcta{ border-color:rgba(255,255,255,.9); color:#fff; text-transform:none; font-weight:700; }
.navicon{ color:#fff; }
.navicon svg{ display:block; filter:drop-shadow(0 1px 6px rgba(0,0,0,.45)); }

/* Micro entrance (stagger via --d) */
.anim{ opacity:0; transform:translateY(8px); }
:where(.nav__toolbar) .anim{ transition:opacity .5s ease, transform .5s ease; transition-delay:var(--d,0ms); }
.nav__toolbar .anim{ opacity:1; transform:none; }
@media (prefers-reduced-motion: reduce){ .anim{ transition:none!important; transform:none!important; opacity:1!important; } }
</style>

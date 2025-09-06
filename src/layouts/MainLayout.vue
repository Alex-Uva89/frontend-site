<template>
  <q-layout view="lHh Lpr lFf">
    <Navbar
      booking-url="https://prenota.example"
      instagram-url="https://instagram.com/mammaelvira"
      facebook-url="https://facebook.com/mammaelvira"
      @menu="drawer = true"
    />

    <q-drawer
      v-model="drawer"
      side="left"
      overlay
      elevated
      :width="drawerWidth"
      :content-class="['drawer','drawer--emotional', drawer ? 'is-open' : '']"
    >
      <q-scroll-area class="fit">
        <div class="wrap">
          <div class="head anim" style="--d:40ms">
            <q-btn flat round dense icon="close" :aria-label="$t('nav.close')" @click="drawer=false" />
          </div>

          <div class="hero anim" style="--d:120ms">
            <h2>{{ $t('drawer.heroTitle') }}</h2>
            <p>{{ $t('drawer.heroText') }}</p>
          </div>

          <q-separator dark spaced class="anim" style="--d:180ms" />

          <div class="links">
            <q-item clickable to="/" v-ripple class="link anim" style="--d:220ms"><q-item-section>{{ $t('drawer.home') }}</q-item-section></q-item>
            <q-item clickable to="/venues" v-ripple class="link anim" style="--d:260ms"><q-item-section>{{ $t('drawer.venues') }}</q-item-section></q-item>
            <q-item clickable to="/story" v-ripple class="link anim" style="--d:300ms"><q-item-section>{{ $t('drawer.story') }}</q-item-section></q-item>
            <q-item clickable to="/producers" v-ripple class="link anim" style="--d:340ms"><q-item-section>{{ $t('drawer.producers') }}</q-item-section></q-item>
            <q-item clickable to="/jobs" v-ripple class="link anim" style="--d:380ms"><q-item-section>{{ $t('drawer.jobs') }}</q-item-section></q-item>
            <q-item clickable to="/contact" v-ripple class="link anim" style="--d:420ms"><q-item-section>{{ $t('drawer.contact') }}</q-item-section></q-item>
          </div>

          <div class="ctas">
            <q-btn unelevated class="cta primary anim" style="--d:480ms" :label="$t('drawer.book')" href="https://prenota.example" target="_blank" @click="drawer=false" />
            <q-btn outline class="cta ghost anim" style="--d:520ms" :label="$t('drawer.private')" to="/events" @click="drawer=false" />
          </div>

          <div class="social anim" style="--d:560ms">
            <a href="https://instagram.com/mammaelvira" target="_blank" aria-label="Instagram" class="chip">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z"/></svg>
            </a>
            <a href="https://facebook.com/mammaelvira" target="_blank" aria-label="Facebook" class="chip">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M13 10h3l-.5 3H13v9h-3v-9H8v-3h2V8.5A4.5 4.5 0 0 1 14.5 4H17v3h-2.5A1.5 1.5 0 0 0 13 8.5V10Z"/></svg>
            </a>
            <q-btn flat dense no-caps class="lang" @click="toggle">{{ $t('nav.langNext') }}</q-btn>
          </div>

          <div class="note anim" style="--d:600ms">{{ $t('drawer.tagline') }}</div>
        </div>
      </q-scroll-area>
    </q-drawer>

    <q-page-container><router-view /></q-page-container>

    <SiteFooter />
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLang } from 'src/composables/useLang'
import Navbar from 'components/NavbarComponent.vue'
import SiteFooter from 'src/components/SiteFooter.vue'

const drawer = ref(false)
const { toggle } = useLang()
useI18n()

const drawerWidth = computed(() => window.innerWidth < 768 ? window.innerWidth : 420)
</script>

<style>
.q-page-container{ padding-top:0 !important; }

.drawer--emotional{
  color:#fff;
  background:
    radial-gradient(120% 100% at 10% 0%, rgba(201,126,99,.55), rgba(109,122,79,.35) 40%, rgba(0,0,0,.55) 100%),
    linear-gradient(160deg, rgba(0,0,0,.25), rgba(0,0,0,.55));
  backdrop-filter: blur(6px);
  position:relative; overflow:hidden;
}
.drawer--emotional::before{ content:''; position:absolute; inset:-50% -20%; background:conic-gradient(from 0deg, rgba(255,255,255,.05), transparent 20%, rgba(255,255,255,.05) 40%, transparent 60%, rgba(255,255,255,.05) 80%, transparent); animation:spin 16s linear infinite; }
.drawer--emotional::after{ content:''; position:absolute; inset:0; background-image: radial-gradient(rgba(255,255,255,.06) 1px, transparent 1px); background-size:3px 3px; opacity:.55; }
@keyframes spin{ to{ transform: rotate(360deg) } }
@media (prefers-reduced-motion: reduce){ .drawer--emotional::before{ animation:none } }

.wrap{ padding:16px 14px 22px; position:relative; z-index:1; }
.head{ display:flex; justify-content:flex-end; }
.hero{ padding:10px 4px 6px; }
.hero h2{ margin:0 0 4px; font-size:24px; line-height:1.1; }
.hero p{ margin:0; opacity:.95; max-width:36ch; }
.links{ margin:12px 0 8px; }
.link{ border-radius:12px; margin:2px 0; color:#fff; }
.link:hover{ background:rgba(255,255,255,.08) }
.ctas{ display:grid; gap:10px; margin:12px 0 14px; }
.cta{ text-transform:none; font-weight:800; letter-spacing:.02em; }
.primary{ background:#fff; color:#111; }
.ghost{ border-color:rgba(255,255,255,.9); color:#fff; }
.social{ display:flex; align-items:center; gap:8px; }
.chip{ width:36px; height:36px; display:grid; place-items:center; color:#fff; border:1px solid rgba(255,255,255,.4); border-radius:50%; }
.lang{ color:#fff; font-weight:700; letter-spacing:.06em; }
.note{ opacity:.75; font-size:12px; margin-top:8px; }

/* tablet+ */
@media (min-width:768px){
  .wrap{ padding:18px 16px 24px; }
  .hero h2{ font-size:32px; }
}

/* micro entrance */
.anim{ opacity:0; transform:translateY(8px); }
.drawer.is-open .anim{ opacity:1; transform:none; transition:opacity .5s ease, transform .5s ease; transition-delay:var(--d,0ms); }
@media (prefers-reduced-motion: reduce){ .anim,.drawer.is-open .anim{ opacity:1!important; transform:none!important; transition:none!important; } }
</style>

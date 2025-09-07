<template>
  <q-layout view="lHh Lpr lFf">
    <!-- NAVBAR: apre la drawer -->
    <NavbarComponent
      booking-url="https://prenota.example"
      instagram-url="https://instagram.com/mammaelvira"
      facebook-url="https://facebook.com/mammaelvira"
      @menu="drawer = true"
    />

    <!-- DRAWER semplice: foto da store come sfondo -->
    <q-drawer
      v-model="drawer"
      side="right"
      overlay
      :width="drawerWidth"
      :content-class="'simple-drawer'"
    >
      <!-- sfondo -->
      <div class="sd-bg" :style="{ backgroundImage: 'url(' + bgImage + ')' }"></div>
      <div class="sd-veil"></div>

      <!-- contenuti -->
      <div class="sd-content">
        <button class="sd-close" @click="drawer=false" aria-label="Chiudi">✕</button>

        <nav class="sd-nav" aria-label="Navigazione">
          <template v-for="(link, i) in navLinks" :key="i">
            <!-- Interno (router) -->
            <RouterLink
              v-if="link.to"
              class="sd-link"
              :to="link.to"
              @click="drawer=false"
            >
              {{ link.label }}
            </RouterLink>

            <!-- Esterno -->
            <a
              v-else-if="link.href"
              class="sd-link"
              :href="link.href"
              target="_blank"
              rel="noopener"
              @click="drawer=false"
            >
              {{ link.label }}
            </a>
          </template>
        </nav>

        <!-- CTA sticky dal negozio -->
        <div class="sd-cta" role="group" aria-label="Azioni rapide">
          <a
            v-if="bookingCta?.href"
            class="sd-cta-btn sd-cta-primary"
            :href="bookingCta.href"
            target="_blank"
            rel="noopener"
            @click="drawer=false"
          >
            {{ bookingCta.label }}
          </a>
          <RouterLink
            v-if="privateCta?.to"
            class="sd-cta-btn sd-cta-ghost"
            :to="privateCta.to"
            @click="drawer=false"
          >
            {{ privateCta.label }}
          </RouterLink>
          <a
            v-else-if="privateCta?.href"
            class="sd-cta-btn sd-cta-ghost"
            :href="privateCta.href"
            target="_blank"
            rel="noopener"
            @click="drawer=false"
          >
            {{ privateCta.label }}
          </a>
        </div>
      </div>
    </q-drawer>

    <q-page-container style="padding-top: 0;">
      <router-view />
    </q-page-container>

    <SiteFooter />
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useDrawerStore } from 'src/stores/drawerStore'
import NavbarComponent from 'components/NavbarComponent.vue'
import SiteFooter from 'src/components/SiteFooter.vue'

const drawer = ref(false)
const drawerWidth = ref(window.innerWidth)
function onResize(){ drawerWidth.value = window.innerWidth }
onMounted(()=> window.addEventListener('resize', onResize, { passive: true }))
onBeforeUnmount(()=> window.removeEventListener('resize', onResize))

/* Store Pinia */
const drawerStore = useDrawerStore()
const bgImage    = computed(() => drawerStore.image || '')
const navLinks   = computed(() => Array.isArray(drawerStore.links) && drawerStore.links.length ? drawerStore.links : [])
const bookingCta = computed(() => drawerStore.ctas?.booking || null)
const privateCta = computed(() => drawerStore.ctas?.private || null)
</script>

<style scoped>
/* Drawer semplice: foto + velo + link grandi bianchi */

.simple-drawer{
  position: relative;
  padding: 0;
  overflow: hidden;
  background: #000; /* fallback sotto la foto */
}

/* sfondo a pieno, cover */
.sd-bg{
  position: absolute; inset: 0;
  background-size: cover;
  background-position: center;
}

/* velo scuro per leggere bene il bianco */
.sd-veil{
  position: absolute; inset: 0;
  background: rgba(0,0,0,.45);
}

/* contenuti */
.sd-content{
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 2vh, 20px);
  padding: clamp(16px, 3vw, 32px);
  color: #fff;
  min-height: 100%;
}

/* chiudi in alto a destra */
.sd-close{
  align-self: flex-end;
  appearance: none;
  border: 0;
  background: transparent;
  color: #fff;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
}

/* nav con link grandi (da store) */
.sd-nav{
  display: flex;
  flex-direction: column;
  gap: clamp(10px, 1.8vh, 18px);
  margin-top: clamp(8px, 2vh, 24px);
}

.sd-link{
  color: #fff;
  text-decoration: none;
  font-weight: 800;
  letter-spacing: -.01em;
  line-height: 1.05;
  font-size: clamp(1rem, 6vw, 96px);
  /* underline semplice all’hover/focus */
  background-image: linear-gradient(currentColor, currentColor);
  background-repeat: no-repeat;
  background-position: 0 100%;
  background-size: 0% 2px;
  transition: background-size .25s ease;
}
.sd-link:hover,
.sd-link:focus-visible{ background-size: 100% 2px; }
.sd-link:focus-visible{
  outline: 2px solid rgba(255,255,255,.9);
  outline-offset: 4px;
  border-radius: 4px;
}

/* CTA sticky in basso (da store) */
.sd-cta{
  margin-top: auto;
  position: sticky;
  bottom: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  padding-top: 12px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background: linear-gradient(to top, rgba(0,0,0,.32), rgba(0,0,0,0));
}

.sd-cta-btn{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-weight: 800;
  letter-spacing: .02em;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: clamp(16px, 1.6vw, 18px);
  cursor: pointer;
  transition: transform .06s ease, opacity .2s ease;
}
.sd-cta-btn:active{ transform: translateY(1px); }

.sd-cta-primary{
  color: #fff;
  background: #c97e63;   /* clay-400 */
}
.sd-cta-primary:hover{ opacity: .96; }

.sd-cta-ghost{
  color: #fff;
  border: 1px solid rgba(255,255,255,.22);
  background: rgba(255,255,255,.04);
}

/* da tablet: affiancati */
@media (min-width: 700px){
  .sd-cta{ grid-template-columns: 1fr 1fr; }
}
</style>

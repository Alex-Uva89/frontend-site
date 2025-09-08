<template>
  <section class="actions">
    <div class="container">
      <div
        class="card"
        v-touch-pan.horizontal.prevent.mouse="onPan"
        role="region"
        aria-roledescription="carousel"
        :aria-label="$t('actionsSection.title', 'Cosa puoi fare')"
      >
        <!-- Colonna testo -->
        <div class="col col--text">
          <div class="copy">
            <h2 class="title">{{ items[idx].title }}</h2>
            <p class="lead" v-html="items[idx].lead"></p>
            <q-btn
              unelevated
              no-caps
              class="cta"
              :label="items[idx].cta"
              :to="items[idx].to || undefined"
              :href="items[idx].href || undefined"
              :target="items[idx].target || undefined"
            />
          </div>

          <!-- footer con progress + divider + nav -->
          <div class="footer">
            <div class="divider"></div>
            <div class="bottom">
              <div class="progress">{{ idx + 1 }} • {{ total }}</div>
              <div class="nav">
                <q-btn round dense flat class="navbtn" icon="west" @click="prev" aria-label="Prev" />
                <q-btn round dense flat class="navbtn" icon="east" @click="next" aria-label="Next" />
              </div>
            </div>
          </div>
        </div>

        <!-- Colonna immagine -->
        <div class="col col--media">
          <transition name="fade" mode="out-in">
            <q-img
              :key="items[idx].id"
              :src="items[idx].img"
              :alt="items[idx].imgAlt"
              class="media"
              :ratio="16/10"
              :img-style="{ objectFit: 'cover' }"
            />
          </transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Dati slider (mobile-first). Puoi sostituire le immagini in seguito.
const items = ref([
  {
    id: 'book',
    title: t('actionsSection.book.title', 'Si accettano prenotazioni!'),
    lead: t('actionsSection.book.lead', '<em>Amici belli</em>, tutti i nostri ristoranti accettano prenotazioni. Per grandi tavolate, primi appuntamenti o rimpatriate — passate a trovarci!'),
    cta: t('actionsSection.book.cta', 'Prenotare'),
    href: 'https://prenota.example',
    target: '_blank',
    img: 'https://picsum.photos/seed/booking/1600/1000',
    imgAlt: t('actionsSection.book.imgAlt', 'Tavolata che brinda')
  },
  {
    id: 'menu',
    title: t('actionsSection.menu.title', 'Conosci i nostri menù'),
    lead: t('actionsSection.menu.lead', 'Ingredienti selezionati, artigianalità radicale, stagionalità. Scopri piatti e carte dei vini dei nostri locali.'),
    cta: t('actionsSection.menu.cta', 'Vedi menù'),
    to: '/venues', // o link ai menù
    img: 'https://picsum.photos/seed/menu/1600/1000',
    imgAlt: t('actionsSection.menu.imgAlt', 'Piatti e calici')
  },
  {
    id: 'events',
    title: t('actionsSection.events.title', 'Eventi & serate speciali'),
    lead: t('actionsSection.events.lead', 'Dalle degustazioni ai compleanni: ispirazioni, proposte e format per i vostri momenti da ricordare.'),
    cta: t('actionsSection.events.cta', 'Scopri gli eventi'),
    to: '/events',
    img: 'https://picsum.photos/seed/events/1600/1000',
    imgAlt: t('actionsSection.events.imgAlt', 'Tavolo conviviale durante un evento')
  }
])

const idx = ref(0)
const total = computed(() => items.value.length)
function next () { idx.value = (idx.value + 1) % total.value }
function prev () { idx.value = (idx.value - 1 + total.value) % total.value }

// Swipe (Quasar v-touch-pan)
function onPan (evt) {
  if (!evt?.isFinal) return
  if (Math.abs(evt.delta.x) < 20) return
  evt.direction === 'left' ? next() : prev()
}
</script>

<style scoped>
/* Sezione mobile-first */
.actions{
  padding: clamp(20px, 4vh, 36px) 0;
}
.container{
  /* niente max-width qui: lasciamo respirare la card */
  padding: 0 12px;
}

/* Card grande, ora LARGA: min 80vw, preferita ~90vw, max 1440px */
.card{
  --h: 440px;                               /* altezza mobile */
  width: clamp(80vw, 90vw, 1440px);         /* ⟵ qui la magia */
  margin: 0 auto;                           /* centrata */
  background: #2a0e07;
  color: #fff;
  border-radius: 16px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr;               /* stack su mobile */
  min-height: var(--h);
}

/* Colonne */
.col{ position: relative; }
.col--text{ padding: 18px 16px 14px; display: grid; grid-template-rows: auto 1fr; }
.col--media{ min-height: 220px; }

/* Copia */
.title{ font-size: clamp(22px, 6vw, 36px); line-height: 1.08; margin: 0 0 10px; }
.lead{ margin: 0 0 16px; font-size: clamp(14px, 4vw, 16px); opacity: .95; }
.lead em{ font-style: italic; }

/* CTA primaria */
.cta{ background: #fff; color: #111; border-radius: 12px; font-weight: 800; letter-spacing: .02em; padding: 10px 14px; }

/* Footer con divider + progress + nav */
.footer{ align-self: end; padding-top: 12px; }
.divider{ height: 1px; background: rgba(255,255,255,.25); width: 100%; }
.bottom{ margin-top: 10px; display: flex; align-items: center; justify-content: space-between; }
.progress{ font-size: 11px; letter-spacing: .2em; opacity: .85; }
.nav{ display: inline-flex; gap: 8px; }
.navbtn{ color:#fff; border:1px solid rgba(255,255,255,.35); border-radius:999px; width:42px; height:36px; backdrop-filter: blur(2px); }

/* Media (immagine) */
.media{ width: 100%; height: 100%; border-radius: 0; }

/* TRANSITION */
.fade-enter-active, .fade-leave-active{ transition: opacity .35s ease; }
.fade-enter-from, .fade-leave-to{ opacity: 0; }

/* Tablet+: due colonne, un po’ più alta */
@media (min-width: 900px){
  .card{
    --h: 560px;
    border-radius: 20px;
    grid-template-columns: 1.1fr 1fr;       /* testo / immagine */
  }
  .col--text{ padding: 28px 28px 18px; }
  .col--media{ min-height: auto; }
}

/* Desktop wide: altezza maggiore e bordo più morbido */
@media (min-width: 1200px){
  .card{
    --h: 620px;                              /* più presence sulla pagina */
    border-radius: 24px;
    width: clamp(80vw, 88vw, 1440px);        /* preferenza leggermente più contenuta */
  }
  .col--text{ padding: 36px 40px 20px; }
}
</style>


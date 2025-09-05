<template>
  <q-card class="venue" :style="{ '--card-h': height }">
    <div class="venue__media">
      <q-img
        :src="venue.image"
        :alt="venue.name"
        :fit="'cover'"
        class="venue__img"
      />

      <!-- overlay per leggibilità -->
      <div class="venue__gradient"></div>

      <!-- contenuto sovrapposto -->
      <div class="venue__content">
        <div class="venue__texts">
          <div class="venue__name">{{ venue.name }}</div>
          <div class="venue__addr">{{ venue.address }}</div>
          <div class="venue__rule"></div>
        </div>

        <div class="venue__actions">
          <q-btn flat no-caps class="btn--ghost" :label="$t('actions.viewMenu', 'Menu')" :href="venue.menuUrl" />
          <q-btn unelevated no-caps class="btn--primary" :label="$t('actions.book', 'Prenotazioni')" :href="venue.bookingUrl" target="_blank" />
        </div>
      </div>
    </div>
  </q-card>
</template>

<script setup>
defineProps({
  venue: { type: Object, required: true },
  height: { type: String, default: '820px' }
})
</script>

<style scoped>
/* Card grande, altezza fissa */
.venue{
  width: clamp(340px, 52vw, 560px);
  height: var(--card-h);                /* <— altezza fissa */
  border-radius: 22px;
  overflow: hidden;
  background: #000;
}

/* Media wrapper */
.venue__media{
  position: relative;
  width: 100%;
  height: 100%;
}
.venue__img{
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* Gradiente morbido (più scuro in basso) */
.venue__gradient{
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,.00) 40%, rgba(0,0,0,.35) 66%, rgba(0,0,0,.55) 100%);
  pointer-events: none;
}

/* Testi + CTA sovrapposti sul fondo */
.venue__content{
  position: absolute; left: 0; right: 0; bottom: 18px;
  padding: 0 18px;
  color: #fff;
}

/* Titolo e indirizzo */
.venue__texts{ margin: 0 0 14px 0; }
.venue__name{
  text-transform: uppercase;
  font-size: clamp(22px, 3.2vw, 32px);
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: .04em;
  text-shadow: 0 2px 14px rgba(0,0,0,.45);
}
.venue__addr{
  margin-top: 6px;
  font-size: clamp(12px, 1.6vw, 14px);
  line-height: 1.35;
  opacity: .95;
  text-shadow: 0 1px 10px rgba(0,0,0,.4);
}
.venue__rule{
  margin-top: 10px;
  height: 1px;
  background: rgba(255,255,255,.35);
  width: 100%;
}

/* CTA: ghost a sx, primaria a dx */
.venue__actions{
  margin-top: 12px;
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px;
}
.btn--ghost{
  color: #fff;
  background: rgba(0,0,0,.35);
  border: 1px solid rgba(255,255,255,.35);
  border-radius: 10px;
  padding-inline: 14px;
}
.btn--primary{
  background: #fff;
  color: #111;
  border-radius: 10px;
  padding-inline: 16px;
  font-weight: 700;
}
</style>

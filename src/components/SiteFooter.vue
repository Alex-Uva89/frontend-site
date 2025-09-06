<template>
  <footer class="foot" role="contentinfo">
    <!-- TOP: link utili + locali -->
    <div class="foot__top">
      <!-- Link utili -->
      <nav class="foot__legal" aria-label="Link utili">
        <a :href="links.legal" class="foot__legalLink">{{ $t('footer.legal', 'Informazioni legali') }}</a>
        <a :href="links.jobs"  class="foot__legalLink">{{ $t('footer.jobs',  'Entra nella squadra') }}</a>
        <a :href="links.about" class="foot__legalLink">{{ $t('footer.about', 'Chi siamo') }}</a>
        <a :href="links.faq"   class="foot__legalLink">{{ $t('footer.faq',   'FAQ e contatti') }}</a>
      </nav>

      <!-- Locali -->
      <section class="foot__venuesWrap" aria-label="I nostri locali">
        <h3 class="sr-only">{{ $t('footer.venues', 'I nostri locali') }}</h3>
        <div class="foot__venues">
          <div v-for="v in venuesList" :key="v.id" class="foot__col">
            <div class="foot__colHint">{{ (v.address || 'Lecce').toUpperCase() }}</div>
            <router-link :to="{ name: 'locale', params: { id: v.id } }" class="foot__item">
              {{ v.name.toUpperCase() }}
            </router-link>
          </div>
        </div>
      </section>
    </div>

    <!-- BOTTOM -->
    <div class="foot__bottom">
      <div class="foot__copy">©{{ year }} MAMMA ELVIRA GROUP</div>

      <div class="foot__social" aria-label="Social">
        <a :href="social.instagram" target="_blank" rel="noopener" aria-label="Instagram" class="foot__icon">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 4.5a5.5 5.5 0 1 1 0 11a5.5 5.5 0 0 1 0-11Zm5.75-.75a.75.75 0 1 1 0-1.5a.75.75 0 0 1 0 1.5Z"/></svg>
        </a>
        <a :href="social.facebook" target="_blank" rel="noopener" aria-label="Facebook" class="foot__icon">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M13 10h3l-.5 3H13v9h-3v-9H8v-3h2V8.5A4.5 4.5 0 0 1 14.5 4H17v3h-2.5A1.5 1.5 0 0 0 13 8.5V10Z"/></svg>
        </a>
        <span class="foot__stay">
          {{ $t('footer.stay', 'Rimani in contatto con Mamma Elvira Group') }}
        </span>
      </div>

      <div class="foot__badge" aria-label="Certificazione (placeholder)">
        <svg viewBox="0 0 60 60" width="44" height="44">
          <circle cx="30" cy="30" r="26" fill="none" stroke="currentColor" stroke-width="2"/>
          <text x="30" y="36" text-anchor="middle" font-size="20" fill="currentColor" font-weight="800">ME</text>
        </svg>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { venues as defaultVenues } from 'src/stores/venues.js'

const props = defineProps({
  venues: { type: Array, default: () => defaultVenues }, // [{id,name,address,href?}]
  links: {
    type: Object,
    default: () => ({
      legal: '/legal',
      jobs: '/jobs',
      about: '/story',
      faq: '/contact'
    })
  },
  social: {
    type: Object,
    default: () => ({
      instagram: 'https://instagram.com/mammaelvira',
      facebook: 'https://facebook.com/mammaelvira'
    })
  }
})
const venuesList = computed(() => props.venues.slice(0, 5))
const year = new Date().getFullYear()
</script>

<style scoped>
/* palette */
:root{
  --paper: #f5f0e4;
  --sepia: #3b1d12;
  --sepia-40: rgba(59,29,18,.4);
  --sepia-55: rgba(59,29,18,.55);
}

.foot{
  background: var(--paper);
  color: var(--sepia);
  border-top: 1.5px solid var(--sepia);
  padding: 18px 0 0;           /* mobile-first */
  margin-top: 24px;
  border-top: .1px solid rgba(165, 42, 42, 0.267);
}

/* TOP */
.foot__top{
  width: min(92vw, 1300px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

/* link utili — tap target 44px */
.foot__legal{
  display: grid;
  gap: 6px;
}
.foot__legalLink{
  display: inline-block;
  padding: 10px 0;             /* tap target */
  text-decoration: none;
  color: var(--sepia);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .06em;
  line-height: 1.2;
}
.foot__legalLink:active { opacity: .8; }

/* locali — mobile: 2 colonne larghe e leggibili */
.foot__venuesWrap{ }
.foot__venues{
  display: grid;
  grid-template-columns: repeat(2, minmax(140px, 1fr));
  gap: 14px 20px;
}
.foot__col{ display: grid; gap: 4px; }
.foot__colHint{
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .12em;
  color: var(--sepia-55);
}
.foot__item{
  display: inline-block;
  padding: 8px 0;              /* tap target */
  color: var(--sepia);
  text-decoration: none;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: .06em;
  line-height: 1.15;
}

/* BOTTOM */
.foot__bottom{
  width: min(92vw, 1300px);
  margin: 20px auto 0;
  padding: 12px 0 18px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  align-items: center;
  border-top: 1px solid var(--sepia-40);
}
.foot__copy{
  opacity: .5;
  font-size: 12px;
  letter-spacing: .08em;
}
.foot__social{
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
}
.foot__icon{
  width: 40px; height: 40px;   /* comodo al tocco */
  display: grid; place-items: center;
  color: var(--sepia);
  border: 1px solid var(--sepia);
  border-radius: 50%;
}
.foot__stay{
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .06em;
}
.foot__badge{
  justify-self: end;
  color: var(--sepia);
}

/* Tablet */
@media (min-width: 900px){
  .foot__top{
    grid-template-columns: 0.9fr 1.6fr;     /* link / locali */
    gap: 28px;
  }
  .foot__venues{
    grid-template-columns: repeat(5, minmax(140px, 1fr));
    gap: 16px 24px;
  }
  .foot__bottom{
    grid-template-columns: 1fr auto auto;   /* copy | social | badge */
    gap: 16px;
  }
}

/* Desktop */
@media (min-width: 1200px){
  .foot{ padding-top: 24px; }
}
</style>

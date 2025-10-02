<template>
  <q-page class="page" style="background-color: var(--stone-100);">
    <HeroComponent />
    <!-- <div class="gap"></div> -->

    <!-- <VenuesMarquee :height="'440px'" :speed="56" /> -->

    <!-- <div class="gap-sm"></div> -->
    <!-- <ActionsShowcase /> -->

    <!-- <div class="gap-sm"></div> -->

    <!-- qui incorniciamo la sezione con doppia riga sopra/sotto -->
    <!-- <SectionFrame> -->
      <!-- <NewsletterSection /> -->
    <!-- </SectionFrame> -->
  </q-page>
</template>

<script setup>
import HeroComponent from 'components/HeroComponent.vue'
// import VenuesMarquee from 'components/VenuesMarquee.vue'
// import ActionsShowcase from 'components/ActionsShowcase.vue'
// import NewsletterSection from 'components/NewsletterSection.vue'
// import SectionFrame from 'components/SectionFrame.vue'
</script>

<style>
.page{ padding:0; }
.gap{ height:clamp(24px, 10vh, 120px); }
.gap-sm{ height:clamp(16px, 6vh, 72px); }
</style>

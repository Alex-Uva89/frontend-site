<template>
  <q-page class="q-pa-none">
    <HeroComponent />


    <VenuesMarquee :height="'560px'" :speed="52" />
  </q-page>
</template>

<script setup>
import HeroComponent from 'components/HeroComponent.vue'
import VenuesMarquee from 'components/VenuesMarquee.vue'
</script>

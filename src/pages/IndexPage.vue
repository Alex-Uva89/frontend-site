<template>
  <q-page class="page">
    <HeroComponent />
    <div class="gap"></div>
    <VenuesMarquee :height="'440px'" :speed="56" />
  </q-page>
</template>

<script setup>
import HeroComponent from 'components/HeroComponent.vue'
import VenuesMarquee from 'components/VenuesMarquee.vue'
</script>

<style>
.page{ padding:0; }
.gap{ height:clamp(24px, 10vh, 120px); }
</style>

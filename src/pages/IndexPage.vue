<template>
  <q-page class="page" style="background-color: var(--stone-100);">
    <HeroComponent />
  </q-page>
</template>

<script setup>
import HeroComponent from 'components/HeroComponent.vue'
</script>

<style>
.page{ padding:0; }
.gap{ height:clamp(24px, 10vh, 120px); }
.gap-sm{ height:clamp(16px, 6vh, 72px); }
</style>

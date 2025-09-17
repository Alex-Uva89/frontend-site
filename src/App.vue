<!-- App.vue -->
<template>
  <!-- le route e i layout vivono qui -->
  <router-view />

  <!-- la cornice vive fuori dall’albero dei layout/pagine -->
  <teleport to="body">
    <TvShell
      :channel="currentChannel"
      :power="true"
      @channel-up="currentChannel = (Number(currentChannel)+1)%100"
      @channel-down="currentChannel = (Number(currentChannel)+99)%100"
    />
  </teleport>
</template>

<script setup>
import TvShell from 'src/components/TvShell.vue'
</script>

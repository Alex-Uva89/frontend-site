<!-- src/App.vue -->
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
import { ref, watchEffect } from 'vue'
import TvShell from 'src/components/TvShell.vue'

/* NEW: canale corrente (persistito opzionale) */
const saved = Number(localStorage.getItem('tv:channel') || 0) || 0
const currentChannel = ref(saved)

/* opzionale: persisti quando cambia */
watchEffect(() => {
  localStorage.setItem('tv:channel', String(currentChannel.value))
})
</script>

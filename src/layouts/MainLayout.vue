<template>
  <q-layout view="lHh Lpr lFf">
    <div class="crt-host">
      <q-page-container class="crt-body" ref="crtBodyRef">
        <router-view v-slot="{ Component, route }">
          <Transition name="crt" mode="out-in" @before-leave="playTvClick">
            <div :key="route.fullPath" class="crt-pane">
              <component :is="Component" />
            </div>
          </Transition>
        </router-view>
      </q-page-container>

      <!-- Menu mobile retrò (solo mobile, via CSS) -->
      <TvMenuMobile />
    </div>
  </q-layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import TvMenuMobile from 'src/components/TvMenuMobile.vue'

const route = useRoute()
const crtBodyRef = ref(null)

/* Reset scroll al top a ogni cambio pagina */
watch(
  () => route.fullPath,
  () => {
    const el = crtBodyRef.value?.$el ?? crtBodyRef.value
    if (el?.scrollTo) el.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  },
  { flush: 'post' }
)

/* CLICK audio */
let audioCtx
function playTvClick(){
  try{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)()
    const now = audioCtx.currentTime
    const o = audioCtx.createOscillator()
    const g = audioCtx.createGain()
    o.type = 'square'
    o.frequency.setValueAtTime(780, now)
    o.connect(g); g.connect(audioCtx.destination)
    g.gain.setValueAtTime(0.0001, now)
    g.gain.exponentialRampToValueAtTime(0.35, now + 0.006)
    g.gain.exponentialRampToValueAtTime(0.00001, now + 0.09)
    o.start(now); o.stop(now + 0.1)
  }catch(e){console.log(e)}
}
</script>

<style lang="css" scoped>
@media (max-width: 768px) {
  .crt-body{
    padding-bottom: 100px;
  }
}

</style>

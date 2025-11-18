<template>
  <section v-if="emotion" class="emo">
    <!-- Testo -->
    <div class="emo__text">
      <h2 class="emo__tagline">{{ emotion.tagline }}</h2>
      <p v-if="emotion.body" class="emo__body">{{ emotion.body }}</p>

      <div v-if="emotion.highlights?.length" class="emo__high">
        <div v-for="(h, i) in emotion.highlights" :key="i" class="chip">
          <div class="chip__title">{{ h.label }}</div>
          <div class="chip__desc">{{ h.desc }}</div>
        </div>
      </div>

      <figure v-if="emotion.quote?.text" class="emo__quote">
        <blockquote>“{{ emotion.quote.text }}”</blockquote>
        <figcaption>— {{ emotion.quote.author || '—' }}</figcaption>
      </figure>
    </div>

    <!-- Collage immagini -->
    <div v-if="imgs.length" class="emo__media">
      <div class="big" :style="{ backgroundImage:`url(${imgs[0]})` }" />
      <!-- {{ emotion.images }} -->
      <div class="col">
        <div class="sm" v-if="emotion.images" :style="{ backgroundImage:`url(${emotion.images[0]})` }" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  emotion: { type: Object, default: null }
})

const imgs = computed(() => {
  if (!props.emotion?.images) return []
  return props.emotion.images.map(i => (typeof i === 'string' ? i : i.src))
})
</script>

<style scoped>
:root{
  --paper:#f5f0e4;
  --sepia:#3b1d12;
  --sepia-40:rgba(59,29,18,.4);
}
.emo{
  width:min(92%,1100px);
  margin: clamp(16px,6vh,32px) auto;
  padding: 0 12px;
  display: grid;
  grid-template-columns: 1fr; gap: 14px;
}
.emo__tagline{
  margin:0;
  font-size: clamp(20px, 6vw, 34px);
  line-height:1.1; letter-spacing:-.01em;
}
.emo__body{
  margin:.6rem 0 0;
  font-size: 15px; line-height:1.5; opacity:.92;
}
.emo__high{
  margin: 12px -4px 0;
  display:flex; flex-wrap:wrap; gap:8px;
}
.chip{
  border:1px solid var(--sepia-40);
  border-radius: 12px;
  padding: 8px 10px;
  background: #fff;
}
.chip__title{ font-weight:800; letter-spacing:.04em; text-transform:uppercase; font-size:12px; }
.chip__desc{ font-size:12px; opacity:.85; }

.emo__quote{
  margin: 12px 0 0;
  padding-left: 10px;
  border-left: 3px solid var(--sepia-40);
}
.emo__quote blockquote{ margin:0; font-style: italic; }
.emo__quote figcaption{ font-size:12px; opacity:.8; margin-top:4px; }

/* Collage */
.emo__media{
  display:grid; grid-template-columns: 1fr; gap:10px;
}
.big, .sm{
  background-size: cover; background-position: center;
  border-radius: 16px; min-height: 220px;
  border: 1px solid rgba(0,0,0,.06);
}
.col{ display:grid; grid-template-columns: 1fr 1fr; gap:10px; }
@media (min-width: 900px){
  .emo{
    grid-template-columns: 1.1fr 1fr; gap: 20px;
    padding: 0 16px;
  }
  .big{ min-height: 520px; }
  .sm{ min-height: 200px; }
}
</style>

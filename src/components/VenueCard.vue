<template>
  <q-card class="venue" :style="{ '--h': height }">
    <div class="media">
      <q-img :src="venue.image" :alt="venue.name" class="img" :fit="'cover'" />
      <div class="grad"></div>
      <div class="content">
        <div class="texts">
          <div class="name">{{ venue.name }}</div>
          <div class="addr">{{ venue.address }}</div>
          <div class="rule"></div>
        </div>
        <div class="actions">
          <q-btn flat no-caps class="ghost" :label="$t('actions.viewMenu','Menu')" :href="venue.menuUrl" />
          <q-btn unelevated no-caps class="primary" :label="$t('actions.book','Prenotazioni')" :href="venue.bookingUrl" target="_blank" />
        </div>
      </div>
    </div>
  </q-card>
</template>

<script setup>
defineProps({ venue:{type:Object,required:true}, height:{type:String,default:'440px'} })
</script>

<style scoped>
.venue{ width:88vw; max-width:560px; height:var(--h); border-radius:20px; overflow:hidden; background:#000; }
.media{ position:relative; width:100%; height:100%; }
.img{ position:absolute; inset:0; width:100%; height:100%; }
.grad{ position:absolute; inset:0; background:linear-gradient(180deg, rgba(0,0,0,.00) 40%, rgba(0,0,0,.35) 66%, rgba(0,0,0,.55) 100%); }
.content{ position:absolute; left:0; right:0; bottom:16px; padding:0 14px; color:#fff; }
.texts{ margin:0 0 12px 0; }
.name{ text-transform:uppercase; font-size:clamp(18px,5.6vw,28px); font-weight:800; letter-spacing:.04em; text-shadow:0 2px 14px rgba(0,0,0,.45); }
.addr{ margin-top:6px; font-size:clamp(12px,3.6vw,14px); opacity:.95; text-shadow:0 1px 10px rgba(0,0,0,.4); }
.rule{ margin-top:10px; height:1px; background:rgba(255,255,255,.35); }
.actions{ margin-top:10px; display:flex; align-items:center; justify-content:space-between; gap:10px; }
.ghost{ color:#fff; background:rgba(0,0,0,.35); border:1px solid rgba(255,255,255,.35); border-radius:10px; padding-inline:12px; }
.primary{ background:#fff; color:#111; border-radius:10px; padding-inline:14px; font-weight:700; }

/* tablet+ */
@media (min-width:768px){
  .venue{ width:52vw; }
  .content{ padding:0 18px; bottom:18px; }
  .name{ font-size:clamp(22px,3.2vw,32px); }
}
</style>

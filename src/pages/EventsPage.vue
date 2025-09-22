<template>
  <q-page padding class="page events">
    <header class="q-mb-xl">
      <h1 class="text-h4 q-mb-xs">{{ $t('pages.events.title') || 'Eventi privati' }}</h1>
      <p class="text-body1 text-grey-7">
        {{ $t('pages.events.subtitle') || 'Prenota il tuo evento privato nei nostri spazi.' }}
      </p>
    </header>

    <div class="q-gutter-md">
      <!-- TODO: info spazi, capienza, modulo richiesta -->
      <q-banner dense class="bg-grey-2 text-grey-8">
        Work in progress – dettagli spazi, menù e richiesta preventivo.
      </q-banner>
    </div>
  </q-page>
</template>

<script setup>
import { useMeta } from 'quasar'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
useMeta(() => ({ title: t('pages.events.metaTitle') || 'Eventi privati | Mamma Elvira' }))
</script>

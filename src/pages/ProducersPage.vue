<template>
  <q-page padding class="page producers">
    <header class="q-mb-xl">
      <h1 class="text-h4 q-mb-xs">{{ $t('pages.producers.title') || 'Produttori' }}</h1>
      <p class="text-body1 text-grey-7">
        {{ $t('pages.producers.subtitle') || 'I nostri partner: vignaioli, frantoi, artigiani.' }}
      </p>
    </header>

    <div class="q-gutter-md">
      <!-- TODO: lista produttori / card -->
      <q-banner dense class="bg-grey-2 text-grey-8">
        Work in progress – qui mostreremo i produttori.
      </q-banner>
    </div>
  </q-page>
</template>

<script setup>
import { useMeta } from 'quasar'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
useMeta(() => ({ title: t('pages.producers.metaTitle') || 'Produttori | Mamma Elvira' }))
</script>

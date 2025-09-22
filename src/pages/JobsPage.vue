<template>
  <q-page padding class="page jobs">
    <header class="q-mb-xl">
      <h1 class="text-h4 q-mb-xs">{{ $t('pages.jobs.title') || 'Lavora con noi' }}</h1>
      <p class="text-body1 text-grey-7">
        {{ $t('pages.jobs.subtitle') || 'Entra nel team di Mamma Elvira.' }}
      </p>
    </header>

    <div class="q-gutter-md">
      <!-- TODO: form candidature / posizioni aperte -->
      <q-banner dense class="bg-grey-2 text-grey-8">
        Work in progress – qui compariranno le posizioni aperte e il form candidatura.
      </q-banner>
    </div>
  </q-page>
</template>

<script setup>
import { useMeta } from 'quasar'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
useMeta(() => ({ title: t('pages.jobs.metaTitle') || 'Lavora con noi | Mamma Elvira' }))
</script>

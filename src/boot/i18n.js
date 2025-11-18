// src/boot/i18n.js
import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'
import { watch } from 'vue'
import messages from 'src/i18n'
import { useLangStore } from 'src/stores/langStore'

// crea e ESPORTA l'istanza a livello modulo
const saved = localStorage.getItem('lang') || 'it-IT'

export const i18n = createI18n({
  legacy: false,
  locale: saved,                // 'it-IT' | 'en-US'
  fallbackLocale: 'it-IT',      // <-- fallback sull'italiano
  globalInjection: true,
  messages,                     // i messaggi locali rimangono come base
  warnHtmlMessage: false,
})

export default defineBoot(({ app }) => {
  app.use(i18n)

  const lang = useLangStore()
  lang.init({
    initial: i18n.global.locale.value,
    supported: Object.keys(messages),    // ['en-US','it-IT']
  })

  watch(
    () => lang.current,
    (val) => {
      i18n.global.locale.value = val
      localStorage.setItem('lang', val)
    },
    { immediate: true }
  )
})

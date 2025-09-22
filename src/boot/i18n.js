import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'
import { watch } from 'vue'
import messages from 'src/i18n'
import { useLangStore } from 'src/stores/langStore'

// (opzionale) sincronizza anche il language pack di Quasar UI:
// import { Quasar } from 'quasar'
// async function setQuasarLang(code) {
//   try {
//     const mod = await import(/* @vite-ignore */ `quasar/lang/${code}.mjs`)
//     if (mod?.default) Quasar.lang.set(mod.default)
//   } catch (e) { /* fallback: ignora se manca il pack */ }
// }

export default defineBoot(({ app }) => {
  const saved = localStorage.getItem('lang') || 'it-IT'

  // 1) Crea i18n con la lingua salvata
  const i18n = createI18n({
    legacy: false,
    locale: saved,             // es. "it-IT"
    fallbackLocale: 'en-US',
    globalInjection: true,
    messages,                  // chiavi: "it-IT", "en-US", ...
  })
  app.use(i18n)

  // 2) Inizializza lo store lingua
  const lang = useLangStore()
  lang.init({
    initial: i18n.global.locale.value,
    supported: Object.keys(messages),   // prendi le lingue realmente disponibili
  })

  // 3) Sincronizza store -> i18n (+ localStorage)
  watch(
    () => lang.current,
    async (val) => {
      i18n.global.locale.value = val
      localStorage.setItem('lang', val)
      // opzionale: sincronizza anche la UI di Quasar
      // await setQuasarLang(val)
    },
    { immediate: true }
  )
})

import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'
import { watch } from 'vue'
import messages from 'src/i18n'
import { useLangStore } from 'src/stores/langStore'

// opzionale: sincronizzare anche Quasar UI packs
// import { Quasar } from 'quasar'
// async function setQuasarLang(code) {
//   try {
//     const mod = await import(/* @vite-ignore */ `quasar/lang/${code}.mjs`)
//     if (mod?.default) Quasar.lang.set(mod.default)
//   } catch (e) {}
// }

export default defineBoot(({ app }) => {
  const saved = localStorage.getItem('lang') || 'it-IT'

  const i18n = createI18n({
    legacy: false,
    locale: saved,                // 'it-IT' | 'en-US'
    fallbackLocale: 'en-US',
    globalInjection: true,
    messages,
    warnHtmlMessage: false,
  })
  app.use(i18n)

  const lang = useLangStore()
  lang.init({
    initial: i18n.global.locale.value,
    supported: Object.keys(messages),    // ['en-US','it-IT']
  })

  watch(
    () => lang.current,
    async (val) => {
      i18n.global.locale.value = val
      localStorage.setItem('lang', val)
      // opzionale:
      // await setQuasarLang(val)
    },
    { immediate: true }
  )
})

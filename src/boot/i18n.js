import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

export default defineBoot(({ app }) => {
  const saved = localStorage.getItem('lang') || 'it-IT'
  const i18n = createI18n({
    legacy: false,
    locale: saved,
    fallbackLocale: 'en-US',
    globalInjection: true,
    messages
  })
  app.use(i18n)
})

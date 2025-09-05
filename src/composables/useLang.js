import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useLang () {
  const { locale } = useI18n()
  const nextLabel = computed(() => (locale.value.startsWith('it') ? 'EN' : 'IT'))
  function toggle () {
    locale.value = locale.value.startsWith('it') ? 'en-US' : 'it-IT'
    localStorage.setItem('lang', locale.value)
  }
  return { locale, nextLabel, toggle }
}

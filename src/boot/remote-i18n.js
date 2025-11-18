// src/boot/remote-i18n.js
import { boot } from 'quasar/wrappers'
import { i18n } from 'boot/i18n' // importa la tua istanza

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8787'

// Converte il documento Sanity nel formato messages di vue-i18n
function docToMessages(doc) {
  if (!doc) return {}
  const messages = { ...doc }

  // Duplica gli alias nella forma annidata per usare $t('newsletter.title1')
  // e (opzionale) tieni anche la chiave piatta per retro-compatibilità.
  if (doc.newsletterAliases) {
    messages.newsletter = {
      ...(doc.newsletter || {}),
      title1: doc.newsletterAliases.title1,
      and: doc.newsletterAliases.and,
      title2: doc.newsletterAliases.title2,
    }
    messages['newsletter.title1'] = doc.newsletterAliases.title1
    messages['newsletter.and']    = doc.newsletterAliases.and
    messages['newsletter.title2'] = doc.newsletterAliases.title2
  }

  return messages
}

// Merge "sicuro" tra messaggi locali e remoti:
// - non butta via le chiavi già presenti (es. pages.contact dai file locali)
// - sovrascrive solo ciò che arriva da Sanity
function mergeMessages(locale, msgs) {
  const existing = i18n.global.getLocaleMessage(locale) || {}

  const merged = {
    ...existing,
    ...msgs,
    // merge più profondo per sezioni annidate
    pages: {
      ...(existing.pages || {}),
      ...(msgs.pages || {}),
    },
    newsletter: {
      ...(existing.newsletter || {}),
      ...(msgs.newsletter || {}),
    },
  }

  i18n.global.setLocaleMessage(locale, merged)
}

// Cache semplice per ridurre il flicker
const LS_KEY = 'me_site_i18n_'

export default boot(async () => {
  const locale = i18n.global.locale.value // es: 'it-IT' oppure 'en-US'
  const short = locale.slice(0, 2)        // 'it' | 'en'

  // 1) prova a leggere da localStorage
  const cached = localStorage.getItem(LS_KEY + locale) || localStorage.getItem(LS_KEY + short)
  if (cached) {
    try {
      const msgs = JSON.parse(cached)
      mergeMessages(locale, msgs) // <-- PRIMO PUNTO CAMBIATO
    } catch (e) {
      console.log('boot error', e)
    }
  }

  // 2) fetch remoto
  try {
    const res = await fetch(`${API_BASE}/content/${locale}`)
    if (!res.ok) throw new Error('HTTP ' + res.status)
    const doc = await res.json()
    const msgs = docToMessages(doc)

    mergeMessages(locale, msgs) // <-- SECONDO PUNTO CAMBIATO
    localStorage.setItem(LS_KEY + locale, JSON.stringify(msgs))
  } catch (e) {
    // fallback: prova /content/it o /content/en se locale è it-IT/en-US
    console.error(' i18n - fallback failed', e)
    try {
      const res2 = await fetch(`${API_BASE}/content/${short}`)
      if (res2.ok) {
        const doc = await res2.json()
        const msgs = docToMessages(doc)

        mergeMessages(locale, msgs) // <-- TERZO PUNTO CAMBIATO
        localStorage.setItem(LS_KEY + locale, JSON.stringify(msgs))
      }
    } catch (e2) {
      console.error('[remote-i18n] fallback failed', e2)
    }
  }
})

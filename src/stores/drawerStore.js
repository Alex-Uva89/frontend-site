// src/stores/drawerStore.js
import { defineStore } from 'pinia'
import { watch } from 'vue'

const API_BASE = (import.meta?.env?.VITE_API_BASE) || 'http://localhost:8787'

// cache semplice per locale → siteStrings
const siteCache = new Map()

async function fetchSiteStrings (locale) {
  if (siteCache.has(locale)) return siteCache.get(locale)
  const res = await fetch(`${API_BASE}/content/${encodeURIComponent(locale)}`)
  if (!res.ok) throw new Error(`HTTP ${res.status} on /content/${locale}`)
  const data = await res.json()
  siteCache.set(locale, data)
  return data
}

function makeLinks(content) {
  return [
    { label: content?.drawer?.venues   || 'I nostri locali',  to: '/venues' },
    { label: content?.drawer?.story    || 'La nostra storia', to: '/story'  },
    { label: content?.nav?.events      || 'Eventi',           to: '/events' },
    { label: content?.drawer?.jobs     || 'Lavora con noi',   to: '/jobs'   },
    // Esempio esterno (se mai servisse):
    // { label: content?.nav?.instagram || 'Instagram', href: 'https://…' }
  ]
}

function makeLinksMobile(content) {
  return [
    { label: content?.drawer?.home     || 'Home',             to: '/'       },
    { label: content?.drawer?.venues   || 'I nostri locali',  to: '/venues' },
    { label: content?.drawer?.story    || 'La nostra storia', to: '/story'  },
    { label: content?.nav?.events      || 'Eventi',           to: '/events' },
    { label: content?.drawer?.jobs     || 'Lavora con noi',   to: '/jobs'   },
    { label: content?.drawer?.contact  || 'Contatti',         to: '/contact'},
  ]
}

function makeCtas(content, prevCtas) {
  return {
    booking: {
      label: content?.drawer?.book   || 'Prenota un tavolo',
      href:  prevCtas?.booking?.href || 'https://prenota.example'
    },
    private: {
      label: content?.drawer?.private || 'Eventi privati',
      to:    prevCtas?.private?.to    || '/events'
    }
  }
}

export const useDrawerStore = defineStore('drawer', {
  state: () => ({
    image: 'https://picsum.photos/seed/mamma-elvira-drawer/1920/1080',

    // Fallback IT (verranno sovrascritti dai contenuti di Sanity)
    links: [
      { label: 'I nostri locali',  to: '/venues' },
      { label: 'La nostra storia', to: '/story'  },
      { label: 'Eventi',           to: '/events' },
      { label: 'Lavora con noi',   to: '/jobs'   },
    ],
    linksMobile: [
      { label: 'Home',             to: '/'       },
      { label: 'I nostri locali',  to: '/venues' },
      { label: 'La nostra storia', to: '/story'  },
      { label: 'Eventi',           to: '/events' },
      { label: 'Lavora con noi',   to: '/jobs'   },
      { label: 'Contatti',         to: '/contact'},
    ],
    ctas: {
      booking: { label: 'Prenota un tavolo', href: 'https://prenota.example' },
      private: { label: 'Eventi privati',    to: '/events' }
    },

    _i18nReady: false,
    _stopWatch: null, // per disiscrivere il watcher quando serve
  }),

  actions: {
    setImage (url) { if (typeof url === 'string' && url) this.image = url },
    setLinks (arr) { if (Array.isArray(arr)) this.links = arr },
    setLinksMobile (arr) { if (Array.isArray(arr)) this.linksMobile = arr },
    setCtas (obj) { if (obj && typeof obj === 'object') this.ctas = { ...this.ctas, ...obj } },

    /**
     * Carica i testi tradotti dal backend (siteStrings) e aggiorna links/ctas.
     * Soft: nessun spinner, solo update silenzioso.
     */
    async loadLocale(localeTag) {
      try {
        const content = await fetchSiteStrings(localeTag)
        this.setLinks(makeLinks(content))
        this.setLinksMobile(makeLinksMobile(content))
        this.ctas = makeCtas(content, this.ctas)
        this._i18nReady = true
      } catch (err) {
        console.warn('[drawerStore] loadLocale failed:', err?.message || err)
        // fallback: mantieni i valori correnti
      }
    },

    /**
     * Chiama questo UNA sola volta (per es. nel componente TV o nel layout)
     * per collegare lo store di lingua e aggiornare on-the-fly.
     */
    initI18n({ langStore }) {
      if (!langStore) return
      // primo popolamento
      this.loadLocale(langStore.current)

      // reattivo: cambia etichette senza flash
      if (!this._stopWatch) {
        const stop = watch(
          () => langStore.current,
          (loc) => { this.loadLocale(loc) },
          { immediate: false }
        )
        this._stopWatch = stop
      }
    },
  },
})

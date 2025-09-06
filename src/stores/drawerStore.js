// drawerStore.js
import { defineStore } from 'pinia'

export const useDrawerStore = defineStore('drawer', {
  state: () => ({
    image: 'https://picsum.photos/seed/mamma-elvira-drawer/1920/1080',
    // Link di navigazione (ordine = quello mostrato in drawer)
    links: [
      { label: 'Home',              to: '/' },
      { label: 'I nostri locali',   to: '/venues' },
      { label: 'La nostra storia',  to: '/story' },
      { label: 'Produttori',        to: '/producers' },
      { label: 'Lavora con noi',    to: '/jobs' },
      { label: 'Contatti',          to: '/contact' },
      // Esempio esterno:
      // { label: 'Press', href: 'https://press.example.com' }
    ],
    // CTA in basso
    ctas: {
      booking: { label: 'Prenota un tavolo', href: 'https://prenota.example' },
      private: { label: 'Eventi privati',    to: '/events' }
    }
  }),
  actions: {
    setImage (url) { if (typeof url === 'string' && url) this.image = url },
    setLinks (arr) { if (Array.isArray(arr)) this.links = arr },
    setCtas (obj)  { if (obj && typeof obj === 'object') this.ctas = { ...this.ctas, ...obj } }
  }
})

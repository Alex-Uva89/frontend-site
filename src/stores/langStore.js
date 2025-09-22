import { defineStore } from 'pinia'

export const useLangStore = defineStore('lang', {
  state: () => ({
    current: 'it-IT',
    supported: ['it-IT', 'en-US'],
    ready: false,
  }),
  getters: {
    nextIndex: (s) => (s.supported.indexOf(s.current) + 1) % s.supported.length,
    nextLocale(s) { return s.supported[s.nextIndex] || s.current },
    currentBase: (s) => s.current.split('-')[0], // "it" da "it-IT" (se ti serve)
  },
  actions: {
    init({ initial, supported } = {}) {
      const saved = localStorage.getItem('lang')
      if (Array.isArray(supported) && supported.length) this.supported = supported
      this.current = saved || initial || this.current
      this.ready = true
    },
    setLocale(l) {
      if (!this.supported.includes(l)) return
      this.current = l
      localStorage.setItem('lang', l)
    },
    cycleLocale() {
      this.setLocale(this.nextLocale)
    },
  },
})

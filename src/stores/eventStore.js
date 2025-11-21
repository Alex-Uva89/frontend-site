import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useEventsStore = defineStore('events', () => {
  const events = ref([])
  const loading = ref(false)
  const error = ref(null)

  const API_BASE = import.meta.env.VITE_API_BASE

  // ===========================
  // Fetch ALL events
  // ===========================
  async function fetchAllEvents() {
    loading.value = true
    error.value = null

    try {
      const res = await axios.get(`${API_BASE}/events`)
      events.value = res.data
    } catch (err) {
      console.error('[EventsStore] fetchAllEvents error', err)
      error.value = 'Impossibile caricare gli eventi.'
    } finally {
      loading.value = false
    }
  }

  // ===========================
  // Fetch FUTURE events
  // ===========================
  async function fetchFutureEvents() {
    loading.value = true
    error.value = null

    try {
      const res = await axios.get(`${API_BASE}/events/future`)
      events.value = res.data
    } catch (err) {
      console.error('[EventsStore] fetchFutureEvents error', err)
      error.value = 'Impossibile caricare gli eventi futuri.'
    } finally {
      loading.value = false
    }
  }

  // ===========================
  // Fetch PAST events
  // ===========================
  async function fetchPastEvents() {
    loading.value = true
    error.value = null

    try {
      const res = await axios.get(`${API_BASE}/events/past`)
      events.value = res.data
    } catch (err) {
      console.error('[EventsStore] fetchPastEvents error', err)
      error.value = 'Impossibile caricare gli eventi passati.'
    } finally {
      loading.value = false
    }
  }

  // ===========================
  // Computed locali (opzionali)
  // ===========================
  const today = new Date()

  const futureEvents = computed(() =>
    events.value.filter(e => new Date(e.date) >= today)
  )

  const pastEvents = computed(() =>
    events.value.filter(e => new Date(e.date) < today)
  )

  // export
  return {
    events,
    loading,
    error,

    fetchAllEvents,
    fetchFutureEvents,
    fetchPastEvents,

    futureEvents,
    pastEvents
  }
})

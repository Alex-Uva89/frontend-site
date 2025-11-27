<template>
  <q-page class="events-page q-pa-none">

    <!-- HERO -->
    <HeroImage
      :images="heroImg"
      title="Eventi & Occasioni Speciali"
      subtitle="Dal compleanno alla cena aziendale: cuciniamo ricordi."
      content-bottom="10vh"
      align="left"
    />

    <div class="wrap">

      <section class="events header">
        <header>
          <p class="events_p">
            Disponiamo di una Sala Eventi e di una Sala Privata ideali per compleanni e ricorrenze, cene aziendali e meeting.Compila il form in fondo alla pagina per chiedere informazioni.

            Organizziamo periodicamente delle degustazioni di vino e altri prodotti di eccellenza; per non perdertele seguici
            <RouterLink to="/contact" :aria-label="contactLabel">qui</RouterLink>
          </p>
        </header>
      </section>


      <!-- ========================= -->
      <!--      EVENTI IN ARRIVO     -->
      <!-- ========================= -->
      <section class="events upcoming">
        <header class="events__head">
          <h2 class="events__title">Prossimi Eventi</h2>
          <p class="events__lead">Cene, degustazioni, serate speciali.</p>
        </header>

        <!-- LOADING (CARDS SKELETON) -->
        <div v-if="loading" class="carousel">
          <div v-for="n in 2" :key="'s'+n" class="event-card hero skeleton-card">
            <div class="skeleton-img"></div>
            <div class="event-card__content">
              <div class="skeleton-line w50"></div>
              <div class="skeleton-line w80"></div>
              <div class="skeleton-line w60"></div>
            </div>
          </div>
        </div>

        <!-- EMPTY STATE -->
        <div v-else-if="!futureEvents || futureEvents.length === 0" class="empty-state">
          <p>Nessun evento in arrivo. Torna a trovarci presto!</p>
        </div>

        <!-- EVENTI DISPONIBILI -->
        <template v-else>
          <!-- HINT MOBILE -->
          <div class="scroll-hint" v-if="$q.screen.lt.md">
            Scorri →
          </div>

          <!-- CAROSELLO -->
          <div class="carousel">
            <article
              v-for="e in futureEvents"
              :key="e._id"
              class="event-card hero"
            >
              <img :src="e.cover" alt="" class="event-card__img" />

              <div class="event-card__content">
                <h3 class="event-card__title">{{ e.title }}</h3>
                <p class="event-card__subtitle">{{ e.subtitle }}</p>

                <!-- TAGS -->
                <div class="tags">
                  <span class="tag" v-for="(t, i) in e.tags" :key="i">
                    {{ t }}
                  </span>
                </div>

                <!-- MENU PREVIEW -->
                <div v-if="e.menu && e.menu.length" class="menu-preview">
                  <strong class="menu-title">Menù</strong>

                  <ul class="menu-list">
                    <li v-for="(item, i) in e.menu.slice(0, 3)" :key="i">
                      {{ item }}
                    </li>
                  </ul>

                  <p v-if="e.menu.length > 3" class="menu-more">
                    …e altri piatti
                  </p>

                  <q-btn
                    flat dense no-caps
                    class="menu-more-btn"
                    label="Mostra tutto il menù"
                    @click="openMenuDialog(e)"
                  />
                </div>

                <!-- PROGRAMMA -->
                <div v-if="e.program && e.program.length" class="program-preview">
                  <strong class="menu-title">Programma</strong>

                  <ul class="menu-list">
                    <li v-for="(p, i) in e.program.slice(0, 2)" :key="i">
                      {{ p }}
                    </li>
                  </ul>
                </div>

                <p class="event-card__meta">
                  📅 {{ formatDate(e.date) }} – {{ e.time }}<br>
                  📍 {{ e.location }}<br>
                  💶 {{ e.price }}
                </p>

                <q-btn
                  no-caps
                  class="btn primary"
                  label="Prenota ora"
                  @click="sendEmailBooking(e)"
                />
<!--
                <q-btn
                  no-caps
                  outline
                  class="btn ghost q-ma-sm"
                  label="Aggiungi al calendario"
                  @click="addToCalendar(e)"
                /> -->

              </div>
            </article>
          </div>

          <div class="carousel-gradient" />
        </template>
      </section>

      <!-- ========================= -->
      <!--      EVENTI PASSATI       -->
      <!-- ========================= -->
      <section class="events past-events">
        <header class="events__head">
          <h2 class="events__title">Eventi Passati</h2>
          <p class="events__lead">Un album di ricordi e stagioni vissute.</p>
        </header>

        <!-- LOADING -->
        <div v-if="loading" class="past-grid">
          <div v-for="n in 4" :key="'p'+n" class="past-card skeleton-card">
            <div class="skeleton-img"></div>
          </div>
        </div>

        <!-- EMPTY STATE -->
        <div v-else-if="!pastEvents || pastEvents.length === 0" class="empty-state">
          <p>Nessun evento passato disponibile.</p>
        </div>

        <!-- EVENTI PASSATI -->
        <div v-else class="past-grid">
          <div v-for="e in pastEvents" :key="e._id" class="past-card">
            <img :src="e.cover" alt="" />
            <div class="past-overlay">
              <h3>{{ e.title }}</h3>
              <span>{{ formatYear(e.date) }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ========================= -->
      <!--        FORM EVENTI        -->
      <!-- ========================= -->
      <section class="event-form-section">
        <h2>Prenota un Evento Privato</h2>
        <p class="form-lead">
          Compleanni, feste private, cene aziendali: ti aiutiamo a costruire un momento speciale.
        </p>

        <div class="event-form-card">
          <q-form @submit="submitForm">

            <q-input filled label="Nome e Cognome" v-model="form.name" />
            <q-input filled label="Email" v-model="form.email" />
            <q-input filled label="Telefono" v-model="form.phone" />

            <q-select
              filled
              label="Tipo di evento"
              v-model="form.type"
              :options="eventTypes"
            />

            <q-input filled type="number" label="Numero ospiti" v-model.number="form.guests" />
            <q-input filled type="date" label="Data preferita" v-model="form.date" />

            <q-input filled type="textarea" label="Messaggio" autogrow v-model="form.message" />

            <q-btn
              type="submit"
              class="btn primary full-width q-mt-md"
              no-caps
              label="Invia richiesta"
            />

          </q-form>
        </div>
      </section>

      <!-- ========================= -->
      <!--   DIALOG MENÙ COMPLETO    -->
      <!-- ========================= -->
      <q-dialog v-model="menuDialogOpen">
        <q-card class="menu-dialog-card">
          <q-card-section>
            <div class="menu-dialog-title">
              Menù – {{ menuDialogEvent?.title }}
            </div>
            <div v-if="menuDialogEvent?.subtitle" class="menu-dialog-subtitle">
              {{ menuDialogEvent.subtitle }}
            </div>
          </q-card-section>

          <q-card-section>
            <ul class="menu-dialog-list">
              <li
                v-for="(item, i) in menuDialogEvent?.menu || []"
                :key="i"
              >
                {{ item }}
              </li>
            </ul>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat no-caps label="Chiudi" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </div>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import HeroImage from 'src/components/HeroImage.vue'
import heroImgFile from '../assets/event.jpg'

// Store eventi (Pinia)
import { useEventsStore } from 'src/stores/eventStore'
const eventsStore = useEventsStore()

const heroImg = heroImgFile

// FETCH eventi quando si entra nella pagina
onMounted(() => {
  eventsStore.fetchAllEvents()
})

// Store computed
const loading = computed(() => eventsStore.loading)
// const error = computed(() => eventsStore.error)
const futureEvents = computed(() => eventsStore.futureEvents)
const pastEvents = computed(() => eventsStore.pastEvents)
// const events = computed(() => eventsStore.events)

// ---- FORM PRENOTAZIONE ----
const form = ref({
  name: "",
  email: "",
  phone: "",
  type: "",
  guests: null,
  date: "",
  message: ""
})

const eventTypes = [
  "Compleanno",
  "Battesimo / Comunione",
  "Cena aziendale",
  "Festa privata",
  "Anniversario",
  "Altro"
]

function submitForm() {
  console.log("Richiesta evento:", form.value)
  alert("Richiesta inviata (demo).")
}

// ---- MENÙ DIALOG ----
const menuDialogOpen = ref(false)
const menuDialogEvent = ref(null)

function openMenuDialog(event) {
  menuDialogEvent.value = event
  menuDialogOpen.value = true
}

// ---- HELPERS ----
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })
}

function formatYear(dateStr) {
  return new Date(dateStr).getFullYear()
}


// ---- INVIO MAIL ----
function sendEmailBooking(event) {
  const email = event.contactEmail || "info@mammaelvira.example"

  const subject = encodeURIComponent(`Richiesta prenotazione – ${event.title}`)
  const body = encodeURIComponent(
    `Ciao,\n\nvorrei prenotare un posto per l'evento:\n\n` +
    `📌 ${event.title}\n` +
    `📅 ${formatDate(event.date)} alle ${event.time}\n\n` +
    `Numero di ospiti:\n` +
    `Richiesta aggiuntiva:\n\n` +
    `Grazie!\n`
  )

  const mailto = `mailto:${email}?subject=${subject}&body=${body}`

  // 👉 Apri in nuova scheda (funziona dove permesso dal browser)
  window.open(mailto, "_blank")
}

// ---- AGGIUNTA AL CALENDARIO ----

// function addToCalendar(event) {
//   const start = new Date(event.date + "T" + (event.time || "20:00")).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"

//   // Durata evento → 2 ore (personalizzabile)
//   const end = new Date(new Date(event.date + "T" + (event.time || "20:00")).getTime() + 2 * 60 * 60 * 1000)
//     .toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"

//   const ics = `
// BEGIN:VCALENDAR
// VERSION:2.0
// PRODID:-//Mamma Elvira//Events//IT
// BEGIN:VEVENT
// UID:${event._id}@mammaelvira
// DTSTAMP:${start}
// DTSTART:${start}
// DTEND:${end}
// SUMMARY:${event.title}
// DESCRIPTION:${event.subtitle || "Evento Mamma Elvira"}
// LOCATION:${event.location}
// END:VEVENT
// END:VCALENDAR
//   `.trim()

//   const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" })
//   const url = URL.createObjectURL(blob)

//   const link = document.createElement("a")
//   link.href = url
//   link.download = `evento-${event._id}.ics`
//   document.body.appendChild(link)
//   link.click()
//   document.body.removeChild(link)
//   URL.revokeObjectURL(url)
// }


</script>

<style scoped>
/* =============== LAYOUT BASE =============== */
.events-page {
  background: var(--sand-200);
  margin-bottom: 100px;
}

.wrap {
  width: 90%;
  margin: 0 auto;
  padding: 28px 0 40px;
}

/* TITOLI */
.events__title {
  margin: 0 0 6px;
  font-size: clamp(20px, 5vw, 28px);
}
.events__lead {
  font-size: 14px;
  opacity: .75;
  margin-bottom: 12px;
}

/* ================= HEADER ================= */

.events_p{
  font-size: 1.1rem;
  color: rgb(34, 34, 34);
}

/* ================= EVENTI IN ARRIVO ================= */
.carousel {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 6px;
  padding-right: 16px;
  -webkit-overflow-scrolling: touch;
}
.carousel::-webkit-scrollbar { display: none; }

.event-card.hero {
  scroll-snap-align: start;
  min-width: 85%;
  background: var(--sand-200);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 12px 28px rgba(0,0,0,.10);
}

.event-card__img {
  width: 100%;
  height: 170px;
  object-fit: cover;
}

.event-card__content {
  padding: 14px;
}

.event-card__title {
  font-size: 20px;
  margin: 4px 0;
  letter-spacing: -0.01em;
}

/* Sottotitolo */
.event-card__subtitle {
  opacity: .75;
  font-size: 14px;
  margin-bottom: 10px;
}

/* TAGS */
.tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.tag {
  background: var(--sand-800);
  color: #efe6d3;
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 12px;
  white-space: nowrap;
}

/* Menu preview */
.menu-preview,
.program-preview {
  background: rgba(255, 255, 255, 0.4);
  padding: 10px 12px;
  border-radius: 12px;
  margin-bottom: 12px;
  backdrop-filter: blur(4px);
}

.menu-title {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  opacity: 0.85;
}

.menu-list {
  margin: 0;
  padding-left: 16px;
  list-style: disc;
}

.menu-more {
  font-size: 12px;
  opacity: 0.65;
  margin-top: 4px;
}

.menu-more-btn {
  margin-top: 6px;
  padding: 0;
  font-size: 12px;
}

/* Meta */
.event-card__meta {
  opacity: .8;
  font-size: 14px;
  margin-bottom: 12px;
}

/* Hint mobile */
.scroll-hint {
  font-size: 13px;
  opacity: .6;
  margin-bottom: 6px;
  padding-left: 4px;
}

/* Gradient */
.carousel-gradient {
  margin-top: 40px;
}

/* Desktop layout */
@media (min-width: 768px) {
  .carousel {
    overflow-x: visible;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
  .event-card.hero {
    min-width: auto;
  }
  .scroll-hint,
  .carousel-gradient {
    display: none;
  }
}

/* ================= EVENTI PASSATI ================= */
.past-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 18px;
}

.past-card {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
}

.past-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.past-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.65));
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 10px;
  color: white;
}

.past-overlay h3 {
  margin: 0;
  font-size: 14px;
}

.past-overlay span {
  font-size: 12px;
  opacity: .85;
}

/* Desktop grid */
@media (min-width: 768px) {
  .past-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* ================= FORM ================= */
.event-form-section {
  margin-top: 40px;
}

.event-form-section h2 {
  margin-bottom: 4px;
  font-size: 24px;
}

.form-lead {
  opacity: .75;
  font-size: 14px;
  margin-bottom: 18px;
}

.event-form-card {
  background: var(--sand-200);
  padding: 20px;
  border-radius: 18px;
  box-shadow: 0 12px 28px rgba(0,0,0,0.06);
}

.full-width {
  width: 100%;
}

/* ================= SKELETON ================= */
.skeleton-card {
  background: #e8dfd2;
  border-radius: 14px;
  overflow: hidden;
  animation: pulse 1.3s infinite ease-in-out;
}

.skeleton-img {
  width: 100%;
  height: 170px;
  background: #d9cdbb;
}

.skeleton-line {
  height: 12px;
  background: #d9cdbb;
  margin: 8px 0;
  border-radius: 6px;
}

.skeleton-line.w50 { width: 50%; }
.skeleton-line.w60 { width: 60%; }
.skeleton-line.w80 { width: 80%; }

@keyframes pulse {
  0% { opacity: .65; }
  50% { opacity: .35; }
  100% { opacity: .65; }
}

/* EMPTY STATE */
.empty-state {
  text-align: center;
  padding: 30px 0;
  opacity: .7;
  font-size: 15px;
}

/* DIALOG MENÙ */
.menu-dialog-card {
  min-width: min(420px, 92vw);
  background: var(--sand-200);
}

.menu-dialog-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.menu-dialog-subtitle {
  font-size: 13px;
  opacity: .75;
}

.menu-dialog-list {
  margin: 0;
  padding-left: 18px;
  list-style: disc;
}

.menu-dialog-list li {
  font-size: 14px;
  margin-bottom: 4px;
}
</style>

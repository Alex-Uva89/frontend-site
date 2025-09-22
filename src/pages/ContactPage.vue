<template>
  <q-page class="page contact rustic">

    <div class="container">
      <!-- === 1) FORM EMAIL === -->
      <section class="section">
        <q-card flat bordered class="rust-card">
          <div class="section-header">
            <h1 class="title">{{ $t('pages.contact.title') || 'Contatti' }}</h1>
            <p class="subtitle">
              {{ $t('pages.contact.subtitle') || 'Scrivici: ti rispondiamo il prima possibile.' }}
            </p>
          </div>

          <q-form ref="formRef" @submit.prevent="onSubmit" @reset="onReset" class="q-gutter-md q-pa-md">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.name"
                  label="Nome e cognome"
                  :rules="[rules.req]"
                  standout="bg-rust-ink text-rust-paper"
                  dense
                  autocomplete="name"
                  class="rust-input"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.email"
                  label="Email"
                  :rules="[rules.req, rules.email]"
                  type="email"
                  standout="bg-rust-ink text-rust-paper"
                  dense
                  autocomplete="email"
                  class="rust-input"
                />
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.phone"
                  label="Telefono (opzionale)"
                  type="tel"
                  standout="bg-rust-ink text-rust-paper"
                  dense
                  autocomplete="tel"
                  class="rust-input"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.subject"
                  label="Oggetto"
                  :rules="[rules.req]"
                  standout="bg-rust-ink text-rust-paper"
                  dense
                  class="rust-input"
                />
              </div>

              <div class="col-12">
                <q-input
                  v-model="form.message"
                  type="textarea"
                  autogrow
                  standout="bg-rust-ink text-rust-paper"
                  :rules="[rules.req]"
                  label="Messaggio"
                  class="rust-input"
                />
              </div>

              <div class="col-12">
                <q-checkbox
                  v-model="form.privacy"
                  :rules="[val => !!val || 'Necessario']"
                  :true-value="true"
                  :false-value="false"
                  color="brown-7"
                  keep-color
                  dense
                >
                  <span class="tiny">
                    Acconsento al trattamento dei dati personali
                  </span>
                </q-checkbox>
              </div>
            </div>

            <div class="row items-center q-gutter-sm">
              <q-btn
                type="submit"
                class="btn-accent"
                :loading="sending"
                label="Invia email"
                icon="send"
                no-caps
              />
              <q-btn type="reset" flat color="brown-7" label="Reset" no-caps />
              <q-space />
              <q-btn
                flat
                color="grey-7"
                :href="`mailto:${SEND_TO}`"
                label="Oppure scrivici direttamente"
                no-caps
              />
            </div>
          </q-form>
        </q-card>
      </section>

      <!-- === Divider decorativo === -->
      <div class="divider">
        <span class="grain"></span>
      </div>

      <!-- === 2) INDIRIZZI & NUMERI DEI LOCALI === -->
      <section class="section">
        <h2 class="section-title">I nostri locali</h2>
        <q-list bordered class="rust-list rounded-borders">
          <q-item
            v-for="v in venues"
            :key="v.id"
            clickable
            tag="a"
            :href="v.map"
            target="_blank"
            rel="noopener"
            class="rust-item"
          >
            <q-item-section avatar>
              <q-avatar color="brown-3" text-color="brown-10" icon="place" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">{{ v.name }}</q-item-label>
              <q-item-label caption>{{ v.address }}</q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-btn
                flat dense color="brown-8"
                :label="v.phone"
                :href="`tel:${v.phoneRaw || v.phone}`"
                @click.stop
                icon="call"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </section>

      <!-- === Divider decorativo === -->
      <div class="divider">
        <span class="grain"></span>
      </div>

      <!-- === 3) SEGUICI SUI SOCIAL === -->
      <section class="section">
        <h2 class="section-title">Seguici sui social</h2>
        <div class="row q-col-gutter-sm socials-wrap">
          <div v-for="s in socials" :key="s.name" class="col-auto">
            <q-btn
              class="social-chip"
              unelevated
              :label="s.name"
              :href="s.href"
              target="_blank"
              rel="noopener"
              no-caps
              icon="share"
            />
          </div>
        </div>
      </section>
    </div>

  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

/** Sostituisci con la tua email */
const SEND_TO = 'info@mammaelvira.it'

const $q = useQuasar()
const formRef = ref(null)
const sending = ref(false)
const form = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  privacy: false
})

const rules = {
  req: v => (v !== null && v !== undefined && String(v).trim() !== '') || 'Campo obbligatorio',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)) || 'Email non valida'
}

function buildMailto () {
  const subject = `[Sito] ${form.value.subject}`.trim()
  const bodyLines = [
    `Nome: ${form.value.name}`,
    `Email: ${form.value.email}`,
    form.value.phone ? `Telefono: ${form.value.phone}` : '',
    '',
    form.value.message
  ].filter(Boolean)
  const body = bodyLines.join('\n')
  return `mailto:${SEND_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

async function onSubmit () {
  const ok = await formRef.value.validate()
  if (!ok) {
    $q.notify({ type: 'negative', message: 'Compila i campi obbligatori' })
    return
  }
  try {
    sending.value = true
    const url = buildMailto()
    window.location.href = url
    $q.notify({ type: 'positive', message: 'Apro il client di posta…' })
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'warning', message: `Se non si apre, scrivi a ${SEND_TO}` })
  } finally {
    sending.value = false
  }
}

function onReset () {
  form.value = { name: '', email: '', phone: '', subject: '', message: '', privacy: false }
}

/* === Dati locali (sostituisci con quelli reali) === */
const venues = ref([
  {
    id: 'me-enoteca',
    name: 'Mamma Elvira Enoteca',
    address: 'Via Esempio 12, 73100 Lecce (LE)',
    phone: '+39 0832 000000',
    phoneRaw: '+390832000000',
    map: 'https://maps.google.com/?q=Mamma%20Elvira%20Enoteca%20Lecce'
  },
  {
    id: 'me-osteria',
    name: 'Mamma Elvira Osteria',
    address: 'Via Seconda 45, 73100 Lecce (LE)',
    phone: '+39 0832 111111',
    phoneRaw: '+390832111111',
    map: 'https://maps.google.com/?q=Mamma%20Elvira%20Osteria%20Lecce'
  },
  {
    id: 'me-winebar',
    name: 'Mamma Elvira Wine Bar',
    address: 'Piazza Qualcosa 3, 73100 Lecce (LE)',
    phone: '+39 0832 222222',
    phoneRaw: '+390832222222',
    map: 'https://maps.google.com/?q=Mamma%20Elvira%20Wine%20Bar%20Lecce'
  }
])

/* === Social (sostituisci i link reali) === */
const socials = ref([
  { name: 'Instagram', href: 'https://instagram.com/mammaelvira' },
  { name: 'Facebook',  href: 'https://facebook.com/mammaelvira' },
  { name: 'TikTok',    href: 'https://tiktok.com/@mammaelvira' },
  { name: 'YouTube',   href: 'https://youtube.com/@mammaelvira' },
  { name: 'Tripadvisor', href: 'https://www.tripadvisor.it/' }
])
</script>

<style scoped>
/* ===================== LAYOUT BASE ===================== */
.page.contact.rustic{
  min-height: 100%;
  padding: 20px !important; /* richiesto: almeno 20px attorno alla pagina */
  color: var(--rust-ink);
  /* texture carta */
  background-color:var(--stone-50)
}
.page.contact.rustic::before{
  /* grana leggerissima della carta */
  content:"";
  position: fixed; inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle, rgba(0,0,0,.02) 1px, transparent 1.5px) 0 0 / 6px 6px;
  mix-blend-mode: multiply;
  opacity: .5;
}

.container{
  width: 100%;
  max-width: 1040px;
  margin: 0 auto;
}

/* ===================== TITOLI & SEZIONI ===================== */
.section{ margin-bottom: 28px; }
.section-header{
  padding: 8px 8px 4px;
  border-left: 4px solid var(--rust-accent);
  margin-bottom: 8px;
}
.title{
  margin: 0;
  font-size: clamp(1.6rem, 1.2rem + 1.2vw, 2.2rem);
  letter-spacing: .01em;
}
.subtitle{
  margin: 2px 0 0;
  color: #6d5b50;
}

/* separatore decorativo “rust” */
.divider{
  display: grid; place-items: center;
  margin: 8px 0 24px;
}
.divider .grain{
  display:block; width: 100%; max-width: 860px; height: 1px;
  background:
    linear-gradient(90deg, transparent, rgba(0,0,0,.25), transparent);
  box-shadow: 0 1px 0 rgba(255,255,255,.35);
  opacity: .35;
}

/* ===================== CARTE & INPUT ===================== */
.rust-card{
  border-radius: 14px;
  background: rgba(255,255,255,.6);
  backdrop-filter: blur(2px);
  border: 1px solid var(--rust-edge);
  box-shadow:
    0 1px 0 rgba(255,255,255,.7) inset,
    0 10px 20px rgba(0,0,0,.06);
  padding: 14px 14px 16px;
}

.rust-input :deep(.q-field__control){
  border-radius: 10px;
}
.rust-input :deep(.q-field__label){
  letter-spacing: .01em;
}

/* Bottone primario “legno/rame” */
.btn-accent{
  background: linear-gradient(180deg, var(--rust-accent), var(--rust-accent-2));
  color: #fff;
  border-radius: 12px;
  padding: 8px 16px;
  box-shadow: 0 6px 18px rgba(122, 79, 51, .25);
}
.btn-accent:hover{ filter: brightness(1.02); }

/* ===================== LISTA VENUES ===================== */
.rust-list{
  background: rgba(255,255,255,.5);
  border: 1px solid var(--rust-edge);
}
.rust-item + .rust-item{
  border-top: 1px dashed rgba(0,0,0,.08);
}

/* ===================== SOCIAL ===================== */
.socials-wrap{ margin-top: 6px; }
.social-chip{
  background: #fff;
  color: var(--rust-accent-2);
  border: 1px solid var(--rust-edge);
  border-radius: 999px;
  padding: 8px 14px;
  box-shadow: 0 4px 10px rgba(0,0,0,.06);
}
.social-chip:hover{ background: #fdf8f2; }

/* Dettagli tipografici */
.tiny{ font-size: 0.9rem; color: #6d5b50; }
</style>

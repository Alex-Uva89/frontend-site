<template>
  <q-page padding class="page jobs bg-wood">
    <!-- ===== HERO ===== -->
    <section class="hero q-mb-xl">
      <q-card flat bordered class="glass-card hero-card">
        <div class="row items-center q-col-gutter-md">
          <div class="col-12 col-md">
            <h1 class="q-mt-none q-mb-sm text-weight-bold">
              {{ $t('pages.jobs.title') || 'Lavora con noi' }}
            </h1>
            <p class="text-body1 text-italic text-deep-orange-10">
              {{ $t('pages.jobs.subtitle') || 'Entra nel team di Mamma Elvira e cresci con noi.' }}
            </p>
            <div class="q-mt-md row q-gutter-sm">
              <q-btn color="primary" unelevated icon="work" no-caps
                     @click="openApplyDialog(null)"
                     :label="$t('pages.jobs.ctaSpontaneous') || 'Candidatura spontanea'"/>
              <q-btn flat color="deep-orange-10" icon="thumb_up" no-caps
                     :label="$t('pages.jobs.whyUs') || 'Perché lavorare con noi'"
                     @click="scrollTo('why')" />
            </div>
          </div>
          <div class="col-12 col-md-auto">
            <div class="hero-badge">
              <div class="led-strip"></div>
              <div class="badge-text">We’re Hiring</div>
            </div>
          </div>
        </div>
      </q-card>
    </section>

    <!-- ===== FILTRI ===== -->
    <section class="q-mb-lg">
      <q-card flat bordered class="glass-card q-pa-md">
        <q-form @submit.prevent>
          <div class="row q-col-gutter-md items-end">
            <div class="col-12 col-md-4">
              <q-input v-model="search" dense standout="bg-grey-10 text-deep-orange-10"
                       :label="$t('pages.jobs.search') || 'Cerca ruolo o parola chiave'"
                       debounce="200" clearable clear-icon="close" prefix="🔎"/>
            </div>

            <div class="col-6 col-md-2">
              <q-select v-model="filters.location"
                        :options="locations"
                        dense standout="bg-grey-10 text-deep-orange-10"
                        emit-value map-options clearable clear-icon="close"
                        :label="$t('pages.jobs.location') || 'Località'"/>
            </div>
            <div class="col-6 col-md-2">
              <q-select v-model="filters.department"
                        :options="departments"
                        dense standout="bg-grey-10 text-deep-orange-10"
                        emit-value map-options clearable clear-icon="close"
                        :label="$t('pages.jobs.department') || 'Reparto'"/>
            </div>
            <div class="col-6 col-md-2">
              <q-select v-model="filters.contract"
                        :options="contracts"
                        dense standout="bg-grey-10 text-deep-orange-10"
                        emit-value map-options clearable clear-icon="close"
                        :label="$t('pages.jobs.contract') || 'Contratto'"/>
            </div>
            <div class="col-6 col-md-2">
              <q-select v-model="filters.level"
                        :options="levels"
                        dense standout="bg-grey-10 text-deep-orange-10"
                        emit-value map-options clearable clear-icon="close"
                        :label="$t('pages.jobs.level') || 'Seniority'"/>
            </div>
          </div>

          <!-- chips filtri -->
          <div class="row q-gutter-xs q-mt-sm">
            <q-chip v-if="search" outline color="teal-3" text-color="black" removable @remove="search = ''">
              {{ $t('pages.jobs.search') || 'Cerca' }}: <strong class="q-ml-xs">{{ search }}</strong>
            </q-chip>
            <q-chip v-for="ch in activeFilterChips" :key="ch.key" outline color="deep-orange-10" text-color="black"
                    removable @remove="clearFilter(ch.key)">
              {{ ch.label }}
            </q-chip>
            <q-space/>
            <q-btn v-if="hasAnyFilter" dense flat icon="filter_alt_off" color="grey-4" no-caps
                   @click="resetFilters" :label="$t('common.clearAll') || 'Pulisci filtri'"/>
          </div>
        </q-form>
      </q-card>
    </section>

    <!-- ===== LISTA POSIZIONI ===== -->
    <section class="q-mb-xl">
      <div v-if="filteredJobs.length === 0" class="empty glass-card q-pa-xl text-center">
        <q-icon name="travel_explore" size="40px" class="q-mb-sm text-grey-10"/>
        <div class="text-h6 q-mb-xs text-grey-10">{{ $t('pages.jobs.noResultsTitle') || 'Nessun risultato' }}</div>
        <div class="text-body2 q-mb-md text-grey-10">
          {{ $t('pages.jobs.noResultsBody') || 'Prova a cambiare i filtri o invia una candidatura spontanea.' }}
        </div>
        <q-btn color="primary" icon="work" no-caps @click="openApplyDialog(null)"
               :label="$t('pages.jobs.ctaSpontaneous') || 'Candidatura spontanea'"/>
      </div>

      <div class="row q-col-gutter-lg">
        <div v-for="job in filteredJobs" :key="job.id" class="col-12 col-md-6 col-lg-4">
          <q-card flat bordered class="glass-card job-card">
            <div class="job-head">
              <div class="title">
                <div class="num-pill">#{{ jobDisplayNumber(job) }}</div>
                <h3 class="q-my-none text-weight-bold">{{ job.title }}</h3>
              </div>
              <div class="tags">
                <q-chip square dense icon="place" :label="job.location"/>
                <q-chip square dense icon="work_outline" :label="job.contract"/>
                <q-chip square dense icon="schedule" :label="job.shift"/>
                <q-chip v-if="job.tips" square dense icon="euro" :label="$t('pages.jobs.tips') || 'Mance'"/>
              </div>
            </div>

            <q-expansion-item
              expand-separator
              icon="info"
              :label="$t('pages.jobs.details') || 'Dettagli ruolo'"
              header-class="text-deep-orange-10"
            >
              <div class="q-pa-md">
                <p class="q-mb-md text-body2">{{ job.description }}</p>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <h4 class="subtle">{{ $t('pages.jobs.responsibilities') || 'Responsabilità' }}</h4>
                    <ul class="ul-clean">
                      <li v-for="(r, i) in job.responsibilities" :key="i">{{ r }}</li>
                    </ul>
                  </div>
                  <div class="col-12 col-sm-6">
                    <h4 class="subtle">{{ $t('pages.jobs.requirements') || 'Requisiti' }}</h4>
                    <ul class="ul-clean">
                      <li v-for="(r, i) in job.requirements" :key="i">{{ r }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </q-expansion-item>

            <div class="q-pa-md row items-center q-gutter-sm">
              <q-btn color="primary" icon="send" no-caps @click="openApplyDialog(job)"
                     :label="$t('pages.jobs.apply') || 'Candidati'"/>
              <q-btn flat icon="ios_share" color="deep-orange-10" no-caps @click="shareJob(job)"
                     :label="$t('pages.jobs.share') || 'Condividi'"/>
              <q-space/>
              <q-badge color="green-4" text-color="black" align="middle" class="q-pa-xs">
                {{ $t('pages.jobs.hiringNow') || 'Assunzioni in corso' }}
              </q-badge>
            </div>
          </q-card>
        </div>
      </div>
    </section>

    <!-- ===== PERCHE’ LAVORARE CON NOI ===== -->
    <section :id="ids.why" class="q-mb-xl">
      <h2 class="text-h5 text-weight-bold q-mb-md">
        {{ $t('pages.jobs.whyUsTitle') || 'Perché lavorare con noi' }}
      </h2>
      <div class="row q-col-gutter-lg">
        <div v-for="bv in benefits" :key="bv.title" class="col-12 col-md-6 col-lg-4">
          <q-card flat bordered class="glass-card benefit-card q-pa-md">
            <div class="row items-start q-col-gutter-sm">
              <div class="col-auto">
                <q-icon :name="bv.icon" size="md" class="text-deep-orange-10"/>
              </div>
              <div class="col">
                <div class="text-subtitle1 text-weight-bold q-mb-xs">{{ bv.title }}</div>
                <div class="text-body2 text-grey-10">{{ bv.body }}</div>
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </section>

    <!-- ===== FAQ ===== -->
    <section class="q-mb-xl">
      <h2 class="text-h6 text-weight-bold q-mb-sm">FAQ</h2>
      <q-expansion-item v-for="(fq, i) in faqs" :key="i" expand-icon="expand_more"
                        :label="fq.q" class="glass-card q-mb-sm" switch-toggle-side>
        <div class="q-pa-md text-body2">{{ fq.a }}</div>
      </q-expansion-item>
    </section>

    <!-- ===== DIALOG CANDIDATURA ===== -->
    <q-dialog v-model="apply.open" persistent>
      <q-card style="max-width: 720px; width: 100%" class="glass-card">
        <q-card-section class="row items-center q-gutter-sm">
          <q-icon name="badge" size="28px" class="text-deep-orange-10"/>
          <div class="text-h6 text-weight-bold">
            {{ $t('pages.jobs.applyNow') || 'Candidati ora' }}
          </div>
          <q-space/>
          <q-btn dense flat round icon="close" v-close-popup/>
        </q-card-section>

        <q-separator dark/>

        <q-card-section>
          <q-form ref="formRef" @submit.prevent="submitApplication">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-input v-model="apply.form.name" outlined dense autocomplete="name"
                         :label="$t('common.name') || 'Nome e cognome'" :rules="[rules.req]"/>
              </div>
              <div class="col-12 col-sm-6">
                <q-input v-model="apply.form.email" type="email" outlined dense autocomplete="email"
                         :label="$t('common.email') || 'Email'" :rules="[rules.req, rules.email]"/>
              </div>
              <div class="col-12 col-sm-6">
                <q-input v-model="apply.form.phone" type="tel" outlined dense autocomplete="tel"
                         :label="$t('common.phoneOptional') || 'Telefono (opzionale)'" />
              </div>
              <div class="col-12 col-sm-6">
                <q-select v-model="apply.form.role"
                          :options="roleOptions"
                          outlined dense emit-value map-options
                          :label="$t('pages.jobs.position') || 'Posizione'"
                          :hint="$t('pages.jobs.positionHint') || 'Se candidatura spontanea, scegli “Generale”'"/>
              </div>
              <div class="col-12">
                <q-input v-model="apply.form.message" outlined type="textarea" autogrow
                         :label="$t('pages.jobs.coverLetter') || 'Presentazione'" :rules="[rules.req]"/>
              </div>
              <div class="col-12">
                <q-checkbox v-model="apply.form.privacy" color="deep-orange-10" keep-color dense
                            :rules="[v => !!v || ($t('common.required') || 'Necessario')]">
                  <span class="text-body2">
                    {{ $t('pages.jobs.privacy') || 'Acconsento al trattamento dei dati personali' }}
                  </span>
                </q-checkbox>
              </div>
            </div>

            <div class="row items-center q-gutter-sm q-mt-sm">
              <q-btn type="submit" color="primary" :loading="apply.sending" icon="send" no-caps
                     :label="$t('pages.jobs.sendApplication') || 'Invia candidatura'"/>
              <q-btn flat color="deep-orange-10" icon="alternate_email" no-caps
                     :href="mailtoDirect" :label="$t('pages.jobs.writeUs') || 'Scrivici via email'"/>
              <q-space/>
              <q-btn flat dense icon="content_copy" color="grey-4" no-caps @click="copyEmail()"
                     :label="SEND_TO"/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- ===== CTA MOBILE FISSA ===== -->
    <div class="apply-fab">
      <q-btn round color="primary" size="lg" icon="work" @click="openApplyDialog(null)" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const $q = useQuasar()

/** Email HR (cambia con quella reale) */
const SEND_TO = 'hr@mammaelvira.it'

/* ===== STATE ===== */
const jobs = ref([])
const locations = ref([])
const departments = ref([])
const contracts = ref([])
const levels = ref([])

/* ===== API BASE ===== */
const API_BASE =
  (import.meta?.env?.VITE_API_BASE) ||
  'http://localhost:8787'

/* ===== LOAD FROM /jobs ===== */
onMounted(async () => {
  try {
    const res = await fetch(`${API_BASE}/jobs`, { headers: { 'Accept': 'application/json' }})
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()

    jobs.value = Array.isArray(data?.items) ? data.items : []

    const map = (arr = []) => arr.map(v => ({ label: v, value: v }))
    locations.value   = map(data?.filters?.locations)
    departments.value = map(data?.filters?.departments)
    contracts.value   = map(data?.filters?.contracts)
    levels.value      = map(data?.filters?.levels)
  } catch (err) {
    console.error('[jobs load]', err)
    $q.notify({ type: 'negative', message: 'Errore nel caricamento posizioni' })
  }
})

/* ===== FILTRI ===== */
const search = ref('')
const filters = ref({
  location: null,
  department: null,
  contract: null,
  level: null
})
const hasAnyFilter = computed(() =>
  !!search.value || !!filters.value.location || !!filters.value.department ||
  !!filters.value.contract || !!filters.value.level
)
const activeFilterChips = computed(() => {
  const chips = []
  if (filters.value.location)   chips.push({ key: 'location',   label: filters.value.location })
  if (filters.value.department) chips.push({ key: 'department', label: filters.value.department })
  if (filters.value.contract)   chips.push({ key: 'contract',   label: filters.value.contract })
  if (filters.value.level)      chips.push({ key: 'level',      label: filters.value.level })
  return chips
})
function clearFilter(key){ filters.value[key] = null }
function resetFilters(){ search.value = ''; filters.value = { location:null, department:null, contract:null, level:null } }

const filteredJobs = computed(() => {
  const txt = search.value.trim().toLowerCase()
  return jobs.value.filter(j => {
    const matchesText =
      !txt ||
      j.title?.toLowerCase?.().includes(txt) ||
      j.description?.toLowerCase?.().includes(txt) ||
      j.department?.toLowerCase?.().includes(txt) ||
      j.location?.toLowerCase?.().includes(txt)

    const mLoc  = !filters.value.location   || j.location   === filters.value.location
    const mDep  = !filters.value.department || j.department === filters.value.department
    const mCon  = !filters.value.contract   || j.contract   === filters.value.contract
    const mLvl  = !filters.value.level      || j.level      === filters.value.level

    return matchesText && mLoc && mDep && mCon && mLvl
  })
})

/* ===== APPLY DIALOG ===== */
const formRef = ref(null)
const apply = ref({
  open: false,
  sending: false,
  form: {
    name: '', email: '', phone: '',
    role: 'Generale',
    message: '',
    privacy: false
  }
})
const roleOptions = computed(() => [
  { label: 'Generale (candidatura spontanea)', value: 'Generale' },
  ...jobs.value.map(j => ({ label: j.title, value: j.title }))
])

function openApplyDialog(job){
  apply.value.open = true
  apply.value.form.role = job?.title || 'Generale'
}

const rules = {
  req: v => (v !== null && v !== undefined && String(v).trim() !== '') || (t('common.required') || 'Campo obbligatorio'),
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)) || (t('common.invalidEmail') || 'Email non valida')
}

function buildMailto(){
  const subject = `[Candidatura] ${apply.value.form.role} — ${apply.value.form.name}`.trim()
  const bodyLines = [
    `Nome: ${apply.value.form.name}`,
    `Email: ${apply.value.form.email}`,
    apply.value.form.phone ? `Telefono: ${apply.value.form.phone}` : '',
    `Posizione: ${apply.value.form.role}`,
    '',
    apply.value.form.message || ''
  ].filter(Boolean)
  const body = bodyLines.join('\n')
  return `mailto:${SEND_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
const mailtoDirect = computed(() => buildMailto())

async function submitApplication(){
  const ok = await formRef.value.validate()
  if (!ok) {
    $q.notify({ type: 'negative', message: t('common.fillRequired') || 'Compila i campi obbligatori' })
    return
  }
  try{
    apply.value.sending = true
    window.location.href = buildMailto()
    $q.notify({ type: 'positive', message: t('pages.jobs.openMail') || 'Apro il client di posta…' })
    apply.value.open = false
  }catch(e){
    console.error(e)
    $q.notify({ type: 'warning', message: t('pages.jobs.writeUsFallback') || `Se non si apre, scrivi a ${SEND_TO}` })
  }finally{
    apply.value.sending = false
  }
}

function copyEmail(){
  navigator.clipboard?.writeText(SEND_TO)
  $q.notify({ type: 'positive', message: t('pages.jobs.copiedEmail') || 'Email copiata negli appunti' })
}

function shareJob(job){
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const text = `${job.title} – ${job.location} @ Mamma Elvira`
  if (navigator.share){
    navigator.share({ title: job.title, text, url }).catch(() => {})
  }else{
    navigator.clipboard?.writeText(`${text}\n${url}`)
    $q.notify({ type: 'positive', message: t('pages.jobs.copiedLink') || 'Link copiato' })
  }
}

/* ===== “Why us” + FAQ ===== */
const benefits = [
  { icon:'restaurant', title:'Pasti e sconti staff', body:'Pasto a turno e sconti sui prodotti della casa e dei produttori amici.' },
  { icon:'school',     title:'Formazione continua',  body:'Vino, sala, mixology e ospitalità: crescere è nel nostro DNA.' },
  { icon:'savings',    title:'Mance trasparenti',    body:'Sistema di mance chiaro e condiviso in team.' },
  { icon:'schedule',   title:'Turni equilibrati',    body:'Work-life balance: pianificazione mensile e scambi facilitati.' },
  { icon:'insights',   title:'Crescita rapida',      body:'Percorsi interni e ruoli di responsabilità per chi lo desidera.' },
  { icon:'eco',        title:'Territorio e qualità', body:'Produttori selezionati, stagionalità e valore al territorio.' }
]
const faqs = [
  { q:'Serve esperienza pregressa?', a:'Dipende dal ruolo: per i ruoli junior è sufficiente motivazione e attitudine al servizio. Formiamo direttamente in sede.' },
  { q:'È possibile lavorare part-time?', a:'Sì, molte posizioni prevedono part-time con turni concordati.' },
  { q:'Dove si svolgono i colloqui?', a:'Di norma a Lecce, nel locale di riferimento; in prima battuta anche su videochiamata.' }
]

/* ===== Ancora: Why Us ===== */
const ids = { why: 'why' }
function scrollTo(id){
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior:'smooth', block:'start' })
}

/* Nice: autoscroll ad ancora da hash */
onMounted(() => {
  if (location.hash && location.hash.slice(1) === ids.why) {
    scrollTo(ids.why)
  }
})

/* Utility */
function jobDisplayNumber(job){
  const idx = jobs.value.findIndex(j => j.id === job.id)
  return String(idx + 1).padStart(2, '0')
}
</script>

<style scoped>
/* ===== background rustico + padding comodo ===== */
.page.jobs{
  padding: 50px;
}
.bg-wood{
  /* effetto legno soft + overlay scuro per far risaltare glass */
  background: var(--stone-50);
  background-attachment: fixed;
  min-height: 100%;
}

/* ===== cards in glassmorphism coerenti col resto del sito ===== */
.glass-card{
  --g-brd: rgb(54, 47, 47);
  --g-bg:  rgba(16,16,16,.48);
  border: 1px solid var(--g-brd);
  border-radius: 16px;
  background:var(--stone-100);
  backdrop-filter: blur(12px) saturate(1.08);
  -webkit-backdrop-filter: blur(12px) saturate(1.08);
  box-shadow: 0 10px 24px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.12);
  color:black
}

/* ===== HERO ===== */
.hero-card{
  padding: 18px 16px;
}
.hero h1{ letter-spacing:.02em; }
.hero-badge{
  position: relative;
  width: 180px; height: 96px;
  border-radius: 14px;
  border:1px solid rgba(255,255,255,.2);
  background:
    linear-gradient(180deg, rgba(255,255,255,.14), rgba(255,255,255,0) 48%),
    rgba(32,32,32,.4);
  display:grid; place-items:center;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.25), 0 8px 20px rgba(0,0,0,.35);
}
.hero-badge .led-strip{
  position:absolute; top:10px; left:10px; right:10px; height:10px; border-radius:999px;
  background:
    radial-gradient(circle at 10% 50%, rgba(255,170,60,.9), rgba(255,170,60,0) 45%) 0 0/40% 100% no-repeat,
    radial-gradient(circle at 50% 50%, rgba(120,255,180,.9), rgba(120,255,180,0) 45%) 50% 0/40% 100% no-repeat,
    radial-gradient(circle at 90% 50%, rgba(255,105,180,.9), rgba(255,105,180,0) 45%) 100% 0/40% 100% no-repeat;
  filter: blur(.6px);
}
.hero-badge .badge-text{
  margin-top:12px; color:#dcffe9; font-weight:900; letter-spacing:.1em; text-transform:uppercase;
  text-shadow: 0 0 6px rgba(120,255,180,.45), 0 2px 0 rgba(0,0,0,.45);
}

/* ===== JOB CARD ===== */
.job-card .job-head{
  padding: 14px 14px 8px;
}
.job-card .title{
  display:flex; align-items:center; gap:10px;
}
.num-pill{
  display:inline-grid; place-items:center; min-width:34px; height:34px; border-radius:999px;
  padding: 0 8px; color:#b6ffd1; background: rgba(0,0,0,.35);
  border:1px solid rgba(255,255,255,.22);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.25), inset 0 -6px 10px rgba(0,0,0,.35), 0 0 12px rgba(120,255,180,.25);
  text-shadow: 0 0 2px currentColor, 0 0 8px rgba(120,255,180,.5);
  font-weight:900; letter-spacing:.04em;
}
.job-card .tags{
  margin-top: 8px;
}
.job-card .q-chip{
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.16);
  color: #0c0c0c;
}

.subtle{
  font-size: .9rem; letter-spacing:.04em; color: #ffe2b0; margin-bottom:.25rem;
}
.ul-clean{ padding-left: 1.1rem; margin: .25rem 0 0; }
.ul-clean li{ margin: .15rem 0; }

/* ===== EMPTY STATE ===== */
.empty{
  text-align:center; color:#fff;
}

/* ===== CTA MOBILE ===== */
.apply-fab{
  position: fixed; right: 16px; bottom: 16px; z-index: 0;
}
@media (min-width: 901px){
  .apply-fab{ display:none; }
}
</style>

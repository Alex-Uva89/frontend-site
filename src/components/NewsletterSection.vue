<template>
  <section class="nl">
    <div class="nl__inner">
      <!-- Illustrazione (nascosta su mobile) -->
      <div class="nl__left" aria-hidden="true">
        <svg viewBox="0 0 140 120">
          <g fill="none" stroke="currentColor" stroke-width="2">
            <rect x="14" y="30" rx="10" ry="10" width="112" height="72"/>
            <path d="M20 54c28 10 72 10 100 0"/>
            <path d="M36 30c-2-10 8-16 14-10m12 10c-2-10 8-16 14-10m12 10c-2-10 8-16 14-10"/>
          </g>
          <text x="72" y="80" text-anchor="middle" font-size="38" fill="currentColor" font-weight="800">M</text>
        </svg>
      </div>

      <div class="nl__right">
        <h2 class="nl__title">{{ t('newsletter.title') }}</h2>

        <q-form class="nl__form" @submit.prevent="onSubmit">
          <!-- Email + bottone -->
          <q-input
            v-model="email"
            type="email"
            class="nl__input"
            :label="t('newsletter.email')"
            autocomplete="email"
            outlined
            dense
            :error="emailTouched && !emailValid"
            :error-message="t('newsletter.emailErr')"
            @blur="emailTouched = true"
          >
            <template #append>
              <q-btn
                type="submit"
                no-caps
                class="nl__btn"
                :disable="!canSubmit || submitting"
                :loading="submitting"
              >{{ te('newsletter.go') ? t('newsletter.go') : t('newsletter.submit') }}</q-btn>
            </template>
          </q-input>

          <!-- Regalo compleanno -->
          <q-expansion-item
            v-model="giftOpen"
            dense
            expand-icon="keyboard_arrow_down"
            switch-toggle-side
            class="nl__acc"
            header-class="nl__accHead"
          >
            <template #header>
              <div class="nl__accLabel">{{ t('newsletter.giftQ') }}</div>
            </template>

            <div class="nl__accBody">
              <q-input
                v-model="birthday"
                type="date"
                class="nl__date"
                :label="t('newsletter.birthdate')"
                outlined
                dense
                hint="YYYY-MM-DD"
                :error="birthdayTouched && giftOpen && !birthdayValid"
                :error-message="t('newsletter.birthErr')"
                @blur="birthdayTouched = true"
              >
                <template #prepend><q-icon name="cake" /></template>
              </q-input>
              <p class="nl__note">{{ t('newsletter.giftNote') }}</p>
            </div>
          </q-expansion-item>

          <!-- Consenso -->
          <div class="nl__consent items-center">
            <!-- Checkbox (non Radio) -->
            <q-checkbox v-model="consent" dense color="brown-10" />
            <small class="nl__consentText">
              {{ t('newsletter.consent') }}
              <a href="/privacy" target="_blank" rel="noopener" class="nl__link">
                {{ t('newsletter.privacy') }}
              </a>
              <template v-if="te('newsletter.and')">
                {{ ' ' + t('newsletter.and') + ' ' }}
              </template>
              <template v-if="te('newsletter.terms')">
                <a href="/terms" target="_blank" rel="noopener" class="nl__link">
                  {{ t('newsletter.terms') }}
                </a>.
              </template>
            </small>
          </div>

          <!-- Esito -->
          <transition name="fade">
            <div v-if="message" class="nl__msg" :class="{'ok': success, 'err': !success}">
              {{ message }}
            </div>
          </transition>
        </q-form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, te } = useI18n()

const email = ref(''); const emailTouched = ref(false)
const consent = ref(false)
const giftOpen = ref(false); const birthday = ref(''); const birthdayTouched = ref(false)
const submitting = ref(false); const message = ref(''); const success = ref(false)

const emailValid = computed(() => /^\S+@\S+\.\S+$/.test(email.value))
const birthdayValid = computed(() => !giftOpen.value || (!!birthday.value && /^\d{4}-\d{2}-\d{2}$/.test(birthday.value)))
const canSubmit = computed(() => emailValid.value && consent.value && birthdayValid.value)

watch(giftOpen, open => { if (!open) birthday.value = '' })

async function onSubmit () {
  emailTouched.value = true; birthdayTouched.value = true; message.value = ''
  if (!canSubmit.value) return
  submitting.value = true
  try {
    await new Promise(r => setTimeout(r, 600))
    success.value = true
    message.value = t('newsletter.okMsg', 'Grazie! Controlla la tua casella per confermare.')
    email.value = ''; consent.value = false; giftOpen.value = false; birthday.value = ''
  } catch (e) {
    console.error(e)
    success.value = false
    message.value = t('newsletter.errMsg', 'Ops! Riprova più tardi.')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
:root{
  --paper: #f5f0e4;
  --sepia: #3b1d12;
  --sepia-30: rgba(59,29,18,.3);
}
.nl{ background:#fff; color:var(--sepia); padding:clamp(16px,6%,28px) 0; }
.nl__inner{ width:90%; margin:0 auto; display:grid; grid-template-columns:1fr; align-items:center; gap:20px; }
.nl__left{ display:none; color:var(--sepia); }
.nl__right{ justify-self:center; width:90%; }
.nl__title{ margin:0 0 12px; font-size:clamp(20px,6vw,36px); line-height:1.08; letter-spacing:-.01em; }
.nl__form{ display:grid; gap:12px; }
.nl__input :deep(.q-field__control){ border:1.5px solid var(--sepia); background:transparent!important; border-radius:8px; min-height:48px; }
.nl__input :deep(.q-field__label){ font-weight:800; letter-spacing:.12em; }
.nl__input :deep(.q-field__native){ font-weight:700; letter-spacing:.06em; }
.nl__btn{ background:transparent; border:1.5px solid var(--sepia); color:var(--sepia); border-radius:8px; padding:6px 14px; font-weight:700; }
.nl__acc{ border:1px solid var(--sepia-30); border-radius:8px; background:transparent; }
.nl__accHead{ padding:8px 12px; }
.nl__accLabel{ font-weight:700; letter-spacing:.02em; }
.nl__accBody{ padding:8px 12px 12px; }
.nl__date :deep(.q-field__control){ border:1.2px solid var(--sepia-30); background:transparent!important; border-radius:8px; }
.nl__note{ margin:6px 2px 0; font-size:12px; opacity:.8; }
.nl__consent{ display:grid; grid-template-columns:auto 1fr; gap:8px; align-items:start; }
.nl__consentText{ text-transform:uppercase; letter-spacing:.06em; font-size:11px; }
.nl__link{ color:var(--sepia); text-decoration:underline; text-underline-offset:2px; }
.nl__msg{ margin-top:4px; font-size:13px; padding:8px 10px; border-radius:8px; }
.nl__msg.ok{ background:rgba(109,122,79,.14); }
.nl__msg.err{ background:rgba(201,126,99,.14); }
.fade-enter-active,.fade-leave-active{ transition:opacity .25s ease }
.fade-enter-from,.fade-leave-to{ opacity:0 }
@media (min-width:1024px){
  .nl__inner{ grid-template-columns:220px 1fr; gap:32px; }
  .nl__left{ display:block; }
  .nl__left svg{ width:180px; height:150px; }
  .nl__right{ justify-self:end; width:90%; }
}
</style>

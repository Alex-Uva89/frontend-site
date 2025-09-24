<template>
  <nav class="tv-menu-mobile" aria-label="Programmi">
    <!-- Pulsante toggle -->
    <button
      ref="btnRef"
      class="menu-trigger"
      type="button"
      aria-haspopup="menu"
      :aria-expanded="open"
      :aria-controls="menuId"
      @click="toggle()"
      @keydown.down.prevent="focusFirst()"
    >
      <span class="icon" aria-hidden="true">☰</span>
      <span class="label">Menu</span>
    </button>

    <!-- Tendina -->
    <transition name="fade-scale">
      <div
        v-show="open"
        class="dropdown"
        role="menu"
        :id="menuId"
        @keydown.esc.prevent.stop="close()"
      >
        <button
          v-for="(link, i) in programs"
          :key="link.to || link.href || i"
          ref="itemRefs"
          class="drop-item"
          type="button"
          role="menuitem"
          @click="go(link)"
          @keydown.down.prevent="focusNext(i)"
          @keydown.up.prevent="focusPrev(i)"
        >
          <span class="knum">{{ i+1 }}</span>
          <span class="klabel">{{ link.label }}</span>
        </button>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useDrawerStore } from 'src/stores/drawerStore'

const drawer = useDrawerStore()
const programs = computed(() => drawer.linksMobile ?? [])

const open = ref(false)
const btnRef = ref(null)
const itemRefs = ref([])
const menuId = 'tv-mobile-menu'

function toggle(){ open.value ? close() : openAndFocus() }
function openAndFocus(){
  open.value = true
  nextTick(() => { itemRefs.value?.[0]?.focus?.() })
}
function close(){
  open.value = false
  nextTick(() => { btnRef.value?.focus?.() })
}
function focusFirst(){ itemRefs.value?.[0]?.focus?.() }
function focusNext(i){ itemRefs.value?.[i+1]?.focus?.() ?? itemRefs.value?.[0]?.focus?.() }
function focusPrev(i){
  const last = itemRefs.value.length - 1
  itemRefs.value?.[i-1]?.focus?.() ?? itemRefs.value?.[last]?.focus?.()
}

const router = useRouter()
function go(link){
  if (!link) return
  close()
  if (link.href) window.open(link.href, '_blank', 'noopener')
  else if (link.to) router.push(link.to)
}

function onDocClick(e){
  const root = e.target.closest('.tv-menu-mobile')
  if (!root) close()
}
onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>

<style scoped>
/* Visibile solo su mobile */
.tv-menu-mobile{ display:none; }
@media (max-width:700px){
  .tv-menu-mobile{
    display:block;
    position: relative;
    z-index: 60;
    padding: 16px var(--tv-gap-x, 16px);
  }

  /* === TRIGGER GLASS (senza bordo) === */
  .menu-trigger{
    --glass-bg: rgba(28,28,28,.45);
    --glass-hi: rgba(255,255,255,.40);
    position: relative;
    display:inline-flex; align-items:center; gap:.6rem;
    padding: .7rem 1rem;
    border: none;                    /* niente cornice */
    outline: none; border-radius: 12px;
    background:
      linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,0) 40%),
      var(--glass-bg);
    backdrop-filter: blur(8px) saturate(1.1);
    -webkit-backdrop-filter: blur(8px) saturate(1.1);
    color: #f3f3f3; font-weight: 800; letter-spacing:.01em;
    box-shadow:
      inset 0 1px 0 var(--glass-hi),          /* highlight alto */
      0 10px 20px rgba(0,0,0,.35);            /* ombra sotto */
    cursor: pointer;
  }
  /* ombre laterali senza bordo */
  .menu-trigger::before,
  .menu-trigger::after{
    content:""; position:absolute; top:6px; bottom:6px; width:10px; border-radius:10px;
    pointer-events:none;
  }
  .menu-trigger::before{ left:0;  background:linear-gradient(90deg, rgba(0,0,0,.28), rgba(0,0,0,0)); }
  .menu-trigger::after { right:0; background:linear-gradient(270deg, rgba(0,0,0,.28), rgba(0,0,0,0)); }

  .menu-trigger:focus-visible{ outline: 2px solid #ffd76a; outline-offset: 3px; }
  .menu-trigger .icon{ font-size: 1.15rem; line-height:1; }
  .menu-trigger .label{ text-transform: uppercase; }

  /* === DROPDOWN GLASS (senza bordo, ombre ai lati) === */
  .dropdown{
    --glass-panel: rgba(16,16,16,.48);
    position: absolute;
    top: calc(100% + 8px);
    left: 0; right: 0;
    border: none;                      /* niente cornice */
    border-radius: 16px;
    background:
      radial-gradient(120% 160% at 50% 0%, rgba(255,255,255,.12), rgba(255,255,255,0) 60%),
      var(--glass-panel);
    box-shadow:
      0 16px 28px rgba(0,0,0,.38),     /* ombra globale */
      inset 0 1px 0 rgba(255,255,255,.12); /* highlight interno alto */
    backdrop-filter: blur(12px) saturate(1.08);
    -webkit-backdrop-filter: blur(12px) saturate(1.08);
    padding: 10px;
    display:grid;
    grid-auto-rows: minmax(54px, auto);
    gap: 10px;
  }
  /* gradienti laterali per “cornice” senza bordo */
  .dropdown::before,
  .dropdown::after{
    content:""; position:absolute; top:6px; bottom:6px; width:14px; border-radius:14px;
    pointer-events:none;
  }
  .dropdown::before{ left:0;  background:linear-gradient(90deg, rgba(0,0,0,.28), rgba(0,0,0,0)); }
  .dropdown::after { right:0; background:linear-gradient(270deg, rgba(0,0,0,.28), rgba(0,0,0,0)); }

  /* === VOCI GLASS (senza bordo, ombre ai lati) === */
  .drop-item{
    --glass-btn: rgba(32,32,32,.42);
    --glass-hi:  rgba(255,255,255,.45);
    position: relative;
    display:grid;
    grid-template-columns: 52px 1fr;
    align-items:center;
    gap:12px;

    width: 100%;
    min-height: 56px;
    padding: 12px 14px;
    border: none;                    /* niente cornice */
    border-radius: 14px;
    background:
      linear-gradient(180deg, rgba(255,255,255,.14), rgba(255,255,255,0) 48%),
      var(--glass-btn);
    backdrop-filter: blur(10px) saturate(1.05);
    -webkit-backdrop-filter: blur(10px) saturate(1.05);

    color:#eaeaea; font-weight:800; letter-spacing:.02em;
    text-align:left;
    box-shadow:
      inset 0 1px 0 var(--glass-hi),         /* highlight alto */
      inset 0 -10px 18px rgba(0,0,0,.28),    /* ombra interna bassa */
      0 10px 18px rgba(0,0,0,.28);           /* ombra esterna */
    transition: transform .06s ease, filter .18s ease, box-shadow .18s ease;
  }
  /* riflesso diagonale */
  .drop-item::after{
    content:""; position:absolute; top:8%; left:10%; width:60%; height:46%;
    border-radius: 100% 100% 60% 60%;
    background: radial-gradient(ellipse at 30% 20%, rgba(255,255,255,.38), rgba(255,255,255,0) 60%);
    pointer-events:none; opacity:.55; filter: blur(.3px);
  }
  /* ombre laterali dedicate */
  .drop-item::before{
    content:""; position:absolute; top:6px; bottom:6px; left:0; width:12px; border-radius:12px;
    background:linear-gradient(90deg, rgba(0,0,0,.22), rgba(0,0,0,0));
    pointer-events:none;
  }
  .drop-item:hover{
    filter: brightness(1.06) saturate(1.03);
    box-shadow:
      inset 0 1px 0 var(--glass-hi),
      inset 0 -10px 18px rgba(0,0,0,.34),
      0 12px 22px rgba(0,0,0,.36);
  }
  .drop-item:active{ transform: translateY(1px); }
  .drop-item:focus-visible{ outline: 2px solid #9cf2b8; outline-offset: 2px; }

  /* Numero: pill digitale (senza bordo) */
  .knum{
    display:grid; place-items:center;
    height: 36px; min-width: 44px; padding: 0 8px;
    border-radius: 999px;
    border: none; /* niente cornice */
    background:
      linear-gradient(180deg, rgba(255,255,255,.22), rgba(255,255,255,0) 50%),
      rgba(0,0,0,.35);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.25),
      inset 0 -6px 10px rgba(0,0,0,.35),
      0 0 12px rgba(120,255,180,.25);
    color:#b8ffd4;
    text-shadow:
      0 0 2px currentColor,
      0 0 8px rgba(120,255,180,.5);
    font-variant-numeric: tabular-nums;
    font-weight: 900;
    letter-spacing:.04em;
  }

  /* Etichetta */
  .klabel{
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    color:#dcffe9;
    text-shadow:
      0 0 2px rgba(180,255,210,.6),
      0 0 10px rgba(120,255,180,.45);
    font-weight: 800;
    letter-spacing:.03em;
  }

  /* Animazione comparsa */
  .fade-scale-enter-active, .fade-scale-leave-active{
    transition: opacity .18s ease, transform .18s cubic-bezier(.2,.7,.2,1);
    transform-origin: top center;
  }
  .fade-scale-enter-from, .fade-scale-leave-to{
    opacity: 0; transform: scale(.98) translateY(-6px);
  }

  /* Riduci motion */
  @media (prefers-reduced-motion: reduce){
    .fade-scale-enter-active, .fade-scale-leave-active{
      transition: opacity .14s linear;
    }
    .fade-scale-enter-from, .fade-scale-leave-to{
      transform: none;
    }
  }
}
</style>

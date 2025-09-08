<template>
  <q-page class="our-story q-pa-none">
    <!-- HERO -->
    <HeroImage
      :images="heroImg"
      title="La nostra storia"
      subtitle="E la storia di una squadra"
      content-bottom="10vh"
      align="left"
    />

    <div class="wrap">
      <!-- STORIA -->
      <section id="storia" class="story">
        <header class="story__head">
          <h2 class="story__title">{{ $t('ourstory.heading', 'Come siamo diventati Mamma Elvira') }}</h2>
          <p class="story__lead">
            {{
              $t(
                'ourstory.lead',
                'Una cucina che nasce in famiglia e cresce con la città: pochi ingredienti, tanta memoria, gesti semplici e veri.'
              )
            }}
          </p>
        </header>

        <div class="story__grid">
          <article class="story__text">
            <p>
              {{
                $t(
                  'ourstory.p1',
                  'All’inizio eravamo un tavolo grande e una voglia ostinata di far parlare i piatti. La pasta tirata a mano, il pane vivo, il vino di chi la terra la conosce per nome.'
                )
              }}
            </p>
            <p>
              {{
                $t(
                  'ourstory.p2',
                  'Poi sono arrivati gli amici, i vicini, i viaggiatori. La cucina è rimasta onesta, il servizio più attento, le sale più luminose. La pietra leccese ha tenuto insieme tutto.'
                )
              }}
            </p>
            <blockquote class="quote">
              <p>“{{ $t('ourstory.quote', 'Eleganza è togliere, non aggiungere.') }}”</p>
              <cite>— {{ $t('ourstory.quoteAuthor', 'La Brigata') }}</cite>
            </blockquote>
          </article>

          <!-- TIMELINE SEMPLICE -->
          <aside class="story__timeline" aria-label="Timeline">
            <ul>
              <li>
                <span class="dot" aria-hidden="true"></span>
                <div>
                  <h3>2012</h3>
                  <p>{{ $t('ourstory.tl2012', 'Si accendono i fuochi della prima Osteria.') }}</p>
                </div>
              </li>
              <li>
                <span class="dot" aria-hidden="true"></span>
                <div>
                  <h3>2016</h3>
                  <p>{{ $t('ourstory.tl2016', 'Arriva l’Enoteca: bottiglie che raccontano storie.') }}</p>
                </div>
              </li>
              <li>
                <span class="dot" aria-hidden="true"></span>
                <div>
                  <h3>2019</h3>
                  <p>{{ $t('ourstory.tl2019', 'Nasce il Ristorante: tecnica e memoria nel piatto.') }}</p>
                </div>
              </li>
              <li>
                <span class="dot" aria-hidden="true"></span>
                <div>
                  <h3>2022</h3>
                  <p>{{ $t('ourstory.tl2022', 'La Pizzeria completa la famiglia. Forno vivo, impasti maturi.') }}</p>
                </div>
              </li>
            </ul>
          </aside>

          <!-- MOSAICO IMMAGINI -->
          <div class="story__mosaic" aria-hidden="true">
            <img src="https://picsum.photos/seed/mamma-1/800/1000" alt="" loading="lazy">
            <img src="https://picsum.photos/seed/mamma-2/800/800" alt="" loading="lazy">
            <img src="https://picsum.photos/seed/mamma-3/800/900" alt="" loading="lazy">
            <img src="https://picsum.photos/seed/mamma-4/800/1100" alt="" loading="lazy">
          </div>
        </div>
      </section>

      <!-- TEAM / LAVORA CON NOI -->
      <section class="team" aria-labelledby="team-title">
        <header class="team__head">
          <h2 id="team-title">{{ $t('jobs.join', 'Unisciti al team di Mamma Elvira') }}</h2>
          <p class="team__lead">
            {{
              $t(
                'jobs.lead',
                'Cerchiamo persone curiose, gentili e concrete. Se ti piacciono le mani in pasta e i dettagli in sala, ci piacerà conoscerti.'
              )
            }}
          </p>
          <div class="team__cta">
            <q-btn no-caps class="btn primary" :label="$t('jobs.openings','Posizioni aperte')" to="/jobs" />
            <q-btn no-caps outline class="btn ghost" :label="$t('jobs.email','Scrivici')" href="mailto:jobs@mammaelvira.example" />
          </div>
        </header>

        <ul class="roles">
          <li class="role">
            <h3 class="role__title">{{ $t('jobs.kitchen','Cucina') }}</h3>
            <p class="role__desc">{{ $t('jobs.kitchenDesc','Pasta fresca, linea, pass: team unito e tempi giusti.') }}</p>
          </li>
          <li class="role">
            <h3 class="role__title">{{ $t('jobs.pizza','Pizzeria') }}</h3>
            <p class="role__desc">{{ $t('jobs.pizzaDesc','Impasti a lunga maturazione, forno vivo, servizio calibrato.') }}</p>
          </li>
          <li class="role">
            <h3 class="role__title">{{ $t('jobs.floor','Sala') }}</h3>
            <p class="role__desc">{{ $t('jobs.floorDesc','Accoglienza, ritmo e attenzione: far sentire a casa.') }}</p>
          </li>
          <li class="role">
            <h3 class="role__title">{{ $t('jobs.sommelier','Vino') }}</h3>
            <p class="role__desc">{{ $t('jobs.sommelierDesc','Enoteca viva, piccoli produttori, storytelling sincero.') }}</p>
          </li>
          <li class="role">
            <h3 class="role__title">{{ $t('jobs.pastry','Pasticceria') }}</h3>
            <p class="role__desc">{{ $t('jobs.pastryDesc','Dolci essenziali, ingredienti puliti, stagioni nel piatto.') }}</p>
          </li>
          <li class="role">
            <h3 class="role__title">{{ $t('jobs.stage','Stage') }}</h3>
            <p class="role__desc">{{ $t('jobs.stageDesc','Percorsi formativi in cucina e sala: imparare facendo.') }}</p>
          </li>
        </ul>
      </section>
    </div>
  </q-page>
</template>

<script setup>
/* Hero image: puoi sostituire con un asset del progetto */
import HeroImage from 'src/components/HeroImage.vue';
const heroImg = 'https://picsum.photos/seed/lecce-stone/2400/1400'
</script>

<style scoped>
/* ====== Page base ====== */
.our-story{
  background: var(--stone-100, #efe6d3);
  color: var(--sepia-900, #2a2019);
}
.wrap{ width: min(94vw, 1100px); margin: 0 auto; padding: 28px 0 40px; }

/* ====== HERO (riuso del “nostro hero di sempre”) ====== */
.hero{
  position: relative;
  min-height: clamp(56vh, 64vh, 72vh);
  display: grid; place-items: center;
  background-size: cover; background-position: center;
  border-radius: 0 0 22px 22px; overflow: hidden;
}
.hero__veil{
  position:absolute; inset:0;
  background:
    linear-gradient(to bottom, rgba(0,0,0,.35), rgba(0,0,0,.10) 34%, rgba(0,0,0,.35)),
    radial-gradient(120% 90% at 12% 0%, rgba(201,126,99,.12), transparent 60%),
    radial-gradient(120% 100% at 88% 24%, rgba(142,160,115,.12), transparent 62%);
}
.hero__dream{
  position:absolute; inset:-3% -3%;
  -webkit-mask-image: radial-gradient(130% 110% at 50% 60%, #000 58%, rgba(0,0,0,0) 100%);
          mask-image: radial-gradient(130% 110% at 50% 60%, #000 58%, rgba(0,0,0,0) 100%);
  background: radial-gradient(120% 95% at 50% 60%, rgba(239,230,211,0) 55%, rgba(239,230,211,.65) 100%);
}
.hero__inner{
  position: relative; z-index: 1; text-align:center; padding: 0 16px; max-width: 950px;
  color: #fff; text-shadow: 0 2px 18px rgba(0,0,0,.34);
}
.hero__title{
  margin: 0; font-size: clamp(28px, 7.5vw, 60px); letter-spacing: -.01em; font-weight: 800;
}
.hero__subtitle{
  margin: 10px auto 18px; max-width: 52ch; opacity: .92; font-size: clamp(14px, 3.6vw, 18px);
}
.hero__cta{ display:flex; gap:10px; justify-content:center; flex-wrap:wrap; }
.btn.primary{ background:#c97e63; color:#f6f1e7; }
.btn.ghost{ border-color: rgba(255,255,255,.85); color:#fff; }

/* ====== STORIA ====== */
.story{ margin-top: 26px; }
.story__head{ margin-bottom: 14px; }
.story__title{ margin: 0 0 6px; font-size: clamp(20px, 4.8vw, 28px); letter-spacing:-.01em; }
.story__lead{ margin: 0; opacity: .8; font-size: clamp(13px, 3.4vw, 16px); }

.story__grid{
  display: grid; gap: 14px;
}
@media (min-width: 960px){
  .story__grid{
    grid-template-columns: 1.1fr .9fr; gap: 18px;
    align-items: start;
  }
}

.story__text p{ margin: 0 0 10px; line-height: 1.6; }
.quote{
  margin: 14px 0 0; padding: 12px 14px;
  border: 1px solid rgba(42,32,25,.14); border-radius: 12px;
  background: rgba(246,241,231,.65);
}

/* Timeline */
.story__timeline ul{ list-style: none; margin: 0; padding: 0; }
.story__timeline li{
  display: grid; grid-template-columns: 18px 1fr; gap: 10px; align-items: start;
  padding: 10px 0;
  border-bottom: 1px dashed rgba(42,32,25,.15);
}
.story__timeline li:last-child{ border-bottom: 0; }
.story__timeline h3{ margin: 0 0 4px; font-size: 14px; letter-spacing: .02em; }
.story__timeline p{ margin: 0; opacity: .8; font-size: 13px; }
.story__timeline .dot{
  width: 10px; height: 10px; border-radius: 50%;
  background: #c97e63; border: 2px solid #fff; outline: 2px solid #2a2019; margin-top: 4px;
}

/* Mosaico */
.story__mosaic{
  display: grid; grid-template-columns: repeat(2,1fr); gap: 8px;
}
.story__mosaic img{
  width: 100%; height: 100%; object-fit: cover; border-radius: 12px;
  box-shadow: 0 8px 28px rgba(0,0,0,.12);
}
@media (min-width: 960px){
  .story__mosaic{
    grid-column: 1 / -1;
    grid-template-columns: repeat(4,1fr);
  }
}

/* ====== TEAM ====== */
.team{
  margin-top: 28px; padding: 18px;
  background: var(--sand-800);
  border: 1px solid rgba(42,32,25,.12);
  border-radius: 18px;
  color: #efe6d3;
}
.team__head{ text-align: center; max-width: 800px; margin: 0 auto 12px; }
.team__lead{ margin: 6px auto 12px; opacity: .8; max-width: 60ch; }
.team__cta{ display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; color: var(--sand-800);}

.roles{
  list-style: none; margin: 18px 0 0; padding: 0;
  display: grid; gap: 10px;
  grid-template-columns: 1fr;
}
@media (min-width: 680px){
  .roles{ grid-template-columns: repeat(2,1fr); }
}
@media (min-width: 1024px){
  .roles{ grid-template-columns: repeat(3,1fr); }
}
.role{
  background: var(--sand-200);
  color: var(--sand-800);
  border: 1px solid rgba(42,32,25,.12);
  border-radius: 14px;
  padding: 12px;
  box-shadow: 0 12px 28px rgba(0,0,0,.06);
}
.role__title{ margin: 0 0 6px; font-size: 16px; }
.role__desc{ margin: 0; opacity: .8; font-size: 13px; }

/* Motion safe */
@media (prefers-reduced-motion: reduce){
  .hero__dream{ display:none; }
}
</style>

<template>
  <section class="section-frame">
    <!-- doppia riga sopra -->
    <div class="section-frame__rule" aria-hidden="true"></div>

    <!-- contenuto -->
    <div class="section-frame__slot">
      <slot />
    </div>

    <!-- doppia riga sotto -->
    <div class="section-frame__rule" aria-hidden="true"></div>
  </section>
</template>

<script setup>
// no props per ora; usa CSS vars se vuoi colori diversi per sezione
</script>

<style scoped>


.section-frame{
  background: var(--stone-100);
}

.section-frame__slot{
  /* nessun padding qui: lo fa la sezione interna (es. Newsletter) */
}

/* una “riga” che in realtà ne disegna due con background multipli */
.section-frame__rule{
  height: calc(var(--divider-gap) + var(--divider-thick) * 2);
  background:
    linear-gradient(var(--divider-color), var(--divider-color)) left calc(50% - var(--divider-gap)/2) / 100% var(--divider-thick) no-repeat,
    linear-gradient(var(--divider-color), var(--divider-color)) left calc(50% + var(--divider-gap)/2) / 100% var(--divider-thick) no-repeat;
}
</style>

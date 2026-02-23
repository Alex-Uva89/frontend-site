<template>
  <div class="tv-wrapper">
    <div class="tv-screen">
      <header>
        <h1>La nostra musica</h1>
        <p>Ascolta la playlist ufficiale direttamente qui!</p>
      </header>

      <main>
        <div class="player-container">
          <iframe src="https://open.spotify.com/embed/playlist/5YgmcneDRmcAMugXe66cBa?utm_source=generator" width="1000"
            height="400" frameborder="0" allowfullscreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        </div>
      </main>

      <footer>
        <p>Powered by Spotify • &copy; 2026</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
// Nessuna logica necessaria
</script>

<style scoped>
/* TV anni ’70 – cornice e sfondo */


/* Cornice del TV */
.tv-screen {
  background: #1e2a18;
  padding: 24px;
  border-radius: 16px;
  width: 100%;
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.5),
    inset 0 0 12px rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* Testata */
header h1 {
  font-size: clamp(2rem, 4vw, 3rem);
  margin-bottom: 0.3rem;
  color: #ffeaa7;
  /* giallo vintage */
}

header p {
  font-size: 1rem;
  margin-bottom: 1.5rem;
  color: #dcd0a1;
}

/* Player Spotify */
.player-container {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.5);
}

/* Footer */
footer {
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: #ccc2a3;
}
</style>

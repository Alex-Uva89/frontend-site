<template>
  <div class="tv-wrapper">
    <section class="tv">

      <header class="tv-header">
        <h1>La nostra musica</h1>
        <p>Ascolta la playlist ufficiale direttamente qui</p>
      </header>

      <div class="tv-screen">
        <div class="screen-glass"></div>

        <div class="player-container">
          <iframe src="https://open.spotify.com/embed/playlist/5YgmcneDRmcAMugXe66cBa" width="100%" height="400"
            frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"></iframe>
        </div>
      </div>

      <footer>
        <p>Powered by Spotify • © 2026</p>
      </footer>

    </section>
  </div>
</template>

<script setup>
// nessuna logica
</script>

<style scoped>
/* Wrapper */
.tv-wrapper {
  width: 100%;
  margin: auto;
}

/* Cornice TV in legno */
.tv {
  border-radius: 22px;
  padding: clamp(16px, 2.5vw, 26px);

  background:
    linear-gradient(135deg, rgba(255, 255, 255, .08), rgba(0, 0, 0, .25)),
    repeating-linear-gradient(90deg,
      #5a3a22 0px,
      #5a3a22 12px,
      #633f25 12px,
      #633f25 20px);

  box-shadow:
    0 25px 60px rgba(0, 0, 0, .6),
    inset 0 0 0 2px rgba(255, 255, 255, .08),
    inset 0 0 30px rgba(0, 0, 0, .35);

  text-align: center;
}

/* Titolo */
.tv-header h1 {
  font-size: clamp(1.8rem, 5vw, 2.8rem);
  margin-bottom: 6px;
  color: #ffeaa7;
  letter-spacing: .03em;
}

.tv-header p {
  color: #dcd0a1;
  margin-bottom: 18px;
  font-size: clamp(.9rem, 2.5vw, 1rem);
}

/* Schermo TV */
.tv-screen {
  position: relative;
  border-radius: 16px;
  padding: clamp(10px, 2vw, 16px);

  background:
    radial-gradient(circle at 20% 0%, rgba(255, 255, 255, .12), transparent 40%),
    radial-gradient(circle at 80% 100%, rgba(0, 0, 0, .35), transparent 50%),
    linear-gradient(180deg, #1c2816, #121b10);

  box-shadow:
    inset 0 0 0 2px rgba(255, 255, 255, .06),
    inset 0 0 30px rgba(0, 0, 0, .6),
    0 12px 30px rgba(0, 0, 0, .5);
}

/* Riflesso vetro CRT */
.screen-glass {
  position: absolute;
  inset: 8px;
  border-radius: 12px;
  pointer-events: none;

  background:
    linear-gradient(120deg, rgba(255, 255, 255, .18), transparent 35%),
    radial-gradient(circle at 25% 20%, rgba(255, 255, 255, .18), transparent 60%);

  mix-blend-mode: screen;
  opacity: .5;
}

/* Spotify container */
.player-container {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, .6);
}

/* Responsive iframe */
.player-container iframe {
  display: block;
  width: 100%;
  border: none;
  height: clamp(300px, 55vw, 420px);
}

/* Footer */
footer {
  margin-top: 16px;
  font-size: .85rem;
  color: #ccc2a3;
}
</style>

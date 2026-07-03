/* ============================================================
   GATE ANTEPRIMA — da RIMUOVERE al lancio del sito
   Protegge le pagine interne finché il sito non è pubblico:
   se manca il flag di sblocco, rimanda alla pagina "in arrivo".
   Per il lancio: vedi README → sezione "Go-live".
   ============================================================ */
(function () {
  if (localStorage.getItem("mavi_preview") !== "ok") {
    location.replace("index.html");
  }
})();

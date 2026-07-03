/* ============================================================
   EASTER EGG pagina "in arrivo"
   10 tap sul monogramma → modale password → sblocco anteprima.
   La password non è nel sorgente: viene confrontato solo
   l'hash SHA-256 (vedi README per cambiarla).
   ============================================================ */
(function () {
  var HASH = "b3a632f5e7f66c7a66efde7bdb16f32660dfd5abc38e57016ef99b2a9509e68b";
  var TAPS_NEEDED = 10;
  var TAP_WINDOW_MS = 4000; // i 10 tap devono avvenire entro 4 secondi

  var monogram = document.getElementById("monogram");
  var modal = document.getElementById("pwd-modal");
  var box = document.getElementById("pwd-box");
  var input = document.getElementById("pwd-input");
  var form = document.getElementById("pwd-form");
  var error = document.getElementById("pwd-error");

  // Se l'anteprima è già sbloccata su questo dispositivo, entra subito
  if (localStorage.getItem("mavi_preview") === "ok") {
    location.replace("home.html");
    return;
  }

  var taps = [];
  monogram.addEventListener("click", function () {
    var now = Date.now();
    taps.push(now);
    taps = taps.filter(function (t) { return now - t < TAP_WINDOW_MS; });
    if (taps.length >= TAPS_NEEDED) {
      taps = [];
      openModal();
    }
  });

  function openModal() {
    modal.classList.add("is-open");
    setTimeout(function () { input.focus(); }, 150);
  }

  function closeModal() {
    modal.classList.remove("is-open");
    input.value = "";
    error.textContent = "";
  }

  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var value = input.value.trim();
    if (!value) return;
    sha256(value).then(function (hex) {
      if (hex === HASH) {
        localStorage.setItem("mavi_preview", "ok");
        location.href = "home.html";
      } else {
        error.textContent = "Password non corretta";
        input.value = "";
        box.classList.remove("shake");
        void box.offsetWidth; // riavvia l'animazione
        box.classList.add("shake");
      }
    });
  });

  function sha256(text) {
    if (window.crypto && crypto.subtle) {
      return crypto.subtle.digest("SHA-256", new TextEncoder().encode(text))
        .then(function (buf) {
          return Array.prototype.map.call(new Uint8Array(buf), function (b) {
            return b.toString(16).padStart(2, "0");
          }).join("");
        });
    }
    // Fallback per contesti senza WebCrypto (es. file:// su alcuni browser):
    // apri il sito con un server locale, vedi README.
    return Promise.resolve("");
  }
})();

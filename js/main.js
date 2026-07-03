/* ============================================================
   Interazioni comuni a tutte le pagine interne:
   menu mobile, header su scroll, animazioni reveal,
   filtri portfolio, lightbox, banner anteprima.
   ============================================================ */
(function () {
  /* ----- Menu mobile ----- */
  var toggle = document.querySelector(".nav-toggle");
  var navList = document.querySelector(".nav-list");
  if (toggle && navList) {
    toggle.addEventListener("click", function () {
      var open = navList.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navList.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        navList.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ----- Header: bordo quando si scorre ----- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ----- Reveal on scroll ----- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ----- Filtri portfolio ----- */
  var filterBtns = document.querySelectorAll(".filters button");
  var galleryItems = document.querySelectorAll(".gallery-item");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      var cat = btn.dataset.filter;
      galleryItems.forEach(function (item) {
        item.style.display =
          cat === "all" || item.dataset.category === cat ? "" : "none";
      });
    });
  });

  /* ----- Lightbox ----- */
  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
    var lbImage = lightbox.querySelector(".lightbox-image");
    var lbCaption = lightbox.querySelector(".lightbox-caption");
    galleryItems.forEach(function (item) {
      item.addEventListener("click", function () {
        var ph = item.querySelector(".ph");
        // Con i placeholder replichiamo il gradiente; con le foto vere
        // qui si userà il tag <img> (vedi README).
        lbImage.className = "ph ph--portrait " +
          (ph.className.match(/ph--\d/) ? ph.className.match(/ph--\d/)[0] : "");
        lbImage.dataset.label = ph.dataset.label || "";
        var caption = item.querySelector("figcaption");
        lbCaption.textContent = caption ? caption.textContent : "";
        lightbox.classList.add("is-open");
      });
    });
    lightbox.querySelector(".lightbox-close").addEventListener("click", function () {
      lightbox.classList.remove("is-open");
    });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) lightbox.classList.remove("is-open");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") lightbox.classList.remove("is-open");
    });
  }

  /* ----- Slider Prima/Dopo ----- */
  document.querySelectorAll(".ba").forEach(function (ba) {
    var range = ba.querySelector('input[type="range"]');
    var update = function (pct) {
      ba.style.setProperty("--pos", pct + "%");
    };
    range.addEventListener("input", function () { update(range.value); });
    update(range.value);
  });

  /* ----- Bottone WhatsApp flottante ----- */
  // Numero unico per tutto il sito: cambiarlo qui e in contatti.html
  var WA_NUMBER = "390000000000";
  var wa = document.createElement("a");
  wa.className = "wa-float";
  wa.href = "https://wa.me/" + WA_NUMBER;
  wa.target = "_blank";
  wa.rel = "noopener";
  wa.setAttribute("aria-label", "Scrivimi su WhatsApp");
  wa.innerHTML = '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 3C9.4 3 4 8.3 4 14.9c0 2.6.8 5 2.3 7L4 29l7.3-2.3c1.9 1 3.9 1.5 4.7 1.5 6.6 0 12-5.3 12-11.9S22.6 3 16 3zm0 21.8c-1.6 0-3.2-.4-4.6-1.2l-.3-.2-4.3 1.4 1.4-4.2-.2-.3c-1.3-1.8-2-3.9-2-6.1C6 9.4 10.5 5 16 5s10 4.4 10 9.9-4.5 9.9-10 9.9zm5.5-7.4c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6-.1-.2-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.3z"/></svg>';
  document.body.appendChild(wa);

  /* ----- Banner "anteprima" (solo finché il gate è attivo) ----- */
  if (document.querySelector('script[src*="gate.js"]')) {
    var banner = document.createElement("div");
    banner.className = "preview-banner";
    banner.textContent = "Anteprima riservata — sito in costruzione";
    document.body.appendChild(banner);
  }
})();

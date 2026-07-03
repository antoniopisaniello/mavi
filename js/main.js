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

  /* ----- Banner "anteprima" (solo finché il gate è attivo) ----- */
  if (document.querySelector('script[src*="gate.js"]')) {
    var banner = document.createElement("div");
    banner.className = "preview-banner";
    banner.textContent = "Anteprima riservata — sito in costruzione";
    document.body.appendChild(banner);
  }
})();

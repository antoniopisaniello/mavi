# Mavi · Make Up Artist — Sito vetrina

Sito vetrina per una make up artist specializzata in **trucco sposa**.
Riferimento di stile: [fiammaalborghetti.com](https://fiammaalborghetti.com) — estetica minimale ed elegante, palette avorio/rosa antico, tipografia serif raffinata.

> **Stato attuale: IN COSTRUZIONE** — è attiva la pagina "in arrivo" con anteprima protetta da password (vedi sotto).

## Stack

Sito **statico puro**: HTML + CSS + JS vanilla, **nessun build step**, nessuna dipendenza da installare. Si apre e si deploya così com'è (GitHub Pages, Netlify, hosting FTP classico...).

Font da Google Fonts: **Cormorant Garamond** (titoli) + **Jost** (testo).

## Struttura

```
├── index.html          → pagina "in arrivo" (coming soon) + easter egg
├── home.html           → homepage vera del sito
├── portfolio.html      → galleria lavori con filtri (sposa/cerimonia/eventi) e lightbox
├── servizi.html        → servizi offerti + "come funziona"
├── chi-sono.html       → biografia + timeline studi/formazione
├── contatti.html       → contatti + form
├── css/style.css       → unico foglio di stile (design tokens in :root)
├── js/gate.js          → protezione anteprima (da rimuovere al go-live)
├── js/unlock.js        → easter egg della pagina in arrivo
├── js/main.js          → menu mobile, animazioni, filtri portfolio, lightbox
└── img/                → foto (per ora vuota, ci sono placeholder CSS)
```

## Anteprima riservata (easter egg)

Per mostrare il sito alla cliente mentre è ancora "in arrivo":

1. Aprire `index.html` (la pagina "in arrivo")
2. **Toccare/cliccare 10 volte il monogramma "M"** nel cerchio (entro 4 secondi)
3. Si apre la modale password → inserire: **`mavi2026`**
4. Lo sblocco viene salvato sul dispositivo (localStorage): le visite successive vanno dirette al sito

Per "bloccare" di nuovo un dispositivo: console del browser → `localStorage.removeItem('mavi_preview')`.

### Cambiare la password

La password non è nel codice: c'è solo il suo hash SHA-256 in `js/unlock.js` (costante `HASH`).
Per cambiarla, generare il nuovo hash (PowerShell):

```powershell
$p="nuovapassword"; $s=[Security.Cryptography.SHA256]::Create(); (($s.ComputeHash([Text.Encoding]::UTF8.GetBytes($p))) | % { $_.ToString("x2") }) -join ""
```

e sostituire il valore di `HASH` in `js/unlock.js`. Aggiornare anche questo README.

## Sviluppo in locale

Nessuna installazione richiesta. Consigliato un server locale (per WebCrypto e i font):

```powershell
# dalla cartella del progetto (serve Python) — poi aprire http://localhost:8000
python -m http.server 8000
```

In alternativa: estensione "Live Server" di VS Code, o `npx serve`.

## Go-live (quando il sito sarà pronto)

1. Eliminare la riga `<script src="js/gate.js"></script>` da **tutte** le pagine interne (home, portfolio, servizi, chi-sono, contatti)
2. Rinominare: `index.html` → `coming-soon.html` (o eliminarla) e `home.html` → `index.html`
3. Aggiornare i link `home.html` → `index.html` (o `/`) in header/brand di tutte le pagine
4. Rimuovere `<meta name="robots" content="noindex">` e `js/unlock.js`, `js/gate.js`
5. Il banner "Anteprima riservata" sparisce da solo (è iniettato da `main.js` solo se `gate.js` è presente)

## Cose da fare / decidere

- [ ] **Confermare il nome/brand**: per ora uso "Mavi" (dal nome della cartella) — da verificare
- [ ] Testi veri: biografia, studi/formazione (timeline in `chi-sono.html` è segnaposto), numeri reali nella sezione stats della home
- [ ] Contatti reali: email, telefono/WhatsApp, Instagram, città (segnaposto `info@example.com` / `@mavi.makeup` sparsi in tutte le pagine)
- [ ] **Foto vere del portfolio**: mettere i file in `img/` e sostituire i `<div class="ph ...">` con `<img src="img/..." alt="..." loading="lazy">` (istruzioni nei commenti di `portfolio.html`); adattare la lightbox in `main.js` per usare le immagini vere
- [ ] Form contatti: ora è `mailto:` — valutare [Formspree](https://formspree.io) (gratis fino a 50 invii/mese, basta cambiare `action` del form)
- [ ] Favicon + immagine og per condivisioni social
- [ ] Eventuali pagine extra proposte: **recensioni/testimonianze**, **FAQ** (domande tipiche delle spose), **gift card**, versione **EN**
- [ ] Privacy policy / cookie (i Google Fonts sono caricati da CDN: per il GDPR valutare self-hosting dei font)
- [ ] Deploy: collegare repo remota e hosting sul dominio della cliente

## Diario di lavoro

- **2026-07-03** — Prima versione completa: struttura del sito (6 pagine), design system, pagina "in arrivo" con easter egg (10 tap → password), gate di anteprima, placeholder per foto e testi.

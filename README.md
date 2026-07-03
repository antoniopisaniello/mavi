# Mavi · Make Up Artist — Sito vetrina

Sito vetrina per una make up artist specializzata in **trucco sposa**.
Riferimento di stile: [fiammaalborghetti.com](https://fiammaalborghetti.com) — estetica minimale ed elegante, palette avorio/rosa antico, tipografia serif raffinata.

> **Stato attuale: IN COSTRUZIONE** — è attiva la pagina "in arrivo" con anteprima protetta da password (vedi sotto).

## Stack

Sito **statico puro**: HTML + CSS + JS vanilla, **nessun build step**, nessuna dipendenza da installare. Si apre e si deploya così com'è (GitHub Pages, Netlify, hosting FTP classico...).

Font **self-hosted** (GDPR-friendly, nessuna chiamata a Google): **Cormorant Garamond** (titoli) + **Jost** (testo), file woff2 in `fonts/`, dichiarazioni in `css/fonts.css`.

## Struttura

```
├── index.html          → pagina "in arrivo" (coming soon) + easter egg
├── home.html           → homepage: hero, intro, numeri, portfolio, testimonianze, Instagram
├── portfolio.html      → galleria con filtri (sposa/cerimonia/eventi), lightbox, prima/dopo
├── servizi.html        → servizi offerti + "come funziona"
├── faq.html            → domande frequenti (accordion)
├── chi-sono.html       → biografia + timeline studi/formazione
├── contatti.html       → contatti + form
├── privacy.html        → informativa privacy (bozza, completare titolare)
├── robots.txt          → ora blocca tutto; da sostituire al go-live
├── sitemap.xml         → pronta per il go-live
├── css/fonts.css       → @font-face dei font self-hosted
├── css/style.css       → unico foglio di stile (design tokens in :root)
├── fonts/              → woff2 self-hosted (Cormorant Garamond + Jost)
├── js/gate.js          → protezione anteprima (da rimuovere al go-live)
├── js/unlock.js        → easter egg della pagina in arrivo
├── js/main.js          → menu, animazioni, filtri, lightbox, prima/dopo, bottone WhatsApp
└── img/                → favicon.svg, og-image.png, apple-touch-icon.png + foto (in arrivo)
```

Il numero WhatsApp del bottone flottante è la costante `WA_NUMBER` in `js/main.js`
(va aggiornato anche il link in `contatti.html`).

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

## Deploy automatico su SiteGround (CI)

A ogni push su `main`, GitHub Actions carica il sito su SiteGround via FTPS
(workflow: `.github/workflows/deploy.yml`, azione [SamKirkland/FTP-Deploy-Action](https://github.com/SamKirkland/FTP-Deploy-Action)).
Vengono esclusi i file di sviluppo (`.github/`, `.claude/`, `README.md`).

### Setup iniziale (da fare una sola volta)

1. **Repo GitHub** — crea una repo (anche privata, es. `mavi-sito`) su [github.com/new](https://github.com/new), senza README/gitignore iniziali, poi dalla cartella del progetto:
   ```powershell
   git remote add origin https://github.com/<tuo-utente>/mavi-sito.git
   git push -u origin main
   ```
2. **Account FTP su SiteGround** — Site Tools → **Devs → FTP Accounts Manager** → Create.
   L'account attuale è `deploy@mavimakeup.it` con **Percorso Home `/mavimakeup.it/public_html`**
   (la root del sito): il workflow carica quindi in `server-dir: ./`.
   ⚠️ Se il Percorso Home dell'account cambia, va adeguato `server-dir`
   in `.github/workflows/deploy.yml` — le due cose si sommano.
3. **Secret su GitHub** — repo → Settings → Secrets and variables → **Actions** → New repository secret (×3):
   | Secret | Valore |
   |---|---|
   | `FTP_SERVER` | hostname FTP (es. `tuodominio.it`) |
   | `FTP_USERNAME` | utente FTP completo (es. `deploy@tuodominio.it`) |
   | `FTP_PASSWORD` | password dell'account FTP |
4. **Primo deploy** — push su `main` (o tab Actions → "Deploy su SiteGround" → Run workflow). Il primo giro carica tutto; i successivi sono incrementali (solo i file cambiati).

Nota: finché il gate è attivo, chi visita il dominio vede la pagina "in arrivo" — perfetto per lavorare col sito già online. `noindex` evita che Google indicizzi la versione provvisoria.

### Lavorare da un altro PC

```powershell
git clone https://github.com/<tuo-utente>/mavi-sito.git
cd mavi-sito
git config user.email "antoniopis2000@gmail.com"   # email personale per i commit
```

## Go-live (quando il sito sarà pronto)

1. Eliminare la riga `<script src="js/gate.js"></script>` da **tutte** le pagine interne (home, portfolio, servizi, faq, chi-sono, contatti, privacy)
2. Rinominare: `index.html` → `coming-soon.html` (o eliminarla) e `home.html` → `index.html`
3. Aggiornare i link `home.html` → `index.html` (o `/`) in header/brand di tutte le pagine
4. Rimuovere `<meta name="robots" content="noindex">` e `js/unlock.js`, `js/gate.js`
5. Il banner "Anteprima riservata" sparisce da solo (è iniettato da `main.js` solo se `gate.js` è presente)
6. Sostituire il contenuto di `robots.txt` con:
   ```
   User-agent: *
   Allow: /
   Sitemap: https://mavimakeup.it/sitemap.xml
   ```
7. Completare `privacy.html` con i dati del titolare e farla verificare
8. Registrare/aggiornare il **Google Business Profile** di Mavi e inviare la sitemap
   da Google Search Console

## Cose da fare / decidere

Contenuti (servono a Mavi):
- [ ] Testi veri: biografia, studi/formazione (timeline in `chi-sono.html` è segnaposto), numeri reali nella sezione stats della home
- [ ] **Testimonianze vere** al posto delle 3 di esempio in `home.html` (idealmente da recensioni Google)
- [ ] Contatti reali: email, **numero WhatsApp** (`WA_NUMBER` in `js/main.js` + link in `contatti.html`), Instagram, città (segnaposto `info@example.com` / `@mavi.makeup` sparsi ovunque)
- [ ] **Foto vere**: portfolio (sostituire i `<div class="ph ...">` con `<img>`, istruzioni nei commenti di `portfolio.html`), coppie prima/dopo, ritratti in home e chi-sono, riquadri Instagram in home; adattare la lightbox in `main.js`
- [ ] FAQ di `faq.html`: risposte tipiche del settore, da far validare a Mavi
- [ ] Dati del titolare in `privacy.html`

Tecnica:
- [ ] Form contatti: ora è `mailto:` — valutare [Formspree](https://formspree.io) (gratis fino a 50 invii/mese, basta cambiare `action` del form)
- [ ] SEO locale quando c'è la città: aggiungerla nei title/description e nel JSON-LD in `home.html`
- [ ] og-image attuale generata al volo: rifarla con una foto vera quando disponibile
- [ ] Idee future: gift card, versione EN, feed Instagram automatico (es. SnapWidget/Elfsight al posto dei riquadri statici)

Fatte:
- [x] Favicon + og-image + apple-touch-icon
- [x] Font self-hosted (GDPR)
- [x] Privacy policy (bozza), robots.txt, sitemap.xml
- [x] FAQ, testimonianze, prima/dopo, bottone WhatsApp, striscia Instagram
- [x] Deploy CI su SiteGround

## Diario di lavoro

- **2026-07-03** — Prima versione completa: struttura del sito (6 pagine), design system, pagina "in arrivo" con easter egg (10 tap → password), gate di anteprima, placeholder per foto e testi.
- **2026-07-03** — Setup CI: workflow GitHub Actions per deploy FTPS su SiteGround (`.github/workflows/deploy.yml`), `.gitignore`, email personale configurata per i commit della repo. Manca solo: repo GitHub remota + account FTP + secret.
- **2026-07-03** — Deploy attivo su `mavimakeup.it` (repo: `antoniopisaniello/mavi`). Un po' di ping-pong iniziale: primo deploy nella radice hosting (Percorso Home `/`), poi percorso duplicato (`public_html/mavimakeup.it/public_html`) perché Percorso Home e `server-dir` erano stati cambiati entrambi. Assetto finale: **Percorso Home dell'account FTP = `/mavimakeup.it/public_html`, `server-dir = ./`**. Pulizia manuale dal File Manager dei file finiti nei posti sbagliati.
- **2026-07-03** — Fix menu mobile (burger a destra, overlay a schermo intero: il `backdrop-filter` sull'header ne faceva il containing block della nav fixed).
- **2026-07-03** — Pacchetto migliorie: testimonianze in home (esempi), striscia Instagram, bottone WhatsApp flottante, pagina FAQ, slider prima/dopo nel portfolio, favicon + og-image + apple-touch-icon, font self-hosted (GDPR), privacy policy (bozza), robots.txt (chiuso fino al go-live) e sitemap.xml.

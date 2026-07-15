# Report SEO, Local SEO e AEO

Data intervento: 15 luglio 2026.

## Stato iniziale

Il progetto disponeva già di una homepage React 18 con SSR/prerender personalizzato, un singolo oggetto `Restaurant` JSON-LD, canonical e social metadata nel template, una sitemap con la sola homepage, un `robots.txt` generato in build e contenuti principali renderizzati lato server. La base visiva era accessibile tramite markup semantico, immagini con alt text e animazioni GSAP con una prima gestione di `prefers-reduced-motion`.

I principali limiti iniziali erano: una sola route reale, metadata condivisi nel template, dati aziendali duplicati, URL di sviluppo ammesso in produzione, sitemap limitata, assenza di menu/FAQ/contatti prerenderizzati, video secondario caricato subito, informazioni non verificate mostrate come stato provvisorio e assenza di controlli automatici SEO.

## Modifiche effettuate

- Centralizzati dati aziendali, menu editoriale, FAQ e recensioni in `src/data/`.
- Creati catalogo route, metadata univoci e generatore JSON-LD `@graph` in `src/seo/`.
- Esteso `render(pathname)` e il prerender a homepage, menu, FAQ, contatti, privacy e 404.
- Aggiunte vere pagine HTML con un solo H1, breadcrumb, contenuti testuali e link interni normali.
- Resa esplicita in hero e nella prima sezione l’offerta “ristorante di pesce e pizzeria a Ostia centro”.
- Creato il menu testuale come anteprima editoriale; prezzi e allergeni sono omessi perché non verificati.
- Aggiunte FAQ visibili su homepage e pagina dedicata, con `FAQPage` coerente.
- Implementati `Restaurant`, `WebSite`, `WebPage`, `BreadcrumbList`, `Menu`, `MenuSection` e `MenuItem` senza rating aggregati o proprietà non verificate.
- Generati automaticamente robots, sitemap con `lastmod` e manifest dalla configurazione di build.
- Consentito `OAI-SearchBot` e bloccato `GPTBot` in modo conservativo.
- Resa obbligatoria `VITE_SITE_URL` HTTPS in produzione.
- Consentito temporaneamente un origin `*.netlify.app` configurato esplicitamente quando il dominio personalizzato non è ancora disponibile; il passaggio al dominio definitivo resta un'attività obbligatoria prima del lancio SEO.
- Mantenuta la 404 statica senza redirect catch-all verso la homepage.
- Implementati poster LCP, asset responsive, dimensioni immagini, caricamento progressivo hero, caricamento differito del video visita, risparmio dati e riduzione movimento.
- Aggiunto adapter analytics inattivo per gli eventi di conversione richiesti.
- Aggiunti controlli automatici SEO, dati strutturati, HTML senza JavaScript, user agent crawler, overflow, errori runtime e status 404.
- Aggiunta documentazione operativa per dominio, Local SEO, motori di ricerca e validazione esterna.

## Dati ancora richiesti dal proprietario

- Dominio definitivo e scelta tra `www` e apex.
- Orari ufficiali.
- Coordinate geografiche.
- Menu completo, prezzi, allergeni e data di validità.
- Fascia di prezzo o spesa media.
- URL esatto Google Business Profile.
- Profili social ufficiali.
- Informazioni verificate sull’accessibilità.
- Metodi di pagamento.
- Asporto e/o consegna.
- Opzioni vegetariane e senza glutine.
- Servizio o URL ufficiale di prenotazione, se diverso dal telefono.
- Dati completi del titolare per finalizzare la privacy policy.

L’elenco operativo completo è in `SEO-AEO-DATA-REQUIRED.md`.

## Validazioni

Validazione eseguita il 15 luglio 2026 su Windows, Node.js `v24.16.0`, npm `11.13.0`, con canonical tecnico di audit `https://goldenitaly.example` e `SEO_LASTMOD=2026-07-15` (valore temporaneo dell’ambiente di test, non configurazione destinata al deploy):

- `npm run validate`: completato senza errori.
- TypeScript `tsc -b --pretty false`: completato senza errori.
- Build Vite client e SSR, seguita dal prerender: completata; 5 route indicizzabili più `404.html` generate.
- `seo:check`: 5 route, metadata univoci, canonical HTTPS, link interni e NAP coerenti.
- `structured-data:check`: 6 documenti prerenderizzati analizzati; JSON valido, proprietà visibili e assenza di dati non verificati.
- `prerender:check`: Googlebot, Bingbot, OAI-SearchBot e browser normale ricevono HTML significativo anche senza JavaScript; controlli desktop `1440×1000` e mobile `390×844` senza overflow o errori JavaScript; animazioni decorative ridotte con `prefers-reduced-motion`; URL inesistenti e `/404.html` con status 404 nel server statico di test.
- Verificato che il video della sezione visita non venga richiesto durante il caricamento iniziale.
- Test negativo della build senza `VITE_SITE_URL`: fallimento atteso e confermato con messaggio esplicito.
- `git diff --check`: nessun errore di whitespace.

Non sono stati eseguiti né simulati punteggi Lighthouse/PageSpeed, Rich Results Test, Schema.org Validator o URL Inspection: richiedono la versione pubblica sul dominio definitivo. Le condizioni operative sono in `SEO-VALIDATION-CHECKLIST.md`.

## Attività esterne

Restano da completare: verifica e allineamento Google Business Profile, Tripadvisor, Bing Places e Apple Business Connect; configurazione del dominio e di Search Console/Bing Webmaster Tools; invio sitemap; verifica Rich Results/Schema.org/PageSpeed sulla versione pubblica; controllo dei log per OAI-SearchBot; monitoraggio di Core Web Vitals e conversioni dopo un’eventuale configurazione analytics conforme.

# Checklist di validazione esterna

Eseguire questi controlli sulla versione pubblica. Non riportare risultati finché il servizio esterno non li ha realmente prodotti.

## Prima dei validator

- [ ] Tutte le route pubbliche rispondono 200 in HTTPS.
- [ ] Un URL inesistente risponde 404.
- [ ] Canonical, Open Graph, Twitter Card e sitemap usano un solo hostname.
- [ ] Il sorgente HTML contiene H1, testo principale, menu, FAQ e contatti senza attendere JavaScript.
- [ ] Il NAP corrisponde agli account proprietari.

## Dati strutturati

- [ ] Testare homepage, menu e FAQ nel [Google Rich Results Test](https://search.google.com/test/rich-results).
- [ ] Testare gli stessi URL nello [Schema.org Validator](https://validator.schema.org/).
- [ ] Confermare che non compaiano rating aggregati, coordinate, orari, prezzi o servizi non verificati.
- [ ] Confermare che MenuItem e FAQ corrispondano parola per parola ai contenuti visibili pertinenti.

## Indicizzazione

- [ ] Usare URL Inspection di Search Console su homepage, menu, FAQ e contatti.
- [ ] Verificare pagina recuperata, canonical dichiarato e canonical selezionato.
- [ ] Inviare la sitemap e annotare eventuali errori reali.

## Prestazioni e accessibilità

- [ ] Testare homepage e menu con PageSpeed Insights mobile e desktop.
- [ ] Registrare data, URL, dispositivo, condizioni e punteggi effettivi.
- [ ] Verificare LCP, CLS e INP sui dati reali quando disponibili.
- [ ] Eseguire un controllo tastiera, zoom 200%, contrasto su video e screen reader.
- [ ] Verificare `prefers-reduced-motion` e una connessione con risparmio dati su dispositivo reale.


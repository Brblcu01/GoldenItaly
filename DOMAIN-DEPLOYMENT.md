# Dominio e deployment Netlify

Il repository non contiene un dominio definitivo hardcoded. La build di produzione richiede `VITE_SITE_URL` e fallisce se il valore manca, usa HTTP, contiene un hostname locale o termina con `/`.

## 1. Scegliere l’hostname canonico

Decidere una sola variante:

- `https://dominio.it`
- `https://www.dominio.it`

La scelta deve essere approvata dopo l’acquisto del dominio. Con DNS esterno Netlify raccomanda generalmente `www` come dominio primario; con Netlify DNS è possibile usare con semplicità anche il dominio apex. Quando apex e `www` sono assegnati allo stesso sito, Netlify reindirizza automaticamente la variante alternativa verso il dominio primario. Riferimento: [gestione di più domini su Netlify](https://docs.netlify.com/domains/manage-domains/manage-multiple-domains/).

## 2. Collegare il dominio

1. In Netlify aprire **Domain management → Production domains**.
2. Aggiungere il dominio acquistato e l’eventuale alias `www`/apex.
3. Impostare come **Primary domain** l’hostname canonico scelto.
4. Se si usa Netlify DNS, aggiornare presso il registrar i nameserver indicati da Netlify.
5. Se si mantiene un DNS esterno, usare esattamente i record mostrati nella schermata **Pending DNS verification**. Le istruzioni dipendono dal provider: [configurazione DNS esterno](https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/).
6. Attendere la propagazione DNS e la generazione del certificato TLS.

Non aggiungere al repository redirect con nomi di dominio di esempio. Se servono redirect per altri sottodomini, assegnare prima i domini come alias e creare regole 301 solo dopo che gli hostname reali sono noti.

## 3. Impostare la variabile di build

In **Project configuration → Environment variables** creare:

```text
VITE_SITE_URL=https://HOSTNAME-CANONICO
```

Finché non è disponibile un dominio personalizzato, è consentito usare temporaneamente l'URL di produzione assegnato da Netlify, per esempio `https://NOME-SITO.netlify.app`. Il valore non viene hardcodato nel repository. Quando sarà collegato il dominio definitivo, sostituire immediatamente la variabile con il nuovo origin canonico e avviare un nuovo deploy.

Regole:

- scope incluso: **Builds**;
- valore solo origin, senza path, query, hash o slash finale;
- usare lo stesso valore nel contesto Production;
- per le Deploy Preview usare un valore separato e assicurarsi che le preview non vengano indicizzate a livello Netlify.

Netlify non legge automaticamente i file `.env` durante la build gestita; la variabile va impostata nell’interfaccia, CLI o API. Riferimento: [variabili d’ambiente di build Netlify](https://docs.netlify.com/build/configure-builds/environment-variables/).

Build locale PowerShell:

```powershell
$env:VITE_SITE_URL='https://HOSTNAME-CANONICO'
$env:SEO_LASTMOD='AAAA-MM-GG'
npm run validate
```

`SEO_LASTMOD` è opzionale; se assente viene usata la data della build.

## 4. Pubblicare e verificare

1. Collegare Netlify al repository `Brblcu01/GoldenItaly` e al branch di produzione.
2. Lasciare `npm run build` come comando e `dist` come publish directory, già definiti in `netlify.toml`.
3. Eseguire il deploy solo dopo aver impostato `VITE_SITE_URL`.
4. Verificare che `https://HOSTNAME-CANONICO/`, `/menu/`, `/domande-frequenti/`, `/contatti/` e `/privacy-policy/` rispondano `200`.
5. Verificare che un URL inesistente risponda `404`, non `200`.
6. Verificare che la variante non canonica e il sottodominio `*.netlify.app` reindirizzino in modo permanente al dominio primario oppure non siano indicizzabili.
7. Controllare certificato HTTPS, mixed content e catena dei redirect con `curl.exe -I`.
8. Aprire il sorgente pagina e verificare canonical, `og:url`, sitemap e JSON-LD sul dominio definitivo.

Durante la fase temporanea, eseguire gli stessi controlli usando l'URL `*.netlify.app` configurato in `VITE_SITE_URL`. Non configurare ancora Search Console o directory aziendali come se quel sottodominio fosse il dominio definitivo.

## 5. Evitare la doppia indicizzazione

- Impostare sempre il dominio personalizzato come Primary domain.
- Non distribuire pubblicamente URL di deploy preview.
- Controllare che l’URL Netlify di produzione non restituisca una copia indicizzabile separata.
- Dopo il cambio dominio aggiornare Google Business Profile, Tripadvisor, Bing, Apple, social e Search Console.
- Inviare a Search Console solo la sitemap del dominio canonico.

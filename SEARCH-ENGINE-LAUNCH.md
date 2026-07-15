# Search engine launch e monitoraggio

L’indicizzazione non è garantita. Queste attività servono a rendere il sito verificabile e monitorabile dopo il deploy sul dominio definitivo.

## Google Search Console

1. Aggiungere una proprietà di tipo **Dominio** per il dominio definitivo.
2. Inserire il record TXT DNS richiesto e completare la verifica.
3. Inviare `https://HOSTNAME-CANONICO/sitemap.xml`.
4. Usare Controllo URL su homepage e `/menu/`.
5. Richiedere l’indicizzazione dopo aver verificato sorgente, canonical e risposta 200.
6. Controllare periodicamente indicizzazione pagine, duplicati e canonical scelti da Google.
7. Controllare il report Core Web Vitals su dati reali; non sostituirlo con soli test di laboratorio.
8. Controllare i miglioramenti e gli errori relativi ai dati strutturati.

## Bing Webmaster Tools

1. Aggiungere il dominio a Bing Webmaster Tools.
2. Importare la proprietà da Search Console, se l’opzione è disponibile e appropriata.
3. Inviare la stessa sitemap canonica.
4. Verificare scansione, pagine indicizzate e URL bloccati.

## Crawler AI e referral

1. Verificare nei log CDN/server che `OAI-SearchBot` possa ricevere le pagine con status 200 e HTML completo.
2. Mantenere separata la scelta di ricerca da quella di addestramento: `OAI-SearchBot` è consentito, `GPTBot` è bloccato in modo conservativo.
3. Monitorare referral, quando disponibili, da ChatGPT, Bing, Copilot, Perplexity e Google.
4. Non considerare `llms.txt` un requisito né un fattore di posizionamento.

## Conversioni e manutenzione

Monitorare, solo dopo aver configurato uno strumento conforme a privacy e consenso, gli eventi astratti già predisposti:

- `click_phone`
- `click_directions`
- `click_menu`
- `click_tripadvisor`
- `click_reservation`
- `view_contact_section`

Controllare mensilmente link, sitemap, dati strutturati e copertura. Controllare orari e menu ogni volta che cambiano e prima delle festività.


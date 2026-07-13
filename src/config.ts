export const restaurant = {
  name: 'Golden Italy',
  eyebrow: 'Ristorante · Pizzeria · Lido di Ostia',
  headline: 'Una tavola accesa nel cuore di Ostia.',
  phoneDisplay: '06 562 4002',
  phoneHref: 'tel:+39065624002',
  address: 'Corso Regina Maria Pia 24, 00122 Lido di Ostia RM',
  directionsHref:
    'https://www.google.com/maps/search/?api=1&query=Golden+Italy+Corso+Regina+Maria+Pia+24+Lido+di+Ostia',
  tripadvisorHref:
    'https://www.tripadvisor.com/Restaurant_Review-g799531-d2347605-Reviews-Golden_Italy-Lido_di_Ostia_Province_of_Rome_Lazio.html',
  hoursStatus: 'Orari in aggiornamento',
  hoursNote: 'Chiama prima di venire: stiamo verificando gli orari ufficiali.',
  heroVideo: '/golden-italy-hero.mp4',
  heroMobileVideo: '/golden-italy-hero-mobile.mp4',
  heroPoster: '/golden-italy-poster.webp',
  visitVideo: '/golden-italy-visit.mp4',
  visitPoster: '/golden-italy-visit-poster.webp',
} as const

export const reviews = [
  {
    initials: 'RC',
    author: 'Raffaella C',
    date: 'Aprile 2025',
    rating: 5,
    title: 'Tradizione e generosità',
    summary:
      'Cliente dai primi anni Duemila, ritrova piatti generosi, cucina fedele alla tradizione e un servizio professionale e gentile.',
    featured: true,
  },
  {
    initials: 'CV',
    author: 'Claudio V',
    date: 'Marzo 2025',
    rating: 4,
    title: 'Primi da ricordare',
    summary:
      'Sottolinea la qualità dei primi, le porzioni abbondanti e un rapporto qualità-prezzo particolarmente convincente.',
    featured: false,
  },
  {
    initials: 'TL',
    author: 'Tuninglove_975',
    date: 'Maggio 2024',
    rating: 5,
    title: 'Una cena da ripetere',
    summary:
      'Una serata tra amici con diversi primi di pesce: cucina molto buona, staff cordiale e prezzi considerati giusti.',
    featured: false,
  },
  {
    initials: 'G16',
    author: 'gaudin2016',
    date: 'Settembre 2024',
    rating: 5,
    title: 'Sapori che sorprendono',
    summary:
      'Apprezza il locale, la gentilezza del personale e ricorda in particolare la cacio e pepe con gambero rosa e lime.',
    featured: false,
  },
  {
    initials: 'LR',
    author: 'lucadiroma2004',
    date: 'Marzo 2024',
    rating: 4,
    title: 'Un riferimento a Ostia',
    summary:
      'Conferma la buona qualità delle pietanze, le porzioni importanti e un servizio cortese e veloce.',
    featured: false,
  },
] as const

export const interiors = {
  exterior: '/exterior-night.webp',
  diningRoom: '/interior-dining-room.webp',
  serviceCounter: '/interior-service-counter.webp',
  tableRitual: '/table-ritual.webp',
} as const

export const dishes = [
  {
    number: '01',
    name: 'Spaghetti al cartoccio',
    note: 'Pasta avvolta nel cartoccio, salsa di mare, cozze e prezzemolo.',
    tone: 'rosso',
    image: '/dish-spaghetti-cartoccio.webp',
  },
  {
    number: '02',
    name: 'Tonnarello Imperiale',
    note: 'Una generosa composizione di pasta, crostacei, cozze e vongole.',
    tone: 'oro',
    image: '/dish-tonnarello-imperiale.webp',
  },
  {
    number: '03',
    name: 'Insalata di mare',
    note: 'Polpo, seppia, salmone e verdure con limone e prezzemolo.',
    tone: 'verde',
    image: '/dish-insalata-mare.webp',
  },
  {
    number: '04',
    name: 'Spaghetti alle vongole',
    note: 'Spaghetti alle vongole, prezzemolo fresco e profumo di mare.',
    tone: 'avorio',
    image: '/dish-spaghetti-vongole.webp',
  },
] as const

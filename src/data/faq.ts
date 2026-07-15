import { restaurant, restaurantAddress } from './restaurant'

export type FaqItem = {
  question: string
  answer: string
}

export const faqItems: FaqItem[] = [
  {
    question: 'Dove si trova Golden Italy?',
    answer: `Golden Italy si trova in ${restaurantAddress}, nel centro di Lido di Ostia.`,
  },
  {
    question: 'Golden Italy propone sia piatti di pesce sia pizza?',
    answer: 'Sì. Golden Italy è un ristorante e pizzeria con cucina italiana, cucina romana e piatti di mare.',
  },
  {
    question: 'Come si prenota un tavolo?',
    answer: `Per prenotare puoi chiamare Golden Italy al numero ${restaurant.phoneDisplay}.`,
  },
  {
    question: 'Dove posso vedere il menu e i prezzi?',
    answer: 'La pagina menu presenta in formato testuale i piatti attualmente mostrati sul sito. Il menu completo e i prezzi saranno pubblicati dopo la verifica diretta con il ristorante.',
  },
  {
    question: 'Come posso conoscere gli orari ufficiali?',
    answer: `Gli orari ufficiali non sono ancora pubblicati sul sito. Prima della visita, puoi verificarli chiamando il numero ${restaurant.phoneDisplay}.`,
  },
  {
    question: 'Le porzioni sono abbondanti?',
    answer: 'Diverse recensioni selezionate degli ospiti citano porzioni generose, soprattutto per i primi piatti. Si tratta di una sintesi delle opinioni pubblicate su Tripadvisor.',
  },
]


export type MenuItemData = {
  name: string
  description: string
  image: string
  imageSmall: string
  imageWidth: number
  imageHeight: number
  price?: number
  allergens?: string[]
}

export type MenuSectionData = {
  name: string
  items: MenuItemData[]
}

export const menuLastUpdated = '15 luglio 2026'
export const menuLastmod = '2026-07-15'

export const menuSections: MenuSectionData[] = [
  {
    name: 'Antipasti di mare',
    items: [
      {
        name: 'Insalata di mare',
        description: 'Polpo, seppia, salmone e verdure con limone e prezzemolo.',
        image: '/dish-insalata-mare.webp',
        imageSmall: '/dish-insalata-mare-800.webp',
        imageWidth: 1328,
        imageHeight: 747,
      },
    ],
  },
  {
    name: 'Primi di mare',
    items: [
      {
        name: 'Spaghetti al cartoccio',
        description: 'Pasta avvolta nel cartoccio, salsa di mare, cozze e prezzemolo.',
        image: '/dish-spaghetti-cartoccio.webp',
        imageSmall: '/dish-spaghetti-cartoccio-800.webp',
        imageWidth: 958,
        imageHeight: 643,
      },
      {
        name: 'Tonnarello Imperiale',
        description: 'Una composizione di pasta, crostacei, cozze e vongole.',
        image: '/dish-tonnarello-imperiale.webp',
        imageSmall: '/dish-tonnarello-imperiale-800.webp',
        imageWidth: 950,
        imageHeight: 711,
      },
      {
        name: 'Spaghetti alle vongole',
        description: 'Spaghetti alle vongole, prezzemolo fresco e profumo di mare.',
        image: '/dish-spaghetti-vongole.webp',
        imageSmall: '/dish-spaghetti-vongole-800.webp',
        imageWidth: 1536,
        imageHeight: 2048,
      },
    ],
  },
]

const previewOrder = ['Spaghetti al cartoccio', 'Tonnarello Imperiale', 'Insalata di mare', 'Spaghetti alle vongole']

export const featuredDishes = menuSections.flatMap((section) => section.items)
  .sort((a, b) => previewOrder.indexOf(a.name) - previewOrder.indexOf(b.name))
  .map((item, index) => ({
  ...item,
  number: String(index + 1).padStart(2, '0'),
  tone: ['rosso', 'oro', 'verde', 'avorio'][index] ?? 'avorio',
  }))

import { PlaceHolderImages } from './placeholder-images';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  imageHint: string;
};

const findImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  return {
    url: image?.imageUrl ?? 'https://picsum.photos/seed/placeholder/600/400',
    hint: image?.imageHint ?? 'image de produit',
  };
};

export const categories = ['Tout', 'Légumes', 'Fruits', 'Viande', 'Laitages', 'Épices'];

export const products: Product[] = [
  {
    id: '1',
    name: 'Tomates Fraîches',
    description: 'Tomates mûres et juteuses, parfaites pour les salades et les sauces.',
    price: 2.99,
    category: 'Légumes',
    imageUrl: findImage('tomatoes').url,
    imageHint: findImage('tomatoes').hint,
  },
  {
    id: '2',
    name: 'Carottes Bio',
    description: 'Une botte de carottes bio douces et croquantes.',
    price: 1.99,
    category: 'Légumes',
    imageUrl: findImage('carrots').url,
    imageHint: findImage('carrots').hint,
  },
  {
    id: '3',
    name: 'Pommes Rouges',
    description: 'Pommes rouges croquantes et sucrées, idéales pour une collation saine.',
    price: 3.49,
    category: 'Fruits',
    imageUrl: findImage('apples').url,
    imageHint: findImage('apples').hint,
  },
  {
    id: '4',
    name: 'Bananes',
    description: 'Un régime de bananes mûres et crémeuses.',
    price: 1.29,
    category: 'Fruits',
    imageUrl: findImage('bananas').url,
    imageHint: findImage('bananas').hint,
  },
  {
    id: '5',
    name: 'Entrecôte',
    description: 'Une coupe de bœuf de première qualité, bien persillée et pleine de saveur.',
    price: 15.99,
    category: 'Viande',
    imageUrl: findImage('steak').url,
    imageHint: findImage('steak').hint,
  },
  {
    id: '6',
    name: 'Poitrine de Poulet',
    description: 'Poitrines de poulet tendres et maigres, sans os et sans peau.',
    price: 8.99,
    category: 'Viande',
    imageUrl: findImage('chicken-breast').url,
    imageHint: findImage('chicken-breast').hint,
  },
  {
    id: '7',
    name: 'Lait Frais',
    description: 'Un gallon de lait entier frais.',
    price: 3.99,
    category: 'Laitages',
    imageUrl: findImage('milk').url,
    imageHint: findImage('milk').hint,
  },
  {
    id: '8',
    name: 'Fromage Cheddar',
    description: 'Un bloc de fromage cheddar fort et savoureux.',
    price: 5.49,
    category: 'Laitages',
    imageUrl: findImage('cheese').url,
    imageHint: findImage('cheese').hint,
  },
  {
    id: '9',
    name: 'Bâtons de Cannelle',
    description: 'Bâtons de cannelle aromatiques pour la pâtisserie et les boissons.',
    price: 4.99,
    category: 'Épices',
    imageUrl: findImage('cinnamon').url,
    imageHint: findImage('cinnamon').hint,
  },
  {
    id: '10',
    name: 'Paprika Fumé',
    description: 'Un contenant de poudre de paprika riche et fumée.',
    price: 3.99,
    category: 'Épices',
    imageUrl: findImage('paprika').url,
    imageHint: findImage('paprika').hint,
  },
  {
    id: '11',
    name: 'Laitue Verte',
    description: 'Une tête de laitue verte fraîche et croquante.',
    price: 2.49,
    category: 'Légumes',
    imageUrl: findImage('lettuce').url,
    imageHint: findImage('lettuce').hint,
  },
  {
    id: '12',
    name: 'Oranges Juteuses',
    description: 'Un sac d\'oranges navel douces et juteuses.',
    price: 4.99,
    category: 'Fruits',
    imageUrl: findImage('oranges').url,
    imageHint: findImage('oranges').hint,
  },
];


export type Order = {
  id: string;
  date: string;
  status: 'Livrée' | 'En traitement' | 'Expédiée';
  total: number;
  items: number;
};

export const orders: Order[] = [
  { id: 'ORD001', date: '2024-05-20', status: 'Livrée', total: 45.98, items: 3 },
  { id: 'ORD002', date: '2024-05-22', status: 'Livrée', total: 12.49, items: 1 },
  { id: 'ORD003', date: '2024-06-10', status: 'Expédiée', total: 8.99, items: 1 },
  { id: 'ORD004', date: '2024-06-15', status: 'En traitement', total: 120.50, items: 5 },
];

export const userProfile = {
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    phone: '+33 6 12 34 56 78',
    address: {
        street: '123 Rue du Marché',
        city: 'Villeneuve',
        state: 'IDF',
        zip: '75001',
        country: 'France',
    },
    paymentMethods: [
        { type: 'Carte de Crédit', details: '**** **** **** 1234' },
        { type: 'Moov Money', details: 'Associé au +33 6 12 34 56 78' },
    ]
};

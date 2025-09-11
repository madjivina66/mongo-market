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
    hint: image?.imageHint ?? 'product image',
  };
};

export const categories = ['All', 'Vegetables', 'Fruits', 'Meat', 'Dairy', 'Spices'];

export const products: Product[] = [
  {
    id: '1',
    name: 'Fresh Tomatoes',
    description: 'Ripe and juicy tomatoes, perfect for salads and sauces.',
    price: 2.99,
    category: 'Vegetables',
    imageUrl: findImage('tomatoes').url,
    imageHint: findImage('tomatoes').hint,
  },
  {
    id: '2',
    name: 'Organic Carrots',
    description: 'A bunch of sweet and crunchy organic carrots.',
    price: 1.99,
    category: 'Vegetables',
    imageUrl: findImage('carrots').url,
    imageHint: findImage('carrots').hint,
  },
  {
    id: '3',
    name: 'Red Apples',
    description: 'Crisp and sweet red apples, great for a healthy snack.',
    price: 3.49,
    category: 'Fruits',
    imageUrl: findImage('apples').url,
    imageHint: findImage('apples').hint,
  },
  {
    id: '4',
    name: 'Bananas',
    description: 'A bunch of ripe and creamy bananas.',
    price: 1.29,
    category: 'Fruits',
    imageUrl: findImage('bananas').url,
    imageHint: findImage('bananas').hint,
  },
  {
    id: '5',
    name: 'Ribeye Steak',
    description: 'A premium cut of beef, well-marbled and full of flavor.',
    price: 15.99,
    category: 'Meat',
    imageUrl: findImage('steak').url,
    imageHint: findImage('steak').hint,
  },
  {
    id: '6',
    name: 'Chicken Breast',
    description: 'Lean and tender boneless, skinless chicken breasts.',
    price: 8.99,
    category: 'Meat',
    imageUrl: findImage('chicken-breast').url,
    imageHint: findImage('chicken-breast').hint,
  },
  {
    id: '7',
    name: 'Fresh Milk',
    description: 'A gallon of fresh whole milk.',
    price: 3.99,
    category: 'Dairy',
    imageUrl: findImage('milk').url,
    imageHint: findImage('milk').hint,
  },
  {
    id: '8',
    name: 'Cheddar Cheese',
    description: 'A block of sharp and flavorful cheddar cheese.',
    price: 5.49,
    category: 'Dairy',
    imageUrl: findImage('cheese').url,
    imageHint: findImage('cheese').hint,
  },
  {
    id: '9',
    name: 'Cinnamon Sticks',
    description: 'Aromatic cinnamon sticks for baking and drinks.',
    price: 4.99,
    category: 'Spices',
    imageUrl: findImage('cinnamon').url,
    imageHint: findImage('cinnamon').hint,
  },
  {
    id: '10',
    name: 'Smoked Paprika',
    description: 'A container of rich and smoky paprika powder.',
    price: 3.99,
    category: 'Spices',
    imageUrl: findImage('paprika').url,
    imageHint: findImage('paprika').hint,
  },
  {
    id: '11',
    name: 'Green Lettuce',
    description: 'A fresh head of crispy green leaf lettuce.',
    price: 2.49,
    category: 'Vegetables',
    imageUrl: findImage('lettuce').url,
    imageHint: findImage('lettuce').hint,
  },
  {
    id: '12',
    name: 'Juicy Oranges',
    description: 'A bag of sweet and juicy navel oranges.',
    price: 4.99,
    category: 'Fruits',
    imageUrl: findImage('oranges').url,
    imageHint: findImage('oranges').hint,
  },
];


export type Order = {
  id: string;
  date: string;
  status: 'Delivered' | 'Processing' | 'Shipped';
  total: number;
  items: number;
};

export const orders: Order[] = [
  { id: 'ORD001', date: '2024-05-20', status: 'Delivered', total: 45.98, items: 3 },
  { id: 'ORD002', date: '2024-05-22', status: 'Delivered', total: 12.49, items: 1 },
  { id: 'ORD003', date: '2024-06-10', status: 'Shipped', total: 8.99, items: 1 },
  { id: 'ORD004', date: '2024-06-15', status: 'Processing', total: 120.50, items: 5 },
];

export const userProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
    address: {
        street: '123 Market St',
        city: 'Townton',
        state: 'CA',
        zip: '90210',
        country: 'USA',
    },
    paymentMethods: [
        { type: 'Credit Card', details: '**** **** **** 1234' },
        { type: 'Moov Money', details: 'Associated with +1 234 567 890' },
    ]
};

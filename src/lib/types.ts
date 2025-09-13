export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  imageHint: string;
};

export type Order = {
  id: string;
  date: string;
  status: 'Livrée' | 'En traitement' | 'Expédiée';
  total: number;
  items: number;
};

export type UserProfile = {
    name: string;
    email: string;
    phone: string;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    paymentMethods: {
        type: string;
        details: string;
    }[];
};

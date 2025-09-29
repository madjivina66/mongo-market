
export type ProductCategory = 'Légumes' | 'Fruits' | 'Viande' | 'Produits laitiers' | 'Épices';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  imageUrl: string;
  imageHint: string;
  sellerId: string; // Le champ est maintenant requis
};

export type WithId<T> = T & { id: string };


export type Order = {
  id: string;
  date: string;
  status: 'Livrée' | 'En traitement' | 'Expédiée';
  total: number;
  items: number;
};

export type UserProfile = {
    id: string; // Added id to make document updates easier
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
    paymentMethods?: { // Made optional as it may not exist
        type: string;
        details: string;
    }[];
    isPro?: boolean; // Champ pour le statut de l'abonnement Pro
};




export type ProductCategory = 'Légumes' | 'Fruits' | 'Viande' | 'Produits laitiers' | 'Épices' | 'Électronique' | 'Vêtements' | 'Boulangerie' | 'Sacs';

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
  userId: string;
  orderDate: string; // Gardé en string pour la simplicité (format ISO)
  totalAmount: number;
  status: 'En attente' | 'En traitement' | 'Expédiée' | 'Livrée';
  orderItems: { // Un tableau d'objets au lieu de simples IDs
    productId: string;
    productName: string; // Dénormalisé pour un affichage facile
    quantity: number;
    price: number;
  }[];
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

export interface ChatMessage {
  id?: string;
  senderName: string;
  senderId: string;
  text: string;
  timestamp: any; // Utiliser le serverTimestamp de Firestore
}

export type Notification = {
  id: string;
  title: string;
  description: string;
  type: 'order' | 'shipping' | 'promo' | 'system';
  timestamp: any; // Firestore ServerTimestamp
  isRead: boolean;
  link?: string; // Optional link to a relevant page
};

export type LiveChatSummary = {
  sentiment: 'Positif' | 'Neutre' | 'Négatif';
  keyQuestions: string[];
  popularKeywords: string[];
  productSuggestion: string;
};

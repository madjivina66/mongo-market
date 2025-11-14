
// Ce script utilise le SDK Admin et est destiné à être exécuté depuis la ligne de commande,
// PAS depuis le client ou le serveur Next.js.
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { PlaceHolderImages } from './placeholder-images';
import type { Product, Order, Notification } from './types';

// Pour l'authentification en local, vous devez fournir vos identifiants de service.
// NOTE: NE COMMETTEZ JAMAIS CE FICHIER AVEC VOS VRAIES CLÉS DE SERVICE DANS UN REPO PUBLIC.
// Dans l'environnement Cloud, les identifiants sont souvent fournis automatiquement.
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

if (getApps().length === 0) {
  initializeApp({
    credential: serviceAccount ? cert(serviceAccount) : undefined,
    // Si vous exécutez cela localement sans variables d'environnement,
    // vous pourriez avoir besoin de spécifier la projectId.
    // projectId: 'votre-project-id'
  });
}

const adminDb = getFirestore();

const productData: Omit<Product, 'id' | 'sellerId'>[] = [
    { name: 'Tomates Fraîches', description: 'Grappe de tomates mûries au soleil.', price: 3.50, category: 'Légumes', imageUrl: PlaceHolderImages[0].imageUrl, imageHint: PlaceHolderImages[0].imageHint },
    { name: 'Carottes Bio', description: 'Botte de carottes fraîches et croquantes.', price: 2.20, category: 'Légumes', imageUrl: PlaceHolderImages[1].imageUrl, imageHint: PlaceHolderImages[1].imageHint },
    { name: 'Pommes Gala', description: 'Pommes sucrées et juteuses, parfaites pour une collation.', price: 4.10, category: 'Fruits', imageUrl: PlaceHolderImages[2].imageUrl, imageHint: PlaceHolderImages[2].imageHint },
    { name: 'Bananes', description: 'Régime de bananes riches en potassium.', price: 2.80, category: 'Fruits', imageUrl: PlaceHolderImages[3].imageUrl, imageHint: PlaceHolderImages[3].imageHint },
    { name: 'Steak de Bœuf', description: 'Steak de faux-filet de première qualité.', price: 15.00, category: 'Viande', imageUrl: PlaceHolderImages[4].imageUrl, imageHint: PlaceHolderImages[4].imageHint },
    { name: 'Filet de Poulet', description: 'Filets de poulet fermier, sans peau et désossés.', price: 8.50, category: 'Viande', imageUrl: PlaceHolderImages[5].imageUrl, imageHint: PlaceHolderImages[5].imageHint },
    { name: 'Lait Entier', description: 'Bouteille de lait frais entier pasteurisé.', price: 1.80, category: 'Produits laitiers', imageUrl: PlaceHolderImages[6].imageUrl, imageHint: PlaceHolderImages[6].imageHint },
    { name: 'Fromage Cheddar', description: 'Bloc de fromage cheddar affiné.', price: 6.00, category: 'Produits laitiers', imageUrl: PlaceHolderImages[7].imageUrl, imageHint: PlaceHolderImages[7].imageHint },
    { name: 'Bâtons de Cannelle', description: 'Bâtons de cannelle aromatiques pour la pâtisserie et les boissons.', price: 4.50, category: 'Épices', imageUrl: PlaceHolderImages[8].imageUrl, imageHint: PlaceHolderImages[8].imageHint },
    { name: 'Céréales du Matin', description: 'Céréales croquantes pour un petit déjeuner sain.', price: 5.20, category: 'Épices', imageUrl: PlaceHolderImages[13].imageUrl, imageHint: PlaceHolderImages[13].imageHint },
    { name: 'Ordinateur Portable Pro', description: 'Un ordinateur portable puissant pour le travail et les loisirs.', price: 1200.00, category: 'Électronique', imageUrl: PlaceHolderImages[12].imageUrl, imageHint: PlaceHolderImages[12].imageHint },
    { name: 'Sac à Dos Urbain', description: 'Un sac à dos élégant et durable pour un usage quotidien.', price: 75.50, category: 'Vêtements', imageUrl: PlaceHolderImages[14].imageUrl, imageHint: PlaceHolderImages[14].imageHint },
];


async function seedDatabase() {
    console.log("Accès à la base de données Admin Firestore...");
    
    const productsCollection = adminDb.collection('products');
    const batch = adminDb.batch();
    
    const testSellerId = "seller_test_id_12345";
    const testUserId = "user_test_id_67890";

    console.log(`Suppression des anciens produits de test...`);
    const oldProducts = await productsCollection.where('sellerId', '==', testSellerId).get();
    oldProducts.forEach(doc => batch.delete(doc.ref));

    console.log(`Préparation de ${productData.length} produits pour l'ajout...`);
    
    const productRefs: { id: string; data: Omit<Product, 'id' | 'sellerId'> }[] = productData.map((product) => {
        const docRef = productsCollection.doc();
        batch.set(docRef, { ...product, sellerId: testSellerId });
        return { id: docRef.id, data: product };
    });

    console.log("Ajout de données de test pour l'utilisateur de test...");
    const userProfileRef = adminDb.collection('userProfiles').doc(testUserId);
    
    // Supprimer les anciennes commandes et notifications
    const oldOrders = await userProfileRef.collection('orders').get();
    oldOrders.forEach(doc => batch.delete(doc.ref));
    const oldNotifications = await userProfileRef.collection('notifications').get();
    oldNotifications.forEach(doc => batch.delete(doc.ref));
    
    const orders: Omit<Order, 'id'>[] = [
      {
        userId: testUserId,
        orderDate: new Date('2023-10-26T10:00:00Z').toISOString(),
        totalAmount: (productData[0].price * 2) + productData[5].price,
        status: 'Livrée',
        orderItems: [
          { productId: productRefs[0].id, productName: productData[0].name, quantity: 2, price: productData[0].price },
          { productId: productRefs[5].id, productName: productData[5].name, quantity: 1, price: productData[5].price },
        ],
      },
      {
        userId: testUserId,
        orderDate: new Date('2023-10-28T14:30:00Z').toISOString(),
        totalAmount: productData[2].price * 1,
        status: 'En traitement',
        orderItems: [
          { productId: productRefs[2].id, productName: productData[2].name, quantity: 1, price: productData[2].price },
        ],
      },
    ];

    orders.forEach(order => {
        const orderRef = userProfileRef.collection('orders').doc();
        batch.set(orderRef, order);
    });

    const notifications: Omit<Notification, 'id'>[] = [
        {
            title: "Nouvelle commande reçue",
            description: "Vous avez une nouvelle commande #7564 pour des Tomates Fraîches.",
            type: 'order',
            timestamp: Timestamp.fromDate(new Date()),
            isRead: false,
            link: '/orders'
        },
        {
            title: "Produit expédié",
            description: "Votre commande de Pommes Gala a été expédiée.",
            type: 'shipping',
            timestamp: Timestamp.fromDate(new Date(Date.now() - 2 * 60 * 60 * 1000)), // 2 hours ago
            isRead: false,
            link: '/orders'
        },
        {
            title: "Promotion spéciale !",
            description: "Bénéficiez de -15% sur tous les produits de la catégorie 'Fruits'.",
            type: 'promo',
            timestamp: Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000)), // 1 day ago
            isRead: true,
            link: '/products'
        }
    ];

    notifications.forEach(notif => {
        const notifRef = userProfileRef.collection('notifications').doc();
        batch.set(notifRef, notif);
    });

    try {
        console.log("Exécution du batch write pour les produits, commandes et notifications...");
        await batch.commit();
        console.log(`✅ Succès ! ${productData.length} produits, ${orders.length} commandes et ${notifications.length} notifications ont été ajoutés.`);
        console.log(`Vous pouvez vous connecter avec l'ID utilisateur '${testUserId}' pour voir les données.`);
    } catch (error) {
        console.error("❌ Erreur lors de l'ajout des données à la base de données :", error);
        console.log("Vérifiez que vos identifiants d'administration (service account) sont correctement configurés si vous exécutez ce script localement.");
    }
}

seedDatabase();

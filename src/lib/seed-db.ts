
import { adminDb } from '@/lib/firebase-admin';
import { PlaceHolderImages } from './placeholder-images';
import type { Product } from './types';

const products: Omit<Product, 'id'>[] = [
    { name: 'Tomates Fraîches', description: 'Grappe de tomates mûries au soleil.', price: 3.50, category: 'Légumes', imageUrl: PlaceHolderImages[0].imageUrl, imageHint: PlaceHolderImages[0].imageHint },
    { name: 'Carottes Bio', description: 'Botte de carottes fraîches et croquantes.', price: 2.20, category: 'Légumes', imageUrl: PlaceHolderImages[1].imageUrl, imageHint: PlaceHolderImages[1].imageHint },
    { name: 'Pommes Gala', description: 'Pommes sucrées et juteuses, parfaites pour une collation.', price: 4.10, category: 'Fruits', imageUrl: PlaceHolderImages[2].imageUrl, imageHint: PlaceHolderImages[2].imageHint },
    { name: 'Bananes', description: 'Régime de bananes riches en potassium.', price: 2.80, category: 'Fruits', imageUrl: PlaceHolderImages[3].imageUrl, imageHint: PlaceHolderImages[3].imageHint },
    { name: 'Steak de Bœuf', description: 'Steak de faux-filet de première qualité.', price: 15.00, category: 'Viande', imageUrl: PlaceHolderImages[4].imageUrl, imageHint: PlaceHolderImages[4].imageHint },
    { name: 'Filet de Poulet', description: 'Filets de poulet fermier, sans peau et désossés.', price: 8.50, category: 'Viande', imageUrl: PlaceHolderImages[5].imageUrl, imageHint: PlaceHolderImages[5].imageHint },
    { name: 'Lait Entier', description: 'Bouteille de lait frais entier pasteurisé.', price: 1.80, category: 'Produits laitiers', imageUrl: PlaceHolderImages[6].imageUrl, imageHint: PlaceHolderImages[6].imageHint },
    { name: 'Fromage Cheddar', description: 'Bloc de fromage cheddar affiné.', price: 6.00, category: 'Produits laitiers', imageUrl: PlaceHolderImages[7].imageUrl, imageHint: PlaceHolderImages[7].imageHint },
    { name: 'Bâtons de Cannelle', description: 'Bâtons de cannelle aromatiques pour la pâtisserie et les boissons.', price: 4.50, category: 'Épices', imageUrl: PlaceHolderImages[8].imageUrl, imageHint: PlaceHolderImages[8].imageHint },
    { name: 'Poudre de Paprika', description: 'Paprika fumé pour relever vos plats.', price: 3.00, category: 'Épices', imageUrl: PlaceHolderImages[9].imageUrl, imageHint: PlaceHolderImages[9].imageHint },
    { name: 'Laitue Iceberg', description: 'Tête de laitue fraîche et croquante.', price: 1.50, category: 'Légumes', imageUrl: PlaceHolderImages[10].imageUrl, imageHint: PlaceHolderImages[10].imageHint },
    { name: 'Oranges de Sicile', description: 'Oranges juteuses et pleines de vitamine C.', price: 3.20, category: 'Fruits', imageUrl: PlaceHolderImages[11].imageUrl, imageHint: PlaceHolderImages[11].imageHint },
];

async function seedDatabase() {
    console.log("Accès à la base de données Admin...");
    const db = adminDb;
    
    const productsCollection = db.collection('products');
    const batch = db.batch();

    console.log(`Préparation de ${products.length} produits pour l'ajout...`);
    
    products.forEach((product) => {
        const docRef = productsCollection.doc(); // Auto-generate ID
        batch.set(docRef, product);
    });

    try {
        console.log("Exécution du batch write...");
        await batch.commit();
        console.log(`✅ Succès ! ${products.length} produits ont été ajoutés à la collection 'products'.`);
        console.log("Votre application a maintenant des données à afficher.");
    } catch (error) {
        console.error("❌ Erreur lors de l'ajout des produits à la base de données :", error);
    } finally {
        // In a long-running script, you might want to terminate the app
        // For a simple script like this, it will exit automatically.
    }
}

seedDatabase();

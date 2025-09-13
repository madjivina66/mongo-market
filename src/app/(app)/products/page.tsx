import ProductGrid from './product-grid';
import { getProducts, getCategories } from '@/lib/firebase-data';

export default async function ProductsPage() {
  const products = await getProducts();
  const categories = await getCategories();
  
  return (
    <div className="container mx-auto">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-5xl">
          Bienvenue sur MongoMarket
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          La fraîcheur livrée à votre porte
        </p>
      </header>
      <ProductGrid allProducts={products} categories={categories} />
    </div>
  );
}

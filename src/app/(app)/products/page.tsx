
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Affiche un squelette de chargement pendant que le composant principal est chargé.
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
         <div key={i} className="flex flex-col overflow-hidden rounded-lg border">
            <Skeleton className="h-48 w-full" />
            <div className="flex-1 p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="mt-2 h-4 w-full" />
            </div>
            <div className="flex items-center justify-between p-4 pt-0">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-9 w-24" />
            </div>
        </div>
      ))}
    </div>
  );
}

// Utilise l'importation dynamique pour le composant ProductGrid.
// Le 'ssr: false' indique que ce composant ne sera rendu que côté client.
const ProductGrid = dynamic(() => import('./product-grid'), {
  ssr: false,
  loading: () => <ProductGridSkeleton />,
});

export default function ProductsPage() {
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
      <ProductGrid />
    </div>
  );
}

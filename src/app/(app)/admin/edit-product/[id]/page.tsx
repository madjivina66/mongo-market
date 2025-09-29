
'use client';

import { notFound } from 'next/navigation';
import { doc } from 'firebase/firestore';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase'; 
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { EditProductForm } from './edit-product-form';
import { useAuth } from '@/context/auth-context';


function EditProductSkeleton() {
    return (
        <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
                <Skeleton className="h-10 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto mt-4" />
            </div>
            <Skeleton className="h-[600px] w-full" />
        </div>
    );
}


export default function EditProductPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const { user } = useAuth();

  const productRef = useMemoFirebase(() => {
    return doc(firestore, 'products', params.id);
  }, [firestore, params.id]);

  const { data: product, isLoading, error } = useDoc<Product>(productRef);

  if (isLoading) {
    return <EditProductSkeleton />;
  }

  // Si le produit n'est pas trouvé ou qu'une erreur s'est produite
  if (error || !product) {
    console.error("Erreur de chargement du produit:", error);
    notFound();
  }

  // Vérification de sécurité côté client pour une meilleure UX
  // La vraie sécurité est dans l'action serveur
  if (product.sellerId !== user?.uid) {
    return (
        <div className="text-center py-16">
            <h1 className="font-headline text-2xl text-destructive">Accès non autorisé</h1>
            <p className="text-muted-foreground mt-2">Vous n'êtes pas le propriétaire de ce produit.</p>
        </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
        <header className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-5xl">
                Modifier le produit
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
                Mettez à jour les informations de &quot;{product.name}&quot;.
            </p>
        </header>
        <EditProductForm product={product} />
    </div>
  );
}

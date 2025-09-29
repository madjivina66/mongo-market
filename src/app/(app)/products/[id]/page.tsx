
'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';


function ProductDetailSkeleton() {
    return (
        <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 md:grid-cols-2">
                <div>
                    <Skeleton className="w-full h-[600px] rounded-lg" />
                </div>
                <div className="flex flex-col justify-center space-y-4">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-12 w-28" />
                    <Skeleton className="h-12 w-48" />
                </div>
            </div>
        </div>
    );
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const firestore = useFirestore();

  // Crée une référence de document mémoïsée pour le produit
  const productRef = useMemoFirebase(() => {
    return doc(firestore, 'products', params.id);
  }, [firestore, params.id]);

  // Utilise le hook useDoc pour récupérer les données du produit
  const { data: product, isLoading, error } = useDoc<Product>(productRef);

  // Si une erreur se produit (ex: permissions), afficher not found
  if (error) {
    console.error("Failed to fetch product:", error);
    notFound();
  }
  
  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  // Si le produit n'est pas trouvé après le chargement
  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Ajouté au panier",
      description: `${product.name} a été ajouté à votre panier.`,
    });
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={800}
            height={600}
            className="w-full rounded-lg object-cover shadow-lg"
            data-ai-hint={product.imageHint}
          />
        </div>
        <div className="flex flex-col justify-center">
          <Badge variant="secondary" className="w-fit bg-accent/20 text-accent-foreground">
            {product.category}
          </Badge>
          <h1 className="mt-2 font-headline text-4xl font-bold">{product.name}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{product.description}</p>
          <div className="mt-6 flex items-baseline gap-4">
            <span className="text-4xl font-bold text-primary">${product.price.toFixed(2)}</span>
          </div>
          <Button size="lg" className="mt-8 font-headline text-lg" onClick={handleAddToCart}>
            <PlusCircle className="mr-2 h-5 w-5" />
            Ajouter au panier
          </Button>
        </div>
      </div>
    </div>
  );
}

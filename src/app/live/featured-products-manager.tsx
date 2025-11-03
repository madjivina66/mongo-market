'use client';

import { useState } from 'react';
import Image from 'next/image';
import { collection, query, where, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { useAuth, useCollection, useFirestore, useMemoFirebase, type WithId } from '@/firebase'; 
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, MinusCircle, Loader2 } from 'lucide-react';

const LIVE_SESSION_ID = "main_session";

function ProductItem({ product, isFeatured }: { product: WithId<Product>, isFeatured: boolean }) {
    const [isLoading, setIsLoading] = useState(false);
    const firestore = useFirestore();
    const { toast } = useToast();

    const handleToggleFeature = async () => {
        setIsLoading(true);
        const featureRef = doc(firestore, 'liveSessions', LIVE_SESSION_ID, 'featuredProducts', product.id);

        try {
            if (isFeatured) {
                await deleteDoc(featureRef);
                toast({ title: "Produit retiré" });
            } else {
                // On ne stocke que les données nécessaires pour l'affichage
                const productData = {
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    category: product.category,
                    imageHint: product.imageHint || '',
                };
                await setDoc(featureRef, productData);
                toast({ title: "Produit présenté !" });
            }
        } catch (error: any) {
            toast({ title: "Erreur", description: error.message, variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-4 p-2 rounded-md transition-colors hover:bg-muted/50">
            <Image 
                src={product.imageUrl}
                alt={product.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-md object-cover"
            />
            <div className="flex-1">
                <p className="font-medium text-sm">{product.name}</p>
                <p className="text-xs text-muted-foreground">${product.price.toFixed(2)}</p>
            </div>
            <Button
                size="sm"
                variant={isFeatured ? "secondary" : "outline"}
                onClick={handleToggleFeature}
                disabled={isLoading}
            >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                    isFeatured ? <MinusCircle className="h-4 w-4 mr-2" /> : <PlusCircle className="h-4 w-4 mr-2" />
                )}
                {isFeatured ? 'Retirer' : 'Présenter'}
            </Button>
        </div>
    )

}

export function FeaturedProductsManager() {
    const firestore = useFirestore();
    const { user } = useAuth();

    // Récupérer les produits du vendeur
    const sellerProductsQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(collection(firestore, 'products'), where('sellerId', '==', user.uid));
    }, [firestore, user]);
    const { data: sellerProducts, isLoading: isLoadingSellerProducts } = useCollection<Product>(sellerProductsQuery);
    
    // Récupérer les produits déjà présentés
    const featuredProductsQuery = useMemoFirebase(() => {
        return collection(firestore, 'liveSessions', LIVE_SESSION_ID, 'featuredProducts');
    }, [firestore]);
    const { data: featuredProducts, isLoading: isLoadingFeatured } = useCollection<Omit<Product, 'sellerId' | 'description'>>(featuredProductsQuery);

    const isLoading = isLoadingSellerProducts || isLoadingFeatured;

    if (isLoading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                     <div key={i} className="flex items-center gap-4 p-2">
                        <Skeleton className="h-12 w-12 rounded-md" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/4" />
                        </div>
                        <Skeleton className="h-9 w-24 rounded-md" />
                    </div>
                ))}
            </div>
        )
    }

    if (!sellerProducts || sellerProducts.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <p>Vous n'avez aucun produit à présenter.</p>
                <p className="text-sm">Ajoutez des produits depuis votre espace vendeur.</p>
            </div>
        )
    }
    
    const featuredProductIds = new Set(featuredProducts?.map(p => p.id));

    return (
        <ScrollArea className="h-full">
            <div className="space-y-2">
                {sellerProducts.map(product => (
                    <ProductItem
                        key={product.id}
                        product={product}
                        isFeatured={featuredProductIds.has(product.id)}
                    />
                ))}
            </div>
        </ScrollArea>
    )
}

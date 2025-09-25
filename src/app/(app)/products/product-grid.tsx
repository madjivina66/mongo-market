
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlusCircle, Search } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { getProducts, getCategories } from '@/lib/firebase-data';
import { useFirestore } from '@/firebase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

function ProductCardSkeleton() {
    return (
        <Card className="flex flex-col overflow-hidden">
            <CardHeader className="p-0">
                <Skeleton className="h-48 w-full" />
            </CardHeader>
            <CardContent className="flex-1 p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="mt-2 h-4 w-full" />
            </CardContent>
            <CardFooter className="flex items-center justify-between p-4 pt-0">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-9 w-24" />
            </CardFooter>
        </Card>
    )
}

export default function ProductGrid() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const { cartItems, addToCart } = useCart();
  const { toast } = useToast();
  const firestore = useFirestore(); // Hook pour obtenir l'instance Firestore client

  useEffect(() => {
    async function fetchData() {
      // S'assurer que firestore est disponible avant de faire des appels
      if (!firestore) return;
      setLoading(true);
      try {
        // Appeler les fonctions de firebase-data avec l'instance de la DB
        const [products, fetchedCategories] = await Promise.all([
          getProducts(firestore),
          getCategories(firestore),
        ]);
        setAllProducts(products);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch products or categories:", error);
        toast({
            title: "Erreur de chargement",
            description: "Impossible de récupérer les produits depuis la base de données.",
            variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [firestore, toast]); // L'effet dépend maintenant de firestore et toast
  
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const matchesCategory =
        selectedCategory === 'Tout' || product.category === selectedCategory;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allProducts, selectedCategory, searchTerm]);
  
  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: "Ajouté au panier",
      description: `${product.name} a été ajouté à votre panier.`,
    });
  };

  const getCartItemQuantity = (productId: string) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher des produits..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10"
            />
        </div>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:grid-cols-none md:inline-flex">
            {loading ? (
                <>
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-20" />
                </>
            ) : (
                categories.map(category => (
                <TabsTrigger key={category} value={category}>
                    {category}
                </TabsTrigger>
                ))
            )}
          </TabsList>
        </Tabs>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map(product => {
            const quantityInCart = getCartItemQuantity(product.id);
            return (
              <Card key={product.id} className="flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <CardHeader className="p-0">
                  <Link href={`/products/${product.id}`} className="block">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={600}
                      height={400}
                      className="h-48 w-full object-cover"
                      data-ai-hint={product.imageHint}
                    />
                  </Link>
                </CardHeader>
                <CardContent className="flex-1 p-4">
                  <CardTitle className="font-headline text-lg tracking-normal">
                      <Link href={`/products/${product.id}`}>{product.name}</Link>
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm">{product.description}</CardDescription>
                </CardContent>
                <CardFooter className="flex items-center justify-between p-4 pt-0">
                  <span className="text-xl font-bold text-primary">${product.price.toFixed(2)}</span>
                  <Button variant="outline" size="sm" onClick={() => handleAddToCart(product)} className="relative">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter
                    {quantityInCart > 0 && (
                        <Badge className="absolute -right-2 -top-2 h-5 w-5 justify-center rounded-full p-0">
                            {quantityInCart}
                        </Badge>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-lg text-muted-foreground">Aucun résultat trouvé pour "{searchTerm}".</p>
        </div>
      )}
    </div>
  );
}

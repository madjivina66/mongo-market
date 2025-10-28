
'use client';

import React, { useState, useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase, useAuth } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import ProductGrid from './product-grid';

function ProductsPageSkeleton() {
  return (
    <>
      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full md:w-96" />
      </div>
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
    </>
  );
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const firestore = useFirestore();
  const { user, loading: authLoading } = useAuth(); // Utiliser le hook useAuth pour vérifier l'état de connexion

  // La requête ne sera préparée que si l'utilisateur est authentifié (même anonymement)
  const productsQuery = useMemoFirebase(() => {
    if (authLoading || !user) return null;
    return query(collection(firestore, 'products'));
  }, [firestore, authLoading, user]);

  const { data: allProducts, isLoading: isLoadingProducts } = useCollection<Product>(productsQuery);
  
  // L'état de chargement global dépend maintenant aussi de l'authentification et des produits
  const isLoading = authLoading || isLoadingProducts;

  const categories = useMemo(() => {
    if (!allProducts) return ['Tout'];
    const uniqueCategories = new Set(allProducts.map(p => p.category));
    return ['Tout', ...Array.from(uniqueCategories)];
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    return allProducts.filter(product => {
      const matchesCategory =
        selectedCategory === 'Tout' || product.category === selectedCategory;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allProducts, selectedCategory, searchTerm]);

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

      {isLoading || !allProducts ? (
        <ProductsPageSkeleton />
      ) : (
        <>
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
                {categories.map(category => (
                <TabsTrigger key={category} value={category}>
                    {category}
                </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <ProductGrid products={filteredProducts} />
        </>
      )}
    </div>
  );
}

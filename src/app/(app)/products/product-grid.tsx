'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlusCircle, Search } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
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

interface ProductGridProps {
  allProducts: Product[];
  categories: string[];
}

export default function ProductGrid({ allProducts, categories }: ProductGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveFilter(searchTerm);
  };
  
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const matchesCategory =
        selectedCategory === 'Tout' || product.category === selectedCategory;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(activeFilter.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allProducts, selectedCategory, activeFilter]);
  
  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: "Ajouté au panier",
      description: `${product.name} a été ajouté à votre panier.`,
    });
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <Input
              type="search"
              placeholder="Rechercher des produits..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full"
            />
            <Button type="submit" aria-label="Rechercher">
                <Search className="h-4 w-4" />
            </Button>
        </form>
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

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map(product => (
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
                <Button variant="outline" size="sm" onClick={() => handleAddToCart(product)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Ajouter
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-lg text-muted-foreground">Aucun résultat trouvé.</p>
        </div>
      )}
    </div>
  );
}

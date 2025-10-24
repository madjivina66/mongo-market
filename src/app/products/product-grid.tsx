
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const { cartItems, addToCart } = useCart();
  const { toast } = useToast();

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
  
  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-muted-foreground">Aucun produit trouvé.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map(product => {
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
  );
}

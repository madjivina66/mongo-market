'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { products } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products.find(p => p.id === params.id);
  const { addToCart } = useCart();
  const { toast } = useToast();

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
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
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

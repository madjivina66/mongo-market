'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, ShoppingCart, X } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from './ui/scroll-area';

export function ShoppingCartButton() {
  const { cartCount } = useCart();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative rounded-full">
          <ShoppingCart className="h-5 w-5 text-primary" />
          <span className="sr-only">Ouvrir le panier</span>
          {cartCount > 0 && (
            <Badge
              variant="default"
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary p-0 text-xs text-primary-foreground"
            >
              {cartCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-headline">Panier</SheetTitle>
        </SheetHeader>
        <CartContents />
      </SheetContent>
    </Sheet>
  );
}

function CartContents() {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <ShoppingCart className="h-16 w-16 text-muted-foreground" />
        <p className="text-muted-foreground">Votre panier est vide.</p>
        <SheetTrigger asChild>
            <Button asChild variant="outline">
                <Link href="/products">Continuer vos achats</Link>
            </Button>
        </SheetTrigger>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="flex-1 -mx-6">
        <div className="flex flex-col gap-4 px-6">
        {cartItems.map(item => (
          <div key={item.id} className="flex items-center gap-4">
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={64}
              height={64}
              className="rounded-md object-cover"
              data-ai-hint={item.imageHint}
            />
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
              <div className="mt-2 flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  <Minus className="h-3 w-3" />
                </Button>
                <span>{item.quantity}</span>
                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        </div>
      </ScrollArea>
      <SheetFooter className="mt-4">
        <div className="w-full space-y-4">
            <div className="flex justify-between font-bold text-lg">
                <span>Sous-total</span>
                <span>${cartTotal.toFixed(2)}</span>
            </div>
             <SheetTrigger asChild>
                <Button asChild size="lg" className="w-full font-headline text-lg">
                    <Link href="/checkout">Passer à la caisse</Link>
                </Button>
            </SheetTrigger>
            <Button variant="outline" className="w-full" onClick={clearCart}>
                Vider le panier
            </Button>
        </div>
      </SheetFooter>
    </>
  );
}

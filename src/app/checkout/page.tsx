
'use client';

import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Smartphone } from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="text-center">
        <h1 className="font-headline text-3xl font-bold">Votre panier est vide</h1>
        <p className="mt-2 text-muted-foreground">Ajoutez des produits pour passer à la caisse.</p>
        <Button asChild className="mt-6">
          <Link href="/products">Aller aux produits</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-8 text-center font-headline text-4xl font-bold text-primary">Caisse</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Résumé de la commande</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Moyen de paiement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">Sélectionnez votre moyen de paiement. Vous serez redirigé pour finaliser le paiement.</p>
            <div className="space-y-4">
              <Button asChild size="lg" className="w-full justify-start gap-4">
                <a href="https://stripe.com" target="_blank" rel="noopener noreferrer">
                  <CreditCard />
                  Payer par carte de crédit
                </a>
              </Button>
              <Button asChild size="lg" className="w-full justify-start gap-4" variant="secondary">
                 <a href="https://www.moov-africa.com/" target="_blank" rel="noopener noreferrer">
                  <Smartphone />
                  Payer avec Moov Money
                 </a>
              </Button>
              <Button asChild size="lg" className="w-full justify-start gap-4" variant="secondary">
                 <a href="https://www.airtel.com/" target="_blank" rel="noopener noreferrer">
                  <Smartphone />
                  Payer avec Airtel Money
                 </a>
              </Button>
            </div>
          </CardContent>
           <CardFooter>
            <p className="text-xs text-muted-foreground">
                Note : Ceci est une démo. Les paiements réels ne sont pas traités. Cliquer sur un moyen de paiement ouvrira le site web du fournisseur dans un nouvel onglet.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

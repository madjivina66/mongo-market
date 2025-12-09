
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Smartphone, CheckCircle, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';

type PaymentMethod = {
  name: string;
  number: string;
};

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    { name: 'Moov Money', number: '+235 95 38 38 77' },
    { name: 'Airtel Money', number: '+235 67 72 71 71' },
  ];

  const handlePayment = () => {
    setIsProcessing(true);
    // Simuler un délai de traitement du paiement
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      // Vider le panier après une simulation réussie
      // Pas besoin, car on redirigera l'utilisateur
    }, 2000);
  };
  
  const handleFinish = () => {
      clearCart();
      router.push('/orders');
  }

  if (cartItems.length === 0 && !paymentSuccess) {
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

  if (paymentSuccess) {
    return (
        <div className="flex flex-col items-center justify-center text-center">
            <CheckCircle className="h-24 w-24 text-green-500" />
            <h1 className="mt-6 font-headline text-3xl font-bold">Paiement réussi !</h1>
            <p className="mt-2 text-muted-foreground">Votre commande a été passée avec succès.</p>
            <Button onClick={handleFinish} className="mt-8">
                Voir mes commandes
            </Button>
        </div>
    )
  }

  return (
    <>
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
              <p className="mb-4 text-muted-foreground">Sélectionnez votre moyen de paiement.</p>
              <div className="space-y-4">
                 <Button
                  size="lg"
                  className="w-full justify-start gap-4"
                  variant="outline"
                  disabled={true}
                >
                  <CreditCard />
                  Payer par carte de crédit (Bientôt disponible)
                </Button>
                {paymentMethods.map(method => (
                  <Button
                    key={method.name}
                    size="lg"
                    className="w-full justify-start gap-4"
                    variant="secondary"
                    onClick={() => setSelectedPayment(method)}
                  >
                    <Smartphone />
                    {method.name}
                  </Button>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                Note : Ceci est une démo. Les paiements réels ne sont pas traités.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>

      <AlertDialog open={!!selectedPayment} onOpenChange={(open) => !open && setSelectedPayment(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer le paiement</AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes sur le point de payer un total de <strong className="text-foreground">${cartTotal.toFixed(2)}</strong> via {selectedPayment?.name} au numéro <strong className="text-foreground">{selectedPayment?.number}</strong>.
              <br />
              Ceci est une simulation. Voulez-vous continuer ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handlePayment} disabled={isProcessing}>
              {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isProcessing ? 'Traitement...' : 'Confirmer et Payer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

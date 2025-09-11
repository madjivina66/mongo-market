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
        <h1 className="font-headline text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add some products to proceed to checkout.</p>
        <Button asChild className="mt-6">
          <Link href="/products">Go to Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-8 text-center font-headline text-4xl font-bold text-primary">Checkout</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Order Summary</CardTitle>
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
            <CardTitle className="font-headline">Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">Select your payment method. You will be redirected to complete the payment.</p>
            <div className="space-y-4">
              <Button asChild size="lg" className="w-full justify-start gap-4">
                <a href="https://stripe.com" target="_blank" rel="noopener noreferrer">
                  <CreditCard />
                  Pay with Credit Card
                </a>
              </Button>
              <Button asChild size="lg" className="w-full justify-start gap-4" variant="secondary">
                 <a href="https://www.moov-africa.com/" target="_blank" rel="noopener noreferrer">
                  <Smartphone />
                  Pay with Moov Money
                 </a>
              </Button>
              <Button asChild size="lg" className="w-full justify-start gap-4" variant="secondary">
                 <a href="https://www.airtel.com/" target="_blank" rel="noopener noreferrer">
                  <Smartphone />
                  Pay with Airtel Money
                 </a>
              </Button>
            </div>
          </CardContent>
           <CardFooter>
            <p className="text-xs text-muted-foreground">
                Note: This is a demo. Real payments are not processed. Clicking a payment method will open the provider's website in a new tab.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

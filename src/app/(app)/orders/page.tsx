'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getOrders } from '@/lib/firebase-data';
import type { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Calendar, Hash, DollarSign, Package, Truck, CheckCircle2, ShoppingCart } from 'lucide-react';

const statusInfo = {
  'Livrée': { icon: CheckCircle2, color: 'text-green-500', bgColor: 'bg-green-500/10' },
  'Expédiée': { icon: Truck, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  'En traitement': { icon: Package, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
};


function OrderCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-24" />
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-5 w-20" />
        </div>
         <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-5 w-20" />
        </div>
         <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-5 w-20" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-32" />
      </CardFooter>
    </Card>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const fetchedOrders = await getOrders();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-5xl">
          Mes commandes
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Suivez l'historique de vos achats ici.
        </p>
      </header>

      {loading ? (
        <div className="grid gap-6">
          <OrderCardSkeleton />
          <OrderCardSkeleton />
          <OrderCardSkeleton />
        </div>
      ) : orders.length > 0 ? (
        <div className="grid gap-6">
          {orders.map(order => {
             const currentStatusInfo = statusInfo[order.status] || statusInfo['En traitement'];
             const Icon = currentStatusInfo.icon;
            return (
              <Card key={order.id} className="transition-all hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-headline text-xl">
                    Commande #{order.id}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{order.date}</span>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
                  <div className="flex items-center gap-3">
                     <div className={`flex h-8 w-8 items-center justify-center rounded-full ${currentStatusInfo.bgColor}`}>
                        <Icon className={`h-5 w-5 ${currentStatusInfo.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Statut</p>
                      <p className="font-semibold">{order.status}</p>
                    </div>
                  </div>
                   <div className="flex items-center gap-3">
                     <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50">
                        <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Articles</p>
                      <p className="font-semibold">{order.items}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="font-semibold">${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" disabled>
                        <Truck className="mr-2 h-4 w-4" />
                        Suivre la commande (Indisponible)
                    </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="py-16 text-center">
            <CardContent className="flex flex-col items-center gap-4">
                <ShoppingCart className="h-16 w-16 text-muted-foreground/50" />
                <h2 className="font-headline text-2xl">Vous n'avez pas encore de commandes.</h2>
                <p className="text-muted-foreground">Passez votre première commande pour la voir apparaître ici.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}

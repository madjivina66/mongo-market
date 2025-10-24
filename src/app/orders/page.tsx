
'use client';

import { useMemo } from 'react';
import { collection, query } from 'firebase/firestore';
import { useAuth, useCollection, useFirestore, useMemoFirebase, type WithId } from '@/firebase'; 
import type { Order } from '@/lib/types';

import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart } from 'lucide-react';

const statusStyles: { [key: string]: string } = {
  'Livrée': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'En traitement': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  'Expédiée': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'En attente': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
};


function OrdersSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes commandes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID de commande</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-6 w-28 rounded-full" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function OrdersList({ orders }: { orders: WithId<Order>[] }) {
    if (orders.length === 0) {
        return (
            <Card className="py-16 text-center">
                <CardContent className="flex flex-col items-center gap-4">
                    <ShoppingCart className="h-16 w-16 text-muted-foreground/50" />
                    <h2 className="font-headline text-2xl">Vous n'avez pas encore de commandes.</h2>
                    <p className="text-muted-foreground">Passez votre première commande pour la voir apparaître ici.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID de commande</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map(order => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium text-primary">#{order.id.substring(0, 7)}</TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusStyles[order.status]}>{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">${order.totalAmount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    );
}


export default function OrdersPage() {
  const firestore = useFirestore();
  const { user } = useAuth();

  // Créez une requête pour les commandes de l'utilisateur actuel, stockées dans une sous-collection.
  const ordersQuery = useMemoFirebase(() => {
    if (!user) return null;
    // La requête pointe maintenant vers la sous-collection `orders` du profil de l'utilisateur.
    return query(collection(firestore, 'userProfiles', user.uid, 'orders'));
  }, [firestore, user]);

  // Utilisez le hook useCollection pour écouter les données en temps réel.
  const { data: orders, isLoading } = useCollection<Order>(ordersQuery);

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

      {isLoading || !orders ? (
        <OrdersSkeleton />
      ) : (
        <OrdersList orders={orders} />
      )}
    </div>
  );
}

    
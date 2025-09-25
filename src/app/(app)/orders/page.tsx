
'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useFirestore } from '@/firebase'; // Utiliser le nouveau hook
import type { Order } from '@/lib/types';

import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart } from 'lucide-react';

const statusStyles = {
  'Livrée': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'En traitement': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  'Expédiée': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
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
              <TableHead>Articles</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-6 w-28 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore(); // Obtenir l'instance de Firestore depuis le hook

  useEffect(() => {
    // Attendre que l'instance de firestore soit disponible
    if (!firestore) {
      setLoading(true);
      return;
    }

    // Dans une vraie application, on filtrerait les commandes par l'ID de l'utilisateur connecté.
    const q = query(collection(firestore, 'orders'));
    
    // onSnapshot écoute les changements en temps réel
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedOrders: Order[] = [];
      querySnapshot.forEach((doc) => {
        fetchedOrders.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(fetchedOrders);
      setLoading(false);
    }, (error) => {
      console.error("Failed to fetch real-time orders:", error);
      setLoading(false);
    });

    // La fonction de nettoyage se désabonne de l'écouteur lorsque le composant est démonté
    return () => unsubscribe();
  }, [firestore]); // L'effet dépend de l'instance de firestore

  if (loading) {
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
            <OrdersSkeleton />
        </div>
    );
  }

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

      {orders.length > 0 ? (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID de commande</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Articles</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map(order => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium text-primary">#{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusStyles[order.status]}>{order.status}</Badge>
                    </TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
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

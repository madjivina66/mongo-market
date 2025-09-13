'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { getOrders } from '@/lib/firebase-data';
import type { Order } from '@/lib/types';

function OrderRowSkeleton() {
  return (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
      <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
    </TableRow>
  )
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const fetchedOrders = await getOrders();
      setOrders(fetchedOrders);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-8 text-center font-headline text-4xl font-bold text-primary">Mes commandes</h1>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Historique des commandes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Commande</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Articles</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <>
                  <OrderRowSkeleton />
                  <OrderRowSkeleton />
                  <OrderRowSkeleton />
                </>
              ) : orders.map(order => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === 'Livrée' ? 'default' : 
                        order.status === 'Expédiée' ? 'secondary' : 'outline'
                      }
                      className={
                        order.status === 'Livrée' ? 'bg-primary/80' : 
                        order.status === 'Expédiée' ? 'bg-yellow-500/80 text-white' : ''
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {!loading && orders.length === 0 && (
            <div className="py-16 text-center text-muted-foreground">
              Vous n'avez pas encore de commandes.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

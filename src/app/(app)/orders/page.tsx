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
import { getOrders } from '@/lib/firebase-data';

export default async function OrdersPage() {
  const orders = await getOrders();

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
              {orders.map(order => (
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
        </CardContent>
      </Card>
    </div>
  );
}


'use client';

import { Bell, ShoppingCart, Tag, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const notifications = [
  {
    icon: <ShoppingCart className="h-6 w-6 text-primary" />,
    title: "Nouvelle commande reçue",
    description: "Vous avez une nouvelle commande #7564 pour des Tomates Fraîches.",
    time: "il y a 5 minutes",
    isNew: true,
  },
  {
    icon: <Truck className="h-6 w-6 text-blue-500" />,
    title: "Produit expédié",
    description: "Votre commande de Pommes Gala a été expédiée.",
    time: "il y a 2 heures",
    isNew: true,
  },
  {
    icon: <Tag className="h-6 w-6 text-green-500" />,
    title: "Promotion spéciale",
    description: "Bénéficiez de -15% sur tous les produits de la catégorie 'Fruits'.",
    time: "il y a 1 jour",
    isNew: false,
  },
  {
    icon: <Bell className="h-6 w-6 text-yellow-500" />,
    title: "Stock faible",
    description: "Votre produit 'Filet de Poulet' est presque en rupture de stock.",
    time: "il y a 2 jours",
    isNew: false,
  },
];

export default function NotificationsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-5xl">
          Notifications
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Restez à jour avec les dernières activités de votre compte.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {notifications.map((notification, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  {notification.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{notification.title}</h3>
                    {notification.isNew && <Badge>Nouveau</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {notification.description}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground/80">
                    {notification.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
       <p className="mt-8 text-center text-xs text-muted-foreground">
            Note : Ceci est une démo. Les notifications sont statiques et ne reflètent pas des données réelles.
        </p>
    </div>
  );
}

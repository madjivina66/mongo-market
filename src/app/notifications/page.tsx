
'use client';

import { Bell, ShoppingCart, Tag, Truck, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth, useCollection, useFirestore, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import type { Notification, WithId } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const notificationIcons: { [key in Notification['type']]: React.ReactNode } = {
  order: <ShoppingCart className="h-6 w-6 text-primary" />,
  shipping: <Truck className="h-6 w-6 text-blue-500" />,
  promo: <Tag className="h-6 w-6 text-green-500" />,
  system: <AlertCircle className="h-6 w-6 text-yellow-500" />,
};

function NotificationSkeleton() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Chargement...</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-3 w-1/4" />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuth();
  const firestore = useFirestore();

  const notificationsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'userProfiles', user.uid, 'notifications'), orderBy('timestamp', 'desc'));
  }, [firestore, user]);

  const { data: notifications, isLoading: notificationsLoading } = useCollection<Notification>(notificationsQuery);
  const isLoading = authLoading || notificationsLoading;

  const markAsRead = (notificationId: string) => {
    if (!user) return;
    const notifRef = doc(firestore, 'userProfiles', user.uid, 'notifications', notificationId);
    setDocumentNonBlocking(notifRef, { isRead: true }, { merge: true });
  }
  
  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'un instant';
    const date = timestamp.toDate();
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  };

  const renderContent = () => {
    if (isLoading) {
      return <NotificationSkeleton />;
    }

    if (!notifications || notifications.length === 0) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Aucune notification</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <Bell className="h-20 w-20 text-muted-foreground/30" />
            <p className="text-muted-foreground">Vous n'avez aucune notification pour le moment.</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {notifications.map((notification: WithId<Notification>) => {
              const content = (
                 <div key={notification.id} className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    {notificationIcons[notification.type] || <Bell />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{notification.title}</h3>
                      {!notification.isRead && <Badge>Nouveau</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground/80">
                      {formatTimestamp(notification.timestamp)}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>Marquer comme lu</Button>
                  )}
                </div>
              );
              
              if (notification.link) {
                  return <Link href={notification.link} key={notification.id} className="block rounded-lg p-2 hover:bg-muted/50">{content}</Link>
              }
              return content;
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

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
      {renderContent()}
    </div>
  );
}


'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { collection, query, where } from 'firebase/firestore';
import { useAuth, useCollection, useFirestore, useMemoFirebase, type WithId } from '@/firebase'; 
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

function MyProductsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes produits</CardTitle>
        <CardDescription>Chargement de la liste de vos produits...</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="hidden sm:table-cell"><Skeleton className="h-12 w-12 rounded-md" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-8 w-8" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function MyProductsList({ products }: { products: WithId<Product>[] }) {
    if (products.length === 0) {
        return (
            <div className="text-center py-16 border rounded-lg">
                <h2 className="font-headline text-2xl">Vous n'avez aucun produit.</h2>
                <p className="mt-2 text-muted-foreground">Commencez par ajouter votre premier produit.</p>
                <Button asChild className="mt-6">
                    <Link href="/admin/add-product">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter un produit
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead className="text-right">Prix</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map(product => (
                  <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                        <Image 
                            alt={product.name}
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={product.imageUrl}
                            width="64"
                        />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                     <TableCell>
                        <Button size="sm" variant="outline" disabled>Modifier</Button>
                        <Button size="sm" variant="destructive" className="ml-2" disabled>Supprimer</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    );
}

export default function MyProductsPage() {
  const firestore = useFirestore();
  const { user } = useAuth();

  const productsQuery = useMemoFirebase(() => {
    if (!user) return null;
    // Crée une requête qui filtre les produits par l'ID du vendeur (l'utilisateur connecté)
    return query(collection(firestore, 'products'), where('sellerId', '==', user.uid));
  }, [firestore, user]);

  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8 flex items-center justify-between">
        <div>
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-5xl">
            Mes Produits
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
            Gérez votre inventaire de produits ici.
            </p>
        </div>
         <Button asChild>
            <Link href="/admin/add-product">
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter un produit
            </Link>
        </Button>
      </header>

      {isLoading || !products ? (
        <MyProductsSkeleton />
      ) : (
        <MyProductsList products={products} />
      )}
    </div>
  );
}

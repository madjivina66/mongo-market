
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { collection, query, where } from 'firebase/firestore';
import { useAuth, useCollection, useFirestore, useMemoFirebase, type WithId } from '@/firebase'; 
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { PlusCircle, MoreHorizontal, Loader2 } from 'lucide-react';
import { deleteProduct } from './actions';


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
    const [isDeleting, setIsDeleting] = useState(false);
    const [productToDelete, setProductToDelete] = useState<WithId<Product> | null>(null);
    const { toast } = useToast();
    const { user } = useAuth();
    
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

    const handleConfirmDelete = async () => {
        if (!productToDelete || !user) return;

        setIsDeleting(true);
        try {
            const idToken = await user.getIdToken(true);
            const result = await deleteProduct(productToDelete.id, idToken);
            if (result.error) {
                throw new Error(result.error);
            }
            toast({
                title: "Succès",
                description: `Le produit "${productToDelete.name}" a été supprimé.`,
            });
        } catch (e: any) {
            toast({
                title: "Erreur",
                description: e.message || "Impossible de supprimer le produit.",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
            setProductToDelete(null);
        }
    };


    return (
        <>
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
                     <TableCell className="text-right">
                        <Button size="sm" variant="outline" asChild>
                            <Link href={`/admin/edit-product/${product.id}`}>Modifier</Link>
                        </Button>
                        <Button size="sm" variant="destructive" className="ml-2" onClick={() => setProductToDelete(product)}>Supprimer</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <AlertDialog open={!!productToDelete} onOpenChange={(isOpen) => !isOpen && setProductToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce produit ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Cette action est irréversible. Le produit &quot;{productToDelete?.name}&quot; sera définitivement supprimé.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Supprimer
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    );
}

export default function MyProductsPage() {
  const firestore = useFirestore();
  const { user } = useAuth();

  const productsQuery = useMemoFirebase(() => {
    if (!user) return null;
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

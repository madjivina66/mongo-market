
'use client';

import { useAuth } from '@/context/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Skeleton } from './ui/skeleton';
import { useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { collection, doc, query, where } from 'firebase/firestore';
import type { Product } from '@/lib/types';


export function UserNav() {
  const { user, logout, loading } = useAuth();
  const isAuthenticated = !!user && !user.isAnonymous;
  const firestore = useFirestore();

  // Déterminer si l'utilisateur est un vendeur
  const sellerProductsQuery = useMemoFirebase(() => {
    if (!isAuthenticated) return null;
    return query(collection(firestore, 'products'), where('sellerId', '==', user.uid));
  }, [firestore, user, isAuthenticated]);
  const { data: sellerProducts, isLoading: isLoadingSellerProducts } = useCollection<Product>(sellerProductsQuery);
  const isSeller = isAuthenticated && (sellerProducts ? sellerProducts.length > 0 : false);
  const isLoading = loading || (isAuthenticated && isLoadingSellerProducts);


  if (isLoading) {
    return <Skeleton className="h-9 w-9 rounded-full" />;
  }

  if (!user || user.isAnonymous) {
    return (
      <Button asChild>
        <Link href="/login">Connexion</Link>
      </Button>
    );
  }

  const getInitials = (email: string) => {
    return email ? email.charAt(0).toUpperCase() : 'U';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.photoURL || ''} alt="User avatar" />
            <AvatarFallback>{getInitials(user.email || '')}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Mon compte</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/profile" passHref>
            <DropdownMenuItem>Profil</DropdownMenuItem>
          </Link>
           <Link href="/notifications" passHref>
            <DropdownMenuItem>Notifications</DropdownMenuItem>
          </Link>
          <Link href="/orders" passHref>
            <DropdownMenuItem>Commandes</DropdownMenuItem>
          </Link>
          <Link href="/subscription" passHref>
            <DropdownMenuItem>Abonnement</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
         {/* Lien "Devenir Vendeur" conditionnel */}
        {!isSeller && (
            <>
                <Link href="/devenir-vendeur" passHref>
                    <DropdownMenuItem>
                        Devenir Vendeur
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
            </>
        )}
        <DropdownMenuItem onClick={logout}>Déconnexion</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

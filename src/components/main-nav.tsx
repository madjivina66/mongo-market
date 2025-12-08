'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  LayoutGrid,
  BarChart,
  User,
  LogIn,
  LogOut,
  Gem,
  PlusSquare,
  List,
  Radio,
  Megaphone,
  Bell,
  Store,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { collection, doc, query, where } from 'firebase/firestore';
import type { UserProfile, Product } from '@/lib/types';


import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton
} from '@/components/ui/sidebar';

const baseLinks = [
  { href: '/products', label: 'Produits', icon: LayoutGrid },
  { href: '/strategie', label: 'Stratégie', icon: Megaphone },
];

const authenticatedLinks = [
  { href: '/orders', label: 'Mes commandes', icon: ShoppingBag },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/profile', label: 'Profil', icon: User },
  { href: '/subscription', label: 'Devenir Pro', icon: Gem },
];

const sellerLinks = [
  { href: '/live', label: 'Live', icon: Radio },
  { href: '/vendeur/mes-produits', label: 'Mes Produits', icon: List },
  { href: '/vendeur/ajouter-produit', label: 'Ajouter un produit', icon: PlusSquare },
];

const proLinks = [
    { href: '/vendeur/ad-optimizer', label: 'Optimiseur de pub', icon: BarChart, isPro: true },
];

const unauthenticatedLinks = [
    { href: '/login', label: 'Connexion', icon: LogIn },
];

export function MainNav() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const isAuthenticated = !!user && !user.isAnonymous;
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!isAuthenticated) return null;
    return doc(firestore, 'userProfiles', user.uid);
  }, [firestore, user, isAuthenticated]);

  const { data: profile, isLoading: isLoadingProfile } = useDoc<UserProfile>(userProfileRef);

  const sellerProductsQuery = useMemoFirebase(() => {
    if (!isAuthenticated) return null;
    return query(collection(firestore, 'products'), where('sellerId', '==', user.uid));
  }, [firestore, user, isAuthenticated]);

  const { data: sellerProducts, isLoading: isLoadingSellerProducts } = useCollection<Product>(sellerProductsQuery);

  const isProUser = profile?.isPro ?? false;
  
  // Un utilisateur est un vendeur s'il est authentifié et a au moins un produit
  const isSeller = isAuthenticated && (sellerProducts ? sellerProducts.length > 0 : false);
  const isLoading = loading || isLoadingProfile || (isAuthenticated && isLoadingSellerProducts);


  if (isLoading) {
      return (
          <SidebarMenu>
              {Array.from({length: 8}).map((_, i) => (
                   <SidebarMenuSkeleton key={i} />
              ))}
          </SidebarMenu>
      )
  }

  const linksToRender = [...baseLinks];

  if (isAuthenticated) {
    linksToRender.push(...authenticatedLinks);
    if(isSeller) {
      linksToRender.push(...sellerLinks);
      if (isProUser) {
        linksToRender.push(...proLinks);
      }
    }
  } else {
    linksToRender.push(...unauthenticatedLinks);
  }

  return (
    <SidebarMenu>
      {linksToRender.map(link => (
          <SidebarMenuItem key={link.href}>
            <Link href={link.href} className="w-full">
              <SidebarMenuButton
                isActive={pathname.startsWith(link.href)}
                className="w-full justify-start"
                tooltip={link.label}
              >
                <link.icon className="h-5 w-5 text-primary" />
                <span>{link.label}</span>
                {link.isPro && <Gem className="ml-auto h-4 w-4 text-yellow-500" />}
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
      ))}

      {isAuthenticated && (
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={logout}
            className="w-full justify-start"
            tooltip="Déconnexion"
          >
            <LogOut className="h-5 w-5 text-primary" />
            <span>Déconnexion</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}

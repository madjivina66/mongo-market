
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
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';


import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton
} from '@/components/ui/sidebar';

const links = [
  { href: '/products', label: 'Produits', icon: LayoutGrid, protected: false },
  { href: '/orders', label: 'Mes commandes', icon: ShoppingBag, protected: true },
  { href: '/live', label: 'Live', icon: Radio, protected: true },
  { href: '/admin/add-product', label: 'Ajouter un produit', icon: PlusSquare, protected: true },
  { href: '/admin/my-products', label: 'Mes Produits', icon: List, protected: true },
  { href: '/profile', label: 'Profil', icon: User, protected: true },
  { href: '/strategie', label: 'Stratégie', icon: Megaphone, protected: false },
  { href: '/subscription', label: 'Devenir Pro', icon: Gem, protected: true },
];

const proLinks = [
    { href: '/admin/ad-optimizer', label: 'Optimiseur de pub', icon: BarChart, protected: true, isPro: true },
];

const linksUnauthenticated = [
    { href: '/login', label: 'Connexion', icon: LogIn },
];

export function MainNav() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const isAuthenticated = !!user && !user.isAnonymous;
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    // CORRECTION : Ne pas essayer de charger le profil pour les utilisateurs anonymes ou non connectés
    if (!user || user.isAnonymous) return null;
    return doc(firestore, 'userProfiles', user.uid);
  }, [firestore, user]);

  const { data: profile, isLoading: isLoadingProfile } = useDoc<UserProfile>(userProfileRef);

  const isProUser = profile?.isPro ?? false;

  if (loading || (isAuthenticated && isLoadingProfile)) {
      return (
          <SidebarMenu>
              {Array.from({length: 5}).map((_, i) => (
                   <SidebarMenuSkeleton key={i} />
              ))}
          </SidebarMenu>
      )
  }

  const allLinks = isAuthenticated ? [...links, ...(isProUser ? proLinks : [])] : linksUnauthenticated;

  return (
    <SidebarMenu>
      {allLinks.map(link => {
        // Hide pro links if user is not pro, even if authenticated
        if (link.isPro && !isProUser) return null;
        // Hide protected links if not authenticated
        if (link.protected && !isAuthenticated) return null;
        
        // Custom rule for "Stratégie" link
        if (link.href === '/strategie' && isAuthenticated) return null;

        return (
          <SidebarMenuItem key={link.href}>
            <Link href={link.href} className="w-full">
              <SidebarMenuButton
                isActive={pathname === link.href}
                className="w-full justify-start"
                tooltip={link.label}
              >
                <link.icon className="h-5 w-5 text-primary" />
                <span>{link.label}</span>
                {link.isPro && <Gem className="ml-auto h-4 w-4 text-yellow-500" />}
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        )
      })}

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

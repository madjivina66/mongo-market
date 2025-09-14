'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  LayoutGrid,
  BarChart,
  User,
  LogIn,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const links = [
  { href: '/products', label: 'Produits', icon: LayoutGrid },
  { href: '/orders', label: 'Mes commandes', icon: ShoppingBag, protected: true },
  { href: '/profile', label: 'Profil', icon: User, protected: true },
  { href: '/admin/ad-optimizer', label: 'Optimiseur de pub', icon: BarChart, protected: true },
];

const linksUnauthenticated = [
    { href: '/login', label: 'Connexion', icon: LogIn },
];

export function MainNav() {
  const pathname = usePathname();
  // Pour l'instant, on simule un utilisateur non authentifié. 
  // On remplacera `isAuthenticated` par une vraie logique plus tard.
  const isAuthenticated = false; 

  return (
    <SidebarMenu>
      {links.map(link => {
        if (link.protected && !isAuthenticated) return null;
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
                </SidebarMenuButton>
            </Link>
            </SidebarMenuItem>
        );
      })}
      {!isAuthenticated && linksUnauthenticated.map(link => (
         <SidebarMenuItem key={link.href}>
            <Link href={link.href} className="w-full">
                <SidebarMenuButton
                isActive={pathname === link.href}
                className="w-full justify-start"
                tooltip={link.label}
                >
                <link.icon className="h-5 w-5 text-primary" />
                <span>{link.label}</span>
                </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

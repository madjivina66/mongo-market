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
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Button } from './ui/button';

const links = [
  { href: '/products', label: 'Produits', icon: LayoutGrid, protected: false },
  { href: '/orders', label: 'Mes commandes', icon: ShoppingBag, protected: true },
  { href: '/profile', label: 'Profil', icon: User, protected: true },
  { href: '/admin/ad-optimizer', label: 'Optimiseur de pub', icon: BarChart, protected: true },
];

const linksUnauthenticated = [
    { href: '/login', label: 'Connexion', icon: LogIn },
];

export function MainNav() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const isAuthenticated = !!user;

  if (loading) {
      return (
          <div className="p-4 space-y-2">
              {/* You can add skeleton loaders here */}
          </div>
      )
  }

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
      {!isAuthenticated ? linksUnauthenticated.map(link => (
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
      )) : (
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

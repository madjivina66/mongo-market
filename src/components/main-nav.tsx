'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  LayoutGrid,
  BarChart,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const links = [
  { href: '/products', label: 'Products', icon: LayoutGrid },
  { href: '/orders', label: 'My Orders', icon: ShoppingBag },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/admin/ad-optimizer', label: 'Ad Optimizer', icon: BarChart },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {links.map(link => (
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

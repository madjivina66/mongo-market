
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Header } from '@/components/header';
import { Logo } from '@/components/logo';
import { MainNav } from '@/components/main-nav';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

function AppLoading() {
    return (
        <div className="flex h-screen w-screen">
            <div className="hidden md:block w-64 border-r p-4 space-y-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
            <div className="flex-1 p-6">
                 <Skeleton className="h-10 w-48 mb-8" />
                 <Skeleton className="h-64 w-full" />
            </div>
        </div>
    )
}


export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Détermine si une route est protégée (commence par /admin, ou est une page personnelle)
  const isProtectedRoute = pathname.startsWith('/admin') || ['/orders', '/profile', '/subscription'].includes(pathname);

  useEffect(() => {
    // Si l'authentification est en cours, ne rien faire.
    if (loading) {
      return;
    }

    // Si on est sur une route protégée et que l'utilisateur n'est pas connecté
    // (ni en tant qu'utilisateur réel, ni en tant qu'anonyme), on redirige vers /login.
    if (isProtectedRoute && (!user || user.isAnonymous)) {
      router.push('/login');
    }
  // J'ai enlevé la logique complexe qui causait des problèmes.
  // La vérification se base maintenant uniquement sur l'état de connexion.
  }, [user, loading, router, isProtectedRoute]);

  // Affiche un écran de chargement pendant la vérification de l'authentification
  if (loading) {
    return <AppLoading />;
  }
  
  // Si on est sur une route protégée sans utilisateur valide, on affiche le chargement pour éviter un flash de contenu
  if (isProtectedRoute && (!user || user.isAnonymous)) {
    return <AppLoading />;
  }

  // Dans tous les autres cas (routes publiques ou routes protégées avec un utilisateur valide), on affiche le contenu.
  return (
      <SidebarProvider>
      <Sidebar>
          <SidebarHeader>
          <Logo />
          </SidebarHeader>
          <SidebarContent>
          <MainNav />
          </SidebarContent>
      </Sidebar>
      <SidebarInset>
          <Header />
          <main className="flex-1 p-4 sm:p-6">
          {children}
          </main>
      </SidebarInset>
      </SidebarProvider>
  );
}

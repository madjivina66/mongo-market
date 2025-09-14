'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

  useEffect(() => {
    // Si le chargement est terminé et qu'il n'y a pas d'utilisateur,
    // on redirige vers la page de connexion.
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Affiche un écran de chargement pendant la vérification de l'authentification
  if (loading) {
    return <AppLoading />;
  }
  
  // Si un utilisateur est connecté, on affiche la page
  if (user) {
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

  // Ce cas ne devrait pas être atteint si la redirection fonctionne,
  // mais c'est une sécurité.
  return null;
}

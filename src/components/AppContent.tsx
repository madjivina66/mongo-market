
"use client";

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
            <div className="hidden md:block w-64 border-r p-4 space-y-4 bg-sidebar">
                <Skeleton className="h-10 w-32 bg-sidebar-accent" />
                <Skeleton className="h-8 w-full bg-sidebar-accent" />
                <Skeleton className="h-8 w-full bg-sidebar-accent" />
                <Skeleton className="h-8 w-full bg-sidebar-accent" />
            </div>
            <div className="flex-1">
                <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
                    <Skeleton className="h-9 w-9 md:hidden" />
                    <Skeleton className="h-10 w-32" />
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <Skeleton className="h-9 w-9 rounded-full" />
                    </div>
                </header>
                 <main className="p-4 sm:p-6">
                    <Skeleton className="h-64 w-full" />
                 </main>
            </div>
        </div>
    )
}

export function AppContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isProtectedRoute = pathname.startsWith('/admin') || ['/orders', '/profile', '/subscription', '/live'].includes(pathname);
  const isAuthRoute = ['/login', '/signup'].includes(pathname);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (isProtectedRoute && (!user || user.isAnonymous)) {
      router.push('/login');
    }
     if (isAuthRoute && user && !user.isAnonymous) {
      router.push('/products');
    }
  }, [user, loading, router, isProtectedRoute, pathname, isAuthRoute]);

  if (isAuthRoute) {
      return (
        <div className="flex min-h-screen items-center justify-center p-4">
            {loading ? <AppLoading /> : children}
        </div>
      )
  }
  
  if (loading && (isProtectedRoute || !user)) {
      return <AppLoading />;
  }

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


'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/auth-context';
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
import { CartProvider } from '@/context/cart-context';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

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

function AppLayoutContent({
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
    if (loading || isAuthRoute) {
      return;
    }

    if (isProtectedRoute && (!user || user.isAnonymous)) {
      router.push('/login');
    }
  }, [user, loading, router, isProtectedRoute, pathname, isAuthRoute]);
  
  if (isAuthRoute) {
      return (
        <div className="flex min-h-screen items-center justify-center">
            {children}
        </div>
      )
  }

  if (loading || (isProtectedRoute && (!user || user.isAnonymous))) {
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


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
            </head>
            <body className="font-body antialiased animated-background">
                <FirebaseClientProvider>
                    <AuthProvider>
                        <CartProvider>
                            <FirebaseErrorListener />
                            <AppLayoutContent>{children}</AppLayoutContent>
                            <Toaster />
                        </CartProvider>
                    </AuthProvider>
                </FirebaseClientProvider>
            </body>
        </html>
    )
}


'use client';

import { AuthProvider } from '@/context/auth-context';
import { CartProvider } from '@/context/cart-context';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { AppContent } from '@/components/AppContent';

export function AppProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <FirebaseClientProvider>
      <AuthProvider>
        <CartProvider>
          <FirebaseErrorListener />
          <AppContent>{children}</AppContent>
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </FirebaseClientProvider>
  );
}

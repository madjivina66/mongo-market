
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/cart-context';
import { AuthProvider } from '@/context/auth-context';
import { FirebaseClientProvider } from '@/firebase/client-provider'; // Importer le nouveau Provider
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export const metadata: Metadata = {
  title: 'MongoMarket Mobile',
  description: 'Votre guichet unique pour les produits frais.',
};

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
                {children}
                <Toaster />
              </CartProvider>
          </AuthProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

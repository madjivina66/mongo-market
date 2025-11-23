
import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/components/AppProviders';
import { Poppins, PT_Sans } from 'next/font/google';

const fontBody = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
});

const fontHeadline = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-headline',
});

export const metadata: Metadata = {
  title: 'MongoMarket',
  description: 'La fraîcheur livrée à votre porte',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        className={`font-body antialiased ${fontBody.variable} ${fontHeadline.variable}`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

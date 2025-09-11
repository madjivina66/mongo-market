import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/products" className="group flex items-center gap-2" prefetch={false}>
      <div className="rounded-lg bg-primary p-2 text-primary-foreground transition-colors group-hover:bg-accent">
        <ShoppingCart className="h-6 w-6" />
      </div>
      <span className="font-headline text-2xl font-semibold text-primary group-hover:text-accent-foreground">
        MongoMarket
      </span>
    </Link>
  );
}

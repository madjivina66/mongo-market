import { SidebarTrigger } from '@/components/ui/sidebar';
import { ShoppingCartButton } from './shopping-cart';
import { Logo } from './logo';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <div className="hidden md:block">
          <Logo />
        </div>
      </div>
      <div className="md:hidden">
        <Logo />
      </div>
      <ShoppingCartButton />
    </header>
  );
}

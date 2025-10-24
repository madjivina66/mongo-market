import AppLayout from './(app)/layout';
import AuthLayout from './(auth)/layout';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthRoute = ['/login', '/signup'].includes(pathname);

    if (isAuthRoute) {
        return <AuthLayout>{children}</AuthLayout>;
    }

    return <AppLayout>{children}</AppLayout>;
}

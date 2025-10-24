
import { LoginForm } from './login-form';
import { Logo } from '@/components/logo';
import Link from 'next/link';

export default function LoginPage() {
  return (
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <h1 className="mb-2 text-center font-headline text-3xl font-bold">
          Connexion
        </h1>
        <p className="mb-6 text-center text-muted-foreground">
          Content de vous revoir !
        </p>
        <LoginForm />
         <p className="mt-4 text-center text-sm text-muted-foreground">
            Vous n&apos;avez pas de compte ?{' '}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
                Inscrivez-vous
            </Link>
        </p>
      </div>
  );
}

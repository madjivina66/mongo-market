
import { SignupForm } from './signup-form';
import { Logo } from '@/components/logo';
import Link from 'next/link';

export default function SignupPage() {
  return (
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <h1 className="mb-2 text-center font-headline text-3xl font-bold">
          Créer un compte
        </h1>
        <p className="mb-6 text-center text-muted-foreground">
          Rejoignez-nous pour commencer vos achats.
        </p>
        <SignupForm />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Vous avez déjà un compte ?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Connectez-vous
          </Link>
        </p>
      </div>
  );
}


'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
// import { FcGoogle } from "react-icons/fc"; // Retiré

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  email: z.string().email('Adresse email invalide.'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères.'),
});

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  // const [isGoogleLoading, setIsGoogleLoading] = useState(false); // Retiré
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth(); // loginWithGoogle retiré

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        await login(values.email, values.password);
        toast({
            title: 'Connexion réussie',
            description: 'Vous allez être redirigé.',
        });
        router.push('/products');
    } catch (error: any) {
        const description = `Une erreur est survenue : ${error.code || error.message}`;
        toast({
            title: 'Erreur de connexion',
            description: description,
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  }

  /*
  async function handleGoogleLogin() {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast({
        title: 'Connexion réussie',
        description: 'Vous êtes maintenant connecté avec Google.',
      });
      router.push('/products');
    } catch (error: any) {
      let description = `Une erreur est survenue : ${error.code || error.message}`;
      if (error.code === 'auth/operation-not-allowed' || error.code === 'auth/unauthorized-domain') {
        description = "La connexion Google n'est pas activée pour ce site. Le propriétaire doit ajouter ce domaine aux fournisseurs d'authentification dans la console Firebase.";
      }
      toast({
        title: 'Erreur de connexion Google',
        description: description,
        variant: 'destructive',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  }
  */

  return (
    <>
      {/*
      <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading || isGoogleLoading}>
        {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FcGoogle className="mr-2 h-5 w-5" />}
        Se connecter avec Google
      </Button>
      <div className="my-6 flex items-center">
        <Separator className="flex-1" />
        <span className="mx-4 text-xs text-muted-foreground">OU</span>
        <Separator className="flex-1" />
      </div>
      */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@exemple.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Se connecter avec l'email
          </Button>
        </form>
      </Form>
    </>
  );
}

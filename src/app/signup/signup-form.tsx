
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { doc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth, useFirestore, setDocumentNonBlocking } from '@/firebase';
import type { UserProfile } from '@/lib/types';


const formSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères.'),
  email: z.string().email('Adresse email invalide.'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères.'),
});

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { signup } = useAuth();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        const userCredential = await signup(values.email, values.password);
        const user = userCredential.user;

        // Mettre à jour le nom d'affichage dans Firebase Auth
        await updateProfile(user, { displayName: values.name });

        // Créer le document de profil dans Firestore
        const userProfileRef = doc(firestore, "userProfiles", user.uid);
        const newUserProfile: Omit<UserProfile, 'id'> = {
            name: values.name,
            email: values.email,
            phone: '',
            address: {
                street: '',
                city: '',
                state: '',
                zip: '',
                country: '',
            },
            isPro: false,
        };
        
        // Utiliser la fonction non-bloquante pour créer le profil
        setDocumentNonBlocking(userProfileRef, newUserProfile, {});

        toast({
            title: 'Compte créé avec succès',
            description: 'Vous allez être redirigé.',
        });
        router.push('/products');

    } catch (error: any) {
        let description = "Une erreur est survenue. Veuillez réessayer.";
        if (error.code === 'auth/email-already-in-use') {
            description = "Cet email est peut-être déjà utilisé. Essayez de vous connecter.";
        } else {
            description = `Une erreur est survenue : ${error.code || error.message}`;
        }
        toast({
            title: 'Erreur de création de compte',
            description: description,
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Votre nom" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
          S&apos;inscrire
        </Button>
      </form>
    </Form>
  );
}

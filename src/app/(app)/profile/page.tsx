
'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useFirestore, useDoc, useAuth, updateDocumentNonBlocking, setDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import type { UserProfile } from '@/lib/types';


const profileSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères.'),
  email: z.string().email('Adresse email invalide.'),
  phone: z.string().min(5, 'Numéro de téléphone invalide.'),
  address: z.object({
    street: z.string().min(5, 'La rue doit contenir au moins 5 caractères.'),
    city: z.string().min(2, 'La ville doit contenir au moins 2 caractères.'),
    state: z.string().min(2, 'La région doit contenir au moins 2 caractères.'),
    zip: z.string(),
    country: z.string(),
  }),
});

function ProfileSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Informations personnelles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Nom complet</Label>
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Label>Téléphone</Label>
          <Skeleton className="h-10 w-full" />
        </div>
        <Separator />
        <h3 className="font-headline text-lg font-semibold">Adresse de livraison</h3>
        <div className="space-y-2">
          <Label>Rue</Label>
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Ville</Label>
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Label>Région</Label>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <Separator />
        <Button disabled className="w-full">
          <Skeleton className="h-5 w-24" />
        </Button>
      </CardContent>
    </Card>
  )
}

export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useAuth();
  
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: { street: '', city: '', state: '', zip: '', country: '' },
    },
  });

  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'userProfiles', user.uid);
  }, [firestore, user]);

  const { data: profile, isLoading: isFetching } = useDoc<UserProfile>(userProfileRef);

  // Mettre à jour le formulaire lorsque le profil est chargé ou que l'utilisateur change
  useMemo(() => {
    if (profile) {
      form.reset(profile);
    } else if (user) {
      // Pré-remplir avec les infos de l'utilisateur si le profil n'existe pas
      form.reset({
        name: user.displayName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        address: { street: '', city: '', state: '', zip: '', country: '' },
      });
    }
  }, [profile, user, form]);


  async function onSubmit(values: z.infer<typeof profileSchema>) {
    if (!userProfileRef) {
        toast({ title: "Erreur", description: "Utilisateur non connecté.", variant: "destructive"});
        return;
    }
    setIsSaving(true);

    try {
      // Utilise `set` avec `merge` pour créer ou mettre à jour le document.
      setDocumentNonBlocking(userProfileRef, values, { merge: true });
      
      toast({
        title: "Profil sauvegardé",
        description: "Vos informations ont été sauvegardées avec succès.",
      });
    } catch (error) {
       const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue lors de la mise à jour du profil.";
      toast({
        title: "Erreur de sauvegarde",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      form.reset(values); // Réinitialise l'état "dirty" du formulaire
    }
  }
  
  if (isFetching) {
      return (
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-8 text-center font-headline text-4xl font-bold text-primary">Mon Profil</h1>
          <ProfileSkeleton />
        </div>
      )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-center font-headline text-4xl font-bold text-primary">Mon Profil</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre nom complet" {...field} />
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
                      <Input type="email" placeholder="Votre email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Votre téléphone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <h3 className="font-headline text-lg font-semibold">Adresse de livraison</h3>
              <FormField
                control={form.control}
                name="address.street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rue</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre rue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="address.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre ville" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Région</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre région" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />
              
              <Button type="submit" className="w-full" disabled={isSaving || !form.formState.isDirty}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sauvegarder les changements
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}

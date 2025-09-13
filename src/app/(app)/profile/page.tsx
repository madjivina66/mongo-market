'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getUserProfile } from '@/lib/firebase-data';
import type { UserProfile } from '@/lib/types';
import { updateUserProfile } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

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
          <FormLabel>Nom complet</FormLabel>
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <FormLabel>Email</FormLabel>
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <FormLabel>Téléphone</FormLabel>
          <Skeleton className="h-10 w-full" />
        </div>
        <Separator />
        <h3 className="font-headline text-lg font-semibold">Adresse de livraison</h3>
        <div className="space-y-2">
          <FormLabel>Rue</FormLabel>
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <FormLabel>Ville</FormLabel>
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <FormLabel>Région</FormLabel>
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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
      },
    },
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await getUserProfile();
        if (profile) {
          form.reset(profile);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    }
    fetchProfile();
  }, [form]);

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setIsLoading(true);
    try {
      const result = await updateUserProfile(values);
      if (result.error) {
        throw new Error(result.error);
      }
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du profil.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const isFormLoading = form.formState.isLoading || !form.formState.isDirty && form.formState.isSubmitted;
  
  if (!form.formState.isDirty && !form.formState.isSubmitted && !form.getValues('name')) {
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
              
              <Button type="submit" className="w-full" disabled={isLoading || !form.formState.isDirty}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sauvegarder les changements
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}

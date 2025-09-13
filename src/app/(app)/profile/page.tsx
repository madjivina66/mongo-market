'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserProfile } from '@/lib/firebase-data';
import type { UserProfile } from '@/lib/types';

function ProfileSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Informations personnelles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nom complet</Label>
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Skeleton className="h-10 w-full" />
        </div>
        <Separator />
        <h3 className="font-headline text-lg font-semibold">Adresse de livraison</h3>
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
        <Separator />
        <h3 className="font-headline text-lg font-semibold">Moyens de paiement</h3>
        <div className="space-y-4">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}


export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setUserProfile(null);
      }
    }
    fetchProfile();
  }, []);


  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-center font-headline text-4xl font-bold text-primary">Mon Profil</h1>
      {!userProfile ? (
        <ProfileSkeleton />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input id="name" defaultValue={userProfile.name} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={userProfile.email} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" type="tel" defaultValue={userProfile.phone} readOnly />
            </div>

            <Separator />

            <h3 className="font-headline text-lg font-semibold">Adresse de livraison</h3>
            <div className="space-y-2">
              <Label htmlFor="street">Rue</Label>
              <Input id="street" defaultValue={userProfile.address.street} readOnly />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input id="city" defaultValue={userProfile.address.city} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Région</Label>
                <Input id="state" defaultValue={userProfile.address.state} readOnly />
              </div>
            </div>

            <Separator />
            
            <h3 className="font-headline text-lg font-semibold">Moyens de paiement</h3>
            <div className="space-y-4">
              {userProfile.paymentMethods.map((method, index) => (
                <div key={index} className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <p className="font-medium">{method.type}</p>
                    <p className="text-sm text-muted-foreground">{method.details}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button disabled className="w-full">Sauvegarder les changements (Désactivé)</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

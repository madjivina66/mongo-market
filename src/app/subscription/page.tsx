
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Check, Loader2, CreditCard, Smartphone } from "lucide-react";
import { useAuth, useDoc, useFirestore, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import type { UserProfile } from "@/lib/types";
import { upgradeToPro } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const featuresPro = [
  "Nombre de produits illimité",
  "Accès à l'Optimiseur de Publicité IA",
  "Mise en avant des produits",
  "Support prioritaire",
];

const featuresFree = [
    "Jusqu'à 10 produits",
    "Gestion des commandes de base",
    "Profil de vendeur public",
];

export default function SubscriptionPage() {
    const { user } = useAuth();
    const firestore = useFirestore();
    const { toast } = useToast();
    const router = useRouter();
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [showPaymentOptions, setShowPaymentOptions] = useState(false);

    const userProfileRef = useMemoFirebase(() => {
        if (!user) return null;
        return doc(firestore, 'userProfiles', user.uid);
    }, [firestore, user]);

    const { data: profile } = useDoc<UserProfile>(userProfileRef);

    const isPro = profile?.isPro ?? false;

    const handleUpgrade = async () => {
        if (!user || user.isAnonymous) {
            toast({ title: "Erreur", description: "Vous devez être connecté pour passer à Pro.", variant: "destructive" });
            router.push('/login');
            return;
        }

        setIsUpgrading(true);
        try {
            const idToken = await user.getIdToken(true);
            const result = await upgradeToPro(idToken);
            if (result.error) {
                throw new Error(result.error);
            }
            toast({
                title: "Félicitations !",
                description: "Vous êtes maintenant un membre Pro.",
            });
            setShowPaymentOptions(false); // Cacher les options de paiement après la réussite
            router.refresh();
        } catch(e: any) {
             toast({
                title: "Erreur",
                description: e.message || "Impossible de mettre à jour votre abonnement.",
                variant: "destructive",
            });
        } finally {
            setIsUpgrading(false);
        }
    }

    const handleShowPayments = () => {
        if (!user || user.isAnonymous) {
            router.push('/login');
            return;
        }
        if (!isPro) {
            setShowPaymentOptions(true);
        }
    }

  return (
    <div className="mx-auto max-w-4xl">
        <header className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-5xl">
                Passez à MongoMarket Pro
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
                Débloquez des outils puissants pour augmenter vos ventes et développer votre activité.
            </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className={!isPro ? "border-2 border-primary shadow-lg" : "border-2 border-muted"}>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="font-headline">Plan Gratuit</CardTitle>
                        {!isPro && <Badge variant="default">Plan actuel</Badge>}
                    </div>
                    <CardDescription>Parfait pour commencer et découvrir la plateforme.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-4xl font-bold">$0<span className="text-lg font-normal text-muted-foreground">/mois</span></p>
                    <ul className="space-y-2">
                        {featuresFree.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-primary" />
                                <span className="text-muted-foreground">{feature}</span>
                            </li>
                        ))}
                    </ul>
                     <Button variant="outline" className="w-full" disabled={!isPro} onClick={() => { /* Logique future pour revenir au plan gratuit */ }}>
                        {isPro ? "Passer au plan Gratuit" : "Votre plan actuel"}
                    </Button>
                </CardContent>
            </Card>

            <Card className={isPro ? "border-2 border-primary shadow-lg" : "border-2"}>
                <CardHeader>
                     <div className="flex justify-between items-center">
                        <CardTitle className="font-headline">Plan Pro</CardTitle>
                        {isPro && <Badge variant="default">Plan actuel</Badge>}
                    </div>
                    <CardDescription>Pour les commerçants sérieux qui veulent maximiser leur visibilité.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <p className="text-4xl font-bold">$19<span className="text-lg font-normal text-muted-foreground">/mois</span></p>
                     
                     {!showPaymentOptions ? (
                        <>
                            <ul className="space-y-2">
                                {featuresPro.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button onClick={handleShowPayments} className="w-full font-headline text-lg" disabled={isPro || isUpgrading}>
                                {isUpgrading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isPro ? "Vous êtes déjà Pro" : "Passer à Pro"}
                            </Button>
                        </>
                     ) : (
                        <div className="pt-4">
                            <h3 className="font-semibold text-center mb-4">Finaliser le paiement</h3>
                            <div className="space-y-3">
                                <Button onClick={handleUpgrade} size="lg" className="w-full justify-start gap-4 h-auto flex-col items-start py-3" disabled={isUpgrading}>
                                    <div className="flex items-center gap-4">
                                        {isUpgrading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        <CreditCard /> <span>Payer par carte</span>
                                    </div>
                                    <p className="text-xs text-left text-primary-foreground/80 pl-8">Option sécurisée par Stripe.</p>
                                </Button>
                                <Button onClick={handleUpgrade} size="lg" className="w-full justify-start gap-4 h-auto flex-col items-start py-3" variant="secondary" disabled={isUpgrading}>
                                    <div className="flex items-center gap-4">
                                        {isUpgrading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        <Smartphone /> <span>Payer avec Moov Money</span>
                                    </div>
                                    <p className="text-xs text-left text-secondary-foreground/80 pl-8">Numéro : 95 38 38 77</p>
                                </Button>
                                <Button onClick={handleUpgrade} size="lg" className="w-full justify-start gap-4 h-auto flex-col items-start py-3" variant="secondary" disabled={isUpgrading}>
                                     <div className="flex items-center gap-4">
                                        {isUpgrading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        <Smartphone /> <span>Payer avec Airtel Money</span>
                                    </div>
                                    <p className="text-xs text-left text-secondary-foreground/80 pl-8">Numéro : 66 78 96 04</p>
                                </Button>
                                <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => setShowPaymentOptions(false)}>Annuler</Button>
                            </div>
                        </div>
                     )}
                </CardContent>
            </Card>
        </div>
         <p className="mt-8 text-center text-xs text-muted-foreground">
            Le paiement réel n'est pas implémenté. Cliquer sur une option de paiement mettra à jour votre compte au statut Pro pour la démonstration.
        </p>
    </div>
  );
}


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

const featuresPro = [
  "Nombre de produits illimité",
  "Accès à l'Optimiseur de Publicité IA",
  "Mise en avant des produits",
  "Support prioritaire",
];

const featuresFree = [
    "Jusqu'à 3 produits",
    "Gestion des commandes de base",
    "Profil de vendeur public",
];

export default function SubscriptionPage() {
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
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Plan Gratuit</CardTitle>
                    <CardDescription>Parfait pour commencer et découvrir la plateforme.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-4xl font-bold">$0<span className="text-lg font-normal text-muted-foreground">/mois</span></p>
                    <ul className="space-y-2">
                        {featuresFree.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-green-500" />
                                <span className="text-muted-foreground">{feature}</span>
                            </li>
                        ))}
                    </ul>
                     <Button variant="outline" className="w-full" disabled>
                        Votre plan actuel
                    </Button>
                </CardContent>
            </Card>

            <Card className="border-2 border-primary shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline">Plan Pro</CardTitle>
                    <CardDescription>Pour les commerçants sérieux qui veulent maximiser leur visibilité.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <p className="text-4xl font-bold">$19<span className="text-lg font-normal text-muted-foreground">/mois</span></p>
                     <ul className="space-y-2">
                        {featuresPro.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-primary" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                    <Button asChild className="w-full font-headline text-lg">
                        <Link href="#">Passer à Pro</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
         <p className="mt-8 text-center text-xs text-muted-foreground">
            Le paiement réel n'est pas encore implémenté. Cliquer sur "Passer à Pro" ne déclenchera pas de facturation.
        </p>
    </div>
  );
}

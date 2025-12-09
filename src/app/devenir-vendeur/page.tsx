
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ShoppingCart, BarChart, Rocket } from "lucide-react";
import Link from "next/link";

const advantages = [
    {
        icon: <ShoppingCart className="h-6 w-6 text-primary" />,
        title: "Vendez vos produits",
        description: "Mettez en ligne votre inventaire et atteignez des milliers de clients potentiels sur MongoMarket."
    },
    {
        icon: <BarChart className="h-6 w-6 text-primary" />,
        title: "Suivez vos performances",
        description: "Accédez à un tableau de bord simple pour suivre vos ventes et gérer vos produits facilement."
    },
    {
        icon: <Rocket className="h-6 w-6 text-primary" />,
        title: "Développez votre activité",
        description: "Profitez de nos outils marketing et de l'abonnement Pro pour booster votre visibilité."
    }
]

export default function BecomeSellerPage() {
  return (
    <div className="mx-auto max-w-4xl">
        <header className="mb-12 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-5xl">
                Rejoignez la place de marché
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Commencez à vendre vos produits sur MongoMarket et transformez votre passion en entreprise. C'est simple et rapide.
            </p>
        </header>

        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Pourquoi vendre sur MongoMarket ?</CardTitle>
                <CardDescription>Ouvrez votre boutique en ligne en quelques clics et profitez de notre plateforme.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-8">
                {advantages.map((adv) => (
                    <Link 
                        href="/vendeur/ajouter-produit"
                        key={adv.title} 
                        className="flex flex-col items-center text-center p-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 hover:bg-muted/50 cursor-pointer"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                           {adv.icon}
                        </div>
                        <h3 className="mt-4 font-semibold font-headline">{adv.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{adv.description}</p>
                    </Link>
                ))}
            </CardContent>
            <CardFooter className="flex-col gap-4 items-center justify-center pt-6 border-t">
                 <Button asChild size="lg" className="font-headline text-lg">
                    <Link href="/vendeur/ajouter-produit">
                        Créer ma boutique maintenant
                    </Link>
                </Button>
                <p className="text-xs text-muted-foreground">La création d'un compte vendeur est gratuite.</p>
            </CardFooter>
        </Card>
    </div>
  );
}

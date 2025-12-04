
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Facebook, MessageCircle, Instagram } from "lucide-react";
import type { PlatformAdIntegrationOutput } from "@/ai/flows/platform-ad-integration";
import { getAdPlatformRecommendation } from "./actions";

const formSchema = z.object({
  customerPreferences: z.string().min(10, {
    message: "Veuillez fournir plus de détails sur les préférences des clients.",
  }),
  salesData: z.string().min(10, {
    message: "Veuillez fournir plus de détails sur les données de vente.",
  }),
});

const platformIcons = {
    WhatsApp: <MessageCircle className="h-12 w-12 text-primary" />,
    Instagram: <Instagram className="h-12 w-12 text-primary" />,
    Facebook: <Facebook className="h-12 w-12 text-primary" />,
};

export function AdOptimizerForm() {
  const [result, setResult] = useState<PlatformAdIntegrationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerPreferences: "",
      salesData: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await getAdPlatformRecommendation(values);
      if (response.error) {
        throw new Error(response.error);
      }
      setResult(response.data || null);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Une erreur est survenue lors de l'obtention de la recommandation. Veuillez réessayer.";
      setError(errorMessage);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle className="font-headline">Données de campagne</CardTitle>
            <CardDescription>Entrez les préférences des clients et les données de vente pour obtenir une recommandation de plateforme.</CardDescription>
        </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="customerPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Préférences des clients</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Public jeune, intéressé par le contenu visuel, situé en zone urbaine."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salesData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Données de vente</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Fort engagement sur les stories Instagram, meilleures ventes grâce aux publicités Facebook ciblant les 25-35 ans."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Analyse en cours...' : 'Obtenir la recommandation'}
            </Button>
          </form>
        </Form>
      </CardContent>
      {(isLoading || result || error) && (
        <CardFooter className="mt-6 flex flex-col items-center justify-center border-t pt-6">
            {isLoading && <p>L'IA réfléchit...</p>}
            {error && <p className="text-destructive">{error}</p>}
            {result && (
                <Card className="w-full bg-background/50">
                    <CardHeader className="items-center text-center">
                        {platformIcons[result.recommendedPlatform]}
                        <CardTitle className="font-headline text-2xl">Plateforme recommandée : {result.recommendedPlatform}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h3 className="font-semibold font-headline">Raisonnement de l'IA</h3>
                        <p className="mt-2 text-muted-foreground">{result.reasoning}</p>
                    </CardContent>
                </Card>
            )}
        </CardFooter>
      )}
    </Card>
  );
}

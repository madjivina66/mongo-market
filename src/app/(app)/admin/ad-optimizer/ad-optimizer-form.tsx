"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Facebook, MessageCircle, Instagram } from "lucide-react";
import type { PlatformAdIntegrationOutput } from "@/ai/flows/platform-ad-integration";
import { getAdPlatformRecommendation } from "./actions";

const formSchema = z.object({
  customerPreferences: z.string().min(10, {
    message: "Please provide more details about customer preferences.",
  }),
  salesData: z.string().min(10, {
    message: "Please provide more details about sales data.",
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
      const recommendation = await getAdPlatformRecommendation(values);
      setResult(recommendation);
    } catch (e) {
      setError("An error occurred while getting the recommendation. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle className="font-headline">Campaign Data</CardTitle>
            <CardDescription>Enter customer preferences and sales data to get a platform recommendation.</CardDescription>
        </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="customerPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Preferences</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Younger audience, interested in visual content, located in urban areas."
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
                  <FormLabel>Sales Data</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., High engagement on Instagram stories, best sales from Facebook ads targeting 25-35 age group."
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
              {isLoading ? 'Analyzing...' : 'Get Recommendation'}
            </Button>
          </form>
        </Form>
      </CardContent>
      {(isLoading || result || error) && (
        <CardFooter className="mt-6 flex flex-col items-center justify-center border-t pt-6">
            {isLoading && <p>AI is thinking...</p>}
            {error && <p className="text-destructive">{error}</p>}
            {result && (
                <Card className="w-full bg-background/50">
                    <CardHeader className="items-center text-center">
                        {platformIcons[result.recommendedPlatform]}
                        <CardTitle className="font-headline text-2xl">Recommended Platform: {result.recommendedPlatform}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h3 className="font-semibold font-headline">AI Reasoning</h3>
                        <p className="mt-2 text-muted-foreground">{result.reasoning}</p>
                    </CardContent>
                </Card>
            )}
        </CardFooter>
      )}
    </Card>
  );
}

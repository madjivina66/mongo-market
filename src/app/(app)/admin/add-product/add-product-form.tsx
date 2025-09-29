
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";

import { addProduct, productSchema, type ProductFormData } from "./actions";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { ProductCategory } from "@/lib/types";

const categories: ProductCategory[] = ['Légumes', 'Fruits', 'Viande', 'Produits laitiers', 'Épices'];

export function AddProductForm() {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
    },
  });

  async function onSubmit(values: ProductFormData) {
    if (!user) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour ajouter un produit.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const result = await addProduct(values);
      if (result.error) {
        throw new Error(result.error);
      }
      toast({
        title: "Produit ajouté !",
        description: `Le produit "${values.name}" est maintenant en vente.`,
      });
      router.push(`/admin/my-products`);
    } catch (e: any) {
       toast({
        title: "Erreur lors de l'ajout",
        description: e.message || "Une erreur est survenue.",
        variant: "destructive",
      });
    } finally {
        setIsSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Détails du produit</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du produit</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Tomates fraîches" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez votre produit en quelques mots."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                 <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Prix ($)</FormLabel>
                        <FormControl>
                            <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
                 <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Catégorie</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez une catégorie" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
             <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Image du produit</FormLabel>
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une image de démonstration" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {PlaceHolderImages.map(img => (
                                    <SelectItem key={img.id} value={`${img.imageUrl}|${img.imageHint}`}>{img.description}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? "Sauvegarde en cours..." : "Ajouter le produit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

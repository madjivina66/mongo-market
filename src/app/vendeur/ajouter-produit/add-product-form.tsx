
"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";

import { addProduct, type ProductFormData } from "./actions";
import type { ProductCategory } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid'; // Pour générer des IDs uniques

const categories: ProductCategory[] = ['Légumes', 'Fruits', 'Viande', 'Produits laitiers', 'Épices', 'Électronique', 'Vêtements', 'Boulangerie', 'Sacs'];

type FormValues = Omit<ProductFormData, 'imageUrl' | 'imageHint'>;

export function AddProductForm() {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: 'Légumes',
    },
  });

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  async function uploadImage(file: File): Promise<string> {
    if (!user) throw new Error("Utilisateur non authentifié.");
    const storage = getStorage();
    // Utiliser l'ID utilisateur et un nom de fichier unique pour éviter les conflits
    const imagePath = `products/${user.uid}/${uuidv4()}-${file.name}`;
    const imageRef = storageRef(storage, imagePath);

    await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  }

  async function onSubmit(values: FormValues) {
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
      let imageUrl = PlaceHolderImages[0].imageUrl;
      let imageHint = PlaceHolderImages[0].imageHint;

      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
        imageHint = "uploaded image";
      }
      
      const idToken = await user.getIdToken(true);

      const dataToSend = {
        ...values,
        imageUrl,
        imageHint,
      };

      const result = await addProduct(dataToSend, idToken);
      
      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: "Produit ajouté !",
        description: `Le produit "${values.name}" est maintenant en vente.`,
      });
      router.push(`/vendeur/mes-produits`);
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
              rules={{ required: "Le nom du produit est requis." }}
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
              rules={{ required: "La description est requise.", minLength: { value: 10, message: "La description doit contenir au moins 10 caractères." } }}
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
                  <FormMessage>{form.formState.errors.description?.message}</FormMessage>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                 <FormField
                    control={form.control}
                    name="price"
                    rules={{ required: "Le prix est requis.", min: { value: 0.01, message: "Le prix doit être positif."} }}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Prix ($)</FormLabel>
                        <FormControl>
                            <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
                 <FormField
                    control={form.control}
                    name="category"
                    rules={{ required: "La catégorie est requise."}}
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
                        <FormControl>
                            <div className="relative">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Choisir un fichier
                                </Button>
                                <Input 
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            field.onChange(file);
                                            setSelectedFile(file);
                                            setFileName(file.name);
                                            if (imagePreview) {
                                              URL.revokeObjectURL(imagePreview);
                                            }
                                            setImagePreview(URL.createObjectURL(file));
                                        }
                                    }}
                                />
                                {fileName && <span className="ml-4 text-sm text-muted-foreground">{fileName}</span>}
                            </div>
                        </FormControl>
                         {imagePreview && (
                            <div className="mt-4">
                                <p className="text-sm font-medium">Aperçu :</p>
                                <Image 
                                    src={imagePreview} 
                                    alt="Aperçu de l'image" 
                                    width={200}
                                    height={200}
                                    className="mt-2 rounded-md object-contain border"
                                />
                            </div>
                        )}
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

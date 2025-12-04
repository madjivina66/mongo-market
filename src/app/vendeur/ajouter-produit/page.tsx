
import { AddProductForm } from "./add-product-form";

export default function AddProductPage() {
    return (
        <div className="mx-auto max-w-2xl">
            <header className="mb-8 text-center">
                <h1 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-5xl">
                    Ajouter un nouveau produit
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Remplissez les détails ci-dessous pour mettre votre produit en vente.
                </p>
            </header>
            <AddProductForm />
        </div>
    );
}


import { AdOptimizerForm } from "./ad-optimizer-form";

export default function AdOptimizerPage() {
    return (
        <div className="mx-auto max-w-4xl">
            <header className="mb-8 text-center">
                <h1 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-5xl">
                    Optimiseur de Plateforme Publicitaire IA
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Utilisez l'IA pour découvrir la plateforme publicitaire optimale pour vos campagnes.
                </p>
            </header>
            <AdOptimizerForm />
        </div>
    );
}

import { AdOptimizerForm } from "./ad-optimizer-form";

export default function AdOptimizerPage() {
    return (
        <div className="mx-auto max-w-4xl">
            <header className="mb-8 text-center">
                <h1 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-5xl">
                    AI Ad Platform Optimizer
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Leverage AI to discover the optimal advertising platform for your campaigns.
                </p>
            </header>
            <AdOptimizerForm />
        </div>
    );
}


import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Leaf, ShoppingCart, Truck, Laptop, HardDrive, MemoryStick, Watch } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const categories = [
  { name: 'Fruits', image: 'Fruits', link: '/products?category=Fruits' },
  { name: 'Légumes', image: 'Legumes', link: '/products?category=Légumes' },
  { name: 'Viande', image: 'Viande', link: '/products?category=Viande' },
  { name: 'Produits laitiers', image: 'Produits-laitiers', link: '/products?category=Produits laitiers' },
  { name: 'Boulangerie', image: 'Boulangerie', link: '/products?category=Boulangerie' },
  { name: 'Électronique', image: 'Electronique', link: '/products?category=Électronique' },
  { name: 'Sacs', image: 'Sacs', link: '/products?category=Sacs' },
  { name: 'Épices', image: 'Epices', link: '/products?category=Épices' },
];

const featuredElectronics = [
    { name: 'Ordinateur Portable Ultra-fin', icon: <Laptop className="w-8 h-8 text-primary" />, description: 'Puissance et portabilité pour les professionnels.' },
    { name: 'Disque Dur SSD 1To', icon: <HardDrive className="w-8 h-8 text-primary" />, description: 'Stockage ultra-rapide pour vos fichiers.' },
    { name: 'Clé USB 256Go', icon: <MemoryStick className="w-8 h-8 text-primary" />, description: 'Emportez vos données partout avec vous.' },
    { name: 'Montre Connectée', icon: <Watch className="w-8 h-8 text-primary" />, description: 'Suivez votre activité avec style.' },
]

export default function HomePage() {
  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section className="relative -mx-4 -mt-6 sm:-mx-6 md:-mt-6 h-[60vh] min-h-[400px] max-h-[600px] flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <Image
          src="https://picsum.photos/seed/homehero/1800/800"
          alt="Marché de produits frais"
          fill
          objectFit="cover"
          className="z-0"
          data-ai-hint="fresh market produce"
        />
        <div className="relative z-20 p-4">
          <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
            MONGO MARKET
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-200 drop-shadow-md">
            La fraîcheur des producteurs locaux, livrée directement à votre porte.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg" className="font-headline text-lg">
              <Link href="/products">Nos Produits</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="font-headline text-lg">
              <Link href="/strategie">À Propos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">
            Achetez vos produits en toute simplicité
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            En seulement trois étapes faciles.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Leaf className="h-8 w-8" />
            </div>
            <h3 className="mt-4 font-headline text-xl font-semibold">1. Choisissez vos produits</h3>
            <p className="mt-2 text-muted-foreground">
              Parcourez notre sélection de produits frais et locaux et ajoutez-les à votre panier.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShoppingCart className="h-8 w-8" />
            </div>
            <h3 className="mt-4 font-headline text-xl font-semibold">2. Payez en toute sécurité</h3>
            <p className="mt-2 text-muted-foreground">
              Finalisez votre commande avec nos options de paiement simples et sécurisées.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Truck className="h-8 w-8" />
            </div>
            <h3 className="mt-4 font-headline text-xl font-semibold">3. Recevez votre livraison</h3>
            <p className="mt-2 text-muted-foreground">
              Vos produits frais sont livrés rapidement à votre domicile pour une fraîcheur garantie.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">
            Nos Catégories
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Explorez un monde de saveurs et de technologies.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
          {categories.map((category) => (
            <Link href={category.link} key={category.name} className="group block">
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="relative h-40">
                    <Image
                      src={`https://picsum.photos/seed/${category.image}/300/200`}
                      alt={category.name}
                      fill
                      objectFit="cover"
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                     <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />
                     <h3 className="absolute bottom-2 left-2 font-headline text-lg font-bold text-white drop-shadow-md">
                        {category.name}
                     </h3>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
         <div className="mt-8 text-center">
            <Button asChild variant="outline">
                <Link href="/products">
                    Voir tous les produits <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
      </section>

      {/* Featured Electronics Section */}
      <section className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">
            L'Électronique en Vedette
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Découvrez nos dernières innovations technologiques pour simplifier votre quotidien.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
                 <video 
                    src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" 
                    poster="https://picsum.photos/seed/laptopvideo/800/450"
                    controls 
                    className="w-full h-full object-cover"
                    data-ai-hint="laptop sale commercial"
                    />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {featuredElectronics.map((item) => (
                    <div key={item.name} className="flex gap-4 items-start">
                        <div className="flex-shrink-0 h-14 w-14 flex items-center justify-center rounded-lg bg-muted">
                            {item.icon}
                        </div>
                        <div>
                            <h3 className="font-semibold font-headline">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>
      
      {/* Fashion/Bags Section */}
      <section className="container mx-auto px-4">
        <div className="relative rounded-lg overflow-hidden p-8 flex items-center bg-muted/50 min-h-[400px]">
          <div className="absolute inset-0 z-0">
             <Image
                src="https://picsum.photos/seed/fashion-bg/1200/500"
                alt="Fashion background"
                fill
                objectFit="cover"
                className="opacity-20"
                data-ai-hint="fashion accessory display"
                />
          </div>
          <div className="relative z-10 w-full md:w-1/2">
             <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">
                Sacs & Accessoires
             </h2>
             <p className="mt-4 text-lg text-muted-foreground">
                Découvrez notre collection de sacs pour enfants et jeunes. Alliant style, durabilité et fonctionnalité pour accompagner chaque aventure.
             </p>
             <Button asChild className="mt-6 font-headline" size="lg">
                <Link href="/products?category=Sacs">
                    Voir la collection
                </Link>
             </Button>
          </div>
        </div>
      </section>

    </div>
  );
}

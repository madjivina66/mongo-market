
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Share2, Users, Globe, Newspaper } from "lucide-react";

const communicationChannels = [
  {
    title: "Réseaux sociaux : Créer une communauté engagée",
    icon: <Share2 className="h-5 w-5 text-primary" />,
    content: "Notre vision est de bâtir plus qu'une simple présence en ligne, mais une véritable communauté. Sur Facebook et Instagram, nous partagerons les histoires de nos vendeurs, mettrons en avant la qualité des produits et créerons un dialogue direct avec nos clients. L'objectif est de faire de MongoMarket un lieu d'échange et de découverte, pas seulement une plateforme de vente.",
  },
  {
    title: "Ateliers et formations : Accompagner nos partenaires",
    icon: <Users className="h-5 w-5 text-primary" />,
    content: "Nous croyons que le succès de nos vendeurs est notre succès. C'est pourquoi nous organiserons des ateliers locaux pour les former aux outils numériques, les aider à optimiser leur boutique en ligne et à maîtriser les bases de la photographie de produits. Notre but est de réduire la fracture numérique et de donner à chaque commerçant les moyens de réussir.",
  },
  {
    title: "Site web : La vitrine de notre savoir-faire",
    icon: <Globe className="h-5 w-5 text-primary" />,
    content: "Le site web sera notre point de référence central. Au-delà de la place de marché, il hébergera une section 'Ressources' avec des guides pratiques, des articles de blog sur les tendances du marché local et des interviews de vendeurs. Il sera la vitrine de notre engagement envers la transparence, l'éducation et le soutien à l'économie locale.",
  },
  {
    title: "Relations presse : Amplifier notre impact",
    icon: <Newspaper className="h-5 w-5 text-primary" />,
    content: "Pour toucher un public plus large et asseoir notre crédibilité, nous collaborerons avec les médias locaux. Nos communiqués de presse ne se contenteront pas d'annoncer des fonctionnalités ; ils raconteront l'impact positif de MongoMarket sur la vie des commerçants et la revitalisation du commerce de proximité, transformant notre mission en récits inspirants.",
  },
];

export default function StrategiePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-5xl">
          Notre Stratégie de Communication
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Pour atteindre nos objectifs, nous déploierons une stratégie de communication multi-canaux, avec une vision claire pour chacun.
        </p>
      </header>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
            {communicationChannels.map((channel, index) => (
                <AccordionItem key={`item-${index}`} value={`item-${index}`}>
                    <AccordionTrigger className="text-lg font-headline hover:no-underline text-left">
                        <div className="flex items-center gap-3">
                            {channel.icon}
                            {channel.title}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 text-base text-muted-foreground">
                        {channel.content}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
      </div>
    </div>
  );
}

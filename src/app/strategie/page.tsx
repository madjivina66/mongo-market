
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Share2, Users, Globe, Newspaper } from "lucide-react";

const communicationChannels = [
  {
    title: "Réseaux sociaux",
    icon: <Share2 className="h-5 w-5 text-primary" />,
    content: "Création de pages sur des plateformes comme Facebook et Instagram pour partager des informations, des mises à jour et des témoignages.",
  },
  {
    title: "Ateliers et formations",
    icon: <Users className="h-5 w-5 text-primary" />,
    content: "Organisation d'événements locaux pour former les commerçants sur l'utilisation de MongoMarket et les sensibiliser aux bénéfices de la digitalisation.",
  },
  {
    title: "Site web",
    icon: <Globe className="h-5 w-5 text-primary" />,
    content: "Développement d'une section dédiée sur le site de MongoMarket pour fournir des ressources, des guides et des actualités sur la plateforme.",
  },
  {
    title: "Communiqués de presse",
    icon: <Newspaper className="h-5 w-5 text-primary" />,
    content: "Envoi de communiqués aux médias locaux pour annoncer le lancement et les initiatives de MongoMarket.",
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
          Pour atteindre nos objectifs, nous déploierons une stratégie de communication multi-canaux.
        </p>
      </header>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
            {communicationChannels.map((channel, index) => (
                <AccordionItem key={`item-${index}`} value={`item-${index}`}>
                    <AccordionTrigger className="text-lg font-headline hover:no-underline">
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

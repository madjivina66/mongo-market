import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  // Le nom du fichier a été normalisé pour éviter les problèmes avec les espaces.
  // Assurez-vous que votre fichier dans le dossier /public s'appelle bien "logo-mongo-market-mza.png" (ou .jpg, .svg...).
  const logoFileName = 'logo-mongo-market-mza.png'; 

  return (
    <Link href="/products" className="group flex items-center gap-2" prefetch={false}>
      <Image
        src={`/${logoFileName}`}
        alt="Logo MongoMarket"
        width={180} // Vous pouvez ajuster cette valeur
        height={40} // Vous pouvez ajuster cette valeur
        className="object-contain"
      />
    </Link>
  );
}

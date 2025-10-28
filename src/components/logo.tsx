
import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  // Le nom du fichier a été mis à jour pour correspondre à votre fichier.
  // Assurez-vous que votre fichier dans le dossier /public s'appelle bien "logo-mongo-market.jpg".
  const logoFileName = 'logo-mongo-market.jpg'; 

  return (
    <Link href="/products" className="group flex items-center gap-2" prefetch={false}>
      <Image
        src={`/${logoFileName}`}
        alt="Logo MongoMarket"
        width={50}
        height={50}
        className="rounded-full object-cover" // Assure que le logo est parfaitement rond
      />
    </Link>
  );
}

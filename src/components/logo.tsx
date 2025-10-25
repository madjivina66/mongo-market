
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
        width={50} // Ajusté pour un cercle
        height={50} // Ajusté pour un cercle
        className="rounded-full object-cover" // Classes pour un style circulaire
      />
    </Link>
  );
}

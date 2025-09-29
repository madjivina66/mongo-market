# MongoMarket - Plan de Soutenance

Ce document présente l'architecture, les fonctionnalités et les choix techniques de l'application MongoMarket, une plateforme de marché en ligne pour les produits frais.

---

### Introduction Générale

*   **Présentation du Projet** : MongoMarket est une application web moderne conçue pour connecter les commerçants de produits frais (agriculteurs, artisans) avec les consommateurs locaux.
*   **Problématique** : Faciliter la vente en ligne pour les petits commerçants en leur fournissant une plateforme simple, sécurisée et performante, tout en offrant aux clients une expérience d'achat fluide et agréable.
*   **Objectifs** :
    1.  Développer une vitrine de produits dynamique et consultable.
    2.  Mettre en place un système d'authentification et de gestion de compte sécurisé pour les clients et les vendeurs.
    3.  Fournir aux vendeurs un tableau de bord complet pour gérer leur inventaire (Ajouter, Modifier, Supprimer leurs produits).
    4.  Intégrer un panier d'achat et un processus de paiement simplifié.
    5.  Explorer l'intégration de l'IA pour offrir des outils d'aide à la vente.
    6.  Assurer que l'application soit installable sur mobile (PWA).

---

### Chapitre 1 : Architecture Technique et Choix Technologiques

*   **Fondations Frontend : Next.js & React**
    *   **Pourquoi Next.js ?** : Utilisation de l'**App Router** pour un routage basé sur les dossiers, et des **Server Components** pour des performances optimisées (moins de JavaScript côté client).
    *   **Composants React Réutilisables** : Utilisation de la bibliothèque de composants **ShadCN UI**, qui offre des composants accessibles et personnalisables, stylisés avec **TailwindCSS**.
    *   **Styling Moderne** : **TailwindCSS** a été choisi pour un design rapide, cohérent et entièrement responsive. La gestion du thème se fait via des variables CSS dans `src/app/globals.css`.
    *   **Gestion d'état Côté Client** : Utilisation des **Hooks** et du **Context API** de React pour gérer des états globaux comme le panier (`CartContext`) et l'authentification (`AuthContext`).

*   **Backend et Base de Données : L'écosystème Firebase**
    *   **Authentification (`Firebase Authentication`)** : Système robuste gérant l'inscription et la connexion par email/mot de passe. La connexion anonyme est également utilisée pour permettre aux visiteurs non connectés de naviguer.
    *   **Base de Données en Temps Réel (`Firestore`)** : Firestore est utilisé comme base de données NoSQL pour sa flexibilité et ses capacités temps réel. Les données sont écoutées en direct grâce aux hooks `useDoc` et `useCollection`, assurant une interface utilisateur toujours à jour.
    *   **Structure de la Donnée** : La base est organisée en collections :
        *   `products` : Contient tous les produits, avec un champ `sellerId` pour lier un produit à son vendeur.
        *   `userProfiles` : Stocke les informations supplémentaires des utilisateurs, comme le statut "Pro".
        *   `orders` : Historique des commandes (non implémenté en profondeur, mais la structure est prête).
    *   **Opérations Sécurisées Côté Serveur (`Firebase Admin SDK` & `Server Actions`)** : Toutes les opérations sensibles (ajout, modification, suppression de produits) sont effectuées via des **Next.js Server Actions**. Celles-ci utilisent le SDK Admin de Firebase pour vérifier les droits (ex: seul le propriétaire d'un produit peut le modifier), garantissant la sécurité des données.

*   **Intelligence Artificielle avec Genkit**
    *   **Framework d'IA** : **Genkit** a été utilisé pour créer des "flux" d'IA. Il simplifie l'appel aux grands modèles de langage.
    *   **Cas d'usage - `Ad Optimizer`** : Un flux a été développé pour analyser des données de vente et recommander la plateforme publicitaire la plus pertinente (Facebook, Instagram, etc.), démontrant le potentiel de l'IA pour aider les vendeurs.

*   **Progressive Web App (PWA)**
    *   L'application est conçue pour être installable sur les téléphones grâce à un fichier `manifest.json`, améliorant l'engagement et l'accessibilité.

---

### Chapitre 2 : Fonctionnalités Clés de l'Application

*   **Parcours Client**
    1.  **Découverte des Produits** : La page `/products` affiche une grille de produits avec des options de recherche et de filtrage par catégorie.
    2.  **Détail du Produit** : Chaque produit a sa propre page avec une description détaillée, une grande image et le prix.
    3.  **Panier d'Achat** : Un panier d'achat accessible depuis toute l'application permet d'ajouter, de modifier la quantité et de supprimer des articles. L'état du panier est sauvegardé dans le `localStorage` du navigateur.
    4.  **Processus de Caisse** : Une page de "checkout" simple récapitule la commande et simule les options de paiement.

*   **Espace Vendeur (Routes `/admin`)**
    1.  **Tableau de Bord "Mes Produits"** : Liste tous les produits mis en vente par le commerçant connecté, avec des options pour modifier ou supprimer chaque article.
    2.  **Formulaire d'Ajout de Produit** : Un formulaire complet permet aux vendeurs de créer une nouvelle fiche produit avec nom, description, prix, catégorie et image.
    3.  **Formulaire de Modification** : Un formulaire pré-rempli pour mettre à jour les informations d'un produit existant. La sécurité est assurée côté serveur pour empêcher la modification par un autre utilisateur.
    4.  **Abonnement "Pro"** : Une page `/subscription` présente les avantages d'un plan "Pro". L'action `upgradeToPro` met à jour le profil de l'utilisateur dans Firestore.

---

### Chapitre 3 : Sécurité et Bonnes Pratiques

*   **Authentification et Autorisation** :
    *   Les pages de l'espace vendeur (`/admin/*`) sont protégées et accessibles uniquement aux utilisateurs connectés.
    *   Les opérations d'écriture (création, modification, suppression) sont protégées par des **Server Actions** qui valident l'identité de l'utilisateur via un **ID Token Firebase**. Le serveur vérifie que l'UID du token correspond bien au `sellerId` du produit concerné.
*   **Gestion des Données Sensibles** : Les clés privées (comme la clé de service Firebase) sont gérées de manière sécurisée via des variables d'environnement et ne sont jamais exposées côté client.
*   **Qualité du Code** : Utilisation de TypeScript pour la robustesse et la prévisibilité du code, et de `ESLint` pour maintenir un style de code cohérent.

---

### Conclusion et Perspectives d'Évolution

*   **Bilan du Projet** : MongoMarket est une application web robuste, sécurisée et performante qui remplit tous les objectifs initiaux. Elle constitue une base solide pour une véritable place de marché.
*   **Axes d'Amélioration et Futures Fonctionnalités** :
    1.  **Système de Commande Complet** : Implémenter la création, le suivi et l'historique des commandes dans la base de données.
    2.  **Intégration d'un Vrai Système de Paiement** : Remplacer les liens de paiement simulés par une solution comme Stripe ou PayPal.
    3.  **Profils Vendeurs Publics** : Permettre aux clients de voir tous les produits d'un même vendeur.
    4.  **Notifications** : Informer les vendeurs lors d'une nouvelle commande (via Firebase Cloud Messaging).
    5.  **Tests et Déploiement en Production** : Mettre en place des tests automatisés et déployer l'application sur un environnement de production stable via Firebase App Hosting.

Ce plan devrait vous donner une excellente base pour votre soutenance. Bonne chance !
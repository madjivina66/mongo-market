# MongoMarket - Présentation de l'Application

Ce document décrit l'application MongoMarket, une place de marché en ligne moderne. Il présente son objectif, ses fonctionnalités principales, et les technologies utilisées pour sa construction.

---

### Qu'est-ce que MongoMarket ?

**MongoMarket** est une application web conçue pour fonctionner comme une place de marché en ligne, connectant les commerçants de produits frais (agriculteurs, artisans, etc.) avec les consommateurs. Elle a été développée pour être une plateforme robuste, sécurisée et performante, offrant une expérience utilisateur professionnelle tant pour les clients que pour les vendeurs.

**Problématique adressée** : Faciliter l'accès au marché numérique pour les petits commerçants tout en offrant une expérience d'achat fluide et centralisée aux clients.

---

### Fonctionnalités Clés de l'Application

L'application est divisée en deux grands parcours : le parcours client et l'espace vendeur.

#### 1. Parcours Client

*   **Découverte des Produits** :
    *   Une page principale (`/products`) affiche une grille de tous les produits disponibles.
    *   Les utilisateurs peuvent **rechercher** des produits par nom et les **filtrer** par catégorie (Légumes, Fruits, Viande, etc.).

*   **Détails du Produit** :
    *   Chaque produit possède une page de détail (`/products/[id]`) avec une grande image, une description complète, et le prix.
    *   Un bouton "Ajouter au panier" permet de commencer le processus d'achat.

*   **Panier d'Achat Interactif** :
    *   Un panier accessible depuis toute l'application permet de voir les articles sélectionnés.
    *   Les utilisateurs peuvent **modifier la quantité** des articles ou les **supprimer**.
    *   Le contenu du panier est sauvegardé dans le `localStorage` du navigateur, persistant même après fermeture de l'onglet.

*   **Finalisation de la Commande (`/checkout`)** :
    *   Une page récapitule la commande et le montant total.
    *   Elle propose des options de paiement (simulées) qui redirigent vers des plateformes externes.

*   **Gestion de Compte** :
    *   Les utilisateurs peuvent s'inscrire (`/signup`) et se connecter (`/login`).
    *   Une fois connectés, ils peuvent consulter leur profil (`/profile`) et l'historique de leurs commandes (`/orders`).

#### 2. Espace Vendeur (Routes `/admin`)

Cet espace est sécurisé et accessible uniquement aux utilisateurs authentifiés.

*   **Tableau de Bord des Produits (`/admin/my-products`)** :
    *   Affiche la liste de **tous les produits mis en vente par le vendeur connecté**.
    *   Permet d'accéder aux actions de modification et de suppression.

*   **Gestion Complète de l'Inventaire (CRUD)** :
    *   **Créer** : Un formulaire (`/admin/add-product`) permet aux vendeurs d'ajouter de nouveaux produits avec un nom, une description, un prix, une catégorie et une image.
    *   **Modifier** : En cliquant sur "Modifier", le vendeur accède à un formulaire pré-rempli pour mettre à jour un produit existant.
    *   **Supprimer** : Le vendeur peut retirer définitivement un produit de la vente via une boîte de dialogue de confirmation.

#### 3. Fonctionnalités Avancées

*   **Optimiseur de Publicité par IA (`/admin/ad-optimizer`)** :
    *   Une fonctionnalité **réservée aux membres "Pro"**.
    *   Elle utilise le framework **Genkit** pour appeler un modèle d'IA (Gemini).
    *   L'IA analyse des données de vente et des préférences clients pour recommander la plateforme publicitaire la plus pertinente (Facebook, Instagram, WhatsApp), aidant ainsi le vendeur à optimiser ses dépenses.

*   **Abonnement "Pro" (`/subscription`)** :
    *   Une page présente les avantages d'un abonnement payant.
    *   Un bouton permet à l'utilisateur de "passer Pro", mettant à jour son statut dans la base de données.

*   **Progressive Web App (PWA)** :
    *   L'application est **installable sur les téléphones mobiles** grâce à un fichier `manifest.json`.
    *   Une fois installée, elle apparaît sur l'écran d'accueil et se lance dans une fenêtre dédiée, sans la barre d'adresse du navigateur, pour une expérience similaire à une application native.

---

### Architecture et Technologies

*   **Frontend** : **Next.js** (avec App Router) et **React**.
*   **Styling** : **TailwindCSS** et **ShadCN UI** pour une interface moderne et responsive.
*   **Backend & Base de Données** : **Firebase**
    *   **Firestore** comme base de données NoSQL en temps réel.
    *   **Firebase Authentication** pour la gestion des utilisateurs (email/mot de passe et anonyme).
    *   **Firebase Admin SDK** utilisé dans les **Next.js Server Actions** pour sécuriser les opérations d'écriture (création, modification, suppression).
*   **Intelligence Artificielle** : **Genkit** pour orchestrer les appels aux grands modèles de langage (LLM).
*   **Déploiement** : Prêt pour le déploiement sur **Firebase App Hosting**.

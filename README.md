
Projet de formation DWWM :

# 🌿 WrapVintage

WrapVintage est un site e-commerce dédié à la vente de **bracelets en perles de pierres naturelles**. Ce projet a pour but de proposer une boutique en ligne moderne, responsive et sécurisée, permettant aux utilisateurs de découvrir des créations artisanales, de passer commande et de suivre leurs achats en toute simplicité.

---

### 🚀 Fonctionnalités clés

#### 🛍️ Boutique en ligne
- Affichage des produits avec images, prix, description
- Filtres et tri (par pierre, prix, nouveauté, etc.)
- Page de détails avec mise en avant des matériaux naturels
- Gestion des stocks :afficher les quantités restantes, alerter en cas de rupture

#### 🧺 Panier
- Ajout et suppression de produits
- Modification des quantités
- Calcul automatique du total

#### 👤 Gestion utilisateur
- Inscription et connexion sécurisée (JWT)
- Espace personnel : infos du compte, historique des commandes
- Déconnexion

#### 💳 Paiement sécurisé
- Paiement par carte bancaire via **Stripe**
- Redirection et confirmation après paiement
- Sécurité des données de transaction

#### 🔐 Sécurité
- Authentification par **jeton JWT**
- Protection des routes sensibles (commande, profil, admin)
- Validation côté frontend et backend

#### 📱 Responsive design
- Interface optimisée pour **mobile et desktop**
- Navigation fluide sur tous les supports

#### 🛠️ Back-office
- Gestion des produits (CRUD)
- Suivi des commandes
- Interface réservée aux administrateurs

---

### 🧰 Stack technique

| Partie            | Technologie       |
|-------------------|------------------|
| **Frontend**       | Angular           |
| **Backend**        | Express.js (Node.js) |
| **Base de données**| MariaDB           |
| **Authentification** | JWT (JSON Web Tokens) |
| **Paiement**       | Stripe            |
| **Responsive**     | HTML / CSS |

---

### 💡 Améliorations futures possibles

- 🧾 **Génération de factures PDF** après chaque commande
- 📨 **Envoi de notifications par email** (confirmation de commande, expédition, etc.)
- 🗣️ **Ajout d’un système d’avis** et de notation des produits
- 🌐 **Internationalisation (i18n)** : proposer le site en plusieurs langues
- 📊 **Dashboard administrateur** : statistiques de ventes, produits populaires
- 🔎 **Moteur de recherche avancé** avec filtres dynamiques et autocomplétion
- 🧪 **Ajout de tests** unitaires (frontend/backend) et de tests end-to-end (E2E)
- 📁 **Import/Export de données** pour les administrateurs (CSV/Excel)

---

### ✅ Conclusion

Ce projet m’a permis de développer une application e-commerce complète en utilisant une stack moderne : **Angular** pour le frontend, **Express.js** pour le backend, **MariaDB** pour la base de données, et **Stripe** pour la gestion des paiements sécurisés.

WrapVintage a été pensé pour offrir une **expérience utilisateur fluide**, une **interface responsive**, et une **architecture robuste**. Ce site constitue une base solide qui pourra être enrichie dans le futur par de nouvelles fonctionnalités et optimisations.

# Strategie billing et gating — web + mobile

Date de reference : `2026-03-17`

## Decision rapide

Claiire construit deja une suite mobile.

Donc :

- **mobile** : achats natifs via **Apple In-App Purchase** et **Google Play Billing**
- **orchestration mobile des abonnements et entitlements** : **RevenueCat**
- **web** : deux options
  - **option A** : **Polar** pour la vente web si la priorite est de simplifier taxes et compta
  - **option B** : **RevenueCat Web Billing** si la priorite est d'avoir une pile d'abonnement plus unifiee techniquement

## Point de clarte important

Tu n'es **pas obligee d'utiliser RevenueCat**.

En revanche, si tu vends du contenu ou des fonctionnalites numeriques **dans les apps**, tu es en pratique tres souvent obligee d'utiliser :

- **Apple In-App Purchase** sur iOS
- **Google Play Billing** sur Android

RevenueCat ne remplace pas les stores.
RevenueCat sert a **unifier** :

- les produits Apple
- les produits Google
- les entitlements premium
- la logique cross-platform

## Ce qui est obligatoire, et ce qui ne l'est pas

### Obligatoire ou quasi obligatoire pour une app premium classique

- paiements in-app via les systemes des stores
- respect des regles Apple et Google sur les biens numeriques in-app

### Pas obligatoire

- RevenueCat
- Polar

### Alternative principale a RevenueCat

Faire la pile a la main :

- **StoreKit 2** sur iOS
- **Google Play Billing** sur Android
- ton propre backend pour :
  - verifier les achats
  - suivre les abonnements
  - gerer les expirations
  - unifier les droits premium

Cette alternative existe, mais elle est plus lourde et plus fragile.

## Comparaison simple

### RevenueCat

Points forts :

- pense pour les abonnements **mobile**
- gere tres bien les **entitlements cross-platform**
- bon choix si Claiire doit vivre sur **iOS + Android + web**
- localisation nettement plus avancee que Polar

Points faibles :

- ce n'est **pas** un Merchant of Record
- pour le web, tu restes plus exposee a la mecanique **Stripe + fiscalite**
- si tu veux zero complexite fiscale web, RevenueCat ne suffit pas a lui seul

### Polar

Points forts :

- excellent pour la vente **web**
- **Merchant of Record**
- plus confortable si tu detestes la **TVA, la fiscalite et la compta**
- checkout et facturation web tres propres

Points faibles :

- pas pense comme centre de controle principal pour les achats **iOS / Android**
- couverture langue plus limitee
- si tu veux lier **Polar web** et **RevenueCat mobile**, il faut une couche backend de synchronisation

## Frais, taxes, langues — synthese

### RevenueCat

- plan Pro : gratuit jusqu'a `2.5k USD` de MTR puis `1%`
- en web billing, il faut ajouter les frais **Stripe**
- RevenueCat Web Billing s'appuie aussi sur **Stripe Tax** si tu l'actives
- RevenueCat Web Billing annonce `33` langues dans sa localisation web
- Customer Center annonce `32` langues par defaut

### Polar

- frais de base : `4% + 0.40 USD` par transaction
- `+0.5%` pour les abonnements
- `+1.5%` pour certaines cartes internationales non-US
- Polar agit comme **Merchant of Record** et prend en charge la couche fiscale de sa plateforme
- localisation checkout encore en **beta**
- seulement `7` langues listees actuellement : `en`, `nl`, `es`, `fr`, `sv`, `de`, `hu`
- `pt-BR` annonce
- pendant cette beta, emails transactionnels et customer portal restent largement en anglais

## Recommandation pour Claiire

### Recommandation produit

La recommandation la plus realiste pour Claiire est une **architecture hybride** :

- **mobile** : Apple + Google + RevenueCat
- **web** : Polar
- **backend Claiire** : couche de verite sur l'acces membre

### Pourquoi ce n'est pas "RevenueCat partout"

Si tu detestes la fiscalite web, Polar a un vrai avantage.

Mais si tu choisis Polar sur le web, il faut accepter une consequence :

**RevenueCat ne peut pas devenir a lui seul la source unique de verite sans pont technique.**

Autrement dit :

- pour les achats **mobile**, RevenueCat peut etre la source directe des entitlements
- pour les achats **web via Polar**, ton **backend Claiire** doit recevoir l'evenement d'achat et ouvrir l'acces
- ensuite, tu choisis soit :
  - de laisser **ton backend** etre la vraie source de verite pour le premium
  - soit de **miroiter** cet acces vers RevenueCat avec leur API de grant d'entitlement

## Recommandation technique nette

### Source de verite

Si Polar reste le choix web, la source de verite la plus saine devient :

- **backend Claiire**

et non :

- RevenueCat seul

### Pourquoi

Parce que le backend est le seul endroit ou tu peux reunir proprement :

- les achats Apple
- les achats Google
- les achats Polar
- les eventuels acces offerts ou manuels

## Architecture cible

### 1. Identite utilisateur unique

Chaque personne doit avoir un identifiant Claiire stable :

- `user_id`

Puis des identifiants rattaches :

- `revenuecat_app_user_id`
- `polar_customer_id`

### 2. Entitlement metier unique

Pour demarrer, garde une logique simple :

- `premium`

Si tu veux segmenter plus tard :

- `premium_formations`
- `premium_app`
- `premium_global`

Mais au debut, un seul entitlement t'evite beaucoup de confusion.

### 3. Table d'acces membre

Le backend doit pouvoir stocker au minimum :

- `user_id`
- `access_level`
- `source`
  - `apple`
  - `google`
  - `polar`
  - `manual`
- `status`
  - `active`
  - `grace_period`
  - `expired`
  - `revoked`
- `started_at`
- `expires_at`
- `external_customer_id`
- `external_subscription_id`
- `last_synced_at`

### 4. Flux mobile

1. L'utilisateur achete dans l'app
2. Apple ou Google valide la transaction
3. RevenueCat recoit et normalise l'etat d'abonnement
4. Le backend Claiire recupere l'etat premium
5. L'app ouvre l'entitlement
6. Le site peut aussi reconnaitre ce droit premium via le compte Claiire

### 5. Flux web avec Polar

1. L'utilisateur achete sur le site via Polar
2. Polar encaisse et gere la couche fiscale web
3. Polar envoie un webhook au backend Claiire
4. Le backend active `premium` pour cet utilisateur
5. Le site ouvre `/membres/`
6. Si tu veux que l'app voie aussi cet acces, le backend doit aussi le propager vers RevenueCat ou exposer lui-meme le droit premium a l'app

## Le vrai arbitrage

### Option 1 — La plus simple fiscalement

- web : Polar
- mobile : Apple / Google + RevenueCat
- backend Claiire : source de verite unifiee

Avantage :

- moins de charge fiscale web

Cout :

- un peu plus de complexite technique

### Option 2 — La plus simple techniquement

- web : RevenueCat Web Billing
- mobile : Apple / Google + RevenueCat
- RevenueCat devient le centre principal des entitlements

Avantage :

- pile d'abonnement plus unifiee

Cout :

- web moins confortable fiscalement qu'un vrai Merchant of Record comme Polar

## Ma recommandation finale

Vu tes preferences explicites :

- tu veux des apps
- tu veux du premium
- tu detestes les taxes et la compta

La meilleure decision n'est pas "RevenueCat ou Polar".

La meilleure decision est :

- **RevenueCat pour le mobile**
- **Polar pour le web**
- **backend Claiire comme couche d'unification des droits**

C'est le meilleur compromis entre :

- contraintes stores
- simplicite fiscale web
- futur mobile
- evolution produit

## Consequence pratique

Il faut maintenant planifier trois chantiers distincts :

1. **auth membre**
2. **modele d'entitlement premium**
3. **synchronisation des droits** entre RevenueCat, Polar et Claiire

## Sources officielles

### Stores

- Apple App Review Guidelines : <https://developer.apple.com/app-store/review/guidelines/>
- Google Play payments policy : <https://support.google.com/googleplay/android-developer/answer/16070163>

### RevenueCat

- Pricing : <https://www.revenuecat.com/pricing/>
- Web Billing overview : <https://www.revenuecat.com/docs/web/web-billing/overview>
- Web Billing localization : <https://www.revenuecat.com/docs/web/web-billing/localization>
- Customer Center configuration : <https://www.revenuecat.com/docs/tools/customer-center/customer-center-configuration>
- Entitlements : <https://www.revenuecat.com/docs/entitlements>
- Projects authentication : <https://www.revenuecat.com/docs/projects/authentication>
- SDK-less integration : <https://www.revenuecat.com/docs/migrating-to-revenuecat/sdk-or-not/sdk-less-integration>

### Polar

- Pricing : <https://polar.sh/resources/pricing>
- Merchant of Record fees : <https://polar.sh/docs/merchant-of-record/fees>
- Merchant of Record tax : <https://polar.sh/docs/merchant-of-record/tax>
- Checkout localization : <https://polar.sh/docs/features/checkout/localization>
- Customer portal : <https://polar.sh/docs/features/customer-portal>

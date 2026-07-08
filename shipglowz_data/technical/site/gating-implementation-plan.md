# Plan d'implementation — gating premium web + mobile

Date de reference : `2026-03-17`

## Objectif

Mettre en place un vrai acces premium qui fonctionne dans les trois contextes :

- site Claiire
- app iOS
- app Android

avec cette architecture cible :

- **mobile billing** : Apple + Google
- **orchestration mobile** : RevenueCat
- **web billing** : Polar
- **source de verite produit** : backend Claiire

## Prerequis

Avant toute implementation, il faut figer :

1. le systeme d'auth membre
2. le nom de l'entitlement principal
3. l'URL de retour apres achat
4. la logique de liaison compte web <-> compte app

## Decision de base

### Identite

Chaque personne a un compte Claiire unique.

Champs minimaux :

- `user_id`
- `email`
- `revenuecat_app_user_id`
- `polar_customer_id`

### Entitlement

Pour le demarrage :

- `premium`

Ce droit unique ouvre :

- les pages `/membres/formations/...`
- les zones premium de l'app

## Phases de chantier

## Phase 1 — Auth membre

### Livrables

- creation de compte
- connexion
- session persistante
- page compte

### Resultat attendu

Chaque achat doit pouvoir etre rattache a un `user_id` stable.

Sans cette couche, il ne faut pas lancer le vrai gating.

## Phase 2 — Modele d'acces premium

### Table recommandee

`member_access`

Champs minimaux :

- `user_id`
- `access_level`
- `source`
- `status`
- `started_at`
- `expires_at`
- `external_customer_id`
- `external_subscription_id`
- `metadata`
- `last_synced_at`

### Valeurs recommandees

`source` :

- `apple`
- `google`
- `polar`
- `manual`

`status` :

- `active`
- `grace_period`
- `expired`
- `revoked`

## Phase 3 — Protection du site

### Routes a proteger

- `/membres/`
- `/membres/formations/`
- tout ce qui vit sous `/membres/formations/**`

### Comportement

Si non connecte :

- redirection vers `/connexion`

Si connecte mais non premium :

- redirection vers la page publique equivalente
- ou vers une page de debloquage dediee

Exemple :

- demande : `/membres/formations/victimes/2-guerison/`
- fallback : `/formations/victimes/2-guerison/`

## Phase 4 — Flux Polar web

### Objectif

Ouvrir le premium web sans trainer la fiscalite dans Claiire.

### Etapes

1. l'utilisateur connecte clique sur "Debloquer"
2. Claiire cree ou retrouve le client Polar avec `user_id` en metadata
3. Polar gere checkout et encaissement
4. Polar appelle un webhook Claiire
5. Claiire active `premium`
6. Claiire redirige vers :
   - `/membres/formations/...`
   - ou `/compte`

### Webhooks a traiter

- achat cree
- abonnement actif
- abonnement renouvele
- abonnement annule
- abonnement expire
- remboursement ou revocation si disponible

## Phase 5 — Flux RevenueCat mobile

### Objectif

Normaliser les achats Apple / Google sans gerer chaque store a la main dans l'app.

### Etapes

1. l'utilisateur se connecte a l'app avec son compte Claiire
2. l'app associe ce compte a `revenuecat_app_user_id`
3. l'achat se fait via Apple ou Google
4. RevenueCat calcule l'etat de l'entitlement
5. Claiire recoit ou interroge l'etat premium
6. Claiire synchronise `member_access`

## Phase 6 — Synchronisation web <-> mobile

### Cas 1 — Achat mobile puis acces web

1. achat dans l'app
2. RevenueCat active `premium`
3. Claiire synchronise `member_access`
4. le site ouvre `/membres/`

### Cas 2 — Achat web Polar puis acces app

1. achat via Polar
2. Claiire active `member_access`
3. l'app lit ce droit via l'API Claiire
4. optionnel : Claiire miroite le droit vers RevenueCat pour garder un etat visible aussi cote RevenueCat

## Point d'attention

Si Polar reste le checkout web, il ne faut pas faire semblant que RevenueCat suffit seul.

Le backend Claiire doit etre capable d'ouvrir l'acces premium **meme sans RevenueCat** pour les achats web.

## Phase 7 — UX d'achat

### Sur les pages publiques formation

Bouton principal :

- `Debloquer le module complet`

Si utilisateur non connecte :

- redirection vers `/connexion?next=/formations/...`

Si utilisateur connecte mais non premium :

- ouverture du checkout web Polar

Si utilisateur deja premium :

- redirection directe vers la page membre equivalente

## Phase 8 — Compte utilisateur

La page compte devra afficher :

- statut premium
- origine de l'acces
- date de renouvellement ou d'expiration
- lien "gerer mon abonnement"
- lien vers les contenus membres

## Ordre recommande

1. choisir l'auth
2. creer `member_access`
3. proteger `/membres/`
4. brancher Polar webhooks
5. brancher RevenueCat mobile
6. relier site et app au meme `user_id`
7. seulement apres : onboarding, upsells, grace period, restoration flows

## Ce qu'il ne faut pas faire

- cacher du premium seulement en front
- compter uniquement sur JavaScript pour proteger `/membres/`
- avoir des comptes distincts web et app sans strategie de liaison
- traiter Polar comme s'il remplacait Apple / Google dans les apps
- traiter RevenueCat comme s'il supprimait le besoin d'un backend Claiire

## Definition de termine

Le chantier est considere termine quand :

- un achat web Polar ouvre bien le premium sur le site
- un achat mobile via RevenueCat ouvre bien le premium dans l'app
- le meme compte Claiire peut utiliser son premium sur web et mobile
- les pages `/membres/` sont protegees cote serveur
- le statut premium peut etre audite depuis la page compte

# Guidelines — Claiire-App

Ce document définit les règles incontournables pour toute contribution au projet Claiire-App. Chaque personne qui écrit du code, du contenu ou du design doit les respecter.

---

## Vocabulaire safe

> **CRITIQUE — Cette section est non-négociable.**

Claiire n'est **pas** une application médicale. C'est un compagnon de bien-être gamifié. Le vocabulaire doit refléter cette posture en permanence.

### Mots interdits

| ❌ NE JAMAIS UTILISER | Raison |
|---|---|
| traitement | Connotation médicale |
| thérapie | Connotation clinique |
| soigner | Implique un acte médical |
| diagnostic | Réservé aux professionnels de santé |
| sevrage | Trop clinique et anxiogène |
| trouble | Pathologisant |
| maladie | Médicalisant |
| patient | Positionne l'utilisateur comme malade |

### Mots à utiliser

| ✅ UTILISER | Contexte |
|---|---|
| accompagnement | Ce que Claiire offre |
| bien-être | L'objectif global |
| progression | Le parcours de l'utilisateur |
| parcours | Le chemin, l'aventure |
| évolution | Les changements positifs |
| compagnon / allié | Ce que sont les personnages IA |
| combat / victoire | La métaphore gamifiée |
| mission / défi | Les actions quotidiennes |
| force intérieure | La capacité de l'utilisateur |
| habitudes | Ce qu'on construit |

Cette règle s'applique partout : code (noms de variables, commentaires), UI (textes affichés), documentation, contenu marketing, communications.

---

## Ton et voix

- **Encourageant** : Toujours positif, même en cas de rechute ("chaque jour est un nouveau combat")
- **Bienveillant** : Jamais de jugement, jamais de culpabilisation
- **Jamais clinique** : On parle de "combat" et de "victoire", pas de "traitement" et de "guérison"
- **Direct** : Pas de jargon inutile, phrases courtes, langage accessible
- **Empowering** : L'utilisateur est un guerrier, pas un malade

---

## Gamification

Tout est un jeu. Le sérieux est dans le fond, pas dans la forme.

- **XP** : Chaque action positive rapporte de l'expérience
- **Niveaux** : Progression visible et gratifiante
- **Streaks** : Jours consécutifs de victoire — le mécanisme de rétention principal
- **Badges** : Récompenses pour les accomplissements marquants
- **Missions** : Actions quotidiennes présentées comme des quêtes
- **Arsenal** : Outils et techniques débloqués au fil de la progression

Le système de combat est la métaphore centrale. L'utilisateur combat ses démons, pas sa maladie.

---

## Les 5 compagnons

Chaque compagnon a une personnalité distincte et un rôle précis :

| Compagnon | Personnalité | Rôle | Phase |
|---|---|---|---|
| **Lumo** | Stratège calme | Planification, réflexion, analyse | MVP |
| **Papillon** | Hype énergique | Motivation, célébration, énergie | MVP |
| **Étoile** | Doux et apaisant | Réconfort, écoute, apaisement | MVP |
| **Sage** | Analytique | Données, tendances, insights | Phase 2 |
| **Aurore** | Motivateur | Objectifs, défis, dépassement | Phase 2 |

Les compagnons ne sont jamais condescendants. Ils parlent à l'utilisateur comme un ami proche, pas comme un professionnel.

---

## Dual Mode

### Mode Warrior
- **Ambiance** : Sombre, intense
- **Couleurs** : Rouge, orange, tons chauds
- **Contenu** : Missions de combat, batailles, arsenal, XP
- **Quand** : L'utilisateur veut se battre activement

### Mode Zen
- **Ambiance** : Clair, apaisant
- **Couleurs** : Bleu, vert, tons froids
- **Contenu** : Habitudes, journal, méditation, respiration
- **Quand** : L'utilisateur veut se poser, réfléchir

L'utilisateur choisit son mode. Jamais de mode forcé.

---

## Design

- **Mobile-first** : C'est une app mobile, chaque décision design part du petit écran
- **Mode sombre par défaut** : Apaisant, discret, économe en batterie (OLED)
- **Animations Rive** : Fluides, expressives, jamais gratuites — chaque animation a un but
- **Micro-interactions** : Feedback visuel pour chaque action (vibration haptique, animation XP)
- **Accessibilité** : Interface simple, onboarding progressif, pas de surcharge cognitive
- **Navigation** : Expo Router, navigation intuitive, jamais plus de 2 taps pour une action clé

---

## Confidentialité

**Mettre en avant le 100% on-device à chaque occasion.** C'est LE différenciateur.

- Le LLM tourne sur le téléphone — aucune conversation n'est envoyée à un serveur
- Les données sensibles restent en local (MMKV)
- Convex stocke uniquement les données de progression (XP, streaks, badges)
- `deleteAllUserData()` disponible dès le jour 1
- Pas de tracking invasif, jamais
- Conformité RGPD native

---

## Conventions de code

### TypeScript
- **Strict mode** : zéro `any` — toujours typer explicitement
- **Nommage** : camelCase pour les variables/fonctions, PascalCase pour les composants/types
- **Imports** : Organisés par catégorie (React, libs externes, composants internes, utils)

### Architecture données
- **Convex** = source de vérité pour les données persistantes (profil, progression, streaks)
- **Zustand** = état UI uniquement (mode actif, navigation, préférences temporaires)
- **MMKV** = stockage local rapide (cache, données sensibles, conversations IA)

### Organisation
- **Features isolées** : Chaque fonctionnalité dans son propre dossier avec ses composants, hooks et utils
- **Composants partagés** : Dans un dossier `components/` commun uniquement si utilisés à 3+ endroits
- **Pas de logique métier dans les composants** : Extraire dans des hooks ou des utils

### Tests
- Tester les hooks et la logique métier en priorité
- Les composants UI : tests de snapshot si complexes
- Les conversations IA : tests unitaires sur le prompt engineering

# Business — Claiire-App

## Mission

Aider les gens à surmonter leurs addictions et gérer leur bien-être mental via un compagnon IA gamifié, 100% privé. Claiire transforme le parcours de récupération en aventure de combat, où chaque jour est une victoire.

---

## Proposition de valeur

- **IA on-device** (llama.rn) : zéro coût API, confidentialité totale — les données ne quittent jamais le téléphone
- **Gamification** : un système de combat déguisé en application de suivi — XP, niveaux, missions, streaks
- **Compagnons animés** : 5 personnages avec des personnalités distinctes qui accompagnent l'utilisateur au quotidien (Rive animations)

---

## Business Model

### Freemium + abonnement premium (RevenueCat)

| | Gratuit | Premium |
|---|---|---|
| Compagnons | 1 compagnon au choix | 5 compagnons débloqués |
| Fonctionnalités | Suivi quotidien, journal de base | Mode Warrior complet, arsenal étendu |
| Statistiques | Basiques (streak, XP) | Avancées (tendances, analyses, exports) |
| Modes | Zen uniquement | Warrior + Zen |
| Chat IA | Limité | Illimité |

L'objectif est de rendre la version gratuite suffisamment utile pour fidéliser, tout en gardant les fonctionnalités les plus engageantes en premium.

---

## Persona principal

### "Le Combattant Silencieux"

- **Âge** : 25-45 ans
- **Situation** : Lutte contre une addiction ou un mal-être, souvent en silence
- **Besoins** : Un outil discret, non-jugeant, accessible 24h/24
- **Frustrations** : Les apps existantes sont trop cliniques, trop chères (abonnements API), ou ne respectent pas la vie privée
- **Comportement** : Utilise son téléphone comme premier réflexe — l'app doit être là quand il en a besoin, sans barrière

---

## Avantage concurrentiel

### Cost moat — IA on-device

Les concurrents (Woebot, Wysa, Replika) paient par appel API vers des LLM cloud. Chaque conversation coûte de l'argent. Claiire ne paie **rien** pour l'IA grâce au LLM on-device (llama.rn).

Conséquences :
- **Marge brute supérieure** dès le premier utilisateur
- **Scalabilité sans surcoût** proportionnel
- **Argument marketing puissant** : "100% privé, tes données restent sur ton téléphone"
- **Aucune dépendance** à un fournisseur d'API tiers

---

## Marché

- **Marché global** : Wellness apps — $7B+ et en croissance
- **Sous-segment** : Addiction recovery et santé mentale numérique
- **Tendances favorables** :
  - Démocratisation de l'IA embarquée sur mobile
  - Sensibilisation croissante au bien-être mental
  - Défiance envers les apps qui collectent des données personnelles
  - Gamification prouvée pour l'engagement et le changement comportemental

---

## Go-to-Market

1. **Distribution** : App Store + Google Play (Expo EAS builds)
2. **Partenariats** : Associations d'accompagnement, groupes de soutien, structures communautaires
3. **Contenu éducatif** : Articles et ressources sur claiire.com (SEO, crédibilité)
4. **Bouche-à-oreille** : L'aspect gamifié et les compagnons animés favorisent le partage naturel
5. **ASO** : Optimisation des fiches store avec les bons mots-clés (bien-être, habitudes, compagnon IA)

---

## Métriques clés

| Métrique | Objectif | Pourquoi |
|---|---|---|
| **DAU** (utilisateurs actifs quotidiens) | Croissance régulière | Indicateur de valeur perçue |
| **Streak retention** (J7, J30, J90) | >40% J7, >20% J30 | Le streak est le cœur de l'engagement |
| **Taux conversion free → premium** | 5-8% | Benchmark apps freemium santé |
| **NPS** (Net Promoter Score) | >50 | Mesure la recommandation organique |
| **Session duration** | >3 min/session | Indique un engagement réel, pas du doomscrolling |
| **Churn premium** | <5% mensuel | Rétention des abonnés payants |

---

## Stack technique (impact business)

- **React Native + Expo 55** : Un seul code pour iOS et Android — réduction des coûts de développement
- **Convex** : Backend serverless — pas de serveur à maintenir, coûts proportionnels à l'usage
- **Clerk** : Authentification clé en main — conformité et sécurité sans effort
- **llama.rn** : IA on-device — zéro coût par conversation
- **RevenueCat** : Gestion des abonnements cross-platform — simplifie la monétisation

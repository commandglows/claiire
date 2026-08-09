# Sources — Claiire-App

Ce document recense les sources de recherche, les données marché et les ressources techniques qui fondent les décisions de Claiire-App.

---

## Recherche scientifique

### Gamification et changement comportemental

- **Deterding, S. et al. (2011)** — "From Game Design Elements to Gamefulness: Defining Gamification" — Cadre théorique fondateur pour l'application des mécaniques de jeu au changement de comportement
- **Hamari, J., Koivisto, J., & Sarsa, H. (2014)** — "Does Gamification Work?" — Méta-analyse montrant l'efficacité de la gamification sur l'engagement et la motivation
- **Johnson, D. et al. (2016)** — "Gamification for Health and Wellbeing" — Revue systématique sur l'impact de la gamification dans les applications de bien-être
- **Lister, C. et al. (2014)** — "Just a Fad? Gamification in Health and Fitness Apps" — Analyse des mécaniques de gamification les plus efficaces pour la santé

### Interventions numériques en santé mentale

- **Fitzpatrick, K. K. et al. (2017)** — "Delivering Cognitive Behavior Therapy to Young Adults With Symptoms of Depression via a Fully Automated Conversational Agent" (Woebot) — Preuve de concept pour les chatbots de bien-être
- **Inkster, B. et al. (2018)** — "An Empathy-Driven, Conversational AI Agent (Wysa)" — Efficacité des agents conversationnels empathiques
- **Lattie, E. G. et al. (2019)** — "Digital Mental Health Interventions for Depression, Anxiety, and Enhancement of Psychological Well-Being" — Revue des interventions numériques efficaces

### Addiction recovery et mécanismes de rechute

- **Marlatt, G. A. & Gordon, J. R. (1985)** — "Relapse Prevention" — Modèle fondateur pour comprendre les mécanismes de rechute et les stratégies de prévention
- **Gustafson, D. H. et al. (2014)** — "A Smartphone Application to Support Recovery From Alcoholism" (A-CHESS) — Étude randomisée sur l'efficacité d'une app mobile dans la récupération
- **Kazemi, D. M. et al. (2017)** — "A Systematic Review of the mHealth Interventions to Prevent Alcohol and Substance Abuse" — Revue des interventions mobiles efficaces

### Psychologie positive

- **Seligman, M. E. P. (2011)** — "Flourish" — Modèle PERMA (Positive Emotions, Engagement, Relationships, Meaning, Achievement) — base pour le système de progression
- **Csikszentmihalyi, M. (1990)** — "Flow: The Psychology of Optimal Experience" — Concept de flow appliqué au design des missions et de la gamification
- **Duckworth, A. (2016)** — "Grit: The Power of Passion and Perseverance" — Fondement du système de streaks et de persévérance

### Cadre théorique ACT

- **Hayes, S. C. et al. (1999)** — "Acceptance and Commitment Therapy" — Cadre théorique principal pour les exercices proposés dans l'app
- **Harris, R. (2009)** — "ACT Made Simple" — Guide pratique pour l'application de l'ACT aux exercices quotidiens
- Principes ACT intégrés : défusion cognitive, acceptation, présence au moment, valeurs personnelles, actions engagées

---

## Données marché

### Taille et tendances du marché

- **App Annie / data.ai** — Données de marché sur les wellness apps : téléchargements, revenus, tendances d'usage
- **Sensor Tower** — Intelligence concurrentielle : benchmarks de rétention et de monétisation des apps de bien-être
- **Grand View Research** — Mental Health Apps Market : $7.3B en 2024, CAGR de 15.5% attendu jusqu'en 2030
- **Statista** — Digital Health Market : adoption croissante des outils numériques de bien-être mental post-2020

### Statistiques santé mentale

- **OMS (WHO)** — Données mondiales sur la santé mentale : 1 personne sur 4 concernée au cours de sa vie
- **Santé Publique France** — Données nationales sur le bien-être mental et les addictions
- **OFDT** (Observatoire Français des Drogues et des Tendances addictives) — Statistiques addiction en France
- **MILDECA** (Mission Interministérielle de Lutte contre les Drogues et les Conduites Addictives) — Données institutionnelles françaises

### Analyse concurrentielle

| App | Modèle IA | Prix | Point fort | Faiblesse vs Claiire |
|---|---|---|---|---|
| Woebot | Cloud API (GPT) | Gratuit + B2B | Recherche clinique | Coûts API, pas de gamification |
| Wysa | Cloud API | Freemium $99/an | Empathie IA | Données dans le cloud |
| Replika | Cloud API (GPT) | Freemium $69/an | Compagnon IA social | Pas orienté bien-être, API coûteuse |
| Headspace | Pas d'IA | $69/an | Marque forte | Pas personnalisé, pas d'IA conversationnelle |
| I Am Sober | Pas d'IA | Freemium | Communauté | Pas d'IA, pas gamifié |

---

## Ressources techniques

### IA on-device

- **llama.rn** — Bibliothèque React Native pour exécuter des LLM localement sur mobile
  - Documentation : [github.com/mybigday/llama.rn](https://github.com/mybigday/llama.rn)
  - Modèles compatibles : GGUF quantifiés (Llama 2/3, Mistral, Phi)
  - Contraintes : taille modèle limitée par la RAM du device (Q4_K_M recommandé)

### Animations

- **Rive** — Moteur d'animation pour les compagnons
  - Documentation : [rive.app/docs](https://rive.app/docs)
  - React Native runtime : `rive-react-native`
  - State machines pour les expressions et réactions des compagnons

### Stack technique

- **Expo SDK 55** — Framework React Native
  - Documentation : [docs.expo.dev](https://docs.expo.dev)
  - Expo Router pour la navigation file-based
  - EAS Build pour la distribution
- **Convex** — Backend serverless (temps réel, requêtes réactives)
  - Documentation : [docs.convex.dev](https://docs.convex.dev)
- **Clerk** — Authentification
  - Documentation : [clerk.com/docs](https://clerk.com/docs)
  - Intégration Expo : `@clerk/clerk-expo`
- **Zustand** — State management léger
  - Documentation : [github.com/pmndrs/zustand](https://github.com/pmndrs/zustand)
- **MMKV** — Stockage local performant (10x plus rapide qu'AsyncStorage)
  - Documentation : [github.com/mrousavy/react-native-mmkv](https://github.com/mrousavy/react-native-mmkv)
- **RevenueCat** — Gestion des abonnements in-app
  - Documentation : [revenuecat.com/docs](https://revenuecat.com/docs)
  - Best practices : gestion des edge cases (restore, grace period, billing retry)

---

## Lectures complémentaires

- **Nir Eyal (2014)** — "Hooked: How to Build Habit-Forming Products" — Modèle Hook (Trigger → Action → Reward → Investment) appliqué au design des streaks et notifications
- **Yu-kai Chou (2015)** — "Actionable Gamification" — Framework Octalysis pour analyser et optimiser les mécaniques de gamification
- **BJ Fogg (2019)** — "Tiny Habits" — Fondement du système de micro-missions quotidiennes

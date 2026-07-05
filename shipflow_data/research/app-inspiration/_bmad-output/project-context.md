---
project_name: 'tmv-app'
user_name: 'Runner'
date: '2026-03-07'
status: 'complete'
optimized_for_llm: true
sections_completed: ['technology_stack', 'typescript', 'expo_router', 'convex', 'state_management', 'security', 'structure', 'rive', 'llama', 'testing', 'anti_patterns', 'implementation_order']
---

# TMV App — Project Context for AI Agents

_Ce fichier contient les règles critiques que les agents AI doivent suivre avant d'implémenter quoi que ce soit. Focalisé sur les détails non-évidents que les LLMs ratent habituellement._

---

Read this file before implementing ANY code in this project.

## Technology Stack & Versions

- Expo ~55.0.5 | Expo Router ~55.0.4 | React 19.2.0 | React Native 0.83.2
- Reanimated 4.2.1 | TypeScript ~5.9.2 (strict)
- Path alias: `@/*` → `./*` (défini dans tsconfig.json)
- À installer: Convex, Clerk, Zustand, rive-react-native, llama.rn, react-native-mmkv, expo-secure-store, @sentry/react-native

## Contrainte Critique — EAS Dev Build

**Expo Go est INCOMPATIBLE** avec ce projet.
`rive-react-native`, `llama.rn` et `react-native-mmkv` requièrent des modules natifs compilés.
→ Toujours utiliser `eas build --profile development` pour tester.

## Règles TypeScript

- Zéro `any` — strict mode activé, aucune exception
- Imports via alias `@/` uniquement (jamais de chemins relatifs `../../`)
- Props composants : interface nommée `[Component]Props`
- Préférer `type` à `interface` sauf pour les contrats publics
- Types Convex auto-générés (`convex/_generated/`) = source de vérité pour les types data

## Règles Expo Router

- Screens : kebab-case (`sleep-log.tsx`, `log-mood.tsx`)
- Groupes de routes : parenthèses `(tabs)`, `(auth)`
- Layouts : toujours `_layout.tsx` dans chaque groupe
- Navigation programmatique : `router.push()` de `expo-router` uniquement

## Règles Convex

- Tables : camelCase singulier (`userProfile`, `wellnessLog`, `sleepLog`)
- Champs : camelCase (`userId`, `createdAt`, `moodScore`)
- Erreurs métier : `throw new ConvexError("CODE_STRING")` dans les mutations
- Erreurs système : laisser propager (Sentry les capture)
- Mutations retournent toujours l'id créé : `returns: v.id("tableName")`
- Le frontend n'appelle JAMAIS une API externe directement → Convex Actions uniquement

## Règles State Management (Zustand / Convex)

- **Convex** = source de vérité pour TOUTES les données persistées
- **Zustand** = état UI local UNIQUEMENT

✅ OK dans Zustand : `currentEmotion`, `isListening`, `isSpeaking`, état formulaire local
❌ INTERDIT dans Zustand : dupliquer `userProfile`, `sleepLogs` ou toute donnée Convex

- Stores Zustand : un par feature, fichier `store.ts`, suffixe `Store`

## Règles Sécurité & Stockage

- Données sensibles (tokens auth, clés) : `expo-secure-store` UNIQUEMENT
- `AsyncStorage` : INTERDIT pour données sensibles
- Conversations : chiffrées E2E (ne jamais logger en clair)
- Toutes les routes Convex valident `getUserId(ctx)` avant d'accéder aux données

## Règles Structure Feature

- Features isolées : `features/companion/` n'importe JAMAIS depuis `features/tracking/`
- Communication inter-features : via Convex uniquement
- `components/ui/` : zéro logique métier, zéro import depuis `features/`
- Logique métier : dans `features/[name]/hooks/` ou `features/[name]/engine/`

## Règles Rive

- Fichiers `.riv` dans `assets/companions/`
- State machines nommées en PascalCase : `EmotionMachine`, `TalkingMachine`
- États Rive synchronisés via `companionStore` (Zustand) uniquement
- Ne jamais déclencher une animation Rive directement depuis un écran

## Règles llama.rn

- Modèles GGUF dans le répertoire documents de l'app (exclus du git via `.gitignore`)
- Téléchargement 2 étapes : afficher `app/model-download.tsx` au premier lancement
- Toujours vérifier que le modèle est chargé avant d'appeler l'inférence
- Fallback obligatoire si modèle non disponible (mode texte sans voix)

## Règles Tests

- Co-localisation obligatoire : `Component.test.tsx` à côté de `Component.tsx`
- Couverture obligatoire : `xpEngine.ts`, `streakEngine.ts`, mutations Convex critiques
- Tests unitaires seulement pour MVP (Detox E2E différé post-MVP)

## Anti-Patterns INTERDITS

- `fetch()` direct vers une API externe → Convex Action obligatoire
- `AsyncStorage` pour tokens ou données sensibles → `expo-secure-store`
- Dupliquer des données Convex dans un store Zustand
- Imports entre features → passer par Convex
- `any` en TypeScript
- Chemins relatifs `../../` → alias `@/`
- Tester en Expo Go → EAS Dev Build
- Appeler `llama.rn` sans vérifier que le modèle est chargé

## Ordre d'Implémentation (dépendances bloquantes)

1. `convex/schema.ts` + Clerk auth — bloquant pour tout le reste
2. `app/_layout.tsx` — providers Convex + Clerk
3. `app/(auth)/` — login + onboarding
4. `app/(tabs)/_layout.tsx` — 5 tabs (Accueil, Companion, Journal, Progrès, Profil)
5. `features/tracking/` + Convex mutations — core loop
6. `features/gamification/engine/xpEngine.ts` — moteur XP centralisé
7. `features/companion/` — Rive + llama.rn pipeline
8. `features/analytics/` — patterns + alertes
9. RevenueCat — paiements in-app

---

## Usage

**Pour les agents AI :** Lire ce fichier avant d'écrire la moindre ligne de code. Suivre TOUTES les règles exactement. En cas de doute, prendre l'option la plus restrictive.

**Pour les humains :** Mettre à jour quand le stack ou les patterns évoluent. Supprimer les règles devenues évidentes.

_Last updated: 2026-03-07_

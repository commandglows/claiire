---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
status: 'complete'
completedAt: '2026-03-07'
inputDocuments:
  - shipflow_data/technical/app/ or shipflow_data/technical/site/
  - shipflow_data/business/business.md
workflowType: 'architecture'
lastStep: 8
project_name: 'tmv-app'
user_name: 'Runner'
date: '2026-02-07'
hasProjectContext: false
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements (13 identified):**

| ID | Feature | Priority | Architectural Impact |
|----|---------|----------|---------------------|
| FR1 | Auth & Account | P0 | Clerk integration, biometric, GDPR deletion |
| FR2 | Gamified Onboarding | P0 | Progressive disclosure, companion-driven, no tutorial |
| FR3 | Quick Battle Report (Crisis Logging) | P0 | <10s flow, native widgets, voice input |
| FR4 | Daily Missions (Habit Tracking) | P0 | Mission board, streak engine, XP calculations |
| FR5 | Enemy Intel (AI Pattern Recognition) | P0 | Convex scheduled jobs, rule-based Phase 1 |
| FR6 | Combat Arsenal (Interventions) | P0 | 100+ protocols, effectiveness tracking, weapon leveling |
| FR7 | Incoming Attack Alerts (Notifications) | P1 | Convex predictions, >85% confidence threshold |
| FR8 | War Room (Analytics Dashboard) | P1 | Charts, battle history, companion commentary, PDF export |
| FR9 | Health Integration | P2 | HealthKit/Google Fit, trust-based XP (no verification) |
| FR10 | AI Companion Chat | P0 | Local LLM (llama.cpp), 3 personalities MVP, config-driven |
| FR11 | Battle Arenas & View Modes | P2 | 2D/1D default, 3D opt-in, mutual exclusion with LLM |
| FR12 | Companion-Led Routines | P1 | Morning/night routines, guided execution, animations |
| FR13 | Gamification & XP System | P1 | Centralized XP engine, real-life outcomes only |

**Non-Functional Requirements:**

| NFR | Target | Impact |
|-----|--------|--------|
| Performance | <500ms API, 60fps 2D, <2s app load, <1s companion response | LLM warm-up strategy, template fallback |
| Cloud-first | Convex reactive for all data | Repository pattern for exit strategy |
| Privacy | GDPR, HIPAA considerations | E2E encrypted conversations, local LLM, no data to cloud AI |
| Security | Biometric auth, encrypted storage, cert pinning | AD-8 (7 sub-rules) |
| Cost | Near-zero per MAU | Local LLM (free), native STT/TTS (free), Convex only cost |
| Crash rate | <0.1% | Error boundaries, Sentry integration |

**Scale & Complexity:**

- Primary domain: Mobile full-stack (iOS + Android, Web Phase 3)
- Complexity level: HIGH (Level 3-4)
- Estimated architectural components: 15-20 major modules
- Real-time features: Yes (Convex reactive push)
- Regulatory compliance: GDPR mandatory, HIPAA advisory

### Technical Stack (Decided)

- **Frontend:** Expo (React Native), TypeScript, Expo Router, Reanimated
- **Backend:** Convex (BaaS) with repository abstraction layer
- **Auth:** Clerk
- **AI:** llama.cpp on-device (Gemma 2B / Llama 3.2 3B), zero cloud AI
- **Voice:** Native device STT + TTS (free)
- **Payments:** RevenueCat (MVP), Polar (Phase 3 web)
- **Rendering:** Rive (companion animations, state machines) + Reanimated (UI)

### Architectural Design Decisions

11 ADR documented in specfreev1.md (sections AD-1 through AD-11), covering:
- AD-1: 2D default, 3D progressive upgrade
- AD-2: 100% on-device LLM (llama.cpp, zero API cost)
- AD-3: Graceful offline degradation (cloud-first with emergency cache)
- AD-4: Centralized XP engine (single source of truth)
- AD-5: Config-driven companion system (personality files, not code)
- AD-6: GDPR deletion by design (day-1 cascade deletion)
- AD-7: Conservative prediction alerting (>85% confidence)
- AD-8: Security & privacy by design (7 sub-rules including E2E encryption)
- AD-9: First principles constraints (instant response, real-life gamification, progressive disclosure, data separation)
- AD-10: Cross-functional decisions (two-stage model download, trust-based XP, Convex exit strategy, 3 companions MVP, RevenueCat only)
- AD-11: Architecture records (flat project structure, conversation pipeline, pattern detection, navigation, Convex schema)

### Cross-Cutting Concerns Identified

1. **Gamification/XP Engine** — Centralized module (AD-4), rewards real-life outcomes only (AD-9b, AD-10b).
2. **Companion Personality System** — Config-driven (AD-5), 3 MVP companions (AD-10d), conversation pipeline (AD-11b).
3. **Battle Metaphor Mapping** — UI shows battle language, backend stores clinical data. Clean separation.
4. **Real-Time Reactivity** — Convex push subscriptions for metrics, patterns, achievements.
5. **Privacy/Encryption Layer** — E2E encrypted conversations (AD-8g), local LLM (AD-2), GDPR deletion (AD-6).
6. **Safety Guardrails** — Keyword interception (AD-8b), output filtering (AD-8c), crisis hotline escalation.

### Elicitation Methods Applied

- Pre-mortem Analysis → AD-1 through AD-7 (risk-driven decisions)
- Red Team vs Blue Team → AD-8 (security & privacy by design)
- First Principles Analysis → AD-9 (fundamental constraints)
- Cross-Functional War Room → AD-10 (trade-off resolutions)
- Architecture Decision Records → AD-11 (structural choices)

## Starter Template Evaluation

### Primary Technology Domain

Mobile application (iOS + Android) — React Native / Expo

### Starter Options Considered

| Starter | Expo Router | Structure | Verdict |
|---------|-------------|-----------|---------|
| `blank-typescript` | ❌ | Minimale | Insuffisant pour maintenabilité |
| `tabs` template | ✅ | Excellente | **Retenu** |
| `turbo-expo-nextjs-clerk-convex` | ✅ | Monorepo | Trop lourd (Next.js inutile) |

### Selected Starter: Expo tabs template

**Rationale:** File-based routing (Expo Router v3), TypeScript strict, navigation tabs préconfigurée, structure claire `app/` / `components/` / `constants/` / `hooks/`. Optimal pour maintenabilité long-terme.

**Initialization Command:**

```bash
npx create-expo-app@latest app --template tabs
```

**Architectural Decisions Provided by Starter:**

- **Language:** TypeScript strict
- **Navigation:** Expo Router v3 (file-based, `app/` directory convention)
- **Structure:** `app/` (screens), `components/`, `constants/`, `hooks/`
- **Build:** Expo managed workflow
- **Testing:** Jest + React Native Testing Library (à configurer)

**Note:** Le projet a été initialisé dans le monorepo courant sous `app/`. L'implémentation de la structure de base est la première story de la Phase 1.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- State management: Zustand
- Local storage: expo-secure-store (auth) + MMKV (app state)
- Component structure: Feature-based
- Build: EAS Build + GitHub Actions CI

**Important Decisions (Shape Architecture):**
- Testing: Jest + React Native Testing Library (Detox différé post-MVP)
- Couverture: logique métier critique obligatoire (XP engine, companion state, Convex mutations)

**Deferred Decisions (Post-MVP):**
- Detox E2E testing
- Polar web payments (Phase 3)
- Web dashboard (Phase 3)

### Data Architecture

- **Backend:** Convex BaaS — queries réactives, mutations, actions pour appels externes
- **Repository pattern:** Couche d'abstraction sur Convex pour faciliter exit strategy si besoin
- **Local storage auth:** `expo-secure-store` — chiffré natif (Keychain iOS / Keystore Android)
- **Local storage app state:** `react-native-mmkv` — synchrone, très rapide, persisté
- **Offline:** Cache d'urgence local (MMKV) + dégradation gracieuse (AD-3)
- **LLM model files:** Stockage dans le répertoire documents de l'app, téléchargement en 2 étapes

### Authentication & Security

- **Auth provider:** Clerk — biométrique, sessions JWT, suppression GDPR cascade day-1
- **Conversations:** Chiffrées E2E (AD-8g)
- **API security:** Cert pinning (AD-8), frontend ne parle jamais directement à une API externe — tout passe par Convex Actions
- **Sensitive data:** expo-secure-store uniquement, jamais AsyncStorage pour données sensibles

### API & Communication Patterns

- **Pattern:** Convex reactive (queries = souscriptions temps réel, mutations = writes, actions = appels API externes)
- **Frontend → Backend:** Convex client uniquement — pas de fetch direct vers APIs tierces
- **Erreur handling:** Error boundaries React Native + Sentry pour crash reporting
- **LLM pipeline:** STT natif → llama.rn (on-device) → TTS natif, orchestré localement sans réseau

### Frontend Architecture

- **State management:** Zustand — stores légers par domaine (companion, tracking, gamification, auth)
- **Navigation:** Expo Router v3 file-based — `app/(tabs)/`, `app/auth/`, `app/modal/`
- **Structure:** Feature-based
  ```
  features/
    companion/     (Rive, LLM pipeline, voice)
    tracking/      (sleep, mood, meals, habits)
    gamification/  (XP engine, achievements, streaks)
    analytics/     (patterns, insights, charts)
  ```
- **Components partagés:** `components/ui/` (atoms), `components/shared/` (molecules)
- **Hooks:** `hooks/` pour logique réutilisable (useConvex*, useCompanion, useXP)

### Infrastructure & Deployment

- **Build:** EAS Build (Expo Application Services) — iOS + Android
- **CI/CD:** GitHub Actions — lint + typecheck + tests sur chaque PR
- **Environments:** `development` / `preview` / `production` via EAS profiles
- **Crash reporting:** Sentry (`@sentry/react-native`)
- **App stores:** Google Play + App Store via EAS Submit

### Decision Impact Analysis

**Séquence d'implémentation imposée par ces décisions :**
1. Convex schema + Clerk auth (bloquant pour tout le reste)
2. Navigation Expo Router + structure features/
3. Zustand stores (companion, tracking)
4. Rive companion + llama.rn pipeline
5. Tracking screens + Convex mutations
6. XP engine + gamification
7. Analytics + patterns
8. RevenueCat + Polar

**Dépendances cross-composants clés :**
- Zustand `companionStore` ↔ Rive state machines (sync émotions)
- Convex `useQuery` ↔ Zustand (Convex = source de vérité, Zustand = UI locale)
- llama.rn ↔ MMKV (cache contexte conversation)
- XP engine ↔ tous les modules de tracking (chaque log déclenche XP)

## Implementation Patterns & Consistency Rules

### Critical Conflict Points: 6 zones identifiées

### Naming Patterns

| Élément | Convention | Exemple |
|---------|-----------|---------|
| Convex tables | camelCase singulier | `userProfile`, `wellnessLog` |
| Convex fields | camelCase | `userId`, `createdAt` |
| Composants | PascalCase | `CompanionAvatar.tsx` |
| Screens (Expo Router) | kebab-case | `sleep-log.tsx` |
| Hooks | camelCase, préfixe `use` | `useCompanion.ts` |
| Zustand stores | camelCase, suffixe `Store` | `companionStore.ts` |
| Dossiers features | kebab-case | `features/companion/` |

### Structure Patterns

```
app/                    # Expo Router screens
  (tabs)/               # Navigation tabs (bottom bar)
  (auth)/               # Écrans auth
  modal/                # Modals
features/               # Logique métier par domaine
  companion/
    components/
    hooks/
    store.ts
    types.ts
  tracking/
  gamification/
  analytics/
components/
  ui/                   # Atoms
  shared/               # Molecules
convex/                 # Fonctions Convex
hooks/                  # Hooks globaux
constants/
```

Tests : co-localisés avec le fichier source (`Component.test.tsx`)

### Format Patterns

- Convex mutations retournent toujours l'id créé
- Erreurs métier : `ConvexError` avec code string
- Erreurs système : propagation naturelle (Sentry)

### State Management Patterns

- **Convex** = source de vérité pour données persistées
- **Zustand** = état UI local uniquement (émotion Rive, micro, TTS)
- Interdit de dupliquer des données Convex dans Zustand

### Process Patterns

- Loading via état Convex `isLoading` (pas de `useState` manuel pour queries)
- Un `ErrorBoundary` par tab, pas uniquement global
- Messages erreur user : toujours en français, jamais les messages techniques

### TypeScript Rules

- Zéro `any` — strict mode activé
- Types Convex auto-générés = source de vérité
- Props : interface nommée `[Component]Props`
- Préférer `type` à `interface` sauf contrats publics

### All Agents MUST

1. Jamais `fetch` direct — toujours Convex Actions
2. Jamais `AsyncStorage` pour données sensibles — `expo-secure-store`
3. Jamais dupliquer données Convex dans Zustand
4. Tests co-localisés avec le fichier source
5. `ConvexError` pour toutes les erreurs métier dans les mutations

## Project Structure & Boundaries

### Complete Project Directory Structure

```
app/
├── app.json
├── eas.json
├── tsconfig.json
├── package.json
├── .env.local
├── .env.example
├── .gitignore
├── .github/
│   └── workflows/
│       └── ci.yml
├── app/
│   ├── _layout.tsx                   # Root layout (Clerk + Convex providers)
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── onboarding.tsx            # Onboarding companion-driven (FR2)
│   ├── (tabs)/
│   │   ├── _layout.tsx               # Config tabs (icônes, labels)
│   │   ├── index.tsx                 # Accueil — dashboard + missions (FR4)
│   │   ├── companion.tsx             # Companion — Rive + conversation (FR10)
│   │   ├── journal.tsx               # Journal — logging rapide (FR3)
│   │   ├── progres.tsx               # Progrès — XP + stats (FR8, FR13)
│   │   └── profil.tsx                # Profil — settings, compte (FR1)
│   ├── model-download.tsx            # Téléchargement LLM GGUF (1er lancement)
│   └── modal/
│       ├── crisis-support.tsx        # SOS / Combat Arsenal (FR6)
│       ├── log-sleep.tsx
│       ├── log-mood.tsx
│       └── achievement.tsx
├── features/
│   ├── companion/
│   │   ├── components/
│   │   │   ├── CompanionAvatar.tsx
│   │   │   ├── CompanionAvatar.test.tsx
│   │   │   ├── VoiceOrb.tsx
│   │   │   ├── ChatBubble.tsx
│   │   │   └── RoutineGuide.tsx      # Guided routines matin/soir (FR12)
│   │   ├── hooks/
│   │   │   ├── useCompanion.ts
│   │   │   ├── useVoiceInput.ts
│   │   │   └── useVoiceOutput.ts
│   │   ├── store.ts                  # Zustand: emotion, isListening, isSpeaking
│   │   ├── types.ts
│   │   └── personalities/
│   │       ├── lumo.json
│   │       ├── papillon.json
│   │       └── etoile.json
│   ├── tracking/
│   │   ├── components/
│   │   │   ├── QuickLogBar.tsx
│   │   │   ├── QuickLogBar.test.tsx
│   │   │   ├── SleepCard.tsx
│   │   │   ├── MoodPicker.tsx
│   │   │   └── MealLogger.tsx
│   │   ├── hooks/
│   │   │   └── useTracking.ts
│   │   ├── store.ts
│   │   └── types.ts
│   ├── gamification/
│   │   ├── engine/
│   │   │   ├── xpEngine.ts           # Calcul XP centralisé (AD-4)
│   │   │   ├── xpEngine.test.ts      # Tests obligatoires
│   │   │   └── streakEngine.ts
│   │   ├── components/
│   │   │   ├── XPBar.tsx
│   │   │   ├── StreakBadge.tsx
│   │   │   └── AchievementCard.tsx
│   │   ├── store.ts
│   │   └── types.ts
│   └── analytics/
│       ├── components/
│       │   ├── BurnoutAlert.tsx
│       │   ├── MoodChart.tsx
│       │   └── SleepChart.tsx
│       ├── hooks/
│       │   └── usePatterns.ts
│       └── types.ts
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── Card.tsx
│   │   ├── Text.tsx
│   │   └── ProgressBar.tsx
│   └── shared/
│       ├── ErrorBoundary.tsx
│       ├── LoadingOverlay.tsx
│       └── SafeAreaWrapper.tsx
├── convex/
│   ├── schema.ts
│   ├── users.ts
│   ├── tracking.ts
│   ├── companion.ts
│   ├── gamification.ts
│   ├── analytics.ts
│   └── _generated/
├── hooks/
│   ├── useAuth.ts
│   └── useAppState.ts
├── constants/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── xpValues.ts
├── assets/
│   ├── companions/
│   │   ├── lumo.riv
│   │   ├── papillon.riv
│   │   └── etoile.riv
│   ├── fonts/
│   └── images/
└── models/
    └── .gitkeep                      # Fichiers GGUF téléchargés au runtime
```

### Requirements to Structure Mapping

| Requirement | Localisation |
|-------------|-------------|
| FR1 Auth | `app/(auth)/`, `hooks/useAuth.ts`, `convex/users.ts` |
| FR2 Onboarding | `app/(auth)/onboarding.tsx`, `features/companion/` |
| FR3 Quick Log (<10s) | `features/tracking/components/QuickLogBar.tsx`, `app/modal/log-*.tsx` |
| FR4 Missions | `app/(tabs)/index.tsx`, `features/gamification/` |
| FR5 Patterns IA | `features/analytics/`, `convex/analytics.ts` |
| FR6 Arsenal | `app/modal/crisis-support.tsx` |
| FR7 Alertes prédictives | `features/analytics/components/BurnoutAlert.tsx` |
| FR8 War Room | `app/(tabs)/progres.tsx`, `features/analytics/` |
| FR10 Companion | `features/companion/`, `app/(tabs)/companion.tsx` |
| FR13 XP/Gamification | `features/gamification/engine/xpEngine.ts` |

### Architectural Boundaries

**Companion Pipeline (on-device, sans réseau) :**
```
VoiceOrb → useVoiceInput (STT natif) → useCompanion (llama.rn) → useVoiceOutput (TTS natif) → CompanionAvatar (Rive state machine)
```

**Data Flow (Convex réactif) :**
```
Screen useQuery → Convex query (souscription temps réel) → UI update automatique
Screen action → Convex mutation → XP engine → Convex gamification mutation → UI update
```

**Isolation critique :**
- `convex/` ne dépend jamais de `features/` (unidirectionnel)
- `features/` communiquent via Convex, jamais entre elles directement
- `components/ui/` zéro logique métier, zéro imports depuis `features/`

## Architecture Validation Results

### Coherence Validation ✅

**Compatibilité technologique :** Toutes les décisions sont compatibles. Stack cohérent sans conflits de versions.

**Contrainte critique documentée — EAS Dev Build obligatoire :**
`llama.rn`, `react-native-mmkv` et `rive-react-native` requièrent des modules natifs compilés.
- Expo Go : incompatible
- EAS Dev Build : obligatoire dès le premier jour de développement
- Commande : `eas build --profile development --platform android`

**Cohérence des patterns :** Patterns de nommage, structure et communication alignés avec le stack Expo + Convex + Zustand.

### Requirements Coverage Validation ✅

| FR | Statut | Localisation |
|----|--------|-------------|
| FR1 Auth | ✅ | `app/(auth)/`, Clerk |
| FR2 Onboarding | ✅ | `app/(auth)/onboarding.tsx` |
| FR3 Quick Log | ✅ | `QuickLogBar.tsx`, `app/modal/log-*.tsx` |
| FR4 Missions | ✅ | `app/(tabs)/index.tsx`, `features/gamification/` |
| FR5 Patterns IA | ✅ | `convex/analytics.ts` (scheduled jobs) |
| FR6 Arsenal | ✅ | `app/modal/crisis-support.tsx` |
| FR7 Alertes | ✅ | `features/analytics/BurnoutAlert.tsx` |
| FR8 War Room | ✅ | `app/(tabs)/progres.tsx` |
| FR9 Health Integration | 🔵 P2 | Délibérément déféré |
| FR10 Companion | ✅ | `features/companion/` |
| FR11 Battle Arenas | 🔵 P2 | Rive 2D couvre le cas, 3D déféré |
| FR12 Routines | ✅ | `features/companion/components/RoutineGuide.tsx` |
| FR13 Gamification | ✅ | `features/gamification/engine/xpEngine.ts` |

**NFR Coverage :**
- Performance : llama.rn on-device (zéro latence réseau), Convex réactif
- 60fps : Rive natif + Reanimated
- Privacy/GDPR : Clerk cascade deletion + E2E chiffrement (AD-8)
- Crash rate <0.1% : Sentry + ErrorBoundary par tab
- Coût ~€0/MAU : LLM gratuit, STT/TTS natifs gratuits

### Gap Analysis Results

| Gap | Priorité | Résolution |
|-----|----------|------------|
| FR12 Routines non mappé | P1 | ✅ Corrigé — `RoutineGuide.tsx` ajouté |
| LLM download UX absent | P1 | ✅ Corrigé — `app/model-download.tsx` ajouté |
| EAS Dev Build non documenté | Important | ✅ Documenté dans cette section |

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] 13 FR analysés et priorisés
- [x] 6 NFR couverts architecturalement
- [x] Scale et complexité évalués (Level 3-4, 15-20 modules)
- [x] Cross-cutting concerns mappés (XP engine, companion, sécurité, privacy)

**✅ Architectural Decisions**
- [x] 11 ADR documentés (AD-1 à AD-11)
- [x] Stack complet spécifié avec rationale
- [x] Patterns d'intégration définis
- [x] Considérations performance adressées

**✅ Implementation Patterns**
- [x] Conventions de nommage établies (6 catégories)
- [x] Structure feature-based définie
- [x] Patterns de communication spécifiés (Convex réactif)
- [x] Process patterns documentés (erreurs, loading, TypeScript)

**✅ Project Structure**
- [x] Arborescence complète définie
- [x] Boundaries composants établis
- [x] Points d'intégration mappés
- [x] Mapping FR → fichiers complet

### Architecture Readiness Assessment

**Statut global : PRÊT POUR IMPLÉMENTATION**

**Confiance : HAUTE**

**Points forts :**
- Zéro coût IA par utilisateur (llama.rn + STT/TTS natifs)
- Architecture privacy-first (données sensibles jamais en cloud)
- Feature-based claire — agents BMAD ne peuvent pas créer de conflits structurels
- Convex comme seule source de vérité pour les données persistées
- Patterns Zustand/Convex explicitement séparés

**Évolutions futures (post-MVP) :**
- FR9 Health Integration (HealthKit / Google Fit)
- FR11 3D Battle Arenas opt-in
- Polar web payments (Phase 3)
- Detox E2E testing

### Implementation Handoff

**Première commande à exécuter :**
```bash
cd app && npx convex dev
```

**Ordre d'implémentation imposé par les dépendances :**
1. `convex/schema.ts` + Clerk auth — bloquant pour tout le reste
2. `app/_layout.tsx` — providers Convex + Clerk
3. `app/(auth)/` — login + onboarding
4. `app/(tabs)/_layout.tsx` — navigation tabs
5. `features/tracking/` + Convex mutations — core loop
6. `features/gamification/engine/xpEngine.ts` — moteur XP
7. `features/companion/` — Rive + llama.rn pipeline
8. `features/analytics/` — patterns + alertes
9. RevenueCat — paiements

**Pour tout agent BMAD :**
Référencer `_bmad-output/architecture.md` avant toute décision technique.
Les patterns définis à l'étape 5 sont OBLIGATOIRES et non négociables.

## Architecture Completion Summary

**Workflow :** COMPLETED ✅ — 8 étapes, 2026-03-07
**Document :** `_bmad-output/architecture.md`

### Livrables

- 11 ADR (AD-1 à AD-11) + décisions complémentaires steps 3-4
- 6 patterns d'implémentation (nommage, structure, format, state, process, TypeScript)
- Arborescence complète — 40+ fichiers et dossiers spécifiés
- 13 FR mappés à des fichiers concrets
- Validation coherence + gaps résolus

### Pour tout agent BMAD

Lire `_bmad-output/architecture.md` avant toute décision technique.
Les patterns (étape 5) sont OBLIGATOIRES et non négociables.

**Prochaine étape :** `npx convex dev` dans `app/`

---
**Architecture Status : READY FOR IMPLEMENTATION ✅**

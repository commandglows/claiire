# Claiire — Mobile Wellness Companion PRD

> **Version:** 2.0
> **Date:** 2026-03-14
> **Status:** Draft
> **Product Name:** Claiire (formerly TMV / Transforme Ma Vie)
> **Sources:** `shipflow_data/business/business.md`, `shipflow_data/technical/app/`, and `shipflow_data/technical/site/`

---

## 1. Impact Definition

**Primary Metric:**
- Achieve 30-day user retention ≥ 35% within 6 months of launch

**Supporting Metrics:**
- Time-to-first-habit-streak ≤ 7 days (target: 80% of active users)
- Daily active sessions ≥ 3.5 per user within 4 months of launch
- User-reported mood stability ≥ 7.5/10 within 3 months of active use
- Companion conversation rate ≥ 1 per day for retained users

**Technical Performance Targets:**
| Metric | Target |
|--------|--------|
| App load time | < 2s |
| Companion response latency | < 1s (templates), < 5s (LLM) |
| 2D rendering | 60fps on mid-range devices |
| Backend query time (Convex) | < 100ms |
| App crash rate | < 0.1% |
| Sync success rate | > 99% |

---

## 2. Problem Narrative

**Target Persona:** Adults (25-45) managing mental health challenges, addictions, or chronic stress who struggle with consistent self-care routines.

**Core Pain Point:** Users attempting behavior change through wellness apps face an 85% dropout rate within the first month because existing solutions are either too clinical (feeling like medical charts) or too gamified (losing meaning after initial novelty). None of them offer a relationship — a companion who remembers your story, knows your triggers, and fights alongside you.

**Why Existing Solutions Fail:**
1. **Reactive, not proactive** — they log events but don't predict or prevent crises
2. **Motivational burnout** — clinical UX and generic "motivational fluff" cause abandonment
3. **Privacy concerns** — health and conversation data sent to cloud AI services erodes trust
4. **Cost per user** — cloud LLM APIs make generous free tiers unsustainable, pushing paywalls early
5. **Generic experience** — no personality, no emotional bond, no continuity between sessions

**Claiire's Thesis:** A locally-running AI companion that remembers your story, costs nothing per conversation, and gamifies real-life outcomes (not app usage) creates a sustainable emotional bond that breaks the 30-day retention ceiling.

---

## 3. Hypothesis

We believe that **providing an empathetic, on-device AI companion that gamifies real-life wellness outcomes with personalized encouragement and predictive intervention** for **adults struggling with addictions, mental health management, and consistent self-care routines** will result in **30-day retention reaching 35% and time-to-first-streak dropping to 7 days**, because **users need an emotional ally that transforms their data into meaning — not another tracking dashboard — and the on-device LLM removes the cost barrier to unlimited free conversations, creating a moat competitors can't match with cloud APIs**.

---

## 4. Success Criteria

**Success Thresholds:**
- ✅ 30-day retention ≥ 35%
- ✅ Onboarding completion ≥ 80% (first goal set within 2 minutes)
- ✅ Average streak length ≥ 14 days within first month
- ✅ Crisis logging → 48-hour companion check-in completion ≥ 70%
- ✅ Intervention success rate > 50% marked "this helped"
- ✅ Free → Premium conversion ≥ 5%

**Does NOT Count as Success:**
- High daily sessions but low retention (engagement without stickiness)
- High retention but no behavior change (measured by mood/habit consistency)
- Positive feedback without metric movement
- Users addicted to the app rather than to improving their lives (AD-9b)

**Leading Indicators:**
- Time spent in companion conversations (emotional bond forming)
- Streak milestone celebration engagement (XP/badge interaction)
- Crisis moment → intervention → recovery pathway completion rate
- Pattern confirmation rate (user validates AI predictions)
- Companion switching frequency (low = strong bond)

---

## 5. Non-Goals

**Explicit Scope Boundaries:**
- Will NOT provide clinical mental health treatment or replace therapy
- Will NOT include social features or community elements (v1)
- Will NOT integrate with external health devices initially (HealthKit/Google Fit = Phase 2)
- Will NOT use cloud AI for companion conversations (on-device only)
- Will NOT launch with 3D rendering as default (2D-first, 3D opt-in)
- Will NOT support web at MVP (mobile-only, web = Phase 3)

**Acknowledged Trade-offs:**
- On-device LLM (1-3B params) is less capable than cloud models — mitigated by strong system prompts, personality templates, and pre-written responses for critical interactions
- Prioritizing retention over feature breadth may limit initial acquisition channels
- Warrior/Zen dual mode adds UI complexity — justified by persona research showing divergent preferences
- Model download (300MB-2GB) creates first-launch friction — mitigated by two-stage download and instant template-based conversations

**Future Scope (Post-MVP):**
- Healthcare provider portal integration
- Family/caregiver sharing features
- Wearable integration (Apple Watch, Wear OS)
- AR companion, voice assistant integration
- Anonymous community (companion-moderated)

---

## 6. Solution Description

**Core Experience:**
Users select a personalized AI companion during onboarding who provides contextual encouragement based on tracked wellness data (habits, mood, crisis moments, interventions). The companion transforms routine logging into meaningful conversations and celebrates real-life progress through XP systems, streaks, and personalized insights. All AI runs locally on the device — zero cost, total privacy.

**Key Outcomes:**
- Users feel emotionally supported rather than judged by their wellness data
- Behavior change becomes sustainable through consistent positive reinforcement tied to real outcomes
- Crisis moments become opportunities for structured recovery rather than shame spirals
- Daily self-care feels achievable and rewarding rather than overwhelming
- The companion remembers the user's story across sessions, creating an emotional bond that drives retention

**Core Philosophy:** Claiire is not a tracking app. It is a combat system disguised as a game, where users fight their demons with real weapons (data, AI, interventions), earn victories (streaks, insights), and level up their lives — without realizing they're in therapy.

**Differentiator:** 100% on-device AI companion (zero API cost, total privacy). The local LLM is Claiire's cost moat — competitors pay per API call, Claiire doesn't. This enables an genuinely generous free tier: unlimited companion chat for everyone.

---

## 7. Target Users

### Primary: "The Struggling Fighter" (25-45)

- Dealing with addiction (smoking, alcohol, substances, behavioral) or chronic stress
- Has tried multiple apps/methods before and dropped them
- Mindset: "I'm tired of failing. I want a weapon, not a notebook."
- Needs immediate, actionable crisis support — not motivational quotes
- Values privacy and data ownership (health data is deeply personal)
- Skeptical of "motivational fluff" and clinical dashboards
- Wants to see progress like XP bars and level-ups, not spreadsheets

### Secondary: "The Wellness Seeker" (28-50)

- Managing anxiety, stress, or chronic symptoms
- Building positive habits and daily routines
- Interested in data-driven insights about their patterns
- May work with a therapist/coach and wants to share progress
- Wants gamified challenges that make self-improvement fun, not another to-do list

---

## 8. AI Companion System

### 8.1 Companions (3 at MVP, 2 added Phase 2)

| Companion | Archetype | Personality | Battle Cry | Zen Phrase |
|-----------|-----------|-------------|------------|------------|
| **Lumo** (Firefly) | Intel Specialist | Calm, wise, strategic | "Je vois clair dans le noir." | "Observons ensemble." |
| **Papillon** (Butterfly) | Hype Man | Energetic, playful, motivational | "On va tout défoncer !" | "Allez, on bouge !" |
| **Étoile** (Fairy) | Healer | Nurturing, empathetic, protective | "Je te protège, toujours." | "Je suis là pour toi." |
| **Sage** (Owl) | Strategist | Analytical, data-driven | "Connais ton ennemi." | "Les données parlent." |
| **Aurore** (Dawn Sprite) | Motivator | Hopeful, fresh-start focused | "Chaque jour, une nouvelle chance." | "Un nouveau départ." |

### 8.2 AI Architecture (100% On-Device — AD-2)

- **LLM:** llama.rn (Gemma 2B / Llama 3.2 3B, GGUF format) — zero API cost, total privacy
- **Hybrid response strategy:**
  - Pre-written templates for predictable interactions (XP celebrations, streak congrats, check-in prompts, intervention coaching) — instant, lightweight
  - Local LLM for free-form conversation, personalized responses, contextual coaching, crisis support
- **Two-stage model download (AD-10a):**
  - Stage 1 (auto): micro-model ~300-500MB (Gemma 2B Q4_0), downloads silently after install
  - Stage 2 (optional): full model ~1-2GB, offered as upgrade later
  - Templates work immediately before any model downloads
- **Runtime abstraction (AD-12a):** `generateResponse(prompt, config) → stream<tokens>` — swappable backend (llama.cpp today, Apple Intelligence / Gemini Nano tomorrow)

### 8.3 Memory System (Three-Level)

- **Immediate:** last 5-10 messages in LLM prompt context
- **Session:** daily conversation summary (LLM-generated)
- **Long-term:** key facts as KV pairs (enemy name, streak records, victory milestones) injected into system prompt, stored via Convex Vector Search

### 8.4 Emotional Expression

- 8 core emotions + victory celebration mode
- Rive state machines per emotion, triggered by conversation context
- Transitions between emotions are fluid and animated
- Config-driven personalities (AD-5): adding a companion = adding a config file, not code

### 8.5 Daily Rhythms

- **Morning:** "Bonjour ! XP d'hier: [amount]. Missions du jour: [list]. On y va ?"
- **Throughout day:** proactive messages at predicted risk times (configurable frequency)
- **Evening:** "Bilan: [X] missions, [Y] XP, [Z] batailles gagnées. Fier(e) ?"

### 8.6 Smart Questions (6 Types)

- Open-ended exploration, pattern investigation, trigger drilling, intervention evaluation, goal clarification, emotional validation
- Limit: 1-2 questions per interaction
- Never during crisis logging (wait until intervention phase)

### 8.7 Safety & Guardrails

- **Crisis keyword interception** BEFORE LLM (regex: suicide, self-harm, overdose) → hardcoded emergency response + crisis hotline numbers (AD-8b)
- **LLM output filtering:** medical advice, prescriptions, harmful content → safe fallback (AD-8c)
- Disclaimers: "Je ne suis pas un thérapeute, mais je suis là pour t'aider"
- Cannot diagnose, prescribe, or provide medical advice
- Encourages professional help when appropriate

### 8.8 Companion Switching

- 1x/week free, unlimited premium
- Costs 500 XP (prevents abuse, makes choice meaningful)
- New companion reviews history — no XP loss, no data loss

---

## 9. Feature Requirements

### 9.1 Authentication & Account (P0)

**User Story:** As a user, I want to create an account so my progress persists across sessions and devices.

**Requirements:**
- Email/password registration
- Social login (Google, Apple Sign-In)
- Biometric authentication (Face ID, fingerprint)
- Password recovery flow
- Profile management (avatar, display name, companion selection)
- Cloud sync across devices
- Full account deletion with data purge (GDPR — AD-6)

**Tech:** Clerk (Expo SDK) + Convex user table. Secure token storage via `expo-secure-store`.

---

### 9.2 Onboarding — Companion-Led Discovery (P0)

**User Story:** As a new user, I want to discover the app as a game where I'm the hero, not as "another self-help tool."

**Design Principles:**
- Zero onboarding screens. No tutorial. No feature tour. (AD-9e)
- Learn by doing — progressive disclosure through companion interaction
- Immediate immersion: app opens directly into companion world
- First concrete goal set within 2 minutes of first launch
- Templates written by copywriters, not AI-generated (AD-13d)

**Flow:**
1. App opens → companion appears (animated, in their world)
2. Choose companion by interacting (tap to visit their mini-world, selection = natural click)
3. Companion asks about the user's goal via conversation (free text or floating bubbles)
4. First crisis logging taught through companion-driven simulated experience
5. Features revealed progressively via behavior-driven discovery calendar (AD-12e, AD-13c)

**Discovery Calendar (config-driven, NOT time-based — AD-13c):**
- User states goal → immediate mission creation
- User logs crisis → immediate intervention suggestion
- Day 3: "J'ai quelque chose à te montrer" → War Room reveal
- Day 5: breathing exercise suggested during conversation
- Day 7: "J'ai détecté un pattern..." → Insights reveal
- Therapist mention → PDF export revealed (AD-13f)

**Dual Presentation Mode (AD-13b):**
- **Warrior mode:** Missions, battles, XP, arsenal, War Room, SOS button
- **Zen mode:** Habits, journal, progress, tools, dashboard, "Comment je me sens"
- User chooses during first interaction or companion suggests based on language
- Same underlying system, two UI skins — switchable anytime in settings

---

### 9.3 Wellness Tracking — Daily Missions (P0)

**User Story:** As a user building new habits, I want to complete missions that level me up, not check boxes.

**Requirements:**
- 3 habits free, unlimited premium
- Daily check-in with streak counter ("Victory Streak" / "Série de victoires")
- Mission types:
  - 🛡️ Defense Missions (avoid addictions)
  - ⚔️ Offense Missions (positive behaviors)
  - 💊 Support Missions (medications, therapy)
  - 🏃 Training Missions (exercise, meditation)
- Flexible frequency: daily, weekly, custom
- Simple yes/no or intensity-based tracking
- Customizable reminders (time/frequency)
- Mission difficulty: Easy/Medium/Hard (affects XP multiplier)

**Gamification:**
| Action | XP |
|--------|-----|
| Mission completed | +20 |
| 7-day streak | +100 bonus |
| 30-day streak | +500 + badge |
| All daily missions (Combo) | +50 bonus |
| Perfect week | Legendary Badge |
| Failed mission | -0 XP (no punishment — AD-13a) |

---

### 9.4 Quick Crisis Logging — Battle Report (P0)

**User Story:** As a user in crisis, I need to log my state in under 10 seconds so I can get immediate help.

**Requirements:**
- Single-tap from home screen (SOS button, always visible, red, large)
- Maximum 3 taps from app launch to logged entry
- Voice input option (native STT)
- Offline-first: works without internet, syncs later

**Fields (gamified labels in UI, clinical data in backend):**
| Field | Warrior Label | Zen Label | Required |
|-------|---------------|-----------|----------|
| Type | Enemy Attack Type | Type de moment difficile | Yes |
| Intensity (1-10) | Damage Taken | Intensité | Yes |
| Timestamp | Battle Time | Moment | Auto |
| Trigger | Enemy's Weapon | Déclencheur | Optional |
| Emotion | Your State | Comment tu te sens | Optional |
| Context | Battlefield Conditions | Contexte | Optional |
| Notes | Debrief | Notes | Optional |

**Post-Log:**
- XP: +10 base, +5 if trigger identified, +5 if detailed notes
- Immediate: "Veux-tu contre-attaquer ?" → 3 intervention cards
- Auto-save after 5 seconds of inactivity

---

### 9.5 Smart Interventions — Combat Arsenal (P0)

**User Story:** As a user facing a crisis, I need immediate, personalized interventions that actually work for me.

**Requirements:**
- 20 interventions free, 100+ premium
- Categories: Breathing Warfare, Tactical Diversions, Backup Call, Battle Drills, Mental Shields
- Personalized based on: past success rate, current context, crisis intensity
- Quick access: max 2 taps from crisis log
- Users can create custom interventions
- Full-screen, distraction-free execution UI

**Gamification:**
| Action | XP |
|--------|-----|
| Complete intervention | +30 "Crisis Averted" |
| Mark "This worked" | +10 bonus |
| Use intervention 5x | Advanced version unlocked |
| Use intervention 10x | "Mastered" badge |
| Most effective | "Signature Move" title |

**Companion Integration:**
- Suggests interventions with success rate: "Ça marche 80% du temps pour toi"
- Coaches during execution: "Respire. Tu as déjà gagné 23 batailles comme ça."
- Celebrates after: victory animation + XP

---

### 9.6 AI Pattern Recognition — Enemy Intel (P0)

**User Story:** As a user, I want the app to identify my trigger patterns and warn me before I relapse.

**Requirements:**
- Minimum 14 days of data before predictions
- Pattern detection: time-based, context-based, emotional correlations, multi-factor triggers
- Predictions fire only at >85% confidence (AD-7)
- User can confirm/reject predictions (feedback loop)
- First 14 days = data collection only (no predictions)

**XP:**
- New pattern discovered: +50 XP "Enemy Weakness Found"
- User confirms prediction: +10 XP
- Rejection: -0 XP (feedback loop, no penalty)

**Implementation Phases:**
1. Rule-based heuristics (Convex scheduled jobs, MVP)
2. ML models (TensorFlow Lite / Core ML)
3. Advanced LLM analysis (optional, local)

**Data Points:**
- Crisis timestamps, intensity levels, triggers
- Habit adherence patterns
- Sleep/activity data (if HealthKit connected)
- Self-reported triggers and emotions
- Contextual data (time of day, day of week)

---

### 9.7 Predictive Notifications — Attack Alerts (P1)

**User Story:** As a user, I want to be warned before the enemy strikes so I can prepare.

**Requirements:**
- Proactive alerts 15-30 minutes before predicted high-risk window
- Confidence threshold: 85% default, configurable per user
- Throttle: max 1 predictive alert per 4 hours
- Quiet hours: default 22h-08h
- Discreet lock screen text: "Claiire : Ton compagnon a un message" (AD-8e)
- Optional stealth mode: neutral app icon + generic name

**Alert Actions:**
- "JE ME PRÉPARE" → opens intervention picker (+10 XP)
- "ÇA VA, MERCI" → dismisses, logs confidence
- "SNOOZE 15 MIN" → delays alert

**XP:**
| Action | XP |
|--------|-----|
| Accept + complete intervention | +50 "Pre-emptive Strike" |
| Ignore but survive window | +20 "Solo Victory" |
| Ignore + crisis | -0 (no penalty) |

---

### 9.8 Analytics Dashboard — War Room (P1)

**User Story:** As a user, I want to see my war stats and understand how I'm winning.

**Sections:**
- **Level & XP Bar** (top): current level, XP to next, today/week/all-time breakdown
- **Victory Counters:** current streaks per type
- **Enemy Activity Patterns:** crisis frequency heatmap
- **Intel Reports:** AI-detected insights
- **Mission Success Rate:** habit adherence
- **Arsenal Stats:** intervention effectiveness ranking
- **Battle History:** timeline of defeats + victories, filterable (7d/30d/90d/all)
- **Achievement Gallery:** badges earned, locked badges as teasers

**Companion Commentary:** companion narrates insights — "Regarde ça. Tu as gagné 85% de tes batailles cette semaine." Not cold stats.

**Export:** PDF for therapist sharing (generated locally, biometric-gated — AD-8d).

---

### 9.9 Gamification & XP System (P1)

**User Story:** As a user, I want tangible progress that makes self-improvement feel like winning.

**Architecture:** Centralized XP Engine — single Convex mutation `awardXP(userId, action, context)` (AD-4). No feature calculates XP independently. All XP values in a central config (easy to rebalance).

**Complete XP Table:**
| Action | XP |
|--------|-----|
| Log a crisis (Battle Report) | +10 base (+5 trigger, +5 notes) |
| Complete a mission (habit) | +20 |
| Complete an intervention | +30 |
| 7-day streak | +100 bonus |
| 30-day streak | +500 + badge |
| All daily missions (Combo) | +50 |
| New pattern discovered | +50 |
| Pre-emptive strike | +50 |
| Confirm prediction | +10 |
| Complete routine | +XP per action |
| Open predictive alert | +10 |

**Rules:**
- XP never decreases, even on relapse (AD-13a)
- Streak reset is visual, but companion intervenes: "23 jours gagnés. Une défaite ne les efface pas."
- Never reward app opens, time spent, or engagement metrics (AD-9b)
- Trust-based: no verification (AD-10b)
- HealthKit contradiction → companion asks gently, user's answer is final

**Level Benefits (unlock gates):**
| Level | Unlock |
|-------|--------|
| 2 | 2D view mode |
| 3 | Basic companion outfits |
| 5 | New arena background, 2nd music track |
| 7 | Rare companion outfits |
| 8 | 3D view mode (opt-in, GPU-gated) |
| 10 | Animated arena elements, 3rd music track |
| 15 | Legendary outfits |
| 20 | Full arena customization |

---

### 9.10 Companion-Led Routines (P1)

**User Story:** As a user, I want morning and night routines guided by my companion.

**Requirements:**
- Create separate morning/night routines
- Select from pre-defined actions (drink water, exercise, meditate, journal, etc.) or custom
- Companion guides execution with encouragement, timer, animated actions alongside user
- Log completion per action, track adherence over time
- XP for routine + individual action completion, streaks, badges
- Drag-and-drop interface for ordering actions
- Full-screen, distraction-free execution

---

### 9.11 Companion World & Customization (P2)

**User Story:** As a user, I want to experience my journey through different visual perspectives and unlock rewards.

**View Modes:**
- **Face-to-Face:** companion focus (default, home screen)
- **Map View:** strategic progress map, battle history as visual time-walk
- Dynamic switch to Map View during crisis/intervention

**Visual Dimensions (progressive unlock):**
- 1D: text-based, ambient effects (from start)
- 2D: animated sprites, styled illustrations (Level 2)
- 3D: immersive environments (Level 8, opt-in, GPU-gated — AD-1)
- LLM and 3D rendering CANNOT run simultaneously (RAM constraint — AD-9c)

**Cosmetic Shop (Premium):**
- Companion skins: 1,000 XP
- Arena themes: 500 XP
- Victory animations: 250 XP
- Premium users: 2x XP multiplier

**Music:** 3-5 unique tracks per companion, XP-gated unlock, user can select or shuffle.

---

### 9.12 Health Integration (P2)

- iOS: HealthKit (sleep, steps, heart rate, exercise)
- Android: Google Fit (activity, sleep, heart rate)
- Correlation analysis: "Crises 3x more likely on days with <6h sleep"
- Health data never leaves device unless user explicitly shares

---

### 9.13 Therapist Sharing (P2)

- Companion asks early: "Tu travailles avec un professionnel ?"
- If yes → PDF export revealed via companion discovery (AD-13f)
- Reports generated locally from device data
- Biometric re-authentication required (AD-8d)
- Secure link with JWT + time-based expiry

---

## 10. Navigation Architecture

**4 Tabs (Expo Router, file-based):**

| Tab | Warrior Name | Zen Name | Purpose |
|-----|-------------|----------|---------|
| 1 | QG (Companion) | Accueil | Companion face-to-face — this IS the home screen |
| 2 | Missions | Habitudes | Daily habits/missions, streaks |
| 3 | War Room | Tableau de bord | Analytics, patterns, battle history |
| 4 | Profil | Profil | Settings, achievements, companion, subscription |

**Global Elements:**
- FAB SOS button always visible (except during active intervention)
- Battle Report as modal overlay (accessible from any screen)
- Interventions as full-screen immersive (no distractions)
- Companion contextually present on all tabs (small avatar + speech bubble)

---

## 11. Technical Architecture

### 11.1 Stack (Decided — Do Not Change)

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React Native (Expo ~55) + TypeScript strict | EAS Dev Build required (no Expo Go) |
| Navigation | Expo Router ~55 (file-based) | 4 tabs + modals |
| Companion Animations | Rive (`rive-react-native`) | State machines per emotion |
| UI Animations | Reanimated 4.x | |
| Backend | Convex | Reactive DB, mutations, queries, actions, vector search, scheduled jobs |
| Auth | Clerk (Expo SDK) | Social login, biometric |
| LLM | llama.rn (on-device) | Gemma 2B / Llama 3.2 3B, GGUF format |
| STT | Native iOS/Android | Free |
| TTS | Native iOS/Android | Free |
| State (UI) | Zustand | UI-only; Convex = data source of truth |
| Storage | expo-secure-store (auth) + MMKV (app state) | |
| Payments | RevenueCat (mobile MVP) + Polar (web Phase 3) | |
| Charts | Victory Native | |
| Notifications | Expo Notifications (FCM + APNS) | |
| CI/CD | EAS Build + GitHub Actions | |
| Crash/Error | Sentry | |

### 11.2 Key Architectural Decisions

| AD | Decision | Rationale |
|----|----------|-----------|
| AD-1 | 2D default, 3D opt-in only | Mid-range phones can't sustain 60fps 3D + chat. GPU benchmark at first launch. |
| AD-2 | 100% on-device LLM | Zero cost, total privacy, no external dependency. Trade-off: smaller models mitigated by templates + system prompts. |
| AD-3 | Cloud-first with offline degradation | Convex for persistence/sync. Emergency cache (~50KB) for offline: top 3 interventions, contacts, breathing exercise, missions. Companion still talks offline (local LLM). |
| AD-4 | Centralized XP Engine | Single Convex mutation `awardXP()`. XP touches 13+ features — distributed logic = bugs. Central config for rebalancing. |
| AD-5 | Config-driven companions | Personality = data files, not code. 5 companions × 13 features = 65 variations. Config-driven = one codebase, N personalities. |
| AD-6 | GDPR deletion by design | `deleteAllUserData(userId)` is a day-1 mutation, tested in CI. All tables indexed by userId. Vector embeddings tagged for cascade deletion. Completes in <30s. |
| AD-7 | Conservative prediction alerting | Only fire at >85% confidence. False positives → user disables alerts → useless. 14-day minimum data collection. |
| AD-8 | Security by design | Local AI (8a), crisis keyword interception before LLM (8b), output filtering (8c), biometric-gated sensitive actions (8d), discreet notifications (8e), cert pinning (8f), E2E encrypted conversations with password-derived key (8g). |
| AD-9 | First principles | Instant response <1s (9a), gamification = real outcomes not app usage (9b), 2D/1D default (9c), two-tier app <100MB + model download (9d), progressive disclosure not onboarding (9e), data separation device vs cloud (9f). |
| AD-10 | Cross-functional | Two-stage model download (10a), trust-based XP (10b), Convex with repository pattern exit strategy (10c), 3 companions at MVP (10d), RevenueCat only at MVP (10e). |
| AD-11 | Architecture records | Flat project structure (11a), conversation pipeline: Input → Safety → Router → Personality → Output Filter → Memory → Display (11b), Convex scheduled pattern detection (11c), Expo Router 4-tab nav (11d), schema separation readable vs encrypted (11e). |
| AD-12 | Market & positioning | LLM runtime abstraction (12a), wellness not medical positioning (12b), generous free tier (12c), anonymous collective stats (12d), companion discovery calendar (12e), safe/forbidden vocabulary (12g), art direction priority (12f). |
| AD-13 | User validation | No punishment on relapse (13a), dual Warrior/Zen mode (13b), adaptive discovery calendar (13c), copywriter-written templates (13d), model size optimization (13e), therapist sharing via discovery (13f). |

---

## 12. Data Architecture

### 12.1 Convex Schema (Readable Tables)
- `users` — profile, subscriptionTier, companionId, level, totalXp, presentationMode
- `habits` — name, type, frequency, missionDifficulty
- `habitLogs` — date, completed, intensity, xpEarned
- `crisisLogs` — type, intensity, trigger, emotion, context, timestamp (never free text)
- `interventions` — type, crisisId, successRating, xpEarned, timesUsed
- `patterns` — patternType, confidence, metadata, detectedAt
- `achievements` — type, unlockedAt
- `routines` — name, type (morning/night)
- `routineActions` — actionType, order, duration, xpReward
- `routineLogs` — date, completed, xpEarned
- `notifications` — type, sentAt, response
- `companionConfigs` — personality data, discovery calendar
- `precalculatedFeatures` — sleepRegularity, burnoutRisk, moodTrend, personalityProfile

### 12.2 Convex Schema (E2E Encrypted — AD-8g)
- `encryptedConversations` — encrypted blobs (server cannot read). Key derived from user password (PBKDF2/Argon2 → AES-256-GCM).
- `encryptedNotes` — journal entries, free-text notes

### 12.3 On-Device Only
- Raw conversation text (before encryption/backup)
- LLM model files (GGUF, 300MB-2GB)
- Emergency cache (~50KB: top 3 interventions, emergency contacts, breathing exercise, missions, streaks)

---

## 13. Monetization

### Free Tier (generous — AD-12c)
- **Unlimited companion chat** (local LLM = zero marginal cost)
- 3 habit trackers
- Unlimited crisis logging
- Basic interventions (20)
- Basic analytics
- 30 days data retention

### Premium (€9.99/month or €89.99/year)
- Unlimited habits
- Full intervention library (100+)
- AI predictions & alerts
- Advanced analytics
- Unlimited data retention
- Cloud sync & backup
- PDF export for therapist
- Additional companions (Sage, Aurore)
- Routines (morning/night)
- Cosmetics & customization
- 2x XP multiplier
- Priority support

### Lifetime (€199 one-time)
- All Premium features forever
- Early access to new features

### Year 1 Projections
- 10,000 downloads, 5% conversion (500 premium users)
- Average subscription: €100/year
- Revenue target: ~€50,000
- Cost per MAU: < €1.00 (local LLM = near-zero marginal cost)

---

## 14. Market Positioning & Vocabulary (AD-12b)

**Phase 1 (Launch):** Claiire is a "wellness companion that helps you overcome toxic habits, manage crises, and build a healthier life, with gamification."

**Safe vocabulary:** surmonter tes habitudes toxiques, combattre ce qui te freine, reprendre le contrôle, ancrer des habitudes saines, gestion de crise, moments difficiles, comprendre tes patterns, accompagnement.

**Forbidden vocabulary:** traitement, thérapie, soigner, diagnostic, sevrage, trouble, maladie, patient.

**Rationale:** Empowerment framing, not medical framing. The user is the hero, not the patient. Legal review required before launch (French CNIL + EU health app regulations).

**Phase 2 (Post-traction):** Clinical validation pursued from a position of strength — existing users, real data, hired professionals. Certifications (CE, potentially FDA) only with professional guidance.

**Anonymous Social Proof (AD-12d):** "X guerriers se battent avec toi en ce moment" — live Convex query, anonymized. No profiles, no forums, just the feeling of not being alone.

---

## 15. Development Phases

### Phase 1: MVP (3-4 months)
- Auth (Clerk) + Convex schema
- 3 companions (Lumo, Papillon, Étoile) with Rive animations
- On-device LLM (llama.rn) + pre-written templates (copywriter quality — AD-13d)
- Companion conversation system (memory, emotions, daily rhythms)
- Companion-led onboarding (progressive disclosure, zero tutorial screens)
- Habit tracking (3 free, missions UI, dual Warrior/Zen labels)
- Crisis logging (Battle Report, <10 seconds)
- Basic interventions (20, companion-guided)
- Pattern detection (rule-based, Convex scheduled jobs)
- Dashboard (streaks, basic charts, companion commentary)
- XP system (centralized engine — AD-4)
- Dual mode: Warrior / Zen (AD-13b)
- Notifications (reminders, companion messages, discreet — AD-8e)
- RevenueCat subscription
- Offline emergency cache (AD-3)
- Security: E2E encryption, crisis interception, output filtering, GDPR deletion

### Phase 2: AI Enhancement (2-3 months)
- Add Sage + Aurore companions (config files + 2D assets only)
- Full emotional range (8 emotions)
- Advanced memory (conversation highlights, milestones)
- ML-based pattern prediction (TensorFlow Lite / Core ML)
- Predictive crisis alerts (>85% confidence)
- Intervention effectiveness tracking + arsenal stats
- Advanced analytics dashboard (War Room)
- Health data integration (HealthKit / Google Fit)
- PDF export for therapist (biometric-gated)
- Voice input/output (native STT/TTS)

### Phase 3: Companion Worlds & Scale (3-4 months)
- Companion world environments (Map View)
- Musical tracks per companion (XP-gated)
- Visual customization & cosmetic shop
- Companion switching system
- Routines (morning/night, companion-guided)
- Web dashboard
- Polar payments (web)
- Multilingual support (French-first, then English, Spanish)
- Anonymous collective stats

### Phase 4: Advanced Features (Ongoing)
- Companion evolution (visual growth with user progress)
- Wearable integration (Apple Watch, Wear OS)
- Voice assistant integration (Siri, Google Assistant)
- AR companion
- Anonymous community (companion-moderated)

---

## 16. Risk Mitigation

| Risk | Severity | Mitigation |
|------|----------|------------|
| Low user engagement / 30-day churn | High | Companion emotional bond, gamification tied to real outcomes, progressive discovery, smart notifications |
| AI predictions inaccurate | Medium | Start rule-based, >85% confidence threshold, user feedback loop, show confidence scores |
| Privacy concerns | High | 100% on-device AI, E2E encrypted conversations, GDPR deletion day-1, transparent policy |
| Medical liability | High | Safe vocabulary guide, clear disclaimers, crisis resources (hotlines), encourage professional help, legal review |
| LLM quality (small models) | Medium | Strong system prompts, config-driven personality, pre-written templates for critical interactions, two-stage model upgrade |
| Device performance (3D + LLM) | Medium | 2D default, GPU benchmark, 3D opt-in only, LLM and 3D never simultaneous |
| Model download friction | Medium | Two-stage download (300MB auto → 1-2GB opt), templates work instantly, Wi-Fi recommended UI |
| Competition | Low | On-device LLM cost moat, companion personality/memory, privacy-first positioning, generous free tier |
| Companion becomes unhelpful/repetitive | Medium | Copywriter-written templates (AD-13d), three-level memory system, user feedback on companion quality |

---

## 17. Compliance

- **GDPR:** Full compliance. `deleteAllUserData()` tested in CI. Data export mutation alongside deletion (AD-10c). Completes in <30 seconds.
- **HIPAA:** Considerations applied. On-device AI processing eliminates most data concerns. E2E encryption for cloud-stored conversations.
- **App Store / Play Store:** No medical claims. Wellness/personal development category. Crisis resources accessible.
- **French CNIL:** Legal review required before launch.
- **Content Safety:** Crisis resources (hotlines) always accessible. Disclaimers on all AI interactions. Crisis keyword interception before LLM.

---

## 18. Open Questions

| # | Question | Status |
|---|----------|--------|
| 1 | Voice quality per companion with native TTS? | Needs testing |
| 2 | RAG context: how many days of conversation history? | TBD — depends on Convex vector search performance |
| 3 | Music: commission original or royalty-free? | TBD |
| 4 | World interactivity depth? | TBD — start minimal, expand based on engagement |
| 5 | Is 3 habits enough for free tier? | TBD — monitor conversion rates post-launch |
| 6 | Smallest viable model size? | Test TinyLlama 1.1B, Gemma 2B Q2, Phi-3 mini Q3 |
| 7 | Art direction: who creates 2D companion assets? | TBD — priority investment (AD-12f) |
| 8 | Community: in-app or Discord? | Deferred to Phase 4 |
| 9 | Therapist portal: custom or integrate existing? | Deferred — PDF export first |
| 10 | Localization timing? | French-first confirmed, English in Phase 3 |

---

## 19. Project Structure (Decided)

```
app/                    # Expo Router screens
  (tabs)/               # accueil, missions, war-room, profil
  (auth)/               # login, onboarding
  modal/                # crisis-report, log-mood, achievement
  model-download.tsx    # LLM download (first launch)
features/
  companion/            # Rive + llama.rn + STT/TTS + personality configs
  tracking/             # sleep, mood, meals, habits
  gamification/         # xpEngine, streakEngine, achievements
  analytics/            # patterns, BurnoutAlert
components/ui/          # atoms
components/shared/      # molecules
convex/                 # schema.ts, users, tracking, companion, gamification, analytics
lib/
  companion/            # LLM abstraction, templates, memory, pipeline
  repository/           # Convex repository pattern (AD-10c)
```

---

> **Implementation Order:**
> 1. `convex/schema.ts` + Clerk auth (blocking)
> 2. `app/_layout.tsx` — providers
> 3. `app/(auth)/` — login + onboarding
> 4. `app/(tabs)/_layout.tsx` — navigation
> 5. `features/tracking/` — core loop
> 6. `features/gamification/engine/xpEngine.ts`
> 7. `features/companion/` — Rive + llama.rn
> 8. `features/analytics/`
> 9. RevenueCat

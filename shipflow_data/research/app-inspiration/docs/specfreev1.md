# Technical Specification: Transforme Ma Vie - AI Companion-Powered Life Transformation App

## 1. Executive Summary

**Product Name:** Transforme Ma Vie (TMV)

**Tagline:** "Ton compagnon IA pour transformer ta vie, jour après jour"

**Purpose:** A therapeutic gaming experience disguised as an AI companion app. Users overcome addictions, manage mental health symptoms, and build positive habits through predictive intervention, personalized support, and real-time crisis management—all while playing a game where they are the hero of their own transformation story.

**Core Philosophy:** TMV isn't a tracking app. It's a **combat system** where users fight their demons with real weapons (data, AI, interventions), earn victories (streaks, insights), and level up their lives without realizing they're in therapy.

**AI Companion Names (Proposed):**

- **Lumo** - A wise, gentle firefly (calm, introspective guidance)
- **Papillon** - A playful, sunny butterfly (energetic, motivational)
- **Étoile** - A mystical star fairy (nurturing, empathetic)
- **Sage** - A thoughtful owl (analytical, pattern-focused)
- **Aurore** - A dawn sprite (hopeful, fresh-start oriented)

**Target Platforms:** iOS, Android, Web (dashboard)

**Core Value Proposition:** Move from reactive tracking to proactive intervention through predictive AI, conversational companions that remember your story, and personalized support that feels alive and relatable.
**Core Value Proposition:** Transform reactive tracking into proactive warfare. Companions remember your story, predict your battles, and celebrate your victories. Learn about yourself while playing. Win your life while having fun. 🎮✨

---

## 2. User Personas

### Primary Persona: "The Struggling Fighter"

- Age: 25-45
- Dealing with addiction (smoking, alcohol, substances, behavioral)
- Has tried multiple apps/methods before
- **Mindset:** "I'm tired of failing. I want a weapon, not a notebook."
- Needs immediate, actionable support during crisis moments
- Values privacy and data ownership
- Skeptical of "motivational fluff"
- **New Need:** Wants to see progress like XP bars, not just numbers

### Secondary Persona: "The Wellness Seeker"

- Age: 28-50
- Managing anxiety, stress, or chronic symptoms
- Wants to build positive habits
- Interested in data-driven insights
- May work with a therapist/coach
- **New Need:** Wants gamified challenges that make self-improvement fun

---

## 3. Core Features & Requirements

### 3.0 User Account & Authentication ✅ **IN SCOPE**

**Priority:** P0 (Critical)

**User Story:** As a user, I want to create an account and log in to save my progress, preferences, and conversation history with my AI companion.

**Requirements:**

- Email/password registration
- Social login (Google, Apple Sign-In)
- Biometric authentication (Face ID, fingerprint)
- Password recovery flow
- Profile management (avatar, display name, companion selection)
- Data persistence across devices (cloud sync)
- Account deletion (GDPR compliance)

**Technical Notes:**

- Firebase Authentication OR Supabase Auth
- Secure token storage (iOS Keychain, Android Keystore)
- Session management with auto-refresh

---

### 3.0.1 Onboarding & Guided Tour ✅ **IN SCOPE** (Enhanced v2)

**Priority:** P0 (Critical)

**User Story:** As a new user, I want to discover the app naturally through play, not through reading instructions.
**User Story:** As a new user, I want to discover the app as a game where I'm the hero, not as "another self-help tool."
**Design Principles (Inspired by Gaming):**

- **Learn by Doing:** No explanations before action
- **Progressive Disclosure:** One feature at a time, when needed
- **Invisible Tutorial:** Learning disguised as natural exploration
- **Sandbox Mentality:** Safe space to experiment without consequences
- **Affordance First:** Interface speaks for itself
  **Design Principles:**
- **You Are The Hero:** Every element reinforces "This is YOUR war, YOUR victories"
- **No Therapy Vibes:** Disguise therapeutic elements as game mechanics
- **Immediate Empowerment:** First interaction = first win

**Enhanced Onboarding Flow:**

#### 1. **Instant Immersion (No Splash Screen Reading)**

- App opens directly into companion world (animated environment)
- Companion appears naturally (flying in, materializing)
- First words: "Salut ! Je suis [Companion]. On explore ensemble ?"
- **No** "Welcome to TMV" text screens

#### 1. **The Call to Adventure (No Splash Screen)**

- App opens to dramatic scene: User's chosen battlefield (dark forest, stormy sky, etc.)
- Companion appears: "Salut, guerrier/guerrière. Prêt(e) à reprendre le contrôle ?"
- **No** "Welcome to TMV" corporate nonsense
- Background music: Epic, not calming

#### 2. **Choose Companion by Interaction**

- 5 companions visible in their mini-worlds (animated loops)
- Tap to visit their world (immediate feedback: world expands, music starts)
- Companion introduces themselves **through action:**
  - Lumo: "Regarde les étoiles avec moi..." (points up, stars twinkle)
  - Papillon: "Attrape-moi si tu peux !" (flies around playfully)
  - Étoile: "Touche ma main..." (sparkles appear on touch)
- Selection = natural click, not "Confirm" button

#### 2. **Choose Your Battle Companion**

- 5 companions in battle stances (not "cute poses")
- Tap to see their combat style:
  - Lumo: "Je vois les patterns que ton ennemi cache" (Intel specialist)
  - Papillon: "On va le défoncer ensemble !" (Hype man)
  - Étoile: "Je te protège quand tu es faible" (Healer)
  - Sage: "Connais ton ennemi, gagne la guerre" (Strategist)
  - Aurore: "Chaque jour est une nouvelle bataille" (Motivator)
- Selection triggers companion's battle cry + screen effect

#### 3. **First Goal via Conversation (Sandbox Mode)**

- Companion asks: "Qu'est-ce qui t'amène ici ?"
- User can type freely OR choose from floating bubbles
- Example bubbles:
  - "Je veux arrêter de fumer" 🚬
  - "J'ai du stress" 😰
  - "Je veux juste explorer" 🌍
- Companion responds emotionally (changes expression)
- Goal auto-created invisibly (no "Goal Added" confirmation)

#### 4. **Learn Crisis Logging by Doing**

- Companion notices: "Tu as l'air tendu(e). Montre-moi comment tu te sens."
- **No tutorial popup**, just:
  - Large pulsing SOS button appears (affordance: begs to be pressed)
  - User taps → Intensity slider appears (visual feedback: companion reacts to slider position)
  - Companion: "Respire avec moi" → Mini breathing animation starts
- First intervention happens **immediately**, no "Skip" option needed

#### 5. **Discover Habits Through Play**

- Next day, companion sends message: "On fait quelque chose ensemble aujourd'hui ?"
- Habit tracker appears as **interactive game board** (not a list)
- First habit is pre-populated based on goal ("Ne pas fumer aujourd'hui")
- Completion = satisfying animation (companion celebrates, world reacts)
- **Progressive unlock:** "Tu débloques une nouvelle habitude !" after 3 days

#### 6. **Feature Tour = No Tour**

- No feature walkthroughs
- **Context-driven discovery:**
  - Chat appears when companion has something to say
  - Insights unlock after 7 days (companion: "J'ai remarqué quelque chose...")
  - Export appears when therapist is mentioned in chat
- Tooltip system: Only if user seems stuck (30s inactivity on screen)

#### 3. **Name Your Enemy (First Goal Setting)**

- Companion: "Contre qui tu te bats ?"
- Options presented as **enemy types:**
  - 🚬 "La Cigarette" (Boss Level: Nicotine Demon)
  - 🍺 "L'Alcool" (Boss Level: Substance Tyrant)
  - 😰 "L'Anxiété" (Boss Level: Panic Shadow)
  - 🍔 "La Bouffe" (Boss Level: Comfort Dragon)
  - 📱 "Les Écrans" (Boss Level: Dopamine Trap)
  - ⚡ "Autre chose" (Custom boss)
- After selection: "Ton ennemi: [Enemy Name]. Niveau de menace: [Intensity slider]"
- Companion: "On va le traquer. Chaque bataille compte."

#### 4. **First Blood: Log Your First Crisis as a Battle**

- Companion: "Montre-moi ta dernière défaite. Pas pour te juger. Pour comprendre l'ennemi."
- Interface shift: Crisis log becomes **Battle Report**
  - Type → Enemy Attack Type
  - Intensity → Damage Taken (health bar visual)
  - Trigger → Enemy's Weapon Used
  - Notes → Battle Debrief
- Submit button: "ENREGISTRER LA DÉFAITE"
- Companion reacts: "Ok. On sait maintenant comment il frappe. Prochaine fois, tu seras prêt(e)."
- **First XP Earned:** +10 XP "Intelligence Gathering"

#### 5. **Your First Weapon: Quick Intervention**

- Companion: "Si ça se reproduit dans l'heure, voici ton arme:"
- Show 3 intervention cards as **Combat Moves:**
  - "Respiration de Guerre" (Breathing exercise)
  - "Diversion Tactique" (Distraction technique)
  - "Appel d'Urgence" (Emergency contact)
- User picks one → Tutorial starts immediately
- Completion: +25 XP "First Victory"
- Companion: "Tu as survécu. C'est déjà une victoire."

#### 6. **The War Map: Unlock Your Dashboard**

- Companion: "Viens. Je te montre ton terrain de bataille."
- Home screen revealed as **War Command Center:**
  - Crisis SOS → Red Alert Button
  - Habits → Daily Missions
  - Streaks → Victory Counter
  - Insights → Enemy Intel
- Companion: "Chaque jour sans défaite = 1 niveau gagné. Allons-y."

**Key Improvements:**

- ❌ Remove: "Welcome Screen," "Feature Tour," "First Check-In" as separate steps
- ✅ Add: Immediate playground, action-first learning, emotional feedback loops
- ✅ Inspiration: _Minecraft_ (sandbox), _Stray_ (intuitive interactions), _The Witness_ (self-teaching puzzles)
- ❌ Remove: Boring "feature tour"
- ✅ Add: War metaphors, hero's journey framing, XP for everything
- ✅ Inspiration: _God of War_ (companion dynamics), _Hades_ (dying = data, not failure)

**Technical Notes:**

- Onboarding state saved at each micro-interaction (not per "step")
- No "Skip Tutorial" button (because there is no tutorial)
- Can exit/return anytime without losing progress
- Background music starts immediately (companion's theme)
- XP system starts on day 1 (tracked in UserProfile table)
- Battle metaphors = UI copy, not actual game mechanics (keeps it therapeutic)
- Can skip tutorial but companion remembers ("Tu as foncé tête baissée. Respecté.")

---

### 3.1 Quick Symptom/Crisis Logging → **Quick Battle Report** 🎮

**Priority:** P0 (Critical)

**User Story:** As a user in crisis, I need to log my state in under 10 seconds so I can get immediate help without friction.
**User Story:** As a user in crisis, I need to log my defeat in under 10 seconds so I can **get back in the fight** without friction.

**Requirements:**

- Single-tap entry from home screen widget (iOS/Android)
- Voice input option
- Pre-configured quick entries (customizable)
- Minimum fields: Type, Intensity (1-10), Timestamp
- Optional fields: Trigger, Emotion, Context, Notes
- **Reframed Fields (Gamified):**
  - Type → Enemy Attack Type
  - Intensity (1-10) → Damage Taken (health bar)
  - Timestamp → Battle Time
  - Trigger → Enemy's Weapon
  - Emotion → Your State
  - Context → Battlefield Conditions
  - Notes → Debrief
- Offline-first: Works without internet, syncs later
- Maximum 3 taps from app launch to logged entry
- **New:** After logging, show XP earned: "+10 XP: Intelligence Gathered"

**Post-Log Screen:**

- **Immediate Feedback:** "Défaite enregistrée. L'ennemi a frappé à [time]."
- **XP Reward:** +10 XP base, +5 XP if trigger identified, +5 XP if detailed notes
- **Next Action:** "Veux-tu contre-attaquer maintenant ?" → Intervention options

**Technical Notes:**

- Native widgets (iOS: WidgetKit, Android: App Widgets)
- Local SQLite database with background sync
- Voice-to-text API integration (iOS: Speech Framework, Android: Speech Recognizer)
- XP calculations: Simple additive system (tracked in CrisisLogs table)
- Battle metaphors in UI copy only (medical data stays clinical in backend)

---

### 3.2 Habit Tracking → **Daily Missions System** 🎯

**Priority:** P0 (Critical)

**User Story:** As a user building new habits, I need to track multiple behaviors daily with minimal effort.
**User Story:** As a user building new habits, I want to complete **missions** that level me up, not "check boxes."

**Requirements:**

- Support 3 habits (Free), Unlimited (Premium)
- Daily check-in with streak counter
- **Reframed as Missions:**
  - Habit Name → Mission Name (e.g., "Ne pas fumer" → "Résister à l'Ennemi")
  - Daily check-in → Mission Completion
  - Streak counter → Victory Streak
  - Habit categories → Mission Types:
    - 🛡️ Defense Missions (avoid addictions)
    - ⚔️ Offense Missions (positive behaviors)
    - 💊 Support Missions (medications, therapy)
    - 🏃 Training Missions (exercise, meditation)
- Flexible frequency (daily, weekly, custom)
- Habit categories: Addictions (inverse tracking), Positive behaviors, Medications, Activities
- Simple yes/no or intensity-based tracking
- Visual streak indicators (current, longest)
- Habit reminders (customizable time/frequency)
- **New: XP & Leveling:**
  - Mission completed: +20 XP
  - 7-day streak: +100 XP bonus
  - 30-day streak: +500 XP bonus + Badge unlock
  - Failed mission: -0 XP (no punishment, just reset)
    **Visual Design:**
- Incomplete missions **pulse with urgency** (not guilt)
- Completed missions show:
  - ✅ Checkmark + XP gain animation
  - Companion reaction (celebrates, says something proud)
  - Contribution to daily XP total
- Streak visualized as **Victory Banner** (flames 🔥, growing in size)

**Gamification Elements:**

- **Daily Mission Board:** Shows all missions for today
- **Mission Difficulty:** User sets (Easy/Medium/Hard affects XP multiplier)
- **Combo System:** Complete all missions = +50 XP bonus
- **Perfect Week:** All missions for 7 days = Legendary Badge

**Technical Notes:**

- Habit → Mission mapping in UI layer only (database still uses "Habit" nomenclature)
- XP calculations stored in HabitLogs table (new field: xp_earned)
- Badges stored in UserAchievements table (new)

---

### 3.3 AI Pattern Recognition & Prediction → **Enemy Intel System** 🔍

**Priority:** P0 (Critical)

**User Story:** As a user, I want the app to identify my trigger patterns and warn me before I'm about to relapse.

**Requirements:**

- Analyze minimum 14 days of data before predictions
- **Reframed Outputs:**
  - Identified patterns → Enemy Tactics Decoded
  - Predictions → Incoming Attack Warnings
  - Confidence score → Intel Reliability (%)
- Identify patterns:
  - Time-based (hour of day, day of week)
  - Context-based (location, social situation)
  - Emotional state correlations
  - Multi-factor triggers
- Predictive alerts: "High risk detected in next 2 hours"
- Confidence score displayed to user
- User can confirm/reject predictions (feedback loop)
- Privacy: All AI processing can run on-device (Core ML/TensorFlow Lite)
  - Time-based (hour of day, day of week) → "L'ennemi frappe souvent à 16h"
  - Context-based (location, social situation) → "Danger élevé quand tu es seul(e)"
  - Emotional state correlations → "Tes défenses sont faibles quand tu es stressé(e)"
  - Multi-factor triggers → "Combinaison létale détectée: Stress + Fatigue + Solitude"
- **New: XP for Patterns:**
  - New pattern discovered: +50 XP "Enemy Weakness Found"
  - User confirms prediction accuracy: +10 XP "Intel Validation"
  - User rejects prediction: -0 XP (feedback loop, no penalty)

**UI Presentation:**

- Patterns shown as **Dossier Cards** with:
  - Enemy tactic description
  - Frequency graph (heatmap)
  - Success rate if user followed prevention plan
  - "Activer les alertes" toggle
- Companion narrates: "J'ai trouvé quelque chose. Ton ennemi attaque toujours le mardi soir. Voici pourquoi..."

**Technical Implementation:**

- Phase 1: Rule-based pattern matching (on-device)
- Phase 2: ML models (TensorFlow Lite/Core ML)
- Phase 3: GPT-based analysis (optional, cloud-based with encryption)

**Data Points for Analysis:**

- Crisis timestamps
- Intensity levels
- Habit adherence patterns
- Sleep data (if integrated)
- Activity data (if integrated)
- Self-reported triggers
- Contextual data (time, day, weather via API)
- **New:** XP rewards trigger in-app celebrations

---

### 3.4 Smart Interventions → **Combat Arsenal** ⚔️

**Priority:** P0 (Critical)

**User Story:** As a user facing a crisis, I need immediate, personalized interventions that actually work for me.
**User Story:** As a user facing a crisis, I need **weapons that work** for me, delivered fast, no bullshit.

**Requirements:**

- 100+ pre-loaded intervention protocols
- **Reframed as Combat Moves:**
  - Breathing exercises → Breathing Warfare Techniques
  - Distraction techniques → Tactical Diversions
  - Emergency contacts → Backup Call
  - Physical activities → Battle Drills (push-ups, cold shower)
  - Cognitive reframes → Mental Shields
- **New: XP & Effectiveness Tracking:**
  - Start intervention: +0 XP (no reward for trying)
  - Complete intervention: +30 XP "Crisis Averted"
  - Mark as "This worked": +10 XP bonus + effectiveness stored
  - Mark as "This didn't work": -0 XP (but app learns)
- Personalization based on:
  - What has worked before (success rate tracking)
  - Current context (time, intensity, trigger)
  - Crisis intensity
- Intervention library searchable and browsable
- Users can create custom interventions
- Quick access: Max 2 taps from crisis log
- **New: Weapon Leveling:**
  - Use intervention 5x → Unlocks advanced version
  - 10x → "Mastered" badge
  - Most effective weapon gets "Signature Move" title

**Visual Design:**

- Interventions shown as **Weapon Cards** with:
  - Icon (sword, shield, potion, etc.)
  - Name (badass, not clinical)
  - Effectiveness rating (⭐⭐⭐⭐⭐)
  - Time to complete
  - XP reward displayed
- During intervention: Immersive full-screen (no distractions)
- After completion: **Victory Screen** with XP animation

**Companion Integration:**

- Companion suggests interventions: "Utilise la Respiration de Guerre. Ça marche 80% du temps pour toi."
- Companion coaches during: "Respire. Tu as déjà gagné 23 batailles comme ça."
- Companion celebrates after: "Victoire. +30 XP. Tu montes de niveau bientôt."

**Technical Notes:**

- Video/audio guided exercises (embedded or streamed)
- Timer/countdown UI components
- Integration with native calling/messaging
- Success tracking: Did this intervention help? (Yes/Somewhat/No)
- Weapon effectiveness stored in Interventions table (new field: success_rate)
- XP rewards trigger UserProfile.total_xp update + level check
- "Mastered" badges stored in UserAchievements table

---

### 3.5 Predictive Notifications → **Incoming Attack Alerts** 🚨

**Priority:** P1 (High)

**User Story:** As a user, I want to be **warned before the enemy strikes** so I can prepare my defenses.

**Requirements:**

- Proactive alerts before predicted high-risk windows
- Alert timing: 15-30 minutes before predicted crisis
- **Reframed Alert Content:**
  - "High risk detected" → "⚠️ ALERTE: Ennemi détecté"
  - Risk level → Threat Level (Faible/Modéré/Élevé/Critique)
  - Identified triggers → "Armes de l'ennemi: [triggers]"
  - Suggested interventions → "Plan de défense: [3 options]"
- **New: Alert as Mission:**
  - Title: "MISSION URGENTE: Prévenir l'attaque de 16h"
  - Accept alert → Opens prep screen (+10 XP for opening)
  - Complete suggested intervention → +50 XP "Pre-emptive Strike"
  - Ignore alert but survive window → +20 XP "Solo Victory"
  - Ignore alert and log crisis → -0 XP (no penalty, just data)
- User controls:
  - Enable/disable predictions
  - Quiet hours
  - Alert frequency limits
- Notification action buttons: "I'm OK", "Need Help Now", "Snooze"
- Notification action buttons:
  - "JE ME PRÉPARE" → Opens intervention picker
  - "ÇA VA, MERCI" → Dismisses, logs confidence
  - "SNOOZE 15 MIN" → Delays alert

**Technical Notes:**

- Background processing for prediction calculations
- Smart notification throttling (avoid alert fatigue)
- iOS: UNUserNotificationCenter with actions
- Android: NotificationCompat with action buttons
- Alert acceptance/effectiveness tracked (improves ML model)
- XP rewards stored in NotificationInteractions table (new)

---

### 3.6 Analytics & Insights Dashboard → **War Room Command Center** 📊

**Priority:** P1 (High)

**User Story:** As a user, I want to understand my patterns and see my progress over time.
**User Story:** As a user, I want to see **my war stats** and understand how I'm winning.

**Requirements:**

- **Reframed Dashboard Sections:**
  - Current streaks → Victory Counters
  - Crisis frequency trends → Enemy Activity Patterns
  - Pattern insights → Intel Reports
  - Habit adherence rates → Mission Success Rate
  - Recovery rate → Time Between Defeats
  - Intervention effectiveness → Arsenal Stats

- **New: XP & Leveling Display:**
  - **Top of Dashboard:** User Level + XP Bar (e.g., "Niveau 7 | 1,240 / 2,000 XP")
  - **XP Breakdown:** Today's XP, This Week, All-Time
  - **Level Benefits:** Show what unlocks at next level
  - **Leaderboard (Optional):** "Tu es dans le top 15% des combattants"

- **New: Battle History:**
  - Timeline view of all crises (defeats) + victories (avoided crises)
  - Each entry shows:
    - XP gained/lost
    - What worked
    - What didn't
  - Filter by: Last 7d, 30d, 90d, All time

- **New: Achievement Gallery:**
  - Badges earned displayed prominently
  - Locked badges shown (teaser for future goals)
  - Share achievements (optional, social proof)

- Visualizations:
  - Line charts (trend over time) → Victory/Defeat Graph
  - Heatmaps (when crises occur) → Enemy Strike Zones
  - Progress bars (habit completion) → Mission Progress
  - Comparison graphs → "Cette semaine vs la semaine dernière"

- **New: Companion Commentary:**
  - Companion appears in dashboard: "Regarde ça. Tu as gagné 85% de tes batailles cette semaine. C'est énorme."
  - Insights narrated by companion (not cold stats)

- Export to PDF (shareable with therapist)

**Technical Notes:**

- Secure link generation (JWT tokens, time-based expiry)
- HIPAA/GDPR considerations for data sharing
- Encrypted data transmission

---

### 3.8 Health Integration

**Priority:** P2 (Medium)

**User Story:** As a data-driven user, I want to correlate my physical health metrics with my mental state.

**Requirements:**

- iOS: HealthKit integration
  - Read: Sleep, Steps, Heart Rate, Exercise
  - Write: Mindful Minutes (for meditation/breathing exercises)
- Android: Google Fit integration
  - Read: Activity, Sleep, Heart Rate
- Correlation analysis:
  - "Crises 3x more likely on days with <6h sleep"
  - "Adherence 40% higher on exercise days"
- Display in insights dashboard

**Technical Notes:**

- Requires user permission (explain value clearly)
- Background data fetching (daily sync)
- Privacy: Health data never leaves device unless user explicitly shares

---

### 3.9 AI Companion Conversational System ✅ **NEW - IN SCOPE**

**Priority:** P0 (Critical)

**User Story:** As a user, I want to talk with my AI companion who feels alive, remembers my story, expresses emotions, and helps guide me through life day by day with smart, insightful questions.
**User Story:** As a user, I want my companion to **hype me up like a coach**, not talk like a therapist.
**Enhanced Companion Personalities:**
**Companion Personalities & Visual Styles:**

- **Lumo (Firefly):**
  - Personality: Calm, wise, introspective
  - Visual: Soft blue/green glow, gentle animations
  - Voice tone: Soothing, measured
  - Background: Twilight forest ambiance
  - Music: Ambient, meditative tracks
  - Personality: Wise tactician, intel specialist
  - Voice tone: Calm, strategic
  - Battle cry: "Je vois clair dans le noir."
  - XP phrases: "Tu as gagné 50 XP. La connaissance est une arme."
- **Papillon (Butterfly):**
  - Personality: Energetic, playful, motivational
  - Visual: Bright colors (yellow, orange), fluttery animations
  - Voice tone: Upbeat, encouraging
  - Background: Sunny meadow
  - Music: Uplifting, folk-inspired
  - Personality: Hype man, motivator
  - Voice tone: Energetic, aggressive positivity
  - Battle cry: "On va tout défoncer !"
  - XP phrases: "BOOOM ! +30 XP ! Tu es une machine !"

- **Étoile (Fairy):**
  - Personality: Nurturing, empathetic, magical
  - Visual: Soft pastels, sparkle effects
  - Voice tone: Warm, gentle
  - Background: Starlit night sky
  - Music: Ethereal, celestial
  - Personality: Supportive healer, empathetic
  - Voice tone: Warm, protective
  - Battle cry: "Je te protège, toujours."
  - XP phrases: "Tu as gagné 20 XP. Je suis fière de toi."

- **Sage (Owl):**
  - Personality: Analytical, pattern-focused, thoughtful
  - Visual: Earth tones, perched poses
  - Voice tone: Measured, intelligent
  - Background: Ancient library/tree
  - Music: Classical, contemplative
  - Personality: Analytical strategist
  - Voice tone: Measured, data-driven
  - Battle cry: "Connais ton ennemi."
  - XP phrases: "XP +40. Pattern identifié. Exploitons-le."

- **Aurore (Dawn Sprite):**
  - Personality: Hopeful, fresh-start focused
  - Visual: Pink/gold sunrise hues
  - Voice tone: Optimistic, clear
  - Background: Sunrise horizon
  - Music: Piano, morning melodies
  - Personality: Fresh-start champion
  - Voice tone: Hopeful, energizing
  - Battle cry: "Chaque jour, une nouvelle chance."
  - XP phrases: "Nouveau jour, +25 XP. Let's go !"
    **Enhanced Emotional Expression:**
- 8 core emotions + **New:** Victory Celebration mode
  - Triggered when: User completes mission, earns achievement, levels up
  - Visual: Companion does victory animation
  - Audio: Triumphant sound effect
  - Message: "TU L'AS FAIT ! Niveau [X] atteint !"

**Enhanced Memory & Context:**

- **New: Battle History Memory:**
  - Companion remembers user's past victories and defeats
  - References them in conversation: "Tu te souviens du 15 mars ? Tu as tenu 6 heures. Tu peux refaire pareil."
- **New: XP Milestone Memory:**
  - Companion tracks leveling up moments
  - Celebrates anniversaries: "Il y a 30 jours, tu étais niveau 3. Maintenant, niveau 9. Respect."

**Enhanced Daily Guidance:**

- **Morning Check-In:**
  - "Bonjour, guerrier/guerrière ! XP d'hier: [amount]. Missions du jour: [list]. On y va ?"
  - Shows current level + XP to next level

- **Throughout Day (ML-Pattern Based & Configurable):**
  - Proactive messages at predicted risk times or when patterns suggest a check-in.
  - "Comment te sens-tu en ce moment, [User Name]?" (frequency configurable by user)
  - User can type freely OR choose from floating bubbles/suggested responses.
  - Celebration of completed missions/habits.
  - Gentle reminders (not nagging).
  - Respond to user-initiated chats anytime.

- **Evening Reflection:**
  - "Bilan de la journée: [X] missions complétées, [Y] XP gagnés, [Z] batailles gagnées. Fier(e) ?"
  - Suggests bonus mission for tomorrow

**Smart, Insightful Questions:**

- **Types of Questions:**
  - Open-ended exploration: "Qu'est-ce qui t'a aidé à résister aujourd'hui?"
  - Pattern investigation: "J'ai remarqué que tu as souvent des envies le mardi soir. Que se passe-t-il généralement ce jour-là?"
  - Trigger drilling: "Tu as mentionné le stress au travail. Peux-tu m'en dire plus?"
  - Intervention evaluation: "La respiration guidée t'a aidé la dernière fois. Veux-tu réessayer?"
  - Goal clarification: "Pourquoi est-ce important pour toi aujourd'hui?"
  - Emotional validation: "Ça a l'air difficile. Comment puis-je t'aider maintenant?"

- **Question Timing:**
  - Never interrupt crisis logging (wait until intervention phase)
  - Ask during natural conversation pauses
  - Limit to 1-2 questions per interaction (avoid interrogation)
  - Adjust frequency based on user responsiveness

**Conversational AI Implementation:**

- **Phase 1 (MVP):** Rule-based + GPT-4 Turbo
  - Context window: Last 10 messages + user profile summary
  - Temperature: 0.7 (balanced creativity/consistency)
  - System prompt defines companion personality
  - Fallback to pre-written responses if API fails
- **Phase 2:** Fine-tuned model
  - Train on anonymized successful conversations
  - Optimize for therapy-aligned responses
  - Reduce API costs
  - "Bilan de la journée: [X] missions complétées, [Y] XP gagnés, [Z] batailles gagnées. Fier(e) ?"
  - Suggests bonus mission for tomorrow

**Enhanced Smart Questions:**

- **New: Performance-Oriented Questions:**
  - "Qu'est-ce qui t'a aidé à gagner aujourd'hui ?"
  - "Tu as esquivé l'attaque de 16h. Comment ?"
  - "Ta mission 'Résister' est à 90% de réussite. Quel est ton secret ?"

**Safety & Guardrails:**

- Crisis detection in conversation (keywords: suicide, harm)
- Immediate escalation to crisis resources
- Disclaimers: "Je ne suis pas un thérapeute, mais je suis là pour t'aider"
- Cannot provide medical advice
- Cannot diagnose conditions
- Encourages professional help when appropriate

**Technical Notes:**

- Real-time chat interface (React Native Chat UI libraries)
- Typing indicators (companion "thinking")
- Message history stored locally + cloud sync
- Voice input/output (optional, Text-to-Speech)
- Push notifications for companion messages (opt-in)
- Conversation export (PDF, shareable with therapist)
- XP references added to all companion messages
- Victory celebrations trigger confetti animations (Lottie)
- Battle metaphors in system prompts (GPT-4)

---

### 3.10 Companion World & Customization → **Battle Arenas & View Modes** ✅ **ENHANCED**

**Priority:** P2 (Medium - Post-MVP)

**User Story:** As a user, I want to experience my journey through different visual perspectives and customize my environment, unlocking cool stuff as I level up, like a real game.

**Requirements:**

- **New: View Modes Selection:**
  - Users can select between two primary view modes:
    - **"Face-to-Face" View:** Focuses on the AI companion directly.
    - **"Map View":** Displays the user's progress and environment as a strategic map.
  - **Dynamic View Activation:** When the user reports feeling bad (e.g., via Quick Battle Report or in conversation), and the companion is actively providing solutions or interventions, the **Map View (War Arena theme)** will dynamically appear, replacing the Face-to-Face view if active, to emphasize the "combat system" philosophy. The companion's prompts will shift to guide the user through this "battle."
  - Users can select a graphical dimension for each view: 1D, 2D, or 3D.
    - **1D:** Text-based descriptions, subtle ambient effects. (e.g., companion described, map shows progress via text/simple lines)
    - **2D:** Stylized illustrations, animated sprites. (e.g., existing companion art, themed flat map)
    - **3D:** Immersive environments, fully animated models. (e.g., 3D rendered companion, dynamic 3D world)
  - Default view mode and dimension selected during onboarding or based on companion choice.
- **Unique Battle Arenas per Companion (Map View):**
  - Each companion has a themed environment that serves as their "Map View" arena.
  - **Battle History Visualization:** The Map View will visually represent the user's past events as a time-based walk, with each "battle" (crisis logged) clearly marked. This provides a visual history of the user's journey.
  - Interactive elements unlock with XP:
    - Level 5: New background variant (e.g., different terrain for Map View)
    - Level 10: Animated elements (e.g., moving clouds on Map View, active NPCs)
    - Level 20: Full arena customization (e.g., user can place objects on Map View)
  - Seasonal variations (winter, spring themes apply to Map View).

- **Visual Customization (XP-Gated):**
  - **Companion Styles (Face-to-Face View):**
    - The existing 5 companion styles (Lumo, Papillon, Étoile, Sage, Aurore) apply directly to the Face-to-Face view.
    - **Level 3:** Unlock companion outfits (basic)
    - **Level 7:** Unlock rare outfits
    - **Level 15:** Unlock legendary outfits
    - **Achievements:** Special outfits for milestones (30-day streak = Gold Armor)
  - **View Mode Styles (Map & Face-to-Face):**
    - Background themes (dark mode variations, specific companion world themes)
    - Animation styles (subtle vs expressive for 2D/3D views)
    - **Unlockable 1D/2D/3D dimensions:**
      - 1D available from start.
      - 2D unlocks at Level 2.
      - 3D unlocks at Level 8.

- **Musical Tracks (XP-Gated):**
  - Each companion has 3-5 unique tracks, which can be selected for either view mode.
  - **Level 1:** 1 track available
  - **Level 5:** Unlock 2nd track
  - **Level 10:** Unlock 3rd track
  - **Achievements:** Bonus tracks for major milestones
  - User can select preferred track or shuffle

- **Companion Switching:**
  - Users can change companions (once per week free, unlimited premium)
  - **New:** Switching costs 500 XP (prevents abuse, makes choice meaningful)
  - New companion "recruits" user: "Salut. J'ai entendu parler de tes victoires. Je veux t'aider."
  - New companion reviews history (no XP loss)

- **New: Cosmetic Shop (Premium Feature):**
  - Spend XP on cosmetics:
    - Companion skins: 1,000 XP
    - Arena themes (for Map View): 500 XP
    - Victory animations: 250 XP
    - **New:** 1D/2D/3D visual packs: 750 XP (unlock alternative styles for each dimension)
  - Premium users get 2x XP multiplier (incentive)

**Technical Notes:**

- Unlockables stored in UserUnlockables table (new)
- XP costs hardcoded (balance adjustable via config)
- Cosmetics tied to UserProfile (sync across devices)
- Rendering engine considerations for 1D/2D/3D (e.g., React Native Skia for 2D, Three.js/Babylon.js for 3D web dashboard, native rendering for 3D mobile if performance critical).

---

### 3.11 Gamification & Engagement Design ✅ **ENHANCED**

**Priority:** P1 (High)
**Tables:**

```
Users (id, email, created_at, subscription_tier)
Habits (id, user_id, name, type, frequency, created_at)
HabitLogs (id, habit_id, date, completed, intensity, notes)
Crises (id, user_id, type, intensity, trigger, emotion, context, timestamp)
Interventions (id, user_id, crisis_id, intervention_type, success_rating, timestamp)
Patterns (id, user_id, pattern_type, confidence, metadata, detected_at)
HealthData (id, user_id, date, steps, sleep_hours, heart_rate_avg)
```

**Cloud Sync:**

- Backend: Firebase (Firestore + Cloud Functions) OR Supabase OR custom Node.js/PostgreSQL
- Sync strategy: Offline-first, background sync when online
- Conflict resolution: Last-write-wins with timestamp

---

### 3.12 Companion-Led Routines ✅ **NEW - IN SCOPE**

**Priority:** P1 (High)

**User Story:** As a user, I want to create and follow morning and night routines with my AI companion to build consistency and structure in my day.

**Requirements:**

- **Routine Creation:**
  - Users can create separate morning and night routines.
  - Select actions from a pre-defined list (e.g., "Drink water," "Exercise," "Read," "Meditate," "Plan day," "Journal," "Prepare for sleep").
  - Set time and order for each action.
  - Option to add custom actions.
  - Companion suggests actions based on user goals and preferences.

- **Companion-Guided Execution:**
  - Users can launch the routine at the scheduled time.
  - Companion provides encouragement and guidance during each action.
  - Visual timer/progress bar for each action.
  - Option to skip or postpone actions.
  - Haptic feedback for transitions between actions.
  - Companion performs animated actions alongside the user (e.g., stretching, meditating).

- **Logging and Tracking:**
  - Users can log whether they completed each action in the routine.
  - Track routine completion rate over time (daily, weekly, monthly).
  - Visualize routine adherence in the analytics dashboard.
  - Companion provides insights and encouragement based on routine performance.

- **Gamification:**
  - Earn XP for completing routines and individual actions.
  - Unlock new actions and customization options for routines.
  - Streaks for consecutive routine completions.
  - Badges for achieving routine milestones.

**Visual Design:**

- **Routine Creation Screen:**
  - Drag-and-drop interface for ordering actions.
  - Searchable list of pre-defined actions with icons.
  - Visual timeline representation of the routine.

- **Routine Execution Screen:**
  - Full-screen, distraction-free interface.
  - Animated companion character performing actions.
  - Clear timer and progress indicators.
  - Easy-to-access controls for skipping or postponing actions.

**Companion Integration:**

- Companion suggests routines based on user data and goals.
- Provides personalized encouragement and motivation during routines.
- Celebrates routine completion and milestones.
- Offers insights and recommendations for optimizing routines.

**Technical Notes:**

- Routine data stored locally and synced to the cloud.
- Integration with the notification system for routine reminders.
- Use of animation libraries for companion actions.
- XP and reward system integrated with existing gamification framework.

---

### 4.2 Data Architecture

**Local Storage:**

<!-- unchanged content -->

```sql
  times_used INT DEFAULT 0,
  xp_earned INT DEFAULT 0  -- NEW
)

Routines (  -- NEW TABLE
  id,
  user_id,
  name VARCHAR(255),  -- "Morning Routine", "Night Routine"
  type ENUM('morning', 'night'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

RoutineActions (  -- NEW TABLE
  id,
  routine_id,
  action_type VARCHAR(255),  -- "Drink water", "Exercise", etc.
  action_order INT,  -- order in the routine
  duration_minutes INT,  -- how long to do the action
  scheduled_time TIME,  -- specific time of day (e.g. 7:00 AM)
  xp_reward INT DEFAULT 10  -- XP earned for completing this action
)

RoutineLogs (  -- NEW TABLE
  id,
  routine_id,
  date DATE,
  completed BOOLEAN,
  xp_earned INT DEFAULT 0  -- XP earned for completing the entire routine
)

RoutineActionLogs (  -- NEW TABLE
  id,
  routine_log_id,
  routine_action_id,
  completed BOOLEAN,
  skipped BOOLEAN
)
```

<!-- unchanged content -->

### 4.3 AI/ML Pipeline

**Pattern Detection (On-Device):**

- Phase 1: Rule-based heuristics
  - Frequency analysis (time of day, day of week)
  - Trigger co-occurrence
  - Intensity trends
- Phase 2: ML models
  - Time-series forecasting (ARIMA, LSTM)
  - Classification models (identify high-risk states)
  - Trained on anonymized aggregate data
  - Models: TensorFlow Lite (Android), Core ML (iOS)

**GPT-Based Insights (Cloud, Optional):**

- User can opt-in for enhanced AI analysis
- Data encrypted in transit and at rest
- OpenAI API or self-hosted LLM
- Use cases:
  - Generate personalized intervention suggestions
  - Analyze journal entries for patterns
  - Create motivational content

---

### 4.4 Security & Privacy

**Requirements:**

- GDPR compliant (EU users)
- HIPAA considerations (US health data)
- End-to-end encryption for cloud sync
- Local biometric authentication (Face ID, fingerprint)
- Data deletion: User can delete all data permanently
- No third-party analytics by default (optional opt-in)
- Open source crypto libraries (libsodium)

**Data Retention:**

- Local: Indefinite (user controls)
- Cloud: User-controlled (can purge)
- Backups: Encrypted, 30-day retention

---

### 4.5 Notification System

**Smart Timing:**

- Avoid nighttime notifications (default: 10pm-8am quiet)
- Learn optimal times from user interaction patterns
- Throttle: Max 1 predictive alert per 4 hours
- Emergency mode: User can trigger immediate alerts off

**Types:**

- Habit reminders
- Predictive crisis alerts
- Milestone celebrations
- Daily check-in prompts

---

## 5. User Experience (UX) Specifications

### 5.1 Onboarding Flow

**Goal:** Get user to first value (logging first crisis/habit) in <2 minutes

**Screens:**

1. Welcome splash (value proposition)
2. Primary goal selection:
   - Overcome addiction
   - Manage anxiety/symptoms
   - Build better habits
3. Permission requests (explain each):
   - Notifications (critical for alerts)
   - Health data (optional, explain benefits)
4. Quick setup:
   - Add 1-3 habits/addictions to track
   - Set primary crisis type
5. Tour of key features (skippable)
6. Log first entry (guided)

**Design Principles:**

- Minimal text, maximum clarity
- Dark mode default (reduce eye strain during crisis)
- Large touch targets (accessible during shaky moments)
- No forced account creation (allow exploration first)

---

### 5.2 Home Screen

**Layout (Priority Order):**

1. **Crisis SOS Button** (Always visible, red, large)
   - Tap → Quick log + Intervention suggestions
2. **Today's Habits** (Checklist)
   - Swipe right to complete
   - Shows streak
3. **Current Streaks** (Cards)
   - Days since last crisis (per type)
   - Visual progress bars
4. **Predicted Risk** (If AI detects pattern)
   - "Moderate risk detected around 4pm today"
   - Tap for prevention plan
5. **Quick Stats** (Glanceable)
   - This week vs last week
   - Tap for full analytics

**Navigation:**

- Bottom Tab Bar: Home | Habits | Insights | Profile
- Floating Action Button (FAB): Quick log

---

### 5.3 Crisis Logging Flow

**Speed is critical:**

1. Tap SOS or FAB
2. Select crisis type (max 6 favorites shown)
3. Adjust intensity slider (1-10, default 5)
4. [Optional] Add trigger (1 tap from suggestions)
5. [Optional] Add note (voice or text)
6. Save (auto-saves after 5 seconds)
7. **Immediate:** Show intervention options

**Post-Log:**

- "You logged this. What helps?" → 3 intervention cards
- User picks one or dismisses
- Track intervention success

---

### 5.4 Intervention Screen

**UI:**

- Full-screen, distraction-free
- Large start button
- Timer/progress indicator
- Exit option (saves partial progress)

**Example: Breathing Exercise**

- Animated circle (inhale expands, exhale contracts)
- Count display
- Haptic feedback on transitions
- Background music (optional, user-selected)

---

### 5.5 Analytics Screen

**Tabs:**

1. **Overview:** Key metrics at a glance
2. **Patterns:** AI-detected insights
3. **Trends:** Charts over time
4. **Interventions:** What works best

**Interaction:**

- Tap any chart for drill-down
- Swipe between time ranges (week/month/year)
- Export button (top-right)

---

## 6. Monetization & Business Model

### 6.1 Pricing Tiers

**Free:**

- 3 habit trackers
- Unlimited crisis logging
- Basic interventions (20)
- 30 days of data retention
- Basic analytics

**Premium ($9.99/month or $89.99/year):**

- Unlimited habits
- Full intervention library (100+)
- AI predictions & alerts
- Advanced analytics
- Unlimited data retention
- Cloud sync & backup
- Export reports (PDF/CSV)
- Health integration
- Priority support

**Lifetime ($199 one-time):**

- All Premium features forever
- Early access to new features

### 6.2 Revenue Projections

**Assumptions:**

- 10,000 downloads in Year 1
- 5% conversion to Premium (500 users)
- Average subscription value: $100/year

**Year 1 Revenue:** ~$50,000

**Growth Strategy:**

- Organic (SEO, content marketing)
- Partnerships with therapists/clinics
- Affiliate program
- Community word-of-mouth

---

## 7. Development Roadmap

### Phase 1: MVP (3-4 months)

**Goal:** Core tracking + AI companion + basic pattern detection

- ✅ User authentication & account management ✅ **VERIFIED IN SCOPE**
- ✅ Companion selection (3 companions: Lumo, Papillon, Étoile)
- ✅ Conversational AI system (GPT-4 integration) ✅ **VERIFIED IN SCOPE**
- ✅ Memory & context system ✅ **VERIFIED IN SCOPE**
- ✅ Emotional expression (5 core emotions) ✅ **VERIFIED IN SCOPE**
- ✅ Daily check-ins (morning/evening) ✅ **VERIFIED IN SCOPE**
- ✅ Guided onboarding with companion ✅ **VERIFIED IN SCOPE**
- ✅ Habit tracking (3 free, unlimited premium)
- ✅ Crisis logging (quick entry)
- ✅ Basic interventions (20 protocols, companion-guided)
- ✅ Pattern detection (rule-based)
- ✅ Dashboard (streaks, basic charts)
- ✅ Notifications (reminders, companion messages)
- ✅ Subscription system
- ✅ Privacy: Offline-first, encrypted storage

---

### Phase 2: AI Enhancement & Companion Expansion (2-3 months)

- ✅ Add 2 more companions (Sage, Aurore) ✅ **VERIFIED IN SCOPE**
- ✅ Full emotional range (8 emotions) ✅ **VERIFIED IN SCOPE**
- ✅ Advanced memory (conversation highlights, milestones) ✅ **VERIFIED IN SCOPE**
- ✅ ML-based pattern prediction
- ✅ Predictive crisis alerts (companion warns you)
- ✅ Intervention effectiveness tracking
- ✅ Advanced analytics dashboard
- ✅ Health data integration
- ✅ Export reports (PDF)
- ✅ Voice input/output for companion

---

### Phase 3: Companion Worlds & Scale (3-4 months)

- ✅ Unique world environments per companion ✅ **VERIFIED IN SCOPE**
- ✅ Musical tracks per companion ✅ **VERIFIED IN SCOPE**
- ✅ Visual customization & unlockables ✅ **VERIFIED IN SCOPE**
- ✅ Companion switching system ✅ **VERIFIED IN SCOPE**
- ✅ GPT-powered deep insights
- ✅ Therapist sharing portal
- ✅ Web dashboard
- ✅ Multilingual support (French, English, Spanish)

---

### Phase 4: Advanced Features (Ongoing)

- Anonymous community (companion-moderated forums)
- Wearable integration (Apple Watch, Wear OS)
- Voice assistant (Siri, Google Assistant)
- AR companion (see your companion in real world)
- Companion evolution (grows with user progress)
- Gamification (achievements, challenges)

---

## 8. Success Metrics (KPIs)

### User Engagement

- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Average sessions per user per day
- Retention: D1, D7, D30
- Streak length (median, avg)

### Health Outcomes

- Crisis frequency reduction (month-over-month)
- Intervention success rate
- Habit adherence rate
- User-reported improvement (NPS)

### Business

- Conversion rate (Free → Premium)
- Monthly Recurring Revenue (MRR)
- Churn rate
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)

### Technical

- App crash rate (<0.1%)
- API response time (<500ms p95)
- Sync success rate (>99%)

---

## 9. Risk Mitigation

### Risk 1: Low User Engagement

**Mitigation:**

- Smart notifications (not spammy)
- Gamification (celebrate wins)
- Community features
- Continuous A/B testing

### Risk 2: AI Predictions Inaccurate

**Mitigation:**

- Start with rule-based (safer)
- Show confidence scores
- User feedback loop
- Option to disable predictions

### Risk 3: Privacy Concerns

**Mitigation:**

- Transparent privacy policy
- On-device processing first
- User controls all data
- Third-party security audit
- GDPR/HIPAA compliance

### Risk 4: Medical Liability

**Mitigation:**

- Clear disclaimers (not medical advice)
- Encourage professional help
- Crisis resources (hotlines)
- Terms of Service

### Risk 5: Competition

**Mitigation:**

- Focus on predictive intervention (unique)
- Better UX (speed, simplicity)
- Privacy-first positioning
- Community moat

---

## 10. Technical Stack (Decided)

**Frontend:**

- React Native via **Expo** (iOS/Android)
- TypeScript everywhere
- Convex reactive queries (no Redux needed)
- React Navigation
- React Three Fiber / Expo GL (3D companion rendering)
- Reanimated (animations)

**Backend:**

- **Convex** (Backend as a Service): Real-time reactive database, mutations, queries, actions, vector search, file storage, scheduled jobs

**Authentication:**

- **Clerk**: User authentication, social login (Google, Apple), profile management

**AI/ML (100% On-Device):**

- **llama.cpp** via React Native bindings — on-device LLM for all companion conversations
- Model: Gemma 2B, Llama 3.2 3B, or Phi-3 mini (GGUF format, ~1-4GB download)
- **Zero API costs** for conversations, **zero data leaves the device**
- Rule-based pattern detection (Phase 1, Convex scheduled jobs for aggregation)
- **Convex Vector Search** for companion memory/RAG (embeddings stored in Convex, search queries don't contain raw conversation data)

**Voice (On-Device):**

- **Native device STT** (iOS Speech Framework, Android Speech Recognizer) — free
- **Native device TTS** (iOS AVSpeechSynthesizer, Android TextToSpeech) — free

**Data Visualization:**

- Victory Native (charts)
- react-native-calendars (heatmaps)

**Notifications:**

- Expo Notifications (wraps FCM + APNS)

**Payments:**

- **RevenueCat** for mobile In-App Purchases (App Store + Play Store) — MVP
- **Polar** for web dashboard subscriptions (Phase 3, when web arrives)

**Analytics:**

- Mixpanel OR Amplitude (opt-in only)

**Error Tracking:**

- Sentry

---

## 10b. Architectural Design Decisions (Pre-mortem Validated)

These are firm design decisions derived from failure scenario analysis. They are non-negotiable constraints for implementation.

### AD-1: 2D Default, 3D as Progressive Upgrade

- **Decision:** The app launches in **2D mode by default**. 3D (React Three Fiber) is an opt-in upgrade unlocked at Level 8.
- **Rationale:** Mid-range phones (80% of target market) cannot sustain 60fps 3D rendering alongside real-time chat and animations. A laggy companion during a crisis moment = user abandonment.
- **Implementation:** Detect device GPU capabilities at first launch. Recommend 1D/2D/3D based on benchmarks. Never auto-enable 3D.

### AD-2: 100% On-Device LLM (Zero Cost, Full Privacy)

- **Decision:** All companion conversations run **locally on the device** via llama.cpp. No cloud LLM. No API calls. No data leaves the phone.
- **Hybrid response strategy still applies:**
  - **Pre-written templates** for predictable interactions: XP celebrations, streak congratulations, standard check-in prompts, intervention coaching, mission completion. These are instant and lightweight.
  - **Local LLM** for: free-form conversation, personalized responses, contextual coaching, crisis support dialogue.
- **Rationale:** Zero API costs at any scale. Total privacy — conversations never leave the device. No dependency on external AI services. Users trust the app more.
- **Trade-off accepted:** Local models (1-3B params) are less capable than cloud models. Mitigated by: strong system prompts, companion personality templates, and pre-written responses for critical interactions.
- **Implementation:**
  - llama.cpp with React Native bindings (GGUF model format)
  - Model downloaded on first launch or after companion selection (~1-4GB, Wi-Fi recommended)
  - Model runs in a background thread (no UI blocking)
  - Companion personality injected via system prompt from config files (AD-5)
  - Pattern analysis aggregation still runs on Convex (scheduled jobs) — only the conversation is local

### AD-3: Graceful Offline Degradation (Cloud-First, Not Cloud-Only)

- **Decision:** The app is **cloud-first** (Convex). With the local LLM (AD-2), the companion can still talk without internet. Additionally, a **read-only emergency cache** stores locally:
  - User's top 3 most effective interventions
  - Emergency contact numbers
  - Basic breathing exercise (no network needed)
  - Current mission list and streak status
- **Rationale:** The local LLM means the companion is always available. The emergency cache ensures critical data is accessible even without Convex. Cloud is needed only for: data persistence, pattern aggregation, sync across devices.
- **Implementation:** Cache refreshed on every app open. ~50KB of data. Graceful degradation UI shows "Mode hors-ligne — ton compagnon est toujours là, tes données se synchroniseront dès que possible."

### AD-4: Centralized XP Engine (Single Source of Truth)

- **Decision:** All XP calculations go through **one centralized Convex module**. No feature may calculate or award XP independently.
- **Rationale:** XP touches 13+ features. Distributed XP logic = inconsistencies, duplicates, lost level-ups. Impossible to debug or rebalance.
- **Implementation:** Single Convex mutation: `awardXP(userId, action, context)`. All XP values defined in a central config (easy to rebalance). Level thresholds, badge triggers, and unlock gates all live in this module.

### AD-5: Config-Driven Companion System

- **Decision:** Companion personalities are **data files, not code**. Adding a companion = adding a config file, not writing new features.
- **Rationale:** 5 companions × 13 features = 65 variations. Hardcoding personality into features = unmaintainable. Config-driven = one codebase, N personalities.
- **Implementation:** Each companion has a JSON/YAML config containing:
  - `name`, `battleCry`, `xpPhrases[]`, `emotionResponses{}`, `systemPrompt`
  - `visualTheme`, `musicTracks[]`, `arenaConfig`
  - Message templates with variables: `"{{companion.name}} dit: {{companion.victoryPhrase}}"`

### AD-6: GDPR Deletion by Design

- **Decision:** `deleteAllUserData(userId)` is a **day-1 Convex mutation**, not an afterthought.
- **Rationale:** Conversations contain health data. Vector embeddings (RAG memory) are hard to delete retroactively. GDPR non-compliance = legal risk.
- **Implementation:** All Convex tables indexed by `userId`. Vector embeddings tagged with `userId` for cascade deletion. The deletion mutation is tested in CI. Deletion completes in <30 seconds and returns confirmation.

### AD-8: Security & Privacy by Design

**8a. All AI runs locally:**
- The LLM runs 100% on-device via llama.cpp. No conversation data is ever sent to a cloud AI service.
- No PII anonymization needed — data never leaves the phone for AI processing.

**8b. Crisis keyword interception:**
- Local pre-processor performs regex keyword detection BEFORE passing to the LLM.
- Critical keywords (suicide, self-harm, overdose) trigger hardcoded emergency response + crisis hotline numbers.
- The LLM is never called for these messages.

**8c. LLM output filtering:**
- Every LLM response is scanned locally before display.
- Medical advice, prescription mentions, or harmful content → replaced with safe fallback response.

**8d. Biometric-gated sensitive actions:**
- PDF export, data deletion, account settings all require biometric re-authentication.
- Even on an unlocked phone, sensitive data is protected.

**8e. Discreet notifications:**
- Lock screen notifications show generic text: "TMV : Ton compagnon a un message"
- Detailed content (crisis alerts, battle reports) only visible after app unlock.
- Optional "stealth mode": neutral app icon + generic app name.

**8f. Certificate pinning:**
- App pins Convex TLS certificates to prevent MITM attacks on public Wi-Fi.

**8g. E2E Encrypted Conversation Backup:**
- Conversations are stored in Convex BUT encrypted with a key derived from the user's password (client-side encryption).
- Convex stores encrypted blobs — the server CANNOT read conversation content.
- New phone = login + automatic decryption. Transparent for the user.
- Key derivation: PBKDF2 or Argon2 from user password → AES-256-GCM encryption.
- If user changes password: re-encrypt all conversations with new derived key (background job on device).
- Aggregated metrics (XP, streaks, crisis counts, patterns) are stored unencrypted in Convex (no sensitive text).

---

### AD-9: First Principles Constraints

**9a. Instant companion response (<1s):**
- Companion responds with pre-written templates during LLM cold start (2-10s).
- Seamless transition to LLM-generated responses once model is loaded.
- User never sees a loading spinner when talking to companion.

**9b. Gamification = real-life improvement, not app usage:**
- XP and rewards are tied to REAL OUTCOMES: days without substance, workouts done, meals logged, goals hit.
- NEVER reward app opens, time spent in app, or engagement metrics.
- If user "gets addicted" to improving their life via gamification, that IS the goal.
- No circuit breaker on gamification — the more engaged with real-life goals, the better.

**9c. 2D/1D default, 3D opt-in only:**
- App launches in 2D (or 1D, user's choice). 3D is never the default.
- 3D option available for users with capable devices (GPU benchmark on first launch).
- LLM inference and 3D rendering CANNOT run simultaneously (RAM constraint).
- Conversation mode = 2D/1D companion + LLM active.
- 3D exploration mode = 3D rendering + templates only (LLM paused).
- Smooth animated transition between modes.

**9d. Two-tier app architecture (instant usability):**
- App on store: <100MB. Fully functional with pre-written companion templates.
- Micro-model (~300-500MB, Gemma 2B Q4_0): downloads silently after install. Natural conversations available within minutes (see AD-10a).
- Full model (~1-2GB): optional upgrade offered later.
- First conversation works with templates, transitions to micro-model seamlessly once downloaded.

**9e. Progressive disclosure, not onboarding:**
- ZERO onboarding screens. No tutorial. No feature tour.
- Companion greets user immediately. Features revealed naturally through use.
- Context-driven discovery: features appear when relevant (chat when companion speaks, insights after 7 days, export when therapist mentioned).
- Tooltip only if user seems stuck (30s inactivity).
- Every feature is discoverable through conversation with the companion.

**9f. Data separation (device vs cloud):**
- **Device only:** raw conversation text (encrypted backup to Convex via AD-8g), local LLM model
- **Convex (readable):** aggregated metrics (XP, streaks, crisis counts, mood scores, patterns, achievements, config, companion settings)
- **Convex (E2E encrypted):** conversation history blobs, personal notes, journal entries
- PDF export for therapist generated locally from device data.

### AD-10: Cross-Functional Decisions

**10a. Two-stage model download:**
- Stage 1 (auto): Micro-model (~300-500MB, Gemma 2B Q4_0) downloads silently after install. Provides natural conversation quality immediately.
- Stage 2 (optional): Full model (~1-2GB) offered as upgrade later. "Ton compagnon peut devenir encore plus intelligent."

**10b. Trust-based XP (no verification):**
- XP is a personal contract. The app trusts the user. No verification.
- If HealthKit connected AND data contradicts self-report, companion asks gently (curiosity, not accusation). User's answer is final.

**10c. Convex with exit strategy (repository pattern):**
- All Convex queries/mutations wrapped in a repository abstraction layer.
- Business logic never calls Convex API directly.
- `exportAllUserData(userId)` mutation tested in CI alongside `deleteAllUserData()`.
- If Convex becomes problematic, repository layer allows migration to Supabase/PostgreSQL without rewriting business logic.

**10d. 3 companions at MVP, architected for 5+:**
- MVP: Lumo (calm strategist), Papillon (hype motivator), Étoile (nurturing healer).
- Covers 3 core emotional styles. Config-driven system (AD-5) means adding Sage + Aurore later = adding config files + 2D assets only.

**10e. RevenueCat only at MVP:**
- Single payment system until web dashboard arrives (Phase 3).
- Premium status stored in Convex: `user.subscriptionTier` (single source of truth).
- RevenueCat webhook → Convex mutation. Polar added later with same pattern.

---

### AD-7: Conservative Prediction Alerting

- **Decision:** Predictive alerts only fire at **>85% confidence**. Better to miss an alert than send a false one.
- **Rationale:** False positives ("attack incoming!") that don't happen → user disables alerts → no engagement → app is useless.
- **Implementation:** Confidence threshold configurable per user (default 85%). Every alert includes user feedback (confirm/reject). Rejection data feeds back into the model. First 14 days = no predictions (data collection only).

### AD-11: Architecture Decision Records

**11a. Flat project structure (no monorepo at MVP):**
- Single Expo project with Convex integrated.
- Companion engine isolated in `lib/companion/` (LLM, personality, templates, memory).
- Repository pattern in `lib/repository/` (AD-10c).
- Monorepo migration if/when web dashboard arrives (Phase 3).

**11b. Conversation pipeline:**
- Flow: Input → Safety Filter → Router (template vs LLM) → Personality injection → Output Filter → Memory Manager → Display.
- LLM runs in background worker thread (never blocks UI).
- Streaming tokens displayed with typing indicator.
- Three-level memory system:
  - Immediate: last 5-10 messages (in LLM prompt context)
  - Session: daily conversation summary (LLM-generated)
  - Long-term: key facts as key-value pairs (enemy name, streak records, victory milestones) injected into system prompt.

**11c. Pattern detection via Convex scheduled jobs:**
- Nightly cron job aggregates day's metrics (crises, moods, habits).
- Rule-based analysis identifies patterns and generates predictions.
- Patterns stored in Convex `patterns` table (readable, not sensitive).
- Predictions with >85% confidence trigger push notifications (AD-7).
- Companion references patterns locally: "J'ai reçu un signal..."

**11d. Navigation architecture (Expo Router):**
- 4 tabs: Home (Companion), Missions, War Room, Profile.
- Home screen IS the companion (2D face-to-face). Not a dashboard.
- Battle Report as modal overlay (accessible from any screen via FAB SOS).
- Interventions as full-screen immersive (no distractions).
- Companion contextually present in all tabs (small avatar + speech bubble).
- FAB SOS always visible except during active intervention.

**11e. Convex schema separation:**
- Readable tables: `users`, `crisisLogs`, `habitLogs`, `habits`, `patterns`, `interventions`, `achievements`, `routines`, `routineActions`, `routineLogs`, `notifications`, `companionConfigs`.
- E2E encrypted tables: `encryptedConversations`, `encryptedNotes`.
- Crisis logs contain type/intensity/trigger/timestamp but NEVER free-text notes.
- Free-text user content always encrypted (AD-8g).

### AD-12: Shark Tank Refinements

**12a. LLM runtime abstraction:**
- `lib/companion/` exposes interface: `generateResponse(prompt, config) → stream<tokens>`
- Implementation swappable: llama.cpp today, Apple Intelligence / Gemini Nano / any future on-device runtime tomorrow.
- Pipeline (AD-11b) never references llama.cpp directly — only the abstraction.

**12b. Market positioning strategy (two-phase):**
- **Phase 1 (Launch):** TMV is a **"wellness companion that helps you overcome toxic habits, manage crises, and build a healthier life, with gamification."**
  - **Safe vocabulary:** "surmonter tes habitudes toxiques", "combattre ce qui te freine", "reprendre le contrôle", "ancrer des habitudes saines", "gestion de crise", "moments difficiles", "comprendre tes patterns", "accompagnement".
  - **Forbidden vocabulary:** "traitement", "thérapie", "soigner", "diagnostic", "sevrage", "trouble", "maladie", "patient".
  - Empowerment framing, NOT medical framing. The user is the hero, not the patient.
  - In-app "combat" metaphors and "gestion de crise" are personal development language, not clinical claims.
  - Legal review required before launch (French CNIL + EU health app regulations).
- **Phase 2 (Post-traction):** Once market fit is proven and efficacy demonstrated:
  - Hire clinical professionals to validate therapeutic benefits.
  - Conduct studies to prove clinical efficacy.
  - Rebrand/reposition with medical backing if validated.
  - Pursue certifications (CE marking, potentially FDA) only with professional guidance.
- **Rationale:** Avoids legal/regulatory risk at launch. Builds user base first. Clinical validation comes from a position of strength (existing users, real data), not as a barrier to entry.

**12c. Generous free tier (zero marginal cost advantage):**
- Free: unlimited companion chat (local LLM = free), 3 habits, unlimited crisis logging, basic interventions (20), basic analytics.
- Premium: advanced analytics, pattern predictions, PDF export, additional companions (Sage, Aurore), cosmetics, routines.
- The local LLM is TMV's cost moat — competitors pay per API call, we don't.

**12d. Collective anonymous stats (social proof from MVP):**
- "X guerriers se battent avec toi en ce moment" (live Convex query, anonymized).
- "85% des guerriers ont complété leur mission aujourd'hui."
- No profiles, no forums, no social features — just the feeling of not being alone.
- Convex aggregation query (no PII exposed).

**12e. Companion-driven discovery calendar:**
- Day 1: Companion introduces missions naturally in conversation.
- Day 2: Companion suggests first intervention after a crisis log.
- Day 3: "J'ai quelque chose à te montrer" → War Room reveal.
- Day 5: Breathing exercise suggestion during conversation.
- Day 7: "J'ai détecté un pattern..." → Insights reveal.
- Calendar stored in `companionConfigs`, not hardcoded.

**12g. Safe vs forbidden vocabulary guide:**
- Safe: "gestion de crise", "moments difficiles", "habitudes toxiques", "reprendre le contrôle", "accompagnement", "comprendre tes patterns", "surmonter".
- Forbidden: "traitement", "thérapie", "soigner", "diagnostic", "sevrage", "trouble", "maladie", "patient".
- Applied to: store listing, marketing, in-app copy, companion prompts, notification text.

**12f. Art direction as priority investment:**
- 2D art style must be distinctive, expressive, and emotionally engaging.
- Animations (Lottie/Reanimated) are critical for companion personality.
- App Store screenshots must convey warmth and uniqueness, not "another wellness app."

### AD-13: User Persona Validation

**13a. Rechute = pas de punition, jamais:**
- XP acquis ne se perd JAMAIS, même en rechute.
- Streak reset est visuel mais companion intervient immédiatement : "23 jours gagnés. Une défaite ne les efface pas."
- No negative reinforcement in the system. Only progress acknowledgment.

**13b. Dual presentation mode (Warrior / Zen):**
- Same underlying system, two UI skins:
  - **Warrior:** missions, battles, XP, arsenal, War Room, SOS button
  - **Zen:** habits, journal, progress, tools, dashboard, "Comment je me sens" button
- User chooses during first interaction (or companion suggests based on language).
- Companion personality naturally aligns (Papillon → warrior, Étoile → zen).
- Mode switchable anytime in settings.

**13c. Adaptive discovery calendar:**
- Discovery calendar (AD-12e) is NOT linear/time-based.
- Triggers on user behavior:
  - User states a goal → immediate mission creation (no waiting).
  - User logs a crisis → immediate intervention suggestion.
  - User explores passively → gentle companion-led guidance.
- First concrete goal set within 2 minutes of first launch, regardless of profile.

**13d. Templates written by copywriters, not generated:**
- Pre-LLM-download templates are the FIRST IMPRESSION of the app.
- Must be high-quality, emotionally resonant, personality-accurate.
- Written by human copywriters, not AI-generated placeholders.
- Each companion has 50-100 templates covering all common interactions.

**13e. Model size optimization target:**
- Target smallest viable model: ~150-300MB if quality is acceptable.
- Test TinyLlama 1.1B, Gemma 2B Q2, Phi-3 mini Q3 for conversation quality.
- Every MB matters for mid-range Android users (64GB storage, 20Go data plans).

**13f. Therapist sharing in discovery calendar:**
- Companion asks early: "Tu travailles avec un professionnel ?"
- If yes: "Je peux préparer des rapports pour vos séances" → reveals PDF export.
- Feature discovery tied to user context, not arbitrary timeline.

---

## 11. Open Questions / Decisions Needed

1. **Branding:** "Transforme Ma Vie" confirmed ✅
2. **Companion Names:** Lumo, Papillon, Étoile, Sage, Aurore - finalize? ✅ **PROPOSED**
3. **MVP Companions:** Launch with 3 or all 5?
4. **Voice Actors:** Native device TTS confirmed — need to test quality per companion personality
5. **Companion Switching:** Allow freely or require premium?
6. **Conversation History:** How many days to keep in active RAG context?
7. **Music Licensing:** Commission original tracks or use royalty-free?
8. **World Interactivity:** How deep should environmental interactions go?
9. **Freemium limits:** Is 3 habits enough for free tier, or too restrictive?
10. **Community:** Build in-app or use Discord/forum?
11. **Therapist portal:** Build custom or integrate with existing platforms?
12. **Localization:** French-first, English later?

---

## 12. Next Steps

1. **Design:** Create wireframes/mockups (use Figma)
2. **Backend:** Set up Firebase project, define data models
3. **Dev Environment:** Initialize React Native project, configure CI/CD
4. **Core Features:** Build MVP (Phase 1) in sprints
5. **Beta Testing:** Recruit 50-100 beta users (Reddit, ProductHunt, personal network)
6. **Iterate:** 2-week feedback cycles
7. **Launch:** App Store + Google Play submission (target: 4 months)

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Owner:** Product Team  
**Status:** Draft → Requires Approval

## 13. Verification Summary: Your Ideas vs Spec

| Your Idea                              | In Scope?  | Location in Spec   | Notes                                  |
| -------------------------------------- | ---------- | ------------------ | -------------------------------------- |
| User accounts & login                  | ✅ YES     | Section 3.0        | Already planned, now enhanced          |
| Guidance on app usage                  | ✅ YES     | Section 3.0.1      | Enhanced with companion-led onboarding |
| Companion talks & expresses emotions   | ✅ YES     | Section 3.9        | 8 emotions, real-time expression       |
| Companion remembers previous exchanges | ✅ YES     | Section 3.9        | Short & long-term memory system        |
| Companion remembers user's story       | ✅ YES     | Section 3.9        | User profile, patterns, milestones     |
| Help guide through life day by day     | ✅ YES     | Section 3.9        | Daily check-ins, proactive guidance    |
| Smart insightful friendly questions    | ✅ YES     | Section 3.9        | 6 question types, context-aware timing |
| Smooth gameplay experience             | ✅ YES     | Section 5 (UX)     | Emphasized in design principles        |
| Nice fairy (Étoile)                    | ✅ YES     | Section 3.9        | One of 5 companions                    |
| Sunny butterfly (Papillon)             | ✅ YES     | Section 3.9        | One of 5 companions                    |
| Unique worlds per companion            | ✅ YES     | Section 3.10       | Themed environments                    |
| Visual style per companion             | ✅ YES     | Section 3.9 & 3.10 | Detailed in companion descriptions     |
| Musical tracks per companion           | ✅ YES     | Section 3.10       | 3-5 tracks each, unlockable            |
| Unique charting challenges             | ⚠️ PARTIAL | N/A                | Interpreted as habit tracking variety  |

**Everything is in scope!** Your vision aligns perfectly with the spec. 🎉

---

**Document Version:** 3.0
**Last Updated:** 2026-02-07
**Product Name:** Transforme Ma Vie ✅
**Status:** Updated with Architectural Design Decisions + Definitive Stack

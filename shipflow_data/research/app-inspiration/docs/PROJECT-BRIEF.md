# TMV App - Project Brief for BMAD Agents

## Project Overview

**Name**: TMV App (Tendances Mieux Vivre)
**Type**: Wellness Tracker with AI Companion
**Target Platform**: Mobile (iOS & Android) with potential Web admin
**Development Approach**: BMAD Method with specialized AI agents

## Vision Statement

Create a wellness tracking application featuring an AI-powered 3D companion (Tamagotchi-style) that learns from user behavior over time and provides personalized guidance for better health habits.

## Core Features

### 1. Wellness Tracking
- **Sleep Monitoring**: Duration, quality, patterns
- **Mood Tracking**: Daily emotional state with context
- **Meal Logging**: Food intake timing and type
- **Activity Tracking**: Exercise and movement data
- **Habit Formation**: Streak tracking and reinforcement

### 2. AI Companion (The "Animal")
- **Kawaii Character**: Animé localement via Rive (state machines par émotion)
- **Conversational AI**: Voice-to-voice interaction via Gemini Flash
- **Personality Memory**: Vector search-based RAG system (Convex)
- **Emotional Responses**: Animations Rive déclenchées par le contexte de conversation
- **Proactive Guidance**: Suggestions basées sur les patterns de l'utilisateur

### 3. Analytics & Insights
- **Pattern Recognition**: Identify trends in user behavior
- **Predictive Analytics**: Warn about potential issues (burnout, irregular sleep)
- **Visual Progress**: Charts and graphs showing improvement
- **Personalized Recommendations**: Context-aware suggestions

### 4. Gamification
- **XP System**: Gain experience for maintaining habits
- **Skill Trees**: Different health areas to level up
- **Achievements**: Unlock rewards for milestones
- **Progress Visualization**: RPG-style character growth

## Technical Stack

### Frontend Architecture
```
React Native (Expo)
├── Rive (companion animations via state machines)
├── Reanimated (UI animations)
└── Expo AV (audio recording)
```

### Backend Architecture
```
Convex (Backend as a Service)
├── Mutations (write operations)
├── Queries (read operations)
├── Actions (external API calls)
├── Vector Search (AI memory)
└── File Storage (3D assets)
```

### Authentication & Payments
- **Clerk**: User authentication and profiles
- **Polar**: Subscription management and payments

### AI Stack (100% on-device, zero API cost)
```
AI Pipeline
├── STT: Native iOS/Android (Speech Framework / SpeechRecognizer) — free
├── LLM: llama.cpp on-device (Gemma 2B / Llama 3.2 3B via llama.rn) — free
├── TTS: Native iOS/Android (AVSpeech / TextToSpeech) — free
└── RAG: Convex Vector Search (mémoire long-terme du companion)
```

## Data Models

### User Profile
```typescript
{
  userId: string,
  name: string,
  createdAt: number,
  settings: {
    notifications: boolean,
    voiceEnabled: boolean,
    companionPersonality: string
  }
}
```

### Wellness Logs
```typescript
// Sleep Log
{
  userId: string,
  date: string,
  startTime: number,
  endTime: number,
  duration: number,
  quality: 1-5
}

// Mood Log
{
  userId: string,
  timestamp: number,
  mood: string,
  score: 1-10,
  notes?: string,
  activities?: string[]
}

// Meal Log
{
  userId: string,
  timestamp: number,
  mealType: "breakfast" | "lunch" | "dinner" | "snack",
  description?: string
}
```

### AI Conversation
```typescript
{
  userId: string,
  timestamp: number,
  userMessage: string,
  aiResponse: string,
  embedding: number[], // For vector search
  context: {
    mood?: string,
    recentActivity?: string
  }
}
```

### Pre-calculated Features
```typescript
{
  userId: string,
  lastUpdated: number,
  sleepRegularityScore: 0-100,
  optimalBedtime: "HH:MM",
  burnoutRisk: "low" | "medium" | "high",
  moodTrend: {
    week: number[],
    trend: "improving" | "stable" | "declining"
  },
  personalityProfile: string // Summary for AI
}
```

## Architecture Principles

### 1. Local Body, Local Brain
- **Rationale**: Maximize privacy, eliminate API costs, minimize latency
- **Implementation**:
  - 3D/2D character renders locally on device
  - Companion LLM runs locally on device via llama.cpp (GGUF models, 1-4GB)
  - Cloud (Convex) used only for data persistence, pattern aggregation, and cross-device sync
  - Audio uses native device STT/TTS (free, no API)

### 2. Asynchronous Analytics
- **Rationale**: Complex calculations shouldn't block user interactions
- **Implementation**:
  - Scheduled Convex mutations run nightly
  - Pre-calculate insights and store in `features_precalculees`
  - Real-time queries only read cached results

### 3. Context-Preserved Development
- **Rationale**: Maintain alignment across development lifecycle
- **Implementation**:
  - Use BMAD workflows for all major features
  - Document decisions in markdown files
  - Agents reference previous context via project files

### 4. TypeScript Everywhere
- **Rationale**: Maximum de cohérence frontend/backend, pas de context switch
- **Implementation**:
  - TypeScript pour le frontend React Native
  - TypeScript pour toutes les fonctions Convex (backend)
  - Types Convex auto-générés partagés avec le frontend

## Development Phases

### Phase 1: Foundation (MVP)
1. **Setup Project Structure**
   - `npx create-expo-app tmv-app` + configuration TypeScript
   - Configurer Convex backend
   - Intégrer Clerk Expo SDK

2. **Basic Data Models**
   - Create Convex schema
   - Implement CRUD operations
   - Test data persistence

3. **Simple UI**
   - Basic wellness logging screens
   - Manual data entry forms
   - Progress visualization

### Phase 2: AI Integration
1. **Convex AI Actions**
   - Connect to Gemini API
   - Implement conversation flow
   - Store conversation history

2. **Vector Memory**
   - Set up Convex vector search
   - Create embeddings for conversations
   - Implement RAG queries

3. **Voice Interface**
   - Integrate Whisper STT
   - Add OpenAI TTS
   - Handle audio streaming

### Phase 3: Companion Rive
1. **Character Setup**
   - Créer/acquérir le personnage kawaii dans Rive Editor
   - Exporter le `.riv` et l'intégrer avec le package Flutter `rive`
   - Configurer les state machines (idle, happy, sad, talking...)

2. **Animation System**
   - State machines déclenchées par l'état de conversation
   - Transitions fluides entre émotions
   - Sync avec le flux audio TTS (bouche qui bouge)

3. **Real-time Sync**
   - Connecter les états Rive à la réponse Gemini
   - Déclencher les animations à la réception du TTS
   - Gérer les états de chargement et erreur

### Phase 4: Analytics & Gamification
1. **Analytics Pipeline**
   - Scheduled calculations
   - Pattern recognition algorithms
   - Insight generation

2. **Gamification Layer**
   - XP and leveling system
   - Achievement tracking
   - Visual progress indicators

### Phase 5: Polish & Launch
1. **Performance Optimization**
2. **Payment Integration** (Polar)
3. **App Store Submission**
4. **Marketing Materials**

## BMAD Workflow Recommendations

### For Each Phase
```
*workflow-init          # Initialize and analyze current state
*workflow-greenfield    # If starting from scratch
*workflow-feature-dev   # For each new feature
*workflow-debug-fix     # When issues arise
*workflow-refactor      # For code improvements
```

### Agent Assignments
- **Analyst**: Define success metrics for each phase
- **PM**: Create detailed user stories and acceptance criteria
- **Architect**: Design data flow and component structure
- **Developer**: Implement features following specs
- **QA**: Write and execute tests
- **UX Designer**: Design user flows and interfaces

## Success Metrics

### User Engagement
- Daily active users (DAU)
- Average session length
- Conversation frequency with AI companion
- Logging consistency (% of days with entries)

### Technical Performance
- App load time < 2s
- AI response latency < 1s
- 3D rendering at 60fps
- Backend query time < 100ms

### Business Metrics
- User acquisition rate
- Conversion to paid subscriptions
- Monthly recurring revenue (MRR)
- Customer lifetime value (LTV)

## Constraints & Considerations

### Technical Constraints
- Mobile device performance (3D rendering)
- API rate limits (Gemini, OpenAI)
- Storage costs (Convex, vector embeddings)
- Battery consumption (background tracking)

### Compliance
- GDPR (European users)
- HIPAA considerations (health data)
- App Store guidelines
- Privacy policies

### Cost Management
- Target: €0.50-€1.00 per monthly active user
- Primary cost: OpenAI TTS
- Strategy: Offer free tier with limitations
- Premium: Unlimited voice interactions

## References

- **Technical Specs**: `docs/Tmv specs.md`
- **Stack Analysis**: `shipflow_data/technical/app/` or `shipflow_data/technical/site/` depending on the target surface
- **Inspiration**: `shipflow_data/business/business.md` plus the relevant surface docs in `shipflow_data/technical/app/` or `shipflow_data/technical/site/`
- **BMAD Documentation**: `_bmad/` directory

## Next Steps for Agents

1. **PM Agent**: Review this brief and create epic-level user stories
2. **Architect Agent**: Design detailed system architecture diagrams
3. **Developer Agent**: Set up initial project structure
4. **UX Agent**: Create wireframes for core screens

Start with: `*workflow-init` in your AI coding assistant!

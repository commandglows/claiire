---
artifact: technical_context
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: "claiire"
created: "2026-08-11"
updated: "2026-08-11"
status: draft
source_skill: 300-sg-docs
scope: "app mobile Ma situation state and questionnaire"
owner: Diane
confidence: high
risk_level: high
security_impact: yes
docs_impact: yes
linked_systems:
  - "app/features/situation/"
  - "app/app/modal/situation.tsx"
  - "app/app/modal/situation-questionnaire.tsx"
  - "app/app/modal/situation-help.tsx"
  - "shipglows_data/product/shared/subjected-person-situation-questionnaire.md"
  - "shipglows_data/product/shared/subjected-person-profile-matrix.md"
  - "shipglows_data/workflow/specs/claiire-coach-operating-model.md"
depends_on:
  - artifact: "shipglows_data/technical/app/decisions/mobile-runtime-expo.md"
    artifact_version: "1.0.0"
    required_status: active
supersedes: []
evidence:
  - "Implemented app routes and isolated situation feature reviewed from the local worktree on 2026-08-11."
  - "Operator decision 2026-08-11: expose an evolving Ma situation state with one score per dimension and an explicit update action."
  - "Operator decision 2026-08-11: keep pairing in backlog and implement the solo questionnaire first."
next_review: "2026-09-11"
next_step: "Run focused TypeScript, scoring, navigation, persistence and privacy proof before production use."
---

# Ma situation: state and questionnaire

## Purpose

`Ma situation` gives a person a private, evolving view of what they report about a relationship. It adapts the solo app journey without diagnosing the person, predicting danger, revealing another person's intentions, or enabling pairing.

Current implementation status: `implemented, not yet verified`.

## Owned Files

- `app/features/situation/types.ts`: state, dimension, answer, candidate and update-flow contracts.
- `app/features/situation/questionnaire.ts`: questions, dimension labels, critical values and targeted update routes.
- `app/features/situation/scoring.ts`: pure dimension calculation and candidate comparison.
- `app/features/situation/storage.ts`: versioned Expo SecureStore persistence.
- `app/features/situation/store.ts`: Zustand session state, drafts, candidate construction and confirmation boundary.
- `app/app/modal/situation.tsx`: situation dashboard and update entrypoint.
- `app/app/modal/situation-questionnaire.tsx`: initial and targeted questionnaire flows.
- `app/app/modal/situation-help.tsx`: neutral France-specific human-help surface.

## Entrypoints

- Profile section: `Ma situation` opens the private dashboard.
- First use: `Commencer le questionnaire` starts the initial flow.
- Existing state: `Mettre à jour ma situation` starts a targeted recheck.
- Safety interruption: the questionnaire exits to a neutral route or opens the dedicated resources surface.

## State Contract

The state has no aggregate score. It stores independent dimensions:

`SAF`, `CTL`, `REC`, `REL`, `CHG`, `CON`, `SUP`, `AGY`, `DIG`, `DEP`, `IMP`.

Each dimension keeps a score from `0` to `4` or `null`, confidence, assessment date, explicit user provenance and supporting question identifiers. `null` means unknown; it never means safe or zero.

The confirmed state also keeps:

- version and update timestamp;
- safe-context confirmation timestamp;
- `device`, `session` or `unknown` storage preference;
- confirmed answers;
- append-only critical event history;
- a forced `solo` interaction gate.

## Initial Flow

The initial flow starts with private-context confirmation, then covers relationship context, immediate safety, control, constraints, dependants, current impact, recognition, desire to preserve the relationship, available support, protective action and perceived agency.

The user may skip non-critical questions. Skipped and unknown answers do not become zero.

## Targeted Update Flow

An update starts with the private-context question, then asks what changed. The selected reasons produce a deduplicated subset of relevant questions instead of replaying the full questionnaire.

The flow builds a candidate state and a before/now comparison. The confirmed state is not mutated until the person explicitly confirms the candidate. A calmer current answer may change a current dimension but cannot delete critical history.

## Persistence And Mutation Invariants

- No answer is persisted before final confirmation.
- `device` stores the confirmed payload in versioned Expo SecureStore.
- `session` and `unknown` keep only the in-memory confirmed state and remove any prior SecureStore copy.
- Leaving or interrupting the questionnaire discards the draft, not the last confirmed state.
- Conversation output cannot mutate this state automatically.
- No score, response or interruption reason is sent to analytics, logs, crash reporting or Convex by this feature.
- Pairing never reads or receives this state in the current implementation.

## Safety Interruption

The flow stops before recording a new answer when the private context is not confirmed, immediate danger is reported, or a critical event is selected. It clears the draft and offers a neutral exit plus a dedicated human-help surface.

The France resource surface currently exposes official emergency, accessibility, listening and online-reporting routes. It warns that calls, messages and browser activity can leave device traces. Resource freshness must be checked before release and whenever official routing changes.

## Known Limits

- No automated test or runtime navigation proof has been run for this increment.
- The operating-system recent-app preview is not hidden because a dedicated native screen-capture/privacy capability is not installed.
- SecureStore capacity and behavior must be proven on supported Android and iOS versions with realistic payloads.
- The resources surface is France-specific; locale-aware routing is not implemented.
- The numeric labels personalize the app only; they are not validated clinical or danger-probability instruments.

## Validation

Before production use, prove at minimum:

- TypeScript compilation for the app package;
- pure scoring and candidate comparison behavior, including unknown and non-compensation rules;
- initial and targeted navigation, back behavior, Android hardware back and modal dismissal;
- interruption before persistence for private-context, immediate-danger and critical-event answers;
- draft removal after every exit path while preserving the previous confirmed state;
- device versus session persistence and removal of a previous device copy;
- append-only critical history across current-state improvement;
- unavailable telephone, SMS and web handlers;
- accessibility labels, touch targets and dynamic text behavior;
- absence of situation payloads in telemetry and backend mutations.

## Reader Checklist

- Is every state mutation behind explicit confirmation?
- Does unknown remain distinct from zero?
- Can any current answer erase a critical historical event?
- Can a sensitive screen or draft survive an exit path?
- Does any new integration expose the state outside the solo feature boundary?

## Maintenance Rule

Update this document whenever question routing, dimension semantics, persistence, safety interruption, resource routing, interaction gates or telemetry behavior changes. Bump the artifact version when the contract changes and preserve superseded safety decisions.

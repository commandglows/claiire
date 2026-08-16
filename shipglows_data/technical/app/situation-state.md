---
artifact: technical_context
metadata_schema_version: "1.0"
artifact_version: "0.3.0"
project: "claiire"
created: "2026-08-11"
updated: "2026-08-16"
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
  - "Storage hardening proof 2026-08-16: canonical legacy validation and explicit uncertain-commit handling pass focused restart tests; supported-device double-failure behavior remains unverified."
next_review: "2026-09-11"
next_step: "Repair the React Native Jest harness and complete supported-device SecureStore double-failure verification before release."
---

# Ma situation: state and questionnaire

## Purpose

`Ma situation` gives a person a private, evolving view of what they report about a relationship. It adapts the solo app journey without diagnosing the person, predicting danger, revealing another person's intentions, or enabling pairing.

Broad product-governance status remains `draft`. Runtime status is tracked separately: the original dimension slice and the needs-first V1 slice are implemented locally but not yet verified for release. Pure derivation, routing, migration, storage, state and local-only boundary tests pass; the React Native component harness and supported-device review remain open.

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

`SituationState` v2 has no aggregate score. It stores independent dimensions:

`SAF`, `CTL`, `REC`, `REL`, `CHG`, `CON`, `SUP`, `AGY`, `DIG`, `DEP`, `IMP`.

Each dimension keeps a score from `0` to `4` or `null`, confidence, assessment date, explicit user provenance and supporting question identifiers. `null` means unknown; it never means safe or zero.

The confirmed state also keeps:

- version and update timestamp;
- safe-context confirmation timestamp;
- `device`, `session` or `unknown` storage preference;
- confirmed answers;
- append-only critical event history;
- a forced `solo` interaction gate.
- a deterministic local `NeedProfileV1` derived from the same confirmed answer set;
- requested needs, priorities, selected next step, bounded practical preferences, a nullable explained orientation and zero to three explained aid categories;
- ignored stable category IDs, which remain restorable and never affect safety/help access.

Every category and orientation includes stable reason codes and contributing question IDs. Missing or skipped values remain unknown/empty. Dimensions support the explanation but never compensate critical evidence or masquerade as the person's stated need.

## Initial Flow

The initial flow starts with private-context confirmation, then covers relationship context, immediate safety, control, constraints, dependants, current impact, recognition, desire to preserve the relationship, available support, protective action and perceived agency.

The user may skip non-critical questions. Skipped and unknown answers do not become zero.

## Targeted Update Flow

An update starts with the private-context question, then asks what changed. The selected reasons produce a deduplicated subset of relevant questions instead of replaying the full questionnaire.

The flow builds a candidate state and a before/now comparison. The confirmed state is not mutated until the person explicitly confirms the candidate. A calmer current answer may change a current dimension but cannot delete critical history.

## Persistence And Mutation Invariants

- No answer is persisted before final confirmation.
- `device` stores the confirmed v2 payload and its `NeedProfileV1` together in versioned Expo SecureStore. A higher-priority previous-state snapshot, or an explicit empty marker, remains authoritative while the replacement is staged and verified.
- A legacy v1 payload is accepted only when its exact keys, answers, dimensions, timestamps, storage preference and critical-event history match the canonical v1 contract. Migration constructs a new v2 object in memory without spreading legacy fields. The v2 key is written only after the person reviews and confirms the candidate.
- A failed commit is never reported as success when both the authority deletion and its verification read fail. The adapter reports `SITUATION_STORAGE_COMMIT_UNCERTAIN`; the Zustand store retains its current in-memory situation and candidate and the UI states that durable restart authority is unknown.
- Expo SecureStore does not provide a multi-key transaction. Under that double failure, the old authority may still exist or the staged v2 may already be authoritative. The next successful load resolves the actual durable state; code cannot guarantee which one survived until supported-device storage is readable again.
- `session` and `unknown` keep only the in-memory confirmed state and remove the legacy, current-v2 and previous-authority SecureStore copies.
- Leaving or interrupting the questionnaire discards the draft, not the last confirmed state.
- Conversation output cannot mutate this state automatically.
- No score, response, need profile, reason, ignored category or interruption cause is sent to analytics, logs, crash reporting, notifications, prompts, support or Convex by this feature.
- Pairing never reads or receives this state in the current implementation.

## Safety Interruption

The flow stops before recording a new answer when the private context is not confirmed, immediate danger is reported, or a critical event is selected. It clears the draft and offers a neutral exit plus a dedicated human-help surface.

The France resource surface currently exposes official emergency, accessibility, listening and online-reporting routes. It warns that calls, messages and browser activity can leave device traces. Resource freshness must be checked before release and whenever official routing changes.

## Known Limits

- Focused pure/store/storage/routing/security tests pass, but the repository's React Native Jest project currently fails during harness initialization before component tests execute (`clearMocksOnScope` runtime incompatibility).
- No rendered or runtime navigation proof has been completed for the needs-first summary.
- The operating-system recent-app preview is not hidden because a dedicated native screen-capture/privacy capability is not installed.
- SecureStore capacity and behavior must be proven on supported Android and iOS versions with realistic payloads.
- The previous durable state cannot be guaranteed under the non-transactional double failure where an authority-key delete throws and the immediate verification read also throws. Focused mocks prove honest error reporting and both possible restart outcomes; supported-device proof is still required.
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
- both restart outcomes after an uncertain authority-key commit, including no false success and unchanged in-memory state;
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

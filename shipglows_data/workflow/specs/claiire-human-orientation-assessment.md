---
artifact: feature_spec
metadata_schema_version: "1.0"
artifact_version: "1.0.1"
project: "claiire"
created: "2026-08-16"
created_at: "2026-08-16 08:42:23 UTC"
updated: "2026-08-16"
updated_at: "2026-08-16 10:04:50 UTC"
status: ready
source_skill: 100-sg-spec
source_model: "GPT-5 Codex"
scope: "app Ma situation human-orientation needs assessment for people exposed to violence"
owner: Diane
confidence: high
user_story: "En tant que personne exposee a une violence relationnelle, je veux que Ma situation transforme mes reponses confirmees en besoins, contraintes et options d'aide compréhensibles et modifiables afin de choisir un prochain pas sur sans etre diagnostiquee, notee ou mise en relation a mon insu."
risk_level: high
security_impact: yes
docs_impact: yes
linked_systems:
  - "app/features/situation/"
  - "app/app/modal/situation.tsx"
  - "app/app/modal/situation-questionnaire.tsx"
  - "app/app/modal/situation-help.tsx"
  - "app/constants/AppDesignTokens.ts"
  - "app/components/AppIcon.tsx"
  - "shipglows_data/product/shared/coach-operating-model.md"
  - "shipglows_data/product/shared/subjected-person-profile-matrix.md"
  - "shipglows_data/product/shared/subjected-person-situation-questionnaire.md"
  - "shipglows_data/technical/app/situation-state.md"
  - "shipglows_data/technical/app/guidelines.md"
  - "shipglows_data/technical/design-system-authority.md"
  - "shipglows_data/workflow/specs/claiire-coach-operating-model.md"
depends_on:
  - artifact: "shipglows_data/workflow/specs/claiire-coach-operating-model.md"
    artifact_version: "0.5.0"
    required_status: draft
  - artifact: "shipglows_data/product/shared/coach-operating-model.md"
    artifact_version: "1.1.0"
    required_status: reviewed
  - artifact: "shipglows_data/product/shared/subjected-person-profile-matrix.md"
    artifact_version: "0.2.0"
    required_status: draft
  - artifact: "shipglows_data/product/shared/subjected-person-situation-questionnaire.md"
    artifact_version: "0.1.0"
    required_status: draft
  - artifact: "shipglows_data/technical/app/decisions/mobile-runtime-expo.md"
    artifact_version: "1.0.0"
    required_status: active
supersedes: []
evidence:
  - "Operator approval 2026-08-16: improve the current needs-discovery system for the existing subjected-person Ma situation journey."
  - "Operator-approved V1 scope: local-only NeedProfile v1, missing P5/P6/I3 and practical preferences, explained editable categories, with safety interruptions preserved."
  - "Current app evidence 2026-08-16: app/features/situation/questionnaire.ts implements the initial score-oriented question set but omits I3, P5 and P6."
  - "Current app evidence 2026-08-16: app/features/situation/types.ts and scoring.ts expose SituationState v1 with dimensions and raw answers but no explicit need profile."
  - "Current app evidence 2026-08-16: app/app/modal/situation.tsx renders score cards rather than an editable needs summary."
next_review: "2026-09-16"
next_step: "Run the jest-expo 56 / Jest 29 compatibility pass, rerun the three blocked RN suites, then complete local proof"
---

# Claiire — découverte des besoins et orientation humaine V1

## Status

Ready for bounded sequential implementation. This status means that the product, safety, data, execution and proof contracts below are decision-complete; it does not claim implementation, clinical validity, production verification or release readiness.

The general `claiire-coach-operating-model` spec remains an explicit draft dependency. Implementation documentation must align its current mismatch between draft governance wording and appended “implemented, not yet verified” runtime wording: the broad operating model stays `draft`; only the already-built `Ma situation` slice may be described as implemented but unverified. The operator-approved V1 decision supersedes the older draft documents' generic “specialist review before implementation” next step only for this bounded, local, non-clinical increment; specialist, lived-experience, legal and threat review remain mandatory before production verification or release.

## User Story

En tant que personne exposée à une violence relationnelle, je veux que `Ma situation` transforme mes réponses confirmées en besoins, contraintes et options d’aide compréhensibles et modifiables afin de choisir un prochain pas sûr sans être diagnostiquée, notée ou mise en relation à mon insu.

## Minimal Behavior Contract

When a person in the existing subjected-person `Ma situation` flow answers or updates the assessment, Claiire asks the missing need and preference questions, derives a versioned local `NeedProfileV1` only from answers the person confirms, and shows “Ce que j’ai compris”, “Ce qui compte maintenant” and zero to three explained aid categories according to explicit evidence. The person can correct source answers, ignore a category, erase the state or leave discreetly. If privacy, immediate-danger or critical-event input triggers an existing safety interruption, ordinary assessment stops before the new answer or profile is persisted and the previous confirmed state remains intact. Missing, skipped or inconsistent inputs stay unknown and never become a diagnosis, global score, hidden ranking or reassuring default.

## Success Behavior

- The existing `Ma situation` entry and update paths remain the single discovery experience for people exposed to violence.
- `I3`, `P5` and `P6` are implemented with language, accessibility, broad territory, cost, availability, preferred support type and safe-contact preferences.
- A `NeedProfileV1` is derived locally and deterministically from the final confirmed answer set, not from conversation inference, backend data or telemetry.
- The profile distinguishes requested needs, priorities, practical constraints, preferences, a nullable explained orientation level (`urgent`, `specialized`, `nonUrgent`) and zero to three aid categories.
- Every orientation level and category exposes plain-language reasons and the confirmed question IDs that support it.
- The summary is more useful than score cards alone and lets the person edit, ignore or erase without shame or loss framing.
- Safety resources remain reachable before completion, with storage refused, with all optional questions skipped and after an interruption.
- The result remains solo-only and never names or contacts a professional.

## Error Behavior

The implementation is invalid if it:

- persists an interrupted safety answer, a questionnaire draft or an unconfirmed `NeedProfileV1`
- turns unknown, skipped, empty or malformed values into zero, “no need” or `nonUrgent`
- averages safety and protective factors, creates a global score or hides a critical signal behind lower-priority needs
- claims diagnosis, treatment, clinical triage, legal qualification, prediction, professional suitability or emergency response
- sends situation answers, profile fields, reason codes, category choices, dismissals or interruption causes to Convex, analytics, crash reporting, logs, support tooling or prompt telemetry
- introduces professional matching, ranking, booking, contact, referral transmission or journal sharing
- applies XP, streaks, badges, scarcity, commercial prompts, congratulatory spectacle, guilt or reminders to this sensitive flow
- reveals sensitive content before privacy is reconfirmed or through notifications, deep links, recent-screen recovery copy or another journey
- destroys the last confirmed profile when a save, migration, delete or session-only transition fails
- labels the broad coach operating model “active” or “ready” while its governed status remains `draft`

## Problem

The current Expo flow stores separate situation dimensions and renders numeric score cards. Its canonical questionnaire already defines `I3` (rapid health/psychological help), `P5` (current priorities) and `P6` (small safe next step), but the runtime questionnaire omits them. It also does not collect the practical preferences needed to explain useful categories of human help.

As a result, `Ma situation` can describe risk, control, constraints and agency but cannot yet answer the person’s more actionable question: “What do I need now, under what constraints, and which kinds of help could fit?” The current generic `scoreMeaning()` output is not sufficiently specific, and the legacy guideline “Tout est un jeu” conflicts with the safety contract that already suspends gamification for sensitive and dangerous flows.

## Solution

Extend the current flow and state model rather than adding a parallel assessment. Introduce a pure local derivation layer that builds a `NeedProfileV1` from the complete candidate answer set at the existing final-review boundary. Persist the profile in the same versioned payload as the confirmed situation state, behind a staged previous-authority protocol, and render a needs-first summary alongside, not as a clinical interpretation of, the existing dimensions.

### Governed `NeedProfileV1`

```text
NeedProfileV1
  version: 1
  derivedAt
  sourceSituationVersion
  sourceQuestionIds[]
  requestedNeeds[]
  userPriorities[]
  selectedNextStep: value | none | unknown
  preferredSupportTypes[]
  preferences
    languagePreferences[]
    accessibilityNeeds[]
    territory: country | broad-region | remote-only | unknown
    cost: free-only | capped | flexible | unknown
    availability: immediate | within-days | flexible | unknown
    modalities[]
    safeContactChannels[]
    safeContactWindows[]
  orientation: null | {
    level: urgent | specialized | nonUrgent
    reasonCodes[]
    evidenceQuestionIds[]
  }
  categories[0..3]
    id
    label
    explanation
    reasonCodes[]
    evidenceQuestionIds[]
  ignoredCategoryIds[]
```

`territory` is deliberately coarse and selected from governed tokens: no GPS, address-book access or precise location. `safeContactChannels` records a preference for future use only; V1 does not send, schedule or initiate contact. A nullable `orientation` is required when confirmed evidence is insufficient. An immediate or critical unconfirmed answer uses the pre-existing interruption path and does not manufacture or persist an `urgent` profile.

### Exact V1 question and branch contract

All values below are stable persisted identifiers. Every question except `A1` remains skippable. Multi-select questions reject mutually exclusive combinations with `none-now`, `none`, `unknown` or `skip`; selecting one of those values clears the other choices. No answer contains an address, contact identifier, precise location or arbitrary safety narrative.

| ID | Persisted values | Shape and purpose |
| --- | --- | --- |
| `I3` | `no`, `maybe`, `yes`, `without-waiting`, `unknown` | Single choice: desired health or psychological help timing; this is a stated preference, not clinical triage. |
| `P5` | `understand`, `reduce-risk-stay`, `regain-autonomy`, `communicate-if-safe`, `protect-dependant`, `prepare-distance`, `prepare-separation`, `after-separation`, `find-human-help`, `unknown` | Multi-select current priorities; `unknown` is exclusive. |
| `P6` | `none-now`, `observe-understand`, `open-help-options`, `talk-trusted-person`, `prepare-small-safety-step`, `seek-health-help`, `seek-rights-info`, `seek-practical-help`, `prepare-distance`, `prepare-separation`, `unknown` | Single choice next step. V1 deliberately uses no free text. |
| `N1` | `violence-specialist`, `health-psychological`, `legal-rights`, `social-practical`, `dependant-support`, `trusted-person`, `self-understanding`, `none-now`, `unknown` | Multi-select kinds of support the person wants to see; `none-now` and `unknown` are exclusive. |
| `N2` | `french`, `another-language`, `interpreter-help`, `no-preference`, `unknown` | Multi-select language preference without claiming translated content or collecting free text. |
| `N3` | `easy-read`, `screen-reader`, `hearing`, `vision`, `mobility`, `attention-memory`, `communication`, `none`, `skip` | Multi-select accessibility preference; `none` and `skip` are exclusive. |
| `N4` | `metropolitan-france`, `overseas-france`, `europe-outside-france`, `outside-europe`, `remote-only`, `unknown` | Single coarse territory; never resolve or request device location. |
| `N5` | `free-only`, `capped`, `flexible`, `unknown` | Single cost constraint. `capped` records only the constraint, not an amount. |
| `N6` | `without-waiting`, `within-days`, `flexible`, `unknown` | Single availability preference, distinct from a safety or clinical urgency finding. |
| `N7` | `phone`, `text-chat`, `video`, `in-person`, `written-information`, `no-preference`, `unknown` | Multi-select modality preference; `no-preference` and `unknown` are exclusive. |
| `N8` | `in-app-only`, `phone-call`, `text-message`, `email`, `morning`, `afternoon`, `evening`, `no-safe-channel`, `unknown` | Multi-select hypothetical discretion preference. Channel and time tokens populate their respective arrays; V1 never asks for coordinates or initiates contact. |

Initial order preserves the existing registry, inserts `I3` immediately after `I2`, inserts `P5` and `P6` after `P4`, then asks `N1`. `N2..N8` appear only when `N1` contains a human-support category, `P5` contains `find-human-help`, or `I3` is `maybe`, `yes` or `without-waiting`. If this branch condition is false or its source is skipped, the person proceeds directly to review and omitted fields remain unknown/empty. Skipping any branch question never prevents review, resources or erase.

Targeted-update routing is additive to the existing routes: `event` and `worsened` add `I3`; `constraints` adds `P5`, `P6`, `N3..N7`; `support` adds `I3`, `P5`, `N1..N8`; `understanding` adds `P5`, `P6`, `N1`; `intention` adds `I3`, `P5`, `P6`, `N1..N8`; `review-all` uses the full initial order and branch rule. The privacy gate `A1` remains first in every update. A branch must never make `N2..N8` appear before the update's applicable `S1`/`S3` checks.

### Deterministic orientation contract

- `urgent`: only when already-confirmed non-compensable evidence requires immediate safety or health priority. A new immediate-danger answer still interrupts before persistence and uses the safety-help surface directly.
- `specialized`: when confirmed answers indicate violence-specialist, health/psychological, legal, social, accessibility or dependant-support needs without a current interruption.
- `nonUrgent`: only when confirmed answers support a bounded useful category and no urgent or specialized rule applies.
- `null`: evidence is incomplete, skipped or contradictory. The UI says that Claiire needs no more information for the person to access resources; it never says that no need exists.

The rule table lives in a pure, inspectable module. Safety overrides run before category ordering. Protective dimensions (`SUP`, `AGY`) never reduce the orientation level. Category selection may use stable explicit precedence, but no hidden weighted rank or machine-learning inference.

### Exact category and orientation decision table

The derivation starts with an empty candidate set and may add a category only through the explicit mappings below. Practical preferences `N2..N8` annotate reasons and constraints; they never create a category, change its safety meaning or imply provider availability.

| Confirmed source value | Category candidates added |
| --- | --- |
| `I3=maybe|yes|without-waiting` | `health-psychological` |
| `P5=understand` | `self-understanding` |
| `P5=reduce-risk-stay|communicate-if-safe|prepare-distance|prepare-separation|after-separation|find-human-help` | `violence-specialist` |
| `P5=regain-autonomy` | `social-practical` |
| `P5=protect-dependant` | `dependant-support`, then `violence-specialist` |
| `P6=observe-understand` | `self-understanding` |
| `P6=open-help-options` | `violence-specialist` |
| `P6=talk-trusted-person` | `trusted-person` |
| `P6=prepare-small-safety-step|prepare-distance|prepare-separation` | `violence-specialist` |
| `P6=seek-health-help` | `health-psychological` |
| `P6=seek-rights-info` | `legal-rights` |
| `P6=seek-practical-help` | `social-practical` |
| each non-exclusive `N1` value | category with the identical stable ID |

Deduplicate by category ID, then order strictly as `immediate-safety`, `health-psychological`, `dependant-support`, `violence-specialist`, `legal-rights`, `social-practical`, `trusted-person`, `self-understanding`; retain the first three. `immediate-safety` is inserted first only for critical evidence already present in the previously confirmed state/history. A newly selected `S1=maybe|yes` or critical `S3` value still interrupts and is never added to a candidate. `none-now`, `unknown`, skipped, malformed and contradictory-exclusive values add nothing.

Orientation is derived after category selection: `urgent` only for `I3=without-waiting` or previously confirmed non-compensable immediate/critical evidence; otherwise `specialized` when at least one retained category is `health-psychological`, `dependant-support`, `violence-specialist`, `legal-rights` or `social-practical`; otherwise `nonUrgent` when at least one retained category is `trusted-person` or `self-understanding`; otherwise `null`. The UI labels these as user-controlled orientation levels, never as a danger, medical or legal assessment. Each category and orientation reason uses the exact contributing question IDs; previously confirmed critical history uses its stored `sourceQuestionId`.

### Before → after

| Before | After |
| --- | --- |
| Numeric dimension cards dominate the result. | Needs-first summary leads with confirmed facts, priorities and explained categories; dimensions remain available as supporting detail. |
| Runtime stops at `P4`. | Runtime adds `I3`, `P5`, `P6` and bounded practical preferences. |
| `SituationState` contains raw answers and dimensions only. | Migrated local state contains `NeedProfileV1`, derived deterministically from confirmed answers and persisted in the same versioned payload. |
| Generic `scoreMeaning()` labels drive interpretation. | Each category has plain-language reason codes and source-question links. |
| Legacy “Tout est un jeu” wording can be read as universal. | Sensitive discovery, safety, help and erasure explicitly override XP, streak, badge, retention and celebration rules. |
| Documentation mixes a draft broad spec with implemented-slice wording. | Governance and runtime status are stated separately and consistently. |

## Scope In

- Existing Expo `Ma situation` initial and targeted-update paths for the person exposed to violence.
- `I3`, `P5`, `P6` and questions for preferred support type, language, accessibility, broad territory, cost, availability, modality and safe contact.
- Versioned `NeedProfileV1`, pure deterministic derivation, reason codes, category ordering and local state migration.
- Zero-to-three explained aid categories using the exact governed IDs and precedence table in this spec.
- Needs-first editable summary, source-question correction, category ignore, full erase and discreet exit.
- Existing safety interruptions, help route, solo interaction gate, session-only option and SecureStore boundary.
- Unit, store, storage, UI, accessibility, no-network and no-telemetry proof.
- Coherence updates to current product, technical and broad coach-spec wording during implementation.

## Scope Out

- Person-exercising-violence journey, supporter path or any shared/couple state.
- General onboarding, authentication, account creation or homepage entry routing.
- Professional directory, individual professional recommendation, matching, ranking, booking, availability lookup, contact, referral transmission or payment.
- Backend, Convex schema/function, API, cloud sync, analytics, telemetry, remote configuration, AI/LLM inference or push notification changes.
- Diagnosis, treatment, validated clinical triage, legal classification or replacement of emergency services.
- Automatic journal/conversation sharing, generated handoff summary or export to a professional.
- Locale-by-locale emergency-resource redesign; the current France help surface is preserved.
- Final copy localization beyond French source strings and the collected language preference.
- A new visual system, new dependency, device permission or general app gamification redesign.

## Constraints

- All new state and derivation stay inside `app/features/situation/` and existing local storage boundaries.
- No draft answer is durable; only the final reviewed candidate may replace confirmed state.
- The app must work with all optional preference questions skipped.
- Question copy remains factual, non-clinical, non-directive and understandable without violence labels.
- At most three categories appear at once; “Aucune maintenant” and correction remain valid choices.
- No exact address, device location, contact identifier or free-text safety detail is required.
- Safe-contact channel and time preferences use only the bounded `N8` tokens; V1 persists no contact coordinate or free text.
- No new package is authorized. Expo, React Native, Zustand, Jest and SecureStore remain the implementation stack.
- Android device proof is not currently available locally; automated and rendered review precede required manual proof on a real or hosted supported device.

## Test Contract

- Surface/profile: Expo React Native app; high-risk, local-only, solo subjected-person flow.
- Automated proof order:
  1. Pure `NeedProfileV1` derivation and safety-precedence tests.
  2. State migration, confirmation, session-only, erase and failure-recovery tests.
  3. Questionnaire routing and targeted-update tests.
  4. React Native summary, correction, ignore, accessibility and discreet-exit tests.
  5. Static/import-boundary proof for no Convex, analytics, tracking, notification or network dependency.
  6. TypeScript compile and complete app Jest suite.
- Manual proof order: screen-reader labels and focus order, dynamic text, Android hardware back, iOS/modal dismissal, recent-app recovery, interrupted save/delete and real-device SecureStore behavior.
- Required scenarios: AC-01 through AC-22 below.
- Exception with proof: physical-device visual/privacy proof may remain pending during implementation only because the current workstation has no ready Android device and no accelerated emulator; it is mandatory before final verification or release.
- Exception without proof: none.

## Dependencies

- Product authority: `shipglows_data/product/shared/coach-operating-model.md`.
- Needs/profile authority to update coherently: `shipglows_data/product/shared/subjected-person-profile-matrix.md` and `shipglows_data/product/shared/subjected-person-situation-questionnaire.md`.
- Broad lifecycle dependency: `shipglows_data/workflow/specs/claiire-coach-operating-model.md`, retaining governed `draft` status until its own readiness review.
- Runtime and storage evidence: `shipglows_data/technical/app/situation-state.md`, `app/features/situation/types.ts`, `scoring.ts`, `store.ts`, `storage.ts` and `questionnaire.ts`.
- UI routes: `app/app/modal/situation.tsx`, `situation-questionnaire.tsx` and `situation-help.tsx`.
- Mobile architecture: `shipglows_data/technical/app/decisions/mobile-runtime-expo.md`.
- UI authority: `app/constants/AppDesignTokens.ts` for app visual values and `app/components/AppIcon.tsx` plus `shipglows_data/technical/design-system-authority.md` for icon semantics.
- No external provider, backend, account, professional-data or current web research dependency is introduced.

## Invariants

- One app, two strictly separated violence journeys; this V1 changes only the subjected-person journey.
- Safety interruption precedes persistence, gamification, commercial behavior and ordinary assessment.
- Unknown is not zero; missing evidence is not reassurance.
- No global score, compensating average or prediction of another person’s intentions.
- Only explicitly confirmed answers and category-ignore choices produce durable profile state.
- The last confirmed state survives abandoned, interrupted or failed updates.
- Critical-event history is append-only under confirmed migrations and cannot be cleared by a calmer answer.
- `interactionGate` remains `solo`.
- Local-only means no situation or needs payload crosses into Convex, analytics, telemetry, logs, crash reporting, prompts or support.
- Critical help remains free and available without assessment completion or data retention.
- The person may correct, ignore, erase or leave without penalty, celebration loss or pressure.
- Claiire explains categories; it does not select a professional or initiate contact.
- Public claims cannot say that Claiire assesses, diagnoses, matches or books human help.

## Links & Consequences

- Upstream decisions: the reviewed coach operating model, draft profile matrix and draft progressive-questionnaire contract constrain wording, safety, data and non-compensation behavior.
- Runtime consumers: situation types, question registry, pure derivation/scoring, Zustand store, SecureStore adapter and three existing modal routes.
- Downstream future work: a qualified-help directory or safe human handoff may consume the confirmed preferences only through a separate approved spec. This V1 creates no provider boundary.
- Documentation consumers: app technical README/guidelines, situation-state contract, profile matrix, questionnaire contract and broad coach spec must describe the same state version, question IDs, sensitive-flow gamification exception and status semantics.
- Public-site consequence: none in V1. Any later public claim about assessment or matching needs separate implemented proof before publication.
- Analytics consequence: intentionally none; usage measurement for this sensitive flow is out of scope and prohibited.
- Revalidation: any future backend, synchronization, notification, professional-data or author-journey use invalidates the local-only threat boundary and requires a new security/data decision.

## Documentation Coherence

Implementation includes these documentation mutations because they resolve current in-scope contradictions rather than expand product scope:

- Update `shipglows_data/product/shared/subjected-person-situation-questionnaire.md` with the final question IDs, `NeedProfileV1`, orientation/category rules and needs-first restitution.
- Update `shipglows_data/product/shared/subjected-person-profile-matrix.md` so profile dimensions remain supporting signals and do not masquerade as the needs result.
- Update `shipglows_data/technical/app/situation-state.md` with state migration, local-only interface, confirmation boundary and implemented/verified status evidence.
- Update `shipglows_data/technical/app/guidelines.md` so `Ma situation`, safety interruption, help orientation and erasure are explicit exceptions to “Tout est un jeu”, XP, streaks, badges, combat metaphors and retention prompts.
- Update the Status and implementation-note wording in `shipglows_data/workflow/specs/claiire-coach-operating-model.md` without changing its governed `draft` status: distinguish broad-spec status from runtime-slice status and retain it as this spec’s dependency.
- Update `shipglows_data/technical/app/README.md` only if the state/version or named feature entry changes.
- `fresh-docs not needed`: this spec formalizes operator-approved behavior and current local product contracts; no new external clinical, legal, provider or public claim is introduced.

## Edge Cases

- All need/preference questions are skipped: preserve `orientation=null`, show no reassuring conclusion, keep help accessible.
- Exactly one confirmed priority exists: produce no more than the smallest useful category set.
- Multiple priorities conflict: safety precedence wins; otherwise show at most three independently explained categories without pretending to optimize the person.
- `P6=none-now`: retain it as an autonomous valid choice, not low motivation or failure.
- An `N8` payload contains an unknown token or an exclusive value combined with another choice: reject or normalize it before candidate construction and preserve the previous confirmed value until reconfirmation.
- Language, accessibility or territory changes in a targeted update: recompute categories after confirmation without replaying unrelated sensitive questions.
- `I3=without-waiting` occurs without immediate-danger input: route to an explained health/human-help category; do not diagnose or contact anyone.
- A new immediate-danger or critical-event input appears during preferences: discard the whole draft and candidate, preserve the prior confirmed profile, open the existing interruption choice.
- A calmer update follows prior critical history: current categories may change, but critical history and safety precedence remain visible to the derivation layer.
- SecureStore contains valid legacy state v1: migrate in memory, show a review boundary before saving v2, and never fabricate preference answers.
- SecureStore contains malformed/unknown-version data: fail closed to a neutral recoverable screen, expose erase/restart, and never render raw payload text.
- SecureStore write fails: show a non-sensitive retry/session-only/leave choice and retain the in-memory confirmed state. Durable previous authority remains guaranteed when it can be verified; if authority deletion and its verification read both fail, report an uncertain commit without claiming which version a restart will load.
- SecureStore delete fails: do not claim deletion; show a non-sensitive retry message.
- Rapid repeated confirm taps: one atomic confirmation result; no duplicated history or diverging candidate.
- Back, modal dismiss or app termination during review: discard the candidate on next safe entry and preserve the prior confirmed state.
- A category is ignored and then source answers change: recompute; preserve the dismissal only while the stable category ID still exists, and let the person restore it.
- Device text scaling or screen reader expands the summary: all content remains reachable without relying on color, score position or animation.

## ZOMBIES Coverage

- Z — Zero: no existing state, no answered optional fields, no category, `orientation=null`, no safe contact and legacy storage absent.
- O — One: one confirmed priority produces one explained category and one source-question link.
- M — Many: several priorities/preferences, three-category cap, repeated updates, changed dismissals and append-only history preserve deterministic ordering.
- B — Boundaries: safety precedence, zero-versus-unknown, one/three/four category candidate boundary, safe-contact text length, state schema v1→v2 and immediate-versus-within-days availability.
- I — Interfaces: questionnaire draft → pure derivation → candidate review → Zustand confirmation → SecureStore; UI correction returns to the owning question; help route receives no payload; no backend/telemetry interface.
- E — Exceptions: interrupted assessment, malformed legacy data, unknown schema, failed load/save/delete, repeated confirm, cancellation, app termination and unavailable help link.
- S — Simple: extend the existing feature with one pure profile module, one migration boundary and existing routes; no new service, dependency, questionnaire or provider layer.

## OWASP Security Gate

- Applicable Top 10:2025 lens:
  - A04 Cryptographic Failures: use the platform SecureStore boundary already chosen; do not claim universal encryption properties that have not been proven on supported devices.
  - A05 Injection: validate and length-bound optional local text; never interpolate it into URLs, logs, prompts, queries or rendered markup outside React Native text.
  - A06 Insecure Design: pressure-test coercion, observed screens, unsafe contact assumptions, compensating scores, forced updates and future provider creep.
  - A08 Software or Data Integrity Failures: version and validate stored state; migrate once behind confirmation; reject unknown schemas; preserve append-only critical history and atomic state/profile consistency.
  - A09 Security Logging and Alerting Failures: the correct V1 control is deliberate non-logging of sensitive payloads; tests must fail if situation data reaches analytics, crash, console or support adapters.
  - A10 Mishandling of Exceptional Conditions: fail closed on load/parse/save/delete, show neutral recovery, prevent false success and preserve the in-memory confirmed state. Because Expo SecureStore has no multi-key transaction, a delete-plus-verification double failure has two honest durable outcomes; it must report `SITUATION_STORAGE_COMMIT_UNCERTAIN`, never claim prior authority, and be verified on supported devices.
- Trust/data boundaries: the authorized actor is the person using the solo local flow in a confirmed private context. Another person, the author journey, backend services, analytics, support, notifications and future professionals are unauthorized consumers.
- Authentication/tenant boundary: not applicable to this V1 because it adds no account, server, tenant or authorization interface; device/account-sharing risk is handled by privacy confirmation, neutral recovery and no new remote copy.
- ASVS v5.0.0 mapping: no full-ASVS claim. Server authentication, authorization, API and session requirements are not applicable to this local-only increment. Readiness must select the relevant official mobile-storage/input requirements if an exact versioned mapping is used; absence of that optional mapping does not authorize a backend or weaken the controls above.
- Required proof: migration and corruption tests, no-network/no-telemetry import and spy tests, sensitive-log scan, atomic confirmation tests, interruption-before-persistence tests and manual supported-device SecureStore/privacy review.
- Residual risk/owner: operating-system recent-app previews and compromised/shared devices cannot be fully controlled by this JavaScript-only increment. Product/security review owns any future native screen-capture protection; V1 uses neutral recovery and makes no stronger promise.

## Implementation Tasks

1. [x] Align product and status contracts before code mutation.
   - Target: `subjected-person-situation-questionnaire.md`, `subjected-person-profile-matrix.md`, `technical/app/guidelines.md`, `technical/app/situation-state.md` and wording in `claiire-coach-operating-model.md`.
   - Action: record final questions, `NeedProfileV1`, needs-first restitution, sensitive-flow gamification precedence and broad-draft-versus-runtime-slice status distinction.
   - User-story link: makes the implementation explainable and prevents the person’s needs flow from inheriting unsafe retention mechanics.
   - Dependency: this approved draft and existing reviewed coach product contract.
   - Exact validation: metadata lint every governed changed document; `rg -n "NeedProfileV1|Tout est un jeu|streak|draft|implemented, not yet verified"` confirms aligned wording; diff review finds no claim that the broad spec is active/ready.
   - Constraints: do not change the broad coach spec status, author path, site claims or backlog.

2. [x] Define versioned needs types and local migration.
   - Target: `app/features/situation/types.ts`, `storage.ts` and focused tests.
   - Action: add `NeedProfileV1`, stable enums/reason codes and `SituationState` v2; read valid legacy `claiire.situation.v1`, migrate unknown new fields to unknown/empty, write `claiire.situation.v2` only after confirmation, and clear legacy, current-v2 and previous-authority keys on confirmed erase/session-only transition.
   - User-story link: preserves existing data while making needs explicit and reversible.
   - Dependency: Task 1.
   - Exact validation: Jest covers valid v1, valid v2, malformed JSON, unknown version, failed get/set/delete, session-only cleanup and explicit erase; `pnpm --dir app exec tsc --noEmit` passes.
   - Constraints: no new storage library, backend call, precise location or silent migration write.

3. [x] Add missing need and preference questions to the existing registry.
   - Target: `app/features/situation/questionnaire.ts` and questionnaire-routing tests.
   - Action: implement the exact `I3`, `P5`, `P6`, `N1..N8` values, exclusivity rules, initial branch and targeted-update routes defined by this spec.
   - User-story link: collects what help the person wants and what makes it realistically usable.
   - Dependency: Tasks 1–2.
   - Exact validation: table-driven Jest asserts unique IDs/options, exclusive multi-select normalization, initial order, branch entry/exit, all update routes, skip behavior, no free-text/precise location and preservation of A1/S1/S3 interruption positions.
   - Constraints: no second questionnaire, no contact details, no directory data and no diagnostic wording.

4. [x] Implement pure explainable need derivation.
   - Target: new `app/features/situation/needProfile.ts` and `needProfile.test.ts`; bounded integration with `scoring.ts`.
   - Action: derive `NeedProfileV1`, nullable orientation and stable zero-to-three categories using the exact source mapping, dedupe, precedence and orientation table in this spec.
   - User-story link: converts answers into understandable choices rather than a hidden score.
   - Dependency: Tasks 2–3.
   - Exact validation: decision-table Jest covers each orientation/category, unknowns, conflicting priorities, `P6=none-now`, safety non-compensation, category cap/order, source question IDs and deterministic repeated runs.
   - Constraints: pure synchronous local function; no time-dependent rank except injected `derivedAt`; no LLM, network, weighted global score or professional entity.

5. [x] Preserve safety-first candidate and confirmation behavior.
   - Target: `app/features/situation/store.ts`, `scoring.ts`, `situation-questionnaire.tsx` and focused store/UI tests.
   - Action: create the situation/profile candidate together, keep drafts memory-only, interrupt before candidate persistence, prevent duplicate confirmation and keep the previous confirmed state in memory on cancellation or error; expose durable authority as uncertain under the documented double failure.
   - User-story link: lets the person explore needs without exposing or corrupting prior information.
   - Dependency: Tasks 2–4.
   - Exact validation: fake-timer/store tests prove A1/S1/S3 interruption, no save before confirmation, one save for repeated tap, failed-save recovery, previous-state preservation and append-only critical history.
   - Constraints: existing `solo` gate and neutral exit remain; interruption never renders the new summary.

6. [x] Replace score-only restitution with an editable needs-first summary.
   - Target: `app/app/modal/situation.tsx`, `situation-questionnaire.tsx` and small components kept within `app/features/situation/` unless reused three times.
   - Action: render “Ce que j’ai compris”, “Ce qui compte maintenant”, zero-to-three explained categories, an honest empty state, `Pourquoi ?`, correction, ignore/restore, erase and discreet exit; retain dimensions as optional supporting detail.
   - User-story link: gives the person a clear, controllable result and next step.
   - Dependency: Tasks 4–5.
   - Exact validation: React Native Testing Library proves partial, complete, null-orientation, ignored/restored, update-before/after, erase and interruption states; snapshots are secondary only.
   - Constraints: no score-as-performance colors, no celebration, no professional card, no booking/contact CTA and no sensitive content before privacy confirmation.

7. [x] Apply app UI and accessibility authority.
   - Target: the changed app screens/components, `AppDesignTokens.ts` only if an existing semantic role is insufficient, and `AppIcon.tsx` for any new interface icon.
   - Action: use existing semantic tokens, Lucide registry icons, 44×44 minimum controls, readable focus/order, dynamic text wrapping, non-color meaning and explicit accessible names/states.
   - User-story link: makes correction and safe exit usable under stress and with assistive technology.
   - Dependency: Task 6.
   - Exact validation: component assertions for labels/roles/states, manual screen-reader/focus and maximum-text-size checklist on a supported device, visual review at narrow/standard widths.
   - Constraints: no raw icon SVG/emoji, new theme, animated celebration or motion-dependent information.

8. [x] Prove the local-only and no-telemetry boundary.
   - Target: situation feature tests and changed imports; no production analytics/backend file.
   - Action: add spies/static assertions that every situation/need payload remains local and that no changed module imports Convex, tracking, analytics, notifications, fetch/XHR or external provider code.
   - User-story link: ensures sensitive needs cannot leave the device without consent.
   - Dependency: Tasks 2–7.
   - Exact validation: focused Jest fails on any network/telemetry call; `rg -n "convex|analytics|tracking|notifications|fetch\(|XMLHttpRequest|useMutation|useQuery" app/features/situation app/app/modal/situation.tsx app/app/modal/situation-questionnaire.tsx` yields only reviewed false positives or no matches; console spy finds no sensitive payload.
   - Constraints: do not add even anonymized event tracking for this V1.

9. [ ] Run bounded implementation and documentation proof.
   - Target: all V1 code/tests/docs changed by Tasks 1–8.
   - Action: execute focused tests, full app tests, TypeScript, metadata lint and diff checks; perform manual supported-device proof when available.
   - User-story link: establishes that the result is useful, reversible and safe across normal and failure states.
   - Dependency: Tasks 1–8.
   - Exact validation: `pnpm --dir app test -- --runInBand`, `pnpm --dir app exec tsc --noEmit`, metadata lint on governed changed docs, `git diff --check`, ZOMBIES/OWASP checklist review and AC-01–AC-22 evidence table.
   - Constraints: no production claim, commit, push, deployment or release from implementation alone; verification owns the final verdict.

## Acceptance Criteria

- [ ] AC-01 — Given no prior state, when the person starts `Ma situation`, then the existing questionnaire path asks privacy/safety before needs/preferences and no second assessment entry exists.
- [ ] AC-02 — Given the person completes relevant answers, when final review opens, then `I3`, `P5`, `P6` and any answered branch preferences appear in the candidate summary before confirmation.
- [ ] AC-03 — Given confirmed answers, when `NeedProfileV1` is derived twice with the same timestamp input, then orientation, categories, reasons and evidence IDs are identical.
- [ ] AC-04 — Given all optional need/preference answers are skipped and no previously confirmed critical evidence exists, when the profile is built, then orientation is null, categories are empty, unknown stays unknown and resources remain available.
- [ ] AC-05 — Given a new A1 privacy failure, S1 immediate-danger value or critical S3 value, when selected, then the draft/candidate is discarded before persistence and the previous confirmed state/profile remains unchanged.
- [ ] AC-06 — Given protective support or agency and a critical/urgent signal coexist, when derivation runs, then the protective values never lower or hide the safety response.
- [ ] AC-07 — Given one relevant confirmed need, when the summary renders, then it shows at least one and at most three categories with plain-language explanation and source-question evidence.
- [ ] AC-08 — Given four or more possible categories, when ordered, then stable documented precedence limits display to three without a hidden weighted global rank.
- [ ] AC-09 — Given `P6=none-now`, when confirmed, then “aucun maintenant” is preserved without guilt, streak loss, XP effect, reminder or failure copy.
- [ ] AC-10 — Given the person edits a source answer, when returning to review, then before/after values and derived categories recompute while durable state remains unchanged until reconfirmation.
- [ ] AC-11 — Given a category is ignored, when confirmed, then it leaves the active summary, can be restored and does not affect safety/help availability.
- [ ] AC-12 — Given valid local state v1, when loaded, then migration is in memory, missing needs remain unknown and v2 is not written until explicit confirmation.
- [ ] AC-13 — Given malformed or unknown-version stored state, when loaded, then raw content is not rendered, the app fails closed to a neutral recoverable state and offers truthful erase/restart choices.
- [ ] AC-14 — **Partial; supported-device verification pending.** Given save fails, when confirming, then the UI does not claim success, the in-memory prior state and candidate remain available, and retry/session-only/leave options expose no sensitive detail. Focused mocks cover both durable restart outcomes after delete-plus-read failure; prior durable authority is not claimed until a successful reload.
- [ ] AC-15 — Given erase fails, when requested, then Claiire does not claim deletion and provides a neutral retry path.
- [ ] AC-16 — Given rapid repeated confirm taps, when the first confirmation is running, then later taps cannot duplicate migration, history or state mutation.
- [ ] AC-17 — Given the person chooses session-only, when confirmed, then legacy, current-v2 and previous-authority persistent keys are absent and the in-memory confirmed state remains usable only for the session.
- [ ] AC-18 — Given any V1 path, when network/telemetry spies and import scans run, then no situation answer, need profile, category, dismissal or interruption cause reaches network, backend, analytics, crash/log, notification or prompt surfaces.
- [ ] AC-19 — Given screen reader and maximum text size, when the summary, correction, ignore, erase and discreet-exit actions are used, then order, labels, states and targets remain understandable and reachable without color-only meaning.
- [ ] AC-20 — Given the implementation docs are reviewed, then sensitive flows explicitly override universal gamification wording and the broad coach spec remains governed as `draft` while runtime slices are described separately.
- [ ] AC-21 — Given a reviewer searches the V1 UI and types, then there is no diagnosis/global score, named professional, ranking, match, booking, contact initiation, journal sharing, author-path access or general onboarding change.
- [ ] AC-22 — Given the help route is opened from any summary/interruption/empty state, then it receives no situation payload and existing France resource actions retain trace warnings and failure handling.

## Test Strategy

- Pure logic: table-driven Jest for need derivation, reason-code evidence, ordering, unknown handling, non-compensation and deterministic output.
- State/storage: mock SecureStore for strict canonical v1→v2 migration, staged confirmation, session-only clearing, corrupted/unknown schemas, get/set/delete failures and both restart outcomes after `SITUATION_STORAGE_COMMIT_UNCERTAIN`.
- Routing: test initial and targeted question ID sequences, with privacy/safety questions always preceding relevant needs branches.
- UI: React Native Testing Library for visible sections, accessibility semantics, correction, ignore/restore, erase, repeated confirm and neutral recovery.
- Security/data: mock `fetch`, XHR where available, Convex hooks, analytics/tracking adapters, console and notifications; any invocation from the situation flow fails the suite.
- Regression: run the complete app Jest suite and TypeScript strict compilation.
- Manual: supported-device Android/iOS proof for hardware back/modal dismissal, recent-app recovery, screen reader, dynamic text, offline behavior and SecureStore persistence/deletion.
- Documentation: metadata lint, link/path review, grep for contradictory gamification/status wording and diff check.
- Test data: synthetic scenarios only; no real survivor records, contact information or production exports in fixtures, screenshots or logs.

## Risks

- High safety risk: an orientation label could falsely reassure or alarm. Mitigation: nullable orientation, explicit reasons, no global score, safety precedence and specialist/lived-experience review before production verification.
- High privacy risk: more preferences increase sensitive local data. Mitigation: coarse optional fields, no contact identifiers/location, session-only mode, staged local persistence with explicit uncertain-commit recovery, erase and no telemetry.
- High coercion risk: another person may observe or force answers. Mitigation: privacy-first check, interruption before persistence, neutral recovery and no notifications/new remote copy.
- Medium migration risk: v1 state may be lost or silently reinterpreted. Mitigation: schema validation, in-memory migration, unknown defaults, confirmation before v2 write and dual-key cleanup tests.
- Medium UX risk: added questions increase cognitive load. Mitigation: progressive branches, skips, targeted updates, three-category cap and needs-first summary.
- Medium documentation risk: draft/implemented wording can be mistaken for readiness. Mitigation: explicit status separation in Task 1 and metadata/status review.
- Residual platform risk: recent-app preview and compromised devices are not fully controlled. Mitigation: no stronger privacy claim, neutral return surface and separate future native protection decision.

## Execution Notes

- Work sequentially because types/migration and question IDs define downstream derivation and UI contracts.
- Preserve unrelated dirty files and do not modify `shipglows_data/workflow/BACKLOG.md`, `shipglows_data/business/project-competitors-and-inspirations.md` or `site/ENVIRONMENT.md` as part of this chantier.
- Use `apply_patch` for intentional source/doc edits and review the exact diff after every task batch.
- Keep new components local to the situation feature unless the existing three-use shared-component rule is met.
- Treat specialist/lived-experience review as a production-verification gate, not permission to infer a new clinical product claim.
- No commit, push, deployment, publication or external message is implied by this spec.

## Open Questions

None. The operator resolved the material V1 decisions: current subjected-person flow only, local-only state, non-diagnostic explainable categories, preserved safety interruptions and no provider handoff. Future directory, matching, booking, author journey, backend or locale expansion requires a separate decision and spec.

## Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
| --- | --- | --- | --- | --- | --- |
| 2026-08-16 08:42:23 UTC | 100-sg-spec | GPT-5 Codex | Created the durable V1 contract from the approved needs-discovery direction, current product/technical authorities and runtime evidence. | draft | Readiness review |
| 2026-08-16 08:49:20 UTC | 101-sg-ready | GPT-5 Codex | Closed the deterministic-rule gap by governing exact question IDs/values, progressive branches, category mappings, precedence, orientation and specialist-review boundary; checked safety, data, UI, ZOMBIES, OWASP, documentation and proof contracts. | ready | Bounded sequential implementation |
| 2026-08-16 09:58:47 UTC | 102-sg-start | gpt-5.6-sol high | Implemented Tasks 1-8 and bounded repairs: canonical fail-closed v1/v2 validation, staged storage authority with honest uncertain-commit handling, explicit before/now source review and targeted correction. | implemented; 92 focused situation tests and TypeScript pass; 157 tests pass in the full run, while three React Native suites remain blocked by harness initialization; AC-14 supported-device proof pending | Repair the React Native Jest harness, then run 103-sg-verify and supported-device review |
| 2026-08-16 10:04:50 UTC | 103-sg-verify | gpt-5.6-sol high | Independently challenged storage corruption, restart authority, safety ordering, source review and local-only boundaries; two P1 rounds were repaired and rechecked. | partial verification; no P0/P1 remains, AC-13 is locally verified, AC-14/15/17 remain partial, and rendered/device evidence is blocked | Repair the React Native Jest harness, then complete rendered and supported-device review |

## Current Chantier Flow

- `100-sg-spec`: complete; draft contract created with governed `NeedProfileV1`, safety/data boundaries, ordered implementation tasks, ZOMBIES coverage and OWASP gate.
- `101-sg-ready`: complete; ready after one bounded correction pass fixed exact question values/branches and the deterministic category/orientation decision table; migration, accessibility, specialist-review and proof boundaries are explicit.
- `102-sg-start`: implemented Tasks 1-8 and the bounded P1 repairs; 92 pure/store/storage/routing/security/source-contract tests, TypeScript, metadata, token drift and static data-boundary checks pass. The full Jest run executes 157 passing tests. Task 9 and AC-14 remain partial because three React Native component suites fail during harness initialization and supported-device SecureStore double-failure proof is unavailable.
- `103-sg-verify`: partial; independent recheck found no remaining P0/P1. AC-13 and the no-false-success contract pass locally; AC-14/15/17 remain partial until real SecureStore behavior is exercised. Three React Native suites remain blocked before test execution by the existing Jest/Expo harness mismatch.
- `104-sg-end`: pending verification; dependency compatibility landed, remaining task is rerunning the three blocked RN suites and completing local evidence capture.
- `005-sg-ship`: not requested; no commit, push, deployment or publication authorized.

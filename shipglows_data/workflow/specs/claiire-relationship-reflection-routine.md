---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "claiire"
created: "2026-08-09"
updated: "2026-08-11"
status: reviewed
source_skill: 100-sg-spec
scope: "app-relationship-reflection-routine"
owner: Diane
confidence: high
user_story: "As a Claiire user, I can start an optional guided pause combining a check-in, gentle paced breathing, private writing, soft visualization, and one safe next step, without pressure, diagnosis, or exposure of sensitive notes."
risk_level: high
security_impact: yes
docs_impact: yes
linked_systems:
  - "app/app/modal/routine.tsx"
  - "app/app/modal/situation-help.tsx"
  - "app/convex/routines.ts"
  - "app/features/routines/engine/"
  - "shipglows_data/product/shared/coach-operating-model.md"
depends_on:
  - artifact: "shipglows_data/product/shared/coach-operating-model.md"
    artifact_version: "1.1.0"
    required_status: reviewed
supersedes: []
evidence:
  - "Operator request 2026-08-09: integrate a relationship/reflection routine with journaling, breathing, and visualization."
  - "NHS guidance: breathing should remain gentle, comfortable, and stoppable if dizziness or discomfort occurs."
  - "VA guided-imagery guidance: imagery needs additional caution for trauma-sensitive audiences."
next_step: "manual mobile preview before release"
---

# Relationship and reflection routine

## User story

As a Claiire user, I can start an optional guided pause combining a check-in, gentle paced breathing, private writing, soft visualization, and one safe next step, without pressure, diagnosis, or exposure of sensitive notes.

## Behavior contract

- A featured `Relation & réflexion` template is available from routine creation.
- The sequence contains: arrival, regular 5/5 breathing, private session journaling, optional gentle visualization, and one small safe next step.
- Every step can be skipped, including the final step.
- Breathing never asks the user to hold their breath or force a rhythm and tells them to stop if uncomfortable or dizzy.
- Visualization supports eyes open, stopping, and skipping; it must not impose a “safe place” image.
- Relationship notes are session-only and are never sent to Convex.
- Immediate-help access remains visible during the guided sequence.
- This routine makes no medical or therapeutic claim and does not replace human or emergency support.
- Completion language is non-punitive and does not pressure the user toward 100% completion.

## Safety failure conditions

- Sensitive free text is persisted remotely or logged.
- The flow recommends confrontation, mediation, reconciliation, or a shared couple action.
- The user must complete breathing, visualization, or writing to finish.
- Gamification or streak language overrides safety or encourages completion at any cost.
- The flow diagnoses, promises a health effect, or presents itself as emergency support.

## Acceptance scenarios

- `RR-01`: selecting the featured template preloads the full ordered sequence.
- `RR-02`: during breathing, the UI alternates gentle inhale/exhale guidance and exposes pause/skip.
- `RR-03`: journal text stays in component state and is absent from routine completion payloads.
- `RR-04`: visualization explicitly permits eyes open, stop, and skip.
- `RR-05`: immediate-help access opens the neutral, non-gamified human-help surface.
- `RR-06`: any final incomplete action can be skipped and the routine can still end.
- `RR-07`: regular routines keep their existing behavior.

## Implementation tasks

- [x] Add the featured routine template.
- [x] Render guided content for its steps.
- [x] Make every guided step optional.
- [x] Remove completion-pressure copy and XP for this safety-sensitive routine.
- [x] Purge session-only reflection text on completion, backgrounding, and unmount.
- [x] Route immediate help to the neutral human-help surface.
- [x] Add deterministic tests for template and breathing-phase helpers.
- [x] Run typecheck, tests, design-token drift check, and focused safety scan.

## Skill Run History

| Timestamp | Skill | Result | Next |
| --- | --- | --- | --- |
| 2026-08-09 12:00:00 UTC | 100-sg-spec | Ready safety and privacy contract created | 001-sg-build |
| 2026-08-09 12:24:00 UTC | 001-sg-build | Implemented and locally verified; sensitive notes remain session-only and this routine awards no XP | Manual mobile preview |
| 2026-08-11 15:10:00 UTC | 001-sg-build | Safety corrections implemented; 6 focused tests, global typecheck and design-token drift check passed | Manual mobile preview |

## Current Chantier Flow

`100-sg-spec done -> 101-sg-ready passed -> 001-sg-build safety corrections verified locally -> manual mobile preview pending`

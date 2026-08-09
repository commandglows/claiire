---
artifact: feature_spec
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "claiire"
created: "2026-08-09"
updated: "2026-08-09"
status: complete
source_skill: 006-sg-design
scope: "shared app and site visual palette"
owner: Diane
confidence: high
risk_level: medium
security_impact: none
docs_impact: yes
depends_on:
  - artifact: "shipglows_data/branding/visual-identity.md"
    artifact_version: "1.1.0"
    required_status: reviewed
evidence:
  - "Operator requested a red/black atmosphere with gradients across the app and site on 2026-08-09."
next_review: "2026-09-09"
next_step: "none"
---

# Claiire — palette Crimson nocturne

## Outcome

Apply one coherent red/black visual direction to the mobile app and public site through their canonical token sources.

## Invariants

- Preserve readable text, focus visibility, semantic success/warning/info states, and crisis-flow clarity.
- Keep brand accent distinct from destructive or emergency danger states.
- Add no visual literals outside canonical token sources.
- Preserve existing component structure and behavior.

## Acceptance

- App and site consume the new palette through existing tokens.
- Backgrounds and hero surfaces use restrained crimson-on-black gradients where supported.
- Core text/accent combinations meet WCAG AA contrast targets.
- Repository design-system drift scan passes.
- Site build and app tests pass; visual proof is collected where locally runnable.

## Skill Run History

| Date | Skill | Result |
| --- | --- | --- |
| 2026-08-09 | 006-sg-design | Ready: explicit operator direction, bounded token-only implementation, safety invariants recorded. |
| 2026-08-09 | 006-sg-design | Complete: shared palette implemented; contrast, drift, build, tests, and desktop visual proof passed. |

## Current Chantier Flow

`006-sg-design: complete`

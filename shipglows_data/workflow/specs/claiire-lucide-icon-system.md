---
artifact: feature_spec
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "claiire"
created: "2026-08-09"
updated: "2026-08-09"
status: complete
source_skill: 006-sg-design
scope: "shared Lucide icon system for app and site"
owner: Diane
confidence: high
risk_level: medium
security_impact: none
docs_impact: yes
depends_on:
  - artifact: "shipglows_data/branding/visual-identity.md"
    artifact_version: "1.1.0"
    required_status: reviewed
supersedes: []
evidence:
  - "Operator selected Lucide and requested a harmonized icon theme across XP, navigation, progress, alerts, and rewards on 2026-08-09."
  - "Official Lucide packages exist for React Native, Astro, and Vue."
  - "App Jest suite passed 59/59, TypeScript passed, and Expo web export bundled successfully on 2026-08-09."
  - "Astro check and production build passed; desktop and 390px parcours screenshots were reviewed on 2026-08-09."
next_review: "2026-09-09"
next_step: "None; use the documented registries and stable icon identifiers for future UI work."
---

# Claiire — système d’icônes Lucide

## Outcome

Replace fragmented interface emojis, native symbol mappings, and one-off SVG controls with one coherent Lucide visual language across the Expo app and Astro/Vue site.

## Icon contract

- Use Lucide outline icons with rounded geometry and a standard stroke width of 2.
- Use sizes from shared icon tokens: 16, 20, 24, 32, and 48/56 for expressive reward moments.
- Color icons through semantic design tokens; do not embed one-off colors.
- Every actionable icon has an accessible label through its control; decorative icons are hidden from assistive technology.
- Critical and SOS actions retain visible text and never rely on icon meaning alone.
- Brand marks keep their official SVG assets because Lucide intentionally excludes brand logos.
- Persist stable icon identifiers for new user-created content; legacy emoji values remain readable through a bounded compatibility mapping.
- Notification payloads may retain a compact text symbol where operating-system presentation cannot render the component icon.

## Scope

- Expo navigation, tracking, onboarding, crisis, routines, analytics, achievements, XP, and gamification UI.
- Astro and Vue navigation controls, parcours, progress, badges, XP, levels, streaks, and close/action controls.
- Shared icon registries and design tokens for each runtime surface.
- Existing social brand SVGs and the Claiire logo remain unchanged.

## Acceptance

- Lucide official packages are used for React Native, Astro, and Vue.
- Static UI emojis and one-off utility SVGs in owned app/site interface code are migrated.
- User-selectable icons use stable IDs with legacy emoji compatibility.
- XP, streak, level, achievement, progress, warning, and navigation families are visually coherent.
- App tests and type checks pass, site check/build pass, and design drift remains at zero.
- Desktop and compact site visual proof is collected; app proof is collected where the local runtime supports it.

## Skill Run History

| Date | Skill | Result |
| --- | --- | --- |
| 2026-08-09 | 006-sg-design | Ready: explicit package choice, migration boundaries, accessibility rules, compatibility, and proof path recorded. |
| 2026-08-09 | 006-sg-design | Complete: Lucide registries, icon tokens, XP/badge/navigation migrations, compatibility mapping, documentation, tests, builds, and responsive browser proof completed. |

## Current Chantier Flow

`006-sg-design: complete`

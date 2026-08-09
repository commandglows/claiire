---
artifact: feature_spec
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "claiire"
created: "2026-08-09"
updated: "2026-08-09"
status: complete
source_skill: 006-sg-design
scope: "responsive redesign of the public Astro site"
owner: Diane
confidence: high
risk_level: medium
security_impact: none
docs_impact: yes
depends_on:
  - artifact: "shipglows_data/branding/visual-identity.md"
    artifact_version: "1.1.0"
    required_status: reviewed
  - artifact: "shipglows_data/technical/design-system-authority.md"
    artifact_version: "1.0.0"
    required_status: active
supersedes: []
evidence:
  - "Operator requested a stronger web design with mobile responsive priority on 2026-08-09."
  - "Current 390px proof shows undersized navigation, compressed reading density, weak section rhythm, and limited mobile action hierarchy."
  - "Responsive browser proof passed at 390px, 768px, and 1440px with no horizontal overflow; the 390px primary action measured 54.5px high."
  - "Astro check and production build passed after the implementation; breakpoint syntax scan found no remaining custom-property media queries."
  - "Official French public-service sources were checked before correcting 17, 112, 114, 119, and 3919 safety content."
next_review: "2026-09-09"
next_step: "None; preserve the responsive and sensitive-route invariants in future public-site work."
---

# Claiire — refonte responsive du site public

## Outcome

Make the public site feel intentional, protective, and premium on mobile first, while preserving the Crimson Nocturne identity, sensitive-topic safeguards, existing claims, and desktop readability.

## Scope

- Shared public header, hero, page shell, footer, buttons, reading rhythm, and responsive navigation.
- Homepage orientation, safety, wellbeing, approach, and app-preview sections.
- Parcours cards, progress blocks, and long-form public parcours layouts.
- Central site tokens and shared components required by those surfaces.

## Design contract

- Mobile-first hierarchy with comfortable body size, readable line length, and clear section boundaries.
- Touch targets at least 44px for primary controls and navigation.
- Crimson gradients and glows remain localized to emphasis surfaces, never behind long copy.
- Violence pathways stay separated; safety resources remain more prominent than conversion.
- Existing public claims and substantive copy remain unchanged unless a small structural edit improves scanning without changing meaning.
- New visual values must be declared in `site/src/styles/global.css` and consumed semantically.
- Preserve keyboard focus, reduced-motion behavior, theme behavior, and brand SVG exceptions.

## Acceptance

- Homepage and a representative parcours page are verified at 390px, tablet, and desktop widths.
- No horizontal overflow at compact widths.
- Header navigation and primary actions meet target-size and focus requirements.
- Cards stack with clear ordering, consistent density, and readable copy.
- Astro check and production build pass.
- Design-system drift introduces no unexplained literals outside the authority layer.
- Public wording remains claim-safe and consistent with the two-path violence rules.

## Execution Batches

Writes remain delegated sequential because shared layout and token changes affect all target pages.

## Skill Run History

| Date | Skill | Result |
| --- | --- | --- |
| 2026-08-09 | 006-sg-design | Ready: mobile-first outcome, target surfaces, token authority, safety invariants, and proof matrix recorded. |
| 2026-08-09 | 007-sg-content | Ready: existing public claims retained; content work limited to hierarchy and scannability without promise changes. |
| 2026-08-09 | 006-sg-design | Complete: responsive breakpoints, header, landing hierarchy, parcours UI, touch targets, reduced motion, and multi-width browser proof completed. |
| 2026-08-09 | 007-sg-content | Complete: sensitive-route gamification removed and urgent resources plus violence framing corrected against current official sources. |

## Current Chantier Flow

`006-sg-design + 007-sg-content: complete`

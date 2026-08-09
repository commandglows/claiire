---
artifact: feature_spec
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "claiire"
created: "2026-08-09"
updated: "2026-08-09"
status: complete
source_skill: 006-sg-design
scope: "desktop visual refinement of the public Astro site"
owner: Diane
confidence: high
risk_level: medium
security_impact: none
docs_impact: yes
depends_on:
  - artifact: "shipglows_data/workflow/specs/claiire-site-responsive-redesign.md"
    artifact_version: "1.0.0"
    required_status: complete
  - artifact: "shipglows_data/technical/design-system-authority.md"
    artifact_version: "1.0.0"
    required_status: active
supersedes: []
evidence:
  - "Operator requested a dedicated desktop design pass on 2026-08-09."
  - "Current 1440px proof is coherent but can improve editorial composition, hierarchy, whitespace, depth, and component rhythm without changing product claims."
next_review: "2026-09-09"
next_step: "No remaining action; preserve the desktop and responsive proof matrix in future visual changes."
---

# Claiire — passe design desktop du site public

## Outcome

Make the desktop site feel more editorial, premium, balanced, and distinctly Claiire at 1280–1440px while preserving the validated mobile experience, Crimson Nocturne identity, accessibility, and sensitive-topic safety.

## Scope

- Shared desktop shell: header, hero, main canvas, footer, and reading widths.
- Homepage section composition, visual rhythm, cards, pathways, and supporting content.
- Representative parcours and formation layouts, progress surfaces, and desktop grids.
- Central tokens and shared component variants needed by those surfaces.

## Design contract

- Preserve all behavior and layout proofs already validated at 390px and 768px.
- Use wide desktop space intentionally through composition, not by stretching long-form prose.
- Maintain restrained crimson gradients, warm-black surfaces, clear depth, and readable contrast.
- Keep safety content visually prominent and the two violence paths clearly separated.
- Do not change public claims or substantive copy.
- Reusable visual values belong in `site/src/styles/global.css`; media-condition literals remain the documented CSS protocol exception.
- Preserve keyboard focus, reduced motion, touch targets, and semantic structure.

## Acceptance

- Homepage is visually verified at 1280px and 1440px.
- A parcours page and a representative formation/document page are verified on desktop.
- Regression proof passes at 390px and 768px with no horizontal overflow.
- Long-form copy retains a readable line length while landing sections use desktop space intentionally.
- Astro check and production build pass.
- Token drift has no unexplained findings.

## Execution Batches

Writes remain delegated sequential because shared token and layout changes affect all target surfaces.

## Skill Run History

| Date | Skill | Result |
| --- | --- | --- |
| 2026-08-09 | 006-sg-design | Ready: desktop outcome, target surfaces, mobile non-regression, token authority, and proof matrix recorded. |
| 2026-08-09 | 006-sg-design | Audited: formation canvas, focus ring, desktop navigation rails, parcours progression, and dark-only theme consistency prioritized. |
| 2026-08-09 | 006-sg-design | Implemented and visually verified: editorial desktop composition, centered splash reading canvas, sticky parcours rail, accessible progress, opaque focus, and mobile non-regression. |
| 2026-08-09 | 003-sg-bug | Fixed the server-mode dynamic editorial route lookup; representative formation and violence routes return 200 and unknown slugs render the 404 document with HTTP 404. |

## Current Chantier Flow

`006-sg-design -> 003-sg-bug -> browser retest -> complete`

## Completion evidence

- Desktop rendered proof: homepage at 1280px and 1440px, parcours at 1440px, formation at 1440px.
- Responsive regression: homepage and parcours at 390px; overflow checks at 390px and 768px.
- Accessibility proof: keyboard focus renders an opaque 3px semantic ring; parcours progress exposes `role="progressbar"` and `aria-valuenow`.
- Runtime proof: `/formations/victimes/` and `/violence/` return 200; an unknown editorial slug returns 404.
- Engineering proof: `pnpm run check` (0 errors), `pnpm run build` (success), and `git diff --check` (success).
- Token drift: 13 documented media-query breakpoint literals only; no unexplained reusable visual values.

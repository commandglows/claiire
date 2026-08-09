---
artifact: feature_spec
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "claiire"
created: "2026-08-09"
updated: "2026-08-09"
status: complete
source_skill: 001-sg-build
scope: "single-source refactor for public site parcours metadata and module routing"
owner: Diane
confidence: high
risk_level: medium
security_impact: none
docs_impact: yes
depends_on:
  - artifact: "shipglows_data/workflow/specs/claiire-site-desktop-design-pass.md"
    artifact_version: "1.0.0"
    required_status: complete
supersedes: []
evidence:
  - "The six parcours duplicate shared metadata and module definitions between site/src/config/parcours.js, site/src/pages/parcours/*.astro, homepage cards, and navigation."
  - "Operator requested a bounded single-source refactor while preserving public rendering, URLs, copy, and progress identity on 2026-08-09."
next_review: "2026-09-09"
next_step: "none"
---

# Claiire — parcours as a single source of truth

## Outcome

Remove duplicated shared parcours data by making `site/src/config/parcours.js` the sole authority for each parcours `id`, `title`, `icon`, `description`, `color`, ordered `modules`, and first-module route.

The homepage, parcours navigation, and all six `site/src/pages/parcours/*.astro` routes must derive those shared values from the config. Each parcours page keeps only its genuinely specific editorial content: introduction, steps, resources, and closing.

## Target

- Project: Claiire.
- Product: public Astro site.
- Surface: homepage, parcours navigation, and the six parcours pages.
- Feature: parcours discovery, module ordering, and progress continuity.

## In scope

- Establish a normalized parcours contract in `site/src/config/parcours.js` for:
  - `id`
  - `title`
  - `icon`
  - `description`
  - `color`
  - exactly six ordered modules
  - first-module route derived from the first module rather than duplicated manually
- Add `getParcours(id)`, returning the matching config entry and failing explicitly with a useful error for an unknown ID.
- Refactor the six pages under `site/src/pages/parcours/*.astro` to obtain shared data through `getParcours(id)`.
- Preserve page-local introduction, steps, resources, and closing content in the corresponding page files.
- Derive parcours navigation and homepage parcours cards from the same config collection.
- Add a focused mechanical check, exposed through a documented package script, that validates the config and route contract.

## Out of scope

- Rewriting, shortening, translating, or otherwise changing public text.
- Changing visual design, tokens, icons, colors, layouts, or responsive behavior.
- Changing module article content or introducing new modules.
- Renaming public URLs, route slugs, localStorage keys, or progression identifiers.
- Changing the progression algorithm or completion behavior.

## Source-of-truth contract

`site/src/config/parcours.js` is the only writable authority for shared parcours metadata and ordered module references.

- Consumers may transform config data for presentation but must not redeclare shared values.
- `firstModuleRoute` must be derived from `modules[0]`; it must not become a second manually maintained route field.
- The exported parcours collection must have deterministic ordering so homepage and navigation order remain unchanged.
- `getParcours(id)` must throw an explicit error containing the unknown ID when no parcours matches.
- A page may retain only page-specific editorial structures: introduction, steps, resources, and closing.
- Navigation and homepage consumers must import or receive the canonical collection rather than maintain independent arrays.

## Preserved behavior

- Keep the six current parcours IDs unchanged.
- Keep all six public parcours URLs unchanged.
- Keep every current module URL and module order unchanged.
- Keep progression and localStorage IDs unchanged so existing user completion data continues to resolve.
- Keep current headings, descriptions, labels, CTA text, module text, and all other public copy unchanged.
- Keep rendered structure and styling materially identical; this is a data-authority refactor, not a redesign.
- Preserve current behavior when JavaScript is unavailable wherever the existing site supports it.

## Mechanical contract check

Add a focused script, preferably under `site/scripts/`, and expose it through the site package scripts. It must exit non-zero with actionable output when any invariant fails:

1. Every parcours ID is non-empty and unique.
2. The canonical collection contains the expected six parcours IDs and no duplicate route ownership.
3. Every parcours has exactly six modules.
4. Every module has non-empty required fields and a non-empty internal link.
5. Module links are unique within a parcours; accidental duplicate modules fail the check.
6. Internal links are valid against discoverable site content/routes when practical; at minimum, they must be normalized root-relative paths with an accepted internal structure and no external origin.
7. Each of the six expected parcours page routes exists and maps coherently to one canonical config ID.
8. The first-module route resolves exactly to the first ordered module link.

The check must be deterministic, runnable locally and in CI, and must not depend on network access.

## Acceptance criteria

- Shared `id`, `title`, `icon`, `description`, `color`, modules, and first-module route are declared only in `site/src/config/parcours.js`.
- `getParcours(id)` is used by all six parcours pages and fails explicitly for an unknown ID.
- Homepage parcours cards and parcours navigation are generated from the canonical config.
- Each page retains its existing introduction, steps, resources, and closing without moving them into the shared config.
- No public copy, URL, progression/localStorage ID, module order, or rendered behavior changes.
- The targeted parcours contract check passes.
- `pnpm run check` passes from `site/`.
- `pnpm run build` passes from `site/`.
- Browser smoke confirms the homepage and all six parcours routes render successfully with the expected title, six modules, first CTA destination, and no console-breaking error.

## Proof matrix

| Proof | Scope | Expected result |
| --- | --- | --- |
| Targeted contract check | Canonical config, modules, links, route coherence | Exit 0; six unique parcours with exactly six valid modules each |
| Astro check | `site/` | Exit 0 with no new errors |
| Production build | `site/` | Exit 0; all expected routes build |
| Homepage browser smoke | Public homepage | Six parcours retain order, copy, styling, and destinations |
| Six-route browser smoke | Every `/parcours/*` page | HTTP 200, expected title, six modules, correct first-module CTA, no runtime failure |
| Persistence compatibility | Progress identifiers/localStorage references | IDs and lookup semantics unchanged |

## ZOMBIES

| Zombie | Required failure behavior |
| --- | --- |
| Unknown parcours ID | `getParcours(id)` throws an explicit, actionable error naming the ID |
| Empty or duplicate modules | Mechanical check exits non-zero and identifies the parcours/module |
| Missing module route | Mechanical check exits non-zero with the invalid or absent link |
| Missing parcours page route | Route-coherence check exits non-zero and names the unmatched config ID or route |

## Execution Batches

Mutations are sequential because `site/src/config/parcours.js` is a shared import authority and its consumers depend on the final exported contract.

1. Normalize the canonical config and add `getParcours(id)` plus derived first-module routing.
2. Refactor the six parcours pages to consume the canonical contract while retaining page-specific editorial sections.
3. Refactor homepage and navigation consumers to derive their data from the config.
4. Add the targeted mechanical check and package script.
5. Run integrated checks, build, persistence review, and browser smoke for the homepage plus all six routes.

No concurrent write batch is authorized for this chantier.

## Stop conditions

- Stop if preserving public copy, URLs, route order, or progression/localStorage IDs conflicts with the proposed normalized contract.
- Stop if a module link cannot be mapped unambiguously to its existing content route.
- Stop before widening scope into visual redesign, content rewriting, progression behavior, or unrelated navigation architecture.
- Do not mark complete without the targeted mechanical check and all seven browser smoke targets.

## Skill Run History

| Date | Skill | Result |
| --- | --- | --- |
| 2026-08-09 | 001-sg-build | Ready: bounded single-source outcome, invariants, sequential mutation batches, ZOMBIES, and proof matrix defined. |
| 2026-08-09 | 001-sg-build | Implemented: canonical config, six page consumers, derived navigation, and offline contract check complete; targeted check, Astro check, build, and diff check pass. Browser smoke remains with the orchestrator. |
| 2026-08-09 | 103-sg-verify | Complete: canonical `metaDescription` preserves the bonheur page copy exactly; all six pages consume canonical descriptions without literals; targeted check, diff check, and browser evidence pass. |

## Completion evidence

- The bonheur meta-description remains exactly `Ton parcours guidé vers un bonheur durable et authentique`, now owned by the canonical parcours configuration.
- All six parcours pages consume canonical descriptions and contain no literal `description` attribute.
- `pnpm run check:parcours` passes with 6 parcours, 36 unique modules, and all routes resolved; `git diff --check` passes.
- Previously acquired browser proof covers the ordered six-card homepage and all six parcours routes: correct title/H1, six modules, first-module CTA, exact `parcoursId`, no overflow, and no parcours-specific console error. The local missing-Clerk-key and Vite dev-toolbar messages remain pre-existing and outside this refactor.

## Current Chantier Flow

`001-sg-build ready -> sequential implementation complete -> targeted contract check passed -> pnpm check passed -> build passed -> browser smoke homepage + six parcours routes passed -> 103-sg-verify complete -> complete`

# Claiire — Crimson Nocturne interior pages redesign

> Status: `complete`  
> Owner: Design / Frontend  
> Scope: Astro public and member interior-page presentation only

## Objective

Apply the Crimson Nocturne design system consistently across every Astro interior-page family. Improve hierarchy, responsive composition, accessibility, and visual coherence without changing copy, routes, authentication logic, progression logic, data contracts, or dependencies.

## Scope

- `DocsLayout`, its navigation and table of contents, and shared global design tokens.
- `StaticPageLayout` outside the homepage.
- Public parcours pages and cards.
- `FormationModulePrivateLayout` and member training surfaces.
- `connexion` and `compte` presentation and recovery-state framing.
- Isolated `/bio/` presentation, treated as a dedicated surface.

## Non-goals

- No content, emergency-information, route, auth, entitlement, pricing, progress, analytics, or dependency changes.
- No redesign of the already-completed homepage.
- No change to violence-related product policy or safety flows.

## Safety invariants

- Safety, orientation, and human-help information stay before conversion or premium prompts on violence surfaces.
- Victim/exposed-person and author/responsibility parcours remain distinct.
- No mediation framing, false symmetry, or shared-responsibility language is introduced.
- Emergency information, numbers, claims, and escalation paths remain unchanged.

## Design direction

Extend Crimson Nocturne with calmer editorial interiors: open reading surfaces, restrained crimson emphasis, reduced nested-card chrome, clear reading measure, and consistent responsive navigation. Preserve documentation usability while matching the homepage’s visual confidence.

## Risks and required treatments

| Risk | Required treatment |
| --- | --- |
| Sidebar precedes main on mobile | Prioritize content and urgent orientation before long navigation; retain accessible navigation access. |
| Tables clip horizontally | Provide an explicit scroll container and visible affordance at narrow widths. |
| Skip link target is not focusable | Make each interior `<main>` a reliable focus target. |
| TOC disappears on tablet | Provide an accessible in-content or progressive alternative. |
| Double-card chrome | Remove redundant outer/inner card treatment while keeping grouping legible. |
| 220 px member grid at 320 px | Make grid tracks intrinsically narrow-safe with no hidden horizontal overflow. |
| Small uppercase labels lack contrast | Measure and correct all small-label foreground/background combinations to AA. |

## Execution batches

Writes are sequential because layouts and global styles are shared.

1. **Foundation** — inventory shared tokens; add or consolidate interior-page tokens; update `DocsLayout`, nav, TOC, skip-link/main semantics, and responsive table behavior.
2. **Public reading surfaces** — update static non-home pages, hubs, articles, and public formations; remove redundant chrome and preserve safety ordering.
3. **Learning surfaces** — refine parcours and private formation layout, including narrow grid behavior and progress presentation without changing logic.
4. **Account and isolated surfaces** — update connexion, compte, and `/bio/` with appropriate recovery framing and dedicated bio composition.
5. **Verification and refinement** — browser, keyboard, responsive, contrast, reduced-motion, build, check, and token-drift proof; correct only presentation defects found.

## Tasks and acceptance criteria

- [x] Establish shared interior Crimson Nocturne tokens without unresolved or duplicated token consumers.
- [x] Make `DocsLayout` content-first and safely navigable on mobile; main is focusable from the skip link.
- [x] Make tables readable and horizontally scrollable at 320 px without body overflow or clipped columns.
- [x] Preserve TOC access below desktop breakpoints.
- [x] Apply a lighter editorial reading treatment to static pages, docs/hubs, public formations, parcours, and private modules.
- [x] Eliminate avoidable double-card chrome while preserving hierarchy and interactive affordances.
- [x] Make private formation grids safe at 320 px.
- [x] Harmonize connexion, compte, and isolated bio without changing auth or copy behavior.
- [x] Keep safety help before conversion on every violence route and preserve victims/authors separation.
- [x] Verify small labels and interactive states meet contrast requirements.

## Proof matrix

Verify the following routes at **320, 390, 768, 1280, and 1440 px**, plus reduced motion and keyboard navigation:

- `/violence/`
- `/formations/victimes/1-securite/`
- `/formations/victimes/2-guerison/`
- `/formations/auteurs/2-cycle/`
- `/relations/relations-saines/` (including table behavior)
- `/parcours/bonheur/`
- `/connexion/`
- `/compte/`
- `/bio/`

Required evidence:

- no unintended horizontal overflow;
- safety/orientation content appears before conversion on violence routes;
- skip link moves keyboard focus into main content;
- navigation and TOC remain reachable at tablet/mobile sizes;
- tables scroll within their own container;
- member grids remain within the viewport at 320 px;
- visible focus, reduced motion, and measured AA contrast for small labels;
- `pnpm --dir site check`, relevant route/content validation, production build, and token-drift check pass.

## History

| Date | Event | Outcome |
| --- | --- | --- |
| 2026-08-11 | Draft created | Scope, invariants, risks, sequential execution batches, and proof matrix recorded. |
| 2026-08-11 | Readiness review passed | Spec is executable; no product decisions remain open. |
| 2026-08-11 | Implementation and verification completed | `pnpm --dir site check`: 0 errors, 33 pre-existing hints; parcours validation: 6 parcours / 36 modules; production build and `git diff --check` succeeded. Token drift recorded 9 documented `@media` exceptions. Browser verification covered violence, victims, authors, relations, parcours, connexion, compte, and bio at 320, 390, 768, 1280, and 1440 px without unintended overflow. |
| 2026-08-11 | Accessibility and responsive proof completed | The 320 px table measured client width 251 px and scroll width 300 px with local `overflow: auto`; the skip link focused main content and keyboard navigation reached the summary; mobile TOC was collapsed at 101 px high with article content beginning at 526 px; reduced motion resolved to 0.00001 s. Gamification is absent on violence/formations and retained elsewhere. |
| 2026-08-11 | Verification caveats recorded | The private member route redirects without authentication, so its 320 px grid is proven by source/build only. Local Clerk authentication cannot be exercised because the publishable key is unavailable. |

## Current Chantier Flow

`complete` · foundation → public reading surfaces → learning surfaces → account and bio → verification all completed.

## Closure evidence

- `pnpm --dir site check`: 0 errors, 33 pre-existing hints.
- Parcours validation: 6 parcours, 36 modules, resolved routes.
- Production build: successful. `git diff --check`: successful.
- Token-drift check: 9 documented `@media`-query exceptions; CSS variables cannot be used as media-query conditions.
- Browser coverage at 320, 390, 768, 1280, and 1440 px: violence, victims, authors, relations, parcours, connexion, compte, and bio had no unintended horizontal overflow.
- At 320 px, the relations table used a 251 px client area, 300 px scroll width, and local `overflow: auto`.
- The skip link focused main content; keyboard navigation then reached the summary. Mobile TOC was collapsed to 101 px, with the article beginning at 526 px. Reduced motion resolved to 0.00001 s.
- Gamification is absent from violence and formation routes and remains available on other eligible surfaces.

## Residual verification caveats

- The private member route redirects without authentication, so its narrow-grid behavior is evidenced by source review and the successful build, not an authenticated browser session.
- Local Clerk authentication cannot be verified because its publishable key is not configured in this environment.

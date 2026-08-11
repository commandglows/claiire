---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "claiire"
created: "2026-08-11"
created_at: "2026-08-11 16:07:40 UTC"
updated: "2026-08-11"
updated_at: "2026-08-11 16:43:05 UTC"
status: complete
source_skill: 100-sg-spec
source_model: "GPT-5 Codex"
scope: "homepage visual redesign for the public Astro site"
owner: Diane
confidence: high
user_story: "En tant que visiteuse du site public Claiire, je veux comprendre immédiatement où trouver de l'aide, choisir un chemin adapté à ma situation et approfondir ensuite les ressources de santé et de bien-être, afin d'avancer dans une expérience protectrice, claire et fidèle à la marque."
risk_level: medium
security_impact: none
docs_impact: yes
linked_systems:
  - "site/src/pages/index.astro"
  - "site/src/layouts/StaticPageLayout.astro"
  - "site/src/components/ParcoursGrid.astro"
  - "site/src/components/ParcourCard.astro"
  - "site/src/components/layout/SiteHeader.astro"
  - "site/src/styles/global.css"
  - "site/src/scripts/parcours-tracker.js"
  - "site/src/config/parcours.js"
depends_on:
  - artifact: "shipglows_data/branding/visual-identity.md"
    artifact_version: "1.1.0"
    required_status: reviewed
  - artifact: "shipglows_data/branding/brand-rules.md"
    artifact_version: "1.1.0"
    required_status: reviewed
  - artifact: "shipglows_data/branding/messaging-pillars.md"
    artifact_version: "1.2.0"
    required_status: reviewed
  - artifact: "shipglows_data/technical/design-system-authority.md"
    artifact_version: "unknown"
    required_status: active
  - artifact: "shipglows_data/workflow/specs/claiire-site-responsive-redesign.md"
    artifact_version: "1.0.0"
    required_status: complete
  - artifact: "shipglows_data/workflow/specs/claiire-site-desktop-design-pass.md"
    artifact_version: "1.0.0"
    required_status: complete
supersedes: []
evidence:
  - "Operator requested the complete homepage redesign after the technical removal of Starlight on 2026-08-11."
  - "Baseline shipglows_data/workflow/verification/claiire-home-crimson-editorial-redesign/claiire-home-before-desktop.png at 1440px shows a homepage still visually contained in article chrome and repeated card surfaces."
  - "Baseline shipglows_data/workflow/verification/claiire-home-crimson-editorial-redesign/claiire-home-before-mobile.png at 390px shows excessive page length and dense repeated parcours cards."
  - "Project design critique selected the Crimson Nocturne editorial direction: fewer cards, localized crimson light, and a safety -> orientation -> deepening narrative."
  - "Accessibility and sensitive-topic review identified hierarchy, landmark, active-navigation, list, progress semantics, compact-text, and overlap risks directly relevant to the visual redesign."
next_step: "Operator review, then commit/release if requested"
---

## Title

Claiire — Crimson Nocturne editorial homepage redesign

## Status

`complete` — the bounded redesign and proportional browser proof completed on 2026-08-11. Commit, deployment, route changes, content-claim changes and every `Scope Out` item remain unauthorized.

## User Story

En tant que visiteuse du site public Claiire, je veux comprendre immédiatement où trouver de l'aide, choisir un chemin adapté à ma situation et approfondir ensuite les ressources de santé et de bien-être, afin d'avancer dans une expérience protectrice, claire et fidèle à la marque.

Trigger: arrival on `/` from navigation, search, a shared link, or direct entry on mobile, tablet, or desktop.

Observable result: the page presents a legible and visually ordered progression — safety, then two separate violence-oriented entry paths, then complementary wellbeing content — in a distinctive Crimson Nocturne editorial composition that no longer resembles a documentation article.

## Minimal Behavior Contract

When a visitor opens the Claiire homepage, the page must immediately present the brand promise and a clearly visible safety resource, then guide the visitor toward the exposed-person path first or the distinct responsibility-focused path for a person concerned by their own behavior, before offering the six complementary wellbeing paths; if decorative CSS, motion, or the parcours tracker is unavailable, the texts, safety resource, routes, initial progression and reading order must remain usable, and the easy-to-miss edge case is preserving this hierarchy without allowing the visually lighter wellbeing content or the two violence cards to create false equivalence.

## Success Behavior

- Given `/` loads successfully, the visitor sees a dedicated editorial hero and the immediate-safety band in the first viewport at the target desktop and mobile baseline sizes.
- The DOM and visual sequence communicate `safety -> orientation -> deepening`, with the exposed-person route first and more protective in treatment than the responsibility route.
- The two violence paths retain separate destinations, separate wording and distinct visual semantics; neither implies mediation, shared responsibility, reconciliation, or equivalence.
- The six canonical wellbeing paths remain available from the homepage in a visually unified, secondary and more compact collection.
- The approach section becomes an open editorial three-part composition, and the app preview becomes the closing visual moment while keeping “Bientôt” unambiguous.
- The homepage no longer inherits the visible article-card shell, while all non-home pages using `StaticPageLayout.astro` preserve their existing rendering.
- Header state, landmarks, list semantics, progress semantics, focus, target sizing, reduced motion and responsive behavior remain usable and verifiable.
- Existing routes, canonical parcours config and tracker data attributes continue to resolve and initialize without console errors.

## Error Behavior

- If homepage-specific styling fails, semantic HTML and source order still expose the title, safety resource, orientation links, six parcours links, approach and app note.
- If `parcours-tracker.js` is unavailable or throws, each parcours link remains navigable, its title and module count remain visible, and the initial `0%` state remains understandable without depending on color or animation.
- If the canonical parcours collection contains zero items, the page must keep a coherent wellbeing section with no broken grid or empty decorative shell; the current canonical state is six items, so this is defensive resilience rather than a product-state change.
- If content wraps more than anticipated at 320px or 200% zoom, it must reflow without overlap, clipping, horizontal scroll, hidden actions or text below the project minimum sizes.
- Decorative halos must never reduce text contrast, intercept pointer input, become accessibility-tree content or obscure focus.
- Shared layout or header changes must not alter article, landing, formation or violence routes; any such regression blocks completion and must be reverted or isolated behind a homepage-specific contract.
- No failure may silently replace, merge or redirect the victims and authors destinations, mutate progression data, introduce a third-party request, or hide the safety content.

## Problem

The current homepage has correct substantive content and useful navigation, but it remains visually enclosed by the documentation-era article chrome. Its hero, safety notice, orientation cards, six parcours cards, approach panel and app panel use repeated framed surfaces with similar intensity. This makes the page feel like a sequence of dark documentation panels instead of a premium editorial entry point.

The visual hierarchy is also too flat: safety, orientation and wellbeing compete for attention; the two violence routes appear too symmetrical; the wellbeing grid is colorful and dashboard-like; and the mobile page becomes unnecessarily long and dense. The design needs stronger narrative control without rewriting claims, changing routes or expanding this visual chantier into privacy, analytics or product-logic work.

## Solution

Implement a homepage-specialized Crimson Nocturne editorial composition using native Astro markup and centralized CSS tokens. Remove the visible prose/article shell from the home, turn crimson into localized directional light rather than panel fill, differentiate the two violence routes by role and priority, compact and unify the canonical parcours grid, and preserve all safety, content, route and progression invariants.

The page will use open space, fine separators, asymmetrical layout, restrained halos and stronger typographic rhythm to express three levels: immediate safety, choice of situation, and complementary deepening.

## Scope In

- A homepage-specific hero composition that preserves the current substantive title, tagline, CTA labels and URLs.
- Removal of visible `.prose` article chrome for the homepage only, while retaining `StaticPageLayout.astro` metadata, header, footer and shared page responsibilities.
- A recomposed immediate-safety band that preserves the current numbers, claims, label, body text and destination in this chantier.
- An open editorial treatment for “Toute ta vie est liée”, without a nested card shell.
- Asymmetrical orientation cards: exposed person first and visually protective; person concerned by their behavior clearly associated with interruption and responsibility.
- A unified and more compact rendering of all canonical wellbeing parcours, preserving the canonical config, card destinations, descriptions, module counts and tracker hooks.
- An open three-column treatment for the Claiire approach on desktop and simple separated blocks on mobile.
- A visually distinctive closing app section that keeps “Bientôt” dominant and introduces no download or conversion promise.
- Directly touched semantic improvements: one `main` containing the homepage `h1`, valid skip-link target placement, `aria-current="page"` for active header navigation, list semantics for the parcours collection and accessible progressbar semantics.
- Responsive behavior at 320px, 390px, 768px, 1280px and 1440px, including 200% zoom, keyboard focus, reduced motion, touch targets and contrast.
- Central semantic tokens in `site/src/styles/global.css`, with consumers using `var(--site-*)` and no second local token system.
- Verification that the existing gamification UI does not cover homepage safety or orientation actions; its product logic is unchanged.

## Scope Out

- Analytics, consent, PostHog, onthe.io, telemetry or tracking policy changes.
- Quick-exit behavior, neutral-destination replacement, browsing-history behavior or instructions for erasing traces.
- Any change to emergency numbers, descriptions, claims or official-resource wording.
- Routes, canonical parcours data, module data, persisted progression or tracker business logic.
- Authentication, Clerk behavior, account state or permissions.
- Expo application work or any app-platform implementation.
- Redesign of inner article, violence, formation, parcours or account pages.
- New external images, stock assets, remote fonts, external visual libraries or generated bitmap assets.
- New dependencies, scripts, services or third-party runtime code.
- Deployment, commit, push, release or production verification.
- Changes to gamification product logic, scoring, confetti rules or persistence.

## Constraints

- Preserve all substantive copy and every existing URL on the homepage.
- Preserve the safety note as visible and prioritary; this visual chantier must not revise its numbers or claims.
- Keep the exposed-person path first in DOM and visual order and make safety visibly prioritary.
- Keep the responsibility path distinct, welcoming without humiliation, and explicit about interrupting violent behavior and taking responsibility.
- Do not create false symmetry, mediation language, reconciliation pressure, shared responsibility or aggressive conversion.
- Keep wellbeing complementary and visually secondary to safety and violence orientation.
- Use only native Astro, semantic HTML and CSS; use the existing Lucide bridge if an interface icon is required.
- Add or adjust visual values only through semantic tokens in `site/src/styles/global.css`; homepage/component styles consume those tokens.
- Do not place decorative gradients or halos behind long text. Decorative layers must use `pointer-events: none` and remain hidden from assistive technology by construction.
- Preserve or improve visible focus and keyboard order.
- Interactive controls must have a minimum target of 44 by 44 CSS pixels where applicable.
- Normal mobile body copy must remain at least 16px, supporting metadata at least 14px, and body line height at least 1.5.
- Text and controls must meet the project contrast target: 4.5:1 for normal text and 3:1 for large text, controls and focus indicators.
- Motion must be optional and removed or neutralized under `prefers-reduced-motion: reduce`.
- Media-query literals and `width: 100%` remain only the documented protocol exceptions in the design-system authority.
- Preserve the canonical dark theme behavior. If a token is theme-dependent, define both theme roles required by the authority.
- Inspiration Gate: no external reference is selected; the direction derives only from the reviewed Claiire brand corpus and existing project baselines.

## Test Contract

surface: Astro 6 static/server-rendered public web homepage with Astro components, Vue gamification island, centralized CSS tokens and a small client-side parcours tracker
proof_profile: responsive editorial UI, accessibility semantics, sensitive-content hierarchy and shared-layout regression proof
proof_order:
1. Static source, canonical parcours and design-token checks
2. Production build
3. Browser rendering across the required viewport matrix
4. Keyboard, accessibility-tree, contrast and reduced-motion inspection
5. Tracker fallback and progress synchronization
6. Route activation and shared-layout regression
checklist_path: `shipglows_data/workflow/test-checklists/claiire-home-crimson-editorial-redesign.md` if a durable browser ledger is created during implementation or verification; otherwise the implementation evidence must retain the same scenario IDs and results
required_scenario_ids:
- SC-01 first-viewport hero and immediate-safety hierarchy at 390x844 and 1440x900
- SC-02 single main landmark, h1 placement and skip-link focus behavior
- SC-03 exposed-person and responsibility paths remain ordered, distinct and route-correct
- SC-04 zero, one and six canonical parcours render coherently with list semantics
- SC-05 progressbar visual and ARIA state remain synchronized, with usable no-JavaScript fallback
- SC-06 no overflow, clipping, hidden focus or unreachable action at 320, 390, 768, 1280 and 1440 CSS pixels plus 200% zoom
- SC-07 changed text, controls and focus indicators meet the specified computed contrast thresholds
- SC-08 reduced-motion and decorative-layer fallbacks preserve immediate content access
- SC-09 active desktop/mobile navigation state synchronizes `is-active` and `aria-current`
- SC-10 gamification never covers safety, orientation, parcours or footer actions
- SC-11 every homepage CTA and all eight content destinations preserve their current href and resolve without console error
- SC-12 representative non-home landing/article rendering remains materially unchanged
required_results:
- All 21 acceptance criteria are mapped to retained automated or browser evidence, with manual visual judgments labelled as such.
- The before/after evidence demonstrates removal of homepage article chrome, clearer `safety -> orientation -> deepening` hierarchy and reduced mobile density without hidden content.
- DOM evidence demonstrates one main, one h1, valid list/listitem structure, named progressbars and truthful active-navigation semantics.
- Route and tracker evidence demonstrates unchanged destinations, canonical order, selectors, attributes, initial state and synchronized stored progress.
- Computed-style and viewport evidence demonstrates the required contrast, text sizes, target sizes, focus visibility, reduced-motion behavior and absence of overlap or horizontal overflow.
- Shared-layout evidence demonstrates that homepage specialization does not leak into a representative non-home route.
- The final source diff contains no dependency, lockfile, analytics, auth, emergency-claim, route, data, telemetry or generated-output change.
exception_with_proof:
- Native-device proof is unnecessary because this scope changes no native capability; the full CSS viewport matrix and 200% zoom evidence are required instead.
- Provider, authentication, data and permission proof is limited to confirming that no related source or behavior changed.
exception_without_proof: none

Automated commands, in order:
  1. `pnpm --dir site check`
  2. `pnpm --dir site check:parcours`
  3. `pnpm --dir site build`
  4. `python3 "${SHIPGLOWS_ROOT:-$HOME/shipglows}/tools/design_system_drift_check.py" --changed --format markdown`
  5. `git diff --check`

Browser proof must execute SC-01 through SC-12 in the declared order where dependencies apply. Compare the captures retained in `shipglows_data/workflow/verification/claiire-home-crimson-editorial-redesign/`; automated checks cannot establish editorial quality. The implementation may report only the specified semantic, keyboard, target-size, contrast and responsive evidence and must not claim complete WCAG conformance without a dedicated audit.

## Dependencies

- Astro and the existing project toolchain as locked in `site/package.json` and the repository lockfile; no package addition or upgrade is authorized.
- Canonical parcours source: `site/src/config/parcours.js`.
- Canonical design-token and theme carrier: `site/src/styles/global.css`.
- Component bridge: Astro components and the existing `ClaiireIcon.astro` Lucide registry when needed.
- Layout/motion authority: the current unversioned `shipglows_data/technical/design-system-authority.md`, inspected during readiness and treated as the active source of truth, plus `StaticPageLayout.astro`, global focus rules and global reduced-motion rules. Its dependency version remains explicitly `unknown` until governance metadata is added outside this spec-only mission.
- Brand contract: reviewed `visual-identity.md` v1.1.0, `brand-rules.md` v1.1.0 and `messaging-pillars.md` v1.2.0.
- Prior completed visual contracts: responsive redesign v1.0.0 and desktop design pass v1.0.0.
- Fresh external docs: `fresh-docs not needed` — this contract changes no framework, SDK, service, API, auth, routing, build or integration behavior; it relies on established local Astro and CSS patterns.
- Runtime observability/Sentry exception: this is a static visual refactor with no new runtime service, API, state transition or error boundary. Existing build and browser console proof is the proportional diagnostics contract; no Sentry integration is introduced.

## Invariants

- `/` remains the homepage and all current homepage href values remain unchanged.
- The immediate-safety content remains visible, prioritary and before the orientation section in source order.
- The exposed-person path remains first and routes to `/formations/victimes/`.
- The behavior-responsibility path remains separate and routes to `/formations/auteurs/`.
- The two paths never share data, progress, CTA meaning or visual semantics.
- The canonical six-item parcours config remains the source of truth; no duplicate homepage data is introduced.
- Each parcours card keeps `data-parcour-id`, `data-module-count` and the route `/parcours/{id}` expected by `parcours-tracker.js`.
- Existing progress initializes legibly at `0%` before or without tracker execution.
- “Bientôt” remains clear; the site does not imply the app is available for download.
- Header, footer, metadata, canonical URL and non-home layout behavior remain intact.
- Gamification logic is unchanged and its rendered surface must not overlap safety or orientation actions.
- All reusable visual decisions resolve to `site/src/styles/global.css`; raw component/page literals require the authority's documented exception.
- No external network, image, script, dependency or untrusted HTML is introduced.

## Links & Consequences

- `site/src/pages/index.astro` owns homepage section markup and local composition; it consumes the shared layout and canonical parcours grid.
- `site/src/layouts/StaticPageLayout.astro` owns document landmarks, hero placement, metadata, header/footer and gamification mounting. Homepage specialization must be explicit so shared pages do not inherit its visual changes.
- `site/src/components/ParcoursGrid.astro` maps canonical config to cards and initializes `parcours-tracker.js`; changing the wrapper to `ul/li` must preserve mapping and script initialization.
- `site/src/components/ParcourCard.astro` owns card link, tracker attributes, module count, initial progress and responsive density. Accessible progress semantics must stay synchronized with tracker updates.
- `site/src/components/layout/SiteHeader.astro` receives `currentPath` and derives active navigation. Adding `aria-current` must use the same active predicate as the visual `is-active` state on desktop and mobile.
- `site/src/styles/global.css` is the only token authority and shared style carrier. Token additions can affect all pages, so names should be homepage-semantic when the role is not reusable.
- `site/src/scripts/parcours-tracker.js` is a downstream consumer of card selectors and progress elements; its interface must be preserved or updated atomically without changing product logic.
- SEO title, description, canonical metadata and substantive visible copy do not change, so no search claim or content migration is expected.
- Analytics, auth, data, API, telemetry and persistence are deliberately unaffected.

## Documentation Coherence

- This spec is the durable implementation contract and must retain evidence from readiness, implementation and verification in `Skill Run History` and `Current Chantier Flow`.
- The reviewed brand sources remain unchanged because the selected direction already conforms to them.
- `shipglows_data/technical/design-system-authority.md` remains unchanged unless implementation discovers a genuinely missing authority rule; such a discovery must reroute to documentation ownership rather than be silently encoded in component CSS.
- No README, public guide, FAQ, pricing, onboarding, support article or changelog change is required because substantive behavior, routes and claims remain unchanged.
- New browser screenshots are verification evidence, not public content, and must not overwrite the two named baselines.

## Edge Cases

### ZOMBIES coverage

- Z — Zero: if the canonical parcours array is empty, the wellbeing section remains structurally coherent and does not render broken card chrome. Current applicability note: production config currently has six paths, so the implementation must not add fake fallback paths.
- O — One: one parcours card must retain valid list semantics, one navigable link, one module count and one named initial progressbar without relying on grid multiplicity.
- M — Many: all six configured cards render once, in canonical order, with unique IDs, correct links, compact responsive behavior and no tracker collisions.
- B — Boundary behaviors: prove 320, 390, 768, 1280 and 1440 CSS-pixel widths plus 200% zoom; verify no overlap at first-viewport limits, no horizontal overflow and no focus hidden by sticky or gamification layers.
- I — Interface definition: `config -> ParcoursGrid -> ParcourCard DOM/data attributes -> parcours-tracker.js` remains intact; header `currentPath -> active predicate -> class + aria-current` remains synchronized.
- E — Exceptional behavior: when tracker JavaScript is unavailable, links, content, module counts and initial progress remain readable and usable; when motion is reduced, content appears without transform-dependent access.
- S — Simple scenarios, simple solutions: native Astro/HTML/CSS and existing components only; no new dependency, client framework, external image, canvas or bespoke design runtime.

Additional visual and content edge cases:

- Long French words, apostrophes and title wrapping at 320px and 200% zoom.
- Six parcours descriptions of unequal length without misaligned or clipped actions.
- Focus on cards and header links over gradients and shadows.
- `prefers-reduced-motion: reduce` with no transform movement or smooth-scroll dependency.
- Decorative halo disabled, unsupported `color-mix()`, or CSS partially unavailable.
- Header menu open at 320x568 with all links reachable and no homepage action covered.
- Gamification surface present after its existing trigger without covering safety, orientation or footer actions.
- Direct fragment navigation to `#orientation`, `#bien-etre` and `#app` without sticky-header occlusion.

## Implementation Tasks

- [x] Task 1: Establish homepage-specific semantic tokens and remove visual-value drift
  - File: `site/src/styles/global.css`
  - Action: Add or refine semantic homepage roles for open canvas, localized crimson light, safety band, orientation-safe, orientation-responsibility, separators, compact parcours and app finale. Keep theme behavior, focus, motion and breakpoint protocol exceptions centralized.
  - User story link: Creates the distinctive, readable Crimson Nocturne foundation.
  - Depends on: Reviewed brand and active design-system authority.
  - Validate with: Design-system drift check and computed-style inspection in both theme blocks where applicable.
  - Notes: Do not introduce raw visual literals in page or component styles; prefer a small semantic set over proliferating numeric aliases.

- [ ] Task 2: Isolate the homepage shell and place its title within the main landmark
  - Files: `site/src/layouts/StaticPageLayout.astro`, `site/src/styles/global.css`
  - Action: Create an explicit homepage rendering path or modifier that keeps header, footer and metadata but places the homepage hero inside the single `main`, aligns the skip-link target before the `h1`, and removes inherited article-card chrome only on `/`.
  - User story link: Makes the homepage a true editorial entry point while preserving accessible navigation.
  - Depends on: Task 1.
  - Validate with: DOM landmark inspection, skip-link keyboard test, home screenshot and representative non-home layout regression.
  - Notes: Do not generalize the specialized hero to all landing pages.

- [ ] Task 3: Recompose hero, safety, introduction, orientation, approach and app finale
  - File: `site/src/pages/index.astro`
  - Action: Implement the open asymmetrical hero, immediately visible safety band, editorial introduction, semantically differentiated orientation routes, three-part approach and app finale using existing substantive copy and href values exactly.
  - User story link: Establishes the safety -> orientation -> deepening narrative.
  - Depends on: Tasks 1 and 2.
  - Validate with: Copy/href diff review, DOM order inspection, target-size/contrast checks and five-viewport browser captures.
  - Notes: Person exposed remains first and visually protective; responsibility path must not be softened into equivalence. Halos stay outside text reading zones.

- [x] Task 4: Make the canonical parcours collection semantic and resilient
  - File: `site/src/components/ParcoursGrid.astro`
  - Action: Render the collection with list semantics while preserving canonical order, props and one-time tracker initialization. Define a coherent zero-item rendering without inventing content.
  - User story link: Keeps wellbeing resources complete but secondary and structurally accessible.
  - Depends on: Task 1.
  - Validate with: `pnpm --dir site check:parcours`, DOM list inspection and zero/one/six-item reasoning against the canonical mapping.
  - Notes: Do not duplicate or reshape parcours data in the homepage.

- [x] Task 5: Compact and harmonize parcours cards with accessible progress
  - File: `site/src/components/ParcourCard.astro`
  - Action: Replace dashboard-like visual weight with a unified dark/bordeaux card base and controlled identity accents, compact mobile layout, minimum readable text, stable 44px controls, and a named `role="progressbar"` exposing min/max/now while retaining tracker selectors and data attributes.
  - User story link: Makes all six complementary paths easier to scan without competing with violence orientation.
  - Depends on: Tasks 1 and 4.
  - Validate with: Tracker initialization, ARIA inspection, route activation, 320/390 captures and reduced-motion mode.
  - Notes: If tracker currently updates only visual width/text, update the existing DOM synchronization minimally; do not alter progression logic.

- [x] Task 6: Synchronize visible and semantic active navigation state
  - File: `site/src/components/layout/SiteHeader.astro`
  - Action: Add `aria-current="page"` to the active desktop and mobile navigation entry using the existing active predicate, without changing routes, menu structure, auth behavior or visual hierarchy outside the homepage needs.
  - User story link: Makes orientation through the site understandable for keyboard and assistive-technology users.
  - Depends on: None; may run in parallel with Tasks 1 through 5 and must complete before Task 7.
  - Validate with: DOM inspection on `/` and representative section routes, keyboard navigation and Astro check.
  - Notes: If the homepage has no matching sidebar entry, preserve the truthful no-active-item state rather than assigning a false current page.

- [x] Task 7: Verify overlap, fallback and shared-layout behavior
  - Files: `site/src/layouts/StaticPageLayout.astro`, `site/src/pages/index.astro`, `site/src/components/ParcoursGrid.astro`, `site/src/components/ParcourCard.astro`, `site/src/components/layout/SiteHeader.astro`, `site/src/styles/global.css`
  - Action: Run the complete automated and browser proof sequence, repair only in-scope regressions, and record screenshots and findings without changing gamification product logic.
  - User story link: Proves the redesigned entry remains usable across device, assistive and failure conditions.
  - Depends on: Tasks 1 through 6.
  - Validate with: Every command and browser scenario in `Test Contract`.
  - Notes: A shared-layout regression, missing route, hidden safety action, broken tracker or unexplained token literal blocks completion.

## Acceptance Criteria

- [x] CA 1: Given `/` at 390x844 and 1440x900, when the page first renders, then the hero and immediate-safety resource are visible within the first viewport and safety is visually prioritary to orientation and wellbeing.
- [x] CA 2: Given the homepage DOM, when landmarks are inspected, then exactly one `main` contains the `h1`, homepage hero, safety resource and primary content, and the skip link focuses content before the `h1` without sticky-header occlusion.
- [x] CA 3: Given the homepage visual shell, when compared with both named baselines, then the page no longer appears inside an article card, the hero reads as an open editorial scene, and repeated bordered panels are materially reduced.
- [x] CA 4: Given the two orientation routes, when read visually and with styles disabled, then the exposed-person route appears first, retains `/formations/victimes/`, emphasizes protection, and is not falsely equivalent to the distinct responsibility route at `/formations/auteurs/`.
- [x] CA 5: Given either orientation card, when its content is read out of surrounding context, then its existing title, description and destination remain unchanged and do not imply mediation, reconciliation or shared responsibility.
- [x] CA 6: Given the canonical parcours config has six entries, when `/` renders, then exactly six cards appear once in canonical order with unchanged title, description, module count, icon identifier, route and tracker attributes.
- [x] CA 7: Given one parcours card before tracker execution, when assistive semantics are inspected, then the card is a list item containing one link and a named progressbar with `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-valuenow="0"` and visible `0%` text.
- [x] CA 8: Given `parcours-tracker.js` executes with stored progress, when progress updates, then visual fill, visible percentage and `aria-valuenow` stay synchronized without changing the route or module-count contract.
- [x] CA 9: Given tracker JavaScript is blocked or fails, when the homepage is used, then every parcours link, title, module count, description and initial progress remains readable and navigable with no dependency on animation.
- [x] CA 10: Given an empty canonical parcours collection in a bounded test fixture or reasoned component check, when the grid renders, then no broken list/card shell appears and the wellbeing section remains coherent without fabricated parcours.
- [x] CA 11: Given widths 320, 390, 768, 1280 and 1440 plus 200% zoom, when the full homepage is scrolled and interacted with, then there is no horizontal overflow, overlap, clipping, hidden focus, truncated text or unreachable action.
- [x] CA 12: Given 320px and 390px widths, when parcours and orientation cards render, then normal body text is at least 16px, metadata is at least 14px, controls meet 44x44 where applicable, and the page is materially more compact than the mobile baseline without hiding content.
- [x] CA 13: Given computed styles on all changed text, controls and focus indicators, when contrast is measured, then normal text reaches 4.5:1 and large text, controls and focus indicators reach 3:1 against their actual rendered backgrounds.
- [x] CA 14: Given `prefers-reduced-motion: reduce`, when the homepage loads and receives hover/focus interactions, then no content access depends on transforms, smooth scrolling, confetti or animated displacement.
- [x] CA 15: Given decorative halos and gradients are present, when inspected at all proof widths, then they do not sit behind long copy, reduce measured contrast, receive focus, intercept pointer events or appear in the accessibility tree.
- [x] CA 16: Given header navigation on desktop and mobile, when a configured section route is current, then the same predicate controls `is-active` and `aria-current="page"`; when no route is truthfully active, no false `aria-current` is emitted.
- [ ] CA 17: Given existing gamification behavior is triggered on `/`, when its UI appears, then it does not cover or block hero, safety, orientation, parcours or footer actions at any proof viewport.
- [ ] CA 18: Given every homepage CTA and content card, when activated, then the current fragment or route is unchanged, resolves correctly and produces no console error.
- [x] CA 19: Given a representative non-home landing/article page, when shared layout and global styles are rebuilt, then its header, hero, main, prose shell, footer and responsive behavior remain materially unchanged.
- [x] CA 20: Given the final diff, when automated proof runs, then Astro check, parcours config check, production build, design-system drift review and diff whitespace check all pass with no unexplained finding.
- [x] CA 21: Given the final implementation report, when accessibility evidence is summarized, then it states the proven checks and does not claim complete WCAG conformance without a dedicated audit.

## Test Strategy

1. Run static and configuration checks before browser work: Astro check, canonical parcours check, production build, token drift scan and diff check.
2. Start a local built preview or the repository-standard browser target without introducing a new server script.
3. Capture `/` at 320x568, 390x844, 768x1024, 1280x800 and 1440x900 in the default dark theme.
4. At each viewport, inspect first-viewport safety visibility, horizontal overflow, section order, route-card asymmetry, content wrapping, footer completion and gamification overlap.
5. At 320px and 390px, compare total page density and card compactness with `claiire-home-before-mobile.png`; at 1440px compare open composition with `claiire-home-before-desktop.png`.
6. Test 200% zoom, full keyboard traversal, skip link, focus visibility, fragment targets, menu reachability and all links/routes.
7. Inspect accessibility tree/DOM for one main landmark, one h1, heading order, list/listitem structure, named progressbars and synchronized `aria-current`.
8. Emulate reduced motion and temporarily block tracker JavaScript to prove graceful fallback.
9. Measure actual computed foreground/background contrast for changed small text, normal text, CTA, border/focus and semantic states.
10. Inspect browser console for errors and verify `parcours-tracker.js` updates progress without selector or ARIA drift.
11. Render one representative non-home page to prove homepage isolation in the shared layout.
12. Retain before/after evidence and state any manual visual judgment separately from automated results.

## Risks

- High product-trust risk: the safety resource may be pushed below the first viewport by an oversized hero. Mitigation: first-viewport acceptance at 390x844 and 1440x900, DOM order and explicit completion blocker.
- High sensitive-content risk: equal card weight may create false balance between violence experienced and responsibility for violent behavior. Mitigation: exposed-person path first, protective treatment, distinct semantics and content-diff review.
- Medium usability risk: open editorial spacing may make the page longer rather than more concise. Mitigation: compact parcours cards, mobile total-density comparison and orientation visibility checks.
- Medium accessibility risk: small editorial labels or metadata may remain below readable mobile thresholds. Mitigation: minimum 16px/14px criteria and computed-style proof.
- Medium routing risk: markup refactoring may lose a CTA, fragment, parcours href or active-navigation state. Mitigation: activate every route and compare hrefs against the source baseline.
- Medium integration risk: list/progress markup changes may break tracker selectors or visual/ARIA synchronization. Mitigation: preserve data attributes, execute tracker proof and test JavaScript failure.
- Medium visual risk: crimson halos may sit beneath copy or focus and weaken contrast. Mitigation: localized non-interactive layers, measured contrast and multi-width screenshots.
- Medium regression risk: changing `StaticPageLayout.astro` or global tokens may affect shared article and landing layouts. Mitigation: explicit homepage branch/modifier and representative non-home browser regression.
- Low performance risk: excessive layered gradients or shadows may increase paint cost. Mitigation: CSS-only bounded pseudo-elements, no images, no canvas, restrained layer count and no continuous animation.
- Security impact: none despite the public sensitive-content surface because this bounded visual and semantic refactor changes no auth, authorization, data, API, telemetry, dependency, external request, trust boundary, security control or emergency claim. Its sensitive-topic hierarchy is a product-safety invariant, and the separate privacy/quick-exit gaps remain explicitly unresolved outside this scope.

### OWASP Security Gate

- Categories considered: A02 Security Misconfiguration, A03 Software Supply Chain Failures, A05 Injection and A06 Insecure Design.
- Trust/data boundaries: unchanged; the page renders repository-owned static content and canonical local config only.
- A02: unaffected because deployment, headers, environment configuration, analytics and consent are out of scope.
- A03: unaffected because no dependency, registry, lockfile, third-party script or build-provider change is allowed.
- A05: unaffected because no untrusted HTML, dynamic content interpolation, command, query, URL builder or external content source is introduced.
- A06: sensitive hierarchy is covered as a product-design invariant, but quick exit, trace erasure and analytics policy remain explicitly outside this chantier and require separate ownership if pursued.
- Selected ASVS v5.0.0 requirements: not applicable to this CSS/semantic-markup-only contract; no authentication, authorization, input handling, data storage or security control is modified.
- Proof: source diff scope, dependency/lockfile non-change, Astro check/build, route checks and browser DOM inspection.
- Residual gap and owner: privacy/analytics consent, quick exit and trace-erasure safety remain separate product/security work; this spec neither resolves nor weakens them.

## Execution Notes

Read first, in order:

1. `shipglows_data/branding/visual-identity.md`
2. `shipglows_data/branding/brand-rules.md`
3. `shipglows_data/branding/messaging-pillars.md`
4. `shipglows_data/technical/design-system-authority.md`
5. `site/src/pages/index.astro`, then `StaticPageLayout.astro`, parcours components, tracker, header and relevant `global.css` sections.

Implementation approach:

1. Inventory existing homepage and shared tokens; define the smallest semantic additions centrally.
2. Isolate homepage shell and landmark behavior before composing sections.
3. Recompose homepage content without changing substantive strings or hrefs.
4. Make parcours list/progress semantics and compact visuals coherent with the canonical config/tracker interface.
5. Add `aria-current` using the established navigation predicate.
6. Run automated checks before browser refinement, then iterate from 320/390 outward to desktop.
7. Verify a representative non-home route after every shared-layout or global-token adjustment.

Forbidden implementation shortcuts:

- No external inspiration asset, image, font, package, component library or runtime script.
- No page-local raw palette, spacing, typography, shadow, radius, motion or breakpoint system.
- No duplicated parcours array, copied tracker logic or homepage-specific progression state.
- No generic rewrite of all landing heroes or prose shells.
- No content rewrite disguised as hierarchy work.
- No change to analytics, auth, emergency claims, gamification logic or inner-page design.

Stop or reroute if:

- implementation requires changing emergency numbers/claims, analytics/consent, quick exit, trace erasure, auth, routes, data or progression behavior;
- a new dependency, third-party request or untrusted HTML becomes necessary;
- the design-system authority is insufficient or conflicting and cannot express the required roles without governance repair;
- shared-layout isolation cannot preserve representative non-home pages;
- exact substantive-copy preservation conflicts with a required accessibility name or semantic correction beyond directly touched markup;
- visual proof cannot be collected at the required widths.

Build-time and diagnostics expectations:

- Record the implementation and verification build time in both UTC and Europe/Paris in the eventual execution evidence.
- Preserve safe browser-console diagnostics and do not log route-profile, violence-path choice or progression details as part of this visual work.
- Do not modify generated `dist`, `.astro` or `.vercel` output as source files.

### Adversarial Review

- Failure: the hero becomes more dramatic but pushes urgency down. Correction in contract: first-viewport safety acceptance and safety before orientation in DOM.
- Failure: asymmetry becomes stigmatizing or hides the responsibility path. Correction in contract: both paths remain available and welcoming, while safety priority and responsibility remain explicit.
- Failure: fewer cards create more whitespace and a longer mobile page. Correction in contract: compact parcours criteria and baseline density comparison.
- Failure: editorial labels use fashionable but undersized type. Correction in contract: explicit 16px body and 14px metadata floors plus computed proof.
- Failure: refactoring cards or hero actions loses a route. Correction in contract: preserve hrefs and activate every homepage route.
- Failure: semantic progress markup breaks tracker selectors or stale ARIA values. Correction in contract: retain interface attributes and prove synchronized updates/fallback.
- Failure: halos reduce contrast under text. Correction in contract: localized pointerless layers, no long-copy overlap and measured contrast.
- Failure: shared `StaticPageLayout` or global-token edits regress inner pages. Correction in contract: homepage-specific isolation and representative non-home browser proof.

Adversarial verdict: the spec remains implementable without open product decisions. The major safety-policy findings intentionally excluded from this visual chantier are recorded as residual separate ownership, not silently treated as resolved.

## Open Questions

None.

## Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
|----------|-------|-------|--------|--------|-----------|
| 2026-08-11 | 100-sg-spec | GPT-5 Codex | Created the full Crimson Nocturne editorial homepage redesign contract from operator direction, reviewed brand authority, current code evidence and adversarial design/accessibility findings. | draft | Readiness review |
| 2026-08-11 | 101-sg-ready | GPT-5 Codex | Reviewed structure, user-story fit, behavior, scope, ordering, linked consequences, design-token authority, proof, adversarial coverage and proportional OWASP impact; added the required structured proof contract and metadata. | ready | Implementation |
| 2026-08-11 | 006-sg-design | GPT-5 Codex | Implemented the bounded homepage shell, Crimson Nocturne editorial composition, semantic parcours list/progress contract and synchronized active navigation; final Astro check, parcours check and production build passed at 16:27 UTC / 18:27 Europe/Paris, with token drift review and diff check retained separately. | implemented | Browser verification |
| 2026-08-11 | 006-sg-design | GPT-5 Codex | Applied the focused 390px browser-failure repair: compact tokenized mobile hero title and DOM narrative reordered to safety -> orientation -> explanatory welcome -> wellbeing, preserving all copy and destinations. | browser-fix implemented | Retest SC-01 and SC-06 at 390x844 and 320px |
| 2026-08-11 | 103-sg-verify | GPT-5 Codex | Verified responsive rendering at 320, 390, 640, 720, 768, 1280 and 1440px; skip-link focus, landmarks, route status, active navigation, stored progress synchronization, reduced motion and computed contrast. Corrected the scoped mobile-title rule and homepage eyebrow contrast. Automated checks passed at 16:38 UTC / 18:38 CEST. | complete with local-environment caveat | Operator review; commit/release only if requested |

## Current Chantier Flow

- `100-sg-spec`: complete; draft contract created on 2026-08-11 with ZOMBIES coverage, OWASP lens, adversarial review and proof matrix.
- `101-sg-ready`: ready on 2026-08-11; structure, scope, consequences, token authority, task ordering, proof and security-impact rationale passed.
- `102-sg-start`: implementation complete on 2026-08-11; bounded source changes and automated checks passed without route, dependency, analytics, auth, emergency-claim or canonical-data changes.
- `006-sg-design`: implemented on 2026-08-11; tokenized editorial redesign, homepage landmark isolation, parcours semantics/progress synchronization and active-navigation semantics are present.
- `103-sg-verify`: complete on 2026-08-11; 390px renders the title at 28.86px on five lines, safety at 653px and orientation at 1013px, with no horizontal overflow. All nine homepage content destinations returned 200; stored progress remained synchronized at 50%; reduced-motion styles resolved to effectively zero duration and no transform; sampled changed text passed after the eyebrow contrast repair.
- `104-sg-end`: complete on 2026-08-11. The local browser could not mount the pre-existing gamification island because the development environment lacks a Clerk publishable key and served one stale Vite optimized dependency; the production build passes and the redesign does not change gamification logic or dependencies. This is retained as an environment caveat, not hidden as redesign proof.
- `005-sg-ship`: not started; commit and deployment are outside this spec-only mission.
- Next step: operator visual review, then commit and release only if explicitly requested.

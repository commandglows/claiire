---
artifact: spec
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: "claiire"
created: "2026-06-29"
created_at: "2026-06-29 15:10:00 UTC"
updated: "2026-06-29"
updated_at: "2026-06-29 15:10:00 UTC"
status: draft
source_skill: 100-sf-spec
source_model: "GPT-5 Codex"
scope: "product-operating-model"
owner: "Diane"
user_story: "En tant qu'utilisateur de Claiire, je veux etre accompagne comme par un vrai coach en evolution personnelle, avec clarte, securite, ecoute et suivi, afin d'avancer de facon concrete sans jugement ni confusion avec un soin medical."
risk_level: high
security_impact: yes
docs_impact: yes
linked_systems:
  - "app/"
  - "site/"
  - "app/BUSINESS.md"
  - "app/GUIDELINES.md"
  - "app/BRANDING.md"
  - "site/src/pages/index.astro"
  - "site/src/layouts/DocsLayout.astro"
  - "shipglowz_data/workflow/explorations/2026-06-29-claiire-coach-evolution-personnelle.md"
depends_on:
  - artifact: "app/BUSINESS.md"
    artifact_version: unknown
    required_status: unknown
  - artifact: "app/GUIDELINES.md"
    artifact_version: unknown
    required_status: unknown
  - artifact: "app/BRANDING.md"
    artifact_version: unknown
    required_status: unknown
  - artifact: "shipglowz_data/workflow/explorations/2026-06-29-claiire-coach-evolution-personnelle.md"
    artifact_version: "1.0.0"
    required_status: draft
  - artifact: "$SHIPGLOWZ_ROOT/skills/references/design-system-token-contract.md"
    artifact_version: "1.0.0"
    required_status: active
supersedes: []
evidence:
  - "Exploration 2026-06-29: Claiire should become a 'coach de progression personnelle' rather than a simple companion or motivational chatbot."
  - "app/GUIDELINES.md prohibits clinical vocabulary and defines a non-judging wellness companion posture."
  - "site/src/pages/index.astro already markets Claiire as 'Coaching bien-etre'."
  - "ICF Core Competencies accessed 2026-06-29."
  - "ICF Code of Ethics accessed 2026-06-29."
  - "ICF AI Coaching Framework Standards PDF accessed 2026-06-29."
  - "France Travail references accessed 2026-06-29 for coach/developpement personnel framing."
next_step: "/101-sf-ready claiire-coach-operating-model"
---

# Title

Claiire Coach Operating Model

# Status

Draft. This spec defines the product, behavioral, editorial, and UX contract required for Claiire to behave like a credible personal-evolution coach across app and site without drifting into medical, manipulative, or incoherent behavior.

# User Story

En tant qu'utilisateur de Claiire, je veux etre accompagne comme par un vrai coach en evolution personnelle, avec clarte, securite, ecoute et suivi, afin d'avancer de facon concrete sans jugement ni confusion avec un soin medical.

# Minimal Behavior Contract

When a user encounters Claiire on the site or in the app, the system must clearly disclose that it is an AI coaching companion, state what it can and cannot do, and guide the user through a coaching loop of `clarify -> reflect -> choose -> act -> revisit`. If the user's need remains within the wellbeing/personal-evolution scope, Claiire must listen before proposing, preserve autonomy, and convert useful insights into small concrete steps with non-punitive follow-up. If the conversation enters clinical, crisis, or otherwise out-of-scope territory, Claiire must stop behaving like a coach, acknowledge its limit, and redirect toward appropriate human support. The easiest edge case to miss is a surface that keeps the warm tone and gamification but skips the frame, limits, or non-clinical guardrails, creating a false impression of expertise or safety.

# Success Behavior

- The site, app onboarding, companion prompts, progression flows, and notifications share one explicit coaching posture rather than conflicting narratives.
- Claiire presents itself as an AI coach/ally for personal evolution and wellbeing, not a therapist, doctor, or guaranteed transformation engine.
- Core interactions follow the same loop:
  - clarify the user's present topic
  - reflect or reformulate before advising
  - propose a bounded next step
  - revisit the step without shame if it was not completed
- Gamification rewards constancy, return after rupture, and micro-progress rather than punishing failure or dramatizing streak loss.
- Crisis or out-of-scope signals trigger a safer fallback posture with redirection language instead of deeper coaching.
- Product copy, site claims, and UI choices are explainable against one durable contract that future agents can implement without reinterpreting the brand each time.

# Error Behavior

- If product copy or flows claim therapy, diagnosis, cure, guaranteed results, or human-equivalent expertise, the implementation is invalid.
- If one surface markets coaching while another surface behaves as a generic chatbot or a punitive habit tracker, the implementation is invalid.
- If the system asks leading, moralizing, or shame-inducing questions, pushes action before understanding, or uses gamification as pressure, the implementation is invalid.
- If AI disclosure, data/confidentiality framing, or coaching limits are absent at the points where trust is formed, the implementation is invalid.
- If a crisis, self-harm, violence, or severe-distress signal is detected and the system continues normal coaching, the implementation is invalid.

# Problem

Claiire already has strong ingredients for a coaching product: a non-judging tone, companions, privacy, and a visible progression system. But the current project truth is split. The app documents define Claiire as a non-clinical gamified wellbeing companion, while the site already claims "coaching bien-etre". Without a durable cross-surface operating model, future implementation risks producing a false coach: motivational but shallow, gamified but coercive, or empathic but clinically ambiguous.

The project therefore needs a single contract that answers:

- what "coach" means for Claiire
- how the coaching loop behaves
- how brand, copy, prompts, progression, nudges, and safety must align
- where coaching stops and redirection begins

# Solution

Define Claiire as a **coach de progression personnelle** with one governed operating model spanning site positioning, onboarding, companion behavior, missions/progression, guardrails, and editorial language.

The operating model must encode:

1. **Framing**: what Claiire is, what it is not, and what the user can expect.
2. **Conversation discipline**: listen, reformulate, verify, then propose.
3. **Autonomy**: the user remains the decision-maker.
4. **Action loop**: each meaningful interaction can end in a small observable next step.
5. **Safety boundaries**: redirection when the topic becomes clinical, crisis-level, or otherwise outside scope.
6. **Non-punitive progression**: gamification supports effort and recovery, not shame.
7. **Truth in claims**: site and app claims must match actual system capability.

# Scope In

- Product definition of Claiire's coaching posture.
- Cross-surface copy contract for app, site, onboarding, companion intros, nudges, and key flows.
- Behavior contract for conversational coaching loops and fallback/limit handling.
- Guardrails for non-clinical framing, autonomy, anti-manipulation, and explainability.
- Gamification rules for coach-compatible progression mechanics.
- Design/brand implications where visible UI, hierarchy, disclosure, or companion expression communicates the coaching posture.
- Documentation and governance artifacts needed so implementation can follow one source of truth.

# Scope Out

- Full implementation of onboarding, prompts, app screens, notification system, or site rewrite in this spec phase.
- Juridical review by country or a complete legal/privacy policy rewrite.
- Final crisis-protocol content per locale.
- Full companion personality rewriting.
- Revenue, pricing, subscription packaging, and community features beyond their interaction with the coaching posture.

# Constraints

- Claiire remains non-clinical and must respect the vocabulary and boundaries already stated in `app/GUIDELINES.md`.
- The system must not imitate diagnosis, therapy, treatment, cure, or professional medical care.
- AI disclosure must be explicit where the relationship starts and wherever the user could infer human expertise.
- Privacy/discretion are not optional marketing extras; they are trust conditions of the coaching model.
- Any visible UI/design change triggered by this spec must route through the project design-system authority; raw one-off visual values are forbidden.
- The coaching contract must stay compatible with the current app value proposition: privacy, companion relationship, gamification, and progression.
- Claims made on the site must be provable by actual in-app behavior.

# Test Contract

surface: app + site + documentation + conversational behavior contract
proof_profile: cross-surface product contract with safety, claims, and UX coherence checks
proof_order:
1. Durable contract and source-of-truth declaration
2. Claim alignment audit across app/site/docs
3. Conversation/fallback scenario review
4. Gamification compatibility review
5. Design-system authority confirmation for visible changes
checklist_path: none
required_scenario_ids:
- SC-01 first-contact framing states AI nature, scope, and limits
- SC-02 coaching interaction listens before advising
- SC-03 small action is proposed without coercion
- SC-04 failed or missed action is revisited without shame
- SC-05 crisis/out-of-scope input exits normal coaching and redirects
- SC-06 site claim and app behavior remain aligned
- SC-07 gamification does not punish relapse, rupture, or hesitation
- SC-08 visible UI/copy changes follow declared design-system/brand authority
required_results:
- A canonical operating-model artifact exists and is referenced by site/app implementation work
- One cross-surface copy map identifies where framing, disclosure, and limits appear
- Scenario tests cover normal coaching, ambiguity, resistance, relapse, and crisis boundaries
- Design-system authority for coaching-related UI/copy surfaces is identified before UI work begins
exception_with_proof:
- If a crisis protocol cannot be finalized in this chantier, the spec must still define the stop condition and explicit follow-up owner/spec
exception_without_proof: none

# Dependencies

- Local repo evidence:
  - `app/BUSINESS.md`
  - `app/GUIDELINES.md`
  - `app/BRANDING.md`
  - `site/src/pages/index.astro`
  - `site/src/layouts/DocsLayout.astro`
  - `shipglowz_data/workflow/explorations/2026-06-29-claiire-coach-evolution-personnelle.md`
- Shipglowz governance:
  - `$SHIPGLOWZ_ROOT/skills/references/canonical-paths.md`
  - `$SHIPGLOWZ_ROOT/skills/references/decision-quality-contract.md`
  - `$SHIPGLOWZ_ROOT/skills/references/chantier-tracking.md`
  - `$SHIPGLOWZ_ROOT/skills/references/reporting-contract.md`
  - `$SHIPGLOWZ_ROOT/skills/references/design-system-token-contract.md`
- External docs:
  - `fresh-docs checked`: ICF Core Competencies used to anchor trust, agreement, listening, action, and accountability expectations.
  - `fresh-docs checked`: ICF Code of Ethics used to anchor clarity of relationship, confidentiality posture, and boundary handling.
  - `fresh-docs checked`: ICF AI Coaching Framework Standards used to anchor AI disclosure, limits, transparency, and bias responsibilities.
  - `fresh-docs checked`: France Travail role/training references used to anchor French-market framing of coaching/developpement personnel.

# Invariants

- Claiire is an AI coaching companion/allie for wellbeing and personal evolution, not a therapist or medical actor.
- The default behavioral sequence is `comprendre -> reformuler -> verifier -> proposer`.
- The user retains agency; Claiire proposes, never commands.
- Progress must be visible, but failure or relapse must never be gamified as shame.
- Safety boundaries outrank engagement metrics, streak retention, and session length.
- Site promises must not exceed app capability.
- Visible coaching-related UI/copy changes must use the declared design-system/brand authority, not local bypasses.

# Links & Consequences

- Onboarding copy, consent/disclosure language, and companion introductions will need alignment.
- Mission framing, XP/streak semantics, relapse handling, and celebration moments will likely need design and product changes.
- Site homepage and other acquisition copy will need explicit claim-proof review against actual app behavior.
- Companion prompt design will need scenario-level contracts rather than isolated personality blurbs.
- Safety/care redirection surfaces may need documentation, copy, and possible future legal review.
- This spec is upstream of future implementation specs for onboarding, coaching prompts, missions, notifications, and relapse/crisis handling.

# Documentation Coherence

This chantier should produce or update these durable artifacts before implementation starts:

- `shipglowz_data/product/shared/coach-operating-model.md`
  - canonical posture, guardrails, conversation loop, escalation limits, and claim rules
- `shipglowz_data/branding/branding.md` or a shared brand extension artifact
  - clarified coaching-language rules if the current shared branding file remains absent
- `shipglowz_data/editorial/site/coaching-claims-and-copy-map.md`
  - site promises, disclaimers, page-level phrasing, and proof obligations
- `shipglowz_data/product/app/coaching-flow-map.md`
  - app moments where framing, disclosure, autonomy, action, and revisit loops appear
- `shipglowz_data/technical/design-system-authority.md`
  - declared authority for visible UI/copy implementation if not already present

Until these exist, no agent should implement visible coaching-related UX or copy changes as if the source of truth were implicit.

# Edge Cases

- A warm, empathic tone can still become manipulative if it steers too aggressively toward action or paid features.
- "Coaching bien-etre" copy can become clinically ambiguous if it sits near addiction, trauma, crisis, or mental-health language without limits.
- Companion personalities can create attachment pressure if they imply human intimacy or dependence rather than supportive presence.
- A streak reset can feel like moral failure unless the mechanic explicitly values return, recovery, and resumed effort.
- A user in distress may ask for certainty, diagnosis, or emergency guidance; the system must not improvise expertise.
- Explainability can be lost if mission/companion suggestions feel opaque or algorithmic without a human-readable reason.

# Implementation Tasks

- [ ] Task 1: Create the canonical coaching operating-model artifact.
  - File: `shipglowz_data/product/shared/coach-operating-model.md`
  - Action: Write the governed source of truth for Claiire's coaching definition, loop, limits, autonomy rule, safety boundaries, and non-punitive progression principles.
  - User story link: Gives every future implementation the same definition of "real coach".
  - Depends on: None.
  - Validate with: artifact exists with Shipglowz metadata and references this spec.
  - Notes: This is the primary contract replacing repeated ambiguity.

- [ ] Task 2: Declare design-system and brand authority for coaching-visible surfaces.
  - File: `shipglowz_data/technical/design-system-authority.md`
  - Action: Identify the source of truth for coaching-related visual hierarchy, disclosure blocks, companion expression, tone carriers, and copy-bearing components across app and site.
  - User story link: Prevents drift when coaching posture becomes visible in the UI.
  - Depends on: Task 1.
  - Validate with: authority artifact exists and names canonical carriers/tokens/components.
  - Notes: No visible UI implementation should proceed before this declaration exists.

- [ ] Task 3: Build the cross-surface claim and copy map.
  - File: `shipglowz_data/editorial/site/coaching-claims-and-copy-map.md`
  - Action: Inventory current site and app claims, disclosures, and high-trust moments; mark each one as keep, revise, add-limit, or remove.
  - User story link: Prevents the site from promising more than the app delivers.
  - Depends on: Task 1.
  - Validate with: copy map references concrete current files and future owner surfaces.
  - Notes: Must include homepage, app store messaging, onboarding, and companion entry points.

- [ ] Task 4: Define the app coaching flow map.
  - File: `shipglowz_data/product/app/coaching-flow-map.md`
  - Action: Map where the app must frame, clarify, reformulate, propose action, revisit progress, and fallback to limit-handling.
  - User story link: Turns abstract posture into a concrete app behavior contract.
  - Depends on: Task 1.
  - Validate with: flow map covers onboarding, companion chat, missions, streak/recovery moments, and notifications.
  - Notes: Focus on moments, not screens alone.

- [ ] Task 5: Specify out-of-scope and crisis fallback behavior.
  - File: `shipglowz_data/product/shared/coach-operating-model.md`
  - Action: Add explicit stop conditions, redirection posture, and forbidden behaviors for crisis, severe distress, self-harm, violence, trauma, or requests for diagnosis/treatment.
  - User story link: Keeps coaching safe and honest.
  - Depends on: Task 1.
  - Validate with: fallback scenarios documented and testable.
  - Notes: If locale-specific resources are undecided, specify the behavior contract and follow-up owner.

- [ ] Task 6: Redefine gamification for coach-compatibility.
  - File: `shipglowz_data/product/app/coaching-flow-map.md` and relevant product contract artifacts
  - Action: Define how XP, streaks, badges, missions, and relapse/restart moments support growth without punishment, shame, or coercion.
  - User story link: Lets progress stay motivating without breaking trust.
  - Depends on: Tasks 1 and 4.
  - Validate with: explicit rules for missed steps, rupture, return, celebration, and small wins.
  - Notes: This may later drive implementation changes in gamification engines and UI copy.

- [ ] Task 7: Create a scenario-based prompt and behavior test matrix.
  - File: `shipglowz_data/workflow/verification/claiire-coach-scenarios.md`
  - Action: Define representative scenarios for normal coaching, hesitation, resistance, relapse, ambiguity, and crisis boundaries.
  - User story link: Makes the coaching promise testable before broad implementation.
  - Depends on: Tasks 1, 4, and 5.
  - Validate with: matrix covers expected behavior, forbidden behavior, and pass/fail indicators.
  - Notes: This is a product-behavior contract, not only a prompt test file.

- [ ] Task 8: Route implementation into smaller chantiers if needed.
  - File: `shipglowz_data/workflow/specs/`
  - Action: After this operating model is ready, split concrete implementation work into bounded specs for onboarding/copy, companion prompts, missions/progression, notifications, and safety fallbacks if one implementation chantier would become too broad.
  - User story link: Keeps execution durable and reviewable.
  - Depends on: Tasks 1 through 7.
  - Validate with: implementation scope is decomposed only where it reduces ambiguity and execution risk.
  - Notes: Do not jump straight from this spec to scattered edits without a bounded owner plan.

# Acceptance Criteria

- [ ] CA 1: Given the canonical product documents, when a fresh agent asks "What kind of coach is Claiire?", then one durable artifact answers with posture, limits, loop, and safety boundaries.
- [ ] CA 2: Given the site and app acquisition/onboarding surfaces, when a user first forms trust, then the AI nature, scope, and limits are explicitly framed.
- [ ] CA 3: Given a normal coaching exchange, when the user presents a topic, then Claiire clarifies/reformulates before proposing action.
- [ ] CA 4: Given a user who does not complete a step or breaks a streak, when Claiire responds, then the response preserves dignity and emphasizes recovery rather than punishment.
- [ ] CA 5: Given a crisis or out-of-scope request, when Claiire detects it, then it stops normal coaching behavior and switches to the documented fallback/redirection posture.
- [ ] CA 6: Given the homepage and other trust-building copy, when reviewed against the operating model, then no claim exceeds actual app behavior or implies clinical/human expertise.
- [ ] CA 7: Given visible UI/copy changes required by this posture, when implementation starts, then a declared design-system authority exists and is used.
- [ ] CA 8: Given future implementation specs for coaching-related work, when they are created, then they reference this operating model instead of redefining coaching ad hoc.

# Test Strategy

- Review current site/app/docs claims against the operating model and flag drift.
- Build scenario-based behavior tables before prompt or UI implementation.
- Validate both positive paths and boundary paths:
  - clear goal
  - emotional ambiguity
  - reluctance to act
  - relapse or missed habit
  - request for certainty/diagnosis
  - crisis or severe distress
- Check that proposed gamification behavior preserves trust under failure, return, and low-energy states.
- Require a design/copy authority check before any UI-level implementation starts.

# Risks

- High trust risk if Claiire claims coaching credibility without clear limits and observable discipline.
- High safety risk if addiction/mental-health topics are handled with normal coaching when they require stronger boundaries.
- High product-coherence risk if site promises and app behavior diverge.
- High retention-design risk if gamification optimizes compulsion or shame instead of growth.
- Medium legal/reputation risk if AI disclosure and claim accuracy remain implicit.
- Medium implementation-sprawl risk if this operating model is not decomposed into bounded downstream work.

# Execution Notes

- Read first:
  - `shipglowz_data/workflow/explorations/2026-06-29-claiire-coach-evolution-personnelle.md`
  - `app/BUSINESS.md`
  - `app/GUIDELINES.md`
  - `app/BRANDING.md`
  - `site/src/pages/index.astro`
  - `site/src/layouts/DocsLayout.astro`
- Use the exploration report as the reasoning base, but move durable product truth into canonical product/editorial/technical artifacts.
- Do not implement UI/copy/prompt changes directly from conversation memory; route them through the operating-model documents first.
- If design-system authority is absent, create it before visible work rather than improvising tokens or layout rules locally.
- Future implementation should likely split into multiple bounded chantiers rather than one large mixed diff.

# Open Questions

None for spec creation. Remaining uncertainty was converted into explicit downstream artifacts and constraints:

- locale-specific crisis resources may remain a follow-up, but fallback behavior itself is in scope
- exact companion prompt wording can be decided later, but prompt behavior contract is in scope
- exact gamification mechanic tuning can be decided later, but non-punitive principles are in scope

# Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
|----------|-------|-------|--------|--------|-----------|
| 2026-06-29 15:10:00 UTC | 100-sf-spec | GPT-5 Codex | Created spec from coaching exploration, local product docs, and current site/app positioning evidence | Draft spec created | /101-sf-ready claiire-coach-operating-model |

# Current Chantier Flow

| Step | Status | Notes |
|------|--------|-------|
| 100-sf-spec | done | Draft spec created and chantier initialized. |
| 101-sf-ready | next | Review ambiguity, proof contract, and source-of-truth completeness before implementation. |
| 102-sf-start | pending | Implement the canonical operating-model artifacts and bounded downstream work. |
| 103-sf-verify | pending | Verify cross-surface claims, behavior scenarios, and guardrails. |
| 104-sf-end | pending | Close the chantier with updated governance docs and outcome summary. |
| 005-sf-ship | pending | Ship only after implementation and verification chantiers are complete. |

---
artifact: architecture_decision
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "claiire"
created: "2026-08-09"
updated: "2026-08-09"
status: active
source_skill: 300-sg-docs
scope: "app mobile runtime"
owner: Diane
confidence: high
risk_level: high
security_impact: yes
docs_impact: yes
depends_on:
  - artifact: "shipglows_data/technical/app/README.md"
    artifact_version: "not_versioned"
    required_status: active
supersedes: []
evidence:
  - "Operator decision 2026-08-09: keep Claiire on Expo after comparing it with the Flutter standard used by other projects."
  - "Local app evidence: Expo Router, Clerk Expo, Convex React, Expo Notifications, Expo SecureStore, EAS configuration, offline emergency cache, and an established TypeScript test suite."
  - "Fresh-docs checked 2026-08-09: Expo and Clerk maintain official Expo integrations; no official Clerk Flutter frontend SDK was listed; available Convex Flutter clients were community-maintained."
next_review: "2027-02-09"
next_step: "none"
---

# ADR — Keep Expo as the Claiire mobile runtime

## Decision

Claiire keeps Expo and React Native as its canonical mobile application runtime. Flutter remains an acceptable default for other or future projects, but cross-project stack uniformity alone does not justify rewriting Claiire.

## Context

The existing app is an established TypeScript product surface, not an empty scaffold. It already integrates routing, authentication, realtime data, notifications, secure local storage, offline emergency support, application state, animations, and automated tests.

Claiire handles sensitive violence-related journeys. Runtime and SDK choices must therefore prioritize maintained authentication, data, recovery, and release paths over portfolio-level framework uniformity.

## Rationale

- Clerk provides an official Expo SDK used directly by the app.
- Convex provides first-class React integration used by the app and its Clerk authentication bridge.
- Expo SDK modules cover the current native needs: secure storage, notifications, device APIs, splash screen, linking, and browser handoff.
- EAS already defines build and release paths for Android and iOS.
- A Flutter migration would rewrite the UI and replace the current hooks, routing, authentication bridge, realtime client integration, notification layer, secure cache, and test harness.
- At decision time, Flutter alternatives for Clerk and Convex depended on custom flows or community-maintained clients, increasing supply-chain and integration risk for a sensitive application.

## Preserved invariants

- Mobile targets remain Android and iOS; Expo web does not replace the canonical Astro public site.
- Sensitive and emergency data must remain available through the existing offline and secure-storage guarantees.
- Authentication and authorization must continue to use maintained, documented provider integrations.
- Expo does not forbid native functionality: development builds, config plugins, prebuild, and native modules remain available when required.
- Framework choice must not weaken accessibility, performance, privacy, release reliability, or platform behavior.

## Reconsideration criteria

Reopen this decision only when evidence establishes at least one material trigger:

- a required native capability cannot be delivered safely through Expo or React Native;
- measured production performance misses an agreed product target and Expo/React Native is proven to be the cause;
- Flutter becomes necessary for a confirmed desktop or cross-product delivery strategy;
- Clerk and Convex are replaced, or official production-grade Flutter integrations cover the required authentication and realtime contracts;
- maintaining Expo creates a demonstrated security, release, staffing, or operational burden greater than a staged migration;
- the app is being fundamentally rebuilt for independent product reasons, making framework migration part of an already-authorized rewrite.

Preference, familiarity, or stack uniformity without measured product benefit is not a sufficient trigger.

## Migration requirement if reopened

Any future migration requires a dedicated spec, current official SDK verification, feature and data-flow parity mapping, security review, staged rollout, rollback plan, and proof for offline emergency access, authentication, notifications, accessibility, performance, and store delivery. Do not begin with a screen-by-screen rewrite before those gates are ready.

## Freshness evidence

- Expo Application Services documentation: `https://docs.expo.dev/eas/`
- Expo adoption and native-library documentation: `https://docs.expo.dev/bare/overview/`
- Clerk Expo SDK reference: `https://clerk.com/docs/reference/expo/overview`
- Clerk SDK inventory: `https://clerk.com/docs/reference/overview`
- Flutter architectural overview: `https://docs.flutter.dev/resources/architectural-overview`
- Convex Flutter ecosystem checked on pub.dev on 2026-08-09; available clients were community-maintained rather than listed as official Convex SDKs.

Freshness verdict: `fresh-docs checked`.

## Maintenance Rule

Update this decision only when one reconsideration criterion has evidence, a provider changes its official SDK support, or Claiire's mobile delivery contract changes. Preserve the previous decision state when superseding it.

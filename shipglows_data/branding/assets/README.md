---
artifact: brand_assets_index
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "claiire"
created: "2026-06-30"
updated: "2026-06-30"
status: draft
source_skill: 300-sf-docs
scope: branding
owner: Diane
confidence: medium
risk_level: medium
security_impact: none
docs_impact: yes
depends_on:
  - artifact: "shipglows_data/branding/branding.md"
    artifact_version: "1.0.0"
    required_status: reviewed
supersedes: []
evidence:
  - "Asset inventory started from files already present in the repository."
next_review: "2026-07-30"
next_step: "/300-sf-docs update branding bundle"
---

# Brand Assets

## Purpose

Ce dossier indexe les assets de marque de reference. Il ne remplace pas les copies runtime necessaires au site ou a l'app.

## Current Inventory

- `shipglows_data/branding/assets/logo.svg`
  - asset vectoriel de reference archive dans la gouvernance
- `site/public/claiire-logo.webp`
  - copie runtime servie publiquement par le site
- `site/src/assets/claiire-logo.webp`
  - copie locale presente dans le code site

## Source Of Truth Rule

- le branding gouverne ici la reference de marque et l'inventaire
- les surfaces runtime peuvent garder leurs formats derives si elles en ont besoin
- si un export runtime change, il faut verifier qu'il reste coherent avec la reference de marque

## Out Of Scope

- captures temporaires
- moodboards de recherche
- assets d'inspiration tiers
- exports de build

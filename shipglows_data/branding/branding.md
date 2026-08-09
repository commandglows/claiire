---
artifact: brand_contract
metadata_schema_version: "1.0"
artifact_version: "1.2.0"
project: "claiire"
created: "2026-06-30"
updated: "2026-08-09"
status: reviewed
source_skill: 300-sg-docs
scope: branding
owner: Diane
confidence: high
risk_level: high
security_impact: none
docs_impact: yes
depends_on:
  - artifact: "shipglows_data/business/business.md"
    artifact_version: "1.0.0"
    required_status: reviewed
supersedes: []
evidence:
  - "Existing Claiire branding doc already mixed identity, tone, visual direction, and rules in one source."
  - "Operator decision 2026-06-30: branding must be treated as a richer governed bundle, not a lone markdown file."
  - "Operator decision 2026-08-09: violence is the primary mission, with separate journeys for people subjected to violence and people exercising violence."
  - "Operator decision 2026-08-09: health and holistic wellbeing remain a complementary mission and softer public entry territory."
next_review: "2026-09-09"
next_step: "/300-sg-docs update branding bundle"
---

# Branding

Ce fichier est l'index canonique du bundle de marque Claiire. Il dit ce qui appartient au branding partage, ce qui part dans les fichiers specialises, et ce qui ne doit pas etre duplique dans `business/` ou `technical/`.

## Bundle de marque

- `shipglows_data/branding/branding.md`
  - vue d'ensemble, frontiere des fichiers, autorite documentaire
- `shipglows_data/branding/voice-and-tone.md`
  - ton, style d'adresse, vocabulaire, exemples de formulation
- `shipglows_data/branding/messaging-pillars.md`
  - identite, promesse, tagline, positionnement, messages centraux
- `shipglows_data/branding/visual-identity.md`
  - palette, typographie, logo, imagerie, direction visuelle
- `shipglows_data/branding/brand-rules.md`
  - regles operationnelles, do/don't, garde-fous claims et usages
- `shipglows_data/branding/assets/README.md`
  - index des assets de marque et des copies runtime

## Raison d'etre

Claiire est une marque partagee entre le site et l'app. Le branding doit donc rester theme-first et commun, avec une seule source de verite pour :

- la facon de parler
- la promesse autorisee
- la direction visuelle
- les garde-fous de marque
- les assets de reference

## Positionnement faisant autorite

Claiire porte une double mission complementaire : soutenir la sante, le bien-etre et l'evolution personnelle ; aider a reconnaitre, interrompre et sortir des violences relationnelles. Le territoire holistique accueille sans brusquer, tandis que l'expertise violence reste visible et differenciante. Les deux publics concernes par la violence disposent de parcours separes ; cette separation ne doit jamais etre effacee par une campagne, une page ou une interface.

Le contrat produit complet fait autorite dans `shipglows_data/product/shared/coach-operating-model.md`. Le titre public et les deux formulations d'entree valides le 2026-08-09 y sont consignes.

## Autorite et frontieres

- Le branding partage vit sous `shipglows_data/branding/`.
- Le business partage vit sous `shipglows_data/business/business.md`.
- Les tokens, themes, variables et composants runtime ne vivent pas ici. Ils doivent rester dans les surfaces techniques concernees, par exemple `shipglows_data/technical/site/` ou `shipglows_data/technical/app/`.
- Les assets bruts de marque peuvent etre indexes ici, mais les copies de livraison runtime restent dans les surfaces qui les servent.

## Regle de lecture

Quand un agent a besoin de contexte de marque :

1. lire `branding.md`
2. ouvrir ensuite le fichier specialise le plus proche du besoin
3. ne pas deduire le ton ou les claims depuis le code UI seul

## Regle de mise a jour

- Nouvelle promesse ou evolution de positionnement : mettre a jour `messaging-pillars.md`, puis verifier `business/business.md`
- Changement de ton ou de style editorial : mettre a jour `voice-and-tone.md`
- Changement de palette, logo, imagerie, direction visuelle : mettre a jour `visual-identity.md` et `assets/README.md` si besoin
- Nouvelle interdiction, nouvel usage autorise, ou contrainte sensible : mettre a jour `brand-rules.md`

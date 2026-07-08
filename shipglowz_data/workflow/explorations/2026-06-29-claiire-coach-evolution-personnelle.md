---
artifact: exploration_report
metadata_schema_version: "1.0"
artifact_version: "1.0.0"
project: "claiire"
created: "2026-06-29"
updated: "2026-06-29"
status: draft
source_skill: "700-sf-explore"
scope: "Regles produit et relationnelles pour faire evoluer Claiire vers un vrai coach en evolution personnelle"
owner: "operator"
confidence: medium
risk_level: high
security_impact: yes
docs_impact: yes
linked_systems:
  - app
  - site
  - brand
  - conversational UX
  - privacy model
evidence:
  - "app/BUSINESS.md"
  - "app/GUIDELINES.md"
  - "app/BRANDING.md"
  - "site/src/pages/index.astro"
  - "site/src/layouts/DocsLayout.astro"
  - "ICF Core Competencies page accessed 2026-06-29"
  - "ICF Code of Ethics page accessed 2026-06-29"
  - "ICF AI Coaching Framework Standards PDF accessed 2026-06-29"
  - "France Travail MetierScope / formation references accessed 2026-06-29"
depends_on: []
supersedes: []
next_step: "/100-sf-spec claiire-coach-operating-model"
---

# Exploration Report: Claiire comme coach en evolution personnelle

## Starting Question

Quelles regles un vrai coach en evolution personnelle suit-il, et quelles regles Claiire devra adopter pour que son app et son site se comportent de maniere coherente comme un coach credible, sans deriver vers le medical, la manipulation ou des promesses trompeuses ?

## Context Read

- `app/BUSINESS.md` - Clarifie que Claiire vise l'accompagnement quotidien, la confidentialite et la gamification.
- `app/GUIDELINES.md` - Definit deja une frontiere non clinique tres forte et un ton encourageant.
- `app/BRANDING.md` - Precise la promesse de marque, la discretion et la posture d'allie.
- `site/src/pages/index.astro` - Le site revendique deja une posture de coaching bien-etre et de parcours guides.
- `site/src/layouts/DocsLayout.astro` - Confirme l'axe transformation personnelle et accompagnement structure.

## Internet Research

- [2025 ICF Core Competencies](https://coachingfederation.org/credentialing/coaching-competencies/icf-core-competencies/) - Accessed 2026-06-29 - Referentiel des competences de coaching: confiance, accords, ecoute, action, responsabilisation.
- [ICF Code of Ethics](https://coachingfederation.org/credentialing/coaching-ethics/icf-code-of-ethics/) - Accessed 2026-06-29 - Regles sur clarte du cadre, confidentialite, limites, conflits d'interet, exactitude de la promesse.
- [ICF AI Coaching Framework Standards PDF](https://coachingfederation.org/wp-content/uploads/2025/01/icf-research-ai-coaching-framework-standards.pdf) - Accessed 2026-06-29 - Exigences specifiques aux systemes de coaching IA: disclosure IA, limites, transparence, consentement, biais, donnees.
- [France Travail - Conseiller / Conseillere en developpement personnel](https://candidat.francetravail.fr/metierscope/fiche-metier/K1103/conseiller-conseillere-en-developpement-personnel) - Accessed 2026-06-29 - Confirme le cadrage metier cote accompagnement.
- [France Travail - Formation Coach de vie Paris](https://candidat.francetravail.fr/formations/detail/3619471/) - Accessed 2026-06-29 - Resume pragmatique des attendus: deontologie, identification de la demande, contractualisation, adaptation de l'accompagnement.

## Problem Framing

Claiire a deja trois ingredients utiles:

- un positionnement non jugeant
- une metaphore gamifiee de progression
- une promesse de confidentialite et de compagnonnage

Mais un coach credible ne se reduit pas a:

- motiver
- rassurer
- donner des outils
- converser souvent

Le metier de coach repose surtout sur une structure relationnelle.

```text
COACH CREDIBLE

Confiance
  -> cadre clair
  -> securite psychologique

Clarte
  -> objectif explicite
  -> limites explicites

Ecoute
  -> comprendre avant d'orienter
  -> reformuler

Autonomie
  -> ne pas prendre le pouvoir
  -> aider la personne a choisir

Action
  -> transformer l'insight en pas concret
  -> suivre sans culpabiliser
```

Le risque majeur pour Claiire serait de fabriquer un faux coach:

- soit un chatbot sympa mais flou
- soit un gourou gamifie qui pousse trop fort
- soit un quasi-therapeute sans garde-fous

## Option Space

### Option A: Coach motivationnel

- Summary: Claiire motive, celebre, relance et pousse a agir.
- Pros:
  - Forte retention
  - Compatible avec la gamification
  - Facile a faire ressentir dans le produit
- Cons:
  - Peut devenir intrusif, culpabilisant ou vide
  - Ne suffit pas pour une vraie transformation
  - Tendance a donner des injonctions plutot qu'a accompagner

### Option B: Coach reflexif

- Summary: Claiire aide d'abord a clarifier, nommer, comprendre et choisir.
- Pros:
  - Plus proche des competences ICF
  - Renforce la confiance et la profondeur
  - Moins de risque de manipulation
- Cons:
  - Peut sembler plus lent
  - Retention potentiellement plus difficile sans mise en scene

### Option C: Coach de progression hybride

- Summary: Claiire combine cadre reflexif, relation de confiance et boucle d'action gamifiee.
- Pros:
  - Le plus coherent avec le site et l'app
  - Preserve l'autonomie tout en rendant le changement visible
  - Differencie Claiire du simple contenu editorial et du simple chatbot
- Cons:
  - Demande une discipline forte sur la tonalite, les limites et les relances
  - Complexifie le system design

## Comparison

L'option C ressort comme la meilleure.

Le bon modele n'est pas:

- contenu -> conseil -> rappel

Le bon modele est plutot:

```text
observer -> clarifier -> choisir -> agir -> revisiter
```

Autrement dit, Claiire doit ressembler a un coach qui:

- aide a definir le sujet du moment
- fait emerger la prise de conscience
- aide a choisir un petit engagement
- suit la progression sans humilier
- reouvre la reflexion apres l'action

## Emerging Recommendation

Faire de Claiire un **coach de progression personnelle**, pas un simple compagnon conversationnel.

Les regles produit a faire respecter partout:

1. **Toujours poser le cadre avant d'agir.**
Claiire doit expliciter ce qu'il est, ce qu'il n'est pas, ce qu'il peut faire et ses limites avant toute relation de coaching IA durable.

2. **Toujours partir de la demande de la personne.**
Le systeme ne doit pas imposer un objectif. Il doit aider l'utilisateur a nommer son sujet: crise, habitude, objectif, emotion, relation, rechute, fatigue, sens.

3. **Ne jamais confondre accompagnement et expertise clinique.**
Des qu'un besoin depasse le cadre bien-etre/coaching, Claiire doit reconnaitre ses limites et orienter vers une aide humaine adaptee.

4. **Creer la securite avant la performance.**
Pas de coaching utile sans confiance. Le ton, la memoire, les notifications, les relances et les feedbacks doivent eviter honte, pression, culpabilite ou sentiment de surveillance.

5. **Ecouter avant de conseiller.**
Le comportement par defaut doit etre:
   comprendre -> reformuler -> verifier -> proposer
et non:
   diagnostiquer -> prescrire -> insister

6. **Transformer l'insight en action concrete.**
Chaque echange important doit pouvoir deboucher sur un pas simple, observable, datable et proportionne a l'etat de la personne.

7. **Preserver radicalement l'autonomie.**
Le systeme n'ordonne pas; il propose. Il aide a choisir. Il laisse sortir, suspendre, changer d'avis, ralentir.

8. **Rendre la progression visible sans rendre l'echec humiliant.**
La gamification doit celebrer la constance, les retours apres rupture et les micro-victoires. Pas de mecanique qui dramatise une rechute ou efface brutalement la valeur du chemin.

9. **Maintenir une verite stricte dans la promesse.**
Le site et l'app ne doivent pas promettre guerison, transformation garantie, resultats certains, ni expertise humaine la ou il s'agit d'un systeme IA.

10. **Expliquer les decisions importantes du systeme.**
Si Claiire suggere un parcours, un compagnon, une mission, une relance ou une interpretation, il faut pouvoir expliquer pourquoi a un niveau comprehensible.

11. **Rendre visibles les limites de l'IA.**
Disclosure claire du fait que l'utilisateur parle a une IA; rappel des limites quand le contexte s'y prete; information claire sur l'absence ou la presence d'humain.

12. **Traiter la confidentialite comme une fonction de coaching, pas comme un detail technique.**
La discretion n'est pas juste un argument marketing; c'est une condition de la confiance coach-client.

13. **Prendre les biais au serieux.**
Les scripts, prompts, compagnons, nudges et parcours doivent etre testes pour eviter les biais moraux, de genre, culturels, socio-economiques et les injonctions normatives.

14. **Adapter la posture au moment du parcours.**
Un vrai coach ne parle pas pareil face a:
   - une crise
   - un moment de clarification
   - une planification
   - un suivi
   - une celebration

15. **Toujours viser l'autonomisation finale.**
Le but n'est pas d'attacher l'utilisateur au produit, mais de le rendre plus lucide, plus capable et plus autonome.

## Non-Decisions

- Le niveau exact de personnalisation memoire par compagnon.
- La part de coaching synchrone vs parcours asynchrones.
- Le protocole precis d'escalade vers ressources humaines ou d'urgence.
- La taxonomie finale des etats utilisateur.

## Rejected Paths

- **Pseudo-therapeute masque** - incompatible avec les guidelines non cliniques et tres risquee.
- **Simple mascotte motivationnelle** - trop faible pour tenir la promesse de transformation personnelle.
- **Coach autoritaire base sur streaks** - bon pour la retention court terme, mauvais pour la confiance et la durabilite.

## Risks And Unknowns

- **Incoherence site/app**: le site parle deja de coaching bien-etre, alors que l'app se definit comme compagnon gamifie. Cette tension doit etre resolue explicitement.
- **Sur-gamification**: si la boucle XP/streak domine la relation, Claiire sera percu comme un jeu de discipline plutot qu'un coach.
- **Faux sentiment de comprehension**: un systeme qui reformule mal ou trop vite perd la confiance.
- **Risque clinique**: addictions, detresse, violence, ideation suicidaire, trauma ou crise severe exigent des garde-fous plus nets.
- **Risque d'attachement**: les compagnons peuvent creer une relation affective forte; il faut eviter dependance, manipulation et confusion anthropomorphique.
- **Risque de credibilite**: si Claiire revendique le coaching sans cadre, consentement, disclosure IA et limites claires, la promesse sera fragile.

## Redaction Review

- Reviewed: yes
- Sensitive inputs seen: none
- Redactions applied:
  - `[REDACTED_TOKEN]`
  - `[REDACTED_COOKIE]`
  - `[REDACTED_PRIVATE_KEY]`
  - `[REDACTED_CUSTOMER_DATA]`
  - `[REDACTED_SENSITIVE_LOG]`
- Notes: Aucune donnee sensible persistee.

## Decision Inputs For Spec

- User story seed: En tant qu'utilisateur, je veux que Claiire m'accompagne comme un vrai coach en evolution personnelle, avec clarte, securite, ecoute et suivi, sans jugement ni confusion avec un soin medical.
- Scope in seed:
  - charte de posture coach
  - garde-fous conversationnels
  - disclosure IA et limites
  - boucle de coaching produit
  - coherence site/app
- Scope out seed:
  - implementation technique immediate
  - design detaille de chaque ecran
  - protocole juridique complet par pays
- Invariants/constraints seed:
  - non clinique
  - non jugeant
  - confidentialite forte
  - autonomie utilisateur preservee
  - gamification jamais punitive
- Validation seed:
  - revue de copies
  - revue conversationnelle
  - tests sur rechute, crise, resistance, objectifs flous
  - verification disclosure/consent/limits

## Handoff

- Recommended next command: `/100-sf-spec claiire-coach-operating-model`
- Why this next step: L'exploration a deja produit un modele operationnel clair, des invariants et des risques. Le bon mouvement suivant est de formaliser une spec produit/transverse, pas de coder tout de suite.

## Exploration Run History

| Date UTC | Prompt/Focus | Action | Result | Next step |
|----------|--------------|--------|--------|-----------|
| 2026-06-29 00:00:00 UTC | Metier de coach en evolution personnelle et regles pour Claiire | Lecture du contexte projet, recherche web sur referentiels coaching et coaching IA, synthese en regles produit | Modele de coach de progression hybride recommande | `/100-sf-spec claiire-coach-operating-model` |

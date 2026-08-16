---
artifact: product_design
metadata_schema_version: "1.0"
artifact_version: "0.3.0"
project: "claiire"
created: "2026-08-11"
updated: "2026-08-16"
status: draft
source_skill: 008-sg-customer
scope: "subjected-person-profile-matrix"
owner: Diane
confidence: medium
risk_level: high
security_impact: yes
docs_impact: yes
linked_systems:
  - "app/"
  - "shipglows_data/product/shared/coach-operating-model.md"
  - "shipglows_data/product/shared/subjected-person-situation-questionnaire.md"
  - "shipglows_data/workflow/specs/claiire-coach-operating-model.md"
depends_on:
  - artifact: "shipglows_data/product/shared/coach-operating-model.md"
    artifact_version: "1.1.0"
    required_status: reviewed
supersedes: []
evidence:
  - "Operator direction 2026-08-11: adapt the subjected-person journey through a multidimensional profile matrix rather than one generic victim path."
  - "Operator decision 2026-08-11: expose the evolving per-dimension scores as a Ma situation state updated by guided questions or an explicit user action."
  - "WHO clinical handbook: first-line response separates emotional, physical, ongoing safety, and ongoing support needs."
  - "HAS recommendations: recognize cumulative forms of violence, assess severity, protect children, preserve an empathetic non-judgmental response, and orient according to the situation."
  - "Psychosocial Readiness Model: awareness, perceived support, and self-efficacy influence safety-seeking change and do not reduce readiness to leaving alone."
  - "Danger Assessment research: lethality risk needs a validated, separately interpreted instrument and must not be replaced by an invented global score."
next_review: "2026-09-11"
next_step: "Specialist, lived-experience, legal, privacy, and threat review before production verification or release"
---

# Matrice de profil - personne exposee a la violence

## Intention

Cette matrice personnalise le parcours d'une personne qui subit, pense subir ou a subi des violences relationnelles. Elle ne produit ni diagnostic, ni etiquette identitaire, ni prediction certaine. Elle represente un etat evolutif afin d'adapter le rythme, les priorites, le niveau de discretion, les ressources et les prochaines actions proposees.

Le profil n'est pas une case. Il est un vecteur date, modifiable par la personne et reevalable apres un evenement important. Une valeur inconnue reste `unknown`; elle ne vaut jamais zero.

Le vecteur est expose dans l'app sous le nom `Ma situation`. Chaque dimension conserve son score, un libelle qualitatif, sa provenance, sa date, sa confiance et sa fraicheur. Ces dimensions restent des signaux de contexte : elles ne constituent ni le besoin formule par la personne, ni une orientation globale.

La restitution principale s'appuie sur un `NeedProfileV1` distinct, derive uniquement des reponses confirmees. Il rassemble les besoins demandes, les priorites, le prochain petit pas, les contraintes pratiques, les preferences et jusqu'a trois categories d'aide expliquees. Chaque categorie cite les questions qui l'ont soutenue. Une orientation `urgent | specialized | nonUrgent` reste nullable : un manque d'information ne devient jamais une conclusion rassurante.

Les conversations peuvent proposer une mise a jour, mais la personne la confirme. L'action `Mettre a jour ma situation` lance un recheck cible ou complet. Le questionnaire et les regles de mutation font autorite dans `shipglows_data/product/shared/subjected-person-situation-questionnaire.md`.

## Principes de calcul

- Conserver chaque dimension separement. Ne jamais produire un score global de « gravite » ou de « victime ».
- Utiliser une echelle interne `0..4` uniquement pour personnaliser l'experience. Un score eleve n'est pas toujours negatif : `SUP` et `AGY` sont des facteurs protecteurs.
- Traiter les signaux de danger comme des priorites non compensables. Un soutien eleve ou une forte envie de rester ne diminue jamais un signal critique.
- Distinguer faits declares, interpretation de la personne, donnees inconnues et evolution dans le temps.
- Ne jamais afficher un resultat comme une verite sur l'autre personne ou sur ses intentions.
- Ne pas reproduire ou modifier le calcul d'un instrument valide de dangerosite sans autorisation, protocole et expertise appropries.

## Entrees qui ne sont pas des scores

| Code | Valeurs | Usage |
| --- | --- | --- |
| `ROLE` | `pour-moi`, `j'aide-quelqu'un` | Oriente vers le parcours personnel ou le parcours soutien. Une personne qui aide n'est pas classee comme victime par procuration. |
| `RELATION` | partenaire actuel, ex-partenaire, parent, enfant adulte, fratrie, aidant/dependance, autre proche | Adapte les contraintes, ressources et formes de mise a distance possibles. |
| `COHABITATION` | ensemble, separes, intermittente, inconnue | Contextualise l'exposition et les options de securite. |
| `RECENCE` | en cours, recente, ancienne avec effets actuels, inconnue | Determine la priorite de reevaluer le danger et les besoins. |

## Dimensions scorees

Toutes les dimensions acceptent `unknown` et une note de confiance `low|medium|high`.

| Code | Dimension | `0` | `2` | `4` | Adapte principalement |
| --- | --- | --- | --- | --- | --- |
| `SAF` | Danger actuel et escalade | aucun signal rapporte | signaux inquietants ou evolution incertaine | danger potentiellement imminent ou critique | interruption du parcours normal, securite et aide humaine |
| `CTL` | Controle coercitif et perte d'autonomie | autonomie preservee | controles recurrents sur certains domaines | controle envahissant, menaces ou impossibilite d'agir librement | discretion, confidentialite, absence de confrontation |
| `REC` | Reconnaissance des faits | ne percoit pas ou minimise encore | doute et commence a relier des faits | nomme clairement les comportements et leurs effets | vocabulaire, psychoeducation, profondeur des questions |
| `REL` | Attachement et intention de preserver la relation | ne souhaite pas la maintenir | ambivalence forte | souhaite clairement rester ou sauver le lien | objectifs proposes sans diminuer la securite |
| `CHG` | Disponibilite pour une action protectrice | aucune action envisageable maintenant | ouverte a une petite action reversible | prepare ou realise activement des changements | taille et nature du prochain pas |
| `CON` | Contraintes a la mise a distance | peu de contraintes identifiees | plusieurs contraintes gerables avec aide | dependance forte ou impossibilite actuelle de s'eloigner | ressources logement, finance, famille, handicap, immigration, soins |
| `SUP` | Soutien fiable disponible | isolement ou soutien dangereux | une personne ou ressource incertaine | reseau fiable et/ou professionnel actif | orientation, relais et plan partage avec consentement |
| `AGY` | Pouvoir d'agir percu | aucune option percue | quelques choix mais faible confiance | choix identifies et capacite a les mettre en oeuvre | niveau de guidage et restauration de l'autonomie |
| `DIG` | Risque numerique et surveillance | appareil et comptes percus comme surs | acces ou surveillance possibles | surveillance declaree, partage force ou appareil non sur | mode discret, stockage, notifications et sortie rapide |
| `DEP` | Personnes dependantes ou exposees | aucune identifiee | responsabilites ou exposition indirecte | enfant/personne vulnerable directement exposee ou menacee | priorite de protection et orientation specialisee |
| `IMP` | Impact physique, emotionnel et fonctionnel | impact limite rapporte | sommeil, sante, attention ou activites alteres | blessure, epuisement majeur, detresse ou fonctionnement tres degrade | orientation sante/humaine et alleger la charge cognitive |

## Signaux prioritaires hors moyenne

Le questionnaire doit pouvoir suspendre le profilage ordinaire et ouvrir une verification de securite lorsque la personne rapporte notamment un danger immediat, une escalade rapide, une strangulation, une menace de mort, une arme, une violence sexuelle, une traque, une surveillance numerique, une menace envers un enfant ou une personne dependante, ou une peur intense fondee sur des faits recents.

Cette liste est un inventaire de conception, pas un outil clinique valide. Les formulations, seuils et actions doivent etre revus par des specialistes et relies a un protocole local avant toute mise en production.

## Profils composites de travail

Ces profils ne sont ni exclusifs ni permanents. L'app peut en activer plusieurs simultanement.

| Profil | Signature frequente | Besoin dominant | Adaptation initiale |
| --- | --- | --- | --- |
| `Je me questionne` | `REC` bas ou moyen, faits encore disperses | clarte sans etiquette forcee | questions factuelles, chronologie, effet sur soi, definitions simples |
| `Je veux rester pour l'instant` | `REL` eleve, `CHG` bas ou moyen | respecter l'attachement sans banaliser | reduction du risque, limites de l'app, options reversibles, aucun objectif de rupture impose |
| `Je ne peux pas m'eloigner aujourd'hui` | `CON` eleve, contexte familial ou de dependance | retrouver des marges de choix realistes | micro-plan de securite, ressources pratiques, soutien discret, rythme lent |
| `Je commence a me retrouver` | `REC` et `AGY` en hausse, `IMP` souvent eleve | restaurer l'autonomie et le bien-etre | suivi des faits, besoins fondamentaux, soutien fiable, petites decisions propres |
| `J'envisage de partir` | `CHG` moyen ou eleve, `REL` ambivalent | explorer sans precipiter ni exposer | options, contraintes, securite, aide specialisee, aucune notification revelatrice |
| `Je prepare une separation` | `CHG` eleve, changement de cohabitation possible | planification sure | reevaluer le danger, securite numerique, dependants, documents et relais humains |
| `Je suis partie mais reste exposee` | separation actuelle, `SAF`, `CTL` ou `DIG` encore presents | risque post-separation et reconstruction | traque/cyberviolence, ressources juridiques et humaines, stabilisation et autonomie |
| `J'aide quelqu'un` | `ROLE=j'aide-quelqu'un` | soutenir sans controler ni mettre en danger | ecouter, valider, ne pas imposer le depart, preparer une aide concrete et sure |

## Architecture du futur questionnaire

1. **Confidentialite d'abord** : verifier si la personne peut repondre seule et si son appareil est suffisamment sur.
2. **Triage de securite court** : rechercher les signaux qui exigent de suspendre le questionnaire ordinaire.
3. **Faits et controle** : types de comportements, repetition, recence, escalade et effet sur l'autonomie.
4. **Situation de vie** : relation, cohabitation, enfants ou dependants, logement, finance, sante, handicap, statut administratif et obligations de soin.
5. **Position actuelle** : reconnaissance, attachement, intention de rester, disponibilite pour une action protectrice et pouvoir d'agir percu.
6. **Soutiens et preferences** : personnes fiables, professionnels, type d'aide souhaite et prochain petit pas acceptable.
7. **Restitution** : resume en langage naturel, dimensions modifiables, aucune etiquette imposee et proposition de parcours adaptee.

Le questionnaire doit etre progressif. Il ne doit pas exiger l'ensemble des reponses avant de donner une premiere valeur utile ou un acces aux ressources critiques.

## Regles d'adaptation

- `SAF` eleve : suspendre coaching, gamification, paiement et projet relationnel; prioriser securite, limites et aide humaine.
- `CTL` ou `DIG` eleve : reduire les traces, eviter les notifications sensibles, ne pas proposer de confrontation et rappeler les limites d'un appareil surveille.
- `REC` bas : partir de faits concrets et de leur effet, pas du mot « violence » comme prerequis.
- `REL` eleve : reconnaitre le desir de rester sans promettre de sauver le couple ni transformer la securite en objectif secondaire.
- `CHG` bas : proposer observation, soutien et actions reversibles; ne pas assimiler l'absence de depart a un refus d'aide.
- `CON` eleve : adapter les options aux dependances reelles plutot que repeter une injonction a partir.
- `SUP` bas : aider a identifier un premier lien humain fiable sans exposer la personne.
- `AGY` bas : limiter les choix, reformuler les options et rendre le prochain pas petit et annulable.
- `IMP` eleve : raccourcir les interactions et orienter vers une aide de sante ou specialisee appropriee.

## Frontiere du pairing

La matrice peut un jour alimenter un etat `interaction_gate`, mais ce brouillon n'autorise aucun pairing entre la personne exposee et la personne exercant la violence. La volonte declaree de changer de l'autre personne ne suffit pas a etablir la securite, l'absence de coercition ou la liberte de consentement.

Hypothese a etudier ulterieurement : un echange pourrait etre `solo`, `revue-humaine-specialisee` ou `duo-eligible-hors-violence`. Toute evolution de cette frontiere exige une decision produit explicite, une expertise violence, une analyse de menace et des garanties telles que consentement independant, retrait silencieux, aucune exposition des scores ou projets de securite, et aucune inference sur les intentions profondes de l'autre.

## End-User Contract

Target user: personne qui subit, pense subir ou a subi une violence relationnelle.
First success: elle reconnait au moins un besoin prioritaire et recoit une prochaine option adaptee sans devoir adopter une etiquette ni annoncer un depart.
Primary path: confidentialite -> securite -> faits -> contexte -> position actuelle -> soutien -> restitution.
Comprehension and usefulness: resume concret, dimensions explicables et actions reliees aux reponses.
Friction: questionnaire progressif, `unknown` autorise, pause et reprise sure.
Trust and optionality: reponses modifiables, absence de diagnostic, explication de l'IA et de l'usage des donnees.
States: current, partial, skipped, safety-interrupted, completed, stale, needs-recheck, failed.
Recovery: reprise sans afficher de contenu sensible; revalidation de confidentialite et de securite avant les questions a risque.
Onboarding/setup impact: profil initial minimal puis affinage volontaire dans le temps.
Documentation Update Plan: aligner modele produit, confidentialite, aide et claims avant implementation.
Editorial Update Plan: aucun profil public ni promesse de precision avant validation specialisee.
Proof path: revue experte, scenarios de pression, tests de routage, audit confidentialite et essais d'utilisabilite avec personnes concernees.
Implementation route: spec et readiness avant questionnaire, scoring, stockage ou adaptation runtime.

## Sources de conception

- WHO, *Health care for women subjected to intimate partner violence or sexual violence: a clinical handbook*: https://www.who.int/publications/i/item/WHO-RHR-14.26
- Haute Autorite de sante, *Reperage des femmes victimes de violences au sein du couple*: https://www.has-sante.fr/jcms/p_3104867/fr/reperage-des-femmes-victimes-de-violences-au-sein-du-couple
- Campbell et al., *The Danger Assessment: Validation of a Lethality Risk Assessment Instrument for Intimate Partner Femicide*: https://pmc.ncbi.nlm.nih.gov/articles/PMC7878014/
- Cluss et al., *The process of change for victims of intimate partner violence: support for a psychosocial readiness model*: https://pubmed.ncbi.nlm.nih.gov/17055379/

## Validation requise avant implementation

- revue par specialistes des violences conjugales et familiales en France
- revue par des personnes ayant une experience vecue, avec protocole ethique et compensation
- validation des formulations et du protocole de danger, sans reutiliser abusivement un instrument protege ou reserve a des professionnels formes
- analyse de menace sur stockage, notifications, historique, synchronisation, partage d'appareil et suppression
- validation specifique des parcours mineurs, personnes dependantes, handicap, immigration, famille et post-separation
- mesure des faux rassurants, faux alarmants, abandons et incomprehensions

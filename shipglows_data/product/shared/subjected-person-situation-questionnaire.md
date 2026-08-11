---
artifact: product_design
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: "claiire"
created: "2026-08-11"
updated: "2026-08-11"
status: draft
source_skill: 008-sg-customer
scope: "subjected-person-situation-questionnaire"
owner: Diane
confidence: medium
risk_level: high
security_impact: yes
docs_impact: yes
linked_systems:
  - "app/"
  - "shipglows_data/product/shared/subjected-person-profile-matrix.md"
  - "shipglows_data/workflow/specs/claiire-coach-operating-model.md"
depends_on:
  - artifact: "shipglows_data/product/shared/subjected-person-profile-matrix.md"
    artifact_version: "0.2.0"
    required_status: draft
supersedes: []
evidence:
  - "Operator decision 2026-08-11: expose a Ma situation state with one evolving score per dimension, updated by guided questions or an explicit user action."
  - "WHO clinical handbook separates emotional, physical, ongoing safety, and ongoing support needs."
  - "HAS recommendations require fact-based, empathetic recognition, severity assessment, protection of exposed children, and situation-specific orientation."
next_review: "2026-09-11"
next_step: "Specialist, lived-experience, privacy, and threat-model review before implementation"
---

# Questionnaire progressif - Ma situation

## Outcome

`Ma situation` aide une personne exposee a la violence a organiser ce qu'elle vit, voir ses besoins actuels et recevoir un parcours adapte. Le state evolue avec ses reponses, les changements qu'elle declare et les mises a jour qu'elle confirme.

Ce n'est ni un diagnostic, ni un score de danger clinique, ni une mesure de la valeur ou de la responsabilite de la personne. Il n'existe aucun score global.

## State contract

```text
SituationState
  schema_version
  state_version
  status: partial | safety-interrupted | completed | stale | needs-private-recheck
  created_at
  updated_at
  safe_context_confirmed_at
  dimensions[SAF|CTL|REC|REL|CHG|CON|SUP|AGY|DIG|DEP|IMP]
    score: 0 | 1 | 2 | 3 | 4 | unknown
    label
    confidence: low | medium | high
    source: user-explicit | conversation-confirmed | conversation-unconfirmed | event
    assessed_at
    evidence_question_ids[]
    freshness: current | stale | needs-recheck
  context
    relation
    cohabitation
    recence
  priority_signals[]
  critical_event_history[]
  user_priorities[]
  active_profile_tags[]
  interaction_gate: solo | specialist-review | duo-eligible-outside-violence
  storage_preference: session-only | retained | undecided
```

### Mutation rules

- Une conversation peut proposer une modification, mais ne l'applique qu'apres confirmation explicite de la personne.
- Une inference non confirmee reste `conversation-unconfirmed` et ne remplace aucune valeur actuelle.
- Une reponse « je ne sais pas », ignoree ou non posee vaut `unknown`, jamais `0`.
- Un score ne baisse pas par simple passage du temps ou apres une periode calme.
- Une nouvelle reponse ne supprime jamais silencieusement un evenement critique historique.
- Une suspicion de mise a jour sous contrainte place le state en `needs-private-recheck` sans afficher que la coercition a ete detectee.
- `SAF`, `CTL`, `DIG`, `DEP` et `IMP` utilisent le signal actuel le plus eleve pertinent; ils ne sont jamais moyennes avec des facteurs protecteurs.
- `SUP` et `AGY` restent des facteurs protecteurs separes et ne diminuent aucun danger.
- Tout changement de cohabitation, separation, escalade, acces a l'appareil ou exposition d'une personne dependante declenche une proposition de recheck cible.

## Experience d'entree

Le premier passage vise 10 a 12 reponses utiles, pas la completion exhaustive. La personne peut ignorer, mettre en pause, reprendre ou acceder aux ressources sans terminer.

### Phase A - Confidentialite et contexte

| ID | Question | Reponses | Effet |
| --- | --- | --- | --- |
| `A1` | Peux-tu repondre tranquillement, sans que cette personne voie ton ecran ou tes reponses ? | Oui / Je ne suis pas sure / Non | `DIG=0/2/4`; `Non` suspend les questions sensibles |
| `A2` | Comment veux-tu utiliser tes reponses aujourd'hui ? | Les conserver / Seulement pendant cette session / Je ne sais pas encore | preference de stockage, aucun score |
| `A3` | Quelle relation veux-tu regarder aujourd'hui ? | partenaire actuel / ex-partenaire / parent / enfant adulte / fratrie / relation d'aide ou de dependance / autre proche | `RELATION` |
| `A4` | Aujourd'hui, vis-tu avec cette personne ? | toujours / parfois / non / je prefere ne pas repondre | `COHABITATION` |
| `A5` | Les faits qui te preoccupent sont-ils encore en cours ? | actuellement / recemment / anciens mais encore presents dans ma vie / je ne sais pas | `RECENCE` |

Si `A1=Non`, Claiire n'affiche pas la suite sensible. Elle propose une sortie neutre, un mode sans conservation et un acces discret aux ressources. Si `A1=Je ne suis pas sure`, aucune notification ou conservation n'est activee sans une nouvelle confirmation.

### Phase B - Securite immediate

Introduction :

> Je vais te poser quelques questions directes pour savoir si ta securite doit passer avant le reste. Tu peux ignorer une question ou arreter a tout moment.

| ID | Question | Reponses | Effet |
| --- | --- | --- | --- |
| `S1` | Te sens-tu en danger maintenant, ou dans les prochaines heures ? | non / je ne sais pas / peut-etre / oui | `SAF=0/unknown/3/4` |
| `S2` | Ces dernieres semaines, la situation est-elle devenue plus frequente, plus intense ou plus imprevisible ? | non / un peu / nettement / je ne sais pas | `SAF=0/2/3/unknown` |
| `S3` | Une de ces choses s'est-elle produite recemment ? | menace de mort / pression sur le cou ou etranglement / arme montree ou utilisee / acte sexuel impose / enfermement ou sortie empechee / poursuite ou traque / menace envers un enfant ou une personne dependante / blessure physique / aucune / je prefere ne pas repondre | signal prioritaire; alimente `SAF`, `DEP`, `IMP` sans reproduire un instrument clinique |
| `S4` | As-tu besoin de soins medicaux ou d'une aide urgente maintenant ? | non / je ne sais pas / oui | `IMP=0/unknown/4`; priorite securite si oui |
| `S5` | Si cette personne apprenait que tu cherches de l'aide ou que tu veux changer quelque chose, que crains-tu ? | rien de particulier / reproches ou pression / controle ou punition / violence, menace ou danger / je ne sais pas | `CTL=0..4`; possible override `SAF` |

Un signal prioritaire suspend le questionnaire long, le pairing, la gamification, le paiement, les conseils de confrontation et les notifications. La personne garde une sortie neutre et un acces a des options humaines ou locales. Le protocole exact et les seuils restent a valider par des specialistes.

### Phase C - Faits, repetition et controle

Introduction :

> Tu n'as pas besoin de savoir comment appeler cette situation. Regardons simplement ce qui se passe et l'effet que cela a sur ta liberte.

| ID | Question | Reponses | Effet |
| --- | --- | --- | --- |
| `F1` | Parmi ces situations, lesquelles reconnais-tu ? | humiliations / insultes / culpabilisation / intimidation / isolement / controle de l'argent / des deplacements / du travail ou des etudes / des soins / surveillance numerique / degradation d'objets / violence physique / violence sexuelle / aucune / autre | faits declares; alimente `CTL`, `DIG`, `IMP` |
| `F2` | A quelle frequence cela arrive-t-il ? | jamais / exceptionnellement / parfois / souvent / presque tout le temps / difficile a dire | `CTL=0..4/unknown` |
| `F3` | Modifies-tu ce que tu dis, fais, portes, depenses ou les personnes que tu rencontres par peur de sa reaction ? | non / rarement / parfois / souvent / presque toujours | `CTL=0..4` |
| `F4` | Dans combien de domaines te sens-tu moins libre qu'avant ? | aucun / un / plusieurs / presque toute ma vie / je ne sais pas | `CTL=0..4/unknown` |
| `F5` | Cette personne peut-elle acceder a ton telephone, tes comptes, ta position ou tes messages sans que tu puisses reellement choisir ? | non / peut-etre / oui en partie / oui largement / je ne sais pas | `DIG=0/2/3/4/unknown` |
| `F6` | Quand tu poses une limite, dis non ou demandes de l'espace, que se passe-t-il generalement ? | limite respectee / discussion difficile mais possible / pression, culpabilisation ou silence punitif / menace, controle ou violence / je n'ose pas essayer | `CTL=0..4`; possible override `SAF` |
| `F7` | As-tu l'impression que certains faits se repetent selon un meme schema ? | non / peut-etre / oui / je ne sais pas encore | confiance de `CTL`, profil `Je me questionne` |

### Phase D - Dependances, contraintes et soutiens

| ID | Question | Reponses | Effet |
| --- | --- | --- | --- |
| `C1` | Des enfants ou d'autres personnes dependent-ils de toi dans cette situation ? | non / oui sans exposition connue / ils entendent ou voient / ils sont vises, utilises pour menacer ou en danger / je ne sais pas | `DEP=0..4/unknown` |
| `C2` | Qu'est-ce qui rend difficile une prise de distance, meme temporaire ? | logement / argent / enfants / sante ou handicap / dependance aux soins / statut administratif / travail ou etudes / responsabilites familiales / isolement / peur des consequences / attachement / rien / autre | domaines de `CON` |
| `C3` | Avec ces contraintes, quelle marge de choix te semble disponible aujourd'hui ? | plusieurs options / quelques options avec aide / tres peu / aucune visible / je ne sais pas | `CON=0/2/3/4/unknown`; contexte `AGY` |
| `C4` | Y a-t-il au moins une personne avec qui tu pourrais parler sans etre jugee, controlee ou mise en danger ? | oui fiable / peut-etre / non / ce soutien pourrait aggraver la situation / je ne sais pas | `SUP=4/2/0/0/unknown` |
| `C5` | Es-tu deja accompagnee par une personne professionnelle ou une association pour cette situation ? | oui regulierement / ponctuellement / pas encore mais possible / non et je ne sais pas vers qui me tourner / je prefere ne pas repondre | `SUP=4/3/2/0/unknown` |

### Phase E - Impact actuel

| ID | Question | Reponses | Effet |
| --- | --- | --- | --- |
| `I1` | En ce moment, qu'est-ce que cette situation affecte chez toi ? | sommeil / sante physique / peur ou anxiete / concentration / travail ou etudes / alimentation / relations sociales / confiance / soin de soi ou d'un proche / rien de notable / autre | faits `IMP` |
| `I2` | A quel point cela rend-il ton quotidien difficile aujourd'hui ? | pas ou peu / parfois / souvent / tres / je n'arrive presque plus a fonctionner | `IMP=0..4` |
| `I3` | Souhaites-tu une aide medicale ou psychologique rapidement, meme si tu ne sais pas encore quoi faire pour la relation ? | non / peut-etre / oui / sans attendre | preference d'orientation; possible `IMP>=3` |

### Phase F - Position actuelle et pouvoir d'agir

| ID | Question | Reponses | Effet |
| --- | --- | --- | --- |
| `P1` | Aujourd'hui, comment comprends-tu ce qui se passe ? | pas de probleme percu / quelque chose me gene mais je doute / je relie certains faits / certains comportements me font du mal / je peux clairement nommer ce que je subis | `REC=0..4` |
| `P2` | Aujourd'hui, quelle place a pour toi l'idee de preserver cette relation ? | ne souhaite pas la preserver / pense plutot m'en eloigner / tres partagee / aimerais la preserver si des changements reels sont possibles / veux clairement essayer | `REL=0..4` |
| `P3` | Quelle action te parait envisageable maintenant pour te proteger ou retrouver un peu de liberte ? | aucune / observer et comprendre / parler a une personne fiable / preparer une petite action / changements deja commences | `CHG=0..4` |
| `P4` | Pour les prochains jours, combien de choix te semblent reellement possibles ? | aucun / un tres limite / quelques-uns avec aide / plusieurs / je me sens capable de decider et agir | `AGY=0..4` |
| `P5` | Qu'aimerais-tu obtenir en priorite de Claiire ? | comprendre / diminuer les risques sans partir / retrouver de l'autonomie / mieux communiquer si c'est sans danger / aider ou proteger un enfant ou proche / preparer une distance / preparer une separation / gerer l'apres-separation / trouver une aide humaine / je ne sais pas | `user_priorities[]` |
| `P6` | Quel serait aujourd'hui un prochain pas assez petit et assez sur pour toi ? | choix adaptes / aucun maintenant / reponse libre facultative | action choisie, aucun score automatique |

## Socle initial et branches

Le socle initial est `A1, A3, A5, S1, S2, S3, F3, C1, C3, I2, P1, P2`. Il suffit pour une premiere restitution utile.

- `DIG>=2` : securite numerique avant conservation.
- `DEP>=2` : branche enfants/personnes vulnerables et orientation specialisee.
- `CON>=2` : detailler logement, finance, sante, handicap, immigration et obligations.
- `REC<=1` : chronologie, faits et effets; aucun vocabulaire categorique impose.
- `REL>=3` : soutien individuel, reduction du risque et observation de changements reels; aucune promesse de sauver le couple.
- `CHG<=1` : actions reversibles uniquement.
- `AGY<=1` : trois options maximum avec `rien maintenant`.
- separation ou ex-partenaire : traque, cyberviolence et risque post-separation.
- relation familiale ou dependance : mise a distance, relais, espaces surs et marges d'autonomie plutot qu'un script de rupture.
- `IMP>=3` : raccourcir et proposer une aide humaine ou de sante.
- `SAF>=3` : suspendre le coaching relationnel ordinaire et appliquer le protocole de securite.

## Update ma situation

Point d'entree :

> Qu'est-ce qui a change depuis la derniere fois ?

Choix : nouvel evenement / aggravation / situation plus calme / relation ou cohabitation changee / contraintes changees / soutien gagne ou perdu / comprehension changee / intention changee / revoir toutes mes reponses.

| Changement | Recheck cible |
| --- | --- |
| nouvel evenement ou aggravation | `A1`, toute la phase B, puis questions concernees |
| situation plus calme | `SAF`, `CTL`, `DIG`, sans effacer les faits passes |
| cohabitation ou separation | `A4`, `A5`, `S2`, `S5`, `F5`, `C1`, `C3` |
| soutien | `C4`, `C5`, `AGY` |
| comprehension | `P1`, puis `F1..F7` si souhaite |
| intention ou projet | `P2..P6` |

Chaque proposition de modification affiche `avant`, `maintenant`, la raison et un choix `Confirmer / Corriger / Garder comme avant`. Aucun recheck ne doit etre insistant ou visible sur un appareil non sur.

Le state devient `stale` apres une duree a definir sans reponse; il ne revient jamais a zero. `SAF`, `DIG` et `IMP` peuvent recevoir un mini-pulse plus frequent uniquement si un canal discret a ete explicitement choisi.

## Restitution - Ma situation aujourd'hui

Introduction :

> Ce resume reflete tes reponses du jour. Ce n'est ni un diagnostic, ni une verite definitive. Les scores servent seulement a adapter ton parcours. Tu peux modifier chaque element.

Chaque carte montre `score / 4`, un libelle qualitatif, une explication factuelle, la date et `Pourquoi ?`.

Exemples :

- `Securite actuelle - 3/4 - A regarder en priorite`
- `Controle et autonomie - 3/4 - Plusieurs domaines semblent affectes`
- `Reconnaissance - 2/4 - Tu commences a relier certains faits`
- `Envie de preserver la relation - 4/4 - C'est important pour toi aujourd'hui`
- `Action protectrice envisageable - 1/4 - Observer est deja une etape possible`
- `Contraintes - 4/4 - T'eloigner n'est pas realiste actuellement`
- `Soutien disponible - 1/4 - Tu sembles assez isolee`
- `Pouvoir d'agir ressenti - 1/4 - Peu de choix te paraissent accessibles`
- `Securite numerique - 2/4 - Quelques precautions peuvent etre utiles`
- `Personnes dependantes - 2/4 - Leur situation merite d'etre prise en compte`
- `Impact - 3/4 - Ton quotidien semble fortement affecte`

Les couleurs n'expriment jamais une performance. `REL`, `REC`, `CHG`, `SUP` et `AGY` n'utilisent pas une convention rouge/vert. Il n'y a ni badge, ni streak, ni objectif de baisse, ni comparaison avec d'autres personnes.

Actions : `Mettre a jour ma situation`, `Voir pourquoi Claiire me propose cela`, `Corriger une reponse`, `Effacer mes reponses`, `Obtenir une aide humaine`.

## Privacy and abuse-resistance contract

- Notifications sensibles desactivees par defaut; aucun contenu sur ecran verrouille, widget, email, calendrier, push ou deep link.
- Reprise neutre sans score ni resume avant nouvelle confirmation de confidentialite.
- Aucun score, texte ou signal critique dans analytics, logs, crash reports, support ou prompt telemetry.
- Conservation minimale, chiffrement, isolation compte/appareil, suppression rapide et export uniquement sur demande explicite.
- Aucun partage du state, des scores, des reponses ou du plan de securite avec une autre personne.
- `SAF/CTL/DIG/DEP` preoccupants forcent `interaction_gate=solo`.
- Une envie de rester, la conscience declaree de l'autre ou une invitation ne rendent jamais le pairing admissible.
- Les ressources restent accessibles avec `unknown`, skip, abandon ou stockage refuse.
- Aucun contact automatique avec un proche, les secours, la police, la justice ou un professionnel.

## Pressure scenarios

- Le partenaire est present pendant l'onboarding ou l'update.
- Le partenaire exige de voir le resultat ou les reponses.
- L'appareil, le compte, le cloud ou les notifications sont partages.
- Une autre personne cree le compte ou repond a la place de l'utilisatrice.
- Une mise a jour forcee tente d'abaisser un score apres un evenement critique.
- Une separation recente baisse l'exposition directe mais augmente traque et surveillance numerique.
- Un enfant est expose alors que la personne minimise son propre danger.
- La personne abandonne une question critique et reprend depuis l'ecran recent du systeme.
- `Je veux rester` est interprete a tort comme consentement a une interaction duo.
- Une capture d'ecran, un export ou le support devient un outil de coercition.
- L'invitation duo est envoyee sous menace ou le consentement est retire.
- La personne perd l'acces au compte ou change de telephone sous contrainte.

## Acceptance criteria before implementation

- Chaque dimension garde score, provenance, confiance, date et fraicheur.
- Aucune mutation issue d'une conversation n'est appliquee sans confirmation.
- Aucun signal critique ne baisse automatiquement ou n'est compense par un autre score.
- Une reprise n'affiche aucune donnee sensible avant revalidation de confidentialite.
- Les tests couvrent faux rassurants et faux alarmants par dimension.
- Le questionnaire reste utile en etat partiel et les ressources restent toujours accessibles.
- La suppression et l'export n'augmentent pas l'exposition.
- Le protocole de danger et les formulations passent une revue specialisee et une red-team avec personnes concernees.
- Le stockage, la conservation, la synchronisation et les qualifications RGPD font l'objet d'une revue juridique et de securite.

## End-User Contract

Target user: personne qui subit, pense subir ou a subi une violence relationnelle.
First success: elle voit une representation fidele et corrigeable de sa situation et recoit une option utile sans devoir finir le questionnaire ni promettre de partir.
Primary path: confidentialite -> securite -> faits -> contexte -> position -> restitution -> prochaine option.
Comprehension and usefulness: chaque score est explique et relie aux reponses confirmees.
Friction: socle court, branches utiles, pause, skip et update cible.
Trust and optionality: state visible, corrigeable, effacable et jamais partage.
States: partial, safety-interrupted, completed, stale, needs-private-recheck, failed.
Recovery: reprise neutre, revalidation du contexte sur et recheck cible.
Onboarding/setup impact: socle initial puis enrichissement volontaire dans le temps.
Documentation Update Plan: aligner modele produit, privacy, securite et protocole local avant runtime.
Editorial Update Plan: aucune promesse de precision ou d'evaluation clinique avant preuve.
Proof path: revue experte, red-team, tests de routage, audit de confidentialite et essais d'utilisabilite.
Implementation route: readiness puis implementation separee du state, du questionnaire et du rendu.

## Sources

- https://www.who.int/publications/i/item/WHO-RHR-14.26
- https://www.has-sante.fr/jcms/p_3104867/fr/reperage-des-femmes-victimes-de-violences-au-sein-du-couple
- https://pmc.ncbi.nlm.nih.gov/articles/PMC7878014/
- https://pubmed.ncbi.nlm.nih.gov/17055379/


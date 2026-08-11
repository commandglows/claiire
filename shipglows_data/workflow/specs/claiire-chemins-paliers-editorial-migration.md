# Claiire — Migration éditoriale « chemins et paliers »

> Status: `complete`  
> Owner: Content / Frontend  
> Scope: vocabulaire public actif uniquement

## Objectif

Remplacer le vocabulaire public de formation, module, progression et déblocage par un système de lecture plus motivant et non scolaire : **chemin guidé → palier → lecture → suite de la lecture**.

## Lexique cible

| À remplacer | Formulation cible |
| --- | --- |
| formation | chemin guidé |
| module | palier |
| progression | cheminement / lecture en cours, selon le contexte |
| débloquer | accéder à la suite de la lecture |
| module complet | lecture complète du palier / suite de la lecture |
| 6 modules | 6 paliers du chemin |

Libellés de lecture autorisés : **À découvrir**, **Lecture en cours**, **Lu**.

CTA exacts :

- sans accès : **Accéder à la suite de la lecture · Premium** ;
- avec accès : **Accéder à la suite de la lecture**.

## Périmètre

- Layouts des chemins guidés publics et privés.
- Composants de parcours et cartes visibles.
- Navigation, pages et microcopies publiques visibles.
- Markdown actif de `site/src/content/docs/formations/**`.
- Pages de parcours concernées.

Priorité d’exécution : layouts formation public/privé → composants parcours → navigation visible → pages et Markdown actif.

## Inventaire actif de référence

| Surface active | Volume indicatif | Cibles d’exécution | Décision éditoriale |
| --- | ---: | --- | --- |
| Chemins publics | 561 occurrences | `site/src/content/docs/formations/**`, layout public | chemin guidé, palier, lecture |
| Espace membre | 321 occurrences | pages membres, layout privé | palier, lecture complète, suite de la lecture |
| Parcours bien-être | 203 occurrences | cartes, progression et pages parcours | chemin, paliers, cheminement |
| Home | 58 occurrences | cartes et appels à l’action | entrer dans ce chemin, paliers |
| Navigation et compte | 35 occurrences | navigation visible, connexion et compte | chemins guidés |

Les occurrences de `archive-contenu/` (environ 800) sont hors site actif et restent exclues. L’inventaire initial classe également les usages éditoriaux généraux de `site/src/content/docs/**` hors formations : ils ne sont modifiés que lorsqu’ils nomment le produit Claiire, jamais lorsqu’ils décrivent une formation réelle externe.

## Hors périmètre

- Slugs, routes, classes CSS, variables, clés techniques et archives.
- Contenu décrivant des formations externes réelles.
- Authentification, données, droits d’accès et logique de progression.
- Toute mécanique produit XP, séries, badges ou récompenses.
- Les identifiants, tests, sélecteurs, schémas, données de progression, intégrations et traduction technique des termes (`formations`, `modules`, `parcours`) lorsqu’ils ne sont pas rendus au public.

## Invariants violence

- Les chemins personnes exposées et auteurs/responsabilisation restent strictement distincts.
- Ne jamais employer XP, série, badge, « débloquer », « valider », « franchir » ou « rattraper ».
- Un palier décrit une lecture ; il ne constitue jamais une preuve de guérison, de sécurité ou de changement comportemental.
- Les ressources d’aide et de sécurité gratuites restent visibles avant toute offre ou CTA premium.
- Les formulations d’aide, de sécurité et de responsabilité existantes restent prioritaires sur le ton motivationnel.

## Batches d’exécution

Les écritures sont séquentielles afin de préserver les invariants des surfaces partagées.

1. Inventorier les occurrences actives et classer les contextes à exclure.
2. Mettre à jour les layouts publics et privés, avec les CTA et statuts normalisés.
3. Mettre à jour les composants parcours, navigation et pages visibles.
4. Mettre à jour le Markdown actif des formations et des parcours concernés, sans altérer les contenus externes.
5. Vérifier, corriger les écarts éditoriaux, puis clôturer la migration.

## Critères d’acceptation

- [x] Les surfaces publiques ciblées emploient systématiquement chemin guidé, palier et lecture de manière contextuelle.
- [x] Les CTA premium et avec accès correspondent exactement aux libellés validés.
- [x] Les statuts de lecture sont limités à « À découvrir », « Lecture en cours » et « Lu ».
- [x] Aucun terme interdit ne subsiste sur les surfaces violence ciblées.
- [x] Aucun slug, route, classe, variable, clé technique, archive, donnée, droit d’accès ou logique de progression n’est modifié.
- [x] Les contenus concernant des formations externes conservent leur sens initial.
- [x] Les chemins violence conservent l’aide gratuite avant le premium et la séparation victimes/auteurs.

## Validation requise

- Scans `rg` ciblés avant/après sur les termes remplacés, les exclusions techniques et les routes violence.
- `pnpm --dir site check`.
- `pnpm --dir site check:parcours`.
- `pnpm --dir site build`.
- `git diff --check`.
- Vérification navigateur de routes représentatives : home, navigation, parcours, chemin victimes public, chemin auteurs public et surface membre si accessible.

## Readiness

Le périmètre actif, les exclusions techniques, les invariants de sûreté, les CTA premium, les critères de validation et l’ordre séquentiel sont suffisamment définis pour exécuter la migration sans décision supplémentaire.

## History

| Date | Événement | Résultat |
| --- | --- | --- |
| 2026-08-11 | Draft créé | Lexique cible, périmètre, invariants violence, exécution séquentielle et preuves de validation enregistrés. |
| 2026-08-11 | Readiness review | Inventaire actif, exclusions techniques, CTA premium, invariants violence et validation confirmés ; statut passé à `ready`. |
| 2026-08-11 | Migration et clôture | Vocabulaire public migré vers chemin guidé, palier et lecture ; accords relus ; diff check, Astro check (0 erreur, 33 hints), 6 chemins / 36 paliers, build et scans ciblés validés. Statut passé à `complete`. |

## Skill Run History

| Date UTC | Skill | Model | Action | Result | Next step |
| --- | --- | --- | --- | --- | --- |
| 2026-08-11 | sg-docs | GPT-5 | Readiness review limitée à cette spécification | `ready` : contrat d’exécution complet et sans blocage | Migration éditoriale séquentielle |
| 2026-08-11 | sg-content | GPT-5 | Relecture finale du lexique produit et des garde-fous violence | `complete` : migration et validations terminées | Aucun autre changement requis |

## Current Chantier Flow

`complete` · migration appliquée → relecture ciblée du lexique produit et des garde-fous violence → validations éditoriales et techniques terminées → chantier clôturé.

Preuves de clôture :

- `git diff --check` : succès.
- `pnpm --dir site check` : 0 erreur, 33 hints.
- `pnpm --dir site check:parcours` : 6 chemins, 36 paliers, routes résolues.
- `pnpm --dir site build` : succès.
- Scans ciblés : aucune occurrence de `la chemin`, `à le chemin` ou ancien CTA de déblocage.

Exclusions volontaires rappelées : les routes, slugs et identifiants techniques historiques (`formations`, `modules`, `parcours`) sont conservés ; aucune logique, donnée, droit d’accès ou intégration technique n’a été modifiée.

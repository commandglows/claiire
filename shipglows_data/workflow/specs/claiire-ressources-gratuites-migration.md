# Migration des ressources Claiire gratuites

## Status

pending_validation

## Owner

Engineering / Content

## Scope

Site Astro

## Objectif

Garantir que toutes les ressources Claiire actuelles sont gratuites et lisibles intégralement sans compte, authentification, entitlement, achat ni abonnement. Les introductions publiques restent sous `/formations/**` et les pages complètes librement ouvertes restent sous `/membres/formations/**`. La migration préserve les données et intégrations existantes sans leur laisser autoriser la lecture.

## Avant / après

| Avant | Après |
| --- | --- |
| Certaines formations peuvent être présentées ou traitées comme réservées aux membres. | Toutes les ressources Claiire actuelles sont gratuites et accessibles sans autorisation de lecture. |
| Les introductions publiques et les pages complètes peuvent être confondues. | `/formations/**` conserve les introductions publiques ; `/membres/formations/**` conserve les pages complètes librement ouvertes. |
| Les routes membres peuvent dépendre de l'authentification ou d'un entitlement. | La lecture de `/membres/formations/**` ne dépend ni d'une authentification ni d'un entitlement ; aucune redirection 301 n'est prescrite par cette spécification. |
| Les CTA et microcopies peuvent évoquer Premium, paiement, abonnement ou déblocage. | Les CTA et microcopies n'emploient ni Premium, ni paiement, ni abonnement, ni déblocage. |

## Exigences fonctionnelles

- Toutes les ressources Claiire gratuites doivent être accessibles sans compte, authentification, entitlement ou paiement.
- `/formations/**` conserve les introductions publiques ; cette spécification ne suppose pas que ces routes servent la lecture complète.
- Les pages complètes sous `/membres/formations/**` doivent être lisibles sans compte, authentification, entitlement, achat ou abonnement.
- Cette spécification n'impose aucune redirection, notamment HTTP 301, entre `/membres/formations/**` et `/formations/**`.
- La création de compte et l'authentification restent facultatives et ne doivent jamais constituer un gate à la lecture des ressources.
- Les CTA et microcopies associés aux formations ne doivent mentionner ni Premium, ni paiement, ni abonnement, ni déblocage.
- Le parcours sécurité / urgence reste ouvert. Toute information ou aide destinée aux victimes doit rester distincte des contenus destinés aux auteurs, sans mélange de cible ni renvoi ambigu.

## Préservation et limites

- Ne pas supprimer Clerk, les webhooks, les métadonnées ni les données historiques.
- Ne pas modifier ni purger les comptes, événements, abonnements historiques, entitlements stockés ou données analytiques existantes.
- Les écritures en batch, si elles sont nécessaires, doivent être exécutées séquentiellement.
- Le risque RevenueCat fail-open est hors scope de cette migration et doit être traité dans un chantier séparé.

## Plan d'implémentation

1. Identifier les introductions publiques sous `/formations/**` et les pages complètes sous `/membres/formations/**`, sans modifier leur promesse de route par une hypothèse de canonical ou de redirection.
2. Retirer tout contrôle d'authentification ou d'entitlement qui empêcherait la lecture des pages complètes sous `/membres/formations/**`.
3. Retirer ou remplacer les CTA et microcopies de gating sur les parcours de ressources et leurs composants partagés.
4. Maintenir les intégrations Clerk, les webhooks et toutes les données/métadonnées historiques sans suppression.
5. Si une migration de données est requise, traiter les lots séquentiellement et conserver une trace vérifiable de chaque lot.
6. Mettre à jour la documentation business et le plan technique de gating pour refléter le modèle gratuit, la distinction introductions/pages complètes et les limites de scope.

## Critères d'acceptation

- Les pages complètes concernées sous `/membres/formations/**` sont accessibles sans compte, authentification, entitlement, achat ou abonnement.
- Un scan du site et du code concerné ne trouve aucune microcopy de formation contenant Premium, paiement, abonnement ou déblocage.
- Les introductions publiques sous `/formations/**` restent accessibles sans authentification ni entitlement.
- La vérification Astro, puis le build Astro, sont à exécuter et à consigner avant de déclarer l'implémentation validée.
- Un diff check confirme que seuls les changements nécessaires au chantier sont inclus et qu'aucune suppression de Clerk, webhooks, métadonnées ou données historiques n'a été effectuée.
- Les parcours sécurité/urgence sont accessibles sans gate et la séparation victimes/auteurs est conservée.
- La documentation business et le plan technique de gating sont à jour.

## Validation evidence-first et ZOMBIES

La validation est evidence-first : chaque critère doit être soutenu par une preuve reproductible (résultats d'accès aux introductions et aux pages complètes, sortie de scan, résultat Astro check/build, diff check et vérification documentaire) avant la clôture. À ce stade, l'implémentation est **en attente de validation** ; aucun contrôle non consigné ici ne doit être présenté comme exécuté.

Appliquer ZOMBIES aux anciens accès et messages : rechercher les routes membres, guards, CTAs, textes, liens, canonical, métadonnées et références résiduelles susceptibles de maintenir un accès historique, un gate implicite ou une promesse payante. Toute occurrence doit être supprimée du parcours actif, redirigée ou explicitement documentée comme donnée historique préservée.

## Rollback

Le déploiement doit être réversible : conserver le mapping effectif des routes, les modifications de contrôle d'accès et les changements de microcopy dans un diff isolable. Le rollback rétablit la version précédente des routes et contenus applicatifs sans supprimer ni altérer les données, webhooks, métadonnées ou historiques Clerk/RevenueCat.

## Documentation à mettre à jour

- Documentation business : toutes les ressources Claiire actuelles sont gratuites ; les introductions publiques sont sous `/formations/**` et les pages complètes librement ouvertes sous `/membres/formations/**`.
- Documentation technique : contrat d'accès indiquant que la lecture des pages complètes ne dépend pas d'un gate, que les deux familles de routes ont des rôles distincts sans promesse de redirection, et que RevenueCat fail-open relève d'un chantier séparé.

## History

- 2026-08-11 — Spec créée avec le statut `ready` pour la migration des ressources Claiire gratuites.
- 2026-08-11 — Modèle d'accès corrigé : introductions publiques sous `/formations/**`, pages complètes librement ouvertes sous `/membres/formations/**`, sans promesse de redirection. Statut passé à `pending_validation`.
- 2026-08-11 — Validation de clôture exécutée, statut conservé à `pending_validation`. Échecs bloquants : (1) `site/src/layouts/FormationModulePrivateLayout.astro:132` rend encore « Outils inclus dans l’accès premium » ; (2) le proof HTTP local sans clés Clerk retourne `500` pour les routes membres, publiques et compte, car Clerk rejette au chargement le matcher `/membres(?!/formations(?:/|$))(.*)` dans `site/src/middleware.ts` (`Invalid path`, negative lookahead non accepté). Aucun rendu d’accès libre ne peut donc être attesté.
- 2026-08-11 — Preuves positives consignées : l’inspection statique montre l’intention d’exclure `/membres/formations/**` des matchers de protection tout en gardant `/compte/**` et `/api/member-access/**` dans `isClerkProtectedRoute`; les pages complètes et les liens d’introduction correspondants existent dans les sources. Cela ne valide pas le comportement runtime tant que le matcher invalide empêche le middleware de se charger.
- 2026-08-11 — Commandes exécutées avec succès : `git diff --check`; `pnpm --dir site check` (0 erreur, 0 warning, 33 hints); `pnpm --dir site check:parcours` (6 parcours, 36 modules uniques, toutes les routes résolues); `pnpm --dir site build` (succès). Ces résultats ne remplacent pas le proof HTTP en échec.

## Skill Run History

- `sg-engineering` — 2026-08-11 — workflow d’ingénierie consulté pour cette validation. Son sous-workflow référencé n’était pas présent localement ; les gates explicites de cette spécification ont été appliqués directement.

## Current Chantier Flow

1. Corriger le matcher Clerk invalide de `site/src/middleware.ts`, puis relancer le proof HTTP anonyme des pages membres, de leurs introductions publiques, de `/compte/` et de `/api/member-access/`. Ne pas présenter ce dernier comme prouvé sans clés Clerk ni session de test.
2. Remplacer la microcopy visible « Outils inclus dans l’accès premium » dans le layout de formation privée et retirer les identifiants/styles résiduels `premium*` du layout public s’ils entretiennent le modèle obsolète.
3. Refaire le scan active source, hors `site/src/archive-contenu`. À la date de validation : aucun des termes ciblés dans le markdown de formation, `/compte` ou `/connexion`; « carburant premium » (nutrition), « premium » dans des citations anglaises, « tiers payant », « moyens de paiement » et « système d’abonnement intelligent » sont des occurrences éditoriales/contextuelles, non des gates Claiire. Les identifiants auth/billing `premium` sont techniques et l’occurrence du layout privé est le seul gate commercial visible.
4. Confirmer de nouveau, après correction runtime, le contenu complet représentatif des chemins victimes, auteurs et socle, ainsi que les liens des introductions `/formations/**` vers les pages correspondantes `/membres/formations/**`.
5. Le risque distinct de fail-open du webhook RevenueCat reste hors scope de cette migration et doit être traité dans un chantier de sécurité séparé ; ne pas le confondre avec l’accès de lecture gratuit.

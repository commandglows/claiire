# claiire — Task Backlog

## ### Audit: Design (2026-03-08)

### Fixed
- [x] 🔴 `user-select: none` on `*` globally — prevented all text selection site-wide (accessibility violation) — removed from global.css
- [x] 🟠 `user-select: none` + JavaScript copy/context-menu blocking on /bio — accessibility violation — removed both
- [x] 🟠 `confirm()` browser dialog in parcours-tracker.js — replaced with inline 2-click confirmation pattern
- [x] 🟠 Hardcoded hex colors in `.urgence-section` (#fff3cd, #ffc107, #856404) — dark mode incompatible — replaced with Starlight CSS vars (`--sl-color-orange-low`, `--sl-color-orange`, `--sl-color-orange-high`)
- [x] 🟠 Brittle DOM selector targeting Starlight internal hash classes (`astro-5lzxmn3h`) — breaks on every build — replaced with `.right-sidebar-panel > div`
- [x] 🟡 Missing `:focus-visible` styles in custom CSS — added explicit focus ring using `--sl-color-accent`
- [x] 🟡 `font-weight: 650` in ParcourCard.astro — invalid CSS value (spec allows 1-1000 but browsers snap to nearest 100) — corrected to `700`
- [x] 🟡 Custom checkbox in ParcourProgress.astro not keyboard-focusable — `display: none` removed, replaced with visually-hidden-but-focusable approach with `:focus-visible` on custom element

### Needs Decision
- 🟠 Placeholder social links in astro.config.mjs (LinkedIn, X, Facebook, Instagram, YouTube, TikTok, Reddit, Telegram, GitHub) — all pointing to placeholder URLs — needs real URLs or removal
- 🟡 Excessive `!important` usage (43 remaining) — necessary evil for Starlight overrides but should be audited when Starlight APIs stabilize
- ✅ PostHog initialized with real API key (`phc_JxkL...`) — analytics live en production (2026-03-10)

---

## SEO — Clusters & Cocon Sémantique (2026-03-10)

### Fait ✅
- [x] Créer pages pilier manquantes : `/bonheur/`, `/cellules/`, `/activite/`, `/maladie/`, `/nutrition/`, `/cosmetique/`, `/sens/`
- [x] Corriger navigation `corps.js` — tous les chemins `/corps/XXX/` → `/XXX/`, ajout Bonheur, Nutrition, Cosmétiques, Sens, Harmonie
- [x] Liens croisés Stress ↔ Système nerveux — bidirectionnel, corrige aussi les liens `/sante/...` cassés
- [x] Liens croisés Sommeil ↔ Stress ↔ Système nerveux — section "Connexions Essentielles" dans sommeil/index.md
- [x] Liens croisés Système nerveux/nutrition-nerveuse → Nutrition

### Repositionnement éditorial (coaching, pas santé)
> Le site n'est pas un site de santé. C'est un site de coaching pour être heureux, atteindre ses objectifs et surmonter les crises. La santé et la psycho y participent comme leviers, pas comme finalité.

- [x] 🔴 **Réécrire la homepage** (`src/content/docs/index.mdx`) — reformulé en angle coaching/bonheur/objectifs/crises ✅
- [x] 🔴 **Retravailler la page a-propos** — réécrite en voix "je/tu", ton coaching personnel, 350 mots ✅
- [x] 🟠 **Retravailler les 6 parcours thématiques** — enrichis en angle coaching ✅
- [x] 🟠 **Tutoiement sur tout le site** — ~100 fichiers convertis vous→tu intelligemment (2026-03-11) ✅
- [ ] 🟠 **Revoir les meta descriptions des sections pilier** — remplacer le ton "encyclopédique" par un ton "coaching/transformation"
- [ ] 🟡 Ajouter une page "Notre Approche" — expliquer pourquoi corps + esprit + violence dans un site coaching bonheur

---

### Navigation & Architecture
- [x] **Scinder "Psychologie" en deux sidebars** : `esprit.js` + `emotions.js` ✅
- [x] **Ordre des sidebars** : Parcours > Corps > Esprit > Émotions > Bonheur > Violence ✅
- [x] 🟠 **Mettre les Formations en avant** — section de premier niveau dans la nav, sortie de Violence ✅
- [x] 🟠 **Faire grandir `systeme-social/`** — 4 → 10 pages (CNV, attachement, limites, empathie, conflits) ✅
- [ ] 🟡 Reformuler l'intro de `Esprit` — `/psy/` titre générique ; passer en angle coaching/mindset

---

### Clusters SEO
- [x] 🔴 **Cluster Anxiété** — 5 pages (index, attaque de panique, anxiété sociale, solutions, corps) ✅
- [x] 🔴 **Cluster Confiance en soi** — 5 pages ✅
- [x] 🟠 **Cluster Relations** — 6 pages (+ reconstruction + relations saines) ✅
- [x] 🟠 **Cluster Burn-out** — 4 pages (+ exercices récupération 3 phases) ✅
- [x] 🟠 **Cluster Harcèlement** — 4 pages (+ sortir du harcèlement, numéros urgence) ✅
- [x] 🟡 **Cluster Deuil** — 3 pages ✅
- [x] 🟡 **Cluster Objectifs** — 5 pages (+ passer à l'action, motivation durable) ✅
- [x] 🟡 **Cluster Spiritualité** — 4 pages ✅

---

### Liens croisés — Session 2026-03-11 ✅ COMPLÉTÉ

- [x] 🟠 Lier `psy/emotions/` ↔ `bonheur/` — ~296 fichiers mis à jour sur tout le site
- [x] 🟠 Lier `psy/emotions/qualite/resilience` → `confiance/`, `bonheur/bonheur-durable`
- [x] 🟠 Lier `violence/` → `psy/trauma/`, formations, `confiance/reconstruire`
- [x] 🟠 Lier `formations/` depuis harcelement/, violence/, relations/, trauma/, psy/ — liens entrants créés
- [x] 🟡 Lier `nutrition/` ↔ `systeme-digestif/`
- [x] 🟡 Lier `systeme-immunitaire/` → `stress/` et `sommeil/`
- [x] 🟡 Lier `bonheur/` → `psy/emotions/`, `harmonie/`, `confiance/`
- [x] CTAs parcours sur toutes les pages (6 parcours linkés depuis ~296 fichiers)
- [x] LINKING-STRATEGY.md créé comme référence permanente
- [x] 4 pages bonheur/ au contenu inutilisable réécrits (Readwise highlights, lettre perso, article COVID)

### À faire — Prochaine session
- [ ] 🟡 Revoir les meta descriptions des sections pilier — ton encyclopédique → coaching
- [ ] 🟡 Reformuler l'intro de `Esprit` (`/psy/`) — passer en angle coaching/mindset
- [ ] 🟡 Ajouter une page "Notre Approche" — expliquer corps + esprit + violence dans un site coaching bonheur
- [ ] 🟢 Liens vers l'application (quand elle sera disponible) depuis les pages parcours et formations
- [x] 🟢 Vérifier le build `pnpm build` — 419 pages, build propre ✅ (2026-03-15)

### Audit maillage interne — 2026-03-16

- [x] Corriger toutes les URLs internes cassées — `pnpm check-links` OK, `pnpm build` OK
- [x] Mettre en place un vrai contrôle local des liens internes (`scripts/check-links.mjs`)
- [x] Mettre à jour `LINKING-STRATEGY.md` avec un audit réel du maillage
- [ ] 🔴 Appliquer la règle des `3 liens par page` sur les pages à `0-2` liens éditoriaux
- [ ] 🔴 Corriger le pont `stress/` → `sommeil/` sur `stress/psychique`, `stress/physique`, `stress/mecanismes`, `stress/bon-et-mauvais`
- [ ] 🔴 Corriger le pont `stress/` → `systeme-nerveux/` sur les pages restantes du cluster stress
- [ ] 🔴 Ajouter un double tunnel dans `violence/` : `formation pertinente` + `parcours pertinent`
- [ ] 🔴 Nourrir les sous-pages profondes de `formations/` avec des liens entrants exact-match depuis `violence/`, `harcelement/`, `relations/`, `psy/trauma/`
- [ ] 🟠 Réduire le nombre de pages sans lien vers `parcours/` : `204` → `< 50`
- [ ] 🟠 Réduire le nombre de pages sans lien entrant éditorial : `149` → `< 30`
- [ ] 🟠 Réduire le nombre de pages sans lien hub clair : `290` → `< 50`
- [ ] 🟠 Renforcer `relations/` + `systeme-social/` → `confiance/`
- [ ] 🟠 Traiter les pages quasi mortes SEO (0 lien sortant / 0 entrant) : relier ou assumer leur faible priorité
- [ ] 🟡 Faire un audit cluster par cluster avec checklist de liens obligatoires

---

## Migration formations public / privé — 2026-03-16

- [x] Définir le modèle cible `public SEO + privé premium`
- [x] Créer le cadrage produit dans [formations-public-private-template.md](/home/claude/claiire/shipglowz_data/editorial/site/formations-public-private-template.md)
- [x] Créer les layouts Astro [FormationModulePublicLayout.astro](/home/claude/claiire/src/layouts/FormationModulePublicLayout.astro) et [FormationModulePrivateLayout.astro](/home/claude/claiire/src/layouts/FormationModulePrivateLayout.astro)
- [x] Rédiger le plan d'exécution dans [formations-migration-plan.md](/home/claude/claiire/shipglowz_data/editorial/site/formations-migration-plan.md)
- [x] Poser [guidelines.md](/home/claude/claiire/shipglowz_data/editorial/site/guidelines.md) comme source de ton pour la migration formation
- [x] Rendre le tutoiement obligatoire sur toutes les pages publiques et privées de formation
- [x] Définir la convention technique des pages membres `/membres/formations/...`
- [x] Définir la stratégie `noindex, nofollow` des pages privées + exclusion sitemap
- [x] Lancer le premier module pilote : `victimes/2-guerison` en duo public/privé
- [x] Migrer les hubs : `/formations/`, `/formations/socle/`, `/formations/victimes/`, `/formations/auteurs/`
- [x] Exécuter le lot pilote : `socle/1-comprendre`, `victimes/2-guerison`, `auteurs/1-responsabilite`
- [x] Migrer tout le socle commun
- [x] Migrer tout le parcours victimes
- [x] Migrer tout le parcours auteurs
- [x] Couvrir tout le catalogue formation en duo `public + privé` : `4` hubs publics, `16` modules publics, `16` pages membres correspondantes
- [x] Revoir le contenu module par module pendant migration : structure, CTA, profondeur premium, FAQ, maillage
- [x] Harmoniser les hubs formation sur la logique `public d'abord, version complète ensuite`
- [x] Harmoniser la fermeture des `16` modules publics avec un CTA final explicite vers la page membre
- [x] Nettoyer le vocabulaire placeholder dans les layouts formation pour stabiliser le système éditorial
- [x] Documenter la stratégie billing / gating web + mobile dans [billing-strategy.md](/home/claude/claiire/shipglowz_data/business/billing-strategy.md)
- [x] Poser la décision produit cible : `RevenueCat` pour mobile, `Polar` pour le web, backend Claiire pour l'unification des droits
- [x] Rédiger le plan d'implémentation du gating dans [gating-implementation-plan.md](/home/claude/claiire/shipglowz_data/technical/site/gating-implementation-plan.md)
- [x] Basculer Astro en mode `server` pour rendre possible l'auth, la protection des routes membres et les webhooks billing
- [x] Poser le middleware de protection de `/membres/**` avec repli vers la page publique équivalente
- [x] Poser les helpers de session membre et les routes socles `/connexion/` et `/compte/`
- [x] Installer Clerk et brancher une intégration Astro progressive activée quand les clés sont présentes
- [x] Relier `/connexion/`, `/compte/`, `/sso-callback/` et le header au futur flux Clerk
- [ ] 🟡 Audit final qualité : SEO, maillage, duplication, cohérence produit
- [ ] 🟡 Harmoniser finement les promesses et transitions entre hubs, modules publics et pages privées
- [ ] 🟡 Renseigner les clés Clerk et valider le flux réel de connexion / déconnexion
- [ ] 🟡 Concevoir les identifiants stables `user_id`, `revenuecat_app_user_id`, `polar_customer_id`
- [x] Définir un modèle d'accès membre durable dans le `privateMetadata` Clerk
- [x] Exposer une lecture serveur propre de l'accès membre via `/api/member-access`
- [ ] 🟡 Ajouter une vraie couche d'écriture automatique : webhooks Polar, synchro RevenueCat, redirection ou onboarding après déblocage
- [ ] 🟡 Décider si un ledger/miroir SQL `member_access` reste nécessaire pour l'audit et l'historique billing
- [ ] 🟡 Ouvrir la fenêtre de vérification finale (`build`, liens, checks) quand la validation manuelle sera autorisée

---

## Refonte Formation "Sortir de la Violence" ✅ COMPLÉTÉ (2026-03-13 → 2026-03-15)

> Structure : socle commun (4 modules) → bifurcation victimes (6 modules) / auteurs (6 modules)
> Cadres cliniques : Judith Herman (victimes), Duluth + TCC + trauma-informé (auteurs)
> **Build vérifié : 419 pages, 0 erreur**

### Phase 1 — Migration mécanique ✅

- [x] Créer `formations/socle/`, `formations/victimes/`, `formations/auteurs/`
- [x] Migrer tous les modules depuis `sortir-violence/` vers les nouvelles arborescences
- [x] Supprimer `formations/sortir-violence/`, `sortir-violence-victimes/`, `sortir-violence-auteurs/`
- [x] Réécrire `src/config/navigation/formations.js`

### Phase 2 — Rédaction du contenu ✅

- [x] `formations/index.md` — présentation des 2 parcours, entrée par profil
- [x] `socle/index.md` + 4 modules S1–S4 avec Checklists Pratiques
- [x] `victimes/index.md` + 6 modules V1–V6 avec Checklists Pratiques (Herman, van der Kolk, Cyrulnik, EMDR, IFS…)
- [x] `auteurs/index.md` + 6 modules A1–A6 avec Checklists Pratiques (Festinger, Duluth, Linehan, Rosenberg, Gottman…)
- [x] 5 fichiers orphelins supprimés après audit "pépites" (de Becker intégré dans V3)
- [x] Skill `/linking` créé dans Shipglowz pour gestion SEO des liens internes

### Phase 3 — Liens internes ✅

- [x] 109 fichiers mis à jour, 223 liens migrés vers nouvelles URLs
- [x] Build `pnpm build` : 419 pages, 0 erreur

---

## Gating premium — 2026-03-18

- [x] Centraliser la resolution d'acces premium dans `src/lib/auth/member-access.ts`
- [x] Faire du `privateMetadata` Clerk la source de verite durable de l'acces premium
- [x] Exposer l'etat membre via `/api/member-access`
- [x] Afficher la source d'acces premium sur `/compte/`
- [x] Proteger `/membres/**` via Clerk + resolver premium centralise
- [x] Ajouter un script manuel `npm run member-access:set -- --user <id>` pour accorder ou retirer l'acces
- [x] Brancher les endpoints webhook RevenueCat et Polar sur la source de verite membre Clerk
- [ ] Decider si on duplique plus tard l'etat membre dans une table SQL pour audit/historique
- [ ] Configurer les secrets webhook `REVENUECAT_WEBHOOK_AUTH` et `POLAR_WEBHOOK_SECRET` dans Doppler puis dans les dashboards
- [ ] Faire un test de bout en bout sur un achat web Polar et un achat mobile RevenueCat

---

## Dependency audit — 2026-06-27

- [x] Corriger le bypass auth `@clerk/astro` `3.0.5 -> 3.0.15`
- [x] Pinner `@diane-winflowz/gamification` sur un commit avec `dist/` disponible pour les types
- [ ] Finaliser la mitigation `path-to-regexp` / `@vercel/routing-utils` et prouver la version runtime réellement utilisée
- [ ] Supprimer les devDependencies inutiles: `broken-link-checker`, `markdown-link-check`, `glob`, `nanoid`, `title-case`
- [ ] Aligner le runtime Node réel avec `engines.node >=24.0.0`
- [ ] Ajouter un pin explicite du gestionnaire de paquets et du runtime (`packageManager`, `.nvmrc`)
- [ ] Configurer Dependabot ou Renovate pour les mises à jour automatiques
- [ ] Ouvrir un chantier `/404-sf-migrate` pour les migrations majeures (`@clerk/astro`, `@astrojs/vercel`, `@astrojs/vue`, `astro`, `@types/node`, `glob`, `nanoid`, `typescript`)

🟢 [site] task: Unify package manager and lockfile for site installs and audits | status: done | area: dependencies | id: site-deps-package-manager
🟠 [site] task: Validate esbuild override on the effective package manager and prove runtime mitigation | status: todo | area: security | id: site-deps-esbuild-mitigation
🟢 [site] task: Align actual Node runtime with engines.node and pin packageManager | status: done | area: configuration | id: site-deps-runtime-pin
🟡 [site] task: Add automated dependency update coverage for site | status: todo | area: configuration | id: site-deps-automation

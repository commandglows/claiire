# Changelog

Toutes les modifications notables de ce projet sont documentées ici.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/),
et ce projet respecte le [Semantic Versioning](https://semver.org/).

## [Unreleased] — 2026-03-18

### Modifié
- **Migration Astro 5 → 6** : astro ^6.0.6, @astrojs/vercel ^10.0.1, @astrojs/vue ^6.0.1
- Content collections migrées vers Content Layer API (`src/content.config.ts` avec `glob()` loader)
- `entry.render()` → `render(entry)` dans DocEntryPage.astro
- `@astrojs/check` et `typescript` déplacés en devDependencies
- Patch/minor updates : @astrojs/sitemap 3.7.1, @astrojs/check 0.9.8, vue 3.5.30, nodemon 3.1.14
- Scripts orphelins `format:titles` et `format:all` supprimés (fichier source manquant)

### Ajouté
- `.nvmrc` (Node 24) et champ `engines` dans package.json

### Supprimé
- `src/content/config.ts` (remplacé par `src/content.config.ts`)

---

## [Unreleased] — 2026-03-18 (auth)

### Ajouté
- Architecture auth premium : `shipglowz_data/business/billing-strategy.md`, `shipglowz_data/technical/site/gating-implementation-plan.md`
- Intégration Clerk progressive : middleware `/membres/**`, pages `/connexion/`, `/compte/`, `/sso-callback/`
- 16 pages membres premium sous `/membres/formations/` (socle/1-4, victimes/1-6, auteurs/1-6)
- Layouts Astro réutilisables pour modules publics et privés avec contrôle `robots`
- Nouveau système de routage : `[...slug].astro`, pages parcours statiques, 404 custom
- Composants : `DocEntryPage`, `ParcoursPage`, `SiteHeader`, `SiteFooter`, `DocsSidebar`, `SidebarTree`
- Scripts de vérification de liens internes (`check-links.mjs`, `fix-internal-links.mjs`)
- Script manuel `member-access:set` pour accorder ou retirer l'acces premium dans Clerk
- Endpoints webhook `RevenueCat` et `Polar` pour synchroniser automatiquement l'acces premium
- Plugin remark-callouts pour callouts custom dans le contenu
- Docs strategie : `shipglowz_data/branding/branding.md`, `shipglowz_data/business/project-competitors-and-inspirations.md`, `shipglowz_data/research/site/source.md`, `shipglowz_data/editorial/site/formations-public-private-template.md`

### Modifié
- Astro basculé en mode `server` pour auth, gating premium et webhooks billing
- Catalogue formation entièrement migré en duo public/privé : 4 hubs + 16 modules publics + 16 pages membres
- Formation "Sortir de la Violence" refondue : socle (4) + victimes (6) + auteurs (6) modules avec sources cliniques
- Checklists Pratiques sur tous les 16 modules (exercice hebdomadaire + grille auto-évaluation)
- Contenu docs entièrement revu : frontmatter harmonisé, liens croisés, ton coaching
- CSS global refondu (~1200 lignes de styles custom Starlight)
- Navigation, ParcourCard, ParcourProgress, GamificationBar mis à jour
- Content collection config (`config.ts`) revu pour le nouveau schéma
- `package.json` et dépendances mises à jour (@clerk/astro ajouté)
- Resolver d'acces premium centralise (`src/lib/auth/member-access.ts`) + endpoint serveur `/api/member-access`
- `/compte/` enrichie avec l'etat premium et la source d'acces
- Source de verite premium deplacee vers le `privateMetadata` Clerk, avec fallback temporaire env/cookie
- Les achats mobile (`RevenueCat`) et web (`Polar`) convergent maintenant vers la meme ecriture d'acces membre dans Clerk

### Supprimé
- `src/content/contenu/` archivé vers `src/archive-contenu/` (ancienne collection de contenu)
- `src/content/docs/index.mdx` remplacé par `src/pages/index.astro`
- Ancienne arborescence `formations/sortir-violence/` (22 fichiers migrés)
- `GamificationFooter.astro` supprimé
- Pages parcours `.mdx` remplacées par pages `.astro` statiques

## [Unreleased] — 2026-03-11

### Ajouté
- 8 nouveaux clusters de contenu : anxiété (5 pages), confiance en soi (5p), relations (6p), burn-out (4p), harcèlement (4p), deuil (3p), objectifs (5p), spiritualité (4p)
- Cluster anxiété : attaques de panique, anxiété sociale, solutions TCC/ACT/MBSR, manifestations corporelles
- Cluster burn-out : causes, récupération, exercices pratiques en 3 phases avec signaux d'alarme précoces
- Cluster harcèlement : scolaire, professionnel, + page "sortir du harcèlement" avec démarches concrètes et numéros d'urgence
- Cluster objectifs : méthode SMART, 5 pourquoi, règle des 2 min, motivation durable (Deci & Ryan)
- Cluster relations : reconstruction après rupture/trahison, relations saines, 5 langages de l'amour
- Système social : 4 → 10 pages (CNV de Rosenberg, théorie de l'attachement, poser ses limites, empathie, gestion des conflits)
- Page d'index formations + sidebar formations en section de premier niveau dans la navigation
- Navigation modulaire : `bonheur.js`, `emotions.js`, `esprit.js`, `formations.js`
- Script `scripts/schedule_content.py` pour l'échelonnement progressif des publications

### Modifié
- Page À propos entièrement réécrite en voix personnelle "je/tu", angle coaching (350 mots, zéro bibliographie)
- Formations sorties de la section Violence et promues en section principale de la nav
- Tutoiement appliqué sur ~100 fichiers (conversion vous→tu grammaticalement correcte, citations préservées)
- 6 parcours thématiques enrichis en angle coaching
- Homepage repositionnée coaching/bonheur/objectifs/crises

### Corrigé
- `user-select: none` global supprimé (violation accessibilité)
- Couleurs hardcodées dans `.urgence-section` remplacées par variables CSS Starlight
- Sélecteurs DOM fragiles ciblant des classes internes Astro

## [Initial] — 2026-03-08

### Ajouté
- Lancement du site Claiire (rebrand depuis transformemavie)
- Architecture navigation modulaire en 6 sections : Parcours, Corps, Esprit, Émotions, Violence, Accueil
- Page /bio link-in-bio
- Intégration PostHog analytics
- Script postinstall.cjs pour compatibilité Vercel
- Schéma de contenu étendu avec champ `pubDate` pour la planification éditoriale

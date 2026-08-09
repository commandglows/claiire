# Plan de migration — formations public / prive

## Objectif

Migrer les contenus de formation vers une architecture en deux couches :

- **public** : page SEO indexable, utile, persuasive
- **prive** : approfondissements, exercices de progression, suivi et outils premium non critiques

Le but n'est pas seulement de deplacer le contenu.
Le but est de **recomposer** chaque module dans un nouveau systeme :

1. meilleur funnel SEO
2. meilleure monétisation
3. meilleur maillage interne
4. contenu de formation plus net et plus actionnable

## Decision de positionnement 2026-08-09

Ce plan reste un historique d'execution, mais son architecture produit est corrigee : il n'existe plus de socle commun obligatoire avant bifurcation. Les themes communs sont dupliques et adaptes dans deux parcours strictement separes. Les ressources de securite, d'urgence et d'interruption immediate restent publiques, quel que soit le modele premium.

## Source de ton et de posture

Toute la migration doit etre alignee sur :

- [guidelines.md](/home/claude/claiire/shipglows_data/editorial/site/guidelines.md)
- [billing-strategy.md](/home/claude/claiire/shipglows_data/business/billing-strategy.md)

Regles transversales :

- toutes les pages publiques et privees sont redigees en tutoiement
- aucun melange `tu / vous`
- le contenu doit rester clair, bienveillant, concis et actionnable
- les formations violence doivent respecter la posture specifique definie dans `shipglows_data/editorial/site/guidelines.md`

Cette contrainte fait partie de la definition de termine pour chaque module.

---

## Inventaire a migrer

### Hubs

- `/formations/`
- `/formations/socle/` (route historique a reorienter vers les deux parcours, pas un parcours commun)
- `/formations/victimes/`
- `/formations/auteurs/`

### Modules socle

- `/formations/socle/1-comprendre/`
- `/formations/socle/2-neurobiologie/`
- `/formations/socle/3-stabilisation/`
- `/formations/socle/4-cognition/`

### Modules victimes

- `/formations/victimes/1-securite/`
- `/formations/victimes/2-guerison/`
- `/formations/victimes/3-limites/`
- `/formations/victimes/4-relations/`
- `/formations/victimes/5-autonomie/`
- `/formations/victimes/6-ancrage/`

### Modules auteurs

- `/formations/auteurs/1-responsabilite/`
- `/formations/auteurs/2-cycle/`
- `/formations/auteurs/3-emotions/`
- `/formations/auteurs/4-empathie/`
- `/formations/auteurs/5-relations/`
- `/formations/auteurs/6-prevention/`

Total :

- `4` hubs
- `16` modules
- `20` pages publiques a refondre
- `16` pages privées a creer

---

## Architecture cible

### Public

Les URLs publiques existantes restent la couche SEO :

- `/formations/...`

### Prive

Les contenus premium vivent dans un espace membre distinct :

- `/membres/formations/...`

Exemple :

- public : `/formations/victimes/2-guerison/`
- prive : `/membres/formations/victimes/2-guerison/`

### Regle de contenu

#### Public

- promesse
- cadrage
- debut de contenu
- preuve
- FAQ
- CTA de debloquage

#### Prive

- approfondissement pedagogique non critique
- exercice guide
- checklist
- protocole de progression hors urgence
- ressources premium
- progression

---

## Ce qu'on ameliore pendant la migration

Chaque module ne doit pas etre seulement coupe en deux.
Il doit etre **ameliore**.

### A corriger dans les contenus actuels

- structure parfois trop "cours long" et pas assez orientee resultat
- sections de note editoriale encore presentes
- densite parfois trop forte sans segmentation produit
- CTA premium absents
- maillage vers articles, parcours et formations profondes encore inegal

### Ce qu'on ajoute

- un hero clair
- un angle SEO explicite
- un positionnement "pour qui / pour quoi"
- un bloc "ce que tu debloques"
- un vrai teaser coupe net
- une FAQ SEO
- un maillage obligatoire sortant
- une version privee avec execution concrete
- une verification de coherence avec `shipglows_data/editorial/site/guidelines.md`

---

## Strategie de migration

Il ne faut **pas** migrer les 16 modules d'un coup.
Il faut migrer par lots logiques.

## Phase 0 — Cadre technique

### Livrables

- [x] template de reference produit : [formations-public-private-template.md](/home/claude/claiire/shipglows_data/editorial/site/formations-public-private-template.md)
- [x] layout Astro public : [FormationModulePublicLayout.astro](/home/claude/claiire/src/layouts/FormationModulePublicLayout.astro)
- [x] layout Astro prive : [FormationModulePrivateLayout.astro](/home/claude/claiire/src/layouts/FormationModulePrivateLayout.astro)

### Reste a faire

- definir comment le membership sera resolu cote route / auth
- aligner le gating avec la strategie `RevenueCat mobile + Polar web + backend Claiire`
- definir la convention de fichiers des pages privees
- definir la gestion `noindex` des pages privees

---

## Phase 1 — Page mere formations

### Pages

- `/formations/`
- `/formations/socle/`
- `/formations/victimes/`
- `/formations/auteurs/`

### Objectif

Poser le funnel avant de retoucher les modules.

### Resultat attendu

- pages publiques plus vendeuses et plus SEO
- CTA clairs vers debloquage ou vers modules
- architecture de promesse coherentente entre socle, victimes, auteurs

### Pourquoi commencer la

Parce que ces pages vont porter la logique du nouveau systeme et servir de modele pour tous les modules.

---

## Phase 2 — Lot pilote

### Pages

- `/formations/socle/1-comprendre/`
- `/formations/victimes/2-guerison/`
- `/formations/auteurs/1-responsabilite/`

### Pourquoi ce lot

Ce trio couvre les trois cas d'usage :

- socle
- victime
- auteur

Il permet de valider :

- le template public
- le template prive
- le ton
- la profondeur teaser / premium
- le maillage interne

### Livrables

Pour chaque module :

1. une page publique refondue
2. une page privee premium
3. un mapping clair de ce qui reste public vs prive
4. une validation tonale contre `shipglows_data/editorial/site/guidelines.md`

### Regle

Tant que ce lot n'est pas satisfaisant, on ne migre pas tout le reste.

---

## Phase 3 — Themes transversaux adaptes par parcours

### Pages

- `/formations/socle/2-neurobiologie/`
- `/formations/socle/3-stabilisation/`
- `/formations/socle/4-cognition/`

### Objectif

Reutiliser les connaissances utiles sans creer de parcours, progression ou etat commun. Chaque version doit etre reecrite selon la responsabilite, le risque et le besoin du parcours concerne.

### Benefice

Le socle devient un veritable produit SEO et un point d'entree fort depuis :

- `violence/`
- `harcelement/`
- `psy/`
- `stress/`

---

## Phase 4 — Parcours victimes complet

### Pages

- `/formations/victimes/1-securite/`
- `/formations/victimes/3-limites/`
- `/formations/victimes/4-relations/`
- `/formations/victimes/5-autonomie/`
- `/formations/victimes/6-ancrage/`

### Objectif

Transformer le parcours victimes en funnel complet :

- acquisition via SEO
- reponse au besoin
- debloquage progressif

### Maillage obligatoire

Depuis chaque module victimes :

- `psy/trauma/`
- `confiance/`
- `relations/`
- `parcours/stress` ou `parcours/relations` selon le module

---

## Phase 5 — Parcours auteurs complet

### Pages

- `/formations/auteurs/2-cycle/`
- `/formations/auteurs/3-emotions/`
- `/formations/auteurs/4-empathie/`
- `/formations/auteurs/5-relations/`
- `/formations/auteurs/6-prevention/`

### Objectif

Faire du parcours auteurs une offre claire, serieuse et maillée.

### Maillage obligatoire

Depuis chaque module auteurs :

- `violence/mecanismes/`
- `psy/communication/`
- `relations/`
- `parcours/relations` ou `parcours/esprit` selon le module

---

## Phase 6 — Audit final du systeme

### A verifier

- toutes les pages publiques sont `index, follow`
- toutes les pages privées sont `noindex, nofollow`
- tous les modules publics ont un CTA premium
- toutes les pages publiques ont un maillage sortant suffisant
- toutes les pages privees ont une navigation membre coherente
- la profondeur premium est reelle
- les pages ne sont pas dupliquees mot pour mot

---

## Grille de repartition public / prive

### Garde en public

- intro
- cadre du probleme
- contexte clinique / scientifique
- benefices
- pour qui
- debut du contenu
- FAQ
- teasers des exercices et checklists

### Passe en prive

- checklist complete
- protocoles de progression detailles hors urgence
- exercices guides
- journaux / templates
- ressources premium
- progression et implementation

---

## Definition of done par module

Un module est considere migre quand :

1. la page publique est reecrite avec le layout public
2. la page privee existe avec le layout prive
3. la frontmatter SEO est propre
4. le CTA premium est en place
5. le maillage interne est coherent
6. le contenu premium n'apparait pas dans le HTML public
7. le build passe

---

## Ordre d'execution recommande

1. hubs `formations/`
2. lot pilote `socle + victimes + auteurs`
3. tout le socle
4. tout le parcours victimes
5. tout le parcours auteurs
6. audit final

---

## Recommendation pragmatique

Ne pas chercher a "migrer la formation".
Chercher a **produire un nouveau systeme**.

Ca veut dire :

- on garde les bonnes idees du contenu existant
- on coupe les longueurs inutiles
- on recompose le fond en experience publique + premium
- on se sert de la migration pour augmenter la qualite editoriale

Autrement dit :

**migration = refonte + produit + SEO + monétisation**

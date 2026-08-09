# Structure de la Formation "Sortir de la Violence"

## Fondements cliniques

Cette structure s'appuie sur trois cadres théoriques validés :

1. **Judith Herman (Trauma and Recovery, 1992)** — modèle en 3 phases : Sécurité → Deuil/Intégration → Reconnexion. Référence mondiale pour les victimes de violence.
2. **Modèle de Duluth + TCC** — pour les auteurs : psychoéducation, roue du pouvoir et du contrôle, restructuration cognitive, responsabilisation.
3. **Trauma-informed care (van der Kolk, s-CAPE 2024)** — approche holistique corps/cerveau, applicable aux deux profils. La recherche récente (Voith et al., BWJP 2018) montre que les programmes auteurs efficaces doivent aussi traiter les traumatismes non résolus de ces derniers.

---

## Principe de la formation

```
                    SOCLE COMMUN (4 modules)
                    ┌────────────────────────┐
                    │  Comprendre            │
                    │  Neurobiologie         │
                    │  Régulation émotionnelle│
                    │  Schémas cognitifs     │
                    └────────────┬───────────┘
                                 │
               ┌─────────────────┴──────────────────┐
               ▼                                    ▼
    PARCOURS VICTIMES (6 modules)       PARCOURS AUTEURS (6 modules)
    Modèle Herman 3 phases              Modèle Duluth + TCC + trauma
```

---

## Socle Commun

> Identique pour les deux profils. Positionné AVANT la bifurcation.

| # | Module | Contenu clé | Cadre clinique |
|---|--------|-------------|----------------|
| S1 | **Comprendre la violence** | Formes, cycles, mécanismes, emprise | Psychoéducation, roue du pouvoir et du contrôle (Duluth) |
| S2 | **Corps et cerveau** | Impact neurobiologique du trauma, système nerveux, réactions de survie (4F) | van der Kolk, Peter Levine |
| S3 | **Réguler ses émotions** | Fenêtre de tolérance, stabilisation, ressources intérieures, ancrage corporel | Linehan (DBT), Herman phase 1 |
| S4 | **Schémas cognitifs** | Croyances limitantes, pensées automatiques, dialogue intérieur | TCC, Aaron Beck |

---

## Parcours Victimes

> Basé sur les 3 phases de Judith Herman + pratiques cliniques actuelles.

### Phase 1 — Sécurité

| # | Module | Contenu clé |
|---|--------|-------------|
| V1 | **Plan de sécurité** | Évaluation du danger, plan d'urgence, réseau de soutien, ressources légales et pratiques |
| V2 | **Guérison du trauma** | Deuil des pertes, intégration de l'expérience traumatique, libération des empreintes somatiques |

### Phase 2 — Reconstruction de soi

| # | Module | Contenu clé |
|---|--------|-------------|
| V3 | **Poser ses limites** | Assertivité, progression échelonnée, réalignement du pouvoir personnel |
| V4 | **Reconstruction relationnelle** | Théorie de l'attachement, confiance en soi et en l'autre, distinguer relations saines/toxiques |

### Phase 3 — Reconnexion à la vie

| # | Module | Contenu clé |
|---|--------|-------------|
| V5 | **Autonomisation** | Reprendre le pouvoir sur sa vie, projet de vie, décisions, indépendance émotionnelle |
| V6 | **Ancrage durable** | Identifier les signaux d'alerte, maintenir les acquis, prévenir la revictimisation |

---

## Parcours Auteurs

> Basé sur le modèle Duluth + TCC + approche trauma-informée (Voith et al., 2018).
> La recherche montre que les programmes efficaces associent responsabilisation ET traitement des traumatismes non résolus.

### Phase 1 — Responsabilité

| # | Module | Contenu clé |
|---|--------|-------------|
| A1 | **Sortir du déni** | Reconnaître ses comportements violents, comprendre la minimisation/justification, prendre sa responsabilité sans s'auto-flageller |
| A2 | **Comprendre son cycle** | Roue du pouvoir et du contrôle (Duluth), déclencheurs personnels, escalade de la tension |

### Phase 2 — Transformation

| # | Module | Contenu clé |
|---|--------|-------------|
| A3 | **Gérer ses émotions** | Colère, frustration, impulsivité — identifier, réguler, exprimer sans violence |
| A4 | **Développer l'empathie** | Comprendre l'impact réel sur les victimes, sortir de l'égocentrisme, travail sur ses propres traumatismes |

### Phase 3 — Engagement durable

| # | Module | Contenu clé |
|---|--------|-------------|
| A5 | **Relations équilibrées** | Communication non violente, égalité dans le couple, roue de l'égalité (Duluth) |
| A6 | **Prévention de la récidive** | Plan de prévention personnalisé, signes d'alerte, engagement à long terme, ressources de soutien |

---

## Structure de fichiers proposée

```
formations/
├── index.md                          ← Présentation des 2 parcours
│
├── socle/
│   ├── index.md                      ← Intro au socle + ordre recommandé
│   ├── 1-comprendre/
│   │   └── index.md
│   ├── 2-neurobiologie/
│   │   └── index.md
│   ├── 3-stabilisation/
│   │   ├── index.md
│   │   └── ancrage-corporel.md       ← Sous-page pratiques
│   └── 4-cognition/
│       ├── index.md
│       └── dialogue-interieur.md     ← Sous-page pratiques
│
├── victimes/
│   ├── index.md                      ← Point d'entrée + renvoi vers socle
│   ├── 1-securite/
│   │   └── index.md
│   ├── 2-guerison/
│   │   └── index.md
│   ├── 3-limites/
│   │   ├── index.md
│   │   └── progression-echelonnee.md ← Sous-page pratiques
│   ├── 4-relations/
│   │   └── index.md
│   ├── 5-autonomie/
│   │   └── index.md
│   └── 6-ancrage/
│       └── index.md
│
└── auteurs/
    ├── index.md                      ← Point d'entrée + renvoi vers socle
    ├── 1-responsabilite/
    │   └── index.md
    ├── 2-cycle/
    │   └── index.md
    ├── 3-emotions/
    │   └── index.md
    ├── 4-empathie/
    │   └── index.md
    ├── 5-relations/
    │   └── index.md
    └── 6-prevention/
        └── index.md
```

**Total : ~22 pages** (4 socle + 6 victimes + 6 auteurs + 3 index + 3 sous-pages pratiques)

---

## Fichiers actuels à réutiliser / migrer

| Fichier actuel | Destination |
|----------------|-------------|
| `sortir-violence/1-comprendre/` | → `socle/1-comprendre/` |
| `sortir-violence/4-neurobiologie/` | → `socle/2-neurobiologie/` |
| `sortir-violence/3-stabilisation/` + `boucles-retroaction/` | → `socle/3-stabilisation/` (fusionner) |
| `sortir-violence/5-cognition/` + `dialogue-interieur.md` | → `socle/4-cognition/` |
| `sortir-violence/2-securite/` | → `victimes/1-securite/` |
| `sortir-violence/6-guerison/` | → `victimes/2-guerison/` |
| `sortir-violence/7-limites/` + sous-pages | → `victimes/3-limites/` |
| `sortir-violence/8-relations/` | → `victimes/4-relations/` |
| `sortir-violence/9-autonomie/` | → `victimes/5-autonomie/` |
| `sortir-violence/10-prevention/` | → `victimes/6-ancrage/` |
| `sortir-violence-victimes/` | → fusionner dans `victimes/index.md` |
| `sortir-violence-auteurs/` | → base pour `auteurs/index.md` |
| `sortir-violence/conclusion.md` | → à redistribuer dans les deux `index.md` finaux |
| `sortir-violence/presentation.md` | → fusionner dans `formations/index.md` |

**Modules auteurs A1→A6 : à créer entièrement** (le contenu actuel est trop minimal)

---

## Navigation sidebar (minimaliste)

```javascript
// formations.js
{
  label: 'Formations',
  items: [
    { label: 'Présentation', link: '/formations/' },
    {
      label: 'Socle Commun',
      collapsed: true,
      items: [
        { label: '1 · Comprendre la violence', link: '/formations/socle/1-comprendre/' },
        { label: '2 · Corps et cerveau', link: '/formations/socle/2-neurobiologie/' },
        { label: '3 · Réguler ses émotions', link: '/formations/socle/3-stabilisation/' },
        { label: '4 · Schémas cognitifs', link: '/formations/socle/4-cognition/' },
      ]
    },
    {
      label: 'Parcours Victimes',
      collapsed: true,
      items: [
        { label: 'Introduction', link: '/formations/victimes/' },
        { label: '1 · Plan de sécurité', link: '/formations/victimes/1-securite/' },
        { label: '2 · Guérison du trauma', link: '/formations/victimes/2-guerison/' },
        { label: '3 · Poser ses limites', link: '/formations/victimes/3-limites/' },
        { label: '4 · Reconstruction relationnelle', link: '/formations/victimes/4-relations/' },
        { label: '5 · Autonomisation', link: '/formations/victimes/5-autonomie/' },
        { label: '6 · Ancrage durable', link: '/formations/victimes/6-ancrage/' },
      ]
    },
    {
      label: 'Parcours Auteurs',
      collapsed: true,
      items: [
        { label: 'Introduction', link: '/formations/auteurs/' },
        { label: '1 · Sortir du déni', link: '/formations/auteurs/1-responsabilite/' },
        { label: '2 · Comprendre son cycle', link: '/formations/auteurs/2-cycle/' },
        { label: '3 · Gérer ses émotions', link: '/formations/auteurs/3-emotions/' },
        { label: '4 · Développer l\'empathie', link: '/formations/auteurs/4-empathie/' },
        { label: '5 · Relations équilibrées', link: '/formations/auteurs/5-relations/' },
        { label: '6 · Prévenir la récidive', link: '/formations/auteurs/6-prevention/' },
      ]
    },
  ]
}
```

---

## Décisions prises (et pourquoi)

**Socle à 4 modules (pas 3, pas 6)**
La recherche clinique (s-CAPE, van der Kolk, Herman) montre que comprendre/neurobiologie/régulation/cognition sont universels aux deux profils. Un socle plus court risquerait de manquer des fondations, un socle plus long diluerait la bifurcation.

**6 modules par parcours**
Aligné sur les programmes validés (Herman 3 phases × 2 sous-étapes pour victimes ; Duluth 3 phases × 2 sous-étapes pour auteurs). Ni trop court (superficiel), ni trop long (abandons).

**Parcours auteurs à recréer entièrement**
L'actuel `sortir-violence-auteurs/` est une page d'une vingtaine de lignes. Les recherches montrent que les programmes efficaces pour auteurs sont structurés, séquencés, et incluent un volet trauma de leur propre histoire (Voith et al., BWJP 2018). C'est un travail de création.

**Navigation minimaliste mais complète**
Chaque module est listé dans la sidebar pour permettre la navigation libre, mais les sections sont collapsées par défaut — on voit l'architecture sans être submergé.

**Sous-pages pratiques limitées**
Seuls les modules qui nécessitent une plongée technique ont des sous-pages (ex: `ancrage-corporel.md`, `dialogue-interieur.md`, `progression-echelonnee.md`). Les autres restent des pages uniques.

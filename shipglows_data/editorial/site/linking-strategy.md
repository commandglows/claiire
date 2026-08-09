# Stratégie de liens internes — Claiire

## Objectifs
1. **SEO** : construire l'autorité thématique par clusters, faciliter le crawl
2. **Tunnel** : guider vers les parcours et formations (pages à valeur)

---

## Audit réel du maillage (2026-03-16)

### État global

- `411` pages de contenu publiées analysées
- `207` pages seulement ont au moins un lien vers un `parcours/`
- `204` pages n'ont **aucun lien tunnel** vers un parcours
- `149` pages n'ont **aucun lien entrant éditorial** détecté
- `290` pages ne respectent pas encore correctement la logique **hub** (pas de lien clair vers pillar / section parente)

### Ce qui fonctionne déjà

- `psy/emotions/` → `bonheur/` : `90%` de couverture (`28/31`)
- `psy/trauma/` → `confiance/` : `100%` (`4/4`)
- `burnout/` → `parcours/stress|sante` : `100%` (`4/4`)
- `deuil/` → `parcours/bonheur` : `100%` (`3/3`)
- Clusters très bien orientés vers `parcours/` : `stress`, `sommeil`, `systeme-nerveux`, `systeme-immunitaire`, `burnout`, `anxiete`, `bonheur`

### Faiblesses structurelles

- `stress/` → `sommeil/` : seulement `33%` (`2/6`) alors que c'est un pont prioritaire
- `stress/` → `systeme-nerveux/` : `67%` (`4/6`) — bon mais pas encore systématique
- `relations/` + `systeme-social/` → `confiance/` : `69%` (`11/16`)
- `violence/` → `formations/` : `71%` (`89/126`) — mieux qu'avant, mais trop de trous
- `violence/` → `parcours/` : quasi absent (`2%`) alors que trauma / stress / reconstruction devraient pousser aussi vers les parcours
- Les sous-pages profondes de `formations/` reçoivent trop peu de liens entrants ; la plupart des liens se concentrent sur `/formations` et `/formations/victimes`

### Concentration actuelle des liens entrants

Les gros hubs actuels sont :

- `/formations` : `125` liens entrants
- `/parcours/sante` : `91`
- `/formations/victimes` : `72`
- `/stress/solutions-naturelles` : `57`
- `/parcours/esprit` : `41`
- `/parcours/bonheur` : `37`
- `/parcours/relations` : `28`
- `/parcours/stress` : `21`
- `/parcours/sommeil` : `8`

Conclusion : le site a déjà des hubs forts, mais le graphe reste trop inégal. Le problème n'est plus la casse des URLs ; c'est maintenant la **discipline de circulation** entre articles, pillars, clusters voisins, parcours et formations.

---

## 1. Modèle hub-spoke

```
Article → Pillar page du cluster → Section nav → Parcours
```

- Chaque article **doit pointer vers sa pillar page** (index du cluster)
- Les pillar pages **se croisent entre sections** (émotions ↔ bonheur, stress ↔ sommeil...)
- Les parcours sont les **pages de destination finale** — toujours dans la chaîne

---

## 2. Tunnel de conscience (AIDA adapté)

```
Problème (émotions) → Compréhension (psy/approches) → Solution (bonheur/harmonie) → Action (parcours/)
```

| Étape | Pages typiques | Lien vers |
|-------|---------------|-----------|
| Prise de conscience | `psy/emotions/`, `stress/`, `trauma/` | Articles bonheur/, solutions |
| Compréhension | Pillar pages, approches psy | Parcours correspondant |
| Solution | `bonheur/`, `harmonie/`, `confiance/` | Parcours + formations si pertinent |
| Action | `parcours/` | Formations (si applicable) |

---

## 3. Règles anchor text

| ✅ Bon | ❌ À éviter |
|--------|-----------|
| "gérer ton anxiété" | "cliquez ici" |
| "découvre le parcours bonheur" | "en savoir plus" |
| "comprendre tes émotions" | "cette page" |
| "reconstruire ta confiance en toi" | "voir aussi" |

- Anchor = **mot-clé cible de la page de destination**
- Varier légèrement les anchors pour la même page cible (synonymes)
- Jamais de URL brute comme anchor

---

## 4. Règle des 3 liens par page

Chaque page de contenu doit avoir **au minimum** :

1. **1 lien hub** → sa pillar page (ou la section parente)
2. **1 lien croisé** → un cluster voisin logiquement lié
3. **1 lien tunnel** → un parcours pertinent (CTA contextuel intégré dans le texte)

---

## 5. Ponts thématiques prioritaires

Ces paires de clusters sont proches sémantiquement → liens croisés systématiques :

| Cluster A | Cluster B | Logique |
|-----------|-----------|---------|
| `psy/emotions/` | `bonheur/` | comprendre ses émotions → construire le bonheur |
| `stress/` | `sommeil/` | stress perturbe le sommeil |
| `stress/` | `systeme-nerveux/` | mécanisme physiologique |
| `trauma/` | `confiance/` | trauma brise la confiance |
| `psy/emotions/anxiete/` | `parcours/stress` | anxiété → parcours stress |
| `deuil/` | `parcours/bonheur` | sortir du deuil → retrouver le bonheur |
| `burnout/` | `parcours/stress` | burnout → parcours stress |
| `burnout/` | `parcours/sante` | burnout → parcours santé |
| `relations/` | `confiance/` | relations saines ↔ confiance |
| `violence/` | `trauma/` | violence génère du trauma |
| `violence/` | `formations/` | formations dédiées → promotion systématique |

---

## 6. Liens vers les formations

Les formations ne sont plus à `0`, mais elles restent **mal distribuées** :

- la majorité des liens entrants vont vers `/formations` et `/formations/victimes`
- les sous-pages `socle/`, `auteurs/` et `victimes/` profondes restent sous-alimentées

Règle : **toute page qui aborde la violence, le harcèlement ou les mécanismes de manipulation** doit contenir un lien vers la formation correspondante.

Anchor type : "la formation [nom]" ou "notre formation sur [sujet]"

---

## 7. Format recommandé pour les liens contextuels

Intégrer les liens **dans le corps du texte**, pas seulement en fin d'article :

```markdown
# Dans le corps
...quand l'anxiété s'installe, elle affecte directement [ton système nerveux](/systeme-nerveux/)...

# En fin de section ou d'article (CTA doux)
→ Si tu veux aller plus loin : [Parcours stress — reprendre le contrôle](/parcours/stress/)
```

Éviter les listes de liens "Voir aussi" en bas de page — préférer l'intégration naturelle.

---

## Priorités d'implémentation

1. 🔴 Faire respecter la règle des `3 liens par page` sur toutes les pages qui ont `0`, `1` ou `2` liens éditoriaux
2. 🔴 Corriger le pont `stress/` ↔ `sommeil/` sur toutes les pages du cluster stress
3. 🔴 Ajouter un double tunnel sur `violence/` : `formation correspondante` + `parcours` pertinent quand le sujet touche trauma / stress / reconstruction / relations
4. 🔴 Nourrir les sous-pages profondes de `formations/` avec des liens entrants exact-match depuis `violence/`, `harcelement/`, `relations/`, `psy/trauma/`
5. 🟠 Corriger les pages semi-orphelines : zéro lien sortant, zéro lien entrant ou absence de lien hub
6. 🟠 Renforcer `relations/` + `systeme-social/` ↔ `confiance/`
7. 🟠 Généraliser les liens hub vers l'index du cluster parent
8. 🟢 Optimiser les anchors sur les liens déjà présents

---

## Règle éditoriale opérationnelle

À partir de maintenant, toute nouvelle page doit sortir avec cette structure minimale intégrée **dans le texte** :

1. Un lien vers sa page pilier ou section parente
2. Un lien vers un cluster voisin prioritaire
3. Un CTA vers un `parcours/`
4. Si la page touche à la violence, au harcèlement ou à la manipulation : un lien vers la `formation/` la plus pertinente

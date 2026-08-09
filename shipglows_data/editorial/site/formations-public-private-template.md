# Template formations — page publique + page privee

## Principe

Une formation n'est pas une page unique.

C'est un duo :

1. Une **page publique indexable** qui ranke, eduque, qualifie et vend
2. Une **page privee** qui livre la methode complete

Le contenu premium ne doit pas etre expose dans le HTML public.

## Source editoriale de reference

Le ton, la posture et les regles de copywriting des pages formation ne doivent pas etre improvises.

La source de verite est :

- [guidelines.md](/home/claude/claiire/shipglows_data/editorial/site/guidelines.md)
- [billing-strategy.md](/home/claude/claiire/shipglows_data/business/billing-strategy.md)

Regles non negociables pour les formations :

- tutoiement partout
- pas de melange `tu / vous`
- ton clair, bienveillant, precis, actionnable
- pas de ton institutionnel froid
- pas de ton marketing agressif

Pour les contenus lies a la violence, au trauma et aux parcours victimes / auteurs :

- remercier la personne d'etre la quand c'est pertinent
- ne jamais juger
- etre ferme sur les actes, doux sur la personne
- ne pas ajouter de honte ou de panique a une situation deja lourde
- ne jamais proposer un parcours partage, une mediation ou une responsabilite symetrique
- adapter tout exercice au parcours concerne, meme lorsqu'un theme existe dans les deux parcours
- laisser en acces public les informations critiques de securite, les ressources d'urgence et l'orientation humaine
- ne jamais faire de la peur, du danger ou de la culpabilite un argument de vente

Le premium peut financer la profondeur pedagogique, le suivi et les outils de progression. Il ne peut pas conditionner l'acces a une action necessaire pour se mettre en securite ou interrompre un passage a l'acte imminent.

## Templates Astro disponibles

Les layouts Astro reutilisables sont maintenant :

- [FormationModulePublicLayout.astro](/home/claude/claiire/src/layouts/FormationModulePublicLayout.astro)
- [FormationModulePrivateLayout.astro](/home/claude/claiire/src/layouts/FormationModulePrivateLayout.astro)

Ils ne sont pas encore branches sur un systeme membre ou sur les modules existants.
Ils servent de base de rendu pour les futures pages Astro publiques et privees.

La resolution reelle de l'acces membre et du premium est documentee dans :

- [billing-strategy.md](/home/claude/claiire/shipglows_data/business/billing-strategy.md)

## Modele d'URL recommande

### URL publique

```text
/formations/victimes/2-guerison/
```

### URL privee

```text
/membres/formations/victimes/2-guerison/
```

Alternative acceptable :

```text
/app/formations/victimes/2-guerison/
```

## Regle SEO

- La page publique : `index, follow`
- La page privee : `noindex, nofollow`
- La page publique doit avoir une vraie valeur SEO
- La page privee doit reprendre la promesse, puis debloquer l'execution
- Pas de duplication mot pour mot entre public et prive

---

## Structure de la page publique

La page publique est une **page de vente SEO utile**.
Elle doit donner envie, rassurer, eduquer, et preparer l'achat.

### 1. Hero SEO

Objectif : capter la requete, poser la promesse, qualifier le bon lecteur.

Contenu :

- Titre SEO fort
- Sous-titre clair
- Pour qui c'est
- Benefice principal
- CTA principal

Exemple :

```md
# Guerir du trauma apres la violence : comprendre ce qui se passe et retrouver de l'ancrage

Tu te sens encore envahi(e) par ce que tu as vecu ? Ce module t'aide a comprendre la guerison traumatique, a nommer les mecanismes du corps et a voir comment avancer sans te brusquer.

[Debloquer le module complet]
```

### 2. Intro utile

Objectif : donner une vraie valeur immediate.

Contenu :

- Le probleme
- Pourquoi c'est difficile
- Pourquoi ce module existe

### 3. Debut de contenu

Objectif : prouver que le module contient du fond.

Contenu :

- Une vraie section educative
- Un angle expert
- Une articulation claire avec le reste du parcours

Important :

- Cette partie doit etre utile seule
- Mais elle ne doit pas livrer l'integralite de la methode

### 4. Ce que tu vas comprendre dans ce module

Objectif : transformer le contenu en resultat mental concret.

Format recommande :

```md
## Dans ce module, tu vas comprendre

- pourquoi la guerison n'est pas lineaire
- ce que le trauma fait au corps et au systeme nerveux
- comment reconnaitre les phases de reconstruction
- ce qu'un accompagnement serieux peut apporter
```

### 5. Pour qui / pour quoi

Objectif : qualification.

Format recommande :

```md
## Ce module est pour toi si...

- tu te sens encore bloque(e) par ce que tu as vecu
- tu veux comprendre la guerison sans bullshit
- tu cherches un cadre fiable pour avancer
```

### 6. Quelques elements de fond

Objectif : continuer a nourrir le SEO et la credibilite.

Contenu possible :

- 2 a 4 sous-sections de fond
- une mini explication scientifique ou clinique
- un exemple concret
- un lien vers un article du cluster

### 7. Bloc "ce que tu debloques dans la version complete"

Objectif : faire monter la desirabilite du premium.

Format recommande :

```md
## Ce que tu debloques dans le module complet

- la checklist de guerison a utiliser chaque semaine
- l'exercice guide pas a pas
- le protocole d'auto-observation
- les ressources premium et points de vigilance
```

### 8. Bloc teaser coupe net

Objectif : creer le manque sans frustrer betement.

Format recommande :

```md
## Extrait du module complet

Dans la version complete, on entre dans la phase pratique :

- comment identifier ou tu en es reellement
- comment utiliser la lettre non envoyee sans te submerger
- comment savoir si tu as besoin d'un cadre therapeutique

Pour acceder a la suite :

[Debloquer le module complet]
```

### 9. FAQ SEO

Objectif : capter les requetes secondaires et lever les objections.

Questions types :

- Comment guerir d'un trauma psychologique ?
- Peut-on guerir sans therapie ?
- Combien de temps prend la guerison ?
- Quelle difference entre trauma, stress et emprise ?

### 10. Maillage obligatoire

Chaque page publique de module doit contenir :

- 1 lien vers le hub formation parent
- 1 lien vers un article du cluster associe
- 1 lien vers un cluster voisin
- 1 lien vers le module suivant ou precedent

Exemple :

- `/formations/victimes/`
- `/psy/trauma/`
- `/confiance/reconstruire`
- `/formations/victimes/3-limites/`

### 11. CTA final

Objectif : conclure net.

Format recommande :

```md
## Tu veux le module complet ?

Debloque la version approfondie pour acceder aux exercices de progression, au suivi et aux outils premium. Les ressources de securite et d'urgence restent accessibles gratuitement.

[Debloquer ce module]
```

---

## Structure de la page privee

La page privee garde la meme promesse, mais bascule en mode execution.

Elle peut reprendre une version plus courte du hero public, puis debloquer la suite.

### 1. Hero membre

Contenu :

- Titre
- rappel du resultat vise
- progression dans la formation

### 2. Resume rapide

Objectif : remettre le cerveau dans le bon contexte.

Contenu :

- ce que tu vas faire ici
- ce qu'il vaut mieux ne pas faire
- combien de temps prevoir

### 3. Contenu approfondi

Ici, tu peux livrer le vrai module.

Contenu type :

- explications completes
- nuances cliniques
- developpements longs
- exemples
- etudes de cas

### 4. Exercice guide

Format recommande :

```md
## Exercice guide

### Etape 1
...

### Etape 2
...

### Etape 3
...
```

### 5. Checklist actionnable

Format recommande :

```md
## Checklist pratique

- [ ] J'ai fait ...
- [ ] J'ai note ...
- [ ] J'ai repere ...
- [ ] J'ai prepare ...
```

### 6. Protocole

Objectif : donner une methode concrete repetable.

Exemples :

- protocole de stabilisation
- protocole de journal d'observation
- protocole de preparation a une conversation

### 7. Ressources premium

Contenu possible :

- PDF
- audio
- fiche resume
- carnet de suivi
- bibliographie commentee

### 8. Points de vigilance

Objectif : eviter la mauvaise utilisation.

Contenu :

- quand ralentir
- quand demander de l'aide
- quand ce module ne suffit plus

### 9. Auto-evaluation

Format recommande :

```md
## Auto-evaluation

- Pas encore
- Je commence a voir
- Oui, clairement
```

### 10. Navigation premium

Contenu :

- module precedent
- module suivant
- retour au parcours formation

---

## Repartition de valeur recommandee

### Public

- promesse
- clarte
- education
- preuve
- qualification
- desir

### Prive

- execution
- transformation
- repetition
- outils
- personnalisation

---

## Regle de redaction simple

### La page publique repond a :

- Pourquoi ce module existe ?
- Pourquoi il est important ?
- Pourquoi maintenant ?
- Pourquoi toi ?
- Pourquoi payer ?

### La page privee repond a :

- Qu'est-ce que je fais concretement ?
- Dans quel ordre ?
- Avec quels outils ?
- Comment savoir si j'avance ?

---

## Mini exemple de duo

### Version publique

```md
# Guerir du trauma apres la violence

Comprends ce qui se passe dans ton corps, pourquoi la guerison n'est pas lineaire, et comment retrouver un cadre plus stable pour avancer.

## Ce que tu vas comprendre
- ce qu'est vraiment le trauma
- pourquoi tu ne reagis pas "comme avant"
- a quoi ressemble une vraie reconstruction

## Extrait
Le trauma n'est pas seulement un souvenir douloureux. C'est une empreinte sur le systeme nerveux...

## Dans le module complet
- l'exercice guide
- la checklist
- le protocole de reconstruction

[Debloquer le module complet]
```

### Version privee

```md
# Guerir du trauma apres la violence

Bienvenue dans la version complete du module.

## Exercice guide
...

## Checklist pratique
...

## Protocole
...

## Ressources premium
...

## Module suivant
...
```

---

## Decision produit recommandee

Le bon schema pour Claiire est :

- pages `formations/*` publiques et indexables
- contenu premium sur `/membres/` ou `/app/`
- meme promesse, meme structure generale, mais execution reservee

Autrement dit :

**Public = valeur autonome + securite + orientation + CTA non pressant**

**Prive = approfondissement + exercices de progression + suivi**

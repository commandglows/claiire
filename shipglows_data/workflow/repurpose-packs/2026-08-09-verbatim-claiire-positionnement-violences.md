---
artifact: repurpose_pack
metadata_schema_version: "1.0"
artifact_version: "0.1.0"
project: claiire
created: "2026-08-09"
updated: "2026-08-09"
status: draft
source_skill: 007-sg-content
scope: verbatim-conversation-archive
owner: Diane
confidence: high
risk_level: high
security_impact: none
docs_impact: yes
source_type: conversation
source_ref: "Four messages preceding the verbatim 4 command about Claiire's violence-focused positioning"
linked_systems:
  - site/
  - app/
  - shipglows_data/workflow/specs/claiire-coach-operating-model.md
next_step: none
depends_on:
  - artifact: "skills/references/repurpose-pack-storage.md"
    required_status: active
supersedes: []
evidence:
  - "Verbatim preservation requested explicitly by the operator."
---

# Archive verbatim — positionnement de Claiire face aux violences

## Message 1 — Utilisateur — verbatim

j'hésite à mort en fait, je sais qu'il faut se spécialiser pour réussir et moi j'aimerais aider les victimes de violences. Et en meme temps, beaucoup du site est centré autour de la santé en général, la nutrition etc et tout cela est important évidemment la vie est holistique. Donc je ne sais pas, est ce qu'on fait 2 app, une pour le bien être et l'autre coach anti violence, ou est ce qu'on se présente comme un produit multi dimensionnel qui fait coach anti violence et aide aussi à la vie en général ? Est ce qu'on se présente comme un coach en évolution personnelle, avec un focus sur la violence ou est ce qu'on l'écrit en gros qu'on aide les victimes de violence ? Etant donné le paysage marketing actuel

## Message 2 — Assistant — verbatim

🧱 CHANTIER (spec) : Claiire Coach Operating Model  
🎯 VERDICT (12:11) : repositionnement recommandé avant implémentation

Ma recommandation nette : **une seule app, spécialisée dans la reconstruction après les violences, avec une approche globale de la vie et de la santé.**

La formule stratégique est :

> **La violence est la porte d’entrée. La reconstruction globale est le produit.**

Évite les trois positionnements suivants :

- **“Application de bien-être holistique”** : marché très encombré, promesse interchangeable.
- **“Coach en évolution personnelle avec un focus violence”** : formulation trop faible, qui dissimule justement ta différence.
- **“Coach anti-violence”** : évoque l’urgence, le signalement ou le militantisme plus que l’accompagnement personnel.

Le territoire le plus crédible serait :

> **Claiire accompagne les personnes qui vivent ou ont vécu des violences à retrouver leurs repères, leur autonomie et une vie qui leur appartient.**

Puis le produit travaille toutes les dimensions de cette reconstruction : sécurité, système nerveux, sommeil, alimentation, confiance, limites, relations, travail, projets et plaisir.

Le marché français de l’urgence est déjà occupé par des acteurs fortement légitimés : App-Elles pour l’alerte et les contacts de confiance, Mémo de Vie pour les preuves et les démarches, Ti3rs pour les échanges post-séparation, En avant toute(s) pour l’écoute humaine. Ces services sont souvent gratuits, associatifs ou soutenus institutionnellement. [Panorama gouvernemental](https://arretonslesviolences.gouv.fr/index.php/focus/applications-de-la-lutte-contre-les-violences-sexistes-sexuelles-et-au-sein-du-couple), [Mémo de Vie](https://www.france-victimes.fr/index.php/nos-engagements/memo-de-vie), [App-Elles](https://apps.apple.com/fr/app/app-elles/id1458360794).

Claiire ne devrait donc pas prétendre remplacer ces dispositifs. Son espace différenciant est **l’accompagnement quotidien entre la prise de conscience et la reconstruction durable**. Quelques programmes commerciaux occupent déjà ce terrain, comme Askellen, mais ils reposent beaucoup sur des intervenants humains, leurs qualifications et une sélection claire des personnes qu’ils peuvent accompagner. [Programme Askellen](https://www.askellen.fr/).

Sur le site, le mot **« violences » doit apparaître immédiatement**, mais sans obliger la personne à se reconnaître déjà comme « victime ». Beaucoup cherchent d’abord des formulations comme « est-ce normal ? », « relation toxique », « pourquoi je n’arrive pas à partir ? » ou « retrouver confiance après une relation destructrice ».

Une bonne structure de message serait :

> **Retrouver tes repères. Reprendre ta vie.**  
> Claiire t’accompagne pour comprendre les violences que tu vis ou as vécues, te reconstruire et avancer à ton rythme.

Je ciblerais initialement un segment encore plus précis : **les femmes adultes francophones en prise de conscience, sortie ou reconstruction après des violences conjugales ou psychologiques**. Le produit peut accueillir d’autres personnes, mais le marketing doit parler clairement à quelqu’un.

Les contenus santé existants ne doivent pas être supprimés. Ils deviennent les piliers de la reconstruction, tandis que les sujets trop éloignés, comme la cosmétique ou certaines maladies, cessent d’occuper le premier plan. Actuellement, la homepage reste généraliste dans [index.astro](/home/claude/claiire/site/src/pages/index.astro), alors que le contrat business reconnaît déjà les victimes de violences comme segment dans [business.md](/home/claude/claiire/shipglows_data/business/business.md). C’est cette hiérarchie qu’il faut corriger.

Enfin, si Claiire s’adresse aussi aux personnes encore exposées, la sécurité devient constitutive du produit : sortie rapide, notifications neutres, collecte minimale, usage discret, orientation humaine et aucune prétention de gérer une urgence. Mémo de Vie applique déjà une sortie instantanée et un accès discret ; la CNIL rappelle aussi les exigences renforcées concernant permissions, notifications et données sensibles. [France Victimes](https://www.france-victimes.fr/index.php/nos-engagements/memo-de-vie), [CNIL](https://www.cnil.fr/fr/applications-mobiles-votre-vie-privee-devra-etre-mieux-protegee).

La spec [claiire-coach-operating-model.md](/home/claude/claiire/shipglows_data/workflow/specs/claiire-coach-operating-model.md) devrait donc être réorientée avant son passage en readiness : **“coach de reconstruction après les violences”**, et non plus simplement “coach de progression personnelle”.

## Message 3 — Utilisateur — verbatim

d'accord mais moi je pensais à aider les personnes qui sont en train de vivre cela, pas forcément 'se reconstruire après', et tu sais que je veux aider les auteurs de violences aussi

## Message 4 — Assistant — verbatim

🧱 CHANTIER (spec) : Claiire Coach Operating Model  
🎯 VERDICT (12:14) : positionnement recentré sur l’arrêt des violences

Tu as raison : j’avais réduit ton intention à la reconstruction. Ta mission est plus large et plus forte :

> **Aider à faire cesser la violence pendant qu’elle existe, en accompagnant séparément les personnes qui la subissent et celles qui l’exercent.**

Je conserverais **une seule marque et une seule app**, mais avec deux parcours totalement séparés.

La promesse principale pourrait devenir :

> **La violence n’est pas une fatalité.**  
> Claiire aide les personnes qui la subissent à se protéger et retrouver leurs repères, et celles dont les comportements deviennent violents à les interrompre et changer durablement.

Les deux portes d’entrée devraient utiliser des formulations accessibles :

- **Je subis des comportements qui m’inquiètent**
- **Mes comportements me font peur**
- Éventuellement plus tard : **Je m’inquiète pour un proche**

Évite « Je suis victime » et « Je suis auteur » comme seuls choix : beaucoup de victimes ne se reconnaissent pas encore dans le premier terme, tandis que beaucoup d’auteurs quitteront immédiatement devant le second.

La séparation comportementale doit être stricte :

| Personne qui subit | Personne qui exerce |
|---|---|
| Reconnaître la violence | Reconnaître ses actes |
| Évaluer le danger | Interrompre l’escalade |
| Se mettre en sécurité | Prendre de la distance sans représailles |
| Préserver ses preuves et ressources | Assumer la responsabilité sans se justifier |
| Retrouver son autonomie | Identifier ses mécanismes de contrôle |
| Être orientée vers une aide adaptée | Être orientée vers le 08 019 019 11 et les CPCA |

Le produit ne doit jamais proposer une médiation de couple, une conversation partagée ou un programme où chacun serait invité à « faire sa part ». Les sources publiques distinguent clairement le conflit, où la négociation reste possible, de la violence, fondée sur un rapport de domination. La médiation familiale est d’ailleurs interdite lorsque des violences sont alléguées. [Arrêtons les violences](https://www.arretonslesviolences.gouv.fr/besoin-d-aide/violences-au-sein-du-couple).

Côté auteurs, il existe une vraie place pour Claiire. Les CPCA accompagnent déjà les démarches volontaires et judiciaires afin de prévenir le passage à l’acte et la récidive. La FNACAV défend une posture d’écoute et de confiance dans la capacité de changement, sans retirer la responsabilité des actes. [Ma Sécurité](https://www.masecurite.interieur.gouv.fr/fr/actualites/prevenir-violences-conjugales-dispositifs-pour-agir-proteger), [FNACAV](https://www.fnacav.fr/).

La santé holistique garde toute sa pertinence, mais son rôle diffère :

- Pour une personne qui subit, sommeil, nutrition, système nerveux et confiance soutiennent la sécurité et l’autonomie.
- Pour une personne qui exerce, stress, alcool, fatigue ou histoire personnelle peuvent être explorés comme facteurs de vulnérabilité, mais **jamais comme causes excusant la violence**.

Le meilleur positionnement n’est donc plus « coach en évolution personnelle spécialisé dans la violence ». Ce serait plutôt :

> **Claiire, l’accompagnement numérique pour reconnaître, interrompre et sortir des violences relationnelles.**

Le coaching en évolution personnelle devient la méthode utilisée pour accompagner le changement. **Faire cesser la violence devient la mission affichée.**

La spec actuelle doit être corrigée en profondeur : elle traite la violence comme un cas d’escalade hors du coaching, alors qu’elle doit maintenant définir deux modèles d’accompagnement spécialisés, avec la sécurité des personnes qui subissent comme priorité supérieure.

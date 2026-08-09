# Claiire - Site Web

Site web de ressources sur le bien-être, la psychologie et la santé.

## 🚀 Lancement Rapide

### Prérequis

- [Node.js](https://nodejs.org/) version 24
- pnpm

### Installation et Lancement

1. **Cloner le dépôt** (si ce n'est pas déjà fait)
   ```bash
   git clone https://github.com/dianedef/claiire.git
   cd claiire
   ```

2. **Installer les dépendances**
   ```bash
   pnpm install
   ```
   
   La version du gestionnaire est fixée dans `package.json` (`pnpm@11.8.0`).

3. **Lancer le serveur de développement**
   ```bash
   pnpm dev
   ```
   ou simplement:
   ```bash
   pnpm start
   ```

4. **Ouvrir dans le navigateur**
   
   Le site sera accessible à l'adresse: http://localhost:4321/

## 📜 Scripts Disponibles

- `pnpm dev` ou `pnpm start` - Lance le serveur de développement
- `pnpm build` - Construit le site pour la production
- `pnpm preview` - Prévisualise le build de production localement
- `pnpm check` - Vérifie les erreurs TypeScript et Astro
- `pnpm format` - Formate le code avec Prettier
- `pnpm format:check` - Vérifie le formatage du code

## 🛠️ Technologies Utilisées

- [Astro](https://astro.build/) - Framework web statique
- [Starlight](https://starlight.astro.build/) - Thème de documentation Astro
- TypeScript - Typage statique
- Node.js - Environnement d'exécution

## 📁 Structure du Projet

```
/
├── public/          # Fichiers statiques
├── src/
│   ├── assets/     # Images et autres assets
│   ├── config/     # Configuration de navigation
│   ├── content/    # Contenu en Markdown
│   │   └── docs/   # Pages de documentation
│   └── styles/     # Styles CSS globaux
├── scripts/        # Scripts utilitaires
└── package.json    # Dépendances et scripts npm
```

## 🌐 Déploiement

Le site est configuré pour être déployé sur Vercel. Les commits sur la branche principale déclenchent automatiquement un déploiement.

## 🔧 Dépannage

### Erreur lors de l'installation
Si vous rencontrez des erreurs pendant `pnpm install`, essayez:
```bash
pnpm install --force
```

### Le serveur ne démarre pas
Assurez-vous que:
- Node.js version 24 est installé: `node --version`
- Le port 4321 n'est pas déjà utilisé
- Les dépendances sont correctement installées

### Problèmes de contenu
Si vous voyez des erreurs de validation de contenu, vérifiez que tous les fichiers Markdown dans `src/content/docs/` ont:
- Un frontmatter YAML valide avec au minimum un champ `title`
- Une structure correcte

Exemple de frontmatter minimal:
```yaml
---
title: Titre de la page
---
```

## 📝 Contribuer

1. Créez une branche pour vos modifications
2. Effectuez vos changements
3. Testez localement avec `pnpm dev`
4. Soumettez une pull request

## 📄 Licence

[Insérer information de licence ici]

## 👥 Contact

[Insérer informations de contact ici]

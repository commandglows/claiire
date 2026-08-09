# Rive Companion Animations — Plan

## Design Brief

Style : mignon, simple, coloré, joyeux, doux. Formes rondes, pas d'angles durs.

### Personnages

| Perso | Couleurs | Personnalité |
|-------|----------|-------------|
| **Lumo** | violet/doré | Rayonnant, expressif, stratège |
| **Papillon** | vert/turquoise | Léger, fluide, hype man |
| **Étoile** | rose/crème | Doux, rassurant, healer |

### 5 états par personnage

- `idle` — respiration calme (loop)
- `happy` — sourire, léger bounce
- `excited` — pulse rapide, yeux brillants (XP gagné, level up)
- `thinking` — regard en haut, clignotement lent (en train de répondre)
- `sad` — tête baissée, couleurs atténuées (crise, bad mood)

## Comment les créer

### Option 1 : Rive MCP + Claude Code (meilleure)

Le MCP Rive permet à Claude Code de piloter l'éditeur Rive directement.

**Contraintes :**
- Nécessite Rive Early Access **desktop app** (Mac dispo, Windows en cours)
- L'app Rive doit être ouverte sur la même machine que Claude Code
- C'est un MCP local (contrôle l'éditeur graphique), pas une API distante

**Setup le jour J :**
1. Télécharger Rive Early Access desktop sur rive.app/downloads
2. Ajouter dans la config MCP de Claude Code :
```json
{
  "mcpServers": {
    "rive": {
      "command": "npx",
      "args": ["-y", "@rive-app/mcp-server"]
    }
  }
}
```
3. Ouvrir Rive desktop
4. Lancer Claude Code sur le même ordi → il pilote l'éditeur

**Note :** vérifier la doc à jour sur rive.app/docs/editor/mcp/integration avant de setup, le format peut changer.

### Option 2 : Éditeur web (fallback)

Si le MCP n'est pas dispo sur Windows :
1. Aller sur editor.rive.app dans un navigateur
2. Claude Code guide étape par étape (formes, couleurs, keyframes, state machine)
3. Export des fichiers `.riv`

### Option 3 : Fiverr / Upwork

Briefer un animateur Rive avec ce document.

## Intégration dans l'app

Une fois les `.riv` créés :

1. Les placer dans `app/assets/rive/lumo.riv`, `papillon.riv`, `etoile.riv`
2. Remplacer le placeholder Reanimated dans `features/companion/components/CompanionAvatar.tsx`
3. Utiliser `rive-react-native` pour lire les fichiers et contrôler les state machines
4. Brancher les événements app sur les états Rive :
   - XP gagné → `excited`
   - Habitude complétée → `happy`
   - Crise loguée → `sad`
   - Companion répond → `thinking` → `happy`
   - Inactif → `idle`

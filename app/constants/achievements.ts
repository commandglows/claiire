export type AchievementCategory =
  | "starter"
  | "streak"
  | "combo"
  | "volume"
  | "crisis"
  | "routine"
  | "intervention"
  | "insight"
  | "level";

export type AchievementDef = {
  id: string;
  icon: string;
  title: string;
  description: string;
  xpBonus: number;
  category: AchievementCategory;
  /** For progress-based achievements: total required to unlock */
  target?: number;
};

export const CATEGORY_LABELS: Record<AchievementCategory, { label: string; emoji: string }> = {
  starter: { label: "Premiers pas", emoji: "🌱" },
  streak: { label: "Séries", emoji: "🔥" },
  combo: { label: "Combos", emoji: "💎" },
  volume: { label: "Volume", emoji: "📊" },
  crisis: { label: "Batailles", emoji: "⚔️" },
  routine: { label: "Routines", emoji: "🌅" },
  intervention: { label: "Arsenal", emoji: "🛡️" },
  insight: { label: "Intelligence", emoji: "💡" },
  level: { label: "Niveaux", emoji: "⬆️" },
};

export const ACHIEVEMENTS: AchievementDef[] = [
  // Premiers pas
  { id: "first_log", icon: "📝", title: "Premier rapport", description: "Tu as loggé pour la première fois.", xpBonus: 25, category: "starter" },
  { id: "first_habit", icon: "⚡", title: "Première mission", description: "Tu as créé ta première habitude.", xpBonus: 25, category: "starter" },
  { id: "first_companion", icon: "🤝", title: "Premier allié", description: "Tu as choisi ton compagnon.", xpBonus: 10, category: "starter" },
  { id: "first_routine", icon: "🌅", title: "Première routine", description: "Tu as créé ta première routine.", xpBonus: 25, category: "starter" },

  // Combos
  { id: "daily_combo", icon: "🔥", title: "Combo du jour", description: "Sommeil + Humeur + Habitude en une journée.", xpBonus: 50, category: "combo" },
  { id: "daily_combo_7", icon: "💎", title: "Semaine parfaite", description: "7 daily combos consécutifs.", xpBonus: 200, category: "combo" },

  // Streaks
  { id: "streak_3", icon: "🌱", title: "3 jours", description: "Séquence de 3 jours consécutifs.", xpBonus: 25, category: "streak" },
  { id: "streak_7", icon: "🌿", title: "Une semaine", description: "Séquence de 7 jours consécutifs.", xpBonus: 100, category: "streak" },
  { id: "streak_14", icon: "🌲", title: "Deux semaines", description: "14 jours sans fléchir.", xpBonus: 200, category: "streak" },
  { id: "streak_30", icon: "🌳", title: "Un mois", description: "Séquence de 30 jours. Respect.", xpBonus: 500, category: "streak" },
  { id: "streak_100", icon: "👑", title: "Centurion", description: "100 jours de série. Tu es légendaire.", xpBonus: 1000, category: "streak" },

  // Volume
  { id: "logs_10", icon: "📊", title: "10 rapports", description: "Tu as loggé 10 fois.", xpBonus: 50, category: "volume", target: 10 },
  { id: "logs_50", icon: "📈", title: "50 rapports", description: "50 rapports de combat.", xpBonus: 150, category: "volume", target: 50 },
  { id: "logs_100", icon: "🏆", title: "100 rapports", description: "100 rapports. Tu es un guerrier.", xpBonus: 300, category: "volume", target: 100 },
  { id: "logs_500", icon: "🎖️", title: "Commandant", description: "500 rapports. Force de la nature.", xpBonus: 500, category: "volume", target: 500 },

  // Crises
  { id: "crisis_survived", icon: "🛡️", title: "Survivant", description: "Tu as traversé ta première crise.", xpBonus: 30, category: "crisis" },
  { id: "crisis_5_survived", icon: "⚔️", title: "Vétéran", description: "5 crises surmontées.", xpBonus: 100, category: "crisis", target: 5 },
  { id: "crisis_10_survived", icon: "🗡️", title: "Guerrier d'élite", description: "10 crises. Tu connais le champ de bataille.", xpBonus: 200, category: "crisis", target: 10 },

  // Routines
  { id: "routine_first_complete", icon: "✅", title: "Routine complète", description: "Tu as terminé une routine à 100%.", xpBonus: 30, category: "routine" },
  { id: "routine_7_days", icon: "🌟", title: "7 jours de routine", description: "Routine complétée 7 jours de suite.", xpBonus: 150, category: "routine" },
  { id: "routine_morning_night", icon: "🔄", title: "Double routine", description: "Matin ET soir complétés le même jour.", xpBonus: 50, category: "routine" },

  // Interventions
  { id: "intervention_first", icon: "🏥", title: "Première contre-attaque", description: "Tu as utilisé une intervention.", xpBonus: 20, category: "intervention" },
  { id: "intervention_mastered", icon: "⭐", title: "Maître d'arme", description: "Tu as maîtrisé une intervention (10x).", xpBonus: 100, category: "intervention" },
  { id: "intervention_all_tried", icon: "🎯", title: "Tout l'arsenal", description: "Tu as essayé toutes les interventions.", xpBonus: 75, category: "intervention" },

  // Insights
  { id: "first_insight", icon: "💡", title: "Première insight", description: "L'app a détecté un pattern.", xpBonus: 20, category: "insight" },
  { id: "prediction_acted", icon: "🎯", title: "Frappe préventive", description: "Tu as agi sur une alerte prédictive.", xpBonus: 30, category: "insight" },
  { id: "pattern_confirmed", icon: "🧠", title: "Analyste", description: "5 patterns confirmés.", xpBonus: 100, category: "insight", target: 5 },

  // Levels
  { id: "level_5", icon: "⬆️", title: "Niveau 5", description: "Tu montes en puissance.", xpBonus: 50, category: "level" },
  { id: "level_10", icon: "🌟", title: "Niveau 10", description: "Double chiffres. Impressionnant.", xpBonus: 150, category: "level" },
  { id: "level_20", icon: "💫", title: "Niveau 20", description: "Vétéran confirmé.", xpBonus: 300, category: "level" },
  { id: "level_50", icon: "👑", title: "Niveau 50", description: "Légende vivante.", xpBonus: 1000, category: "level" },
];

export const ACHIEVEMENT_MAP = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a]),
) as Record<string, AchievementDef>;

export const ACHIEVEMENT_CATEGORIES = [
  ...new Set(ACHIEVEMENTS.map((a) => a.category)),
] as AchievementCategory[];

import type { AppMode } from "./modeStore";

type Vocab = {
  // Tabs
  tabHome: string;
  tabJournal: string;
  tabCompanion: string;
  tabProgress: string;
  tabProfile: string;

  // Home
  homeGreetingSuffix: string;
  homeSubtitle: string;
  homeCrisisSubtitle: string;
  homeQuickLog: string;
  homeMissions: string;

  // Journal
  journalTitle: string;
  journalSubtitle: string;
  journalHabitsTitle: string;
  journalNewHabit: string;
  journalEmptyHabits: string;
  journalEmptyHabitsSub: string;

  // Tracking
  logSleep: string;
  logMood: string;
  logCrisis: string;
  logHabit: string;

  // Progress
  progressTitle: string;
  progressSubtitle: string;
  streak: string;
  streakUnit: string;
  streakRecord: string;

  // XP
  xpLabel: string;
  levelLabel: string;

  // Achievements
  achievementsTitle: string;

  // Profile
  companionSection: string;
  changeCompanion: string;

  // General
  complete: string;
  done: string;
};

const WARRIOR: Vocab = {
  tabHome: "QG",
  tabJournal: "Rapport",
  tabCompanion: "Allié",
  tabProgress: "War Room",
  tabProfile: "Profil",

  homeGreetingSuffix: "Prêt pour le combat ?",
  homeSubtitle: "Prêt pour le combat ?",
  homeCrisisSubtitle: "Semaine difficile. Tu n'es pas seul.",
  homeQuickLog: "Rapport rapide",
  homeMissions: "Missions du jour",

  journalTitle: "Rapport de Combat",
  journalSubtitle: "Que s'est-il passé aujourd'hui ?",
  journalHabitsTitle: "Habitudes du jour",
  journalNewHabit: "+ Nouvelle habitude",
  journalEmptyHabits: "Aucune habitude encore",
  journalEmptyHabitsSub: "Crée ta première mission quotidienne",

  logSleep: "Sommeil",
  logMood: "Humeur",
  logCrisis: "Crise",
  logHabit: "Mission",

  progressTitle: "War Room",
  progressSubtitle: "Ton tableau de commandement",
  streak: "Séquence de victoires",
  streakUnit: "jours consécutifs",
  streakRecord: "Record",

  xpLabel: "XP",
  levelLabel: "Niveau",

  achievementsTitle: "Achievements",

  companionSection: "Ton Compagnon",
  changeCompanion: "Changer de compagnon",

  complete: "Faire",
  done: "✓",
};

const ZEN: Vocab = {
  tabHome: "Accueil",
  tabJournal: "Journal",
  tabCompanion: "Guide",
  tabProgress: "Bilan",
  tabProfile: "Profil",

  homeGreetingSuffix: "Comment te sens-tu ?",
  homeSubtitle: "Comment te sens-tu ?",
  homeCrisisSubtitle: "Semaine éprouvante. Sois doux avec toi-même.",
  homeQuickLog: "Journal du jour",
  homeMissions: "Rituels du jour",

  journalTitle: "Mon Journal",
  journalSubtitle: "Comment s'est passée ta journée ?",
  journalHabitsTitle: "Rituels du jour",
  journalNewHabit: "+ Nouveau rituel",
  journalEmptyHabits: "Aucun rituel encore",
  journalEmptyHabitsSub: "Crée ton premier rituel quotidien",

  logSleep: "Sommeil",
  logMood: "Ressenti",
  logCrisis: "Moment difficile",
  logHabit: "Rituel",

  progressTitle: "Mon Bilan",
  progressSubtitle: "Ton espace de recul",
  streak: "Jours de pratique",
  streakUnit: "jours de suite",
  streakRecord: "Record",

  xpLabel: "Points",
  levelLabel: "Niveau",

  achievementsTitle: "Accomplissements",

  companionSection: "Ton Guide",
  changeCompanion: "Changer de guide",

  complete: "Fait",
  done: "✓",
};

export function getVocab(mode: AppMode): Vocab {
  return mode === "warrior" ? WARRIOR : ZEN;
}

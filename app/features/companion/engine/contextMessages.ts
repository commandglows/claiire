/**
 * Generates contextual companion messages based on user data.
 * Pure function — no side effects. Used by companion tab to provide
 * relevant responses instead of generic encouragements.
 */

type CompanionContext = {
  level: number;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  todayLogCount: number;
  todayHabitsDone: number;
  totalActiveHabits: number;
  hasLoggedToday: boolean;
  recentCrisis: { hoursAgo: number; intensity: number } | null;
  activePatterns: { type: string; confidence: number }[];
  hour: number;
};

type ContextualMessage = {
  id: string;
  label: string;
  emoji: string;
  generate: (ctx: CompanionContext, name: string) => string;
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const CONTEXTUAL_PROMPTS: ContextualMessage[] = [
  {
    id: "how_am_i",
    label: "Comment je vais ?",
    emoji: "📊",
    generate: (ctx, name) => {
      const parts: string[] = [];

      if (ctx.currentStreak >= 7) {
        parts.push(`${ctx.currentStreak} jours de série ! Tu es en pleine forme.`);
      } else if (ctx.currentStreak >= 3) {
        parts.push(`${ctx.currentStreak} jours d'affilée, la dynamique est bonne.`);
      } else if (ctx.currentStreak === 0) {
        parts.push("Pas de série active pour l'instant. Aujourd'hui est le bon jour pour commencer.");
      }

      if (ctx.recentCrisis && ctx.recentCrisis.hoursAgo < 24) {
        parts.push(`Tu as traversé un moment difficile il y a ${ctx.recentCrisis.hoursAgo}h. Comment tu te sens maintenant ?`);
      }

      const dangerPattern = ctx.activePatterns.find(
        (p) => p.type === "crisis_alert" && p.confidence >= 0.85,
      );
      if (dangerPattern) {
        parts.push("Mes capteurs détectent une période délicate. Reste vigilant, je suis là.");
      }

      const improving = ctx.activePatterns.find((p) => p.type === "mood_improving");
      if (improving) {
        parts.push("Ta tendance est positive cette semaine. Continue comme ça !");
      }

      if (parts.length === 0) {
        parts.push(`Niveau ${ctx.level}, ${ctx.totalXP} XP. Tu avances bien, ${name}.`);
      }

      return parts.join(" ");
    },
  },
  {
    id: "today_plan",
    label: "Mon plan du jour",
    emoji: "📋",
    generate: (ctx, name) => {
      const parts: string[] = [];

      if (!ctx.hasLoggedToday) {
        if (ctx.hour < 12) {
          parts.push(`Bonjour ${name} ! On n'a encore rien loggé aujourd'hui.`);
        } else {
          parts.push(`Il n'est pas trop tard pour logger quelque chose.`);
        }
      }

      if (ctx.totalActiveHabits > 0) {
        const remaining = ctx.totalActiveHabits - ctx.todayHabitsDone;
        if (remaining > 0) {
          parts.push(`Il te reste ${remaining} mission${remaining > 1 ? "s" : ""} à compléter.`);
        } else {
          parts.push("Toutes tes missions sont faites ! Combo du jour en poche.");
        }
      } else {
        parts.push("Tu n'as pas encore de missions. Crée-en une depuis le Journal !");
      }

      if (ctx.currentStreak > 0) {
        parts.push(`Ta série de ${ctx.currentStreak}j est en jeu. Ne la perds pas !`);
      }

      return parts.join(" ");
    },
  },
  {
    id: "encouragement",
    label: "Encourage-moi",
    emoji: "💪",
    generate: (ctx, name) => {
      if (ctx.recentCrisis && ctx.recentCrisis.hoursAgo < 48) {
        return pick([
          `${name}, tu as survécu à un moment difficile. Ça prouve ta force.`,
          "Chaque crise que tu traverses te rend plus résilient. Je suis fier de toi.",
          "La douleur est temporaire. Ce que tu construis est permanent.",
        ]);
      }

      if (ctx.currentStreak >= 7) {
        return pick([
          `${ctx.currentStreak} jours ! Tu es une machine, ${name}.`,
          "Ta constance est impressionnante. Tes ennemis n'ont aucune chance.",
          `Niveau ${ctx.level} avec ${ctx.currentStreak}j de série. Tu es inarrêtable.`,
        ]);
      }

      if (ctx.todayHabitsDone > 0 && ctx.todayHabitsDone >= ctx.totalActiveHabits) {
        return pick([
          "Toutes les missions du jour sont faites ! Tu es incroyable.",
          "100% aujourd'hui. C'est comme ça qu'on gagne des guerres.",
        ]);
      }

      return pick([
        `Chaque jour où tu te bats, tu gagnes, ${name}.`,
        "Le fait que tu sois ici prouve que tu n'as pas abandonné.",
        "Une action à la fois. Tu y arrives.",
        "Je crois en toi, même quand toi tu n'y crois pas.",
      ]);
    },
  },
  {
    id: "crisis_check",
    label: "Moment difficile",
    emoji: "🫂",
    generate: (_ctx, name) => {
      return pick([
        `Je suis là, ${name}. Respire. Dis-moi ce qui se passe.`,
        "Tu n'es pas seul. On va traverser ça ensemble. Prends ton temps.",
        `${name}, c'est courageux de me parler. Qu'est-ce qui se passe ?`,
        "Respire profondément. 4 secondes inspirer, 4 secondes expirer. Je suis là.",
      ]);
    },
  },
  {
    id: "stats",
    label: "Mes stats",
    emoji: "🏆",
    generate: (ctx, name) => {
      const parts = [
        `${name}, voici ton bilan :`,
        `Niveau ${ctx.level} · ${ctx.totalXP} XP total`,
      ];

      if (ctx.currentStreak > 0) {
        parts.push(`Série actuelle : ${ctx.currentStreak}j (record : ${ctx.longestStreak}j)`);
      }

      parts.push(`${ctx.todayLogCount} log${ctx.todayLogCount !== 1 ? "s" : ""} aujourd'hui`);

      if (ctx.todayHabitsDone > 0) {
        parts.push(`${ctx.todayHabitsDone}/${ctx.totalActiveHabits} missions faites`);
      }

      return parts.join("\n");
    },
  },
];

/**
 * Get the contextual greeting based on time of day and user state.
 */
export function getContextualGreeting(
  ctx: CompanionContext,
  companionName: string,
  userName: string,
): string {
  const { hour } = ctx;

  let timeGreeting: string;
  if (hour < 6) timeGreeting = "Bonne nuit";
  else if (hour < 12) timeGreeting = "Bonjour";
  else if (hour < 18) timeGreeting = "Bon après-midi";
  else timeGreeting = "Bonsoir";

  const parts = [`${timeGreeting}, ${userName}. C'est ${companionName}.`];

  if (ctx.recentCrisis && ctx.recentCrisis.hoursAgo < 24) {
    parts.push("Comment tu te sens depuis tout à l'heure ? Je pense à toi.");
  } else if (ctx.currentStreak >= 7) {
    parts.push(`${ctx.currentStreak} jours de suite ! On continue ?`);
  } else if (!ctx.hasLoggedToday && hour >= 10) {
    parts.push("Tu n'as encore rien loggé aujourd'hui. On s'y met ?");
  } else if (ctx.todayHabitsDone >= ctx.totalActiveHabits && ctx.totalActiveHabits > 0) {
    parts.push("Toutes les missions sont faites. Belle journée !");
  } else {
    parts.push(pick([
      "Qu'est-ce que tu veux travailler aujourd'hui ?",
      "Je suis là si tu as besoin.",
      "Comment je peux t'aider ?",
    ]));
  }

  return parts.join(" ");
}

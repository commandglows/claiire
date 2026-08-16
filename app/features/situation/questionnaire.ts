import type { QuestionOption, SituationAnswer, SituationChange, SituationDimension, SituationQuestion } from "./types";

export const CRITICAL_S3_VALUES = new Set([
  "death-threat",
  "strangulation",
  "weapon",
  "sexual",
  "locked",
  "stalking",
  "dependent-threat",
  "injury",
]);

const scoreOptions = (labels: string[]): QuestionOption[] => labels.map((label, score) => ({ value: String(score), label }));

export const SITUATION_QUESTIONS: SituationQuestion[] = [
  {
    id: "A1",
    phase: "Confidentialité",
    prompt: "Peux-tu répondre tranquillement, sans que cette personne voie ton écran ou tes réponses ?",
    options: [
      { value: "yes", label: "Oui" },
      { value: "unsure", label: "Je ne suis pas sûre" },
      { value: "no", label: "Non" },
    ],
  },
  {
    id: "A2",
    phase: "Confidentialité",
    prompt: "Comment veux-tu utiliser tes réponses aujourd'hui ?",
    helper: "Tu pourras les effacer à tout moment.",
    options: [
      { value: "device", label: "Les conserver sur cet appareil" },
      { value: "session", label: "Seulement pendant cette session" },
      { value: "unknown", label: "Je ne sais pas encore" },
    ],
  },
  {
    id: "A3",
    phase: "Contexte",
    prompt: "Quelle relation veux-tu regarder aujourd'hui ?",
    options: [
      { value: "partner", label: "Partenaire actuel" },
      { value: "ex", label: "Ex-partenaire" },
      { value: "parent", label: "Parent" },
      { value: "adult-child", label: "Enfant adulte" },
      { value: "sibling", label: "Frère ou sœur" },
      { value: "dependency", label: "Relation d'aide ou de dépendance" },
      { value: "other", label: "Autre proche" },
    ],
  },
  {
    id: "A5",
    phase: "Contexte",
    prompt: "Les faits qui te préoccupent sont-ils encore en cours ?",
    options: [
      { value: "current", label: "Oui, actuellement" },
      { value: "recent", label: "Récemment" },
      { value: "past", label: "Plus anciens, mais ils m'affectent encore" },
      { value: "unknown", label: "Je ne sais pas" },
    ],
  },
  {
    id: "S1",
    phase: "Sécurité actuelle",
    prompt: "Te sens-tu en danger maintenant, ou dans les prochaines heures ?",
    helper: "Tu peux arrêter à tout moment.",
    options: [
      { value: "no", label: "Non" },
      { value: "unknown", label: "Je ne sais pas" },
      { value: "maybe", label: "Peut-être" },
      { value: "yes", label: "Oui" },
    ],
  },
  {
    id: "S2",
    phase: "Sécurité actuelle",
    prompt: "Ces dernières semaines, la situation est-elle devenue plus fréquente, plus intense ou plus imprévisible ?",
    options: [
      { value: "no", label: "Non" },
      { value: "little", label: "Un peu" },
      { value: "clearly", label: "Nettement" },
      { value: "unknown", label: "Je ne sais pas" },
    ],
  },
  {
    id: "S3",
    phase: "Sécurité actuelle",
    prompt: "Est-ce qu'une de ces choses s'est produite récemment ?",
    helper: "Choisis tout ce qui correspond. Ces réponses ne sont jamais partagées.",
    multiple: true,
    exclusiveValues: ["none", "skip"],
    options: [
      { value: "death-threat", label: "Menace de mort" },
      { value: "strangulation", label: "Étranglement ou pression sur le cou" },
      { value: "weapon", label: "Arme montrée ou utilisée" },
      { value: "sexual", label: "Acte sexuel imposé" },
      { value: "locked", label: "Enfermement ou empêchement de sortir" },
      { value: "stalking", label: "Poursuite ou traque" },
      { value: "dependent-threat", label: "Menace envers un enfant ou une personne dépendante" },
      { value: "injury", label: "Violence physique avec blessure" },
      { value: "none", label: "Aucune de ces situations" },
      { value: "skip", label: "Je préfère ne pas répondre" },
    ],
  },
  {
    id: "F3",
    phase: "Liberté et contrôle",
    prompt: "Modifies-tu ce que tu dis, fais, portes, dépenses ou les personnes que tu rencontres par peur de sa réaction ?",
    options: scoreOptions(["Non", "Rarement", "Parfois", "Souvent", "Presque toujours"]),
  },
  {
    id: "C1",
    phase: "Dépendances et contraintes",
    prompt: "Des enfants ou d'autres personnes dépendent-ils de toi dans cette situation ?",
    options: [
      { value: "0", label: "Non" },
      { value: "1", label: "Oui, sans exposition apparente" },
      { value: "2", label: "Ils entendent ou voient certaines situations" },
      { value: "4", label: "Ils sont visés, utilisés pour menacer ou en danger" },
      { value: "unknown", label: "Je ne sais pas" },
    ],
  },
  {
    id: "C3",
    phase: "Dépendances et contraintes",
    prompt: "Avec tes contraintes actuelles, quelle marge de choix te semble disponible ?",
    options: [
      { value: "0", label: "Plusieurs options réalistes" },
      { value: "2", label: "Quelques options avec de l'aide" },
      { value: "3", label: "Très peu d'options" },
      { value: "4", label: "Aucune option visible pour l'instant" },
      { value: "unknown", label: "Je ne sais pas" },
    ],
  },
  {
    id: "C4",
    phase: "Soutien disponible",
    prompt: "Y a-t-il au moins une personne avec qui tu pourrais parler sans être jugée, contrôlée ou mise en danger ?",
    options: [
      { value: "4", label: "Oui, et je lui fais confiance" },
      { value: "2", label: "Peut-être" },
      { value: "0", label: "Non" },
      { value: "unsafe", label: "Cette personne pourrait aggraver la situation" },
      { value: "unknown", label: "Je ne sais pas" },
    ],
  },
  {
    id: "C5",
    phase: "Soutien disponible",
    prompt: "Es-tu déjà accompagnée par une personne professionnelle ou une association pour cette situation ?",
    options: [
      { value: "4", label: "Oui, régulièrement" },
      { value: "3", label: "Oui, ponctuellement" },
      { value: "2", label: "Pas encore, mais je pourrais" },
      { value: "0", label: "Non, et je ne sais pas vers qui me tourner" },
      { value: "unknown", label: "Je préfère ne pas répondre" },
    ],
  },
  {
    id: "I2",
    phase: "Impact actuel",
    prompt: "À quel point cette situation rend-elle ton quotidien difficile aujourd'hui ?",
    options: scoreOptions(["Pas ou peu", "Parfois difficile", "Souvent difficile", "Très difficile", "Je n'arrive presque plus à fonctionner"]),
  },
  {
    id: "I3",
    phase: "Aide de santé souhaitée",
    prompt: "Souhaites-tu une aide médicale ou psychologique rapidement, même si tu ne sais pas encore quoi faire pour la relation ?",
    helper: "C'est ta préférence aujourd'hui, pas une évaluation médicale.",
    options: [
      { value: "no", label: "Non" },
      { value: "maybe", label: "Peut-être" },
      { value: "yes", label: "Oui" },
      { value: "without-waiting", label: "Oui, sans attendre" },
      { value: "unknown", label: "Je ne sais pas" },
    ],
  },
  {
    id: "P1",
    phase: "Ce que tu comprends",
    prompt: "Aujourd'hui, comment comprends-tu ce qui se passe ?",
    options: scoreOptions(["Je ne vois pas de problème particulier", "Quelque chose me gêne, mais je doute beaucoup", "Je commence à relier certains faits", "Je pense que certains comportements me font du mal", "Je peux clairement nommer ce que je subis"]),
  },
  {
    id: "P2",
    phase: "Ce que tu souhaites",
    prompt: "Quelle place a pour toi l'idée de préserver cette relation ?",
    options: scoreOptions(["Je ne souhaite pas la préserver", "Je pense plutôt m'en éloigner", "Je suis très partagée", "J'aimerais la préserver si des changements réels sont possibles", "Je veux clairement essayer de la préserver"]),
  },
  {
    id: "P3",
    phase: "Ce que tu peux envisager",
    prompt: "Quelle action te paraît envisageable maintenant pour te protéger ou retrouver un peu de liberté ?",
    options: scoreOptions(["Aucune pour l'instant", "Observer et mieux comprendre", "Parler à une personne fiable", "Préparer une petite action", "J'ai déjà commencé des changements"]),
  },
  {
    id: "P4",
    phase: "Ce que tu peux envisager",
    prompt: "Quand tu penses aux prochains jours, combien de choix te semblent réellement possibles ?",
    options: scoreOptions(["Aucun", "Un choix très limité", "Quelques choix avec de l'aide", "Plusieurs choix", "Je me sens capable de décider et d'agir"]),
  },
  {
    id: "P5",
    phase: "Ce qui compte maintenant",
    prompt: "Qu'aimerais-tu obtenir en priorité ?",
    multiple: true,
    exclusiveValues: ["unknown"],
    options: [
      { value: "understand", label: "Mieux comprendre" },
      { value: "reduce-risk-stay", label: "Réduire les risques sans partir" },
      { value: "regain-autonomy", label: "Retrouver de l'autonomie" },
      { value: "communicate-if-safe", label: "Mieux communiquer, seulement si c'est sans danger" },
      { value: "protect-dependant", label: "Protéger un enfant ou une personne dépendante" },
      { value: "prepare-distance", label: "Préparer une prise de distance" },
      { value: "prepare-separation", label: "Préparer une séparation" },
      { value: "after-separation", label: "Faire face à l'après-séparation" },
      { value: "find-human-help", label: "Trouver une aide humaine" },
      { value: "unknown", label: "Je ne sais pas encore" },
    ],
  },
  {
    id: "P6",
    phase: "Un prochain pas",
    prompt: "Quel serait aujourd'hui un prochain pas assez petit et assez sûr pour toi ?",
    options: [
      { value: "none-now", label: "Aucun maintenant" },
      { value: "observe-understand", label: "Observer et mieux comprendre" },
      { value: "open-help-options", label: "Voir les options d'aide" },
      { value: "talk-trusted-person", label: "Parler à une personne fiable" },
      { value: "prepare-small-safety-step", label: "Préparer une petite action de sécurité" },
      { value: "seek-health-help", label: "Chercher une aide de santé" },
      { value: "seek-rights-info", label: "Chercher des informations sur mes droits" },
      { value: "seek-practical-help", label: "Chercher une aide pratique" },
      { value: "prepare-distance", label: "Préparer une prise de distance" },
      { value: "prepare-separation", label: "Préparer une séparation" },
      { value: "unknown", label: "Je ne sais pas encore" },
    ],
  },
  {
    id: "N1",
    phase: "Types d'aide",
    prompt: "Quels types d'aide aimerais-tu voir dans tes options ?",
    multiple: true,
    exclusiveValues: ["none-now", "unknown"],
    options: [
      { value: "violence-specialist", label: "Une aide spécialisée dans les violences" },
      { value: "health-psychological", label: "Une aide médicale ou psychologique" },
      { value: "legal-rights", label: "Des informations juridiques ou sur mes droits" },
      { value: "social-practical", label: "Une aide sociale ou pratique" },
      { value: "dependant-support", label: "Un soutien pour un enfant ou une personne dépendante" },
      { value: "trusted-person", label: "Parler à une personne fiable" },
      { value: "self-understanding", label: "Des repères pour mieux comprendre" },
      { value: "none-now", label: "Aucune maintenant" },
      { value: "unknown", label: "Je ne sais pas encore" },
    ],
  },
  {
    id: "N2",
    phase: "Langue",
    prompt: "As-tu une préférence de langue pour une aide humaine ?",
    multiple: true,
    exclusiveValues: ["no-preference", "unknown"],
    options: [
      { value: "french", label: "Français" },
      { value: "another-language", label: "Une autre langue" },
      { value: "interpreter-help", label: "Une aide avec interprétariat" },
      { value: "no-preference", label: "Pas de préférence" },
      { value: "unknown", label: "Je ne sais pas" },
    ],
  },
  {
    id: "N3",
    phase: "Accessibilité",
    prompt: "Qu'est-ce qui pourrait rendre l'aide plus accessible pour toi ?",
    multiple: true,
    exclusiveValues: ["none", "skip"],
    options: [
      { value: "easy-read", label: "Des explications faciles à lire" },
      { value: "screen-reader", label: "Une compatibilité lecteur d'écran" },
      { value: "hearing", label: "Une adaptation auditive" },
      { value: "vision", label: "Une adaptation visuelle" },
      { value: "mobility", label: "Une accessibilité physique" },
      { value: "attention-memory", label: "De l'aide pour l'attention ou la mémoire" },
      { value: "communication", label: "Une adaptation de communication" },
      { value: "none", label: "Aucun besoin particulier" },
      { value: "skip", label: "Je préfère ne pas répondre" },
    ],
  },
  {
    id: "N4",
    phase: "Territoire",
    prompt: "Dans quelle zone large cherches-tu des options ?",
    helper: "Claiire ne demande ni adresse ni position précise.",
    options: [
      { value: "metropolitan-france", label: "France métropolitaine" },
      { value: "overseas-france", label: "France d'outre-mer" },
      { value: "europe-outside-france", label: "Europe hors France" },
      { value: "outside-europe", label: "Hors Europe" },
      { value: "remote-only", label: "À distance uniquement" },
      { value: "unknown", label: "Je ne sais pas" },
    ],
  },
  {
    id: "N5",
    phase: "Coût",
    prompt: "Quelle contrainte de coût veux-tu prendre en compte ?",
    options: [
      { value: "free-only", label: "Gratuit uniquement" },
      { value: "capped", label: "Budget limité" },
      { value: "flexible", label: "Flexible" },
      { value: "unknown", label: "Je ne sais pas" },
    ],
  },
  {
    id: "N6",
    phase: "Disponibilité",
    prompt: "Quand aimerais-tu pouvoir accéder à une aide ?",
    helper: "C'est une préférence de disponibilité, pas une évaluation de l'urgence.",
    options: [
      { value: "without-waiting", label: "Sans attendre" },
      { value: "within-days", label: "Dans les prochains jours" },
      { value: "flexible", label: "Je suis flexible" },
      { value: "unknown", label: "Je ne sais pas" },
    ],
  },
  {
    id: "N7",
    phase: "Format",
    prompt: "Quels formats te conviendraient le mieux ?",
    multiple: true,
    exclusiveValues: ["no-preference", "unknown"],
    options: [
      { value: "phone", label: "Téléphone" },
      { value: "text-chat", label: "Messages ou chat" },
      { value: "video", label: "Visio" },
      { value: "in-person", label: "En personne" },
      { value: "written-information", label: "Informations écrites" },
      { value: "no-preference", label: "Pas de préférence" },
      { value: "unknown", label: "Je ne sais pas" },
    ],
  },
  {
    id: "N8",
    phase: "Discrétion",
    prompt: "Si tu demandais une aide plus tard, quelles options te sembleraient les plus discrètes ?",
    helper: "Claiire ne te demande aucune coordonnée et ne contactera personne.",
    multiple: true,
    exclusiveValues: ["no-safe-channel", "unknown"],
    options: [
      { value: "in-app-only", label: "Dans l'app uniquement" },
      { value: "phone-call", label: "Appel téléphonique" },
      { value: "text-message", label: "Message texte" },
      { value: "email", label: "E-mail" },
      { value: "morning", label: "Le matin" },
      { value: "afternoon", label: "L'après-midi" },
      { value: "evening", label: "Le soir" },
      { value: "no-safe-channel", label: "Aucun canal ne me paraît sûr" },
      { value: "unknown", label: "Je ne sais pas" },
    ],
  },
];

export const UPDATE_CHANGE_OPTIONS: QuestionOption[] = [
  { value: "event", label: "Un nouvel événement s'est produit" },
  { value: "worsened", label: "La situation s'est aggravée" },
  { value: "calmer", label: "La situation semble plus calme" },
  { value: "relationship", label: "Ma relation ou ma cohabitation a changé" },
  { value: "constraints", label: "Mes contraintes ont changé" },
  { value: "support", label: "J'ai trouvé ou perdu un soutien" },
  { value: "understanding", label: "Ma façon de comprendre la situation a changé" },
  { value: "intention", label: "Ce que je veux ou peux faire a changé" },
  { value: "review-all", label: "Je veux revoir toutes mes réponses" },
];

const BRANCH_QUESTION_IDS = new Set(["N2", "N3", "N4", "N5", "N6", "N7", "N8"]);
const INITIAL_ALWAYS_IDS = SITUATION_QUESTIONS.filter((question) => !BRANCH_QUESTION_IDS.has(question.id)).map((question) => question.id);
const HUMAN_SUPPORT_VALUES = new Set(["violence-specialist", "health-psychological", "legal-rights", "social-practical", "dependant-support", "trusted-person", "self-understanding"]);

export function shouldAskSupportPreferences(answers: Record<string, SituationAnswer>): boolean {
  const n1 = Array.isArray(answers.N1) ? answers.N1 : [];
  const p5 = Array.isArray(answers.P5) ? answers.P5 : [];
  return n1.some((value) => HUMAN_SUPPORT_VALUES.has(value))
    || p5.includes("find-human-help")
    || answers.I3 === "maybe"
    || answers.I3 === "yes"
    || answers.I3 === "without-waiting";
}

export function getInitialQuestionIds(answers: Record<string, SituationAnswer> = {}): string[] {
  return shouldAskSupportPreferences(answers)
    ? SITUATION_QUESTIONS.map((question) => question.id)
    : INITIAL_ALWAYS_IDS;
}

const UPDATE_ROUTES: Record<Exclude<SituationChange, "review-all">, string[]> = {
  event: ["S1", "S2", "S3", "F3", "C1", "I2", "I3"],
  worsened: ["S1", "S2", "S3", "F3", "C1", "I2", "I3"],
  calmer: ["S1", "S2", "S3", "F3", "I2"],
  relationship: ["A3", "A5", "S1", "S2", "S3", "C1", "C3", "P2"],
  constraints: ["C1", "C3", "P3", "P4", "P5", "P6", "N3", "N4", "N5", "N6", "N7"],
  support: ["C4", "C5", "I3", "P3", "P4", "P5", "N1", "N2", "N3", "N4", "N5", "N6", "N7", "N8"],
  understanding: ["F3", "I2", "P1", "P3", "P5", "P6", "N1"],
  intention: ["I3", "P2", "P3", "P4", "P5", "P6", "N1", "N2", "N3", "N4", "N5", "N6", "N7", "N8"],
};

export function getUpdateQuestionIds(changes: SituationChange[], answers: Record<string, SituationAnswer> = {}): string[] {
  if (changes.includes("review-all")) return getInitialQuestionIds(answers);
  const requested = new Set(changes.flatMap((change) => UPDATE_ROUTES[change as Exclude<SituationChange, "review-all">]));
  return ["A1", ...SITUATION_QUESTIONS.filter((question) => question.id !== "A1" && requested.has(question.id)).map((question) => question.id)];
}

export function normalizeMultipleAnswer(questionId: string, current: string[], value: string): string[] {
  const question = getSituationQuestion(questionId);
  if (!question?.multiple || !question.options.some((option) => option.value === value)) return current;
  const exclusive = new Set(question.exclusiveValues ?? []);
  if (exclusive.has(value)) return [value];
  const selectable = current.filter((item) => !exclusive.has(item));
  return selectable.includes(value) ? selectable.filter((item) => item !== value) : [...selectable, value];
}

export function getSituationQuestion(id: string): SituationQuestion | undefined {
  return SITUATION_QUESTIONS.find((question) => question.id === id);
}

export const DIMENSION_LABELS: Record<SituationDimension, string> = {
  SAF: "Sécurité actuelle",
  CTL: "Contrôle et liberté",
  REC: "Compréhension de la situation",
  REL: "Envie de préserver la relation",
  CHG: "Action protectrice envisageable",
  CON: "Contraintes",
  SUP: "Soutien disponible",
  AGY: "Pouvoir d'agir ressenti",
  DIG: "Confidentialité numérique",
  DEP: "Personnes dépendantes",
  IMP: "Impact sur le quotidien",
};

export const DIMENSION_ORDER = Object.keys(DIMENSION_LABELS) as SituationDimension[];

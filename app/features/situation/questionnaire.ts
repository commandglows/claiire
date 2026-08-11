import type { QuestionOption, SituationChange, SituationDimension, SituationQuestion } from "./types";

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
    options: ["Non", "Rarement", "Parfois", "Souvent", "Presque toujours"].map((label, score) => ({ value: String(score), label })),
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
    options: [
      "Pas ou peu",
      "Parfois difficile",
      "Souvent difficile",
      "Très difficile",
      "Je n'arrive presque plus à fonctionner",
    ].map((label, score) => ({ value: String(score), label })),
  },
  {
    id: "P1",
    phase: "Ce que tu comprends",
    prompt: "Aujourd'hui, comment comprends-tu ce qui se passe ?",
    options: [
      "Je ne vois pas de problème particulier",
      "Quelque chose me gêne, mais je doute beaucoup",
      "Je commence à relier certains faits",
      "Je pense que certains comportements me font du mal",
      "Je peux clairement nommer ce que je subis",
    ].map((label, score) => ({ value: String(score), label })),
  },
  {
    id: "P2",
    phase: "Ce que tu souhaites",
    prompt: "Quelle place a pour toi l'idée de préserver cette relation ?",
    options: [
      "Je ne souhaite pas la préserver",
      "Je pense plutôt m'en éloigner",
      "Je suis très partagée",
      "J'aimerais la préserver si des changements réels sont possibles",
      "Je veux clairement essayer de la préserver",
    ].map((label, score) => ({ value: String(score), label })),
  },
  {
    id: "P3",
    phase: "Ce que tu peux envisager",
    prompt: "Quelle action te paraît envisageable maintenant pour te protéger ou retrouver un peu de liberté ?",
    options: [
      "Aucune pour l'instant",
      "Observer et mieux comprendre",
      "Parler à une personne fiable",
      "Préparer une petite action",
      "J'ai déjà commencé des changements",
    ].map((label, score) => ({ value: String(score), label })),
  },
  {
    id: "P4",
    phase: "Ce que tu peux envisager",
    prompt: "Quand tu penses aux prochains jours, combien de choix te semblent réellement possibles ?",
    options: [
      "Aucun",
      "Un choix très limité",
      "Quelques choix avec de l'aide",
      "Plusieurs choix",
      "Je me sens capable de décider et d'agir",
    ].map((label, score) => ({ value: String(score), label })),
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

const UPDATE_ROUTES: Record<SituationChange, string[]> = {
  event: ["S1", "S2", "S3", "F3", "C1", "I2"],
  worsened: ["S1", "S2", "S3", "F3", "C1", "I2"],
  calmer: ["S1", "S2", "S3", "F3", "I2"],
  relationship: ["A3", "A5", "S1", "S2", "S3", "C1", "C3", "P2"],
  constraints: ["C1", "C3", "P3", "P4"],
  support: ["C4", "C5", "P3", "P4"],
  understanding: ["F3", "I2", "P1", "P3"],
  intention: ["P2", "P3", "P4"],
  "review-all": SITUATION_QUESTIONS.filter((question) => question.id !== "A1").map((question) => question.id),
};

export function getUpdateQuestionIds(changes: SituationChange[]): string[] {
  const requested = new Set(changes.flatMap((change) => UPDATE_ROUTES[change]));
  return ["A1", ...SITUATION_QUESTIONS.filter((question) => question.id !== "A1" && requested.has(question.id)).map((question) => question.id)];
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

export const parcours = [
  {
    id: 'bonheur',
    title: 'Être plus heureux',
    icon: '😊',
    description:
      'Découvre les clés scientifiques du bonheur et apprends à cultiver le bien-être au quotidien',
    color: 'var(--site-parcours-bonheur)',
    modules: [
      { title: 'Les hormones du bonheur', link: '/bonheur/les-hormones-du-bonheur' },
      { title: 'Cultiver la gratitude', link: '/psy/emotions/gratitude' },
      { title: 'Le moment présent', link: '/bonheur/choyer-le-moment-present' },
      { title: 'Équilibre mental', link: '/psy/equilibre/equilibre-mental' },
      { title: 'Cultiver le bonheur', link: '/bonheur/cultiver-le-bonheur' },
      { title: 'Bonheur durable', link: '/bonheur/bonheur-durable' },
    ],
  },
  {
    id: 'stress',
    title: "Gérer le stress et l'anxiété",
    icon: '😰',
    description: 'Apprends à maîtriser ton stress et retrouver ton calme intérieur',
    color: 'var(--site-parcours-stress)',
    modules: [
      { title: 'Comprendre le stress', link: '/stress/' },
      { title: 'Le bon et le mauvais stress', link: '/stress/bon-et-mauvais' },
      { title: 'Solutions naturelles', link: '/stress/solutions-naturelles' },
      { title: 'Cohérence cardiaque', link: '/systeme-immunitaire/coherence-cardiaque' },
      { title: 'Nerf vague', link: '/systeme-nerveux/nerf-vague' },
      { title: 'Respiration et relaxation', link: '/psy/solution/relaxation' },
    ],
  },
  {
    id: 'sommeil',
    title: 'Améliorer ton sommeil',
    icon: '😴',
    description: 'Restaure un sommeil réparateur pour une vie plus énergique',
    color: 'var(--site-parcours-sommeil)',
    modules: [
      { title: 'Comprendre le sommeil', link: '/sommeil/' },
      { title: 'Les cycles du sommeil', link: '/sommeil/cycles' },
      { title: 'Hygiène du sommeil', link: '/sommeil/hygiene' },
      { title: 'Dette de sommeil', link: '/sommeil/dette' },
      { title: 'Nutrition et sommeil', link: '/systeme-digestif/nutrition/sommeil-nutriments' },
      { title: 'Lumière et mélatonine', link: '/systeme-hormonal/melatonine' },
    ],
  },
  {
    id: 'relations',
    title: 'Développer tes relations sociales',
    icon: '👥',
    description: 'Construis des relations authentiques et enrichissantes',
    color: 'var(--site-parcours-relations)',
    modules: [
      { title: 'Liens sociaux et santé', link: '/systeme-social/liens-sociaux' },
      { title: 'Empathie', link: '/psy/emotions/qualite/empathie' },
      { title: 'Communication', link: '/psy/communication/pouvoir-des-mots' },
      { title: 'Codes sociaux', link: '/psy/codes-sociaux/' },
      { title: 'Appartenance', link: '/psy/emotions/appartenance' },
      { title: 'Solitude', link: '/systeme-social/solitude' },
    ],
  },
  {
    id: 'sante',
    title: 'Renforcer ta santé',
    icon: '💪',
    description: 'Optimise ton corps et ton énergie vitale',
    color: 'var(--site-parcours-sante)',
    modules: [
      { title: "Vue d'ensemble santé", link: '/harmonie/' },
      { title: 'Nutrition essentielle', link: '/systeme-digestif/nutrition/' },
      { title: 'Activité physique', link: '/activite/physique/' },
      { title: 'Système immunitaire', link: '/systeme-immunitaire/' },
      { title: 'Métabolisme', link: '/harmonie/metabolisme' },
      { title: 'Inflammation', link: '/systeme-immunitaire/inflammation' },
    ],
  },
  {
    id: 'esprit',
    title: 'Comprendre ton esprit',
    icon: '🧠',
    description:
      'Explore le fonctionnement de ton psychisme et développe ton intelligence émotionnelle',
    color: 'var(--site-parcours-esprit)',
    modules: [
      { title: 'Introduction psychologie', link: '/psy/' },
      { title: 'Émotions', link: '/psy/emotions/' },
      { title: 'Approches cognitives', link: '/psy/approche/cognitive' },
      { title: 'Résilience', link: '/psy/solution/resilience' },
      { title: 'Mindfulness', link: '/psy/solution/mindfulness' },
      { title: 'Biais cognitifs', link: '/psy/biais/' },
    ],
  },
];

export function getParcours(id) {
  const entry = parcours.find((candidate) => candidate.id === id);

  if (!entry) {
    throw new Error(`Unknown parcours id: "${id}"`);
  }

  return entry;
}

export function getFirstModuleRoute(entry) {
  return entry.modules[0]?.link;
}

export function getParcoursPageTitle(entry) {
  const title = entry.title.replace(/(^|[\s'])\p{L}/gu, (letter) => letter.toUpperCase());
  return `Parcours : ${title}`;
}

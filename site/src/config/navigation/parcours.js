import { parcours } from '../parcours.js';

/**
 * Parcours Thématiques Sidebar Navigation
 *
 * Defines navigation for guided thematic learning paths.
 * Each parcours is a curated journey through related content
 * with progress tracking and structured learning.
 */
export const parcoursSidebar = {
  label: '🎯 Parcours Thématiques',
  collapsed: false, // Visible by default for discoverability
  items: parcours.map((entry) => ({
    label: `${entry.icon} ${entry.title}`
      .replace("Gérer le stress et l'anxiété", 'Gérer le stress')
      .replace('Améliorer ton sommeil', 'Améliorer le sommeil')
      .replace('Développer tes relations sociales', 'Relations sociales')
      .replace('Renforcer ta santé', 'Renforcer la santé')
      .replace('Comprendre ton esprit', "Comprendre l'esprit"),
    link: `/parcours/${entry.id}`,
  })),
};

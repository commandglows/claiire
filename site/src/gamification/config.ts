import type { Badge, GamificationOptions } from '@diane-winflowz/gamification'

// 10 badges for Claiire, based on parcours and navigation sections
export const claiireBadges: Badge[] = [
  {
    id: 'premiere-consultation',
    name: 'Première Consultation',
    description: 'Tu as lu ta première page !',
    icon: 'footprints',
    condition: (s) => s.totalRead >= 1,
  },
  {
    id: 'explorateur',
    name: 'Explorateur',
    description: '10 pages consultées — tu explores bien !',
    icon: 'search',
    condition: (s) => s.totalRead >= 10,
  },
  {
    id: 'studieux',
    name: 'Studieux',
    description: '25 pages lues, tu es un apprenant assidu.',
    icon: 'book',
    condition: (s) => s.totalRead >= 25,
  },
  {
    id: 'savant',
    name: 'Savant',
    description: '50 pages ! Tu maîtrises le sujet.',
    icon: 'brain',
    condition: (s) => s.totalRead >= 50,
    secret: true,
  },
  {
    id: 'streak-3',
    name: 'Régulier',
    description: '3 jours de suite — belle discipline !',
    icon: 'flame',
    condition: (s) => s.currentStreak >= 3,
  },
  {
    id: 'streak-7',
    name: 'Flamme',
    description: '7 jours consécutifs de lecture.',
    icon: 'flame',
    condition: (s) => s.currentStreak >= 7,
  },
  {
    id: 'expert-psy',
    name: 'Expert Psychologie',
    description: '5 pages de psychologie consultées.',
    icon: 'brain',
    category: 'psychologie',
    condition: (s) => (s.readByCategory['psychologie']?.length ?? 0) >= 5,
  },
  {
    id: 'expert-corps',
    name: 'Expert Corps',
    description: '5 pages sur le corps et la santé.',
    icon: 'activity',
    category: 'corps',
    condition: (s) => (s.readByCategory['corps']?.length ?? 0) >= 5,
  },
  {
    id: 'parcours-complete',
    name: 'Premier Parcours',
    description: 'Tu as lu toutes les pages d\'un parcours.',
    icon: 'trophy',
    category: 'parcours',
    condition: (s) => (s.readByCategory['parcours']?.length ?? 0) >= 6,
  },
  {
    id: 'polyvalent',
    name: 'Polyvalent',
    description: 'Tu as consulté au moins 3 sections différentes.',
    icon: 'sparkles',
    condition: (s) => {
      const cats = Object.values(s.readByCategory).filter((arr) => arr.length > 0)
      return cats.length >= 3
    },
  },
]

// Section mapping from the navigation structure
export const claiireCategories: Record<string, string[]> = {
  parcours: [],
  corps: [],
  psychologie: [],
  violence: [],
}

export function createClaiireConfig(
  overrideCategories?: Record<string, string[]>
): GamificationOptions {
  return {
    badges: claiireBadges,
    categories: overrideCategories ?? claiireCategories,
    storagePrefix: 'gamification_claiire',
    gracePeriodHours: 36,
  }
}

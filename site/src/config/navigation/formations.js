/**
 * Violence support journeys. The two branches stay separate by design.
 * Legacy /formations/socle/* routes are not part of the guided navigation.
 */
export const formationsSidebar = {
  label: 'Parcours relationnels',
  collapsed: true,
  items: [
    { label: 'Trouver mon point de départ', link: '/formations/' },
    {
      label: "Ce que je vis m'inquiète",
      collapsed: true,
      items: [
        { label: 'Introduction', link: '/formations/victimes/' },
        { label: '1 · Retrouver de la sécurité', link: '/formations/victimes/1-securite/' },
        { label: '2 · Comprendre le trauma', link: '/formations/victimes/2-guerison/' },
        { label: '3 · Poser mes limites', link: '/formations/victimes/3-limites/' },
        {
          label: '4 · Retrouver des repères relationnels',
          link: '/formations/victimes/4-relations/',
        },
        { label: '5 · Renforcer mon autonomie', link: '/formations/victimes/5-autonomie/' },
        { label: '6 · Consolider mes appuis', link: '/formations/victimes/6-ancrage/' },
      ],
    },
    {
      label: "Mes comportements m'inquiètent",
      collapsed: true,
      items: [
        { label: 'Introduction', link: '/formations/auteurs/' },
        { label: '1 · Regarder les faits', link: '/formations/auteurs/1-responsabilite/' },
        { label: '2 · Comprendre mon cycle', link: '/formations/auteurs/2-cycle/' },
        { label: '3 · Interrompre la montée', link: '/formations/auteurs/3-emotions/' },
        { label: "4 · Voir l'impact", link: '/formations/auteurs/4-empathie/' },
        { label: '5 · Sortir du contrôle', link: '/formations/auteurs/5-relations/' },
        { label: '6 · Prévenir la répétition', link: '/formations/auteurs/6-prevention/' },
      ],
    },
  ],
};

---
title: Politique de confidentialité
description: Comment Claiire utilise vos données et comment gérer vos préférences d'analytics.
---

## Données collectées

Claiire utilise des outils d'analyse d'audience (PostHog, onthe.io) pour comprendre comment le site est utilisé : pages visitées, durée de visite, provenance. Aucune donnée personnelle identifiable n'est collectée.

## Vos préférences

Vous pouvez désactiver le suivi analytique à tout moment. Ce choix est sauvegardé dans votre navigateur.

<div id="analytics-opt-out-section" style="margin: 2rem 0; padding: 1.5rem; border: 1px solid var(--site-neutral-500); border-radius: 8px;">
  <p id="analytics-status" style="margin: 0 0 1rem;">Chargement...</p>
  <button id="analytics-toggle" style="padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-size: 0.9rem; border: 1px solid currentColor;">
    Chargement...
  </button>
</div>

<script>
  function updateUI() {
    const status = document.getElementById('analytics-status');
    const btn = document.getElementById('analytics-toggle');
    if (!status || !btn) return;

    const optedOut = typeof posthog !== 'undefined' && posthog.has_opted_out_capturing();

    if (optedOut) {
      status.textContent = '🟢 Le suivi analytique est actuellement désactivé.';
      btn.textContent = 'Réactiver les analytics';
      btn.style.color = 'var(--site-success)';
    } else {
      status.textContent = '🔵 Le suivi analytique est actuellement activé.';
      btn.textContent = 'Désactiver les analytics';
      btn.style.color = 'var(--site-text)';
    }
  }

  function toggleAnalytics() {
    if (typeof posthog === 'undefined') return;
    if (posthog.has_opted_out_capturing()) {
      posthog.opt_in_capturing();
    } else {
      posthog.opt_out_capturing();
    }
    updateUI();
  }

  document.getElementById('analytics-toggle').addEventListener('click', toggleAnalytics);
  document.addEventListener('DOMContentLoaded', updateUI);
  // Au cas où PostHog se charge après le DOM
  setTimeout(updateUI, 500);
</script>

## Cookies

Le seul cookie déposé est celui de votre préférence d'opt-out, s'il est activé.

## Contact

Pour toute question : [contact](/contact)

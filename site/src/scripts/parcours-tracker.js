const STORAGE_KEY = 'claiire_parcours_progress';
let fireChecklistConfettiLoader = null;

export function initParcourTracker() {
  const widgets = document.querySelectorAll('.parcour-progress-widget');

  widgets.forEach(widget => {
    const parcourId = widget.dataset.parcourId;
    const checkboxes = widget.querySelectorAll('.module-checkbox');
    const progressBar = widget.querySelector('.progress-fill');
    const progressTrack = widget.querySelector('.progress-bar');
    const progressPercentage = widget.querySelector('.progress-percentage');
    const resetButton = widget.querySelector('.reset-progress');

    // Charger la progression sauvegardée
    loadProgress(parcourId, checkboxes);

    // Mettre à jour l'affichage
    updateProgress(parcourId, checkboxes, progressBar, progressTrack, progressPercentage);

    // Écouter les changements
    checkboxes.forEach((checkbox, index) => {
      syncModuleItemState(checkbox);
      checkbox.addEventListener('change', () => {
        saveProgress(parcourId, index, checkbox.checked);
        updateProgress(parcourId, checkboxes, progressBar, progressTrack, progressPercentage);
        syncModuleItemState(checkbox);
        if (checkbox.checked) {
          fireChecklistConfetti(findChecklistConfettiTarget(checkbox));
        }
      });
    });

    // Bouton reset
    if (resetButton) {
      let awaitingConfirm = false;
      resetButton.addEventListener('click', () => {
        if (!awaitingConfirm) {
          awaitingConfirm = true;
          resetButton.textContent = 'Confirmer la réinitialisation ?';
          resetButton.style.borderColor = 'var(--site-danger)';
          resetButton.style.color = 'var(--site-danger)';
          setTimeout(() => {
            if (awaitingConfirm) {
              awaitingConfirm = false;
              resetButton.textContent = 'Réinitialiser la progression';
              resetButton.style.borderColor = '';
              resetButton.style.color = '';
            }
          }, 3000);
        } else {
          awaitingConfirm = false;
          resetButton.textContent = 'Réinitialiser la progression';
          resetButton.style.borderColor = '';
          resetButton.style.color = '';
          resetProgress(parcourId);
          checkboxes.forEach(cb => {
            cb.checked = false;
            syncModuleItemState(cb);
          });
          updateProgress(parcourId, checkboxes, progressBar, progressTrack, progressPercentage);
        }
      });
    }
  });

  // Mettre à jour les cards sur la page d'accueil
  updateParcourCards();
}

function findChecklistConfettiTarget(checkbox) {
  return checkbox.parentElement?.querySelector('.checkbox-custom') ?? checkbox;
}

function syncModuleItemState(checkbox) {
  const item = checkbox.closest('.module-item');
  if (item) {
    item.dataset.complete = checkbox.checked ? 'true' : 'false';
  }
}

async function fireChecklistConfetti(target) {
  if (typeof window === 'undefined') {
    return;
  }

  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  fireChecklistConfettiLoader ??= import('@diane-winflowz/gamification')
    .then(({ fireBadgeConfetti }) => fireBadgeConfetti)
    .catch(() => null);

  const fireBadgeConfetti = await fireChecklistConfettiLoader;
  if (fireBadgeConfetti) {
    await fireBadgeConfetti(target);
  }
}

function loadProgress(parcourId, checkboxes) {
  const allProgress = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  const parcourProgress = allProgress[parcourId] || [];

  checkboxes.forEach((checkbox, index) => {
    checkbox.checked = parcourProgress.includes(index);
  });
}

function saveProgress(parcourId, moduleIndex, checked) {
  const allProgress = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  let parcourProgress = allProgress[parcourId] || [];

  if (checked) {
    if (!parcourProgress.includes(moduleIndex)) {
      parcourProgress.push(moduleIndex);
    }
  } else {
    parcourProgress = parcourProgress.filter(i => i !== moduleIndex);
  }

  allProgress[parcourId] = parcourProgress;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
}

function updateProgress(parcourId, checkboxes, progressBar, progressTrack, progressPercentage) {
  const total = checkboxes.length;
  const completed = Array.from(checkboxes).filter(cb => cb.checked).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (progressBar) {
    progressBar.style.width = `${percentage}%`;
  }

  if (progressTrack) {
    progressTrack.setAttribute('aria-valuenow', String(completed));
  }

  if (progressPercentage) {
    progressPercentage.textContent = `${percentage}%`;
  }
}

function resetProgress(parcourId) {
  const allProgress = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  delete allProgress[parcourId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
}

function updateParcourCards() {
  const cards = document.querySelectorAll('.parcour-card');
  const allProgress = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

  cards.forEach(card => {
    const parcourId = card.dataset.parcourId;
    const progressBarFill = card.querySelector('.progress-bar-fill');
    const progressText = card.querySelector('.progress-text');
    const moduleCount = parseInt(card.dataset.moduleCount) || 0;

    if (allProgress[parcourId] && moduleCount > 0) {
      const completed = allProgress[parcourId].length;
      const percentage = Math.round((completed / moduleCount) * 100);

      if (progressBarFill) {
        progressBarFill.style.width = `${percentage}%`;
      }
      if (progressText) {
        progressText.textContent = `${percentage}%`;
      }

      // Update CTA text if progress exists
      const cta = card.querySelector('.parcour-cta');
      if (cta && percentage > 0 && percentage < 100) {
        cta.innerHTML = `Continuer <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;
      } else if (cta && percentage === 100) {
        cta.innerHTML = `Revoir <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;
      }
    }
  });
}

// Exposer globalement pour usage dans d'autres scripts
window.CLAIIRE = window.CLAIIRE || {};
window.CLAIIRE.parcours = {
  initParcourTracker,
  loadProgress,
  saveProgress,
  resetProgress,
};
